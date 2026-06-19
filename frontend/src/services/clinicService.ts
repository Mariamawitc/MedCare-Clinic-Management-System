import api from './api';

type PaginatedResponse<T> = {
  count: number;
  results: T[];
};

const unwrapList = <T>(data: T[] | PaginatedResponse<T>) => (
  Array.isArray(data) ? data : data.results
);

export type AppointmentStatus = 'pending' | 'approved' | 'completed' | 'cancelled' | 'no_show' | 'rescheduled';

export type Appointment = {
  id: number;
  patient_name?: string;
  doctor_name?: string;
  doctor_specialization?: string;
  appointment_date: string;
  appointment_time: string;
  appointment_type: string;
  reason?: string;
  notes?: string;
  status: AppointmentStatus;
  duration_minutes: number;
  created_at: string;
};

export type Doctor = {
  id: number;
  user_name: string;
  specialization: string;
  specialization_display: string;
  consultation_fee: string;
  rating: number;
  is_available: boolean;
};

export type PatientProfile = {
  id: number;
  user_name: string;
  user_email: string;
  blood_type: string;
  allergies: string;
  chronic_conditions: string;
  medical_history: Array<{ id: number; condition: string; diagnosis_date: string; status: string }>;
  lab_results: Array<{ id: number; test_name: string; test_date: string; status: string }>;
};

export type Prescription = {
  id: number;
  patient_name: string;
  doctor_name: string;
  prescription_date: string;
  status: string;
  notes: string;
  items: Array<{ id: number; medication_name: string; dosage: string; frequency: string; duration: string }>;
};

export type Invoice = {
  id: number;
  invoice_number: string;
  patient_name: string;
  doctor_name?: string;
  total_amount: string;
  status: string;
  due_date?: string;
};

export type BillingRecord = {
  id: number;
  patient_name: string;
  service_type_display: string;
  service_description: string;
  amount: string;
  status: string;
};

export type UserSummary = {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  is_active: boolean;
};

const clinicService = {
  getAppointments: async () => {
    const response = await api.get('/appointments/');
    return unwrapList<Appointment>(response.data);
  },
  createAppointment: async (payload: {
    doctor: number;
    appointment_date: string;
    appointment_time: string;
    appointment_type: string;
    reason: string;
    notes?: string;
  }) => {
    const response = await api.post('/appointments/', payload);
    return response.data;
  },
  approveAppointment: async (id: number) => {
    const response = await api.post(`/appointments/${id}/approve/`, {});
    return response.data;
  },
  cancelAppointment: async (id: number, reason = 'other') => {
    const response = await api.post(`/appointments/${id}/cancel/`, { reason });
    return response.data;
  },
  completeAppointment: async (id: number) => {
    const response = await api.post(`/appointments/${id}/mark_completed/`, {});
    return response.data;
  },
  getDoctors: async () => {
    const response = await api.get('/doctors/');
    return unwrapList<Doctor>(response.data);
  },
  getPatientProfile: async () => {
    const response = await api.get('/patients/my_profile/');
    return response.data as PatientProfile;
  },
  getPrescriptions: async () => {
    const response = await api.get('/prescriptions/');
    return unwrapList<Prescription>(response.data);
  },
  getInvoices: async () => {
    const response = await api.get('/billing/invoices/');
    return unwrapList<Invoice>(response.data);
  },
  getBillingRecords: async () => {
    const response = await api.get('/billing/records/');
    return unwrapList<BillingRecord>(response.data);
  },
  getUsers: async () => {
    const response = await api.get('/users/');
    return unwrapList<UserSummary>(response.data);
  },
  registerPatient: async (payload: {
    first_name: string;
    last_name: string;
    email: string;
    phone_number?: string;
    password: string;
    password_confirm: string;
    role: 'patient';
  }) => {
    const response = await api.post('/users/register/', payload);
    return response.data;
  },
};

export default clinicService;
