from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from decimal import Decimal

class WorkRecordBase(BaseModel):
    person_type: str  # Father, Mother, Beneficiary
    employer_name: Optional[str] = None
    employer_address: Optional[str] = None
    employer_phone: Optional[str] = None
    job_title: Optional[str] = None
    monthly_salary: Optional[Decimal] = None

class WorkRecordCreate(WorkRecordBase):
    pass

class WorkRecordUpdate(BaseModel):
    person_type: Optional[str] = None
    employer_name: Optional[str] = None
    employer_address: Optional[str] = None
    employer_phone: Optional[str] = None
    job_title: Optional[str] = None
    monthly_salary: Optional[Decimal] = None

class WorkRecordResponse(WorkRecordBase):
    id: int
    case_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True