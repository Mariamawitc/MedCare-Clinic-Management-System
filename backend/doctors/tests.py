"""
Doctors app tests.
"""

from django.test import TestCase
from rest_framework.test import APIClient

from doctors.models import Doctor
from users.models import CustomUser


class PublicDoctorListTests(TestCase):
    def test_anonymous_user_can_list_public_doctor_profiles(self):
        doctor_user = CustomUser.objects.create_user(
            email='doctor@example.test',
            password='testpass123',
            first_name='Jordan',
            last_name='Taylor',
            role='doctor',
        )
        Doctor.objects.create(
            user=doctor_user,
            license_number='TEST-DOCTOR-001',
            specialization='general',
        )

        response = APIClient().get('/api/doctors/')

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['count'], 1)
        self.assertEqual(response.data['results'][0]['user_name'], 'Jordan Taylor')
