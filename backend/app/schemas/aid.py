from pydantic import BaseModel, Field, validator
from datetime import date, datetime
from decimal import Decimal
from typing import Optional, List
from enum import Enum

class AidCategory(str, Enum):
    FINANCIAL = "Financial"
    INKIND = "InKind"
    SEASONAL = "Seasonal"

class AidStatus(str, Enum):
    ACTIVE = "Active"
    DELETED = "Deleted"

class AidBase(BaseModel):
    case_id: int
    aid_type_id: int
    aid_date: date = Field(default_factory=date.today)
    amount: Optional[Decimal] = None
    quantity_or_description: Optional[str] = None
    notes: Optional[str] = None
    status: AidStatus = AidStatus.ACTIVE

class AidCreate(AidBase):
    # Remove registered_by_user_id from here - it will be set by backend
    pass

class AidUpdate(BaseModel):
    aid_type_id: Optional[int] = None
    aid_date: Optional[date] = None
    amount: Optional[Decimal] = None
    quantity_or_description: Optional[str] = None
    notes: Optional[str] = None
    status: Optional[AidStatus] = None

class AidResponse(AidBase):
    id: int
    registered_by_user_id: int
    registered_by_name: Optional[str] = None
    case_file_number: Optional[str] = None
    case_full_name: Optional[str] = None
    aid_type_name: Optional[str] = None
    aid_type_category: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

class AidListResponse(BaseModel):
    items: List[AidResponse]
    total: int
    page: int
    size: int
    pages: int

class AidReceiptResponse(BaseModel):
    receipt_number: str
    receipt_date: date
    case_name: str
    case_file_number: str
    case_phone: str
    case_address: Optional[str]
    aid_type: str
    aid_type_category: str
    amount: Optional[Decimal] = None
    quantity_or_description: Optional[str] = None
    registered_by: str
    organization_name: str = "نظام إدارة الحالات الخيرية"
    organization_phone: str = "0123456789"
    organization_email: str = "info@charity.org"