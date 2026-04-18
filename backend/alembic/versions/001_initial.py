"""Initial schema

Revision ID: 001_initial
Revises:
Create Date: 2024-01-01 00:00:00
"""
from alembic import op
import sqlalchemy as sa

revision = "001_initial"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table("users",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("username", sa.String(50), nullable=False, unique=True),
        sa.Column("email", sa.String(100), nullable=False, unique=True),
        sa.Column("full_name", sa.String(200), nullable=False),
        sa.Column("hashed_password", sa.String(256), nullable=False),
        sa.Column("role", sa.String(20), nullable=False, server_default="Staff"),
        sa.Column("is_active", sa.Boolean(), server_default=sa.true()),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True)),
        sa.Column("is_deleted", sa.Boolean(), server_default=sa.false()),
    )
    op.create_index("ix_users_username", "users", ["username"])

    op.create_table("cases",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("file_number", sa.String(50), nullable=False, unique=True),
        sa.Column("full_name", sa.String(200), nullable=False),
        sa.Column("phone_number_1", sa.String(50), nullable=False),
        sa.Column("phone_number_2", sa.String(50)),
        sa.Column("country", sa.String(100)),
        sa.Column("city", sa.String(100), nullable=False),
        sa.Column("street_address", sa.String(200)),
        sa.Column("notes", sa.Text()),
        sa.Column("housing_type", sa.String(50), nullable=False),
        sa.Column("join_date", sa.Date(), nullable=False),
        sa.Column("family_income", sa.Numeric(18, 2), server_default="0"),
        sa.Column("property_rental_income", sa.Numeric(18, 2), server_default="0"),
        sa.Column("other_income", sa.Numeric(18, 2), server_default="0"),
        sa.Column("receives_government_aid", sa.Boolean(), server_default=sa.false()),
        sa.Column("government_aid_organization", sa.String(200)),
        sa.Column("is_parent_deceased", sa.Boolean(), server_default=sa.false()),
        sa.Column("death_certificate_path", sa.String(500)),
        sa.Column("death_certificate_image", sa.Text()),
        sa.Column("is_monthly_aid", sa.Boolean(), server_default=sa.false()),
        sa.Column("monthly_aid_amount", sa.Numeric(18, 2)),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True)),
        sa.Column("is_deleted", sa.Boolean(), server_default=sa.false()),
    )
    op.create_index("ix_cases_file_number", "cases", ["file_number"])
    op.create_index("ix_cases_full_name", "cases", ["full_name"])
    op.create_index("ix_cases_city", "cases", ["city"])

    op.create_table("family_members",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("case_id", sa.Integer(), sa.ForeignKey("cases.id", ondelete="CASCADE"), nullable=False),
        sa.Column("name", sa.String(200), nullable=False),
        sa.Column("age", sa.Integer()),
        sa.Column("marital_status", sa.String(50)),
        sa.Column("school_or_university", sa.String(200)),
        sa.Column("relationship", sa.String(50), nullable=False),
        sa.Column("notes", sa.Text()),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True)),
        sa.Column("is_deleted", sa.Boolean(), server_default=sa.false()),
    )

    op.create_table("work_records",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("case_id", sa.Integer(), sa.ForeignKey("cases.id", ondelete="CASCADE"), nullable=False),
        sa.Column("person_type", sa.String(50), nullable=False),
        sa.Column("employer_name", sa.String(200)),
        sa.Column("employer_address", sa.String(300)),
        sa.Column("employer_phone", sa.String(50)),
        sa.Column("job_title", sa.String(200)),
        sa.Column("monthly_salary", sa.Numeric(18, 2)),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True)),
        sa.Column("is_deleted", sa.Boolean(), server_default=sa.false()),
    )

    op.create_table("aid_types",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("name", sa.String(100), nullable=False),
        sa.Column("category", sa.String(50), nullable=False),
        sa.Column("description", sa.Text()),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True)),
        sa.Column("is_deleted", sa.Boolean(), server_default=sa.false()),
    )

    op.create_table("aids",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("case_id", sa.Integer(), sa.ForeignKey("cases.id"), nullable=False),
        sa.Column("aid_type_id", sa.Integer(), sa.ForeignKey("aid_types.id"), nullable=False),
        sa.Column("registered_by_user_id", sa.Integer(), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("aid_date", sa.Date(), nullable=False),
        sa.Column("amount", sa.Numeric(18, 2)),
        sa.Column("quantity_or_description", sa.String(500)),
        sa.Column("status", sa.String(50), server_default="Active"),
        sa.Column("notes", sa.Text()),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True)),
        sa.Column("is_deleted", sa.Boolean(), server_default=sa.false()),
    )

    op.create_table("monthly_aid_cycles",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("year", sa.Integer(), nullable=False),
        sa.Column("month", sa.Integer(), nullable=False),
        sa.Column("status", sa.String(20), nullable=False, server_default="Closed"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True)),
        sa.Column("is_deleted", sa.Boolean(), server_default=sa.false()),
        sa.UniqueConstraint("year", "month", name="uq_cycle_year_month"),
    )

    op.create_table("monthly_aid_transactions",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("monthly_aid_cycle_id", sa.Integer(), sa.ForeignKey("monthly_aid_cycles.id"), nullable=False),
        sa.Column("case_id", sa.Integer(), sa.ForeignKey("cases.id"), nullable=False),
        sa.Column("delivered_by_user_id", sa.Integer(), sa.ForeignKey("users.id")),
        sa.Column("monthly_amount", sa.Numeric(18, 2), nullable=False),
        sa.Column("status", sa.String(20), nullable=False, server_default="Pending"),
        sa.Column("delivered_date", sa.Date()),
        sa.Column("notes", sa.Text()),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True)),
        sa.Column("is_deleted", sa.Boolean(), server_default=sa.false()),
        sa.UniqueConstraint("monthly_aid_cycle_id", "case_id", name="uq_txn_cycle_case"),
    )

    op.create_table("audit_logs",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id")),
        sa.Column("action_date", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("action_type", sa.String(100), nullable=False),
        sa.Column("entity_name", sa.String(200), nullable=False),
        sa.Column("entity_id", sa.Integer()),
        sa.Column("old_values", sa.Text()),
        sa.Column("new_values", sa.Text()),
        sa.Column("description", sa.Text()),
        sa.Column("ip_address", sa.String(50)),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )

    op.create_table("system_settings",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("setting_key", sa.String(100), nullable=False, unique=True),
        sa.Column("setting_value", sa.Text()),
        sa.Column("description", sa.Text()),
        sa.Column("setting_type", sa.String(50)),
        sa.Column("category", sa.String(200)),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True)),
    )


def downgrade() -> None:
    for table in [
        "system_settings", "audit_logs", "monthly_aid_transactions",
        "monthly_aid_cycles", "aids", "aid_types", "work_records",
        "family_members", "cases", "users",
    ]:
        op.drop_table(table)
