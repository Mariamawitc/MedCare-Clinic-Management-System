"""
Doctors app admin configuration.
"""

from django.contrib import admin
from .models import Doctor, DoctorSchedule, DoctorAvailability, DoctorReview


@admin.register(Doctor)
class DoctorAdmin(admin.ModelAdmin):
    list_display = ('get_full_name', 'specialization', 'license_number', 'rating', 'is_available')
    list_filter = ('specialization', 'is_available', 'created_at')
    search_fields = ('user__email', 'user__first_name', 'user__last_name', 'license_number')
    readonly_fields = ('created_at', 'updated_at', 'rating', 'total_consultations')
    
    def get_full_name(self, obj):
        return obj.user.get_full_name()
    get_full_name.short_description = 'Full Name'


@admin.register(DoctorSchedule)
class DoctorScheduleAdmin(admin.ModelAdmin):
    list_display = ('doctor', 'get_day_display', 'start_time', 'end_time', 'is_active')
    list_filter = ('day_of_week', 'is_active')
    search_fields = ('doctor__user__email',)


@admin.register(DoctorAvailability)
class DoctorAvailabilityAdmin(admin.ModelAdmin):
    list_display = ('doctor', 'date', 'start_time', 'end_time', 'is_available')
    list_filter = ('date', 'is_available')
    search_fields = ('doctor__user__email',)
    readonly_fields = ('created_at', 'updated_at')


@admin.register(DoctorReview)
class DoctorReviewAdmin(admin.ModelAdmin):
    list_display = ('doctor', 'rating', 'get_patient_name', 'created_at')
    list_filter = ('rating', 'created_at')
    search_fields = ('doctor__user__email', 'patient__user__email')
    readonly_fields = ('created_at', 'updated_at')
    
    def get_patient_name(self, obj):
        return obj.patient.user.get_full_name() if not obj.is_anonymous else 'Anonymous'
    get_patient_name.short_description = 'Patient Name'
