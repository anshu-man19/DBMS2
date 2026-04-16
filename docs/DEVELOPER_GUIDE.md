# Developer Guide

## Architecture

- `frontend/` is a Next.js App Router application.
- `backend/` is a Laravel 12 API.
- The backend exposes versioned routes under `/api/v1`.
- Auth uses a bearer token issued by the backend and consumed by NextAuth.
- JNF and INF forms store shared detail sections in relational tables.
- Notifications and email delivery are recorded through backend services.

## Key API Groups

- Auth: `/api/v1/auth/login`, `/api/v1/auth/logout`, `/api/v1/auth/user`, `/api/v1/auth/company/register`, `/api/v1/auth/admin/register`
- Notifications: `/api/v1/auth/notifications`, `/api/v1/auth/notifications/{id}/read`, `/api/v1/auth/notifications/read-all`
- Company: `/api/v1/company/dashboard`, `/api/v1/company/profile`, `/api/v1/company/uploads`, `/api/v1/company/jnfs`, `/api/v1/company/infs`
- Admin: `/api/v1/admin/dashboard`, `/api/v1/admin/jnfs`, `/api/v1/admin/infs`, `/api/v1/admin/companies`

## Local Setup

Backend:

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

Frontend:

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

## Testing

Backend:

```bash
cd backend
php artisan test
```

Frontend:

```bash
cd frontend
npm run test:e2e
```

## Notes

- Ensure `NEXT_PUBLIC_BACKEND_API_URL` points to the Laravel API.
- Use `php artisan storage:link` before serving uploaded files.
- The admin registration endpoint requires `ADMIN_REGISTER_SECRET`.
