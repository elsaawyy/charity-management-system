from pydantic import BaseModel
from typing import Optional, Dict, Any

class SystemSettingResponse(BaseModel):
    id: int
    setting_key: str
    setting_value: str
    description: Optional[str]
    setting_type: str
    category: str
    
    class Config:
        from_attributes = True

class SystemSettingUpdate(BaseModel):
    setting_value: str

class SystemSettingsGroup(BaseModel):
    general: Dict[str, str] = {}
    notifications: Dict[str, str] = {}
    security: Dict[str, str] = {}
    audit: Dict[str, str] = {}