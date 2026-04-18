from pydantic import BaseModel
from typing import Optional, List
from datetime import date, datetime
from decimal import Decimal

class DashboardStatsResponse(BaseModel):
    total_cases: int
    active_cases: int
    total_aids: int
    total_amount: float
    total_beneficiaries: int
    total_users: int
    monthly_aid_cases: int
    pending_deliveries: int
    recent_activities: List[dict]

class AidTypeDistributionResponse(BaseModel):
    name: str
    category: str
    count: int
    total_amount: float

class MonthlyStatsResponse(BaseModel):
    month: int
    aid_count: int
    aid_amount: float
    monthly_aid_cases: int

class TopBeneficiaryResponse(BaseModel):
    id: int
    full_name: str
    file_number: str
    aid_count: int
    total_amount: float

class CaseStatusResponse(BaseModel):
    active_cases: int
    monthly_aid_cases: int
    cases_with_aid: int
    cases_by_city: List[dict]

class ReportFilters(BaseModel):
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    report_type: str = "comprehensive"