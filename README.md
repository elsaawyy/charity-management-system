# نظام إدارة الحالات الخيرية
## Charity Case Management System

A production-ready, full-stack web application for managing charity beneficiary cases, tracking financial and in-kind aid, and running monthly financial assistance programs.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + TypeScript + Tailwind CSS |
| Backend | FastAPI (Python 3.11+) |
| Database | PostgreSQL 15 |
| ORM | SQLAlchemy 2.0 + Alembic migrations |
| Auth | JWT (HTTP-only cookies) + bcrypt |
| State | Zustand + TanStack Query |
| Container | Docker + Docker Compose |

---

## Quick Start (One Command)

```bash
# 1. Clone / unzip the project
cd charity-cms

# 2. Copy environment file
cp .env.example .env

# 3. Launch everything
docker-compose up -d
```

Then open **http://localhost:3000** in your browser.

Default credentials:
- **Username:** `admin`
- **Password:** `Admin@123`

---

## Project Structure

```
charity-cms/
├── docker-compose.yml          # Orchestrates all services
├── .env.example                # Environment variable template
│
├── backend/
│   ├── Dockerfile
│   ├── alembic.ini
│   ├── requirements.txt
│   ├── alembic/
│   │   ├── env.py
│   │   └── versions/
│   │       └── 001_initial.py  # Full schema migration
│   └── app/
│       ├── main.py             # FastAPI app entry point
│       ├── seed.py             # Initial data seeder
│       ├── core/
│       │   ├── config.py       # Settings (pydantic-settings)
│       │   ├── database.py     # SQLAlchemy engine + session
│       │   └── security.py     # JWT, bcrypt, auth dependencies
│       ├── models/
│       │   └── user.py         # All SQLAlchemy models
│       └── api/
│           └── auth.py         # Auth endpoints
│
└── frontend/
    ├── Dockerfile
    ├── nginx.conf              # SPA + API proxy config
    ├── index.html              # RTL Arabic entry point
    ├── package.json
    ├── vite.config.ts
    ├── tailwind.config.js
    └── src/
        ├── main.tsx            # React + QueryClient bootstrap
        ├── App.tsx             # Router + all routes
        ├── index.css           # Global styles + Tailwind layers
        ├── lib/
        │   ├── api.ts          # Axios client (JWT + redirect)
        │   └── utils.ts        # cn() helper
        ├── stores/
        │   └── authStore.ts    # Zustand auth store
        ├── components/
        │   ├── auth/
        │   │   └── ProtectedRoute.tsx
        │   └── layout/
        │       ├── AppLayout.tsx   # Main shell
        │       ├── Sidebar.tsx     # RTL navigation sidebar
        │       └── TopBar.tsx      # Header bar
        └── pages/
            ├── LoginPage.tsx
            ├── DashboardPage.tsx
            └── PlaceholderPage.tsx
```

---

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `POSTGRES_USER` | `charity_user` | DB username |
| `POSTGRES_PASSWORD` | `charity_pass` | DB password |
| `POSTGRES_DB` | `charity_cms` | DB name |
| `SECRET_KEY` | *(change this!)* | JWT signing key |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | `60` | Access token TTL |
| `REFRESH_TOKEN_EXPIRE_DAYS` | `7` | Refresh token TTL |
| `FIRST_SUPERUSER` | `admin` | Auto-created admin username |
| `FIRST_SUPERUSER_PASSWORD` | `Admin@123` | Auto-created admin password |
| `ENVIRONMENT` | `development` | `development` or `production` |
| `VITE_API_URL` | `http://localhost:8000` | Backend URL for frontend build |

> **Important:** Generate a real `SECRET_KEY` before going to production:
> ```bash
> python -c "import secrets; print(secrets.token_hex(32))"
> ```

---

## Database Schema (Phase 1)

All tables created by migration `001_initial.py`:

- `users` — system users with roles (Admin / Staff)
- `cases` — beneficiary cases with file number
- `family_members` — family members linked to cases
- `work_records` — employment records linked to cases
- `aid_types` — configurable aid categories
- `aids` — individual aid records
- `monthly_aid_cycles` — monthly program cycles (Open/Closed)
- `monthly_aid_transactions` — per-case delivery tracking
- `audit_logs` — full audit trail with IP addresses
- `system_settings` — key-value configuration store

---

## API Endpoints (Phase 1)

| Method | Path | Description |
|---|---|---|
| `POST` | `/api/auth/login` | Login, returns JWT + sets cookies |
| `POST` | `/api/auth/logout` | Clear cookies, audit log |
| `GET` | `/api/auth/me` | Get current user info |
| `POST` | `/api/auth/refresh` | Refresh access token |
| `GET` | `/health` | Health check |
| `GET` | `/docs` | Swagger UI |
| `GET` | `/redoc` | ReDoc UI |

---

## Development (Without Docker)

### Backend

```bash
cd backend

# Create virtualenv
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set env vars (or create a .env file)
export DATABASE_URL=postgresql://charity_user:charity_pass@localhost:5432/charity_cms
export SECRET_KEY=dev-secret-key

# Run migrations
alembic upgrade head

# Seed initial data
python -m app.seed

# Start dev server
uvicorn app.main:app --reload --port 8000
```

### Frontend

```bash
cd frontend

npm install
npm run dev     # → http://localhost:5173
```

---

## Build Phases

| Phase | Status | Description |
|---|---|---|
| **Phase 1** | ✅ Complete | Setup, Auth, Shell, Docker, DB, Seed |
| Phase 2 | 🔜 | Dashboard statistics & activity feed |
| Phase 3 | 🔜 | Full case management CRUD |
| Phase 4 | 🔜 | General aids + receipts |
| Phase 5 | 🔜 | Monthly aid cycles & delivery |
| Phase 6 | 🔜 | Reports & Excel export |
| Phase 7 | 🔜 | Admin: users, audit logs, settings |
| Phase 8 | 🔜 | Polish, responsive, testing |

---

## Initial Seed Data

Created automatically on first container start:

**Admin User**
- Username: `admin` / Password: `Admin@123`
- Full name: مدير النظام
- Role: Admin

**Aid Types**
- مساعدات مالية (Financial)
- مساعدات عينية (In-kind)
- مساعدات موسمية (Seasonal)

**System Settings**
- site_name, site_description, contact_email, items_per_page, audit_retention_days

---

## Security Notes

- Passwords are hashed with **bcrypt** (cost factor 12)
- JWTs stored in **HTTP-only cookies** (not localStorage)
- Cookies use `SameSite=Lax`; set `secure=True` in production
- All routes protected by FastAPI dependency injection
- Admin-only routes enforce role check at the router level
- Every login/logout event is recorded in `audit_logs`
