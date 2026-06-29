export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  aadhaarNo: string;
  healthCardId: string;
  phone: string;
  plan: 'Basic' | 'Premium' | 'Family';
  medicalHistory: string[];
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  experience: number;
  rating: number;
  consultationFee: number;
  availableDays: string[];
  image: string;
  location: string;
}

export interface Appointment {
  id: string;
  doctorId: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  type: 'Video' | 'In-Person';
  status: 'Booked' | 'Completed' | 'Cancelled';
  paymentMode: 'Cash on Delivery' | 'Health Card Scheme' | 'Free (Plan Benefit)';
  isOPDCheckup: boolean;
}

export interface Medicine {
  id: string;
  name: string;
  category: string;
  price: number;
  discountPrice: number;
  description: string;
  temperatureRequired: string;
  needsPrescription: boolean;
  image: string;
}

export interface MedicineOrder {
  id: string;
  medicines: { medicine: Medicine; quantity: number }[];
  totalPrice: number;
  status: 'Processing' | 'In Transit' | 'Out for Delivery' | 'Delivered';
  deliveryType: 'Urban' | 'Rural';
  temperatureLog: number[]; // real-time temperature log (e.g., 4.2°C, 4.5°C)
  prescriptionUrl?: string;
  createdAt: string;
}

export interface LabTest {
  id: string;
  name: string;
  category: 'Full Body' | 'Diabetes' | 'Heart' | 'Infections' | 'Radiology';
  price: number;
  discountPrice: number;
  description: string;
  homeCollectionAvailable: boolean;
  duration: string;
}

export interface LabBooking {
  id: string;
  testId: string;
  testName: string;
  price: number;
  date: string;
  timeSlot: string;
  type: 'Home Collection' | 'Lab Visit';
  status: 'Booked' | 'Sample Collected' | 'Report Generated';
  reportUrl?: string;
}

export interface HealthLockerRecord {
  id: string;
  title: string;
  category: 'Prescription' | 'Lab Report' | 'Vaccination' | 'Other';
  date: string;
  doctorName?: string;
  fileSize: string;
  isMfaProtected: boolean;
  notes?: string;
}

export interface Prescription {
  id: string;
  doctorName: string;
  specialty: string;
  date: string;
  patientName: string;
  symptoms: string;
  medications: { name: string; dosage: string; frequency: string; duration: string }[];
  instructions: string;
  signatureCode: string;
}

export interface VaccinePackage {
  id: string;
  name: string;
  targetGroup: 'Child' | 'Adult';
  doses: number;
  centerName: string;
  refrigerationStatus: string;
  price: number;
  anaphylaxisSafetyKit: boolean;
}

export interface VaccinationBooking {
  id: string;
  vaccineId: string;
  vaccineName: string;
  patientName: string;
  centerName: string;
  date: string;
  status: 'Scheduled' | 'Administered';
}

export interface LiveConsultation {
  roomId: string;
  doctorId: string;
  doctorName: string;
  isActive: boolean;
  chatMessages: { sender: 'patient' | 'doctor'; text: string; time: string }[];
}

export interface SymptomAssessmentAlert {
  id: string;
  patientName: string;
  age: number;
  gender: string;
  symptoms: string;
  medicalHistory: string[];
  vitals: {
    systolic: number;
    diastolic: number;
    pulse: number;
    temperature: number;
    spo2: number;
  };
  severity: 'Low' | 'Medium' | 'High' | 'Emergency';
  assessmentText: string;
  crossCheckDetails: string;
  isLikelyFalseAlarm: boolean;
  dismissReason: string;
  dismissed: boolean;
  recommendations: string[];
  createdAt: string;
}
