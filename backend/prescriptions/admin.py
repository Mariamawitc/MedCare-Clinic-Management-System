"""
Prescriptions app admin configuration.
"""

from django.contrib import admin
from .models import Prescription, PrescriptionItem


class PrescriptionItemInline(admin.TabularInline):
    model = PrescriptionItem
    extra = 1


@admin.register(Prescription)
class PrescriptionAdmin(admin.ModelAdmin):
    list_display = ('get_patient_name', 'get_doctor_name', 'prescription_date', 'status')
    list_filter = ('status', 'prescription_date')
    search_fields = ('patient__user__email', 'prescribed_by__user__email')
    readonly_fields = ('created_at', 'updated_at')
    inlines = [PrescriptionItemInline]
    
    def get_patient_name(self, obj):
        return obj.patient.user.get_full_name()
    get_patient_name.short_description = 'Patient'
    
    def get_doctor_name(self, obj):
        return obj.prescribed_by.user.get_full_name()
    get_doctor_name.short_description = 'Doctor'


@admin.register(PrescriptionItem)
class PrescriptionItemAdmin(admin.ModelAdmin):
    list_display = ('medication_name', 'dosage', 'frequency', 'duration')
    list_filter = ('frequency', 'created_at')
    search_fields = ('medication_name', 'prescription__patient__user__email')
