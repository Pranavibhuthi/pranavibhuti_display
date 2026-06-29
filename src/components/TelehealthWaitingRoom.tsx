import React, { useState, useEffect, useRef } from 'react';
import { 
  Video, 
  Users, 
  Clock, 
  Activity, 
  ShieldAlert, 
  Volume2, 
  VolumeX, 
  VideoOff, 
  PhoneOff, 
  CheckCircle, 
  ArrowRight, 
  Loader2, 
  Play, 
  MapPin, 
  Send,
  MessageSquare,
  BadgeAlert,
  Sparkles,
  Award,
  Lock,
  Compass,
  AlertCircle,
  FileText
} from 'lucide-react';
import { Appointment } from '../types';

interface TelehealthWaitingRoomProps {
  appointments: Appointment[];
  onAddNotification: (notif: string) => void;
  onNavigateToTab: (tab: string) => void;
  onUpdateAppointmentStatus: (id: string, status: 'Booked' | 'Completed' | 'Cancelled') => void;
}

interface ChatMessage {
  sender: 'doctor' | 'patient';
  text: string;
  time: string;
}

export function TelehealthWaitingRoom({
  appointments,
  onAddNotification,
  onNavigateToTab,
  onUpdateAppointmentStatus
}: TelehealthWaitingRoomProps) {
  // Find upcoming video appointments
  const videoAppointments = appointments.filter(a => a.type === 'Video' && a.status === 'Booked');
  
  const [selectedAptId, setSelectedAptId] = useState<string>(() => {
    return videoAppointments[0]?.id || '';
  });

  // Automatically select the first upcoming video appointment if none selected
  useEffect(() => {
    if (!selectedAptId && videoAppointments.length > 0) {
      setSelectedAptId(videoAppointments[0].id);
    }
  }, [videoAppointments, selectedAptId]);

  const selectedApt = appointments.find(a => a.id === selectedAptId);

  // Connection State: 'offline' | 'connecting' | 'queueing' | 'ready' | 'active' | 'completed'
  const [connectionStatus, setConnectionStatus] = useState<'offline' | 'connecting' | 'queueing' | 'ready' | 'active' | 'completed'>('offline');
  
  // Queue Simulation State
  const [queuePosition, setQueuePosition] = useState(3);
  const [estimatedWait, setEstimatedWait] = useState(12); // minutes
  const [activeQueuePatients, setActiveQueuePatients] = useState<string[]>([
    "S. Mukherjee (Cardiac Review)",
    "P. Deshmukh (Follow-up Check)",
    "R. Sen (Hypertension Assessment)"
  ]);

  // Video Call Controls
  const [audioMuted, setAudioMuted] = useState(false);
  const [videoDisabled, setVideoDisabled] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  
  // Chat during call
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { sender: 'doctor', text: "Hello Rajesh! I am wrapping up my previous patient. Please review your baseline metrics on-screen.", time: "11:43 AM" }
  ]);
  const [newMessage, setNewMessage] = useState('');
  
  // Handshake Handlers
  const handleJoinWaitingRoom = () => {
    if (!selectedApt) return;
    setConnectionStatus('connecting');
    onAddNotification(`Connecting to Virtual Secure Gateway for consultation with ${selectedApt.doctorName}...`);
    
    // Simulate Webrtc connection
    setTimeout(() => {
      setConnectionStatus('queueing');
      setQueuePosition(3);
      setEstimatedWait(12);
      setActiveQueuePatients([
        "S. Mukherjee (Cardiac Review)",
        "P. Deshmukh (Follow-up Check)",
        "R. Sen (Hypertension Assessment)"
      ]);
      onAddNotification("Registered securely in Doctor's virtual consultation queue.");
    }, 2000);
  };

  // Simulate queue progression
  const handleAdvanceQueue = () => {
    if (queuePosition > 1) {
      const nextPos = queuePosition - 1;
      const nextWait = Math.max(2, estimatedWait - 4);
      setQueuePosition(nextPos);
      setEstimatedWait(nextWait);
      
      // Shift patient list
      setActiveQueuePatients(prev => prev.slice(1));
      
      onAddNotification(`Queue advanced! Your position is now #${nextPos}. Estimated wait: ${nextWait} mins.`);
    } else if (queuePosition === 1) {
      setQueuePosition(0);
      setEstimatedWait(0);
      setConnectionStatus('ready');
      onAddNotification(`Dr. ${selectedApt?.doctorName.split(' ').pop()} is ready to see you now! Please enter the consult room.`);
    }
  };

  const handleStartConsultation = () => {
    setConnectionStatus('active');
    onAddNotification("Secure video call initialized. HIPAA compliant WebRTC link is active.");
    
    // Auto post doctor greeting after 3 seconds
    setTimeout(() => {
      setChatMessages(prev => [
        ...prev,
        { sender: 'doctor', text: "Hello Rajesh! Good to connect with you. I see your Apollo Clinics premium card is fully linked. How have your chest palpitations been since we adjusted your Metoprolol dosage?", time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
      ]);
    }, 3000);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    const msg: ChatMessage = {
      sender: 'patient',
      text: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setChatMessages([...chatMessages, msg]);
    setNewMessage('');

    // Doctor auto replies
    setTimeout(() => {
      setChatMessages(prev => [
        ...prev,
        { 
          sender: 'doctor', 
          text: "Excellent details. I will write a revised digital prescription right away. Let's make sure you book another assessment next fortnight.", 
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
        }
      ]);
    }, 2500);
  };

  const handleCompleteConsultation = () => {
    if (!selectedApt) return;
    
    onUpdateAppointmentStatus(selectedApt.id, 'Completed');
    setConnectionStatus('completed');
    onAddNotification(`Virtual visit with ${selectedApt.doctorName} successfully concluded.`);
    
    // Mock prescription payload integration
    const savedPrescriptions = localStorage.getItem('pranavibhuti_prescriptions');
    let prescriptionsList = [];
    if (savedPrescriptions) {
      try { prescriptionsList = JSON.parse(savedPrescriptions); } catch (e) {}
    }
    
    const newRx = {
      id: "RX-TH-" + Math.floor(1000 + Math.random() * 9000),
      doctorName: selectedApt.doctorName,
      specialty: selectedApt.specialty,
      date: new Date().toISOString().split('T')[0],
      patientName: "Rajesh Kumar",
      symptoms: "Telehealth Review - Sinus arrhythmia tracking",
      medications: [
        { name: "Metoprolol Succinate", dosage: "50mg (Increased)", frequency: "Once daily", duration: "14 Days" },
        { name: "Ivabradine", dosage: "5mg", frequency: "Twice daily", duration: "7 Days" }
      ],
      instructions: "BP and Pulse checking remains vital. Stop metoprolol and consult if heart rate falls below 55 BPM.",
      signatureCode: "SIG-TELE-MFA-" + Math.floor(10000 + Math.random() * 90000)
    };

    prescriptionsList.unshift(newRx);
    localStorage.setItem('pranavibhuti_prescriptions', JSON.stringify(prescriptionsList));
  };

  const handleReset = () => {
    setConnectionStatus('offline');
    setQueuePosition(3);
    setEstimatedWait(12);
    setChatMessages([
      { sender: 'doctor', text: "Hello Rajesh! I am wrapping up my previous patient. Please review your baseline metrics on-screen.", time: "11:43 AM" }
    ]);
  };

  return (
    <div id="telehealth-waiting-room" className="space-y-6">
      
      {/* Title Header with Subscriptions Link */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 bg-slate-900 border border-slate-850 rounded-2xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-sky-500/20 text-sky-400">
              <Video className="h-5 w-5" />
            </span>
            <h2 className="text-base font-black text-white uppercase tracking-wider">Telehealth Virtual Consultation Room</h2>
          </div>
          <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
            Secure, end-to-end encrypted virtual outpatient rooms. Syncs in real-time with clinic schemes, prescriptions, and your secure health locker logs.
          </p>
        </div>
        
        {/* Active Session Indicator */}
        <div className="flex items-center gap-3 bg-slate-950 px-4 py-2 rounded-xl border border-slate-800 text-xs shrink-0">
          <div className={`h-2.5 w-2.5 rounded-full ${connectionStatus === 'active' ? 'bg-rose-500 animate-ping' : connectionStatus === 'queueing' ? 'bg-amber-500' : connectionStatus === 'ready' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-700'}`} />
          <span className="text-[10px] text-slate-400 uppercase tracking-widest font-black">
            Status: <span className="text-white font-mono">{connectionStatus.toUpperCase()}</span>
          </span>
        </div>
      </div>

      {/* Select consultation to proceed */}
      {connectionStatus === 'offline' && (
        <div className="max-w-2xl mx-auto text-center space-y-6 py-10 bg-slate-900 border border-slate-800 rounded-3xl p-8">
          <div className="h-16 w-16 rounded-3xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center mx-auto shadow-lg">
            <Video className="h-8 w-8" />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-base font-extrabold text-white">Choose Scheduled Consultation</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
              Select one of your upcoming telehealth video bookings below to connect with the virtual triage server and register in the patient queue.
            </p>
          </div>

          {videoAppointments.length === 0 ? (
            <div className="space-y-4">
              <p className="text-xs text-slate-400 italic bg-slate-950 p-4 rounded-xl border border-slate-850">
                You have no upcoming video appointments booked. You can book a consultation instantly inside our portal.
              </p>
              <button
                onClick={() => onNavigateToTab('appointments')}
                className="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-black transition-colors inline-flex items-center gap-1.5 cursor-pointer"
              >
                Book Consultation Now <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="space-y-4 max-w-md mx-auto">
              <select
                value={selectedAptId}
                onChange={(e) => setSelectedAptId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer"
              >
                {videoAppointments.map((apt) => (
                  <option key={apt.id} value={apt.id}>
                    {apt.doctorName} ({apt.specialty}) — {apt.date} at {apt.time}
                  </option>
                ))}
              </select>

              <button
                onClick={handleJoinWaitingRoom}
                className="w-full py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-black transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Play className="h-4 w-4 fill-white" /> Connect & Enter Waiting Room
              </button>
            </div>
          )}
        </div>
      )}

      {/* Connecting Animation */}
      {connectionStatus === 'connecting' && (
        <div className="max-w-md mx-auto text-center space-y-4 py-16 bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
          <Loader2 className="h-10 w-10 text-sky-500 animate-spin mx-auto" />
          <div className="space-y-1">
            <h3 className="text-sm font-black text-white">Establishing Encrypted Connection</h3>
            <p className="text-[10px] text-slate-400 font-mono">HANDSHAKE_STATE: WEBRTC_ICE_GATHERING</p>
          </div>
          <div className="bg-slate-950 border border-slate-850 rounded-xl p-3 text-[10px] text-slate-400 leading-normal max-w-xs mx-auto">
            Configuring TURN servers, validating Pranavibhuti authentication certificates, and placing you in queue...
          </div>
        </div>
      )}

      {/* Main waiting room view: queue, metrics, visualizer */}
      {(connectionStatus === 'queueing' || connectionStatus === 'ready') && selectedApt && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Visual Queue Progression (Col 1-7) */}
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6 flex flex-col justify-between">
            <div className="space-y-5">
              <div className="border-b border-slate-800 pb-4 flex justify-between items-center">
                <div>
                  <h4 className="font-extrabold text-sm text-white flex items-center gap-1.5">
                    <Users className="h-4 w-4 text-sky-400" />
                    Patient Consultation Queue
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Real-time outpatient routing visualizer for Dr. {selectedApt.doctorName.split(' ').pop()}</p>
                </div>
                
                {/* Simulated Triage Controller */}
                <button
                  onClick={handleAdvanceQueue}
                  className="px-3 py-1.5 bg-sky-600/10 hover:bg-sky-600 text-sky-400 hover:text-white border border-sky-500/20 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1"
                >
                  <Activity className="h-3.5 w-3.5 animate-pulse" /> Simulate Triage Advance
                </button>
              </div>

              {/* Queue Visualizer: horizontal timeline representation */}
              <div className="bg-slate-950 border border-slate-850 rounded-2xl p-6 relative overflow-hidden space-y-6">
                
                {/* Horizontal Timeline Connector */}
                <div className="absolute top-[52px] left-8 right-8 h-0.5 bg-slate-800 z-0" />

                <div className="grid grid-cols-4 gap-4 relative z-10">
                  
                  {/* Slot 1: Active In-Consultation */}
                  <div className="flex flex-col items-center text-center space-y-2">
                    <div className="h-10 w-10 rounded-full bg-emerald-500/15 text-emerald-400 border-2 border-emerald-500 flex items-center justify-center font-black text-xs shadow-md shadow-emerald-500/20 relative">
                      <Video className="h-4 w-4" />
                      <span className="absolute -top-1 -right-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                      </span>
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-emerald-400 uppercase tracking-wider">Live Checkup</p>
                      <p className="text-[10px] font-bold text-white truncate max-w-[80px] mt-0.5">
                        {queuePosition === 3 ? "A. Sharma" : queuePosition === 2 ? "S. Mukherjee" : queuePosition === 1 ? "P. Deshmukh" : "R. Sen"}
                      </p>
                    </div>
                  </div>

                  {/* Slot 2: Position 1 ahead */}
                  <div className="flex flex-col items-center text-center space-y-2">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center font-black text-xs border-2 transition-all ${
                      queuePosition === 1 
                        ? 'bg-sky-500/20 text-sky-400 border-sky-400 animate-pulse scale-105' 
                        : 'bg-slate-900 text-slate-400 border-slate-800'
                    }`}>
                      {queuePosition === 1 ? "YOU" : "Q1"}
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-slate-500 uppercase">Queue Pos 1</p>
                      <p className="text-[10px] font-bold text-white truncate max-w-[80px] mt-0.5">
                        {queuePosition === 1 ? "Rajesh Kumar" : queuePosition === 3 ? "S. Mukherjee" : "P. Deshmukh"}
                      </p>
                    </div>
                  </div>

                  {/* Slot 3: Position 2 ahead */}
                  <div className="flex flex-col items-center text-center space-y-2">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center font-black text-xs border-2 transition-all ${
                      queuePosition === 2 
                        ? 'bg-sky-500/20 text-sky-400 border-sky-400 animate-pulse scale-105' 
                        : 'bg-slate-900 text-slate-400 border-slate-800'
                    }`}>
                      {queuePosition === 2 ? "YOU" : "Q2"}
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-slate-500 uppercase">Queue Pos 2</p>
                      <p className="text-[10px] font-bold text-white truncate max-w-[80px] mt-0.5">
                        {queuePosition === 2 ? "Rajesh Kumar" : queuePosition === 3 ? "P. Deshmukh" : "R. Sen"}
                      </p>
                    </div>
                  </div>

                  {/* Slot 4: Position 3 ahead */}
                  <div className="flex flex-col items-center text-center space-y-2">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center font-black text-xs border-2 transition-all ${
                      queuePosition === 3 
                        ? 'bg-sky-500/20 text-sky-400 border-sky-400 animate-pulse scale-105' 
                        : 'bg-slate-900 text-slate-400 border-slate-800'
                    }`}>
                      {queuePosition === 3 ? "YOU" : "Q3"}
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-slate-500 uppercase">Queue Pos 3</p>
                      <p className="text-[10px] font-bold text-white truncate max-w-[80px] mt-0.5">
                        {queuePosition === 3 ? "Rajesh Kumar" : "R. Sen"}
                      </p>
                    </div>
                  </div>

                </div>
              </div>

              {/* Status messages based on queue standing */}
              {connectionStatus === 'queueing' && (
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 flex items-start gap-3">
                  <BadgeAlert className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-white">Estimated wait is {estimatedWait} minutes.</p>
                    <p className="text-[10px] text-slate-400 leading-relaxed">
                      Please don't close this tab. You are currently number <strong className="text-sky-400">#{queuePosition}</strong> in the active consultation docket. Dr. {selectedApt.doctorName.split(' ').pop()} is reviewing chronic heart logs right now.
                    </p>
                  </div>
                </div>
              )}

              {connectionStatus === 'ready' && (
                <div className="bg-emerald-500/10 border-2 border-emerald-500/40 p-4 rounded-xl flex items-start gap-3 animate-bounce">
                  <Sparkles className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-xs font-black text-emerald-400 uppercase tracking-wider">Consultation Room Unlocked!</p>
                    <p className="text-[10px] text-emerald-300">
                      There are no more patients ahead of you. Dr. {selectedApt.doctorName} is waiting.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom action trigger */}
            <div className="pt-4 border-t border-slate-800 flex justify-between items-center">
              <button
                onClick={handleReset}
                className="text-[10px] text-slate-500 hover:text-white hover:underline uppercase tracking-wider font-bold cursor-pointer"
              >
                Disconnect & Back
              </button>

              {connectionStatus === 'ready' ? (
                <button
                  onClick={handleStartConsultation}
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-xl cursor-pointer shadow-lg shadow-emerald-950/40 flex items-center gap-1.5 animate-pulse"
                >
                  <Video className="h-4 w-4 fill-white" /> Start Consultation Call Now
                </button>
              ) : (
                <div className="text-[10px] text-slate-500 font-mono">
                  AUTO_RELOAD: ON (2s poll)
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Telemetry & Consultation summary details (Col 8-12) */}
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="border-b border-slate-800 pb-3">
                <h4 className="font-extrabold text-sm text-white flex items-center gap-1.5">
                  <Activity className="h-4 w-4 text-emerald-400" />
                  Consultation Telemetry
                </h4>
                <p className="text-[10px] text-slate-400 mt-0.5">Live outpatient stats & secure patient ledger check</p>
              </div>

              {/* Doctor card */}
              <div className="bg-slate-950 border border-slate-850 rounded-2xl p-4 flex items-center gap-3">
                <div className="h-12 w-12 bg-sky-500/10 text-sky-400 border border-sky-500/20 rounded-xl flex items-center justify-center font-black text-base shrink-0">
                  {selectedApt.doctorName.split(' ').pop()?.substring(0, 2).toUpperCase() || "DR"}
                </div>
                <div>
                  <h5 className="font-black text-white text-xs">{selectedApt.doctorName}</h5>
                  <p className="text-[9px] text-sky-400 font-bold uppercase tracking-wider">{selectedApt.specialty}</p>
                  <p className="text-[9px] text-slate-400">Scheduled: Today, {selectedApt.time}</p>
                </div>
              </div>

              {/* Live telemetry items */}
              <div className="space-y-2.5">
                <div className="flex justify-between items-center text-[10px] p-2 bg-slate-950 rounded-lg border border-slate-850">
                  <span className="text-slate-400 font-medium">Outpatient Token ID</span>
                  <span className="font-mono text-white font-bold">{selectedApt.id}</span>
                </div>
                <div className="flex justify-between items-center text-[10px] p-2 bg-slate-950 rounded-lg border border-slate-850">
                  <span className="text-slate-400 font-medium">Muted Bandwidth Cost</span>
                  <span className="text-emerald-400 font-bold uppercase tracking-wider">Free (Plan Benefit)</span>
                </div>
                <div className="flex justify-between items-center text-[10px] p-2 bg-slate-950 rounded-lg border border-slate-850">
                  <span className="text-slate-400 font-medium">Linked Regional Cards</span>
                  <span className="text-sky-400 font-bold">1 Physical Card Linked</span>
                </div>
                <div className="flex justify-between items-center text-[10px] p-2 bg-slate-950 rounded-lg border border-slate-850">
                  <span className="text-slate-400 font-medium">Secure Handshake Scheme</span>
                  <span className="text-slate-300 font-mono">TLS 1.3 / SRTP Encrypted</span>
                </div>
              </div>

              {/* Patient Ahead List */}
              <div className="space-y-2">
                <span className="text-[9px] text-slate-500 font-black uppercase tracking-wider">Queue Schedule Ahead</span>
                {activeQueuePatients.length === 0 ? (
                  <p className="text-[10px] text-emerald-400 font-bold italic">No more patients ahead. You are next!</p>
                ) : (
                  <div className="space-y-1.5 max-h-[110px] overflow-y-auto pr-1">
                    {activeQueuePatients.map((pat, index) => (
                      <div key={index} className="flex justify-between items-center text-[10px] p-2 bg-slate-950 rounded-lg border border-slate-850 text-slate-400">
                        <span className="truncate max-w-[180px]">{pat}</span>
                        <span className="bg-slate-900 text-slate-500 px-1 rounded text-[8px] font-bold">POS {index + 1}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-850 text-[10px] text-slate-400 leading-normal">
              <span className="font-black text-white block uppercase text-[8px] tracking-wider mb-1">Queue Handshake</span>
              Queue numbers are assigned strictly by biometric card scan time or digital consultation booking priority.
            </div>
          </div>
        </div>
      )}

      {/* Live Active Video Call Screen */}
      {connectionStatus === 'active' && selectedApt && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Split-Screen Webcams Video Feed (Col 1-8) */}
          <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5 flex flex-col justify-between">
            
            {/* Header with status */}
            <div className="border-b border-slate-800 pb-3 flex justify-between items-center">
              <div>
                <h4 className="font-extrabold text-sm text-white flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping" />
                  Live Secured Telehealth Call
                </h4>
                <p className="text-[10px] text-slate-400 mt-0.5">HIPAA-Compliant Encrypted consultation with {selectedApt.doctorName}</p>
              </div>

              <div className="text-[10px] bg-slate-950 border border-slate-850 rounded px-2.5 py-1 font-mono text-emerald-400">
                STABLE_HD // 1080p // 60 FPS
              </div>
            </div>

            {/* Video Frame Canvas (Split-Screen) */}
            <div className="relative aspect-video bg-slate-950 rounded-2xl overflow-hidden border border-slate-850 flex items-center justify-center">
              
              {/* Doctor Large Video Feed */}
              <div className="absolute inset-0 flex items-center justify-center">
                {!videoDisabled ? (
                  <div className="w-full h-full relative">
                    <img 
                      src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=800" 
                      alt={selectedApt.doctorName} 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover brightness-95"
                    />
                    
                    {/* Dr overlay */}
                    <div className="absolute bottom-4 left-4 bg-slate-950/80 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-slate-800 text-[10px] text-white font-extrabold flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 bg-rose-500 rounded-full animate-pulse" />
                      {selectedApt.doctorName} (On Call)
                    </div>
                  </div>
                ) : (
                  <div className="text-center space-y-2">
                    <VideoOff className="h-10 w-10 text-slate-600 mx-auto" />
                    <p className="text-xs text-slate-400 font-bold">Doctor's Video Stream Paused</p>
                  </div>
                )}
              </div>

              {/* Patient Corner Picture-in-Picture Frame */}
              <div className="absolute top-4 right-4 w-32 sm:w-40 aspect-video bg-slate-900 rounded-xl border border-slate-800 overflow-hidden shadow-2xl relative z-10">
                <div className="w-full h-full bg-gradient-to-br from-slate-950 to-slate-900 flex items-center justify-center">
                  {/* Since actual camera depends on iframe permissions, mock elegant overlay or display real-time simulation */}
                  <div className="text-center p-2">
                    <div className="h-8 w-8 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center mx-auto text-xs font-black">
                      RK
                    </div>
                    <p className="text-[9px] text-slate-400 font-extrabold mt-1">You (Rajesh Kumar)</p>
                  </div>
                </div>
                
                {/* PIP stream indicator */}
                <span className="absolute bottom-1.5 left-1.5 bg-slate-950/70 px-1 py-0.2 rounded text-[7px] text-emerald-400 font-bold">
                  Self-Feed
                </span>
              </div>

              {/* Shared Screen overlay if active */}
              {isScreenSharing && (
                <div className="absolute inset-0 bg-slate-950/90 flex flex-col justify-center items-center z-20 p-6 text-center space-y-4">
                  <div className="h-12 w-12 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20 flex items-center justify-center">
                    <Activity className="h-6 w-6 animate-pulse" />
                  </div>
                  <div>
                    <h5 className="font-extrabold text-sm text-white">Sharing Medical Locker Logs</h5>
                    <p className="text-[10px] text-slate-400 max-w-sm mx-auto leading-relaxed mt-1">
                      Doctor is securely viewing your active medications list and synced lab summaries via HIPAA screen-pipe.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsScreenSharing(false)}
                    className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-[10px] font-bold"
                  >
                    Stop Share Logs
                  </button>
                </div>
              )}

            </div>

            {/* Video Action Call Panel controls */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850 flex flex-wrap justify-between items-center gap-4">
              
              {/* Media controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setAudioMuted(!audioMuted)}
                  className={`p-2.5 rounded-xl cursor-pointer transition-colors ${audioMuted ? 'bg-rose-600 hover:bg-rose-700 text-white' : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'}`}
                  title={audioMuted ? "Unmute Mic" : "Mute Mic"}
                >
                  {audioMuted ? <VolumeX className="h-4.5 w-4.5" /> : <Volume2 className="h-4.5 w-4.5" />}
                </button>

                <button
                  onClick={() => setVideoDisabled(!videoDisabled)}
                  className={`p-2.5 rounded-xl cursor-pointer transition-colors ${videoDisabled ? 'bg-rose-600 hover:bg-rose-700 text-white' : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'}`}
                  title={videoDisabled ? "Enable Video" : "Disable Video"}
                >
                  {videoDisabled ? <VideoOff className="h-4.5 w-4.5" /> : <Video className="h-4.5 w-4.5" />}
                </button>

                <button
                  onClick={() => setIsScreenSharing(!isScreenSharing)}
                  className={`px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider cursor-pointer transition-colors ${isScreenSharing ? 'bg-sky-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'}`}
                >
                  {isScreenSharing ? "Sharing Logs" : "Share Medical Logs"}
                </button>
              </div>

              {/* Status information */}
              <div className="text-[10px] text-slate-400 leading-normal hidden sm:block">
                <span className="font-extrabold text-white block">Secure Session</span>
                ID: {selectedApt.id} • Call Duration: 04:32
              </div>

              {/* Conclude consultation */}
              <button
                onClick={handleCompleteConsultation}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-black transition-colors flex items-center gap-1.5 cursor-pointer shadow-lg shadow-rose-950/30"
              >
                <PhoneOff className="h-4 w-4" /> Disconnect & Conclude Call
              </button>

            </div>

          </div>

          {/* Right Column: Encrypted Consultation Chat & Prescription generation (Col 9-12) */}
          <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4 flex flex-col justify-between h-[520px]">
            
            <div className="space-y-3 flex-1 flex flex-col">
              <div className="border-b border-slate-800 pb-3">
                <h4 className="font-extrabold text-xs text-white flex items-center gap-1.5 uppercase tracking-wider">
                  <MessageSquare className="h-4 w-4 text-sky-400" />
                  Visit Consultation Chat
                </h4>
                <p className="text-[9px] text-slate-400 mt-0.5">Encrypted messenger with Dr. {selectedApt.doctorName.split(' ').pop()}</p>
              </div>

              {/* Chat Feed */}
              <div className="flex-1 overflow-y-auto space-y-3 pr-1 min-h-[220px]">
                {chatMessages.map((msg, i) => {
                  const isDoc = msg.sender === 'doctor';
                  return (
                    <div key={i} className={`flex flex-col ${isDoc ? 'items-start' : 'items-end'}`}>
                      <div className={`p-3 rounded-2xl max-w-[85%] text-[10.5px] leading-relaxed ${
                        isDoc 
                          ? 'bg-slate-950 text-slate-200 border border-slate-850 rounded-tl-none' 
                          : 'bg-sky-600 text-white rounded-tr-none'
                      }`}>
                        {msg.text}
                      </div>
                      <span className="text-[8px] text-slate-500 mt-0.5 px-1">{msg.time}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Input Form */}
            <form onSubmit={handleSendMessage} className="flex gap-2 border-t border-slate-800 pt-3">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type response to Dr..."
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-sky-500"
              />
              <button
                type="submit"
                className="p-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl transition-colors cursor-pointer"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>

          </div>
        </div>
      )}

      {/* Visited & Completed Consultation report state */}
      {connectionStatus === 'completed' && selectedApt && (
        <div className="max-w-2xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center space-y-6 shadow-2xl animate-fade-in">
          <div className="h-16 w-16 bg-emerald-500/10 border-2 border-emerald-500 text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-950/20">
            <CheckCircle className="h-8 w-8" />
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-black text-white">Consultation Report Sync Completed</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
              Your virtual outpatient visit with <strong>{selectedApt.doctorName}</strong> has been successfully archived. Prescriptions and medical locker records have been updated automatically.
            </p>
          </div>

          {/* Sync status cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto text-left">
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850 space-y-2">
              <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest block">Digital Record Updated</span>
              <p className="text-[11px] font-bold text-white">Digital Prescription Generated</p>
              <p className="text-[10px] text-slate-400 leading-normal">
                Metoprolol Succinate dosage is updated. Available inside digital prescription ledger.
              </p>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850 space-y-2">
              <span className="text-[10px] font-black text-sky-400 uppercase tracking-widest block">Locker Archive Updated</span>
              <p className="text-[11px] font-bold text-white">Locker Token ID: LOCK-RX-{selectedApt.id}</p>
              <p className="text-[10px] text-slate-400 leading-normal">
                Encrypted visit log and digital files successfully pushed to your secure health locker.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-between items-center max-w-md mx-auto">
            <button
              onClick={() => onNavigateToTab('home')}
              className="px-4 py-2 bg-slate-950 hover:bg-slate-850 text-slate-300 border border-slate-800 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              Back to Home Dashboard
            </button>

            <button
              onClick={() => onNavigateToTab('prescriptions')}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-xl cursor-pointer transition-all flex items-center gap-1"
            >
              <FileText className="h-4 w-4" /> View Prescriptions
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
