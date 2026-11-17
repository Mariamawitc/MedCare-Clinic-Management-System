# MedCare Clinic Management System

MedCare is a full-stack clinic management platform that streamlines operations for patients, doctors, receptionists and administrators. It pairs a Django REST API backend with a React + TypeScript frontend to support role-based access, appointment management, patient records, doctor scheduling, prescriptions, billing and notifications.

Each business domain lives in its own Django app, keeping the system modular and easy to extend.

## Features

- Account management and secure JWT authentication
- Patient records, medical history and lab results
- Doctor profiles, weekly schedules and availability
- Appointment booking, approval, rescheduling and cancellation with conflict detection
- Prescriptions with itemized medication details
- Invoices, payments and billing records
- Notifications via in-app messages, email and SMS logs
- REST API designed for a modern web interface

## Architecture

- Frontend: React + Vite + TypeScript
- Backend: Django + Django REST Framework
- Database: PostgreSQL, MySQL, or SQL Server
- Authentication: JWT via SimpleJWT
- API access: CORS enabled for local frontend development

The system is organized by business domain rather than by technical layer, so new features can be added within the relevant domain.

## Repository structure

```text
MedCare-Clinic-Management-System/
├── backend/                    # Django REST API
│   ├── MedCare/                # Project settings and routing
│   ├── users/                 # Auth and user accounts
│   ├── patients/              # Patient profiles, histories, lab results
│   ├── doctors/               # Doctor profiles, schedules, reviews
│   ├── appointments/          # Appointments and scheduling logic
│   ├── prescriptions/         # Prescriptions and medication items
│   ├── billing/               # Invoices, payments, billing records
│   ├── notifications/        # Notification and communication logs
│   ├── manage.py              # Django management entry point
│   ├── requirements.txt      # Backend dependencies
│   └── .env.example          # Example environment file
├── frontend/                  # React + TypeScript frontend
│   ├── src/
│   ├── package.json
│   └── vite.config.ts
├── BACKEND_COMPLETE.md
├── PROJECT_OVERVIEW.md
├── PHASE1_COMPLETE.md
├── START_HERE.md
├── DOCUMENTATION_INDEX.md
├── .gitignore
└── README.md
```

## Technology stack

- Backend: Python, Django, Django REST Framework, PostgreSQL/MySQL/SQL Server, SimpleJWT, django-cors-headers, python-dotenv
- Frontend: React 18, TypeScript, Vite, Tailwind CSS, React Router, Axios

## Core business domains

### 1. Users and authentication
- Custom user model with email as the unique login field
- Roles: patient, doctor, receptionist, admin
- Profile data, password management, and profile updates
- JWT authentication routes at the project root

### 2. Patient records
- Patient profile with emergency contact, blood type, allergies, chronic conditions and insurance details
- MedicalHistory for past diagnoses and clinical conditions
- LabResult for uploaded results and status tracking

### 3. Doctor management
- Doctor specialization, license number, experience, qualification, consultation fee, availability status and rating
- DoctorSchedule for recurring weekly schedules
- DoctorAvailability for daily time slots
- DoctorReview for patient ratings and comments

### 4. Appointments
- Appointment details for patient, doctor, date, time, type, reason, notes, duration and status
- AppointmentReschedule for change history
- AppointmentCancellation for reasons and metadata

### 5. Prescriptions
- Prescription header linked to patient, doctor, appointment, and status
- PrescriptionItem with medication name, dosage, frequency, duration, instructions and quantity

### 6. Billing and payments
- Invoice with invoice number, patient, doctor, amount, discount, tax, total, due date and status
- Payment with method, reference, amount, status and date
- BillingRecord for general service billing

### 7. Notifications
- Notification for type, title, body, read status, send state and timestamps
- EmailLog and SMSLog for outbound communication records
- NotificationTemplate for reusable message templates

## API reference

Routes are defined in `backend/MedCare/urls.py`:

| Endpoint | Purpose |
|---|---|
| `/api/token/` | JWT login |
| `/api/token/refresh/` | JWT refresh |
| `/api/users/` | Users |
| `/api/patients/` | Patients and patient records |
| `/api/doctors/` | Doctor profiles and schedules |
| `/api/appointments/` | Appointment management |
| `/api/prescriptions/` | Prescriptions |
| `/api/billing/` | Invoices and payments |
| `/api/notifications/` | Notifications |

Each app uses DRF routers and model viewsets, so resources support list, retrieve, create, update and custom actions.

## Frontend overview

The `frontend/` directory contains a React scaffold with a role-based structure.

### Auth flows
- login page
- registration page
- protected routes
- role-based dashboard mapping

Key files:
- `frontend/src/pages/auth/Login.tsx`
- `frontend/src/pages/auth/Register.tsx`
- `frontend/src/routes/AppRoutes.tsx`
- `frontend/src/routes/ProtectedRoute.tsx`
- `frontend/src/services/authService.ts`

### Dashboards
- patient
- doctor
- receptionist
- admin

These are currently simple views describing the intended functionality and still need full integration with the backend.

## System roles

- Patient: register, manage profile, book appointments, view medical history, prescriptions, and billing
- Doctor: manage schedule, review appointments, look up patient records, create prescriptions
- Receptionist: manage bookings, register patients, approve appointments, coordinate operations
- Admin: oversee operations, manage staff, monitor clinic-level data and reports

## Typical workflow

1. A user creates an account.
2. A patient books an appointment with a doctor.
3. A receptionist or doctor reviews the request.
4. The doctor sees the appointment on their schedule.
5. After the visit, the doctor records a prescription.
6. Billing creates or updates an invoice.
7. Payment is recorded and the patient is notified.
8. Records remain available for future care.

## Setup

### Backend

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate

pip install -r requirements.txt
cp .env.example .env
# Set DB_ENGINE and DB_* values in .env for your database.
# SQL Server additionally requires the Microsoft ODBC Driver 18 for SQL Server.
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

API: http://localhost:8000

### Frontend

```bash
cd frontend
npm install
npm run dev
```

App: http://localhost:5173

## Environment configuration

Copy `backend/.env.example` to `backend/.env` and set:
- `SECRET_KEY`
- `DEBUG`
- `DB_ENGINE` (`postgresql`, `mysql`, or `sqlserver`; defaults to `postgresql`)
- `DB_NAME`
- `DB_USER`
- `DB_PASSWORD`
- `DB_HOST`
- `DB_PORT` (defaults to 5432 for PostgreSQL, 3306 for MySQL, or 1433 for SQL Server)
- `DB_DRIVER` (SQL Server only; defaults to `ODBC Driver 18 for SQL Server`)
- `CORS_ALLOWED_ORIGINS`
- email settings for outgoing notifications

Install the selected database server/driver separately. SQL Server requires the Microsoft ODBC Driver; the Python backend package is installed with `pip install -r requirements.txt`. Never commit `.env`.

## Testing

```bash
# Backend
cd backend
python manage.py test

# Frontend
cd frontend
npm run build
```

Automated test coverage is currently limited.

## Project status

- Backend domain models and API layer: substantially implemented
- Frontend: role-based scaffold present
- Tests, CI/CD, and security review: not yet in place

MedCare is in active development.

## Roadmap

- Dynamic doctor calendars
- Live-data dashboards for each role
- Reporting and analytics
- Payment gateway integration
- Automated appointment reminders
- Real-time notifications
- Test coverage and CI/CD
- Security review and hardening

## Summary

MedCare covers the core tasks of a modern clinic: onboarding users, managing patient records, organizing schedules, booking appointments, writing prescriptions, billing and communicating updates. It is built as a modular, domain-driven platform ready to grow into a full operational system.


