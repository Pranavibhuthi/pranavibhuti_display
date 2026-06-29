import { Doctor, Medicine, LabTest, VaccinePackage, Patient, SymptomAssessmentAlert, Prescription, HealthLockerRecord } from "./types";

export const mockPatient: Patient = {
  id: "P-101",
  name: "Rajesh Kumar",
  age: 48,
  gender: "Male",
  aadhaarNo: "XXXX-XXXX-8921",
  healthCardId: "ABHA-12-8921-0421",
  phone: "9876543210",
  plan: "Premium",
  medicalHistory: ["Essential Hypertension", "Mild Panic Attacks", "Dust Allergy"]
};

export const mockDoctors: Doctor[] = [
  {
    id: "D-01",
    name: "Dr. Sandeep Nair",
    specialty: "Cardiology",
    experience: 15,
    rating: 4.9,
    consultationFee: 600,
    availableDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=200&h=200",
    location: "Metro Heart Care, Hyderabad"
  },
  {
    id: "D-02",
    name: "Dr. Meenakshi Iyer",
    specialty: "Pediatrics",
    experience: 12,
    rating: 4.8,
    consultationFee: 450,
    availableDays: ["Mon", "Wed", "Fri", "Sat"],
    image: "https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&q=80&w=200&h=200",
    location: "Ankur Children Clinic, Chennai"
  },
  {
    id: "D-03",
    name: "Dr. Vikram Sethi",
    specialty: "General Medicine",
    experience: 18,
    rating: 4.7,
    consultationFee: 400,
    availableDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=200&h=200",
    location: "City Health Hub, Bangalore"
  },
  {
    id: "D-04",
    name: "Dr. Priya Deshmukh",
    specialty: "Gynecology & Obstetrics",
    experience: 10,
    rating: 4.9,
    consultationFee: 500,
    availableDays: ["Tue", "Thu", "Sat"],
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200&h=200",
    location: "Matritva Clinic, Pune"
  },
  {
    id: "D-05",
    name: "Dr. Amit Barua",
    specialty: "Pulmonology",
    experience: 14,
    rating: 4.6,
    consultationFee: 550,
    availableDays: ["Mon", "Wed", "Thu"],
    image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=200&h=200",
    location: "Swas Health, Kolkata"
  }
];

export const mockMedicines: Medicine[] = [
  {
    id: "M-01",
    name: "Paracetamol 650mg (Dolo)",
    category: "Fever & Pain Relief",
    price: 30,
    discountPrice: 24,
    description: "Used for fast and effective relief of fever and mild-to-moderate body pain.",
    temperatureRequired: "Room Temperature (15-25°C)",
    needsPrescription: false,
    image: "💊"
  },
  {
    id: "M-02",
    name: "Insulin Glargine Pen (Lantus)",
    category: "Diabetes Management",
    price: 1200,
    discountPrice: 960,
    description: "Long-acting insulin injection used to control blood sugar levels in diabetic patients.",
    temperatureRequired: "Refrigerated (2-8°C) - strict cold chain monitoring",
    needsPrescription: true,
    image: "💉"
  },
  {
    id: "M-03",
    name: "Amlodipine 5mg (Amlokind)",
    category: "Hypertension / Cardiac",
    price: 45,
    discountPrice: 38,
    description: "Calcium channel blocker used to treat high blood pressure and prevent angina.",
    temperatureRequired: "Room Temperature (15-25°C)",
    needsPrescription: true,
    image: "🔴"
  },
  {
    id: "M-04",
    name: "Montelukast & Levocetirizine (Montair LC)",
    category: "Allergy & Asthma",
    price: 180,
    discountPrice: 153,
    description: "Dual-action medicine to manage allergic rhinitis, asthma symptoms, and sneezing.",
    temperatureRequired: "Cool Dry Place (below 30°C)",
    needsPrescription: true,
    image: "🟡"
  },
  {
    id: "M-05",
    name: "Amoxicillin 500mg (Novamox)",
    category: "Antibiotics",
    price: 110,
    discountPrice: 88,
    description: "Penicillin antibiotic used to treat bacterial infections of the chest, ears, and throat.",
    temperatureRequired: "Room Temperature (15-30°C)",
    needsPrescription: true,
    image: "🟢"
  }
];

