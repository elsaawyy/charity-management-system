from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_, func
from typing import Optional, List
from datetime import date, datetime
from decimal import Decimal

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User, Case, Aid, AidType
from app.schemas.aid import AidCreate, AidUpdate, AidResponse, AidListResponse, AidReceiptResponse
from app.services.audit_service import create_audit_log

router = APIRouter(tags=["Aids"])

# ============ IMPORTANT: Specific routes FIRST ============

@router.get("/aids/types")
def get_aid_types(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all aid types (MUST be before /aids/{aid_id})"""
    types = db.query(AidType).filter(AidType.is_deleted == False).all()
    return [{"id": t.id, "name": t.name, "category": t.category} for t in types]


@router.get("/aids", response_model=AidListResponse)
def list_aids(
    page: int = Query(1, ge=1),
    size: int = Query(10, ge=1, le=100),
    search: Optional[str] = None,
    aid_type_id: Optional[int] = None,
    case_id: Optional[int] = None,
    registered_by_user_id: Optional[int] = None,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    min_amount: Optional[float] = None,
    max_amount: Optional[float] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(Aid).filter(Aid.is_deleted == False)
    
    # Apply filters
    if search:
        query = query.join(Case).filter(
            or_(
                Case.file_number.ilike(f"%{search}%"),
                Case.full_name.ilike(f"%{search}%"),
                Aid.quantity_or_description.ilike(f"%{search}%")
            )
        )
    
    if aid_type_id:
        query = query.filter(Aid.aid_type_id == aid_type_id)
    
    if case_id:
        query = query.filter(Aid.case_id == case_id)
    
    if registered_by_user_id:
        query = query.filter(Aid.registered_by_user_id == registered_by_user_id)
    
    if start_date:
        query = query.filter(Aid.aid_date >= start_date)
    
    if end_date:
        query = query.filter(Aid.aid_date <= end_date)
    
    if min_amount:
        query = query.filter(Aid.amount >= min_amount)
    
    if max_amount:
        query = query.filter(Aid.amount <= max_amount)
    
    total = query.count()
    items = query.order_by(Aid.created_at.desc()).offset((page - 1) * size).limit(size).all()
    
    # Enrich with related data
    result_items = []
    for aid in items:
        case = db.query(Case).filter(Case.id == aid.case_id).first()
        aid_type = db.query(AidType).filter(AidType.id == aid.aid_type_id).first()
        registered_by = db.query(User).filter(User.id == aid.registered_by_user_id).first()
        
        aid_dict = AidResponse.model_validate(aid).model_dump()
        aid_dict['case_file_number'] = case.file_number if case else None
        aid_dict['case_full_name'] = case.full_name if case else None
        aid_dict['aid_type_name'] = aid_type.name if aid_type else None
        aid_dict['aid_type_category'] = aid_type.category if aid_type else None
        aid_dict['registered_by_name'] = registered_by.full_name if registered_by else None
        result_items.append(AidResponse(**aid_dict))
    
    return {
        "items": result_items,
        "total": total,
        "page": page,
        "size": size,
        "pages": (total + size - 1) // size
    }


@router.post("/aids", response_model=AidResponse)
def create_aid(
    aid_data: AidCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Add debug print
    print("=" * 50)
    print("Received aid data:", aid_data)
    print("aid_data dict:", aid_data.model_dump())
    print("=" * 50)
    
    # Verify case exists
    case = db.query(Case).filter(Case.id == aid_data.case_id, Case.is_deleted == False).first()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    
    # Verify aid type exists
    aid_type = db.query(AidType).filter(AidType.id == aid_data.aid_type_id, AidType.is_deleted == False).first()
    if not aid_type:
        raise HTTPException(status_code=404, detail="Aid type not found")
    
    # Validate financial aid has amount
    if aid_type.category == "Financial" and not aid_data.amount:
        raise HTTPException(status_code=400, detail="Financial aid must have an amount")
    
    aid = Aid(**aid_data.model_dump(), registered_by_user_id=current_user.id)
    db.add(aid)
    db.commit()
    db.refresh(aid)
    
    create_audit_log(
        db=db,
        user_id=current_user.id,
        action_type="CREATE",
        entity_name="Aid",
        entity_id=aid.id,
        description=f"Created aid for case {case.file_number}",
        ip_address="127.0.0.1"
    )
    
    return get_aid(aid.id, db, current_user)



@router.get("/aids/{aid_id}/receipt")
def get_aid_receipt(
    aid_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    aid = db.query(Aid).filter(Aid.id == aid_id, Aid.is_deleted == False).first()
    if not aid:
        raise HTTPException(status_code=404, detail="Aid not found")
    
    case = db.query(Case).filter(Case.id == aid.case_id).first()
    aid_type = db.query(AidType).filter(AidType.id == aid.aid_type_id).first()
    registered_by = db.query(User).filter(User.id == aid.registered_by_user_id).first()
    
    receipt_data = AidReceiptResponse(
        receipt_number=f"REC-{aid.id}-{aid.created_at.strftime('%Y%m%d')}",
        receipt_date=aid.aid_date,
        case_name=case.full_name,
        case_file_number=case.file_number,
        case_phone=case.phone_number_1,
        case_address=case.street_address,
        aid_type=aid_type.name,
        aid_type_category=aid_type.category,
        amount=aid.amount,
        quantity_or_description=aid.quantity_or_description,
        registered_by=registered_by.full_name
    )
    
    return receipt_data


# ============ Dynamic routes LAST (with {aid_id}) ============

@router.get("/aids/{aid_id}", response_model=AidResponse)
def get_aid(
    aid_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    aid = db.query(Aid).filter(Aid.id == aid_id, Aid.is_deleted == False).first()
    if not aid:
        raise HTTPException(status_code=404, detail="Aid not found")
    
    case = db.query(Case).filter(Case.id == aid.case_id).first()
    aid_type = db.query(AidType).filter(AidType.id == aid.aid_type_id).first()
    registered_by = db.query(User).filter(User.id == aid.registered_by_user_id).first()
    
    result = AidResponse.model_validate(aid).model_dump()
    result['case_file_number'] = case.file_number if case else None
    result['case_full_name'] = case.full_name if case else None
    result['aid_type_name'] = aid_type.name if aid_type else None
    result['aid_type_category'] = aid_type.category if aid_type else None
    result['registered_by_name'] = registered_by.full_name if registered_by else None
    
    return AidResponse(**result)


@router.put("/aids/{aid_id}", response_model=AidResponse)
def update_aid(
    aid_id: int,
    aid_data: AidUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    aid = db.query(Aid).filter(Aid.id == aid_id, Aid.is_deleted == False).first()
    if not aid:
        raise HTTPException(status_code=404, detail="Aid not found")
    
    for key, value in aid_data.model_dump(exclude_unset=True).items():
        setattr(aid, key, value)
    
    db.commit()
    db.refresh(aid)
    
    create_audit_log(
        db=db,
        user_id=current_user.id,
        action_type="UPDATE",
        entity_name="Aid",
        entity_id=aid.id,
        description=f"Updated aid {aid.id}",
        ip_address="127.0.0.1"
    )
    
    return get_aid(aid.id, db, current_user)


@router.delete("/aids/{aid_id}")
def delete_aid(
    aid_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    aid = db.query(Aid).filter(Aid.id == aid_id, Aid.is_deleted == False).first()
    if not aid:
        raise HTTPException(status_code=404, detail="Aid not found")
    
    aid.is_deleted = True
    db.commit()
    
    create_audit_log(
        db=db,
        user_id=current_user.id,
        action_type="DELETE",
        entity_name="Aid",
        entity_id=aid.id,
        description=f"Deleted aid {aid.id}",
        ip_address="127.0.0.1"
    )
    
    return {"message": "Aid deleted successfully"}