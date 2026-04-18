from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql://charity_user:charity_pass@localhost:5432/charity_cms"
    SECRET_KEY: str = "change-this-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    FIRST_SUPERUSER: str = "admin"
    FIRST_SUPERUSER_PASSWORD: str = "Admin@123"
    FIRST_SUPERUSER_EMAIL: str = "admin@charity.org"
    ENVIRONMENT: str = "development"
    PROJECT_NAME: str = "نظام إدارة الحالات الخيرية"
    API_PREFIX: str = "/api"

    class Config:
        env_file = ".env"
        extra = "ignore"


settings = Settings()
