import React, { useState, useEffect } from 'react';
import { 
  Milestone, 
  Search, 
  Plus, 
  Filter, 
  Activity, 
  Stethoscope, 
  Pill, 
  FlaskConical, 
  Syringe, 
  Scissors, 
  Calendar, 
  Building, 
  CheckCircle, 
  Info, 
  MapPin, 
  Clock, 
  ChevronRight, 
  Download, 
  Printer, 
  Sparkles, 
  Heart,
  TrendingUp,
  X
} from 'lucide-react';

export interface JourneyEvent {
  id: string;
  date: string;
  title: string;
  category: 'diagnosis' | 'prescription' | 'lab' | 'vaccination' | 'surgery' | 'routine';
  detail: string;
  doctor: string;
  institution: string;
  status: string;
  hoverDetails: string;
  vitals?: { label: string; value: string }[];
  severity?: 'low' | 'medium' | 'high';
}

const initialJourneyEvents: JourneyEvent[] = [
  {
    id: 'JE-001',
    date: '2026-06-29',
    title: 'Hypertension Management & Arrhythmia Review',
    category: 'prescription',
    detail: 'Metoprolol Succinate increased to 50mg daily, Ivabradine 5mg twice daily.',
    doctor: 'Dr. Sila Roychowdhury (Cardiology)',
    institution: 'Apollo Clinics, Bangalore',
    status: 'Active Treatment',
    hoverDetails: 'Prescribed following telemetry analysis and outpatient review. Baseline pulse rate logged at 72 BPM. Purpose is to manage sinus tachycardia and suppress ectopic beats.',
    vitals: [
      { label: 'Pulse Rate', value: '72 BPM' },
      { label: 'Blood Pressure', value: '130/85 mmHg' }
    ],
    severity: 'medium'
  },
  {
    id: 'JE-002',
    date: '2026-05-15',
    title: 'Early-Stage Sinus Arrhythmia Diagnosis',
    category: 'diagnosis',
    detail: 'Identified minor rhythm variations during cardiovascular triage check.',
    doctor: 'Dr. Sila Roychowdhury (Cardiology)',
    institution: 'Apollo Clinics, Bangalore',
    status: 'Under Active Monitoring',
    hoverDetails: 'Patient reported brief episodes of flutter. Electrocardiogram (ECG) indicated normal axis but transient sinus rhythm alterations. Advised to restrict sodium intake (<1500mg/day) and monitor with smart devices.',
    vitals: [
      { label: 'ECG Rhythm', value: 'Sinus w/ APCs' },
      { label: 'Sodium Goal', value: '< 1.5g/day' }
    ],
    severity: 'medium'
  },
  {
    id: 'JE-003',
    date: '2026-04-12',
    title: 'Cardiovascular Lipid Profile & Blood Panel',
    category: 'lab',
    detail: 'Total Cholesterol: 195 mg/dL, LDL: 110 mg/dL, HDL: 48 mg/dL.',
    doctor: 'Dr. Anand Kumar (General Pathology)',
    institution: 'Narayana Diagnostic Labs',
    status: 'Completed / Reviewed',
    hoverDetails: 'Slightly borderline LDL cholesterol. Triglycerides are stable at 142 mg/dL. Fasting glucose logged at 94 mg/dL. Recommends cardiovascular exercise at least 3 times a week (30 mins aerobic walking/jogging).',
    vitals: [
      { label: 'Total Cholesterol', value: '195 mg/dL' },
      { label: 'LDL Level', value: '110 mg/dL (Borderline)' },
      { label: 'Fasting Glucose', value: '94 mg/dL' }
    ],
    severity: 'low'
  },
  {
    id: 'JE-004',
    date: '2026-02-22',
    title: 'Influenza Vaccination (Annual Dose)',
    category: 'vaccination',
    detail: 'Influvac Tetra 2026 strain vaccine administered for seasonal defense.',
    doctor: 'Nurse Preeti Sharma',
    institution: 'Max Healthcare, Delhi',
    status: 'Immunized',
    hoverDetails: 'Injected into the left deltoid muscle. No subsequent adverse events or local inflammation noted. Annual booster due in February 2027.',
    vitals: [
      { label: 'Vaccine Code', value: 'IFV-TETRA-26' },
      { label: 'Site', value: 'Left Deltoid (IM)' }
    ],
    severity: 'low'
  },
  {
    id: 'JE-005',
    date: '2025-10-10',
    title: 'Arthroscopic Right Knee Meniscus Repair',
    category: 'surgery',
    detail: 'Minimally invasive keyhole suture repair of medial meniscus posterior horn tear.',
    doctor: 'Dr. Vikram Sethi (Orthopedics)',
    institution: 'Narayana Health City',
    status: 'Fully Recovered',
    hoverDetails: 'Successfully repaired the radial meniscus tear using a two-portal arthroscopic method. Completed 6 weeks of dedicated muscle-strengthening physiotherapy. Full mobility and painless weight-bearing restored.',
    vitals: [
      { label: 'Recovery Status', value: '100% Function' },
      { label: 'Follow-up MRI', value: 'Clear Suture Line' }
    ],
    severity: 'high'
  },
  {
    id: 'JE-006',
    date: '2025-08-01',
    title: 'Acute Medial Meniscus Tear Diagnosis',
    category: 'diagnosis',
    detail: 'Grade II medial meniscus posterior horn tear confirmed on knee MRI.',
    doctor: 'Dr. Vikram Sethi (Orthopedics)',
    institution: 'Narayana Health City',
    status: 'Resolved via Surgery',
    hoverDetails: 'Resulted from high-torque twisting strain during a recreational club tennis match. Initial management conducted via strict RICE protocol (Rest, Ice, Compression, Elevation) and NSAIDs before scheduled surgery.',
    vitals: [
      { label: 'Tear Grade', value: 'Grade II Medial' },
      { label: 'Pain Score', value: '7/10 (Pre-op)' }
    ],
    severity: 'high'
  }
];

