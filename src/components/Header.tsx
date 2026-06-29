import React, { useState } from 'react';
import { Bell, ShieldCheck, Heart, User, AlertTriangle, PhoneCall } from 'lucide-react';
import { Patient } from '../types';

interface HeaderProps {
  user: Patient;
  role: 'patient' | 'doctor';
  onRoleSwitch: (role: 'patient' | 'doctor') => void;
  notifications: string[];
  onClearNotifications: () => void;
}

export default function Header({ 
  user, 
  role, 
  onRoleSwitch, 
  notifications,
  onClearNotifications
}: HeaderProps) {
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);

  return (
    <header id="header-container" className="bg-slate-900 border-b border-slate-800 h-16 px-8 flex items-center justify-between sticky top-0 z-40 text-white">
      
      {/* Verification Status Banner */}
      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-2 bg-emerald-950/60 text-emerald-400 px-3 py-1 rounded-full border border-emerald-900/50 text-xs font-semibold">
          <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>Aadhaar Link: {user.aadhaarNo}</span>
        </div>
        <div className="hidden lg:flex items-center gap-2 bg-sky-950/60 text-sky-400 px-3 py-1 rounded-full border border-sky-900/50 text-xs font-semibold">
          <Heart className="h-4 w-4 text-sky-400 shrink-0" />
          <span>Health Card ID: {user.healthCardId}</span>
        </div>
      </div>

      {/* Utilities */}
      <div className="flex items-center gap-4">
        
        {/* Quick Emergency Button */}
        <button
          id="header-emergency-btn"
          onClick={() => setShowEmergencyModal(true)}
          className="flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-none"
        >
          <PhoneCall className="h-3.5 w-3.5 animate-bounce" />
          <span>Emergency Support</span>
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            id="notification-bell-btn"
            onClick={() => setShowNotifDropdown(!showNotifDropdown)}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg relative transition-all"
          >
            <Bell className="h-5 w-5" />
            {notifications.length > 0 && (
              <span className="absolute top-1 right-1 h-2.5 w-2.5 bg-rose-500 rounded-full border-2 border-slate-900" />
            )}
          </button>

          {showNotifDropdown && (
            <div id="notification-dropdown" className="absolute right-0 mt-2 w-80 bg-slate-900 rounded-xl shadow-2xl border border-slate-800 py-2 z-50">
              <div className="px-4 py-2 border-b border-slate-800 flex items-center justify-between">
                <span className="text-xs font-bold text-white">Real-time Notifications</span>
                {notifications.length > 0 && (
                  <button 
                    id="clear-notifications-btn"
                    onClick={onClearNotifications} 
                    className="text-[10px] text-sky-400 font-semibold hover:underline"
                  >
                    Clear all
                  </button>
                )}
              </div>
              <div className="max-h-60 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-slate-500 text-xs">
                    No new system alerts or vaccine reminders.
                  </div>
                ) : (
                  notifications.map((notif, idx) => (
                    <div key={idx} className="p-3 border-b border-slate-800/50 text-xs text-slate-300 leading-relaxed hover:bg-slate-800/40 flex gap-2">
                      <div className="h-2 w-2 rounded-full bg-sky-500 mt-1.5 shrink-0" />
                      <span>{notif}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Workspace Toggle (For quick platform demoing) */}
        <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800">
          <button
            id="header-role-patient"
            onClick={() => onRoleSwitch('patient')}
            className={`px-2.5 py-1 rounded text-[10px] font-bold transition-all ${
              role === 'patient' 
                ? 'bg-sky-500 text-white shadow' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Patient Work
          </button>
          <button
            id="header-role-doctor"
            onClick={() => onRoleSwitch('doctor')}
            className={`px-2.5 py-1 rounded text-[10px] font-bold transition-all ${
              role === 'doctor' 
                ? 'bg-emerald-500 text-white shadow' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Doctor Work
          </button>
        </div>
      </div>

      {/* Emergency Modal */}
      {showEmergencyModal && (
        <div id="emergency-modal" className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-800 relative text-white">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 bg-rose-950/60 text-rose-400 flex items-center justify-center rounded-xl border border-rose-900/50 shrink-0">
                <AlertTriangle className="h-6 w-6 animate-pulse" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Emergency Response System</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Pranavibhuti offers immediate crisis dispatch. Please select a quick command below or contact regional emergency lines directly.
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <div className="p-3 bg-rose-950/40 rounded-lg border border-rose-900/50 flex items-center justify-between text-xs text-rose-300">
                <span className="font-bold">Anaphylaxis Response Dispatch</span>
                <span className="font-mono bg-rose-900/20 px-1.5 py-0.5 rounded text-[10px]">Active</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-normal">
                If experiencing an severe allergic reaction to any vaccine or medication, activate our immediate anaphylaxis responder protocol. A responder with epinephrine (Adrenaline) will be dispatched to your location instantly.
              </p>

              <div className="grid grid-cols-2 gap-3 mt-4">
                <a 
                  href="tel:108" 
                  className="bg-rose-600 hover:bg-rose-700 text-white py-2.5 px-4 rounded-lg font-bold text-xs text-center block"
                >
                  Dial 108 Emergency
                </a>
                <button
                  id="anaphylaxis-dispatch-btn"
                  onClick={() => {
                    alert("Emergency Anaphylaxis response crew has been notified and dispatched to your GPS coordinates!");
                    setShowEmergencyModal(false);
                  }}
                  className="bg-white hover:bg-slate-100 text-slate-950 py-2.5 px-4 rounded-lg font-black text-xs"
                >
                  Dispatch Epi-Team
                </button>
              </div>
            </div>

            <button
              id="emergency-close-btn"
              onClick={() => setShowEmergencyModal(false)}
              className="mt-4 w-full py-2 border border-slate-800 hover:bg-slate-800 rounded-lg text-slate-300 text-xs font-bold"
            >
              Cancel Emergency Panel
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
