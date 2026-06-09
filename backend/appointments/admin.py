"""
Appointments app admin configuration.
"""

from django.contrib import admin
from .models import Appointment, AppointmentReschedule, AppointmentCancellation


@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    list_display = ('get_patient_name', 'get_doctor_name', 'appointment_date', 'appointment_time', 'status')
    list_filter = ('status', 'appointment_type', 'appointment_date', 'created_at')
    search_fields = ('patient__user__email', 'doctor__user__email')
    readonly_fields = ('created_at', 'updated_at')
    
    def get_patient_name(self, obj):
        return obj.patient.user.get_full_name()
    get_patient_name.short_description = 'Patient'
    
    def get_doctor_name(self, obj):
        return obj.doctor.user.get_full_name()
    get_doctor_name.short_description = 'Doctor'


@admin.register(AppointmentReschedule)
class AppointmentRescheduleAdmin(admin.ModelAdmin):
    list_display = ('appointment', 'old_date', 'new_date', 'requested_by', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('appointment__patient__user__email', 'requested_by')
    readonly_fields = ('created_at',)


@admin.register(AppointmentCancellation)
class AppointmentCancellationAdmin(admin.ModelAdmin):
    list_display = ('appointment', 'reason', 'cancelled_by', 'created_at')
    list_filter = ('reason', 'created_at')
    search_fields = ('appointment__patient__user__email', 'cancelled_by')
    readonly_fields = ('created_at',)
