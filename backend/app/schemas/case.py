from pydantic import BaseModel, Field, validator
from datetime import date, datetime
from decimal import Decimal
from typing import Optional, List
from enum import Enum

class HousingType(str, Enum):
    OWNED = "ملك"
    RENTED = "إيجار"
    OTHER = "غير ذلك"

class CaseBase(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=200)
    phone_number_1: str = Field(..., min_length=5, max_length=50)
    phone_number_2: Optional[str] = None
    country: Optional[str] = None
    city: str
    street_address: Optional[str] = None
    notes: Optional[str] = None
    housing_type: HousingType
    join_date: date
    family_income: Decimal = Decimal(0)
    property_rental_income: Decimal = Decimal(0)
    other_income: Decimal = Decimal(0)
    receives_government_aid: bool = False
    government_aid_organization: Optional[str] = None
    is_parent_deceased: bool = False
    is_monthly_aid: bool = False
    monthly_aid_amount: Optional[Decimal] = None

    @validator('monthly_aid_amount')
    def validate_monthly_amount(cls, v, values):
        if values.get('is_monthly_aid') and (v is None or v <= 0):
            raise ValueError('Monthly aid amount is required when monthly aid is enabled')
        return v

class CaseCreate(CaseBase):
    pass

class CaseUpdate(BaseModel):
    full_name: Optional[str] = None
    phone_number_1: Optional[str] = None
    phone_number_2: Optional[str] = None
    country: Optional[str] = None
    city: Optional[str] = None
    street_address: Optional[str] = None
    notes: Optional[str] = None
    housing_type: Optional[HousingType] = None
    join_date: Optional[date] = None
    family_income: Optional[Decimal] = None
    property_rental_income: Optional[Decimal] = None
    other_income: Optional[Decimal] = None
    receives_government_aid: Optional[bool] = None
    government_aid_organization: Optional[str] = None
    is_parent_deceased: Optional[bool] = None
    is_monthly_aid: Optional[bool] = None
    monthly_aid_amount: Optional[Decimal] = None

class CaseResponse(CaseBase):
    id: int
    file_number: str
    created_at: datetime
    updated_at: Optional[datetime] = None
    total_income: Decimal = Decimal(0)
    
    class Config:
        from_attributes = True

class CaseListResponse(BaseModel):
    items: List[CaseResponse]
    total: int
    page: int
    size: int
    pages: int