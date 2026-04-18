from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List

class AuditLogResponse(BaseModel):
    id: int
    user_id: Optional[int]
    username: Optional[str]
    user_full_name: Optional[str]
    action_type: str
    entity_name: str
    entity_id: Optional[int]
    old_values: Optional[str]
    new_values: Optional[str]
    description: str
    ip_address: Optional[str]
    action_date: datetime
    
    class Config:
        from_attributes = True

class AuditLogListResponse(BaseModel):
    items: List[AuditLogResponse]
    total: int
    page: int
    size: int
    pages: int