interface HealthJourneyProps {
  onAddNotification: (notif: string) => void;
}

export function HealthJourney({ onAddNotification }: HealthJourneyProps) {
  const [events, setEvents] = useState<JourneyEvent[]>(() => {
    const saved = localStorage.getItem('pranavibhuti_health_journey');
    return saved ? JSON.parse(saved) : initialJourneyEvents;
  });

  useEffect(() => {
    localStorage.setItem('pranavibhuti_health_journey', JSON.stringify(events));
  }, [events]);

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [hoveredEventId, setHoveredEventId] = useState<string | null>(null);
  
  // Create Event Form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [formDate, setFormDate] = useState('');
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState<'diagnosis' | 'prescription' | 'lab' | 'vaccination' | 'surgery' | 'routine'>('diagnosis');
  const [formDetail, setFormDetail] = useState('');
  const [formDoctor, setFormDoctor] = useState('');
  const [formInstitution, setFormInstitution] = useState('');
  const [formStatus, setFormStatus] = useState('');
  const [formHoverDetails, setFormHoverDetails] = useState('');
  const [formSeverity, setFormSeverity] = useState<'low' | 'medium' | 'high'>('low');
  
  // Sort events sequentially (newest first)
  const sortedEvents = [...events].sort((a, b) => b.date.localeCompare(a.date));

  // Filter events
  const filteredEvents = sortedEvents.filter(e => {
    const matchesSearch = e.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          e.detail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          e.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          e.institution.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          e.hoverDetails.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || e.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formDate || !formTitle || !formDetail || !formDoctor || !formInstitution) {
      onAddNotification("Please fill in all mandatory fields to append the journey node.");
      return;
    }

    const newEvent: JourneyEvent = {
      id: `JE-NEW-${Math.floor(1000 + Math.random() * 9000)}`,
      date: formDate,
      title: formTitle,
      category: formCategory,
      detail: formDetail,
      doctor: formDoctor,
      institution: formInstitution,
      status: formStatus || 'Logged',
      hoverDetails: formHoverDetails || 'Custom milestone appended manually by patient.',
      severity: formSeverity
    };

    setEvents(prev => [newEvent, ...prev]);
    onAddNotification(`New health journey event "${formTitle}" appended successfully!`);
    
    // Reset Form
    setFormDate('');
    setFormTitle('');
    setFormCategory('diagnosis');
    setFormDetail('');
    setFormDoctor('');
    setFormInstitution('');
    setFormStatus('');
    setFormHoverDetails('');
    setFormSeverity('low');
    setShowAddForm(false);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'diagnosis': return <Stethoscope className="h-5 w-5 text-amber-400" />;
      case 'prescription': return <Pill className="h-5 w-5 text-sky-400" />;
      case 'lab': return <FlaskConical className="h-5 w-5 text-emerald-400" />;
      case 'vaccination': return <Syringe className="h-5 w-5 text-purple-400" />;
      case 'surgery': return <Scissors className="h-5 w-5 text-rose-400" />;
      default: return <Activity className="h-5 w-5 text-slate-400" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'diagnosis': return 'border-amber-500 bg-amber-500/10 text-amber-400';
      case 'prescription': return 'border-sky-500 bg-sky-500/10 text-sky-400';
      case 'lab': return 'border-emerald-500 bg-emerald-500/10 text-emerald-400';
      case 'vaccination': return 'border-purple-500 bg-purple-500/10 text-purple-400';
      case 'surgery': return 'border-rose-500 bg-rose-500/10 text-rose-400';
      default: return 'border-slate-500 bg-slate-500/10 text-slate-400';
    }
  };

  const getSeverityBadge = (severity?: 'low' | 'medium' | 'high') => {
    if (!severity) return null;
    switch (severity) {
      case 'high': return <span className="bg-rose-500/20 text-rose-400 text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wide border border-rose-500/30">Major</span>;
      case 'medium': return <span className="bg-amber-500/20 text-amber-400 text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wide border border-amber-500/30">Moderate</span>;
      default: return <span className="bg-emerald-500/20 text-emerald-400 text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wide border border-emerald-500/30">Standard</span>;
    }
  };

  // Quick statistics
  const totalDiagnoses = events.filter(e => e.category === 'diagnosis').length;
  const activePrescriptions = events.filter(e => e.category === 'prescription').length;
  const totalLabs = events.filter(e => e.category === 'lab').length;
  const majorSurgeries = events.filter(e => e.category === 'surgery').length;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div id="health-journey-timeline" className="space-y-6">
      
      {/* Brand Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 bg-slate-900 border border-slate-850 rounded-2xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-sky-500/20 text-sky-400">
              <Milestone className="h-5 w-5" />
            </span>
            <h2 className="text-base font-black text-white uppercase tracking-wider">Health Journey & Timeline Node</h2>
          </div>
          <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
            An interactive, high-fidelity chronological map of your diagnoses, surgeries, prescription changes, and clinical events. Hover nodes to view detailed triage and follow-up clinical reports.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handlePrint}
            className="px-3.5 py-2 bg-slate-950 hover:bg-slate-850 text-slate-300 hover:text-white border border-slate-800 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="h-4 w-4" /> Print Journey
          </button>
          
          <button
            onClick={() => setShowAddForm(true)}
            className="px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer shadow"
          >
            <Plus className="h-4 w-4" /> Append Milestone
          </button>
        </div>
      </div>

      {/* Summary Analytics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-850 p-4 rounded-2xl flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center shrink-0">
            <Stethoscope className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Total Diagnoses</span>
            <h3 className="text-lg font-black text-white leading-tight mt-0.5">{totalDiagnoses}</h3>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-850 p-4 rounded-2xl flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20 flex items-center justify-center shrink-0">
            <Pill className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Prescriptions</span>
            <h3 className="text-lg font-black text-white leading-tight mt-0.5">{activePrescriptions}</h3>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-850 p-4 rounded-2xl flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center shrink-0">
            <FlaskConical className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Lab Profiles</span>
            <h3 className="text-lg font-black text-white leading-tight mt-0.5">{totalLabs}</h3>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-850 p-4 rounded-2xl flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center shrink-0">
            <Scissors className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Surgeries/Procedures</span>
            <h3 className="text-lg font-black text-white leading-tight mt-0.5">{majorSurgeries}</h3>
          </div>
        </div>
      </div>

      {/* Timeline Controls (Filter / Search) */}
      <div className="bg-slate-900 border border-slate-850 p-4 rounded-2xl flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-72">
          <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-500">
            <Search className="h-4 w-4" />
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search symptoms, doctors, labs..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 pl-9 pr-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
          />
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none shrink-0">
          {[
            { id: 'all', label: 'All Items' },
            { id: 'diagnosis', label: 'Diagnoses' },
            { id: 'prescription', label: 'Prescriptions' },
            { id: 'lab', label: 'Labs' },
            { id: 'surgery', label: 'Surgeries' },
            { id: 'vaccination', label: 'Vaccines' }
          ].map(btn => (
            <button
              key={btn.id}
              onClick={() => setCategoryFilter(btn.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap cursor-pointer transition-all ${
                categoryFilter === btn.id
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800/80'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Timeline Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Interactive Timeline (Col 1-8) */}
        <div className="lg:col-span-8 space-y-6">
          {filteredEvents.length === 0 ? (
            <div className="bg-slate-900 border border-slate-850 rounded-2xl p-8 text-center text-slate-400 text-xs italic">
              No medical journey milestones match your search or filter requirements.
            </div>
          ) : (
            <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:top-2 before:bottom-2 before:left-[17px] sm:before:left-[21px] before:w-0.5 before:bg-slate-800">
              {filteredEvents.map((evt, idx) => {
                const isHovered = hoveredEventId === evt.id;
                
                return (
                  <div 
                    key={evt.id} 
                    className="relative group transition-all"
                    onMouseEnter={() => setHoveredEventId(evt.id)}
                    onMouseLeave={() => setHoveredEventId(null)}
                  >
                    {/* Timeline Node Icon Pin */}
                    <div className={`absolute -left-[30px] sm:-left-[35px] top-1.5 h-7 sm:h-8 w-7 sm:w-8 rounded-full border-2 flex items-center justify-center z-10 shadow transition-all ${getCategoryColor(evt.category)} group-hover:scale-110`}>
                      {getCategoryIcon(evt.category)}
                    </div>

                    {/* Card container */}
                    <div className={`bg-slate-900 border rounded-2xl p-5 shadow-md transition-all duration-300 ${
                      isHovered 
                        ? 'border-sky-500/80 shadow-lg shadow-sky-950/20 translate-x-1' 
                        : 'border-slate-850 hover:border-slate-800'
                    }`}>
                      
                      {/* Top metadata */}
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-850 pb-3 mb-3">
                        <div className="flex items-center gap-2.5">
                          <span className="font-mono text-xs font-black text-sky-400 flex items-center gap-1 bg-sky-950/40 px-2 py-0.5 rounded border border-sky-900/30">
                            <Calendar className="h-3.5 w-3.5" />
                            {evt.date}
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium">ID: {evt.id}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          {getSeverityBadge(evt.severity)}
                          <span className="bg-slate-950 text-slate-400 text-[9px] font-mono px-2 py-0.5 rounded-md border border-slate-850">
                            {evt.status}
                          </span>
                        </div>
                      </div>

                      {/* Title & primary info */}
                      <div className="space-y-1.5">
                        <h4 className="font-extrabold text-sm sm:text-base text-white group-hover:text-sky-400 transition-colors">
                          {evt.title}
                        </h4>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          {evt.detail}
                        </p>
                      </div>

                      {/* Doctor / Institution context */}
                      <div className="mt-4 flex flex-wrap gap-4 text-[10px] text-slate-400">
                        <div className="flex items-center gap-1.5">
                          <Stethoscope className="h-3.5 w-3.5 text-slate-500" />
                          <span>Doctor: <strong className="text-slate-300">{evt.doctor}</strong></span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Building className="h-3.5 w-3.5 text-slate-500" />
                          <span>Institution: <strong className="text-slate-300">{evt.institution}</strong></span>
                        </div>
                      </div>

                      {/* Embedded vitals/results log */}
                      {evt.vitals && evt.vitals.length > 0 && (
                        <div className="mt-4 pt-3 border-t border-slate-850/60 grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {evt.vitals.map((vit, vIdx) => (
                            <div key={vIdx} className="bg-slate-950/80 px-2.5 py-1.5 rounded-lg border border-slate-850">
                              <span className="text-[8px] text-slate-500 uppercase tracking-wider font-bold block">{vit.label}</span>
                              <span className="text-[10px] text-slate-300 font-extrabold mt-0.5 block">{vit.value}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Hoverable details reveal drawer/popover inside node */}
                      <div className={`mt-4 pt-3 border-t border-slate-850/60 transition-all duration-300 ${
                        isHovered ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
                      }`}>
                        <div className="bg-sky-950/20 border border-sky-500/20 rounded-xl p-3 space-y-1.5">
                          <h5 className="text-[10px] font-black text-sky-400 uppercase tracking-widest flex items-center gap-1">
                            <Sparkles className="h-3.5 w-3.5 animate-pulse" />
                            Clinical Notes & Guidelines
                          </h5>
                          <p className="text-[10.5px] text-slate-300 leading-relaxed">
                            {evt.hoverDetails}
                          </p>
                        </div>
                      </div>

                      {/* Hover details cue indicator for non-hovered state */}
                      {!isHovered && (
                        <div className="mt-2 text-right">
                          <span className="text-[9px] text-slate-500 group-hover:text-sky-400 transition-colors inline-flex items-center gap-0.5 cursor-help">
                            <Info className="h-3 w-3" /> Hover for clinical notes
                          </span>
                        </div>
                      )}

                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Dynamic Timeline Assistant & Stats Summary (Col 9-12) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Diagnostic Stats */}
          <div className="bg-slate-900 border border-slate-850 p-6 rounded-3xl space-y-4">
            <h4 className="font-extrabold text-sm text-white flex items-center gap-1.5 border-b border-slate-800 pb-3">
              <TrendingUp className="h-4.5 w-4.5 text-sky-400" />
              Journey Milestones
            </h4>

            <div className="space-y-3.5">
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-850 space-y-2">
                <span className="text-[8px] font-black text-sky-400 uppercase tracking-widest block">Active Regimen</span>
                <p className="text-[11px] font-extrabold text-white leading-normal">Cardiovascular rhythm monitoring</p>
                <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                  <Clock className="h-3.5 w-3.5 text-slate-500" />
                  <span>Next Doctor Visit: Tomorrow</span>
                </div>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-850 space-y-2">
                <span className="text-[8px] font-black text-emerald-400 uppercase tracking-widest block">Immunization Coverage</span>
                <p className="text-[11px] font-extrabold text-white leading-normal">Influenza Booster active</p>
                <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                  <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
                  <span>Protection valid till Feb 2027</span>
                </div>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-850 space-y-2">
                <span className="text-[8px] font-black text-rose-400 uppercase tracking-widest block">Surgical Status</span>
                <p className="text-[11px] font-extrabold text-white leading-normal">Right Meniscus Repair</p>
                <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                  <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
                  <span>100% Function restored (Oct 2025)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Secure Locker Connection */}
          <div className="bg-slate-900 border border-slate-850 p-5 rounded-2xl text-xs text-slate-400 space-y-2">
            <span className="font-black text-white block uppercase text-[8px] tracking-wider">Blockchain-Grade Sync</span>
            <p className="text-[10px] leading-relaxed">
              Pranavibhuti health timeline events are mapped continuously using your linked Apollo, Max, and Narayana Health cards. Any physical scan or digital prescription instantly pushes updates here.
            </p>
          </div>

        </div>

      </div>

      {/* Form Dialog for appending manual health milestone */}
      {showAddForm && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-lg shadow-2xl relative space-y-4 max-h-[90vh] overflow-y-auto">
            
            <button
              onClick={() => setShowAddForm(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="space-y-1">
              <h3 className="text-base font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                <Milestone className="h-5 w-5 text-sky-400" />
                Append Health Milestone
              </h3>
              <p className="text-[10px] text-slate-400">Add a historical medical record, surgery, diagnosis, or lab log to your journey.</p>
            </div>

            <form onSubmit={handleAddEvent} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-extrabold uppercase">Date</label>
                  <input
                    type="date"
                    required
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-extrabold uppercase">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-sky-500"
                  >
                    <option value="diagnosis">Diagnosis</option>
                    <option value="prescription">Prescription</option>
                    <option value="lab">Lab Result</option>
                    <option value="vaccination">Vaccine</option>
                    <option value="surgery">Surgery / Procedure</option>
                    <option value="routine">Routine Event</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-extrabold uppercase">Milestone Title</label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Chronic Asthma Review"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-extrabold uppercase">Brief Description</label>
                <input
                  type="text"
                  required
                  value={formDetail}
                  onChange={(e) => setFormDetail(e.target.value)}
                  placeholder="e.g. Normal respiratory checkup with minor bronchial irritation."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-extrabold uppercase">Doctor / Practitioner</label>
                  <input
                    type="text"
                    required
                    value={formDoctor}
                    onChange={(e) => setFormDoctor(e.target.value)}
                    placeholder="e.g. Dr. Sila Roychowdhury"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-extrabold uppercase">Hospital / Clinic</label>
                  <input
                    type="text"
                    required
                    value={formInstitution}
                    onChange={(e) => setFormInstitution(e.target.value)}
                    placeholder="e.g. Apollo Hospital"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-extrabold uppercase">Event Status</label>
                  <input
                    type="text"
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value)}
                    placeholder="e.g. Completed, Under Review"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-extrabold uppercase">Regimen Severity</label>
                  <select
                    value={formSeverity}
                    onChange={(e) => setFormSeverity(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-sky-500"
                  >
                    <option value="low">Standard / Low</option>
                    <option value="medium">Moderate / Medium</option>
                    <option value="high">Major / High</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-extrabold uppercase">Detailed Clinical Notes (Visible on hover)</label>
                <textarea
                  rows={3}
                  value={formHoverDetails}
                  onChange={(e) => setFormHoverDetails(e.target.value)}
                  placeholder="e.g. Specific vitals, prescribed drug combinations, physiotherapy protocols or advice..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-sky-500 resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="w-1/2 py-2.5 bg-slate-950 hover:bg-slate-850 text-slate-300 border border-slate-800 rounded-xl text-xs font-bold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-black transition-all"
                >
                  Append Event Node
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
