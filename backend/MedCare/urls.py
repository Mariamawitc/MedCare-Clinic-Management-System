"""
URL configuration for MedCare project.
"""

from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView
from users.serializers import EmailTokenObtainPairSerializer
from users.views import EmailTokenObtainPairView

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # JWT Authentication
    path('api/token/', EmailTokenObtainPairView.as_view(serializer_class=EmailTokenObtainPairSerializer), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # App URLs
    path('api/users/', include('users.urls')),
    path('api/patients/', include('patients.urls')),
    path('api/doctors/', include('doctors.urls')),
    path('api/appointments/', include('appointments.urls')),
    path('api/prescriptions/', include('prescriptions.urls')),
    path('api/billing/', include('billing.urls')),
    path('api/notifications/', include('notifications.urls')),
]
