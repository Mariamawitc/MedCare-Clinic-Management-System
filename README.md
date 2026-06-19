# MedCare Clinic Management System

MedCare is a Django REST API with a React/Vite frontend for clinic operations.

## Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements-new.txt
copy .env.example .env
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

For local development without PostgreSQL, set `USE_SQLITE=True` in `backend/.env`.

## Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend expects the API at `http://localhost:8000/api` unless `VITE_API_BASE_URL` is set.

## Verified Commands

```bash
cd backend
python manage.py check
$env:USE_SQLITE='True'; python manage.py test users

cd ../frontend
npm.cmd run build
```
