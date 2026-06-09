"""
Billing app URLs.
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import InvoiceViewSet, PaymentViewSet, BillingRecordViewSet

router = DefaultRouter()
router.register(r'invoices', InvoiceViewSet, basename='invoice')
router.register(r'payments', PaymentViewSet, basename='payment')
router.register(r'records', BillingRecordViewSet, basename='billing-record')

urlpatterns = [
    path('', include(router.urls)),
]
