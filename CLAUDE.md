# CLAUDE.md — MedCare Clinic Management System

Guidance for Claude (and other AI coding assistants) working in this repository. Read this fully before making changes. Also read `SECURITY.md`: this system handles patient health information and billing data, so security rules here are not optional.

## What this project is

MedCare is a full-stack clinic management platform with four roles: **patient, doctor, receptionist, admin**.

- **Backend (`backend/`)**: Django 4+ with Django REST Framework, PostgreSQL, JWT auth via SimpleJWT. This is the most complete layer.
- **Frontend (`frontend/`)**: React 18 + TypeScript + Vite + Tailwind + React Router + Axios. Currently a role-based scaffold (auth pages, protected routes, placeholder dashboards) that still needs real API integration.

## Repository layout

```text
backend/
  MedCare/          # settings, root urls.py (API routing)
  users/            # custom user model (email login), roles, auth
  patients/         # Patient, MedicalHistory, LabResult
  doctors/          # Doctor, DoctorSchedule, DoctorAvailability, DoctorReview
  appointments/     # Appointment, AppointmentReschedule, AppointmentCancellation
  prescriptions/    # Prescription, PrescriptionItem
  billing/          # Invoice, Payment, BillingRecord
  notifications/    # Notification, EmailLog, SMSLog, NotificationTemplate
frontend/
  src/pages/auth/       # Login.tsx, Register.tsx
  src/routes/           # AppRoutes.tsx, ProtectedRoute.tsx
  src/services/         # authService.ts (Axios API clients live here)
```

Backend code is organized **by business domain**, not by technical layer. New features belong in the app that owns the domain; do not create cross-cutting "utils" dumping grounds.

## Commands

Backend (run from `backend/`):

```bash
python -m venv venv && source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env                              # Windows: copy .env.example .env
python manage.py migrate
python manage.py runserver                        # http://localhost:8000
python manage.py makemigrations <app>             # after model changes
python manage.py test                             # run tests
python manage.py check --deploy                   # production readiness check
```

Frontend (run from `frontend/`):

```bash
npm install
npm run dev                                       # http://localhost:5173
npm run build                                     # type-check + production build
```

Check `frontend/package.json` for the exact lint/test scripts before assuming they exist. There is currently no CI and little test coverage; do not claim something "passes" unless you actually ran it.

## API surface

Defined in `backend/MedCare/urls.py`:

`/api/token/`, `/api/token/refresh/`, `/api/users/`, `/api/patients/`, `/api/doctors/`, `/api/appointments/`, `/api/prescriptions/`, `/api/billing/`, `/api/notifications/`

Each app uses DRF routers and `ModelViewSet`s. Follow that pattern for new resources.

## Domain rules to preserve

- **Auth**: the custom user model uses **email** as the unique login field. Never reintroduce `username`-based logic. Every person is a `User` with a `role`.
- **Appointments**: statuses are pending, approved, completed, cancelled, rescheduled, no-show. Doctor conflict detection (overlap checks) must keep working. Rescheduling and cancellation create history records (`AppointmentReschedule`, `AppointmentCancellation`); do not mutate an appointment's date/status without recording them.
- **Billing**: invoice total derives from amount, discount, and tax. Keep the calculation in one place. Use `Decimal`, never `float`, for money.
- **Prescriptions**: linked to patient, doctor, and appointment. Items hold dosage, frequency, duration, instructions, quantity.
- **Notifications**: outbound email/SMS must be logged in `EmailLog` / `SMSLog`.

## Coding conventions

Backend:
- Business logic belongs in models, serializers, or service functions, not in views' request handling blobs. Keep views thin.
- Every new endpoint needs an explicit `permission_classes` and queryset scoping (see rules below). Never rely on defaults by accident.
- Every model change needs a migration committed with it.
- Add tests for new logic, especially permissions, conflict detection, and billing math.

Frontend:
- TypeScript strict. Avoid `any`; define types for API payloads.
- All HTTP calls go through `src/services/` (shared Axios instance), not inline `fetch`/`axios` in components.
- Role gating in the UI is for UX only; the backend is the authority.
- Tailwind for styling; match existing component patterns.

## Security rules (summary — full detail in `SECURITY.md`)

1. **Object-level authorization is mandatory.** A patient may only see their own records; a doctor only their own patients/appointments/prescriptions; receptionists and admins per defined scope. Filtering by role in the queryset is required, not just checking login.
2. Never log, print, or return in errors: passwords, tokens, medical details, or full payment references.
3. Never commit `.env`, secrets, database dumps, or real patient data. Use obviously fake seed data.
4. Do not weaken `DEBUG`, `ALLOWED_HOSTS`, CORS, or JWT settings to make something work. Ask first.
5. Do not add dependencies without stating why; prefer well-maintained packages and pin versions.
6. Treat uploaded files (lab results) as untrusted: validate type and size, store outside the web root, serve only via authorized endpoints.

## How to work in this repo

- Make the smallest change that solves the task; do not refactor unrelated code.
- Before editing, read the relevant app's `models.py`, `serializers.py`, `views.py`, `urls.py`, and tests.
- After backend changes: run migrations check and tests. After frontend changes: run `npm run build`.
- If a request would expose patient data more broadly, skip authorization, or store secrets in code, stop and flag it instead of proceeding.
- If docs (`README.md`, `PROJECT_OVERVIEW.md`, etc.) disagree with the code, trust the code and update the docs.
- State clearly what you verified (ran) versus what you only reasoned about.

## Known gaps / good next tasks

- Frontend dashboards are placeholders; wire them to the API with live data.
- Test coverage and CI/CD are not set up.
- Reminder automation, real-time notifications, payment gateway, reporting/exports are not implemented.
- Confirm token storage strategy on the frontend and refresh/rotation settings (see `SECURITY.md`).
