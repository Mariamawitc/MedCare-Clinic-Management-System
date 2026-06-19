"""
Users app tests.
"""

from django.test import TestCase
from rest_framework.test import APITestCase
from users.models import CustomUser
from patients.models import Patient


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
