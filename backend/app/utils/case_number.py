from datetime import datetime
from sqlalchemy.orm import Session
from app.models.user import Case

def generate_case_number(db: Session) -> str:
    """Generate unique case number in format CASE-YYYYMMDD-XXXXX"""
    today = datetime.now().strftime("%Y%m%d")
    prefix = f"CASE-{today}-"
    
    # Get the last case number for today
    last_case = db.query(Case).filter(
        Case.file_number.like(f"{prefix}%")
    ).order_by(Case.file_number.desc()).first()
    
    if last_case:
        last_number = int(last_case.file_number.split("-")[-1])
        new_number = last_number + 1
    else:
        new_number = 1
    
    return f"{prefix}{new_number:05d}"