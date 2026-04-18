from sqlalchemy.orm import Session
from app.models.user import AuditLog
from datetime import datetime

def create_audit_log(
    db: Session,
    user_id: int,
    action_type: str,
    entity_name: str,
    entity_id: int,
    description: str,
    ip_address: str,
    old_values: str = None,
    new_values: str = None
):
    log = AuditLog(
        user_id=user_id,
        action_type=action_type,
        entity_name=entity_name,
        entity_id=entity_id,
        old_values=old_values,
        new_values=new_values,
        description=description,
        ip_address=ip_address,
        action_date=datetime.now()
    )
    db.add(log)
    db.commit()