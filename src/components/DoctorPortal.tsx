import React, { useState } from 'react';
import { 
  Heart, 
  Activity, 
  ShieldAlert, 
  CheckCircle, 
  Trash2, 
  Pill, 
  Clipboard, 
  FileText, 
  Plus, 
  Check, 
  AlertTriangle, 
  Eye, 
  UserPlus 
} from 'lucide-react';
import { SymptomAssessmentAlert, Prescription, HealthLockerRecord } from '../types';

interface DoctorPortalProps {
  symptomAlerts: SymptomAssessmentAlert[];
  onDismissAlert: (id: string) => void;
  onAddPrescription: (rx: Prescription) => void;
  onAddLockerRecord: (rec: HealthLockerRecord) => void;
  onAddNotification: (text: string) => void;
}

export default function DoctorPortal({
  symptomAlerts,
  onDismissAlert,
  onAddPrescription,
  onAddLockerRecord,
  onAddNotification
}: DoctorPortalProps) {

  // Current active view inside doctor dashboard
  const [docView, setDocView] = useState<'alerts' | 'create-rx' | 'add-record'>('alerts');
  const [selectedAlert, setSelectedAlert] = useState<SymptomAssessmentAlert | null>(null);

  // Prescription Form state
  const [rxPatientName, setRxPatientName] = useState('Rajesh Kumar');
  const [rxSymptoms, setRxSymptoms] = useState('');
  const [rxInstructions, setRxInstructions] = useState('');
  const [rxMeds, setRxMeds] = useState<{ name: string; dosage: string; frequency: string; duration: string }[]>([
    { name: '', dosage: '', frequency: 'Once daily', duration: '5 Days' }
  ]);

  // EHR addition state
  const [ehrTitle, setEhrTitle] = useState('');
  const [ehrCategory, setEhrCategory] = useState<'Prescription' | 'Lab Report' | 'Vaccination' | 'Other'>('Lab Report');
  const [ehrNotes, setEhrNotes] = useState('');

  const handleAddMedRow = () => {
    setRxMeds([...rxMeds, { name: '', dosage: '', frequency: 'Once daily', duration: '5 Days' }]);
  };

  const handleMedChange = (index: number, field: string, value: string) => {
    const updated = rxMeds.map((m, i) => {
      if (i === index) {
        return { ...m, [field]: value };
      }
      return m;
    });
    setRxMeds(updated);
  };

  const submitPrescription = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rxPatientName || !rxSymptoms) return;

    const filteredMeds = rxMeds.filter(m => m.name);
    if (filteredMeds.length === 0) {
      alert("Please add at least one medicine formulation.");
      return;
    }

    const newRx: Prescription = {
      id: `RX-${Math.floor(Math.random() * 9000) + 1000}`,
      doctorName: "Dr. Vikram Sethi",
      specialty: "General Medicine",
      date: new Date().toISOString().split('T')[0],
      patientName: rxPatientName,
      symptoms: rxSymptoms,
      medications: filteredMeds,
      instructions: rxInstructions,
      signatureCode: `PRANA-MD-${Math.floor(Math.random() * 9000) + 1000}-SETHI`
    };

    onAddPrescription(newRx);
    onAddNotification(`New digital prescription ${newRx.id} signed by Dr. Vikram Sethi for ${rxPatientName}.`);
    
    // Reset
    setRxSymptoms('');
    setRxInstructions('');
    setRxMeds([{ name: '', dosage: '', frequency: 'Once daily', duration: '5 Days' }]);
    setDocView('alerts');
  };

  const submitEhrRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ehrTitle) return;

    const newRec: HealthLockerRecord = {
      id: `LR-${Math.floor(Math.random() * 900) + 100}`,
      title: ehrTitle,
      category: ehrCategory,
      date: new Date().toISOString().split('T')[0],
      doctorName: "Dr. Vikram Sethi",
      fileSize: "1.5 MB",
      isMfaProtected: true,
      notes: ehrNotes
    };

    onAddLockerRecord(newRec);
    onAddNotification(`Physician registered verified record "${ehrTitle}" into patient health locker.`);
    
    // Reset
    setEhrTitle('');
    setEhrNotes('');
    setDocView('alerts');
  };

  return (
    <div id="doctor-portal-container" className="flex-1 overflow-y-auto p-8 bg-[#020617] text-white">
      
      {/* Top Bar with view switcher */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-black text-white">Physician Control Console</h2>
          <p className="text-xs text-slate-400 font-medium">Verify AI-cross-checked symptom notifications, clear false alarms, and issue digital prescriptions</p>
        </div>

        <div className="flex bg-slate-950 p-1.5 rounded-xl border border-slate-800 text-xs font-bold gap-2">
          <button
            id="doc-view-alerts"
            onClick={() => setDocView('alerts')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              docView === 'alerts' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Symptom Alerts ({symptomAlerts.filter(a => !a.dismissed).length})
          </button>
          <button
            id="doc-view-create-rx"
            onClick={() => setDocView('create-rx')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              docView === 'create-rx' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Write Prescription
          </button>
          <button
            id="doc-view-add-record"
            onClick={() => setDocView('add-record')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              docView === 'add-record' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Issue EHR File
          </button>
        </div>
      </div>

      {/* View 1: Symptom Alerts Panel */}
      {docView === 'alerts' && (
        <div id="doctor-alerts-panel" className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Active alerts list */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-xs font-black text-white uppercase tracking-wider">Active Patient Assessments</h3>
            
            {symptomAlerts.filter(a => !a.dismissed).length === 0 ? (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center text-xs text-slate-500">
                No active symptom alarms needing review. Excellent medical status.
              </div>
            ) : (
              <div className="space-y-4">
                {symptomAlerts.filter(a => !a.dismissed).map((alert) => (
                  <div 
                    key={alert.id}
                    className={`bg-slate-900 border rounded-2xl p-5 shadow-sm transition-all space-y-4 cursor-pointer hover:border-emerald-500/80 ${
                      selectedAlert?.id === alert.id ? 'ring-2 ring-emerald-500/20 border-emerald-500 bg-slate-900' : 'border-slate-800'
                    }`}
                    onClick={() => setSelectedAlert(alert)}
                  >
                    <div className="flex justify-between items-start text-xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-white text-sm">{alert.patientName}</span>
                          <span className="text-slate-400">({alert.gender}, {alert.age}y)</span>
                        </div>
                        <p className="text-slate-400 text-[10px] mt-0.5">EHR history: {alert.medicalHistory.join(", ") || "None"}</p>
                      </div>

                      <div className="flex gap-2 text-white">
                        {alert.isLikelyFalseAlarm && (
                          <span className="bg-amber-950/80 text-amber-400 border border-amber-900/50 font-extrabold px-2.5 py-0.5 rounded text-[9px] uppercase tracking-wider flex items-center gap-1">
                            <Eye className="h-3 w-3 text-amber-400" /> AI False Alarm Pre-Flag
                          </span>
                        )}
                        <span className={`px-2.5 py-0.5 rounded text-[9px] font-bold uppercase border ${
                          alert.severity === 'Emergency' || alert.severity === 'High'
                            ? 'bg-rose-950/60 text-rose-400 border-rose-900/50'
                            : 'bg-amber-950/60 text-amber-400 border-amber-900/50'
                        }`}>
                          {alert.severity}
                        </span>
                      </div>
                    </div>

                    <div className="p-3 bg-slate-950 rounded-xl text-xs space-y-1 border border-slate-800/80">
                      <span className="font-bold text-slate-400 text-[9px] uppercase tracking-wider block">Patient Reported Symptoms</span>
                      <p className="text-slate-300 font-medium italic">"{alert.symptoms}"</p>
                    </div>

                    {/* Quick Vitals */}
                    <div className="grid grid-cols-5 gap-2 text-center text-[10px] bg-slate-950 p-2.5 rounded-xl border border-slate-800/40">
                      <div>
                        <span className="text-slate-500 font-bold block">BP</span>
                        <span className="font-extrabold text-white">{alert.vitals.systolic}/{alert.vitals.diastolic}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 font-bold block">Pulse</span>
                        <span className="font-extrabold text-white">{alert.vitals.pulse} bpm</span>
                      </div>
                      <div>
                        <span className="text-slate-500 font-bold block">SpO2</span>
                        <span className="font-extrabold text-white">{alert.vitals.spo2}%</span>
                      </div>
                      <div>
                        <span className="text-slate-500 font-bold block">Temp</span>
                        <span className="font-extrabold text-white">{alert.vitals.temperature}°F</span>
                      </div>
                      <div>
                        <span className="text-slate-500 font-bold block">Status</span>
                        <span className={`font-bold ${alert.isLikelyFalseAlarm ? 'text-amber-400' : 'text-emerald-400'}`}>
                          {alert.isLikelyFalseAlarm ? 'Benign' : 'Evaluate'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right side: Detailed diagnostic cross-check and dismissal */}
          <div>
            {selectedAlert ? (
              <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-2xl space-y-5 sticky top-20 text-white">
                <div className="flex justify-between items-center border-b border-slate-800 pb-3 text-xs">
                  <h4 className="font-black text-white">EHR AI Cross-Check Analysis</h4>
                  <span className="font-mono text-[9px] text-slate-500">ID: {selectedAlert.id}</span>
                </div>

                <div className="text-xs space-y-1">
                  <p className="font-extrabold text-white">{selectedAlert.patientName}</p>
                  <p className="text-slate-400">History: {selectedAlert.medicalHistory.join(", ")}</p>
                </div>

                {/* AI clinical cross check reasoning */}
                <div className="p-3 bg-emerald-950/40 border border-emerald-900/50 rounded-xl space-y-2 text-xs">
                  <span className="text-emerald-400 font-bold text-[10px] uppercase tracking-wider flex items-center gap-1">
                    <Activity className="h-3.5 w-3.5 text-emerald-400" />
                    Clinical AI Assessment Details
                  </span>
                  <p className="text-slate-300 leading-relaxed font-semibold">{selectedAlert.assessmentText}</p>
                  <p className="text-slate-300 leading-relaxed font-semibold pt-1 border-t border-slate-800/80">{selectedAlert.crossCheckDetails}</p>
                </div>

                {/* Dismiss reason if false alarm */}
                {selectedAlert.isLikelyFalseAlarm && (
                  <div className="p-3 bg-amber-950/40 border border-amber-900/50 rounded-xl space-y-1.5 text-xs">
                    <span className="text-amber-400 font-extrabold text-[10px] uppercase tracking-wider flex items-center gap-1">
                      <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                      Physician Dismissal Criteria
                    </span>
                    <p className="text-amber-200 font-semibold leading-relaxed">{selectedAlert.dismissReason}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="space-y-3 pt-3 border-t border-slate-800">
                  <button
                    id="dismiss-false-alarm-btn"
                    onClick={() => {
                      onDismissAlert(selectedAlert.id);
                      onAddNotification(`Physician dismissed symptom alert ${selectedAlert.id} for ${selectedAlert.patientName} as false alarm.`);
                      setSelectedAlert(null);
                    }}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-extrabold text-xs transition-all shadow-none flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <CheckCircle className="h-4 w-4" />
                    <span>Dismiss False Alarm Alert</span>
                  </button>

                  <button
                    id="write-pres-from-alert"
                    onClick={() => {
                      setRxPatientName(selectedAlert.patientName);
                      setRxSymptoms(selectedAlert.symptoms);
                      setDocView('create-rx');
                    }}
                    className="w-full border border-slate-800 hover:bg-slate-800 text-slate-300 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer"
                  >
                    Write Custom Prescription
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-slate-900/40 rounded-2xl border-2 border-dashed border-slate-800 p-8 text-center text-xs text-slate-500">
                Select any patient assessment alert on the left to examine detailed vital cross-checking, cardiac reports, and dismissal logic.
              </div>
            )}
          </div>
        </div>
      )}

      {/* View 2: Write Digital Prescription */}
      {docView === 'create-rx' && (
        <form id="create-prescription-form" onSubmit={submitPrescription} className="bg-slate-900 rounded-3xl border border-slate-800 p-6 shadow-2xl max-w-2xl mx-auto mt-6 space-y-6 text-white">
          <div className="flex items-center gap-2.5 pb-4 border-b border-slate-800">
            <div className="h-10 w-10 bg-emerald-950/60 text-emerald-400 rounded-xl flex items-center justify-center shrink-0 border border-emerald-900/50">
              <Pill className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">Issue Certified Digital Prescription</h3>
              <p className="text-xs text-slate-400">Formulate dosage guidelines. Saved prescriptions are instantly synced to the Patient Portal and Locker.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label htmlFor="rx-patient-name" className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Patient Name</label>
              <select
                id="rx-patient-name"
                value={rxPatientName}
                onChange={(e) => setRxPatientName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-850 rounded-lg p-2.5 text-slate-300 font-bold focus:outline-none"
              >
                <option value="Rajesh Kumar" className="bg-slate-900 text-white">Rajesh Kumar</option>
                <option value="Anita Sharma" className="bg-slate-900 text-white">Anita Sharma</option>
                <option value="Amit Barua" className="bg-slate-900 text-white">Amit Barua</option>
              </select>
            </div>
            <div>
              <label htmlFor="rx-symptoms-input" className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Evaluated Symptoms</label>
              <input
                id="rx-symptoms-input"
                type="text"
                required
                value={rxSymptoms}
                onChange={(e) => setRxSymptoms(e.target.value)}
                placeholder="e.g. Mild anxiety with elevated sinus tachycardia"
                className="w-full bg-slate-950 border border-slate-850 rounded-lg p-2.5 text-xs font-semibold text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Medications rows */}
          <div className="space-y-3">
            <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Medication Formulations</span>
            
            {rxMeds.map((med, idx) => (
              <div key={idx} className="grid grid-cols-4 gap-2 text-xs">
                <input
                  id={`rx-med-name-${idx}`}
                  type="text"
                  required={idx === 0}
                  placeholder="Medicine name"
                  value={med.name}
                  onChange={(e) => handleMedChange(idx, 'name', e.target.value)}
                  className="bg-slate-950 border border-slate-850 rounded-lg p-2 font-bold text-white focus:outline-none focus:border-emerald-500"
                />
                <input
                  id={`rx-med-dosage-${idx}`}
                  type="text"
                  placeholder="Dosage (e.g. 10mg)"
                  value={med.dosage}
                  onChange={(e) => handleMedChange(idx, 'dosage', e.target.value)}
                  className="bg-slate-950 border border-slate-850 rounded-lg p-2 text-white focus:outline-none focus:border-emerald-500"
                />
                <select
                  id={`rx-med-freq-${idx}`}
                  value={med.frequency}
                  onChange={(e) => handleMedChange(idx, 'frequency', e.target.value)}
                  className="bg-slate-950 border border-slate-850 rounded-lg p-2 text-slate-300 focus:outline-none font-semibold"
                >
                  <option value="Once daily" className="bg-slate-900 text-white">Once daily</option>
                  <option value="Once daily (Night)" className="bg-slate-900 text-white">Once daily (Night)</option>
                  <option value="Twice daily" className="bg-slate-900 text-white">Twice daily</option>
                  <option value="Thrice daily" className="bg-slate-900 text-white">Thrice daily</option>
                </select>
                <input
                  id={`rx-med-dur-${idx}`}
                  type="text"
                  placeholder="Duration (e.g. 5 Days)"
                  value={med.duration}
                  onChange={(e) => handleMedChange(idx, 'duration', e.target.value)}
                  className="bg-slate-950 border border-slate-850 rounded-lg p-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            ))}

            <button
              id="add-med-row-btn"
              type="button"
              onClick={handleAddMedRow}
              className="text-emerald-400 font-bold text-[11px] flex items-center gap-1 hover:underline cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" /> Add another medicine
            </button>
          </div>

          {/* Instructions */}
          <div>
            <label htmlFor="rx-instructions" className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Special Clinical Advice / Instructions</label>
            <textarea
              id="rx-instructions"
              rows={2}
              value={rxInstructions}
              onChange={(e) => setRxInstructions(e.target.value)}
              placeholder="Avoid direct heavy physical labor during tachycardic episodes. Seek meditation counsel."
              className="w-full bg-slate-950 border border-slate-850 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <button
            id="prescription-submit-btn"
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-3 rounded-xl text-xs transition-all shadow-none cursor-pointer"
          >
            Sign & Deliver Digital Prescription
          </button>
        </form>
      )}

      {/* View 3: Issue Verified EHR Record to Health Locker */}
      {docView === 'add-record' && (
        <form id="create-ehr-form" onSubmit={submitEhrRecord} className="bg-slate-900 rounded-3xl border border-slate-800 p-6 shadow-2xl max-w-md mx-auto mt-6 space-y-6 text-white">
          <div className="flex items-center gap-2.5 pb-4 border-b border-slate-800">
            <div className="h-10 w-10 bg-emerald-950/60 text-emerald-400 rounded-xl flex items-center justify-center shrink-0 border border-emerald-900/50">
              <Clipboard className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">Issue Verified EHR Medical Document</h3>
              <p className="text-xs text-slate-400">Register certified reports directly into the patient's secure locker</p>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label htmlFor="ehr-file-title" className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Record Title</label>
              <input
                id="ehr-file-title"
                type="text"
                required
                value={ehrTitle}
                onChange={(e) => setEhrTitle(e.target.value)}
                placeholder="e.g. Echocardiogram (ECG) Report"
                className="w-full bg-slate-950 border border-slate-850 rounded-lg p-2.5 font-bold text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label htmlFor="ehr-file-cat" className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">EHR Category</label>
              <select
                id="ehr-file-cat"
                value={ehrCategory}
                onChange={(e) => setEhrCategory(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-850 rounded-lg p-2.5 font-bold text-slate-300 focus:outline-none"
              >
                <option value="Lab Report" className="bg-slate-900 text-white">Lab Report</option>
                <option value="Prescription" className="bg-slate-900 text-white">Prescription</option>
                <option value="Vaccination" className="bg-slate-900 text-white">Vaccination</option>
                <option value="Other" className="bg-slate-900 text-white">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="ehr-notes" className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Clinical Findings / Notes</label>
              <textarea
                id="ehr-notes"
                rows={3}
                value={ehrNotes}
                onChange={(e) => setEhrNotes(e.target.value)}
                placeholder="Normal sinus rhythm with no ST-elevation. Confirms panic-induced somatic heart tightness."
                className="w-full bg-slate-950 border border-slate-850 rounded-lg p-3 text-white focus:outline-none"
              />
            </div>

            <button
              id="ehr-submit-btn"
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-3 rounded-xl text-xs transition-all shadow-none cursor-pointer"
            >
              Verify & Register in Patient Health Locker
            </button>
          </div>
        </form>
      )}

    </div>
  );
}
