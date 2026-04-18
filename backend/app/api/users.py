from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import Optional, List

from app.core.database import get_db
from app.core.security import get_current_user, get_password_hash, require_admin
from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate, UserResponse, UserListResponse
from app.services.audit_service import create_audit_log

router = APIRouter(tags=["Users"])




@router.put("/users/profile")
def update_profile(
    profile_data: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if "full_name" in profile_data:
        current_user.full_name = profile_data["full_name"]
    if "email" in profile_data:
        # Check if email exists for another user
        existing = db.query(User).filter(
            User.email == profile_data["email"],
            User.id != current_user.id
        ).first()
        if existing:
            raise HTTPException(status_code=400, detail="Email already exists")
        current_user.email = profile_data["email"]
    
    db.commit()
    db.refresh(current_user)
    
    return current_user

@router.put("/users/change-password")
def change_password(
    password_data: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    from app.core.security import verify_password, get_password_hash
    
    # Debug prints
    print(f"Changing password for user ID: {current_user.id}")
    print(f"Received data: {password_data}")
    
    if not verify_password(password_data["current_password"], current_user.hashed_password):
        raise HTTPException(status_code=400, detail="Current password is incorrect")
    
    if len(password_data["new_password"]) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters")
    
    current_user.hashed_password = get_password_hash(password_data["new_password"])
    db.commit()
    
    return {"message": "Password changed successfully"}




@router.get("/users", response_model=UserListResponse)
def list_users(
    page: int = Query(1, ge=1),
    size: int = Query(10, ge=1, le=100),
    search: Optional[str] = None,
    role: Optional[str] = None,
    is_active: Optional[bool] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    query = db.query(User).filter(User.is_deleted == False)
    
    if search:
        query = query.filter(
            or_(
                User.username.ilike(f"%{search}%"),
                User.full_name.ilike(f"%{search}%"),
                User.email.ilike(f"%{search}%")
            )
        )
    
    if role:
        query = query.filter(User.role == role)
    
    if is_active is not None:
        query = query.filter(User.is_active == is_active)
    
    total = query.count()
    items = query.order_by(User.created_at.desc()).offset((page - 1) * size).limit(size).all()
    
    return {
        "items": items,
        "total": total,
        "page": page,
        "size": size,
        "pages": (total + size - 1) // size
    }

@router.get("/users/{user_id}", response_model=UserResponse)
def get_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    user = db.query(User).filter(User.id == user_id, User.is_deleted == False).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.post("/users", response_model=UserResponse)
def create_user(
    user_data: UserCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    # Convert role to string if it's an enum
    role_value = user_data.role
    if hasattr(role_value, 'value'):
        role_value = role_value.value
    
    print("=" * 60)
    print(f"Username: '{user_data.username}'")
    print(f"Email: '{user_data.email}'")
    print(f"Full name: '{user_data.full_name}'")
    print(f"Role: '{role_value}'")
    print(f"Is active: {user_data.is_active}")
    print("=" * 60)
    
    # Check if username exists
    existing = db.query(User).filter(User.username == user_data.username).first()
    if existing:
        raise HTTPException(status_code=400, detail="Username already exists")
    
    # Check if email exists
    existing_email = db.query(User).filter(User.email == user_data.email).first()
    if existing_email:
        raise HTTPException(status_code=400, detail="Email already exists")
    
    # Create user with string role
    user = User(
        username=user_data.username,
        email=user_data.email,
        full_name=user_data.full_name,
        hashed_password=get_password_hash(user_data.password),
        role=role_value,  # Use the string value
        is_active=user_data.is_active
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    
    return user

@router.put("/users/{user_id}", response_model=UserResponse)
def update_user(
    user_id: int,
    user_data: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    user = db.query(User).filter(User.id == user_id, User.is_deleted == False).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Check username uniqueness
    if user_data.username and user_data.username != user.username:
        existing = db.query(User).filter(User.username == user_data.username).first()
        if existing:
            raise HTTPException(status_code=400, detail="Username already exists")
        user.username = user_data.username
    
    # Check email uniqueness
    if user_data.email and user_data.email != user.email:
        existing = db.query(User).filter(User.email == user_data.email).first()
        if existing:
            raise HTTPException(status_code=400, detail="Email already exists")
        user.email = user_data.email
    
    if user_data.full_name:
        user.full_name = user_data.full_name
    
    if user_data.role:
        user.role = user_data.role
    
    if user_data.is_active is not None:
        user.is_active = user_data.is_active
    
    if user_data.password:
        user.hashed_password = get_password_hash(user_data.password)
    
    db.commit()
    db.refresh(user)
    
    create_audit_log(
        db=db,
        user_id=current_user.id,
        action_type="UPDATE_USER",
        entity_name="User",
        entity_id=user.id,
        description=f"Updated user {user.username}",
        ip_address="127.0.0.1"
    )
    
    return user

@router.delete("/users/{user_id}")
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    # Prevent deleting yourself
    if user_id == current_user.id:
        raise HTTPException(status_code=400, detail="Cannot delete your own account")
    
    user = db.query(User).filter(User.id == user_id, User.is_deleted == False).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user.is_deleted = True
    db.commit()
    
    create_audit_log(
        db=db,
        user_id=current_user.id,
        action_type="DELETE_USER",
        entity_name="User",
        entity_id=user.id,
        description=f"Deleted user {user.username}",
        ip_address="127.0.0.1"
    )
    
    return {"message": "User deleted successfully"}



