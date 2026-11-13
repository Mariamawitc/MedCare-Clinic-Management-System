# Security Policy — MedCare Clinic Management System

MedCare stores sensitive personal and health information (allergies, chronic conditions, medical history, lab results, prescriptions, insurance details) and financial records (invoices, payments). A security failure here can harm real people. This document defines how to report vulnerabilities and the security requirements for contributors.

> **Status note:** this project is in active development and has not been security-audited. Do not deploy it with real patient data until the checklist in "Pre-production checklist" is complete. Items marked *verify* describe settings that must be confirmed against the actual code.

## Reporting a vulnerability

- **Do not open a public issue** for security problems.
- Report privately to the maintainer (use the repository's private security advisory feature, or contact the maintainer directly). Include: description, affected component, reproduction steps, and potential impact.
- Expect an acknowledgment within a few days. Please allow reasonable time to fix before public disclosure.
- Never include real patient data in a report.

## Scope

In scope: the Django API (`backend/`), the React frontend (`frontend/`), configuration, and dependencies.
Out of scope: social engineering, physical attacks, and issues in third-party services themselves.

## Data classification

| Class | Examples | Handling |
|---|---|---|
| Highly sensitive (PHI) | Medical history, allergies, chronic conditions, lab results, prescriptions, insurance details | Strict access control, never logged, encrypted in transit, encryption at rest recommended |
| Sensitive | Names, phone, email, appointment details, invoices, payment records | Role-scoped access, minimal exposure in responses |
| Secrets | `SECRET_KEY`, DB credentials, email credentials, JWT signing key | Environment only, never committed |
| Public | Doctor specialties, general clinic info | Normal handling |

Depending on where the clinic operates, health-data regulations may apply (for example HIPAA in the US, GDPR in the EU, or local data-protection law). Confirm legal obligations before handling real data.

## Authentication and sessions

- Authentication uses JWT via SimpleJWT (`/api/token/`, `/api/token/refresh/`).
- Required practices:
  - Short access-token lifetime (minutes, not days) and a bounded refresh lifetime. *verify `SIMPLE_JWT` settings.*
  - Enable refresh-token rotation and blacklisting after rotation so stolen refresh tokens are not reusable. *verify.*
  - Enforce strong password validation (Django validators enabled) and rate-limit login attempts to slow brute force.
  - Consider account lockout or throttling, and MFA for admin and doctor accounts.
- **Frontend token storage:** `localStorage` exposes tokens to any XSS. Prefer HttpOnly, Secure, SameSite cookies, or keep access tokens in memory with a refresh flow. *verify what `authService.ts` does.*
- Registration must not allow self-assignment of privileged roles. A public sign-up should only create `patient` accounts; `doctor`, `receptionist`, and `admin` roles must be granted by an admin. *verify `Register.tsx` and the user serializer.*

## Authorization (highest priority)

Authentication alone is not enough. Every endpoint must enforce **role** and **object-level** rules:

- **Patient**: only their own profile, appointments, prescriptions, invoices, lab results, notifications.
- **Doctor**: only their own schedule and patients with whom they have an appointment/relationship.
- **Receptionist**: scheduling, registration, and appointment management; no access to clinical detail beyond what the role needs.
- **Admin**: broad access, with actions auditable.

Implementation requirements:

- Override `get_queryset()` to scope by the requesting user. Do not return `Model.objects.all()` to non-admins.
- Set `permission_classes` explicitly on every viewset; set the global default to authenticated-only.
- Protect against IDOR: never trust an ID in the URL or body to decide ownership. Derive patient/doctor from `request.user` where possible.
- Serializers must not expose fields users should not modify (for example `role`, `is_staff`, `is_superuser`, invoice `status`, payment status). Use `read_only_fields` or separate serializers.
- Add automated tests proving user A cannot read or modify user B's data for each resource.

## API and application security

- **Input validation** through serializers; reject unexpected fields on sensitive writes.
- **Rate limiting** with DRF throttling on login, registration, and password reset endpoints.
- **Pagination** on list endpoints to prevent bulk data extraction.
- **No raw SQL** with string interpolation; use the ORM or parameterized queries.
- **Errors** must not leak stack traces, SQL, or internal paths (`DEBUG=False` in production).
- **Business logic abuse:** validate appointment conflicts server-side, prevent double payment, prevent editing paid invoices, and use `Decimal` for all money fields.
- **File uploads (lab results):** allow-list file types, enforce size limits, randomize stored filenames, store outside the web root or in private object storage, and serve only through an authorized endpoint. Consider malware scanning.
- **Notifications:** do not put PHI in SMS or email bodies. Send a minimal message with a link to the authenticated portal. Sanitize template variables to prevent injection.

## Django configuration

Review before any deployment (run `python manage.py check --deploy`):

- `DEBUG = False`
- A long, random `SECRET_KEY` loaded from the environment, unique per environment, rotated if exposed
- Restrictive `ALLOWED_HOSTS`
- `SECURE_SSL_REDIRECT`, `SESSION_COOKIE_SECURE`, `CSRF_COOKIE_SECURE`, `SECURE_HSTS_SECONDS` enabled behind HTTPS
- `SECURE_CONTENT_TYPE_NOSNIFF`, `X_FRAME_OPTIONS = "DENY"`
- Django admin served on a non-default path and restricted (VPN/IP allowlist, MFA) if exposed at all
- Default superuser credentials never reused; create admins with unique strong passwords

## CORS and CSRF

- `CORS_ALLOWED_ORIGINS` must list exact trusted frontend origins only. Never use `CORS_ALLOW_ALL_ORIGINS = True` outside local development.
- Do not enable credentials with wildcard origins.
- If cookie-based auth is adopted, CSRF protection must be configured accordingly.

## Secrets management

- `.env` is gitignored; only `.env.example` (with placeholder values) is committed.
- Never commit real keys, database dumps, or exports. If a secret is committed by accident, treat it as compromised: rotate it immediately and purge it from history.
- Use a secrets manager or the hosting platform's secret store in production.
- Consider adding secret scanning (for example gitleaks or GitHub secret scanning) as a pre-commit hook or CI step.

## Database

- Use a dedicated PostgreSQL user with least privilege (no superuser) for the app.
- Do not expose the database port publicly; restrict to the application network.
- Enable TLS for database connections in production.
- Encrypt backups, restrict access to them, and test restores.
- Enable encryption at rest at the disk or managed-database level.

## Logging, auditing, and privacy

- Never log passwords, tokens, full request bodies for sensitive endpoints, or PHI.
- Keep an **audit trail** for access to and changes of patient records, prescriptions, invoices, payments, and role changes (who, what, when).
- Define a data retention and deletion policy; support lawful patient data access and deletion requests where required.
- Use fake data in development, tests, screenshots, and demos.

## Frontend security

- Never render untrusted HTML; avoid `dangerouslySetInnerHTML`. React escapes by default, so keep it that way.
- Do not store PHI in browser storage, URLs, or analytics.
- Route guards (`ProtectedRoute`) are a UX convenience. They do not secure data; the API does.
- Set a Content Security Policy and security headers at the web server or CDN.
- Keep API base URLs in environment configuration, not hard-coded.

## Dependency and supply-chain security

- Pin dependency versions in `requirements.txt` and commit `package-lock.json`.
- Run `pip-audit` (or `safety`) and `npm audit` regularly and in CI.
- Enable Dependabot or equivalent. Apply Django security releases promptly.
- Review new dependencies before adding: maintenance status, popularity, and necessity.

## Deployment

- HTTPS everywhere with modern TLS; redirect HTTP to HTTPS.
- Run the Django app with a production server (for example gunicorn) behind a reverse proxy, never `runserver`.
- Serve static and media files appropriately; keep private media (lab results) private.
- Apply network-level protections: firewall, minimal open ports, and a WAF or rate limiting where possible.
- Set up monitoring and alerts for repeated failed logins, error spikes, and unusual data access.

## Pre-production checklist

- [ ] Object-level permission tests exist and pass for every resource
- [ ] Public registration can only create patient accounts
- [ ] JWT lifetimes, rotation, and blacklisting configured
- [ ] Login and registration throttled
- [ ] `check --deploy` shows no critical warnings
- [ ] `DEBUG=False`, strict `ALLOWED_HOSTS`, exact CORS origins
- [ ] Secrets only in environment; no secrets in git history
- [ ] HTTPS and secure cookie/HSTS settings enabled
- [ ] File upload validation and private storage for lab results
- [ ] No PHI in logs, emails, SMS, or URLs
- [ ] Audit logging for sensitive actions
- [ ] Encrypted, tested backups
- [ ] Dependency audit clean; CI runs tests and audits
- [ ] Legal and compliance review for the target region completed

## Guidance for AI assistants and contributors

- Prefer secure defaults. If a change requires loosening a security control, stop and ask.
- Never hard-code credentials, tokens, or real patient data in code, tests, comments, or examples.
- When adding an endpoint, state its permission and queryset scoping in the PR description.
- Report suspected vulnerabilities you notice while working, even if unrelated to the task.
