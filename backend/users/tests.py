"""
Users app tests.
"""

from django.test import TestCase
from rest_framework.test import APITestCase
from users.models import CustomUser
from patients.models import Patient
from doctors.models import Doctor
from appointments.models import Appointment
from prescriptions.models import Prescription


class CustomUserModelTests(TestCase):
    def setUp(self):
        self.user = CustomUser.objects.create_user(
            email='test@example.com',
            password='testpass123',
            first_name='John',
            last_name='Doe',
            role='patient'
        )

    def test_user_creation(self):
        self.assertEqual(self.user.email, 'test@example.com')
        self.assertEqual(self.user.role, 'patient')

    def test_user_string_representation(self):
        expected = f"{self.user.get_full_name()} ({self.user.role})"
        self.assertEqual(str(self.user), expected)


class UserRegistrationAPITests(APITestCase):
    def test_patient_registration_creates_patient_profile(self):
        response = self.client.post('/api/users/register/', {
            'email': 'patient@example.com',
            'first_name': 'Pat',
            'last_name': 'One',
            'password': 'strongpass123',
            'password_confirm': 'strongpass123',
            'role': 'patient',
        }, format='json')

        self.assertEqual(response.status_code, 201)
        user = CustomUser.objects.get(email='patient@example.com')
        self.assertTrue(Patient.objects.filter(user=user).exists())

    def test_public_registration_cannot_create_staff_role(self):
        response = self.client.post('/api/users/register/', {
            'email': 'doctor@example.com',
            'first_name': 'Doc',
            'last_name': 'One',
            'password': 'strongpass123',
            'password_confirm': 'strongpass123',
            'role': 'doctor',
        }, format='json')

        self.assertEqual(response.status_code, 400)
        self.assertFalse(CustomUser.objects.filter(email='doctor@example.com').exists())

    def test_email_login_returns_tokens(self):
        CustomUser.objects.create_user(
            email='doctor@example.com',
            password='strongpass123',
            first_name='Doc',
            last_name='One',
            role='doctor',
        )

        response = self.client.post('/api/token/', {
            'email': 'doctor@example.com',
            'password': 'strongpass123',
        }, format='json')

        self.assertEqual(response.status_code, 200)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)

    def test_patient_profile_update_endpoint(self):
        user = CustomUser.objects.create_user(
            email='patient2@example.com',
            password='strongpass123',
            first_name='Pat',
            last_name='Two',
            role='patient',
        )
        patient = Patient.objects.get(user=user)
        self.client.force_authenticate(user=user)

        response = self.client.patch('/api/patients/my_profile/', {
            'blood_type': 'A+',
            'allergies': 'Penicillin',
            'chronic_conditions': 'Asthma',
        }, format='json')

        self.assertEqual(response.status_code, 200)
        patient.refresh_from_db()
        self.assertEqual(patient.blood_type, 'A+')
        self.assertEqual(patient.allergies, 'Penicillin')

    def test_doctor_can_create_prescription(self):
        doctor_user = CustomUser.objects.create_user(
            email='doc2@example.com',
            password='strongpass123',
            first_name='Doc',
            last_name='Two',
            role='doctor',
        )
        doctor = Doctor.objects.create(
            user=doctor_user,
            license_number='DOC-002',
            specialization='general',
        )
        patient_user = CustomUser.objects.create_user(
            email='patient3@example.com',
            password='strongpass123',
            first_name='Pat',
            last_name='Three',
            role='patient',
        )
        patient = Patient.objects.get(user=patient_user)
        appointment = Appointment.objects.create(
            patient=patient,
            doctor=doctor,
            appointment_date='2030-01-01',
            appointment_time='09:00:00',
            appointment_type='consultation',
            reason='Follow-up',
        )
        self.client.force_authenticate(user=doctor_user)

        response = self.client.post('/api/prescriptions/', {
            'appointment': appointment.id,
            'patient': patient.id,
            'notes': 'Take as prescribed',
            'items': [
                {
                    'medication_name': 'Vitamin C',
                    'dosage': '500mg',
                    'frequency': 'once_daily',
                    'duration': '7 days',
                    'instructions': 'Take with food',
                    'quantity': 7,
                }
            ],
        }, format='json')

        self.assertEqual(response.status_code, 201)
        self.assertTrue(Prescription.objects.filter(patient=patient).exists())
