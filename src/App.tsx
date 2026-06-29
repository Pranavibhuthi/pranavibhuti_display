import React, { useState } from 'react';
import { Patient, SymptomAssessmentAlert, Prescription, HealthLockerRecord } from './types';
import { mockPatient, mockSymptomAlerts } from './data';
import AuthScreen from './components/AuthScreen';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import VoiceAssistant from './components/VoiceAssistant';
import PatientPortal from './components/PatientPortal';
import DoctorPortal from './components/DoctorPortal';

export default function App() {
  // Authentication states
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState<'patient' | 'doctor'>('patient');
  const [currentUser, setCurrentUser] = useState<Patient>(mockPatient);

  // Layout states
  const [activeTab, setActiveTab] = useState('home');
  const [voiceListening, setVoiceListening] = useState(false);

  // Clinical Alerts logs for Doctor screening (seeded with realistic demo data)
  const [symptomAlerts, setSymptomAlerts] = useState<SymptomAssessmentAlert[]>(mockSymptomAlerts);

  // Real-time system notifications
  const [notifications, setNotifications] = useState<string[]>([
    "Welcome to PRANAVIBHUTI. Your national Aadhaar and ABHA card profiles are synced successfully.",
    "Certified Vaccine Center #14 Cold Storage IoT monitor: Cold chain optimal at 3.8°C.",
    "Premium plan diagnostic perk active: Doctor video consults are 100% free."
  ]);

  const handleLoginSuccess = (user: Patient, selectedRole: 'patient' | 'doctor') => {
    setCurrentUser(user);
    setRole(selectedRole);
    setIsAuthenticated(true);
    // If logging in as doctor, route to the doctor-dashboard immediately
    if (selectedRole === 'doctor') {
      setActiveTab('doctor-dashboard');
    } else {
      setActiveTab('home');
    }
    addNotification(`Logged in as ${selectedRole === 'doctor' ? 'Verified Physician' : user.name} (${user.plan} account). Session secured.`);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setVoiceListening(false);
  };

  const addNotification = (text: string) => {
    setNotifications(prev => [text, ...prev]);
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const handleDismissAlert = (id: string) => {
    setSymptomAlerts(prev => prev.map(a => a.id === id ? { ...a, dismissed: true } : a));
  };

  const handleLogSymptomAlert = (newAlert: SymptomAssessmentAlert) => {
    setSymptomAlerts(prev => [newAlert, ...prev]);
  };

  const handleAddPrescription = (newRx: Prescription) => {
    // This can update standard lists, and notify
    addNotification(`New Rx formulated for ${newRx.patientName}. Digital footprint signed.`);
  };

  const handleAddLockerRecord = (newRec: HealthLockerRecord) => {
    addNotification(`EHR item "${newRec.title}" successfully committed to Patient Vault.`);
  };

  // Toggle voice recognition simulate/trigger in Sidebar
  const triggerVoiceAssistant = () => {
    setVoiceListening(prev => !prev);
  };

  if (!isAuthenticated) {
    return <AuthScreen onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div id="app-root-frame" className="min-h-screen bg-[#020617] flex font-sans overflow-hidden text-white">
      
      {/* Sidebar - highlighted in ocean blue / green */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setVoiceListening(false);
        }} 
        role={role} 
        user={currentUser} 
        onLogout={handleLogout}
        onVoiceTrigger={triggerVoiceAssistant}
        voiceListening={voiceListening}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Top Header */}
        <Header 
          user={currentUser} 
          role={role} 
          onRoleSwitch={(newRole) => {
            setRole(newRole);
            if (newRole === 'doctor') {
              setActiveTab('doctor-dashboard');
            } else {
              setActiveTab('home');
            }
          }} 
          notifications={notifications}
          onClearNotifications={clearNotifications}
        />

        {/* Dynamic Multi-lingual Voice Command panel (Shows as banner when listening is requested) */}
        {voiceListening && (
          <div className="px-8 pt-4 pb-0 bg-[#020617] animate-slide-down">
            <VoiceAssistant 
              currentTab={activeTab} 
              onNavigate={(tab) => {
                setActiveTab(tab);
                setVoiceListening(false);
              }} 
              onAddNotification={addNotification} 
            />
          </div>
        )}

        {/* Dynamic view router */}
        <main className="flex-1 overflow-hidden flex flex-col">
          {role === 'patient' ? (
            <PatientPortal 
              user={currentUser}
              onUpdateUser={setCurrentUser}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              onAddNotification={addNotification}
              onLogSymptomAlert={handleLogSymptomAlert}
            />
          ) : (
            <DoctorPortal 
              symptomAlerts={symptomAlerts}
              onDismissAlert={handleDismissAlert}
              onAddPrescription={handleAddPrescription}
              onAddLockerRecord={handleAddLockerRecord}
              onAddNotification={addNotification}
            />
          )}
        </main>
      </div>
    </div>
  );
}
