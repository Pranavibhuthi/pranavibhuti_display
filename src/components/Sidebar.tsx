import React from 'react';
import { 
  Home, 
  Calendar, 
  Pill, 
  FlaskConical, 
  FolderLock, 
  FileText, 
  Bot, 
  Syringe, 
  Award, 
  LogOut, 
  LayoutDashboard, 
  Mic, 
  AlertCircle,
  QrCode,
  Video,
  Milestone
} from 'lucide-react';
import { Patient } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  role: 'patient' | 'doctor';
  user: Patient;
  onLogout: () => void;
  onVoiceTrigger: () => void;
  voiceListening: boolean;
}

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  role, 
  user, 
  onLogout,
  onVoiceTrigger,
  voiceListening
}: SidebarProps) {

  // Ocean blue for patient core, Green for doctor and sensitive tabs
  const patientNavItems = [
    { id: 'home', label: 'Home Dashboard', icon: Home, highlight: 'blue' },
    { id: 'assistant', label: 'AI Health Assistant', icon: Bot, highlight: 'green' },
    { id: 'appointments', label: 'Doctor Appointments', icon: Calendar, highlight: 'blue' },
    { id: 'waiting-room', label: 'Telehealth Waiting Room', icon: Video, highlight: 'blue' },
    { id: 'health-journey', label: 'Health Journey', icon: Milestone, highlight: 'blue' },
    { id: 'medicines', label: 'Medicine Delivery', icon: Pill, highlight: 'blue' },
    { id: 'lab-tests', label: 'Lab Tests & Scans', icon: FlaskConical, highlight: 'blue' },
    { id: 'locker', label: 'Health Locker (MFA)', icon: FolderLock, highlight: 'green' },
    { id: 'qr-sync', label: 'QR Clinic Sync', icon: QrCode, highlight: 'blue' },
    { id: 'prescriptions', label: 'Digital Prescriptions', icon: FileText, highlight: 'blue' },
    { id: 'vaccinations', label: 'Vaccination Centers', icon: Syringe, highlight: 'blue' },
    { id: 'plans', label: 'Health Plans', icon: Award, highlight: 'blue' },
  ];

  const doctorNavItems = [
    { id: 'doctor-dashboard', label: 'Doctor Dashboard', icon: LayoutDashboard, highlight: 'green' },
    { id: 'home', label: 'Switch to Patient View', icon: Home, highlight: 'blue' },
  ];

  const activeItems = role === 'patient' ? patientNavItems : doctorNavItems;

  return (
    <aside id="sidebar-container" className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-screen sticky top-0 shrink-0 text-white">
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-sky-500 to-emerald-500 flex items-center justify-center text-white font-black text-xl shadow-md shadow-sky-950/30">
            P
          </div>
          <div>
            <h1 className="text-lg font-extrabold tracking-tight text-white leading-tight">
              PRANA<span className="text-sky-400">VIBHUTI</span>
            </h1>
            <p className="text-[10px] text-sky-400 font-bold uppercase tracking-widest mt-1">
              Universal Health Portal
            </p>
          </div>
        </div>
      </div>

      {/* User Information Summary Card */}
      <div className="px-4 py-4 border-b border-slate-800 bg-slate-950/30">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-sky-950 text-sky-400 border border-sky-900/50 flex items-center justify-center font-bold text-sm">
            {user.name[0]}
          </div>
          <div className="min-w-0">
            <h3 className="text-xs font-bold text-white truncate">{user.name}</h3>
            <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold mt-0.5 ${
              role === 'doctor' 
                ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-900/50' 
                : 'bg-sky-950/60 text-sky-400 border border-sky-900/50'
            }`}>
              {role === 'doctor' ? 'Verified Doctor' : `${user.plan} Account`}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
        {activeItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          let btnClass = "";
          if (isActive) {
            btnClass = item.highlight === 'green'
              ? "bg-emerald-950/40 text-emerald-400 font-bold border-l-4 border-emerald-500"
              : "bg-sky-950/40 text-sky-400 font-bold border-l-4 border-sky-500";
          } else {
            btnClass = "text-slate-400 hover:bg-slate-800/40 hover:text-white";
          }

          return (
            <button
              id={`nav-tab-${item.id}`}
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all text-left ${btnClass}`}
            >
              <Icon className={`h-4.5 w-4.5 ${
                isActive 
                  ? item.highlight === 'green' ? 'text-emerald-400' : 'text-sky-400' 
                  : 'text-slate-500'
              }`} />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Voice Assistant Trigger Quick Bar */}
      <div className="p-4 border-t border-slate-800">
        <button
          id="sidebar-voice-btn"
          onClick={onVoiceTrigger}
          className={`w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-bold transition-all ${
            voiceListening 
              ? 'bg-rose-950/40 text-rose-400 border border-rose-900/50 animate-pulse'
              : 'bg-emerald-950/40 text-emerald-400 hover:bg-emerald-900/60 border border-emerald-900/50'
          }`}
        >
          <Mic className={`h-4 w-4 ${voiceListening ? 'animate-bounce text-rose-400' : 'text-emerald-400'}`} />
          {voiceListening ? "Listening Commands..." : "Voice Control (Indian)"}
        </button>
      </div>

      {/* Logout button */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/20">
        <button
          id="logout-btn"
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2 text-xs font-bold text-slate-400 hover:text-rose-400 transition-colors"
        >
          <LogOut className="h-4 w-4 text-slate-500" />
          <span>Logout Session</span>
        </button>
      </div>
    </aside>
  );
}
