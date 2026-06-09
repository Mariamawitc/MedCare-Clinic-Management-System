"""
Users app tests.
"""

from django.test import TestCase
from users.models import CustomUser


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
