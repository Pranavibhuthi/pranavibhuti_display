import React, { useState } from 'react';
import { Shield, Smartphone, Key, Fingerprint, Heart, CheckCircle2, AlertCircle } from 'lucide-react';
import { Patient } from '../types';
import { mockPatient } from '../data';

interface AuthScreenProps {
  onLoginSuccess: (user: Patient, role: 'patient' | 'doctor') => void;
}

export default function AuthScreen({ onLoginSuccess }: AuthScreenProps) {
  const [role, setRole] = useState<'patient' | 'doctor'>('patient');
  const [phone, setPhone] = useState('9876543210');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'credentials' | 'otp' | 'verification'>('credentials');
  const [aadhaar, setAadhaar] = useState('1234-5678-9012');
  const [healthCard, setHealthCard] = useState('ABHA-12-8921-0421');
  const [doctorPin, setDoctorPin] = useState('DOC-882');
  const [error, setError] = useState('');
  const [mfaType, setMfaType] = useState<'biometric' | 'otp'>('biometric');
  const [biometricScanning, setBiometricScanning] = useState(false);
  const [biometricSuccess, setBiometricSuccess] = useState(false);

  const handleSendOTP = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) {
      setError('Please enter a valid phone number');
      return;
    }
    setError('');
    setStep('otp');
  };

  const handleVerifyOTP = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp === '123456') {
      setError('');
      setStep('verification');
    } else {
      setError('Invalid OTP. Use 123456 for demo.');
    }
  };

  const startBiometricScan = () => {
    setBiometricScanning(true);
    setTimeout(() => {
      setBiometricScanning(false);
      setBiometricSuccess(true);
      setTimeout(() => {
        completeAuth();
      }, 1000);
    }, 2000);
  };

  const completeAuth = () => {
    if (role === 'patient') {
      const loggedPatient: Patient = {
        ...mockPatient,
        aadhaarNo: aadhaar ? `XXXX-XXXX-${aadhaar.slice(-4)}` : mockPatient.aadhaarNo,
        healthCardId: healthCard || mockPatient.healthCardId
      };
      onLoginSuccess(loggedPatient, 'patient');
    } else {
      // Return a mock system patient structure, but flag as doctor
      onLoginSuccess(mockPatient, 'doctor');
    }
  };

  return (
    <div id="auth-container" className="min-h-screen flex items-center justify-center bg-[#020617] px-4 py-12 sm:px-6 lg:px-8">
      <div id="auth-card" className="max-w-md w-full space-y-8 bg-slate-900 p-8 rounded-2xl shadow-2xl border border-slate-800 text-white">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-sky-950/40 flex items-center justify-center rounded-2xl text-sky-400 border border-sky-900/50">
            <Heart className="h-10 w-10 text-emerald-400 animate-pulse" />
          </div>
          <h2 className="mt-4 text-3xl font-black tracking-tight text-white font-sans">
            PRANA<span className="text-sky-400 font-extrabold">VIBHUTI</span>
          </h2>
          <p className="mt-1 text-sm text-slate-400 font-semibold">
            AI-Integrated Healthcare Ecosystem
          </p>
        </div>

        {/* Role Toggle */}
        {step === 'credentials' && (
          <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800">
            <button
              id="role-patient-btn"
              type="button"
              className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${
                role === 'patient'
                  ? 'bg-sky-500 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
              onClick={() => setRole('patient')}
            >
              Patient Portal
            </button>
            <button
              id="role-doctor-btn"
              type="button"
              className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${
                role === 'doctor'
                  ? 'bg-emerald-500 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
              onClick={() => setRole('doctor')}
            >
              Doctor Console
            </button>
          </div>
        )}

        {/* Step 1: Credentials & Aadhaar/HealthCard */}
        {step === 'credentials' && (
          <form id="auth-credentials-form" className="mt-4 space-y-6" onSubmit={handleSendOTP}>
            <div className="rounded-md space-y-4">
              <div>
                <label htmlFor="phone-number" className="block text-sm font-semibold text-slate-300 mb-1">
                  Mobile Number (linked to Aadhaar)
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <Smartphone className="h-5 w-5 text-slate-400" />
                  </span>
                  <input
                    id="phone-number"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="pl-10 block w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 sm:text-sm font-semibold"
                    placeholder="Enter 10-digit mobile number"
                  />
                </div>
              </div>

              {role === 'patient' ? (
                <>
                  <div>
                    <label htmlFor="aadhaar-number" className="block text-sm font-semibold text-slate-300 mb-1">
                      Aadhaar Number (12-digit)
                    </label>
                    <input
                      id="aadhaar-number"
                      type="text"
                      required
                      value={aadhaar}
                      onChange={(e) => setAadhaar(e.target.value)}
                      className="block w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 sm:text-sm font-semibold"
                      placeholder="XXXX-XXXX-XXXX"
                    />
                  </div>
                  <div>
                    <label htmlFor="health-card" className="block text-sm font-semibold text-slate-300 mb-1">
                      Digital Health Card ID (ABHA Number)
                    </label>
                    <input
                      id="health-card"
                      type="text"
                      required
                      value={healthCard}
                      onChange={(e) => setHealthCard(e.target.value)}
                      className="block w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 sm:text-sm font-semibold"
                      placeholder="ABHA-XX-XXXX-XXXX"
                    />
                  </div>
                </>
              ) : (
                <div>
                  <label htmlFor="doctor-pin" className="block text-sm font-semibold text-slate-300 mb-1">
                    Medical Council Reg ID / PIN
                  </label>
                  <input
                    id="doctor-pin"
                    type="text"
                    required
                    value={doctorPin}
                    onChange={(e) => setDoctorPin(e.target.value)}
                    className="block w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm font-semibold"
                    placeholder="e.g. DOC-882"
                  />
                </div>
              )}
            </div>

            <div>
              <button
                id="send-otp-btn"
                type="submit"
                className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-black rounded-lg text-white transition-all ${
                  role === 'patient'
                    ? 'bg-sky-500 hover:bg-sky-600 focus:ring-sky-500'
                    : 'bg-emerald-500 hover:bg-emerald-600 focus:ring-emerald-500'
                } focus:outline-none focus:ring-2 focus:ring-offset-2`}
              >
                Send Secure OTP
              </button>
            </div>
            <p className="text-xs text-center text-slate-500 font-mono">
              Secured under National Digital Health Mission standards
            </p>
          </form>
        )}

        {/* Step 2: OTP Verification */}
        {step === 'otp' && (
          <form id="auth-otp-form" className="mt-4 space-y-6" onSubmit={handleVerifyOTP}>
            <div className="rounded-md space-y-4">
              <div className="bg-sky-950/40 p-4 rounded-lg border border-sky-900/50 flex items-start gap-3">
                <Shield className="h-5 w-5 text-sky-400 shrink-0 mt-0.5" />
                <p className="text-xs text-sky-200 leading-relaxed">
                  A high-security OTP has been sent to your registered phone ending in <strong>{phone.slice(-4)}</strong>. 
                  <br /><span className="font-semibold text-sky-300">For demo purposes, use OTP: 123456</span>
                </p>
              </div>

              <div>
                <label htmlFor="otp-input" className="block text-sm font-semibold text-slate-300 mb-1">
                  Enter 6-Digit OTP
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <Key className="h-5 w-5" />
                  </span>
                  <input
                    id="otp-input"
                    type="text"
                    required
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="pl-10 tracking-widest block w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-lg font-bold"
                    placeholder="XXXXXX"
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-rose-400 text-sm bg-rose-950/40 p-2 rounded-lg border border-rose-900/50">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                id="back-btn"
                type="button"
                onClick={() => setStep('credentials')}
                className="w-1/3 py-3 border border-slate-800 text-sm font-semibold rounded-lg text-slate-300 hover:bg-slate-850"
              >
                Back
              </button>
              <button
                id="verify-otp-btn"
                type="submit"
                className={`flex-1 py-3 border border-transparent text-sm font-black rounded-lg text-white transition-all ${
                  role === 'patient' ? 'bg-sky-500 hover:bg-sky-600' : 'bg-emerald-500 hover:bg-emerald-600'
                }`}
              >
                Verify OTP
              </button>
            </div>
          </form>
        )}

        {/* Step 3: MFA (Biometric/Security validation) */}
        {step === 'verification' && (
          <div className="mt-4 space-y-6">
            <div className="text-center space-y-4">
              <div className="inline-flex bg-emerald-950/40 p-3 rounded-full text-emerald-400 border border-emerald-900/50">
                <Shield className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-bold text-white">
                Multi-Factor Authentication (MFA)
              </h3>
              <p className="text-xs text-slate-400 px-4">
                To protect confidential patient records and confirm Aadhaar synchronization, please complete biometric scanning or trigger immediate confirmation.
              </p>
            </div>

            {/* MFA Options Toggle */}
            <div className="flex justify-center gap-3 bg-slate-950 p-1 rounded-lg border border-slate-800">
              <button
                id="mfa-bio-tab"
                className={`flex-1 py-1.5 text-xs font-semibold rounded transition-all ${
                  mfaType === 'biometric' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
                onClick={() => setMfaType('biometric')}
              >
                Fingerprint / Face ID
              </button>
              <button
                id="mfa-direct-tab"
                className={`flex-1 py-1.5 text-xs font-semibold rounded transition-all ${
                  mfaType === 'otp' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
                onClick={() => setMfaType('otp')}
              >
                Direct Skip (Demo)
              </button>
            </div>

            {mfaType === 'biometric' ? (
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-800 rounded-xl p-8 bg-slate-950/40">
                <button
                  id="biometric-trigger"
                  type="button"
                  onClick={startBiometricScan}
                  disabled={biometricScanning || biometricSuccess}
                  className={`h-24 w-24 rounded-full flex items-center justify-center transition-all ${
                    biometricScanning 
                      ? 'bg-sky-950/50 text-sky-400 border-4 border-sky-500 animate-pulse' 
                      : biometricSuccess
                        ? 'bg-emerald-950/50 text-emerald-400 border-4 border-emerald-500'
                        : 'bg-slate-900 hover:bg-slate-800 text-sky-400 border border-slate-800 shadow-sm'
                  }`}
                >
                  {biometricSuccess ? (
                    <CheckCircle2 className="h-12 w-12" />
                  ) : (
                    <Fingerprint className="h-12 w-12" />
                  )}
                </button>
                <p className="mt-4 text-xs font-semibold text-slate-300 text-center">
                  {biometricScanning 
                    ? "Scanning Face/Fingerprint (Biometric MFA)..." 
                    : biometricSuccess 
                      ? "MFA Authenticated Successfully!" 
                      : "Tap to simulate Biometric Authentication"}
                </p>
                <p className="text-[10px] text-slate-500 mt-1">
                  Complies with India Digital Health Locker protection laws
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-emerald-950/40 p-3 rounded-lg border border-emerald-900/50 text-center">
                  <p className="text-xs text-emerald-400 font-semibold">
                    Aadhaar + Health Card Verified Successfully
                  </p>
                </div>
                <button
                  id="direct-complete-btn"
                  type="button"
                  onClick={completeAuth}
                  className={`w-full py-3 text-sm font-bold text-white rounded-lg transition-all ${
                    role === 'patient' ? 'bg-sky-500 hover:bg-sky-600' : 'bg-emerald-500 hover:bg-emerald-600'
                  }`}
                >
                  Proceed to Portal
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
