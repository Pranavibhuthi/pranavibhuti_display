import React, { useState, useEffect, useRef } from 'react';
import jsQR from 'jsqr';
import { 
  Camera, 
  QrCode, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  Link as LinkIcon, 
  Link2Off, 
  Pill, 
  FileText, 
  CreditCard, 
  Sparkles, 
  Check,
  Zap
} from 'lucide-react';
import { Prescription, Medicine } from '../types';

interface QrCodeScannerProps {
  onAddNotification: (notif: string) => void;
  onLinkPrescription: (rx: Prescription) => void;
  onLinkMedicine: (meds: { name: string; dosage: string; frequency: string; duration: string }[]) => void;
}

export interface LinkedCard {
  id: string;
  cardNo: string;
  clinicName: string;
  logo: string;
  benefit: string;
  linkedAt: string;
  patientName: string;
  type: string;
}

export function QrCodeScanner({ 
  onAddNotification, 
  onLinkPrescription, 
  onLinkMedicine 
}: QrCodeScannerProps) {
  const [activeMode, setActiveMode] = useState<'camera' | 'samples' | 'manual'>('camera');
  
  // Camera scanning state
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [scanResult, setScanResult] = useState<{ type: 'card' | 'rx' | 'unknown'; data: any } | null>(null);
  const [scanMessage, setScanMessage] = useState<string>('Align QR Code inside the camera scanner frame');
  
  // Video and Canvas references
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Linked cards state (persisted in localStorage)
  const [linkedCards, setLinkedCards] = useState<LinkedCard[]>(() => {
    const saved = localStorage.getItem('pranavibhuti_linked_cards');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return []; }
    }
    return [
      {
        id: "CARD-AP-101",
        cardNo: "AP-9021-X9",
        clinicName: "Apollo Clinics, South Bengaluru",
        logo: "AP",
        benefit: "15% discount on prescription drugs & priority OPD fast-track",
        linkedAt: "2026-06-12",
        patientName: "Rajesh Kumar",
        type: "Premium Care Card"
      }
    ];
  });

  // Manual input state
  const [manualText, setManualText] = useState('');

  // Save linked cards to localStorage
  useEffect(() => {
    localStorage.setItem('pranavibhuti_linked_cards', JSON.stringify(linkedCards));
  }, [linkedCards]);

  // Clean up stream on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Handle activeMode shifts
  useEffect(() => {
    if (activeMode !== 'camera') {
      stopCamera();
    }
  }, [activeMode]);

  const startCamera = async () => {
    setCameraError(null);
    setScanResult(null);
    setIsCameraActive(true);
    setScanMessage('Requesting camera access...');

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment', width: { ideal: 640 }, height: { ideal: 480 } } 
      });
      
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute("playsinline", "true"); // required to tell iOS Safari we don't want fullscreen
        videoRef.current.play();
        
        // Start scanning loop
        setScanMessage('Analyzing camera frames in real-time...');
        animationFrameRef.current = requestAnimationFrame(scanLoop);
      }
    } catch (err: any) {
      console.error("Camera capture error: ", err);
      let errMsg = "Unable to access the camera. ";
      if (err.name === 'NotAllowedError') {
        errMsg += "Permission was denied by the browser. Please check camera privileges in your browser settings.";
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        errMsg += "No camera devices found on this device.";
      } else {
        errMsg += err.message || "Please ensure no other app is using the camera.";
      }
      setCameraError(errMsg);
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  const scanLoop = () => {
    if (!videoRef.current || !canvasRef.current || !isCameraActive) {
      animationFrameRef.current = requestAnimationFrame(scanLoop);
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (video.readyState === video.HAVE_ENOUGH_DATA && context) {
      // Scale canvas to match video stream dimensions
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw video frame to context
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Get image data
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      
      // Attempt to decode QR Code
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: "dontInvert",
      });

      if (code) {
        // Successful scan!
        processScannedData(code.data);
        return; // Stop loop once decoded
      }
    }
    
    animationFrameRef.current = requestAnimationFrame(scanLoop);
  };

  const processScannedData = (rawText: string) => {
    stopCamera();
    
    try {
      // Check if it's JSON formatted
      let parsed = JSON.parse(rawText);
      if (parsed.type === 'clinic_card') {
        setScanResult({
          type: 'card',
          data: parsed
        });
        setScanMessage('Valid Clinic Health Card detected!');
      } else if (parsed.type === 'prescription' || parsed.doctorName) {
        setScanResult({
          type: 'rx',
          data: parsed
        });
        setScanMessage('Valid E-Prescription Token detected!');
      } else {
        // Custom format fallback
        setScanResult({
          type: 'unknown',
          data: rawText
        });
        setScanMessage('QR Code scanned successfully, but type is unrecognized.');
      }
    } catch (e) {
      // Plain text formats or special URL formats
      if (rawText.toLowerCase().includes('clinic') || rawText.startsWith('HC-') || rawText.startsWith('CC-')) {
        setScanResult({
          type: 'card',
          data: {
            id: 'CARD-' + Math.floor(1000 + Math.random() * 9000),
            cardNo: rawText,
            clinicName: rawText.split('|')[1] || "Associated Health Center",
            logo: "HC",
            benefit: "Integrated patient ledger synchronization & remote consultation scheduling",
            patientName: "Rajesh Kumar",
            type: "Linked Health Card"
          }
        });
        setScanMessage('Health Card Token detected.');
      } else if (rawText.toLowerCase().includes('rx') || rawText.includes('doctor') || rawText.includes('medication')) {
        // Fallback prescription format
        setScanResult({
          type: 'rx',
          data: {
            id: 'RX-' + Math.floor(1000 + Math.random() * 9000),
            doctorName: 'Dr. R. K. Singhal',
            specialty: 'Internal Medicine',
            date: new Date().toISOString().split('T')[0],
            patientName: 'Rajesh Kumar',
            symptoms: 'Scanned symptoms',
            medications: [
              { name: 'Paracetamol', dosage: '650mg', frequency: 'Twice daily', duration: '3 Days' }
            ],
            instructions: 'Scanned instructions',
            signatureCode: 'SIG-' + Math.floor(10000 + Math.random() * 90000)
          }
        });
        setScanMessage('Scanned Digital Prescription parsed.');
      } else {
        setScanResult({
          type: 'unknown',
          data: rawText
        });
        setScanMessage('Raw QR String data captured.');
      }
    }
  };

  const handleLinkCard = (cardData: any) => {
    // Check if already linked
    if (linkedCards.some(c => c.cardNo === cardData.cardNo)) {
      alert("This physical clinic card is already linked to your Pranavibhuti account!");
      setScanResult(null);
      return;
    }

    const newCard: LinkedCard = {
      id: cardData.id || 'CARD-' + Math.floor(10000 + Math.random() * 90000),
      cardNo: cardData.cardNo,
      clinicName: cardData.clinicName || "Linked Regional Clinic",
      logo: cardData.logo || cardData.clinicName?.substring(0, 2).toUpperCase() || "LC",
      benefit: cardData.benefit || "Standard co-pay coverage & instant appointment priority access",
      linkedAt: new Date().toISOString().split('T')[0],
      patientName: cardData.patientName || "Rajesh Kumar",
      type: cardData.cardType || cardData.type || "Clinic Smart Card"
    };

    setLinkedCards([newCard, ...linkedCards]);
    onAddNotification(`Successfully linked Clinic Card (${newCard.cardNo}) from ${newCard.clinicName}.`);
    setScanResult(null);
  };

  const handleLinkRx = (rxData: any) => {
    const newRx: Prescription = {
      id: rxData.id || 'RX-' + Math.floor(10000 + Math.random() * 90000),
      doctorName: rxData.doctorName || "Dr. Pranavibhuti AI Practitioner",
      specialty: rxData.specialty || "General Medicine",
      date: rxData.date || new Date().toISOString().split('T')[0],
      patientName: rxData.patientName || "Rajesh Kumar",
      symptoms: rxData.symptoms || "Chronic fatigue & cold cough",
      medications: rxData.medications || [],
      instructions: rxData.instructions || "Avoid high sodium intake, rest well.",
      signatureCode: rxData.signatureCode || "SIG-DIGI-MFA-9921"
    };

    onLinkPrescription(newRx);
    if (newRx.medications && newRx.medications.length > 0) {
      onLinkMedicine(newRx.medications);
    }
    onAddNotification(`Imported Prescription Token ${newRx.id} successfully into your Active Medicines & digital records.`);
    setScanResult(null);
  };

  const handleUnlinkCard = (id: string, cardNo: string, clinic: string) => {
    if (confirm(`Are you sure you want to decouple clinic card ${cardNo} from ${clinic}?`)) {
      setLinkedCards(linkedCards.filter(c => c.id !== id));
      onAddNotification(`Disconnected physical card ${cardNo} from regional clinic ${clinic}.`);
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualText.trim()) return;
    processScannedData(manualText);
    setManualText('');
  };

  // Sample data to test in iframe
  const sampleClinicCards = [
    {
      id: "CARD-AP-902",
      cardNo: "AP-9021-X9",
      clinicName: "Apollo Clinics, South Bengaluru",
      logo: "AP",
      benefit: "15% discount on pharmacy items & free annual primary health check",
      patientName: "Rajesh Kumar",
      type: "Premium Smart Card",
      qrPayload: JSON.stringify({
        type: 'clinic_card',
        id: "CARD-AP-902",
        cardNo: "AP-9021-X9",
        clinicName: "Apollo Clinics, South Bengaluru",
        logo: "AP",
        benefit: "15% discount on pharmacy items & free annual primary health check",
        patientName: "Rajesh Kumar",
        cardType: "Premium Smart Card"
      })
    },
    {
      id: "CARD-MX-448",
      cardNo: "MX-4481-V3",
      clinicName: "Max Super Specialty, Saket",
      logo: "MX",
      benefit: "Priority OPD triage queue bypass & instant specialist appointment scheduling",
      patientName: "Rajesh Kumar",
      type: "Silver Health Privilege",
      qrPayload: JSON.stringify({
        type: 'clinic_card',
        id: "CARD-MX-448",
        cardNo: "MX-4481-V3",
        clinicName: "Max Super Specialty, Saket",
        logo: "MX",
        benefit: "Priority OPD triage queue bypass & instant specialist appointment scheduling",
        patientName: "Rajesh Kumar",
        cardType: "Silver Health Privilege"
      })
    },
    {
      id: "CARD-MN-110",
      cardNo: "MN-1102-Y4",
      clinicName: "Manipal Hospitals, Whitefield",
      logo: "MN",
      benefit: "Comprehensive co-pay insurance linking & fast emergency desk checkout",
      patientName: "Rajesh Kumar",
      type: "Universal Care Card",
      qrPayload: JSON.stringify({
        type: 'clinic_card',
        id: "CARD-MN-110",
        cardNo: "MN-1102-Y4",
        clinicName: "Manipal Hospitals, Whitefield",
        logo: "MN",
        benefit: "Comprehensive co-pay insurance linking & fast emergency desk checkout",
        patientName: "Rajesh Kumar",
        cardType: "Universal Care Card"
      })
    }
  ];

  const samplePrescriptions = [
    {
      id: "RX-AP-9921",
      title: "Pediatric Tachycardia Review (Dr. Sengupta)",
      qrPayload: JSON.stringify({
        type: 'prescription',
        id: "RX-9921",
        doctorName: "Dr. Anita Sengupta",
        specialty: "Consultant Pediatrician",
        date: "2026-06-29",
        patientName: "Rajesh Kumar",
        symptoms: "Mild bronchial spasms & chest tightness",
        medications: [
          { name: "Montair LC", dosage: "10mg", frequency: "Once daily (Night)", duration: "5 Days" },
          { name: "Asthalin Inhaler", dosage: "100mcg (2 puffs)", frequency: "Twice daily", duration: "10 Days" }
        ],
        instructions: "Administer inhaler strictly when spasms occur. Take Montair LC right before going to bed.",
        signatureCode: "SIG-APOLLO-99120"
      })
    },
    {
      id: "RX-NH-8012",
      title: "Chronic Heart Rhythm Stabilizer (Dr. Shetty)",
      qrPayload: JSON.stringify({
        type: 'prescription',
        id: "RX-8012",
        doctorName: "Dr. Devi Shetty",
        specialty: "Senior Cardiologist",
        date: "2026-06-28",
        patientName: "Rajesh Kumar",
        symptoms: "Elevated sinus heart rate & mild stress palpitations",
        medications: [
          { name: "Metoprolol Succinate", dosage: "25mg", frequency: "Once daily", duration: "15 Days" },
          { name: "Atorvastatin", dosage: "10mg", frequency: "Once daily (Night)", duration: "30 Days" }
        ],
        instructions: "Measure blood pressure daily before morning Metoprolol dosage. Rest if feeling lightheaded.",
        signatureCode: "SIG-NARAYANA-0481"
      })
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* Upper Layout: Summary of Scanner Features */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 bg-slate-900 border border-slate-850 rounded-2xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-sky-500/20 text-sky-400">
              <QrCode className="h-4.5 w-4.5" />
            </span>
            <h3 className="text-sm font-black text-white uppercase tracking-wider">Universal QR Clinic Sync</h3>
          </div>
          <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
            Instantly sync physical regional clinic cards, hospital memberships, and paper prescriptions with the Pranavibhuti Patient System. Uses secure client-side cryptography.
          </p>
        </div>
        
        {/* Tab Selector */}
        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-[11px] font-bold shrink-0">
          <button
            onClick={() => { setActiveMode('camera'); startCamera(); }}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeMode === 'camera' ? 'bg-sky-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Camera Scanner
          </button>
          <button
            onClick={() => setActiveMode('samples')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeMode === 'samples' ? 'bg-sky-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Digital Mock Cards
          </button>
          <button
            onClick={() => setActiveMode('manual')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeMode === 'manual' ? 'bg-sky-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Manual Token Code
          </button>
        </div>
      </div>

      {/* Main Work Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: QR scanner, Input interface (Col 1-7) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6 flex flex-col justify-between">
          
          {/* Header */}
          <div className="border-b border-slate-800 pb-4 flex justify-between items-center">
            <div>
              <h4 className="font-extrabold text-sm text-white flex items-center gap-1.5">
                {activeMode === 'camera' && <Camera className="h-4 w-4 text-sky-400" />}
                {activeMode === 'samples' && <Sparkles className="h-4 w-4 text-emerald-400" />}
                {activeMode === 'manual' && <FileText className="h-4 w-4 text-purple-400" />}
                {activeMode === 'camera' ? "Live Camera Scanner Frame" : activeMode === 'samples' ? "Fast-Link Hospital Tokens" : "Paste Secure Cryptographic QR Data"}
              </h4>
              <p className="text-[10px] text-slate-400 mt-0.5">
                {activeMode === 'camera' && "Ensure the camera is well-lit and QR code is centered"}
                {activeMode === 'samples' && "Click any physical mock health document token to simulate a flawless QR code scan"}
                {activeMode === 'manual' && "Paste raw text payload decoded from physical document chips"}
              </p>
            </div>

            {activeMode === 'camera' && isCameraActive && (
              <span className="flex items-center gap-1 text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider animate-pulse">
                <span className="h-1.5 w-1.5 bg-emerald-400 rounded-full" />
                Live Feed Active
              </span>
            )}
          </div>

          {/* Core Scanner Content Frame */}
          <div className="relative bg-slate-950 rounded-2xl overflow-hidden flex flex-col justify-center items-center aspect-video border border-slate-850">
            
            {/* View 1: Camera Scanner */}
            {activeMode === 'camera' && (
              <>
                {/* Hidden canvas for decoding */}
                <canvas ref={canvasRef} className="hidden" />
                
                {isCameraActive ? (
                  <div className="relative w-full h-full flex justify-center items-center">
                    <video 
                      ref={videoRef} 
                      className="absolute inset-0 w-full h-full object-cover rounded-2xl"
                    />
                    
                    {/* Visual target reticle overlay */}
                    <div className="absolute inset-0 border-[3px] border-sky-500/10 flex items-center justify-center pointer-events-none">
                      <div className="relative w-48 h-48 sm:w-60 sm:h-60 border-2 border-dashed border-sky-400/40 rounded-xl flex items-center justify-center">
                        {/* Golden/Blue glowing scanner bar */}
                        <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-sky-400 rounded-tl" />
                        <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-sky-400 rounded-tr" />
                        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-sky-400 rounded-bl" />
                        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-sky-400 rounded-br" />
                        
                        <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-sky-400 to-transparent absolute shadow-md shadow-sky-400/50 animate-[scan_2s_infinite]" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 text-center space-y-4 max-w-sm">
                    {cameraError ? (
                      <div className="space-y-3">
                        <div className="h-12 w-12 rounded-xl bg-rose-500/15 border border-rose-500/20 text-rose-400 mx-auto flex items-center justify-center">
                          <AlertCircle className="h-6 w-6" />
                        </div>
                        <p className="text-xs font-bold text-rose-300 leading-relaxed">{cameraError}</p>
                        <button
                          onClick={startCamera}
                          className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-extrabold flex items-center gap-1.5 mx-auto"
                        >
                          <RefreshCw className="h-3.5 w-3.5" /> Try Camera Again
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="h-16 w-16 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 mx-auto flex items-center justify-center">
                          <Camera className="h-8 w-8" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-300 font-extrabold">Grant Camera Permission</p>
                          <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                            To link clinic cards in real-time, grant Pranavibhuti permission to load your video camera. Secure and local.
                          </p>
                        </div>
                        <button
                          onClick={startCamera}
                          className="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-extrabold flex items-center gap-1.5 mx-auto cursor-pointer"
                        >
                          <Camera className="h-4 w-4" /> Start Video Camera Scan
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}

            {/* View 2: Mock Samples Simulator */}
            {activeMode === 'samples' && (
              <div className="p-6 w-full h-full overflow-y-auto space-y-4">
                <div className="text-center pb-2">
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-extrabold uppercase tracking-wide">
                    Iframe Friendly Simulator
                  </span>
                  <p className="text-xs text-white font-extrabold mt-1">Tap a sample document to trigger QR scan action</p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Clinic smart cards */}
                  <div className="space-y-2">
                    <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider block">Physical Clinic Cards</span>
                    {sampleClinicCards.map(card => (
                      <button
                        key={card.id}
                        onClick={() => processScannedData(card.qrPayload)}
                        className="w-full p-3 bg-slate-900 border border-slate-800 rounded-xl text-left hover:border-emerald-500/50 hover:bg-slate-850 transition-all flex items-start gap-2.5 group cursor-pointer"
                      >
                        <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-black text-xs shrink-0">
                          {card.logo}
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] font-extrabold text-white group-hover:text-emerald-400 transition-colors truncate">{card.clinicName}</p>
                          <p className="text-[9px] text-slate-400 truncate mt-0.5">Card ID: {card.cardNo}</p>
                          <span className="inline-flex items-center gap-0.5 text-[8px] bg-slate-800 text-slate-300 px-1 py-0.2 rounded font-bold mt-1">
                            <Zap className="h-2 w-2 text-amber-400" /> Link Smart Card
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Prescription tokens */}
                  <div className="space-y-2">
                    <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider block">E-Prescription Tokens</span>
                    {samplePrescriptions.map(rx => (
                      <button
                        key={rx.id}
                        onClick={() => processScannedData(rx.qrPayload)}
                        className="w-full p-3 bg-slate-900 border border-slate-800 rounded-xl text-left hover:border-sky-500/50 hover:bg-slate-850 transition-all flex items-start gap-2.5 group cursor-pointer"
                      >
                        <div className="h-8 w-8 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20 flex items-center justify-center font-black text-xs shrink-0">
                          Rx
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] font-extrabold text-white group-hover:text-sky-400 transition-colors line-clamp-1 leading-normal">{rx.title}</p>
                          <p className="text-[9px] text-slate-400 truncate mt-0.5">Token ID: {rx.id}</p>
                          <span className="inline-flex items-center gap-0.5 text-[8px] bg-slate-800 text-slate-300 px-1 py-0.2 rounded font-bold mt-1">
                            <Pill className="h-2.5 w-2.5 text-sky-400" /> Import Prescription
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* View 3: Manual Code Input */}
            {activeMode === 'manual' && (
              <form onSubmit={handleManualSubmit} className="p-6 w-full max-w-md space-y-4">
                <div className="text-center">
                  <p className="text-xs text-white font-extrabold">Enter Cryptographic Clipboard Data</p>
                  <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                    Paste raw QR scan string payloads from digital cards or prescriptions to verify and link them to your universal ledger.
                  </p>
                </div>
                
                <textarea
                  value={manualText}
                  onChange={(e) => setManualText(e.target.value)}
                  placeholder='Paste data (e.g. {"type":"clinic_card","cardNo":"AP-1002","clinicName":"Apollo"})'
                  className="w-full h-20 bg-slate-900 border border-slate-800 rounded-xl p-3 text-[10px] font-mono text-emerald-400 focus:outline-none focus:border-purple-500 resize-none"
                />
                
                <button
                  type="submit"
                  className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-extrabold cursor-pointer transition-colors"
                >
                  Verify Cryptographic String
                </button>
              </form>
            )}

          </div>

          {/* Scanning status banner */}
          <div className="flex items-center gap-2.5 p-3.5 bg-slate-950 rounded-xl border border-slate-850 text-xs">
            {activeMode === 'camera' && isCameraActive ? (
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
            ) : (
              <QrCode className="h-4 w-4 text-slate-400" />
            )}
            <span className="font-semibold text-slate-300 truncate">{scanMessage}</span>
          </div>

          {/* Action on Successfully Decoded QR Code */}
          {scanResult && (
            <div className="bg-slate-950 border-2 border-emerald-500/40 rounded-2xl p-4 space-y-4 animate-fade-in text-xs">
              <div className="flex justify-between items-center border-b border-slate-850 pb-2">
                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                  <CheckCircle2 className="h-4.5 w-4.5" /> Decoded Secure Payload
                </span>
                <button 
                  onClick={() => setScanResult(null)}
                  className="text-slate-400 hover:text-white p-1"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {scanResult.type === 'card' ? (
                <div className="space-y-3">
                  <div className="flex items-start gap-3 bg-slate-900 p-3 rounded-xl border border-slate-800">
                    <div className="h-10 w-10 bg-emerald-500/10 text-emerald-400 rounded-lg flex items-center justify-center font-black text-base shrink-0 border border-emerald-500/20">
                      {scanResult.data.logo || "HC"}
                    </div>
                    <div>
                      <h5 className="font-extrabold text-white text-xs">{scanResult.data.clinicName}</h5>
                      <p className="text-[10px] text-slate-400 mt-0.5">Card Number: <span className="font-mono text-emerald-400">{scanResult.data.cardNo}</span></p>
                      <p className="text-[10px] text-slate-400">Cardholder: {scanResult.data.patientName}</p>
                    </div>
                  </div>
                  <div className="bg-slate-900 p-2.5 rounded-xl text-[10px] border border-slate-850 text-slate-300">
                    <span className="font-extrabold text-white uppercase text-[8px] tracking-wider block mb-1">Mapped Benefits</span>
                    {scanResult.data.benefit}
                  </div>
                  <button
                    onClick={() => handleLinkCard(scanResult.data)}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-extrabold text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <LinkIcon className="h-4 w-4" /> Link Clinic Smart Card
                  </button>
                </div>
              ) : scanResult.type === 'rx' ? (
                <div className="space-y-3">
                  <div className="flex items-start gap-3 bg-slate-900 p-3 rounded-xl border border-slate-800">
                    <div className="h-10 w-10 bg-sky-500/10 text-sky-400 rounded-lg flex items-center justify-center font-black text-base shrink-0 border border-sky-500/20">
                      Rx
                    </div>
                    <div>
                      <h5 className="font-extrabold text-white text-xs">E-Prescription: {scanResult.data.id}</h5>
                      <p className="text-[10px] text-slate-400 mt-0.5">Issued By: {scanResult.data.doctorName} ({scanResult.data.specialty})</p>
                      <p className="text-[10px] text-slate-400">Diagnosis/Symptoms: {scanResult.data.symptoms}</p>
                    </div>
                  </div>
                  
                  <div className="bg-slate-900 p-2.5 rounded-xl text-[10px] border border-slate-850 space-y-1">
                    <span className="font-extrabold text-white uppercase text-[8px] tracking-wider block mb-1">Decoded Medications</span>
                    {scanResult.data.medications?.map((m: any, i: number) => (
                      <div key={i} className="flex justify-between border-b border-slate-800/50 pb-1 mt-1 text-slate-300">
                        <span className="font-bold text-white">{m.name} ({m.dosage})</span>
                        <span>{m.frequency} • {m.duration}</span>
                      </div>
                    ))}
                    <p className="text-[9px] text-slate-400 italic pt-1 mt-1 border-t border-slate-800">Instructions: "{scanResult.data.instructions}"</p>
                  </div>
                  
                  <button
                    onClick={() => handleLinkRx(scanResult.data)}
                    className="w-full py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-extrabold text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Check className="h-4 w-4" /> Import and Link Prescription
                  </button>
                </div>
              ) : (
                <div className="space-y-3 text-center py-2">
                  <p className="font-mono text-[10px] text-slate-400 break-all bg-slate-900 p-3 rounded-xl border border-slate-850">
                    {typeof scanResult.data === 'string' ? scanResult.data : JSON.stringify(scanResult.data)}
                  </p>
                  <p className="text-[10px] text-amber-400 font-bold">Unrecognized schema format. No direct linking script available.</p>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Right Column: Linked Clinics Ledger & Cards (Col 8-12) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="border-b border-slate-800 pb-3">
              <h4 className="font-extrabold text-sm text-white flex items-center gap-1.5">
                <CreditCard className="h-4 w-4 text-emerald-400" />
                Linked Health Cards Ledger
              </h4>
              <p className="text-[10px] text-slate-400 mt-0.5">Physical smart memberships actively linked and authenticated</p>
            </div>

            {/* List of active clinic links */}
            <div className="space-y-3 max-h-[340px] overflow-y-auto pr-1">
              {linkedCards.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-500 border border-dashed border-slate-800 rounded-2xl">
                  No physical clinic cards linked yet. Scan a card QR Code to synchronize your regional medical profiles.
                </div>
              ) : (
                linkedCards.map((card) => (
                  <div 
                    key={card.id} 
                    className="bg-slate-950 border border-slate-850 hover:border-slate-800 rounded-2xl p-4 space-y-3.5 relative overflow-hidden transition-all group"
                  >
                    {/* Glowing active radar in corner */}
                    <div className="absolute top-4 right-4 flex items-center gap-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider">
                      <span className="h-1 w-1 bg-emerald-400 rounded-full animate-ping" />
                      Linked
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="h-9 w-9 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl flex items-center justify-center font-black text-sm shrink-0">
                        {card.logo}
                      </div>
                      <div className="min-w-0 pr-12">
                        <h5 className="font-extrabold text-white text-xs truncate leading-normal">{card.clinicName}</h5>
                        <p className="text-[9px] text-slate-400 truncate mt-0.5">{card.type} • ID: <span className="font-mono text-emerald-400">{card.cardNo}</span></p>
                      </div>
                    </div>

                    <div className="bg-slate-900 p-2.5 rounded-xl text-[10px] leading-normal text-slate-300 border border-slate-850">
                      <span className="font-black text-white block text-[8px] uppercase tracking-wider mb-1">Associated Benefits</span>
                      {card.benefit}
                    </div>

                    <div className="flex justify-between items-center text-[9px] text-slate-500 pt-1 border-t border-slate-900">
                      <span>Linked on {card.linkedAt}</span>
                      <button
                        onClick={() => handleUnlinkCard(card.id, card.cardNo, card.clinicName)}
                        className="text-rose-400 hover:text-rose-300 hover:underline font-extrabold flex items-center gap-0.5 cursor-pointer"
                      >
                        <Link2Off className="h-3 w-3" /> Decouple Card
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-850/50 text-[10px] text-slate-400 leading-normal">
            <span className="font-black text-white block uppercase text-[8px] tracking-wider mb-1">Security Standards</span>
            All linked health systems adhere to National Digital Health Mission (NDHM) guidelines. Decoupling immediately deletes access tokens.
          </div>
        </div>

      </div>

    </div>
  );
}
