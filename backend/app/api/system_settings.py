from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from typing import Optional, Dict

from app.core.database import get_db
from app.core.security import get_current_user, require_admin
from app.models.user import SystemSetting, User
from app.schemas.settings import SystemSettingResponse, SystemSettingUpdate, SystemSettingsGroup

router = APIRouter(tags=["Settings"])

@router.get("/settings", response_model=SystemSettingsGroup)
def get_settings(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    settings = db.query(SystemSetting).all()
    
    result = {
        "general": {},
        "notifications": {},
        "security": {},
        "audit": {}
    }
    
    for setting in settings:
        category = setting.category or "general"
        if category not in result:
            result[category] = {}
        result[category][setting.setting_key] = setting.setting_value
    
    return result

@router.put("/settings/{setting_key}")
def update_setting(
    setting_key: str,
    setting_data: SystemSettingUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    setting = db.query(SystemSetting).filter(SystemSetting.setting_key == setting_key).first()
    if not setting:
        raise HTTPException(status_code=404, detail="Setting not found")
    
    setting.setting_value = setting_data.setting_value
    db.commit()
    
    return {"message": "Setting updated successfully"}

@router.post("/settings/backup")
def backup_database(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    # This would trigger a database backup
    # For now, just return a success message
    return {"message": "Backup initiated successfully"}