export const mockLabTests: LabTest[] = [
  {
    id: "LT-01",
    name: "Complete Blood Count (CBC)",
    category: "Full Body",
    price: 350,
    discountPrice: 199,
    description: "Measures red cells, white cells, platelets, and hemoglobin. Perfect for general screening.",
    homeCollectionAvailable: true,
    duration: "12 hours"
  },
  {
    id: "LT-02",
    name: "HbA1c & Blood Sugar Fasting",
    category: "Diabetes",
    price: 500,
    discountPrice: 299,
    description: "Monitors average 3-month glucose levels and immediate fasting sugar. Essential for diabetic screening.",
    homeCollectionAvailable: true,
    duration: "8 hours"
  },
  {
    id: "LT-03",
    name: "Lipid Profile (Cholesterol Panel)",
    category: "Heart",
    price: 650,
    discountPrice: 399,
    description: "Measures HDL, LDL, VLDL, and Triglycerides to evaluate cardiovascular event risk.",
    homeCollectionAvailable: true,
    duration: "12 hours"
  },
  {
    id: "LT-04",
    name: "Thyroid Profile (T3, T4, TSH)",
    category: "Full Body",
    price: 550,
    discountPrice: 349,
    description: "Evaluates hyperthyroidism or hypothyroidism through comprehensive hormone checks.",
    homeCollectionAvailable: true,
    duration: "24 hours"
  },
  {
    id: "LT-05",
    name: "Chest X-Ray / CT Reference",
    category: "Radiology",
    price: 1500,
    discountPrice: 1200,
    description: "Imaging consultation reference at the nearest certified clinical diagnostic partner.",
    homeCollectionAvailable: false,
    duration: "Same day"
  }
];

export const mockVaccines: VaccinePackage[] = [
  {
    id: "V-01",
    name: "BCG & Polio (OPV) Infant Vaccine",
    targetGroup: "Child",
    doses: 1,
    centerName: "Pranavibhuti PHC Center, Urban Zone",
    refrigerationStatus: "Maintained at strict 2°C to 8°C with digital solar backup",
    price: 0, // Free Govt. Scheme
    anaphylaxisSafetyKit: true
  },
  {
    id: "V-02",
    name: "Pentavalent / DPT (Diphtheria, Tetanus, Pertussis)",
    targetGroup: "Child",
    doses: 3,
    centerName: "Rural Outreach Health Post, Block C",
    refrigerationStatus: "Monitored via IoT cold chain logger (4.5°C)",
    price: 0, // Govt Supported
    anaphylaxisSafetyKit: true
  },
  {
    id: "V-03",
    name: "Influenza (Flu Vaccine) - Adult",
    targetGroup: "Adult",
    doses: 1,
    centerName: "Pranavibhuti Superspecialty Clinic",
    refrigerationStatus: "Certified Vaccine Chiller (3.8°C)",
    price: 950,
    anaphylaxisSafetyKit: true
  },
  {
    id: "V-04",
    name: "Pneumococcal Conjugate Vaccine (PCV13)",
    targetGroup: "Adult",
    doses: 1,
    centerName: "Pranavibhuti Ward-6 Vaccination Wing",
    refrigerationStatus: "Continuous IoT Temp-Alert Fridge (4.0°C)",
    price: 3200,
    anaphylaxisSafetyKit: true
  }
];

