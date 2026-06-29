import React, { useState, useEffect } from 'react';
import { QrCodeScanner } from './QrCodeScanner';
import { TelehealthWaitingRoom } from './TelehealthWaitingRoom';
import { HealthJourney } from './HealthJourney';
import { 
  Heart, 
  Search, 
  Video, 
  MapPin, 
  Pill, 
  Upload, 
  FileText, 
  Thermometer, 
  Activity, 
  Calendar, 
  ShieldCheck, 
  Download, 
  Share2, 
  Unlock, 
  Plus, 
  AlertCircle, 
  TrendingUp, 
  Check, 
  Award, 
  Clock, 
  Sparkles, 
  Volume2, 
  Droplet,
  Smartphone,
  Play,
  QrCode,
  Milestone
} from 'lucide-react';
import { 
  Patient, 
  Doctor, 
  Appointment, 
  Medicine, 
  MedicineOrder, 
  LabTest, 
  LabBooking, 
  HealthLockerRecord, 
  Prescription, 
  VaccinePackage, 
  VaccinationBooking,
  SymptomAssessmentAlert
} from '../types';
import { 
  mockDoctors, 
  mockMedicines, 
  mockLabTests, 
  mockVaccines, 
  mockPrescriptions, 
  mockHealthRecords 
} from '../data';
import { INDIAN_LANGUAGES } from './VoiceAssistant';

interface PatientPortalProps {
  user: Patient;
  onUpdateUser: (updated: Patient) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onAddNotification: (text: string) => void;
  onLogSymptomAlert: (alert: SymptomAssessmentAlert) => void;
}

