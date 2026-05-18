# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # start dev server with hot reload (ts-node + nodemon)
npm run build        # compile TypeScript to dist/
npm run start        # run compiled output
npm run db:migrate   # run SQL migration against MySQL (requires MySQL CLI)
npx tsc --noEmit     # type-check without emitting
```

## Architecture

MVC pattern — Node.js / Express / TypeScript / MySQL.

```
src/
├── app.ts                        # Express app entry: middleware, routes, error handlers
├── config/
│   ├── database.ts               # mysql2 connection pool
│   └── migrations/001_init.sql   # DB schema (users, students, teachers, subjects, classes, grades)
├── types/index.ts                # Shared interfaces (Student, Teacher, Grade, User, AuthRequest)
├── middleware/
│   ├── auth.ts                   # JWT authenticate + role-based authorize
│   └── errorHandler.ts           # Global error handler + 404 handler
├── models/          # Raw SQL via mysql2 pool — no ORM
├── controllers/     # Thin: call model, return JSON
└── routes/          # Express Router per resource, applies middleware
```

## Key conventions

- Models do raw SQL with `mysql2/promise` pool. No ORM.
- Controllers are thin — call model, send response, no business logic.
- Auth middleware: `authenticate` verifies JWT, `authorize(...roles)` checks role.
- `AuthRequest` extends `Request` to carry `req.user = { id, role }`.
- All controller functions are `async` and return `Promise<void>` — unhandled rejections bubble to `errorHandler`.

## Database setup

1. Copy `.env.example` to `.env` and fill `DB_PASSWORD`.
2. Run `npm run db:migrate` to create `school_db` and all tables.
3. Schema: `users` → auth; `teachers` → `subjects`; `students` → `classes`; `grades` → join of students + subjects.

## API routes

| Method | Path | Auth | Role |
|--------|------|------|------|
| POST | `/api/auth/login` | — | — |
| POST | `/api/auth/register` | — | — |
| GET/GET | `/api/students`, `/api/students/:id` | JWT | any |
| POST/PUT | `/api/students` | JWT | admin, teacher |
| DELETE | `/api/students/:id` | JWT | admin |
| GET/GET | `/api/teachers`, `/api/teachers/:id` | JWT | any |
| POST/PUT/DELETE | `/api/teachers` | JWT | admin |
| GET | `/api/grades/student/:studentId` | JWT | any |
| POST/PUT | `/api/grades` | JWT | admin, teacher |
| DELETE | `/api/grades/:id` | JWT | admin |