export const mockSymptomAlerts: SymptomAssessmentAlert[] = [
  {
    id: "SA-201",
    patientName: "Rajesh Kumar",
    age: 48,
    gender: "Male",
    symptoms: "I am feeling minor chest tightness and having heavy breathing. My pulse feels very fast.",
    medicalHistory: ["Essential Hypertension", "Mild Panic Attacks", "Dust Allergy"],
    vitals: {
      systolic: 138,
      diastolic: 88,
      pulse: 104,
      temperature: 98.4,
      spo2: 99
    },
    severity: "High",
    assessmentText: "The patient is presenting with cardiopulmonary tightness accompanied by elevated sinus pulse rate (104 bpm). Standard emergency protocols require investigation, however there is an alternative probable psychiatric cause.",
    crossCheckDetails: "Patient has a documented history of 'Mild Panic Attacks'. Vital metrics show outstanding SpO2 (99%) and steady core temperature (98.4°F). Standard chest pain typically exhibits hypoxia under severe cardiac failure. Given high SpO2 and history of panic episodes, hyperventilation is a high-probability false alarm.",
    isLikelyFalseAlarm: true,
    dismissReason: "Strong correlation with historical anxiety/panic attacks. Excellent pulse oximeter saturation (99%) confirms highly effective ventilation with no signs of cardiogenic hypoxia. This is highly likely a panic-induced somatic response.",
    dismissed: false,
    recommendations: [
      "Conduct in-call guided diaphragmatic breathing (4-7-8 rhythm).",
      "Assess for mental stress trigger in active consultation.",
      "If pain worsens, spreads to arm/jaw, immediately refer to ER."
    ],
    createdAt: "2026-06-29T11:05:00Z"
  },
  {
    id: "SA-202",
    patientName: "Anita Sharma",
    age: 32,
    gender: "Female",
    symptoms: "Extreme fatigue, lightheadedness, and continuous shivering.",
    medicalHistory: ["Iron Deficiency Anemia"],
    vitals: {
      systolic: 105,
      diastolic: 68,
      pulse: 82,
      temperature: 101.8,
      spo2: 97
    },
    severity: "Medium",
    assessmentText: "Moderate severity pyrexia (101.8°F) paired with borderline low blood pressure. Patient complains of systemic shivering.",
    crossCheckDetails: "No respiratory or cardiac history. Patient history of 'Anemia' might exacerbate subjective fatigue during febrile states. This represents a real infectious/inflammatory fever alert, not a false alarm.",
    isLikelyFalseAlarm: false,
    dismissReason: "Vitals confirm objective high-grade fever (101.8°F). Historical anemia heightens cardiovascular strain, so this must be attended with high priority.",
    dismissed: false,
    recommendations: [
      "Prescribe Paracetamol 650mg for fever control.",
      "Encourage fluid intake with oral rehydration solutions.",
      "Check Hemoglobin levels to verify if anemia is currently severe."
    ],
    createdAt: "2026-06-29T10:30:00Z"
  }
];

export const mockPrescriptions: Prescription[] = [
  {
    id: "RX-4001",
    doctorName: "Dr. Vikram Sethi",
    specialty: "General Medicine",
    date: "2026-06-15",
    patientName: "Rajesh Kumar",
    symptoms: "Seasonal dry cough and runny nose",
    medications: [
      { name: "Montair LC", dosage: "10mg", frequency: "Once daily (Night)", duration: "5 Days" },
      { name: "Ascoril LS Syrup", dosage: "5ml", frequency: "Thrice daily", duration: "5 Days" }
    ],
    instructions: "Avoid cold drinks and ice creams. Steam inhalation twice daily.",
    signatureCode: "PRANA-MD-7712-SETHI"
  },
  {
    id: "RX-4002",
    doctorName: "Dr. Sandeep Nair",
    specialty: "Cardiology",
    date: "2026-05-10",
    patientName: "Rajesh Kumar",
    symptoms: "Blood pressure baseline follow-up",
    medications: [
      { name: "Amlopin 5mg", dosage: "5mg", frequency: "Once daily (Morning)", duration: "30 Days" }
    ],
    instructions: "Limit sodium intake below 1500mg daily. Walk 30 minutes at moderate pace.",
    signatureCode: "PRANA-CARDIO-8902-NAIR"
  }
];

export const mockHealthRecords: HealthLockerRecord[] = [
  {
    id: "LR-901",
    title: "Cardiac Lipids & Serum Chem",
    category: "Lab Report",
    date: "2026-05-20",
    doctorName: "Dr. Sandeep Nair",
    fileSize: "1.4 MB",
    isMfaProtected: true,
    notes: "Total Cholesterol 192 (Normal), Triglycerides slightly elevated (160)."
  },
  {
    id: "LR-902",
    title: "COVID Vaccination Certificate",
    category: "Vaccination",
    date: "2023-08-12",
    doctorName: "Govt Primary Health Center",
    fileSize: "640 KB",
    isMfaProtected: false,
    notes: "Completed Dose 1 & Dose 2 with Booster (Precautionary Dose)."
  }
];
