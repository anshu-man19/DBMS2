# CDC Placement Portal

Production-ready placement portal with a Laravel backend and Next.js frontend.

## Structure

- `frontend/` Next.js App Router UI with MUI, NextAuth, and React Hook Form.
- `backend/` Laravel API with token auth, dashboards, notifications, and submission workflows.
- `docs/` Setup and usage documentation.

## Run locally

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

## Tests

```bash
cd backend
php artisan test
```

```bash
cd frontend
npm run test:e2e
```
