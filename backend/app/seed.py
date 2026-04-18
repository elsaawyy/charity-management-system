"""
Seed script — runs on every container start.
Safe to re-run: uses get-or-create logic.
"""
import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.database import SessionLocal
from app.core.security import get_password_hash
from app.core.config import settings
from app.models.user import User, AidType, SystemSetting


def seed():
    db = SessionLocal()
    try:
        # ── Admin user ────────────────────────────────────────────────────
        if not db.query(User).filter(User.username == settings.FIRST_SUPERUSER).first():
            db.add(User(
                username=settings.FIRST_SUPERUSER,
                email=settings.FIRST_SUPERUSER_EMAIL,
                full_name="مدير النظام",
                hashed_password=get_password_hash(settings.FIRST_SUPERUSER_PASSWORD),
                role="Admin",
                is_active=True,
            ))
            print(f"✓ Admin created: {settings.FIRST_SUPERUSER}")

        # ── Aid types ─────────────────────────────────────────────────────
        for at in [
            {"name": "مساعدات مالية",  "category": "Financial", "description": "مساعدات مالية نقدية"},
            {"name": "مساعدات عينية",  "category": "InKind",    "description": "مساعدات عينية وسلع"},
            {"name": "مساعدات موسمية", "category": "Seasonal",  "description": "مساعدات المناسبات والمواسم"},
        ]:
            if not db.query(AidType).filter(AidType.name == at["name"], AidType.is_deleted == False).first():
                db.add(AidType(**at))
                print(f"✓ Aid type: {at['name']}")

        # ── System settings ───────────────────────────────────────────────
        for s in [
            {"setting_key": "site_name",        "setting_value": "نظام إدارة الحالات الخيرية",               "setting_type": "string",  "category": "general"},
            {"setting_key": "site_description", "setting_value": "نظام متكامل لإدارة الحالات والمساعدات الخيرية", "setting_type": "string",  "category": "general"},
            {"setting_key": "contact_email",    "setting_value": "info@charity.org",                          "setting_type": "string",  "category": "general"},
            {"setting_key": "items_per_page",   "setting_value": "10",                                        "setting_type": "integer", "category": "general"},
            {"setting_key": "audit_retention_days", "setting_value": "90",                                    "setting_type": "integer", "category": "audit"},
        ]:
            if not db.query(SystemSetting).filter(SystemSetting.setting_key == s["setting_key"]).first():
                db.add(SystemSetting(**s))
                print(f"✓ Setting: {s['setting_key']}")

        db.commit()
        print("\n✅ Seed completed.")
    except Exception as e:
        db.rollback()
        print(f"\n❌ Seed failed: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed()