export default function PatientPortal({
  user,
  onUpdateUser,
  activeTab,
  setActiveTab,
  onAddNotification,
  onLogSymptomAlert
}: PatientPortalProps) {

  // State Management
  const [doctorsList] = useState<Doctor[]>(mockDoctors);
  const [medicinesList, setMedicinesList] = useState<Medicine[]>(() => {
    const saved = localStorage.getItem('pranavibhuti_medicines_list');
    return saved ? JSON.parse(saved) : mockMedicines;
  });
  useEffect(() => {
    localStorage.setItem('pranavibhuti_medicines_list', JSON.stringify(medicinesList));
  }, [medicinesList]);
  const [labTestsList] = useState<LabTest[]>(mockLabTests);
  const [vaccinesList] = useState<VaccinePackage[]>(mockVaccines);

  // User Appointments State
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: "APT-VT-002",
      doctorId: "D-01",
      doctorName: "Dr. Sila Roychowdhury",
      specialty: "Cardiology",
      date: "2026-06-29",
      time: "11:45 AM",
      type: "Video",
      status: "Booked",
      paymentMode: "Free (Plan Benefit)",
      isOPDCheckup: false
    },
    {
      id: "APT-001",
      doctorId: "D-03",
      doctorName: "Dr. Vikram Sethi",
      specialty: "General Medicine",
      date: "2026-06-30",
      time: "10:30 AM",
      type: "In-Person",
      status: "Booked",
      paymentMode: "Health Card Scheme",
      isOPDCheckup: true
    }
  ]);

  // Appointment Booking form state
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [bookingType, setBookingType] = useState<'Video' | 'In-Person'>('Video');
  const [bookingDate, setBookingDate] = useState('2026-06-30');
  const [bookingTime, setBookingTime] = useState('11:00 AM');
  const [paymentMode, setPaymentMode] = useState<'Cash on Delivery' | 'Health Card Scheme'>('Health Card Scheme');
  const [isOPD, setIsOPD] = useState(true);
  const [doctorSearch, setDoctorSearch] = useState('');

  // Pharmacy State
  const [cart, setCart] = useState<{ medicine: Medicine; quantity: number }[]>([]);
  const [uploadedPrescription, setUploadedPrescription] = useState<File | null>(null);
  const [uploadedPrescriptionName, setUploadedPrescriptionName] = useState('');
  const [deliveryType, setDeliveryType] = useState<'Urban' | 'Rural'>('Urban');
  const [orders, setOrders] = useState<MedicineOrder[]>([]);

  // Lab Bookings State
  const [labBookings, setLabBookings] = useState<LabBooking[]>([
    {
      id: "LAB-301",
      testId: "LT-02",
      testName: "HbA1c & Blood Sugar Fasting",
      price: 299,
      date: "2026-06-25",
      timeSlot: "08:00 AM - 10:00 AM",
      type: "Home Collection",
      status: "Report Generated",
      reportUrl: "sugar_report_rajesh.pdf"
    }
  ]);
  const [selectedLabTest, setSelectedLabTest] = useState<LabTest | null>(null);
  const [labBookingType, setLabBookingType] = useState<'Home Collection' | 'Lab Visit'>('Home Collection');
  const [labDate, setLabDate] = useState('2026-07-02');
  const [labTime, setLabTime] = useState('09:00 AM');

  // Health Locker State
  const [lockerUnlocked, setLockerUnlocked] = useState(false);
  const [lockerOtp, setLockerOtp] = useState('');
  const [lockerRecords, setLockerRecords] = useState<HealthLockerRecord[]>(mockHealthRecords);
  const [newLockerTitle, setNewLockerTitle] = useState('');
  const [newLockerCategory, setNewLockerCategory] = useState<'Prescription' | 'Lab Report' | 'Vaccination' | 'Other'>('Lab Report');
  const [newLockerNotes, setNewLockerNotes] = useState('');

  // Digital Prescriptions State
  const [prescriptions, setPrescriptions] = useState<Prescription[]>(() => {
    const saved = localStorage.getItem('pranavibhuti_prescriptions');
    return saved ? JSON.parse(saved) : mockPrescriptions;
  });
  useEffect(() => {
    localStorage.setItem('pranavibhuti_prescriptions', JSON.stringify(prescriptions));
  }, [prescriptions]);

  // Vaccinations Bookings State
  const [vaccinations, setVaccinations] = useState<VaccinationBooking[]>([
    {
      id: "VAC-101",
      vaccineId: "V-03",
      vaccineName: "Influenza (Flu Vaccine) - Adult",
      patientName: user.name,
      centerName: "Pranavibhuti Superspecialty Clinic",
      date: "2026-05-15",
      status: "Administered"
    }
  ]);
  const [selectedVaccine, setSelectedVaccine] = useState<VaccinePackage | null>(null);
  const [vaccineDate, setVaccineDate] = useState('2026-07-05');

  // AI Assistant State
  const [symptomsInput, setSymptomsInput] = useState('');
  const [symptomLang, setSymptomLang] = useState('en-IN');
  const [systolic, setSystolic] = useState('135');
  const [diastolic, setDiastolic] = useState('85');
  const [pulse, setPulse] = useState('102');
  const [temperature, setTemperature] = useState('98.4');
  const [spo2, setSpo2] = useState('99');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<any | null>(null);

  // Trigger Symptom Check
  const handleSymptomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptomsInput) return;

    setAiLoading(true);
    setAiResult(null);

    const langName = INDIAN_LANGUAGES.find(l => l.code === symptomLang)?.name || "English";

    try {
      const response = await fetch('/api/ai/symptom-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symptoms: symptomsInput,
          language: langName,
          medicalHistory: user.medicalHistory,
          patientAge: user.age,
          patientGender: user.gender,
          readings: {
            systolic: parseInt(systolic) || 120,
            diastolic: parseInt(diastolic) || 80,
            pulse: parseInt(pulse) || 72,
            temperature: parseFloat(temperature) || 98.6,
            spo2: parseInt(spo2) || 98
          }
        })
      });

      const data = await response.json();
      setAiResult(data);

      // Create an alert log for the doctor dashboard
      const alertLog: SymptomAssessmentAlert = {
        id: `SA-${Math.floor(Math.random() * 1000) + 300}`,
        patientName: user.name,
        age: user.age,
        gender: user.gender,
        symptoms: symptomsInput,
        medicalHistory: user.medicalHistory,
        vitals: {
          systolic: parseInt(systolic) || 120,
          diastolic: parseInt(diastolic) || 80,
          pulse: parseInt(pulse) || 72,
          temperature: parseFloat(temperature) || 98.6,
          spo2: parseInt(spo2) || 98
        },
        severity: data.severity,
        assessmentText: data.assessment,
        crossCheckDetails: data.crossCheckDetails,
        isLikelyFalseAlarm: data.isLikelyFalseAlarm,
        dismissReason: data.dismissReason,
        dismissed: false,
        recommendations: data.recommendations,
        createdAt: new Date().toISOString()
      };

      onLogSymptomAlert(alertLog);
      onAddNotification(`AI Symptom Assessment Completed: Flagged as ${data.severity} severity.`);

      // Optional TTS speak back
      if (typeof window !== 'undefined' && 'speechSynthesis' in window && data.voiceOutputText) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(data.voiceOutputText);
        window.speechSynthesis.speak(utterance);
      }

    } catch (err) {
      console.error("AI assistant check failed", err);
    } finally {
      setAiLoading(false);
    }
  };

  // Appointment booking logic
  const handleBookAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoctor) return;

    // Premium gets free consultations
    const finalMode = user.plan === 'Premium' || user.plan === 'Family' 
      ? 'Free (Plan Benefit)' 
      : paymentMode === 'Health Card Scheme' ? 'Health Card Scheme' : 'Cash on Delivery';

    const newApt: Appointment = {
      id: `APT-${Math.floor(Math.random() * 9000) + 1000}`,
      doctorId: selectedDoctor.id,
      doctorName: selectedDoctor.name,
      specialty: selectedDoctor.specialty,
      date: bookingDate,
      time: bookingTime,
      type: bookingType,
      status: 'Booked',
      paymentMode: finalMode as any,
      isOPDCheckup: isOPD
    };

    setAppointments([newApt, ...appointments]);
    onAddNotification(`Booked appointment with ${selectedDoctor.name} on ${bookingDate} via ${finalMode}.`);
    setSelectedDoctor(null);
  };

  // Lab Booking logic
  const handleBookLabTest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLabTest) return;

    const newBooking: LabBooking = {
      id: `LAB-${Math.floor(Math.random() * 9000) + 1000}`,
      testId: selectedLabTest.id,
      testName: selectedLabTest.name,
      price: selectedLabTest.discountPrice,
      date: labDate,
      timeSlot: labTime,
      type: labBookingType,
      status: 'Booked'
    };

    setLabBookings([newBooking, ...labBookings]);
    onAddNotification(`Lab Test "${selectedLabTest.name}" scheduled for ${labDate} (${labBookingType}).`);
    setSelectedLabTest(null);
  };

  // Medicine Order logic
  const addToCart = (med: Medicine) => {
    const existing = cart.find(c => c.medicine.id === med.id);
    if (existing) {
      setCart(cart.map(c => c.medicine.id === med.id ? { ...c, quantity: c.quantity + 1 } : c));
    } else {
      setCart([...cart, { medicine: med, quantity: 1 }]);
    }
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter(c => c.medicine.id !== id));
  };

  const checkoutMedicines = () => {
    if (cart.length === 0) return;

    // Check prescription requirement
    const needsRx = cart.some(item => item.medicine.needsPrescription);
    if (needsRx && !uploadedPrescriptionName) {
      alert("One or more items require a prescription. Please upload your prescription first.");
      return;
    }

    const total = cart.reduce((acc, curr) => acc + (curr.medicine.discountPrice * curr.quantity), 0);
    const newOrder: MedicineOrder = {
      id: `ORD-${Math.floor(Math.random() * 9000) + 1000}`,
      medicines: [...cart],
      totalPrice: total,
      status: 'Processing',
      deliveryType,
      temperatureLog: [4.5], // Starting temp in cold chain
      prescriptionUrl: uploadedPrescriptionName || undefined,
      createdAt: new Date().toLocaleDateString()
    };

    // Add immediate tracking temperature simulator
    setOrders([newOrder, ...orders]);
    setCart([]);
    setUploadedPrescription(null);
    setUploadedPrescriptionName('');
    onAddNotification(`Pharmacy order ${newOrder.id} placed. Temperature monitoring active (${deliveryType} Route).`);
  };

  // Vaccine Booking logic
  const handleBookVaccine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVaccine) return;

    const newBooking: VaccinationBooking = {
      id: `VAC-${Math.floor(Math.random() * 9000) + 1000}`,
      vaccineId: selectedVaccine.id,
      vaccineName: selectedVaccine.name,
      patientName: user.name,
      centerName: selectedVaccine.centerName,
      date: vaccineDate,
      status: 'Scheduled'
    };

    setVaccinations([newBooking, ...vaccinations]);
    onAddNotification(`Vaccination schedule confirmed for ${selectedVaccine.name} at ${selectedVaccine.centerName}.`);
    setSelectedVaccine(null);
  };

  // Health Locker MFA Unlock
  const handleLockerUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (lockerOtp === '123456') {
      setLockerUnlocked(true);
      setLockerOtp('');
      onAddNotification("Health Locker unlocked successfully via Multi-Factor Verification.");
    } else {
      alert("Invalid OTP for locker access. Use 123456 for demo.");
    }
  };

  const handleLinkPrescriptionFromQr = (newRx: Prescription) => {
    setPrescriptions(prev => {
      if (prev.some(r => r.id === newRx.id)) return prev;
      return [newRx, ...prev];
    });

    const lockerRec: HealthLockerRecord = {
      id: `LOCK-RX-${newRx.id}`,
      title: `Decoded RX Token: ${newRx.doctorName} (${newRx.id})`,
      category: 'Prescription',
      date: newRx.date,
      doctorName: newRx.doctorName,
      fileSize: "14.5 KB",
      isMfaProtected: true,
      notes: `Scanned and linked via Universal QR Clinic Sync. Diagnosis/Symptoms: ${newRx.symptoms}`
    };
    setLockerRecords(prev => [lockerRec, ...prev]);
  };

  const handleLinkMedicineFromQr = (medications: { name: string; dosage: string; frequency: string; duration: string }[]) => {
    setMedicinesList(prev => {
      let updated = [...prev];
      medications.forEach(m => {
        const exists = updated.some(u => u.name.toLowerCase().includes(m.name.toLowerCase()) || m.name.toLowerCase().includes(u.name.toLowerCase()));
        if (!exists) {
          const newMed: Medicine = {
            id: `M-QR-${Math.floor(100 + Math.random() * 900)}`,
            name: m.name,
            category: "Prescribed Medications",
            price: 150,
            discountPrice: 120,
            description: `Decoded prescribed medication. Dosage: ${m.dosage}. Frequency: ${m.frequency}. Duration: ${m.duration}`,
            temperatureRequired: "Room Temperature (15-25°C)",
            needsPrescription: true,
            image: "💊"
          };
          updated.push(newMed);
        }
      });
      return updated;
    });

    medications.forEach(m => {
      const nameMatch = m.name.toLowerCase();
      const medInCart: Medicine = {
        id: `M-QR-${Math.floor(100 + Math.random() * 900)}`,
        name: m.name,
        category: "Prescribed Medications",
        price: 150,
        discountPrice: 120,
        description: `Decoded prescribed medication. Dosage: ${m.dosage}. Frequency: ${m.frequency}. Duration: ${m.duration}`,
        temperatureRequired: "Room Temperature (15-25°C)",
        needsPrescription: true,
        image: "💊"
      };
      
      setCart(prev => {
        const existing = prev.find(c => c.medicine.name.toLowerCase().includes(nameMatch) || nameMatch.includes(c.medicine.name.toLowerCase()));
        if (existing) {
          return prev.map(c => c.medicine.name.toLowerCase().includes(nameMatch) || nameMatch.includes(c.medicine.name.toLowerCase()) ? { ...c, quantity: c.quantity + 1 } : c);
        } else {
          return [...prev, { medicine: medInCart, quantity: 1 }];
        }
      });
    });
  };

  const handleAddLockerRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLockerTitle) return;

    const newRec: HealthLockerRecord = {
      id: `LR-${Math.floor(Math.random() * 900) + 100}`,
      title: newLockerTitle,
      category: newLockerCategory,
      date: new Date().toISOString().split('T')[0],
      fileSize: "1.2 MB",
      isMfaProtected: true,
      notes: newLockerNotes
    };

    setLockerRecords([newRec, ...lockerRecords]);
    setNewLockerTitle('');
    setNewLockerNotes('');
    onAddNotification(`Added "${newLockerTitle}" to your MFA-protected Health Locker.`);
  };

  // Plan Upgrade Logic
  const handleUpgradePlan = (planName: 'Basic' | 'Premium' | 'Family') => {
    onUpdateUser({ ...user, plan: planName });
    onAddNotification(`Health plan successfully updated to ${planName}.`);
  };

  // Filter Doctors
  const filteredDoctors = doctorsList.filter(d => 
    d.name.toLowerCase().includes(doctorSearch.toLowerCase()) ||
    d.specialty.toLowerCase().includes(doctorSearch.toLowerCase())
  );

  return (
    <div id="patient-portal-container" className="flex-1 overflow-y-auto p-8 bg-slate-950 text-white">
      
      {/* Tab 1: Home Dashboard Overview */}
      {activeTab === 'home' && (
        <div id="tab-patient-home" className="space-y-8">
          {/* Hero Banner */}
          <div className="bg-gradient-to-r from-sky-600 to-emerald-600 rounded-3xl p-8 text-white relative overflow-hidden shadow-lg">
            <div className="absolute right-0 bottom-0 opacity-10 transform translate-y-6 translate-x-6">
              <Heart className="h-64 w-64" />
            </div>
            <div className="max-w-xl space-y-4">
              <span className="bg-white/20 text-white font-mono text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider font-bold">
                PRANAVIBHUTI Universal Health Account
              </span>
              <h2 className="text-3xl font-black tracking-tight leading-tight">
                Welcome back, {user.name}!
              </h2>
              <p className="text-sm text-sky-50 font-normal leading-relaxed">
                Access certified pediatricians, real-time insulin cold-chain tracking, biometric diagnostic locks, and clinical AI symptom cross-checking instantly from your home dashboard.
              </p>
              <div className="flex gap-4 pt-2">
                <button 
                  id="hero-ai-btn"
                  onClick={() => setActiveTab('assistant')} 
                  className="bg-white text-sky-700 px-4 py-2.5 rounded-xl text-xs font-extrabold hover:bg-sky-50 transition-all shadow"
                >
                  Analyze Symptoms Now
                </button>
                <button 
                  id="hero-apt-btn"
                  onClick={() => setActiveTab('appointments')} 
                  className="bg-sky-700/50 border border-sky-400 text-white px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-sky-700 transition-all"
                >
                  Book Doctor Consult
                </button>
              </div>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
              <div className="h-10 w-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Aadhaar Status</p>
                <p className="text-xs font-extrabold text-slate-800">Linked & Secured</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
              <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <Heart className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Digital Health Card</p>
                <p className="text-xs font-extrabold text-slate-800">{user.healthCardId}</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
              <div className="h-10 w-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                <Award className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Current Health Plan</p>
                <p className="text-xs font-extrabold text-slate-800">{user.plan} Account</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
              <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Active Bookings</p>
                <p className="text-xs font-extrabold text-slate-800">
                  {appointments.filter(a => a.status === 'Booked').length} Pending
                </p>
              </div>
            </div>
          </div>

          {/* Quick shortcuts and active info */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-4 shadow-sm">
              <h3 className="text-sm font-black text-slate-900 border-b border-slate-100 pb-3">
                Your Upcoming Consultations
              </h3>
              {appointments.length === 0 ? (
                <p className="text-xs text-slate-400 py-4">No future appointments booked. Use Doctor Appointments to schedule.</p>
              ) : (
                <div className="space-y-3">
                  {appointments.map((apt) => (
                    <div key={apt.id} className="p-4 bg-slate-50 border border-slate-100 rounded-xl flex justify-between items-center text-xs">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-800">{apt.doctorName}</span>
                          <span className="bg-sky-100 text-sky-800 px-1.5 py-0.5 rounded-[4px] text-[9px] font-bold">
                            {apt.type}
                          </span>
                        </div>
                        <p className="text-slate-500">{apt.specialty} • {apt.time} • {apt.date}</p>
                        <p className="text-[10px] text-slate-400">Payment: <strong className="text-emerald-600">{apt.paymentMode}</strong></p>
                      </div>
                      <div className="flex flex-col items-end gap-1.5 shrink-0">
                        <span className="bg-emerald-50 text-emerald-800 border border-emerald-100 font-bold px-2.5 py-1 rounded-full text-[10px]">
                          {apt.status}
                        </span>
                        {apt.type === 'Video' && apt.status === 'Booked' && (
                          <button
                            onClick={() => setActiveTab('waiting-room')}
                            className="bg-sky-600 hover:bg-sky-700 text-white font-black text-[9px] px-2 py-1 rounded-lg shadow-sm flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            <Video className="h-2.5 w-2.5" /> Enter Waiting Room
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-4 shadow-sm">
              <h3 className="text-sm font-black text-slate-900 border-b border-slate-100 pb-3">
                Chronic Medical Baseline
              </h3>
              <div className="space-y-2">
                {user.medicalHistory.map((history, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-slate-700">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    <span className="font-semibold">{history}</span>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-slate-400 leading-normal">
                Pranavibhuti AI automatically cross-references these baseline chronic parameters before diagnosing alerts to protect clinical workflows from false emergencies.
              </p>
            </div>
          </div>

          {/* Universal Clinic Sync Banner */}
          <div className="bg-gradient-to-r from-sky-950/30 via-emerald-950/30 to-slate-900/50 rounded-3xl p-6 border border-slate-800/80 shadow flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-sky-500/10 text-sky-400 border border-sky-500/20 rounded-2xl flex items-center justify-center shrink-0">
                <QrCode className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                  Universal QR Clinic Sync Center
                  <span className="bg-emerald-500/20 text-emerald-400 font-mono text-[9px] px-1.5 py-0.5 rounded uppercase tracking-wider">New</span>
                </h4>
                <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
                  Have a physical health clinic card or an electronic prescription receipt token from Apollo, Max, or Narayana Health? Scan the QR code instantly with your camera to sync records & buy meds with 1 click.
                </p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('qr-sync')}
              className="px-5 py-3 bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-xs rounded-xl transition-all shadow shrink-0 flex items-center gap-1.5 cursor-pointer"
            >
              <QrCode className="h-4 w-4" /> Start QR Scanner
            </button>
          </div>

          {/* Health Journey Timeline Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-sky-950/20 to-slate-900 rounded-3xl p-6 border border-slate-800/80 shadow flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-sky-500/10 text-sky-400 border border-sky-500/20 rounded-2xl flex items-center justify-center shrink-0">
                <Milestone className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                  Chronological Health Journey Map
                  <span className="bg-sky-500/20 text-sky-400 font-mono text-[9px] px-1.5 py-0.5 rounded uppercase tracking-wider">Interactive</span>
                </h4>
                <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
                  Track your entire clinical pathway sequentially—including diagnoses, surgical interventions, vaccine doses, and blood panels with real-time hoverable clinical insights.
                </p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('health-journey')}
              className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl transition-all shadow shrink-0 flex items-center gap-1.5 cursor-pointer"
            >
              <Milestone className="h-4 w-4" /> View Health Journey
            </button>
          </div>

        </div>
      )}

      {/* Tab 2: AI Health Assistant with multi-language symptom tracking */}
      {activeTab === 'assistant' && (
        <div id="tab-patient-assistant" className="space-y-8 max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <div className="h-12 w-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                <Sparkles className="h-6 w-6 animate-pulse" />
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-900">PRANAVIBHUTI Clinical AI Engine</h2>
                <p className="text-xs text-slate-500 font-medium">Cross-references diagnostic values against your historical EHR</p>
              </div>
            </div>

            <form id="ai-symptom-form" onSubmit={handleSymptomSubmit} className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="symptom-lang-select" className="block text-xs font-bold text-slate-600 mb-1 uppercase tracking-wider">
                    Diagnostic Voice Output Language
                  </label>
                  <select
                    id="symptom-lang-select"
                    value={symptomLang}
                    onChange={(e) => setSymptomLang(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    {INDIAN_LANGUAGES.map(l => (
                      <option key={l.code} value={l.code}>
                        {l.name} ({l.nativeName})
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="bg-sky-50/70 p-3 rounded-lg border border-sky-100 flex items-start gap-2.5">
                  <ShieldCheck className="h-4 w-4 text-sky-600 shrink-0 mt-0.5" />
                  <div className="text-[10px] text-sky-800 leading-normal">
                    <span className="font-bold block">EHR Cross-Reference: ACTIVE</span>
                    The AI will scan your profile conditions (<strong className="text-emerald-700">{user.medicalHistory.join(", ")}</strong>) to separate psychological anxiety from physical heart anomalies.
                  </div>
                </div>
              </div>

              {/* Symptoms Input */}
              <div>
                <label htmlFor="symptoms-textarea" className="block text-xs font-bold text-slate-600 mb-1 uppercase tracking-wider">
                  Describe what you are currently feeling
                </label>
                <textarea
                  id="symptoms-textarea"
                  rows={3}
                  required
                  value={symptomsInput}
                  onChange={(e) => setSymptomsInput(e.target.value)}
                  placeholder="e.g., I am feeling an unusual chest tightness, hyperventilating, and my pulse is very rapid. Feels like a cardiac problem."
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              {/* Vital Logs Input */}
              <div>
                <p className="text-xs font-bold text-slate-600 mb-2 uppercase tracking-wider">Vital Signs & Objective Logs (Simulate smart watch / clinical input)</p>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  <div>
                    <label htmlFor="vital-bp-sys" className="block text-[10px] text-slate-400 font-bold mb-0.5">Systolic BP (mmHg)</label>
                    <input
                      id="vital-bp-sys"
                      type="number"
                      value={systolic}
                      onChange={(e) => setSystolic(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-bold text-slate-800"
                    />
                  </div>
                  <div>
                    <label htmlFor="vital-bp-dia" className="block text-[10px] text-slate-400 font-bold mb-0.5">Diastolic BP (mmHg)</label>
                    <input
                      id="vital-bp-dia"
                      type="number"
                      value={diastolic}
                      onChange={(e) => setDiastolic(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-bold text-slate-800"
                    />
                  </div>
                  <div>
                    <label htmlFor="vital-pulse" className="block text-[10px] text-slate-400 font-bold mb-0.5">Pulse Rate (bpm)</label>
                    <input
                      id="vital-pulse"
                      type="number"
                      value={pulse}
                      onChange={(e) => setPulse(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-bold text-slate-800"
                    />
                  </div>
                  <div>
                    <label htmlFor="vital-temp" className="block text-[10px] text-slate-400 font-bold mb-0.5">Temp (°F)</label>
                    <input
                      id="vital-temp"
                      type="text"
                      value={temperature}
                      onChange={(e) => setTemperature(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-bold text-slate-800"
                    />
                  </div>
                  <div>
                    <label htmlFor="vital-spo2" className="block text-[10px] text-slate-400 font-bold mb-0.5">SpO2 Oxygen (%)</label>
                    <input
                      id="vital-spo2"
                      type="number"
                      value={spo2}
                      onChange={(e) => setSpo2(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-bold text-slate-800"
                    />
                  </div>
                </div>
              </div>

              <button
                id="ai-submit-btn"
                type="submit"
                disabled={aiLoading}
                className="w-full bg-gradient-to-r from-sky-600 to-emerald-600 hover:from-sky-700 hover:to-emerald-700 text-white font-black py-3 rounded-xl text-xs transition-all shadow shadow-sky-100 flex items-center justify-center gap-2"
              >
                {aiLoading ? (
                  <>
                    <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Cross-checking with EHR Clinical Baseline...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    <span>Generate Clinical EHR Cross-Check Report</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* AI Result Dashboard */}
          {aiResult && (
            <div id="ai-results-panel" className="bg-white rounded-2xl border border-slate-100 p-6 shadow-md space-y-6 animate-fade-in">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <h3 className="text-sm font-black text-slate-900">EHR Automated Assessment Result</h3>
                
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  aiResult.severity === 'Emergency' || aiResult.severity === 'High'
                    ? 'bg-rose-50 text-rose-800 border border-rose-100'
                    : aiResult.severity === 'Medium'
                      ? 'bg-amber-50 text-amber-800 border border-amber-100'
                      : 'bg-emerald-50 text-emerald-800 border border-emerald-100'
                }`}>
                  Risk Status: {aiResult.severity}
                </span>
              </div>

              {/* False alarm warning box */}
              {aiResult.isLikelyFalseAlarm && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
                  <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                  <div className="text-xs text-amber-900 space-y-1">
                    <p className="font-extrabold">EHR Cross-Reference: PROBABLE FALSE ALARM DETECTED</p>
                    <p className="leading-relaxed font-semibold">{aiResult.dismissReason}</p>
                    <p className="text-[10px] text-amber-700 font-medium">This alert has been pre-flagged on the Doctor's Dashboard so they can quickly verify and dismiss it with confidence, saving vital medical resources.</p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-bold text-slate-500 uppercase tracking-wider text-[10px] mb-1">Clinical Evaluation Summary</h4>
                    <p className="text-slate-700 leading-relaxed font-semibold bg-slate-50 p-3 rounded-lg border border-slate-100">
                      {aiResult.assessment}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-500 uppercase tracking-wider text-[10px] mb-1">EHR Baseline Integration</h4>
                    <p className="text-slate-700 leading-relaxed font-semibold bg-slate-50 p-3 rounded-lg border border-slate-100">
                      {aiResult.crossCheckDetails}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-bold text-slate-500 uppercase tracking-wider text-[10px] mb-1">Smart Recommendations</h4>
                    <div className="space-y-1.5">
                      {aiResult.recommendations.map((rec: string, i: number) => (
                        <div key={i} className="flex gap-2 items-start bg-emerald-50/50 p-2.5 rounded-lg border border-emerald-100/50 text-slate-700 leading-relaxed font-semibold">
                          <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{rec}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {aiResult.voiceOutputText && (
                    <div className="bg-slate-900 text-slate-100 rounded-xl p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[10px] text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                          <Volume2 className="h-3.5 w-3.5" />
                          Localized Voice Broadcast
                        </span>
                        <span className="text-[10px] text-slate-400">{INDIAN_LANGUAGES.find(l => l.code === symptomLang)?.name}</span>
                      </div>
                      <p className="italic text-xs text-slate-200">"{aiResult.voiceOutputText}"</p>
                      <button
                        id="replay-vitals-voice-btn"
                        onClick={() => {
                          if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                            window.speechSynthesis.cancel();
                            const u = new SpeechSynthesisUtterance(aiResult.voiceOutputText);
                            window.speechSynthesis.speak(u);
                          }
                        }}
                        className="text-[10px] text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 mt-2"
                      >
                        <Play className="h-3 w-3" /> Replay Vocal Guidance
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Doctor Appointments Booking */}
      {activeTab === 'appointments' && (
        <div id="tab-patient-appointments" className="space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-black text-slate-900">Book Doctor Consultations</h2>
              <p className="text-xs text-slate-500 font-medium">Free video checkups with Premium and Family subscriptions</p>
            </div>

            <div className="relative w-full md:w-80">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <Search className="h-4 w-4" />
              </span>
              <input
                id="doc-search-input"
                type="text"
                value={doctorSearch}
                onChange={(e) => setDoctorSearch(e.target.value)}
                placeholder="Search specialty (e.g. Cardiology)"
                className="pl-9 w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left side: Doctor List */}
            <div className="lg:col-span-2 space-y-4">
              {filteredDoctors.map((doc) => {
                const isSelected = selectedDoctor?.id === doc.id;
                return (
                  <div 
                    key={doc.id} 
                    className={`bg-white border rounded-2xl p-5 transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${
                      isSelected ? 'border-sky-500 ring-2 ring-sky-500/10' : 'border-slate-100 hover:border-slate-200 shadow-sm'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <img 
                        src={doc.image} 
                        alt={doc.name} 
                        referrerPolicy="no-referrer"
                        className="h-16 w-16 rounded-2xl object-cover shrink-0 border border-slate-100" 
                      />
                      <div>
                        <h3 className="text-sm font-extrabold text-slate-800">{doc.name}</h3>
                        <p className="text-xs text-sky-600 font-bold">{doc.specialty}</p>
                        <p className="text-[11px] text-slate-400 font-medium mt-0.5">{doc.experience} Years Exp • ⭐ {doc.rating}</p>
                        <p className="text-[11px] text-slate-500 font-medium flex items-center gap-1 mt-1">
                          <MapPin className="h-3 w-3 text-slate-400" /> {doc.location}
                        </p>
                      </div>
                    </div>

                    <div className="text-right space-y-2 w-full md:w-auto border-t md:border-t-0 pt-3 md:pt-0">
                      <div className="text-xs">
                        <span className="text-slate-400 font-semibold block">Consultation Fee</span>
                        {user.plan === 'Premium' || user.plan === 'Family' ? (
                          <span className="font-extrabold text-emerald-600">FREE <span className="line-through text-slate-400 text-[10px]">₹{doc.consultationFee}</span></span>
                        ) : (
                          <span className="font-extrabold text-slate-800">₹{doc.consultationFee}</span>
                        )}
                      </div>
                      <button
                        id={`select-doc-btn-${doc.id}`}
                        onClick={() => setSelectedDoctor(doc)}
                        className={`w-full md:w-auto px-4 py-2 rounded-lg font-bold text-xs transition-all ${
                          isSelected 
                            ? 'bg-sky-100 text-sky-700' 
                            : 'bg-sky-600 hover:bg-sky-700 text-white shadow-sm'
                        }`}
                      >
                        {isSelected ? 'Selected' : 'Book Slots'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right side: Booking form */}
            <div>
              {selectedDoctor ? (
                <form id="appointment-booking-form" onSubmit={handleBookAppointment} className="bg-white rounded-2xl border border-slate-100 p-6 shadow-md space-y-4 sticky top-20">
                  <h3 className="text-sm font-black text-slate-900 border-b border-slate-100 pb-3">
                    Schedule Consultation
                  </h3>
                  
                  <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs space-y-1">
                    <p className="font-bold text-slate-800">{selectedDoctor.name}</p>
                    <p className="text-sky-600 font-bold">{selectedDoctor.specialty}</p>
                  </div>

                  {/* Consultation Type */}
                  <div className="space-y-1.5">
                    <label htmlFor="apt-type" className="block text-[11px] text-slate-500 font-bold uppercase tracking-wider">Consultation Type</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        id="apt-type-video"
                        type="button"
                        onClick={() => setBookingType('Video')}
                        className={`py-2 px-3 text-xs font-bold rounded-lg border text-center transition-all ${
                          bookingType === 'Video' 
                            ? 'border-sky-500 bg-sky-50 text-sky-700' 
                            : 'border-slate-200 text-slate-600'
                        }`}
                      >
                        HD Video Call
                      </button>
                      <button
                        id="apt-type-inperson"
                        type="button"
                        onClick={() => setBookingType('In-Person')}
                        className={`py-2 px-3 text-xs font-bold rounded-lg border text-center transition-all ${
                          bookingType === 'In-Person' 
                            ? 'border-sky-500 bg-sky-50 text-sky-700' 
                            : 'border-slate-200 text-slate-600'
                        }`}
                      >
                        In-Person Visit
                      </button>
                    </div>
                  </div>

                  {/* Date and Time */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <label htmlFor="apt-date" className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Date</label>
                      <input
                        id="apt-date"
                        type="date"
                        value={bookingDate}
                        onChange={(e) => setBookingDate(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="apt-time" className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Time Slot</label>
                      <select
                        id="apt-time"
                        value={bookingTime}
                        onChange={(e) => setBookingTime(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-bold text-slate-800 focus:outline-none"
                      >
                        <option value="09:00 AM">09:00 AM</option>
                        <option value="10:30 AM">10:30 AM</option>
                        <option value="11:00 AM">11:00 AM</option>
                        <option value="03:30 PM">03:30 PM</option>
                        <option value="04:00 PM">04:00 PM</option>
                      </select>
                    </div>
                  </div>

                  {/* OPD inclusion */}
                  <div className="flex items-center gap-2 py-1">
                    <input
                      id="opd-checkbox"
                      type="checkbox"
                      checked={isOPD}
                      onChange={(e) => setIsOPD(e.target.checked)}
                      className="h-4.5 w-4.5 text-sky-600 rounded border-slate-300 focus:ring-sky-500"
                    />
                    <label htmlFor="opd-checkbox" className="text-xs font-semibold text-slate-700">Include general Outpatient check-up fees</label>
                  </div>

                  {/* Payment selection (If not Premium/Family) */}
                  {user.plan !== 'Premium' && user.plan !== 'Family' ? (
                    <div className="space-y-1.5">
                      <label htmlFor="apt-payment" className="block text-[11px] text-slate-500 font-bold uppercase tracking-wider">Payment Mode</label>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <button
                          id="apt-payment-cod"
                          type="button"
                          onClick={() => setPaymentMode('Cash on Delivery')}
                          className={`py-2 text-center rounded-lg border font-bold ${
                            paymentMode === 'Cash on Delivery' 
                              ? 'border-emerald-500 bg-emerald-50 text-emerald-700' 
                              : 'border-slate-200 text-slate-500'
                          }`}
                        >
                          Cash on Delivery
                        </button>
                        <button
                          id="apt-payment-scheme"
                          type="button"
                          onClick={() => setPaymentMode('Health Card Scheme')}
                          className={`py-2 text-center rounded-lg border font-bold ${
                            paymentMode === 'Health Card Scheme' 
                              ? 'border-emerald-500 bg-emerald-50 text-emerald-700' 
                              : 'border-slate-200 text-slate-500'
                          }`}
                        >
                          Health Card Scheme
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 bg-emerald-50 rounded-xl text-xs text-emerald-800 font-bold border border-emerald-100 flex items-center gap-2">
                      <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span>Special Plan Benefit: Consultation covered for free!</span>
                    </div>
                  )}

                  <button
                    id="confirm-booking-btn"
                    type="submit"
                    className="w-full bg-sky-600 hover:bg-sky-700 text-white py-3 rounded-xl font-extrabold text-xs transition-all shadow shadow-sky-100"
                  >
                    Confirm Secure Booking
                  </button>
                </form>
              ) : (
                <div className="bg-slate-100/50 rounded-2xl border-2 border-dashed border-slate-200 p-8 text-center text-xs text-slate-400">
                  Select a specialist from the list to trigger date scheduling and payment setup.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Medicine Delivery with temperature monitoring */}
      {activeTab === 'medicines' && (
        <div id="tab-patient-medicines" className="space-y-8">
          <div>
            <h2 className="text-xl font-black text-slate-900">Certified Online Pharmacy</h2>
            <p className="text-xs text-slate-500 font-medium">Real-time IoT temperature logging ensures secure delivery of critical drugs (Insulin, Cardiac medicines)</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left/Middle: Medicines Grid */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Prescriptions requirements banner */}
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3 text-xs text-amber-900">
                <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-1 font-semibold">
                  <p className="font-extrabold">Prescription Verification Requirements</p>
                  <p>Medicines marked with <strong className="text-rose-600">Prescription Required (Rx)</strong> must have a verified doctor's signature file uploaded before checking out.</p>
                </div>
              </div>

              {/* Medicine cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {medicinesList.map((med) => (
                  <div key={med.id} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-3 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <span className="text-3xl">{med.image}</span>
                        {med.needsPrescription && (
                          <span className="bg-rose-50 text-rose-700 font-extrabold px-2 py-0.5 rounded text-[9px] border border-rose-100 uppercase tracking-wider">
                            Rx Required
                          </span>
                        )}
                      </div>
                      <h3 className="text-xs font-black text-slate-800 mt-2">{med.name}</h3>
                      <p className="text-[10px] text-slate-400 font-semibold">{med.category}</p>
                      <p className="text-[11px] text-slate-500 leading-normal mt-1.5">{med.description}</p>
                      
                      <div className="mt-3 flex items-center gap-1.5 text-[10px] bg-slate-50 text-slate-500 p-2 rounded-lg border border-slate-100 font-mono">
                        <Thermometer className="h-3.5 w-3.5 text-sky-600" />
                        <span>Storage: {med.temperatureRequired}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-50 pt-3 mt-3 text-xs">
                      <div>
                        <span className="text-slate-400 line-through">₹{med.price}</span>
                        <span className="font-black text-slate-800 block text-sm">₹{med.discountPrice}</span>
                      </div>
                      <button
                        id={`add-cart-btn-${med.id}`}
                        onClick={() => addToCart(med)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-1.5 px-3 rounded-lg text-[10px] transition-all flex items-center gap-1"
                      >
                        <Plus className="h-3.5 w-3.5" /> Add to order
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Side: Prescription Uploader & Cart */}
            <div className="space-y-6">
              {/* Prescription drag-and-drop / selector */}
              <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-3">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">Upload Prescription</h3>
                
                <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center cursor-pointer hover:bg-slate-50 transition-all flex flex-col items-center justify-center relative">
                  <input
                    id="prescription-file-input"
                    type="file"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setUploadedPrescription(e.target.files[0]);
                        setUploadedPrescriptionName(e.target.files[0].name);
                        onAddNotification(`Uploaded prescription file: ${e.target.files[0].name}`);
                      }
                    }}
                  />
                  <Upload className="h-6 w-6 text-slate-400 mb-1" />
                  <p className="text-[10px] text-slate-700 font-bold">Drag or Click to upload PDF/Image</p>
                  <p className="text-[9px] text-slate-400 mt-0.5">JPG, PNG, PDF up to 4MB</p>
                </div>

                {uploadedPrescriptionName && (
                  <div className="p-2 bg-emerald-50 border border-emerald-100 rounded-lg flex items-center justify-between text-[11px] text-emerald-800 font-bold">
                    <span className="truncate max-w-[150px]">{uploadedPrescriptionName}</span>
                    <button 
                      id="remove-prescription-btn"
                      onClick={() => { setUploadedPrescription(null); setUploadedPrescriptionName(''); }} 
                      className="text-rose-600 font-semibold"
                    >
                      Clear
                    </button>
                  </div>
                )}
              </div>

              {/* Order Cart */}
              <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-4">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">Your Pharmacy Cart</h3>
                
                {cart.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-6">Your cart is empty. Browse medicines above.</p>
                ) : (
                  <div className="space-y-3">
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {cart.map((item) => (
                        <div key={item.medicine.id} className="flex justify-between items-center text-xs">
                          <div>
                            <p className="font-extrabold text-slate-800">{item.medicine.name}</p>
                            <p className="text-[10px] text-slate-400">Qty: {item.quantity} • ₹{item.medicine.discountPrice * item.quantity}</p>
                          </div>
                          <button 
                            id={`remove-cart-item-${item.medicine.id}`}
                            onClick={() => removeFromCart(item.medicine.id)} 
                            className="text-rose-600 hover:underline text-[10px]"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Delivery Route Category */}
                    <div className="pt-3 border-t border-slate-50">
                      <label htmlFor="delivery-route-select" className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Select Delivery Route</label>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <button
                          id="delivery-route-urban"
                          onClick={() => setDeliveryType('Urban')}
                          className={`py-1 text-center font-semibold rounded-lg border ${
                            deliveryType === 'Urban' ? 'border-sky-500 bg-sky-50 text-sky-700' : 'border-slate-200 text-slate-500'
                          }`}
                        >
                          Urban Hub (Standard)
                        </button>
                        <button
                          id="delivery-route-rural"
                          onClick={() => setDeliveryType('Rural')}
                          className={`py-1 text-center font-semibold rounded-lg border ${
                            deliveryType === 'Rural' ? 'border-sky-500 bg-sky-50 text-sky-700' : 'border-slate-200 text-slate-500'
                          }`}
                        >
                          Rural Outreach (Solar)
                        </button>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex justify-between font-black text-xs text-slate-800">
                      <span>Total Price:</span>
                      <span>₹{cart.reduce((a,c)=>a+(c.medicine.discountPrice*c.quantity),0)}</span>
                    </div>

                    <button
                      id="checkout-medicines-btn"
                      onClick={checkoutMedicines}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-2.5 rounded-xl text-xs transition-all shadow shadow-emerald-100"
                    >
                      Checkout Order
                    </button>
                  </div>
                )}
              </div>

              {/* Real-time temperature tracker log visualizer */}
              {orders.length > 0 && (
                <div className="bg-slate-900 text-slate-200 rounded-2xl p-5 space-y-3 shadow-md">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[10px] text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                      <Thermometer className="h-4 w-4 animate-pulse" />
                      Active Cold Chain Tracking
                    </span>
                    <span className="text-[9px] bg-sky-500/20 text-sky-300 font-bold px-1.5 py-0.5 rounded">IoT Live</span>
                  </div>

                  {orders.map((o) => (
                    <div key={o.id} className="text-xs space-y-1.5 border-b border-slate-800 pb-2 last:border-0 last:pb-0">
                      <div className="flex justify-between font-bold">
                        <span>Order ID: {o.id}</span>
                        <span className="text-[10px] text-slate-400">Route: {o.deliveryType}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px]">Chamber Temp:</span>
                        <span className="font-mono font-black text-emerald-400 bg-slate-950 px-1.5 py-0.5 rounded text-[11px]">4.2 °C</span>
                      </div>
                      <p className="text-[9.5px] text-slate-400 leading-tight">Continuous solar-powered refrigeration active. Auto-notifying pharmacists of any deviances.</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Lab Tests & Scans */}
      {activeTab === 'lab-tests' && (
        <div id="tab-patient-lab" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-black text-slate-900">Lab Tests & Health Scans</h2>
              <p className="text-xs text-slate-500 font-medium">Schedule convenient home sample collections or find certified diagnostic labs nearby</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Catalog */}
            <div className="lg:col-span-2 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {labTestsList.map((test) => (
                  <div key={test.id} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-3 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center">
                        <span className="bg-sky-50 text-sky-700 font-bold px-2 py-0.5 rounded text-[9px] border border-sky-100">
                          {test.category}
                        </span>
                        {test.homeCollectionAvailable && (
                          <span className="bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded text-[9px] border border-emerald-100">
                            Home Collection
                          </span>
                        )}
                      </div>
                      <h3 className="text-xs font-black text-slate-800 mt-2">{test.name}</h3>
                      <p className="text-[11px] text-slate-500 leading-normal mt-1">{test.description}</p>
                      <p className="text-[10px] text-slate-400 font-semibold mt-1.5">Reports within: {test.duration}</p>
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-50 pt-3 mt-3 text-xs">
                      <div>
                        <span className="text-slate-400 line-through">₹{test.price}</span>
                        <span className="font-black text-slate-800 block text-sm">₹{test.discountPrice}</span>
                      </div>
                      <button
                        id={`schedule-lab-btn-${test.id}`}
                        onClick={() => setSelectedLabTest(test)}
                        className="bg-sky-600 hover:bg-sky-700 text-white font-bold py-1.5 px-3 rounded-lg text-[10px] transition-all"
                      >
                        Schedule
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Booking setup */}
            <div>
              {selectedLabTest ? (
                <form id="lab-booking-form" onSubmit={handleBookLabTest} className="bg-white rounded-2xl border border-slate-100 p-6 shadow-md space-y-4 sticky top-20">
                  <h3 className="text-sm font-black text-slate-900 border-b border-slate-100 pb-3">
                    Schedule Test Appointment
                  </h3>
                  
                  <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs space-y-1">
                    <p className="font-bold text-slate-800">{selectedLabTest.name}</p>
                    <p className="text-sky-600 font-bold">{selectedLabTest.category} test</p>
                  </div>

                  {/* Visit type selection */}
                  <div className="space-y-1.5">
                    <label htmlFor="lab-visit-type" className="block text-[11px] text-slate-500 font-bold uppercase tracking-wider">Appointment Type</label>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <button
                        id="lab-type-home"
                        type="button"
                        disabled={!selectedLabTest.homeCollectionAvailable}
                        onClick={() => setLabBookingType('Home Collection')}
                        className={`py-2 text-center rounded-lg border font-bold ${
                          labBookingType === 'Home Collection' ? 'border-sky-500 bg-sky-50 text-sky-700' : 'border-slate-200 text-slate-500'
                        }`}
                      >
                        Home Collection
                      </button>
                      <button
                        id="lab-type-visit"
                        type="button"
                        onClick={() => setLabBookingType('Lab Visit')}
                        className={`py-2 text-center rounded-lg border font-bold ${
                          labBookingType === 'Lab Visit' ? 'border-sky-500 bg-sky-50 text-sky-700' : 'border-slate-200 text-slate-500'
                        }`}
                      >
                        Lab Visit
                      </button>
                    </div>
                  </div>

                  {/* Date and Time slots */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <label htmlFor="lab-date" className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Date</label>
                      <input
                        id="lab-date"
                        type="date"
                        value={labDate}
                        onChange={(e) => setLabDate(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-bold text-slate-800 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label htmlFor="lab-time" className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Time Slot</label>
                      <select
                        id="lab-time"
                        value={labTime}
                        onChange={(e) => setLabTime(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-bold text-slate-800 focus:outline-none"
                      >
                        <option value="07:00 AM - 09:00 AM">07-09 AM (Fasting)</option>
                        <option value="09:00 AM - 11:00 AM">09-11 AM</option>
                        <option value="11:00 AM - 01:00 PM">11-01 PM</option>
                      </select>
                    </div>
                  </div>

                  <button
                    id="confirm-lab-booking"
                    type="submit"
                    className="w-full bg-sky-600 hover:bg-sky-700 text-white py-3 rounded-xl font-extrabold text-xs transition-all shadow"
                  >
                    Confirm Booking (₹{selectedLabTest.discountPrice})
                  </button>
                </form>
              ) : (
                <div className="bg-slate-100/50 rounded-2xl border-2 border-dashed border-slate-200 p-8 text-center text-xs text-slate-400">
                  Select a lab package from the list to schedule home collection sample pickups.
                </div>
              )}

              {/* Already Booked Lab List */}
              <div className="bg-white rounded-2xl border border-slate-100 p-5 mt-6 shadow-sm space-y-4">
                <h3 className="text-xs font-black text-slate-900 border-b border-slate-100 pb-2">Active Lab Bookings</h3>
                {labBookings.map((b) => (
                  <div key={b.id} className="p-3 bg-slate-50 border border-slate-100 rounded-lg text-xs space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-extrabold text-slate-800 truncate max-w-[150px]">{b.testName}</span>
                      <span className="text-[9px] bg-sky-100 text-sky-800 font-bold px-1 py-0.5 rounded">{b.status}</span>
                    </div>
                    <p className="text-slate-400 text-[10px]">{b.type} • {b.date}</p>
                    {b.status === 'Report Generated' && (
                      <button
                        id={`download-lab-report-${b.id}`}
                        onClick={() => {
                          alert(`Downloading digital laboratory file: ${b.reportUrl}`);
                        }}
                        className="text-sky-600 font-extrabold flex items-center gap-1 mt-1 hover:underline text-[10px]"
                      >
                        <Download className="h-3.5 w-3.5" /> Download PDF Report
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 6: Secure Health Locker (MFA Protected) */}
      {activeTab === 'locker' && (
        <div id="tab-patient-locker" className="space-y-6 max-w-4xl mx-auto">
          {!lockerUnlocked ? (
            <div id="locker-auth-screen" className="bg-white rounded-3xl border border-slate-100 p-8 shadow-md text-center max-w-md mx-auto space-y-6">
              <div className="mx-auto h-16 w-16 bg-rose-50 text-rose-600 flex items-center justify-center rounded-2xl border border-rose-100 shadow-sm animate-pulse">
                <Unlock className="h-8 w-8" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-base font-black text-slate-900">Health Locker Access Authorization</h3>
                <p className="text-xs text-slate-400">Your health locker contains encrypted diagnostic results. High-security MFA confirmation is required to inspect clinical files.</p>
              </div>

              <form id="locker-unlock-form" onSubmit={handleLockerUnlock} className="space-y-4">
                <div className="space-y-1 text-left">
                  <label htmlFor="locker-otp-input" className="block text-[11px] text-slate-500 font-bold uppercase tracking-wider">Aadhaar MFA Verification Code</label>
                  <input
                    id="locker-otp-input"
                    type="password"
                    maxLength={6}
                    required
                    value={lockerOtp}
                    onChange={(e) => setLockerOtp(e.target.value)}
                    placeholder="Enter OTP (Use 123456 for Demo)"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-center text-sm font-black tracking-widest focus:outline-none focus:ring-2 focus:ring-rose-500 text-slate-950"
                  />
                </div>

                <button
                  id="locker-unlock-submit"
                  type="submit"
                  className="w-full bg-rose-600 hover:bg-rose-700 text-white font-black py-3 rounded-xl text-xs transition-all shadow shadow-rose-100"
                >
                  Verify credentials and unlock
                </button>
              </form>
            </div>
          ) : (
            <div id="locker-unlocked-panel" className="bg-white rounded-3xl border border-slate-100 p-6 shadow-md space-y-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-100 gap-4">
                <div className="flex items-center gap-2.5">
                  <div className="h-10 w-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900">Encrypted Medical Locker</h3>
                    <p className="text-xs text-slate-400">Secure storage managed under National Health Stack regulations</p>
                  </div>
                </div>

                {/* Locker controls */}
                <button
                  id="locker-lock-btn"
                  onClick={() => setLockerUnlocked(false)}
                  className="bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-all"
                >
                  Lock Health Locker
                </button>
              </div>

              {/* Add locker file */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <form id="locker-add-record-form" onSubmit={handleAddLockerRecord} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                  <div className="md:col-span-2">
                    <label htmlFor="locker-file-title" className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">File or Record Name</label>
                    <input
                      id="locker-file-title"
                      type="text"
                      required
                      value={newLockerTitle}
                      onChange={(e) => setNewLockerTitle(e.target.value)}
                      placeholder="e.g., Annual Kidney Scan Cert"
                      className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs font-bold text-slate-800 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label htmlFor="locker-file-cat" className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Category</label>
                    <select
                      id="locker-file-cat"
                      value={newLockerCategory}
                      onChange={(e) => setNewLockerCategory(e.target.value as any)}
                      className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs font-bold text-slate-800 focus:outline-none"
                    >
                      <option value="Prescription">Prescription</option>
                      <option value="Lab Report">Lab Report</option>
                      <option value="Vaccination">Vaccination</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <button
                    id="locker-add-submit"
                    type="submit"
                    className="bg-sky-600 hover:bg-sky-700 text-white py-2.5 px-4 rounded-lg font-extrabold text-xs transition-all shadow"
                  >
                    Upload and Protect
                  </button>
                </form>
              </div>

              {/* Locker Grid */}
              <div className="space-y-4 text-xs">
                <h4 className="font-extrabold text-slate-800">Your Secured Documents</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {lockerRecords.map((rec) => (
                    <div key={rec.id} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-3 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-center">
                          <span className="bg-sky-100 text-sky-800 font-bold px-2 py-0.5 rounded text-[9px] uppercase tracking-wider">
                            {rec.category}
                          </span>
                          <span className="text-[10px] text-slate-400 font-semibold">{rec.date}</span>
                        </div>
                        <h5 className="font-black text-slate-800 mt-2 text-xs leading-normal">{rec.title}</h5>
                        {rec.notes && <p className="text-[10px] text-slate-500 italic leading-normal mt-1">"{rec.notes}"</p>}
                        <p className="text-[10px] text-slate-400 font-medium mt-1">Provider: {rec.doctorName || "Self Uploaded"}</p>
                      </div>

                      <div className="border-t border-slate-200/50 pt-3 flex items-center justify-between text-[11px] font-bold">
                        <span className="text-slate-400">{rec.fileSize}</span>
                        <div className="flex gap-3">
                          <button
                            id={`locker-share-btn-${rec.id}`}
                            onClick={() => {
                              alert(`Locker link successfully copied to clipboard! You can share this securely with any practitioner.`);
                            }}
                            className="text-sky-600 flex items-center gap-1 hover:underline"
                          >
                            <Share2 className="h-3.5 w-3.5" /> Share
                          </button>
                          <button
                            id={`locker-download-btn-${rec.id}`}
                            onClick={() => {
                              alert(`Downloading file: ${rec.title}.pdf (secured decrypted format)`);
                            }}
                            className="text-emerald-600 flex items-center gap-1 hover:underline"
                          >
                            <Download className="h-3.5 w-3.5" /> Download
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 7: Digital Prescriptions */}
      {activeTab === 'prescriptions' && (
        <div id="tab-patient-prescriptions" className="space-y-6 max-w-4xl mx-auto">
          <div>
            <h2 className="text-xl font-black text-slate-900">Your Signed Digital Prescriptions</h2>
            <p className="text-xs text-slate-500 font-medium">Verify clinical medication instructions and download official digital files</p>
          </div>

          <div className="space-y-6">
            {prescriptions.map((rx) => (
              <div key={rx.id} className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-4">
                <div className="flex justify-between items-start pb-4 border-b border-slate-100 text-xs">
                  <div>
                    <span className="text-[9px] bg-emerald-50 text-emerald-800 border border-emerald-100 font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                      Pranavibhuti Certified Rx
                    </span>
                    <h3 className="text-sm font-black text-slate-800 mt-1">ID: {rx.id}</h3>
                    <p className="text-slate-400 font-semibold mt-0.5">Diagnosed: {rx.date}</p>
                  </div>

                  <button
                    id={`download-prescription-rx-${rx.id}`}
                    onClick={() => {
                      alert(`Generating high-definition PDF structure for prescription ${rx.id}... \nDownloaded successfully!`);
                    }}
                    className="bg-sky-600 hover:bg-sky-700 text-white px-3.5 py-2 rounded-lg font-bold text-xs flex items-center gap-1 shadow-sm shadow-sky-100 transition-all"
                  >
                    <Download className="h-4 w-4" /> Download PDF Prescription
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Physician Details</span>
                    <p className="font-extrabold text-slate-800 mt-0.5">{rx.doctorName}</p>
                    <p className="text-sky-600 font-bold">{rx.specialty}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Symptoms Evaluated</span>
                    <p className="text-slate-700 mt-0.5 font-medium italic">"{rx.symptoms}"</p>
                  </div>
                </div>

                {/* Medications Table */}
                <div className="overflow-x-auto text-xs">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 text-[10px] text-slate-400 uppercase tracking-wider">
                        <th className="pb-2">Medicine Formulation</th>
                        <th className="pb-2">Dosage</th>
                        <th className="pb-2">Frequency</th>
                        <th className="pb-2">Duration</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 font-semibold text-slate-800">
                      {rx.medications.map((med, idx) => (
                        <tr key={idx}>
                          <td className="py-2 text-sky-700 font-extrabold">{med.name}</td>
                          <td className="py-2">{med.dosage}</td>
                          <td className="py-2 text-emerald-600">{med.frequency}</td>
                          <td className="py-2">{med.duration}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs space-y-1">
                  <span className="font-bold text-slate-500 uppercase tracking-wider text-[9px] block">Special Instructions</span>
                  <p className="text-slate-700 font-semibold">{rx.instructions}</p>
                </div>

                <div className="flex justify-between items-center text-[10px] text-slate-400 pt-3 border-t border-slate-100">
                  <span className="font-mono">Security Signature: {rx.signatureCode}</span>
                  <span className="font-bold text-emerald-600 uppercase">✓ Digital India Verified</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 8: Certified Vaccinations with proper refrigeration */}
      {activeTab === 'vaccinations' && (
        <div id="tab-patient-vaccines" className="space-y-6">
          <div className="bg-gradient-to-r from-teal-800 to-sky-900 rounded-3xl p-6 text-white space-y-3">
            <span className="bg-emerald-500/20 text-emerald-300 font-mono text-[10px] px-2.5 py-0.5 rounded uppercase font-extrabold tracking-wider border border-emerald-500/30">
              National Cold Chain Assurance
            </span>
            <h2 className="text-xl font-black tracking-tight leading-none">Certified Temperature Refrigerated Centers</h2>
            <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
              Every Pranavibhuti immunization center utilizes continuous solar-powered IoT refrigeration. In case of unexpected anaphylactic reactions, all sites hold certified emergency epipens, antihistamines, and respiratory support.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Catalog */}
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider mb-2">Available Vaccinations</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {vaccinesList.map((vac) => (
                  <div key={vac.id} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-3 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center">
                        <span className="bg-sky-50 text-sky-700 font-bold px-2 py-0.5 rounded text-[9px] border border-sky-100">
                          {vac.targetGroup} Vaccine
                        </span>
                        <span className="text-[10px] text-slate-400 font-semibold">{vac.doses} Dose Plan</span>
                      </div>
                      <h3 className="text-xs font-black text-slate-800 mt-2">{vac.name}</h3>
                      <p className="text-[11px] text-slate-400 font-medium mt-1">Center: {vac.centerName}</p>
                      
                      <div className="mt-3 flex items-start gap-1.5 text-[10px] bg-teal-50 text-teal-800 p-2.5 rounded-lg border border-teal-100 leading-normal">
                        <Thermometer className="h-4 w-4 text-teal-600 shrink-0 mt-0.5" />
                        <div>
                          <strong className="block">IoT Chiller: Verified</strong>
                          <span>{vac.refrigerationStatus}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-50 pt-3 mt-3 text-xs">
                      <div>
                        {vac.price === 0 ? (
                          <span className="font-extrabold text-emerald-600 uppercase">Govt Scheme (Free)</span>
                        ) : (
                          <span className="font-extrabold text-slate-800">₹{vac.price}</span>
                        )}
                      </div>
                      <button
                        id={`schedule-vaccine-btn-${vac.id}`}
                        onClick={() => setSelectedVaccine(vac)}
                        className="bg-sky-600 hover:bg-sky-700 text-white font-bold py-1.5 px-3 rounded-lg text-[10px] transition-all"
                      >
                        Schedule Dose
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right scheduling form */}
            <div className="space-y-6">
              {selectedVaccine ? (
                <form id="vaccine-booking-form" onSubmit={handleBookVaccine} className="bg-white rounded-2xl border border-slate-100 p-6 shadow-md space-y-4">
                  <h3 className="text-sm font-black text-slate-900 border-b border-slate-100 pb-3">
                    Schedule Vaccine Dose
                  </h3>
                  
                  <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs space-y-1">
                    <p className="font-bold text-slate-800">{selectedVaccine.name}</p>
                    <p className="text-sky-600 font-bold">{selectedVaccine.centerName}</p>
                  </div>

                  <div>
                    <label htmlFor="vaccine-date" className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Appointment Date</label>
                    <input
                      id="vaccine-date"
                      type="date"
                      required
                      value={vaccineDate}
                      onChange={(e) => setVaccineDate(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-bold text-slate-800 focus:outline-none"
                    />
                  </div>

                  <div className="bg-rose-50 border border-rose-100 p-3 rounded-xl text-[10.5px] text-rose-800 leading-normal flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block">Anaphylaxis Protocol Active</strong>
                      <span>The site has confirmed epinephrine injection safety-kits are on-premise for direct safety response.</span>
                    </div>
                  </div>

                  <button
                    id="confirm-vaccine-booking"
                    type="submit"
                    className="w-full bg-sky-600 hover:bg-sky-700 text-white py-3 rounded-xl font-extrabold text-xs transition-all shadow"
                  >
                    Confirm Dose Schedule
                  </button>
                </form>
              ) : (
                <div className="bg-slate-100/50 rounded-2xl border-2 border-dashed border-slate-200 p-8 text-center text-xs text-slate-400">
                  Select an immunization dose package to choose scheduling times.
                </div>
              )}

              {/* Booking timelines */}
              <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
                <h3 className="text-xs font-black text-slate-900 border-b border-slate-100 pb-2">Immunization Timelines</h3>
                {vaccinations.map((v) => (
                  <div key={v.id} className="p-3 bg-slate-50 border border-slate-100 rounded-lg text-xs space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-extrabold text-slate-800 truncate max-w-[150px]">{v.vaccineName}</span>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                        v.status === 'Administered' ? 'bg-emerald-100 text-emerald-800' : 'bg-sky-100 text-sky-800'
                      }`}>{v.status}</span>
                    </div>
                    <p className="text-slate-400 text-[10px]">{v.centerName}</p>
                    <p className="text-[10px] text-slate-500 font-semibold">Scheduled Date: {v.date}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 9: Subscription plans */}
      {activeTab === 'plans' && (
        <div id="tab-patient-plans" className="space-y-6 max-w-4xl mx-auto">
          <div className="text-center space-y-2">
            <h2 className="text-xl font-black text-slate-900">Affordable Healthcare Subscriptions</h2>
            <p className="text-xs text-slate-500 max-w-lg mx-auto">Get complete telehealth medical consultations, priority drug deliveries, and secure health locker protection</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Plan 1: Basic */}
            <div className={`bg-white border rounded-3xl p-6 shadow-sm space-y-5 relative flex flex-col justify-between ${
              user.plan === 'Basic' ? 'border-sky-500 ring-2 ring-sky-500/10' : 'border-slate-100'
            }`}>
              <div className="space-y-3">
                {user.plan === 'Basic' && (
                  <span className="bg-sky-100 text-sky-800 font-black px-2 py-0.5 rounded text-[9px] uppercase tracking-wider absolute top-4 right-4">
                    Active
                  </span>
                )}
                <h3 className="text-sm font-black text-slate-800">Basic Plan</h3>
                <p className="text-2xl font-black text-slate-900">₹0 <span className="text-xs text-slate-400 font-semibold">/ month</span></p>
                <p className="text-[11px] text-slate-500 leading-normal">Perfect for fundamental storage and medical counseling references.</p>
                
                <ul className="space-y-2 text-xs font-semibold text-slate-600">
                  <li className="flex gap-2 items-center"><Check className="h-4 w-4 text-emerald-500" /> Standard appointments</li>
                  <li className="flex gap-2 items-center"><Check className="h-4 w-4 text-emerald-500" /> Digital prescriptions</li>
                  <li className="flex gap-2 items-center"><Check className="h-4 w-4 text-emerald-500" /> Standard health locker</li>
                </ul>
              </div>

              <button
                id="upgrade-basic-btn"
                onClick={() => handleUpgradePlan('Basic')}
                disabled={user.plan === 'Basic'}
                className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all ${
                  user.plan === 'Basic' 
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                    : 'bg-slate-900 text-white hover:bg-slate-800'
                }`}
              >
                {user.plan === 'Basic' ? 'Current Plan' : 'Select Basic'}
              </button>
            </div>

            {/* Plan 2: Premium */}
            <div className={`bg-white border rounded-3xl p-6 shadow-sm space-y-5 relative flex flex-col justify-between ${
              user.plan === 'Premium' ? 'border-sky-500 ring-2 ring-sky-500/10' : 'border-slate-100'
            }`}>
              <div className="space-y-3">
                {user.plan === 'Premium' && (
                  <span className="bg-sky-100 text-sky-800 font-black px-2 py-0.5 rounded text-[9px] uppercase tracking-wider absolute top-4 right-4">
                    Active
                  </span>
                )}
                <h3 className="text-sm font-black text-slate-800 flex items-center gap-1.5">
                  Premium Plan
                  <Sparkles className="h-3.5 w-3.5 text-sky-500" />
                </h3>
                <p className="text-2xl font-black text-slate-900">₹499 <span className="text-xs text-slate-400 font-semibold">/ month</span></p>
                <p className="text-[11px] text-slate-500 leading-normal">Best for individuals seeking free telehealth consulting and immediate delivery benefits.</p>
                
                <ul className="space-y-2 text-xs font-semibold text-slate-600">
                  <li className="flex gap-2 items-center"><Check className="h-4 w-4 text-emerald-500" /> <strong>FREE Doctor consultations</strong></li>
                  <li className="flex gap-2 items-center"><Check className="h-4 w-4 text-emerald-500" /> Priority 4-hour cold-chain delivery</li>
                  <li className="flex gap-2 items-center"><Check className="h-4 w-4 text-emerald-500" /> Infinite EHR locker capacity</li>
                  <li className="flex gap-2 items-center"><Check className="h-4 w-4 text-emerald-500" /> Personalized smart recommendations</li>
                </ul>
              </div>

              <button
                id="upgrade-premium-btn"
                onClick={() => handleUpgradePlan('Premium')}
                disabled={user.plan === 'Premium'}
                className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all ${
                  user.plan === 'Premium' 
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                    : 'bg-sky-600 text-white hover:bg-sky-700 shadow-md shadow-sky-100'
                }`}
              >
                {user.plan === 'Premium' ? 'Current Plan' : 'Upgrade to Premium'}
              </button>
            </div>

            {/* Plan 3: Family */}
            <div className={`bg-white border rounded-3xl p-6 shadow-sm space-y-5 relative flex flex-col justify-between ${
              user.plan === 'Family' ? 'border-sky-500 ring-2 ring-sky-500/10' : 'border-slate-100'
            }`}>
              <div className="space-y-3">
                {user.plan === 'Family' && (
                  <span className="bg-sky-100 text-sky-800 font-black px-2 py-0.5 rounded text-[9px] uppercase tracking-wider absolute top-4 right-4">
                    Active
                  </span>
                )}
                <h3 className="text-sm font-black text-slate-800">Family Account</h3>
                <p className="text-2xl font-black text-slate-900">₹999 <span className="text-xs text-slate-400 font-semibold">/ month</span></p>
                <p className="text-[11px] text-slate-500 leading-normal">Full-spectrum medical coverage for up to 4 registered household members.</p>
                
                <ul className="space-y-2 text-xs font-semibold text-slate-600">
                  <li className="flex gap-2 items-center"><Check className="h-4 w-4 text-emerald-500" /> Up to 4 family profiles linked</li>
                  <li className="flex gap-2 items-center"><Check className="h-4 w-4 text-emerald-500" /> <strong>FREE Doctor consultations</strong></li>
                  <li className="flex gap-2 items-center"><Check className="h-4 w-4 text-emerald-500" /> Shared smart medical history locker</li>
                  <li className="flex gap-2 items-center"><Check className="h-4 w-4 text-emerald-500" /> 15% flat discount on diagnostic tests</li>
                </ul>
              </div>

              <button
                id="upgrade-family-btn"
                onClick={() => handleUpgradePlan('Family')}
                disabled={user.plan === 'Family'}
                className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all ${
                  user.plan === 'Family' 
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                    : 'bg-emerald-600 text-white hover:bg-emerald-700'
                }`}
              >
                {user.plan === 'Family' ? 'Current Plan' : 'Select Family'}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Tab 10: QR Clinic Sync */}
      {activeTab === 'qr-sync' && (
        <div id="tab-patient-qr-sync" className="space-y-6">
          <QrCodeScanner 
            onAddNotification={onAddNotification}
            onLinkPrescription={handleLinkPrescriptionFromQr}
            onLinkMedicine={handleLinkMedicineFromQr}
          />
        </div>
      )}

      {/* Tab 11: Telehealth Waiting Room */}
      {activeTab === 'waiting-room' && (
        <div id="tab-patient-waiting-room" className="space-y-6">
          <TelehealthWaitingRoom 
            appointments={appointments}
            onAddNotification={onAddNotification}
            onNavigateToTab={setActiveTab}
            onUpdateAppointmentStatus={(id, status) => {
              setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
            }}
          />
        </div>
      )}

      {/* Tab 12: Health Journey */}
      {activeTab === 'health-journey' && (
        <div id="tab-patient-health-journey" className="space-y-6">
          <HealthJourney onAddNotification={onAddNotification} />
        </div>
      )}

    </div>
  );
}
