# API Reference

Base URL: `/api/v1`

## Auth

- `POST /auth/login`
- `POST /auth/logout`
- `GET /auth/user`
- `POST /auth/admin/register`
- `POST /auth/company/register`

## Notifications

- `GET /auth/notifications`
- `PATCH /auth/notifications/{id}/read`
- `PATCH /auth/notifications/read-all`

## Company

- `GET /company/dashboard`
- `GET /company/profile`
- `PUT /company/profile`
- `POST /company/uploads`
- `POST /company/jnfs/autosave`
- `POST /company/infs/autosave`
- `GET /company/jnfs`
- `POST /company/jnfs`
- `GET /company/jnfs/{id}`
- `PUT /company/jnfs/{id}`
- `DELETE /company/jnfs/{id}`
- `POST /company/jnfs/{id}/duplicate`
- `GET /company/infs`
- `POST /company/infs`
- `GET /company/infs/{id}`
- `PUT /company/infs/{id}`
- `DELETE /company/infs/{id}`
- `POST /company/infs/{id}/duplicate`

## Admin

- `GET /admin/dashboard`
- `GET /admin/jnfs`
- `GET /admin/jnfs/{id}`
- `PATCH /admin/jnfs/{id}/status`
- `GET /admin/infs`
- `GET /admin/infs/{id}`
- `PATCH /admin/infs/{id}/status`
- `GET /admin/companies`
- `GET /admin/companies/{id}`
- `PUT /admin/companies/{id}`
