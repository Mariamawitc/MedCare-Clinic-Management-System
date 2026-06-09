"""
Patients app admin configuration.
"""

from django.contrib import admin
from .models import Patient, MedicalHistory, LabResult


@admin.register(Patient)
class PatientAdmin(admin.ModelAdmin):
    list_display = ('get_full_name', 'blood_type', 'insurance_provider', 'created_at')
    search_fields = ('user__email', 'user__first_name', 'user__last_name')
    readonly_fields = ('created_at', 'updated_at')
    
    def get_full_name(self, obj):
        return obj.user.get_full_name()
    get_full_name.short_description = 'Full Name'


@admin.register(MedicalHistory)
class MedicalHistoryAdmin(admin.ModelAdmin):
    list_display = ('patient', 'condition', 'diagnosis_date', 'status')
    list_filter = ('status', 'diagnosis_date')
    search_fields = ('patient__user__email', 'condition')
    readonly_fields = ('created_at', 'updated_at')


@admin.register(LabResult)
class LabResultAdmin(admin.ModelAdmin):
    list_display = ('patient', 'test_name', 'test_date', 'status')
    list_filter = ('status', 'test_date')
    search_fields = ('patient__user__email', 'test_name')
    readonly_fields = ('created_at', 'updated_at')
