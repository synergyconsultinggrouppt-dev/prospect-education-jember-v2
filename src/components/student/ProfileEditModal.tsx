import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  isAndroidApp,
  requestNativeCameraPermission,
  launchNativeCameraCapture
} from '../../utils/androidBridge';
import {
  X,
  User,
  Mail,
  Phone,
  MapPin,
  Camera,
  Upload,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Video,
  RefreshCw,
  Save,
  ShieldCheck,
  FlipHorizontal,
  Timer,
  Sparkles,
  CreditCard,
  QrCode,
  Award,
  Check,
  Maximize2,
  Sliders
} from 'lucide-react';

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileEditModal: React.FC<ProfileEditModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { currentCandidate, updateCandidateProfile, uploadCandidateDocument, t } = useApp();

  const [activeTab, setActiveTab] = useState<'info' | 'photo' | 'password'>('info');

  // Form State - Personal Info
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneWA, setPhoneWA] = useState('');
  const [address, setAddress] = useState('');
  const [regency, setRegency] = useState('');

  // Form State - Photo
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Camera Settings State
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [aspectRatio, setAspectRatio] = useState<'3:4' | '1:1' | '35:45'>('3:4');
  const [countdownSetting, setCountdownSetting] = useState<0 | 3 | 5>(0);
  const [countdownVal, setCountdownVal] = useState<number | null>(null);
  const [isFlashing, setIsFlashing] = useState(false);
  const [saveToDocumentsToo, setSaveToDocumentsToo] = useState(true);
  const [showIDCardPreview, setShowIDCardPreview] = useState(false);

  // Form State - Password
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  // Feedback State
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Camera & Canvas Refs
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Populate state on candidate change or modal open
  useEffect(() => {
    if (currentCandidate) {
      setFullName(currentCandidate.fullName || '');
      setEmail(currentCandidate.email || '');
      setPhoneWA(currentCandidate.biodata?.phoneWA || '');
      setAddress(currentCandidate.biodata?.address || '');
      setRegency(currentCandidate.biodata?.regency || 'Jember');
      setAvatarPreview(currentCandidate.avatarUrl || null);
    }
  }, [currentCandidate, isOpen]);

  // Clean up camera stream when modal closes or unmounts or tab switches
  const stopCameraStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
    setCountdownVal(null);
  };

  useEffect(() => {
    if (!isOpen || activeTab !== 'photo') {
      stopCameraStream();
    }
    return () => {
      stopCameraStream();
    };
  }, [isOpen, activeTab]);

  if (!isOpen || !currentCandidate) return null;

  // Synthesize camera shutter sound via Web Audio API
  const playShutterAudio = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.08);

        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 0.08);
      }
    } catch (e) {
      // Audio fallback silent
    }
  };

  // Camera start handler
  const startCamera = async (overrideFacing?: 'user' | 'environment') => {
    setCameraError(null);
    const targetFacing = overrideFacing || facingMode;

    stopCameraStream();

    // If running inside Android Native wrapper, explicitly request Android native camera permission first
    if (isAndroidApp()) {
      try {
        const hasNativePerm = await requestNativeCameraPermission();
        if (!hasNativePerm) {
          setCameraError(
            'Izin kamera ditolak di perangkat Android Anda. Silakan izinkan akses kamera di Pengaturan Aplikasi Android.'
          );
          return;
        }
      } catch (e) {
        console.warn('[ProfileEdit] Android native permission check fallback to web getUserMedia', e);
      }
    }

    try {
      const constraints: MediaStreamConstraints = {
        video: {
          width: { ideal: 1280 },
          height: { ideal: 960 },
          facingMode: targetFacing,
        },
        audio: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsCameraActive(true);
      setFacingMode(targetFacing);
    } catch (err: any) {
      console.error('Camera access error:', err);
      setCameraError(
        'Tidak dapat mengakses kamera. Pastikan izin kamera telah diberikan di browser atau gunakan tombol unggah foto.'
      );
      setIsCameraActive(false);
    }
  };

  const toggleCameraFacing = () => {
    const nextFacing = facingMode === 'user' ? 'environment' : 'user';
    startCamera(nextFacing);
  };

  // Capture photo with camera
  const executeCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if (context) {
        // Calculate canvas dimensions based on chosen aspect ratio
        let targetWidth = video.videoWidth || 640;
        let targetHeight = video.videoHeight || 480;

        if (aspectRatio === '1:1') {
          const side = Math.min(targetWidth, targetHeight);
          canvas.width = side;
          canvas.height = side;
          const offsetX = (targetWidth - side) / 2;
          const offsetY = (targetHeight - side) / 2;
          context.drawImage(video, offsetX, offsetY, side, side, 0, 0, side, side);
        } else if (aspectRatio === '3:4' || aspectRatio === '35:45') {
          const expectedWidth = targetHeight * (3 / 4);
          if (targetWidth >= expectedWidth) {
            const offsetX = (targetWidth - expectedWidth) / 2;
            canvas.width = expectedWidth;
            canvas.height = targetHeight;
            context.drawImage(video, offsetX, 0, expectedWidth, targetHeight, 0, 0, expectedWidth, targetHeight);
          } else {
            const expectedHeight = targetWidth * (4 / 3);
            const offsetY = (targetHeight - expectedHeight) / 2;
            canvas.width = targetWidth;
            canvas.height = expectedHeight;
            context.drawImage(video, 0, offsetY, targetWidth, expectedHeight, 0, 0, targetWidth, expectedHeight);
          }
        }

        // Trigger flash and shutter audio
        setIsFlashing(true);
        playShutterAudio();
        setTimeout(() => setIsFlashing(false), 200);

        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        setAvatarPreview(dataUrl);
        stopCameraStream();
        setSuccessMessage('Foto pasfoto berhasil diambil via kamera!');
        setTimeout(() => setSuccessMessage(null), 3000);
      }
    }
  };

  const capturePhoto = () => {
    if (countdownSetting > 0) {
      setCountdownVal(countdownSetting);
      let timerVal = countdownSetting;
      const interval = setInterval(() => {
        timerVal -= 1;
        if (timerVal > 0) {
          setCountdownVal(timerVal);
        } else {
          clearInterval(interval);
          setCountdownVal(null);
          executeCapture();
        }
      }, 1000);
    } else {
      executeCapture();
    }
  };

  // File upload handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage('Ukuran file maksimal adalah 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
        setSuccessMessage('Foto berhasil dipilih dari perangkat!');
        setTimeout(() => setSuccessMessage(null), 3000);
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit Save Profile Info & Photo
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      updateCandidateProfile(currentCandidate.id, {
        fullName,
        email,
        phoneWA,
        address,
        regency,
        avatarUrl: avatarPreview || undefined,
      });

      // Also sync to official student documents checklist if requested
      if (avatarPreview && saveToDocumentsToo) {
        uploadCandidateDocument(currentCandidate.id, 'pasfoto', avatarPreview, 'Pasfoto Resmi Hasil Kamera');
      }

      setSuccessMessage('Profil, Foto Identitas & Berkas Resmi Berhasil Diperbarui!');
      setTimeout(() => {
        setIsSaving(false);
        setSuccessMessage(null);
      }, 2500);
    } catch (err) {
      setIsSaving(false);
      setErrorMessage('Gagal memperbarui profil. Silakan coba lagi.');
    }
  };

  // Submit Password Change
  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!currentPassword) {
      setErrorMessage('Masukkan kata sandi saat ini.');
      return;
    }

    if (newPassword.length < 6) {
      setErrorMessage('Kata sandi baru minimal 6 karakter.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('Konfirmasi kata sandi tidak cocok dengan kata sandi baru.');
      return;
    }

    setIsSaving(true);
    try {
      updateCandidateProfile(currentCandidate.id, {
        password: newPassword,
      });

      setSuccessMessage('Kata sandi akun Anda berhasil diubah!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => {
        setIsSaving(false);
        setSuccessMessage(null);
      }, 2000);
    } catch (err) {
      setIsSaving(false);
      setErrorMessage('Gagal memperbarui kata sandi.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-950 via-red-950 to-slate-900 text-white p-6 relative flex items-center justify-between border-b border-amber-500/30">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center shrink-0 overflow-hidden">
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt={fullName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-6 h-6 text-amber-300" />
              )}
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs text-amber-300 font-bold bg-amber-950/60 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span>Ubah Profil Peserta</span>
              </div>
              <h2 className="text-xl font-bold font-serif text-white mt-1">
                {currentCandidate.fullName}
              </h2>
              <p className="text-xs text-slate-300 font-mono">
                {currentCandidate.registrationNumber} • {currentCandidate.email}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              stopCameraStream();
              onClose();
            }}
            className="w-9 h-9 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-3 gap-2">
          <button
            onClick={() => {
              stopCameraStream();
              setActiveTab('info');
            }}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-bold rounded-t-xl transition border-b-2 ${
              activeTab === 'info'
                ? 'bg-white text-red-800 border-red-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 border-transparent hover:bg-slate-100'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Kontak & Biodata</span>
          </button>

          <button
            onClick={() => setActiveTab('photo')}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-bold rounded-t-xl transition border-b-2 ${
              activeTab === 'photo'
                ? 'bg-white text-red-800 border-red-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 border-transparent hover:bg-slate-100'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>Foto Profil & Kamera</span>
          </button>

          <button
            onClick={() => {
              stopCameraStream();
              setActiveTab('password');
            }}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-bold rounded-t-xl transition border-b-2 ${
              activeTab === 'password'
                ? 'bg-white text-red-800 border-red-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 border-transparent hover:bg-slate-100'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>Ubah Kata Sandi</span>
          </button>
        </div>

        {/* Modal Body Alerts */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(80vh-160px)]">
          {successMessage && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl flex items-center gap-3 text-xs font-semibold animate-in fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {errorMessage && (
            <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-2xl flex items-center gap-3 text-xs font-semibold animate-in fade-in">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* TAB 1: CONTACT & BIODATA EDIT */}
          {activeTab === 'info' && (
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-500" />
                    <span>Nama Lengkap</span>
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-red-800 focus:border-transparent outline-none bg-white font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-500" />
                    <span>Alamat Email</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-red-800 focus:border-transparent outline-none bg-white font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-500" />
                    <span>No. WhatsApp / Telepon</span>
                  </label>
                  <input
                    type="text"
                    value={phoneWA}
                    onChange={(e) => setPhoneWA(e.target.value)}
                    placeholder="Contoh: 08123456789"
                    required
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-red-800 focus:border-transparent outline-none bg-white font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    <span>Kota / Kabupaten Domisili</span>
                  </label>
                  <input
                    type="text"
                    value={regency}
                    onChange={(e) => setRegency(e.target.value)}
                    placeholder="Contoh: Jember"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-red-800 focus:border-transparent outline-none bg-white font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  <span>Alamat Lengkap</span>
                </label>
                <textarea
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Masukkan jalan, RT/RW, desa/kelurahan, dan kecamatan..."
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-red-800 focus:border-transparent outline-none bg-white font-medium resize-none"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-red-800 to-amber-700 hover:from-red-900 hover:to-amber-800 rounded-xl transition shadow-md flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: PROFILE PHOTO & CAMERA CAPTURE */}
          {activeTab === 'photo' && (
            <div className="space-y-6">
              {/* Top Banner & Photo Preview */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-5 bg-gradient-to-r from-slate-900 via-slate-950 to-red-950 text-white rounded-3xl border border-slate-800 shadow-md">
                
                {/* Photo Preview Card */}
                <div className="flex items-center gap-4">
                  <div className={`rounded-2xl bg-slate-800 border-2 border-amber-400/80 shadow-lg overflow-hidden relative group flex items-center justify-center shrink-0 transition-all ${
                    aspectRatio === '1:1' ? 'w-24 h-24' : 'w-20 h-28'
                  }`}>
                    {avatarPreview ? (
                      <img
                        src={avatarPreview}
                        alt="Preview Foto"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-10 h-10 text-slate-500" />
                    )}
                    {avatarPreview && (
                      <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                        <button
                          type="button"
                          onClick={() => setAvatarPreview(null)}
                          className="p-1.5 bg-red-600 hover:bg-red-500 text-white rounded-full transition"
                          title="Hapus foto ini"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="space-y-1.5 text-left">
                    <div className="inline-flex items-center gap-1.5 bg-amber-500/20 text-amber-300 text-[10.5px] font-bold px-2.5 py-0.5 rounded-full border border-amber-500/30">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Standar Pasfoto Kartu Tanda Peserta & Dokumen</span>
                    </div>
                    <h4 className="font-bold text-sm text-white">
                      {avatarPreview ? 'Pasfoto Peserta Aktif' : 'Belum Ada Foto Identitas'}
                    </h4>
                    <p className="text-[11.5px] text-slate-300 leading-relaxed max-w-xs">
                      Foto ini digunakan secara otomatis di <strong>Kartu Siswa Digital</strong>, <strong>LoA Resmi</strong>, <strong>Sertifikat LMS</strong>, dan berkas visa.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setShowIDCardPreview(!showIDCardPreview)}
                    className={`w-full sm:w-auto px-3.5 py-2 rounded-xl font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer ${
                      showIDCardPreview
                        ? 'bg-amber-400 text-slate-950 shadow-md'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 text-amber-400" />
                    <span>{showIDCardPreview ? 'Sembunyikan Kartu' : 'Simulasi ID Card'}</span>
                  </button>
                </div>
              </div>

              {/* ID Card Live Mockup Preview */}
              {showIDCardPreview && (
                <div className="bg-slate-950 p-5 rounded-3xl border border-amber-500/30 shadow-xl space-y-3 animate-in fade-in duration-300">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
                      <CreditCard className="w-4 h-4 text-amber-400" />
                      <span>SIMULASI PRATINJAU KARTU TANDA PESERTA DIGITAL</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">LKP PROSPECT EDUCATION JEMBER</span>
                  </div>

                  <div className="max-w-md mx-auto bg-gradient-to-br from-[#0F3D7A] via-sky-900 to-slate-950 text-white rounded-2xl p-4 border border-sky-300/40 shadow-2xl relative overflow-hidden space-y-3">
                    <div className="flex items-center justify-between border-b border-sky-400/30 pb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-white/10 p-1 border border-white/20 flex items-center justify-center font-serif font-black text-amber-300 text-xs">
                          LKP
                        </div>
                        <div>
                          <p className="text-[11px] font-black tracking-wide text-white">PROSPECT EDUCATION</p>
                          <p className="text-[9px] text-sky-200 uppercase tracking-wider">Cabang Jember • Jawa Timur</p>
                        </div>
                      </div>
                      <span className="bg-amber-400 text-slate-950 font-black text-[9px] px-2 py-0.5 rounded-full uppercase">
                        Siswa Resmi
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-20 h-24 rounded-xl bg-slate-900 border-2 border-amber-300 overflow-hidden shrink-0 shadow-md">
                        {avatarPreview ? (
                          <img src={avatarPreview} alt="Foto ID Card" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 text-[10px]">
                            <User className="w-8 h-8 text-slate-600 mb-1" />
                            <span>Foto</span>
                          </div>
                        )}
                      </div>

                      <div className="space-y-1 grow text-xs">
                        <div>
                          <span className="text-[9px] text-sky-300 block uppercase">Nama Peserta:</span>
                          <p className="font-bold font-serif text-white text-sm line-clamp-1">{currentCandidate.fullName}</p>
                        </div>
                        <div>
                          <span className="text-[9px] text-sky-300 block uppercase">No. Registrasi / ID:</span>
                          <p className="font-mono text-amber-300 font-bold text-xs">{currentCandidate.registrationNumber}</p>
                        </div>
                        <div>
                          <span className="text-[9px] text-sky-300 block uppercase">Program Pelatihan:</span>
                          <p className="text-[11px] font-semibold text-slate-100 uppercase">{currentCandidate.selectedProgram?.replace('_', ' ')}</p>
                        </div>
                      </div>

                      <div className="bg-white p-1.5 rounded-lg shrink-0 shadow-sm border border-slate-200">
                        <QrCode className="w-12 h-12 text-slate-900" />
                      </div>
                    </div>

                    <div className="pt-2 border-t border-sky-400/20 flex items-center justify-between text-[9px] text-sky-200">
                      <span>Status: Terverifikasi Sistem LKP Prospect</span>
                      <span className="font-mono">Jember, ID-CARD-2026</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Aspect Ratio & Camera Controls Bar */}
              <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 text-white space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-amber-400" />
                    <span className="font-bold text-slate-200">Pengaturan Kamera Pasfoto:</span>
                  </div>

                  {/* Aspect Ratio selector */}
                  <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                    <button
                      type="button"
                      onClick={() => setAspectRatio('3:4')}
                      className={`px-3 py-1 rounded-lg text-[11px] font-bold transition ${
                        aspectRatio === '3:4'
                          ? 'bg-amber-500 text-slate-950 shadow-xs'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      3 x 4 (Pasfoto KTP/LKP)
                    </button>
                    <button
                      type="button"
                      onClick={() => setAspectRatio('35:45')}
                      className={`px-3 py-1 rounded-lg text-[11px] font-bold transition ${
                        aspectRatio === '35:45'
                          ? 'bg-amber-500 text-slate-950 shadow-xs'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      35 x 45mm (Taiwan/Paspor)
                    </button>
                    <button
                      type="button"
                      onClick={() => setAspectRatio('1:1')}
                      className={`px-3 py-1 rounded-lg text-[11px] font-bold transition ${
                        aspectRatio === '1:1'
                          ? 'bg-amber-500 text-slate-950 shadow-xs'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      1 : 1 (Square Profil)
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800 text-xs">
                  {/* Timer selection */}
                  <div className="flex items-center gap-2">
                    <Timer className="w-3.5 h-3.5 text-amber-400" />
                    <span className="text-slate-400 text-[11px]">Timer Countdown:</span>
                    <div className="flex items-center gap-1">
                      {[0, 3, 5].map((sec) => (
                        <button
                          key={sec}
                          type="button"
                          onClick={() => setCountdownSetting(sec as 0 | 3 | 5)}
                          className={`px-2.5 py-0.5 rounded-md text-[10.5px] font-mono font-bold transition ${
                            countdownSetting === sec
                              ? 'bg-amber-400 text-slate-950'
                              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                          }`}
                        >
                          {sec === 0 ? 'Off' : `${sec}s`}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Synchronize checkbox */}
                  <label className="inline-flex items-center gap-2 cursor-pointer text-[11px] text-slate-300 hover:text-white">
                    <input
                      type="checkbox"
                      checked={saveToDocumentsToo}
                      onChange={(e) => setSaveToDocumentsToo(e.target.checked)}
                      className="rounded border-slate-700 text-amber-500 focus:ring-amber-500"
                    />
                    <span>Otomatis simpan ke Berkas Wajib Pasfoto (35x45mm)</span>
                  </label>
                </div>
              </div>

              {/* Action Choices */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* File Upload Box */}
                <div className="p-4 border-2 border-dashed border-slate-300 rounded-2xl hover:border-red-600 transition text-center space-y-3 bg-white flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="w-10 h-10 rounded-full bg-red-50 text-red-800 mx-auto flex items-center justify-center">
                      <Upload className="w-5 h-5" />
                    </div>
                    <h5 className="font-bold text-xs text-slate-900">Unggah dari Perangkat</h5>
                    <p className="text-[11px] text-slate-500">Pilih file gambar JPG atau PNG dari galeri / file manager (Maks 5MB)</p>
                  </div>
                  <label className="cursor-pointer bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition inline-block">
                    <span>Pilih Berkas Gambar</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Live Camera Capture Box */}
                <div className="p-4 border-2 border-dashed border-amber-300 rounded-2xl hover:border-amber-600 transition text-center space-y-3 bg-amber-50/50 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-900 mx-auto flex items-center justify-center">
                      <Camera className="w-5 h-5 text-amber-700" />
                    </div>
                    <h5 className="font-bold text-xs text-slate-900">Ambil Pasfoto via Kamera API</h5>
                    <p className="text-[11px] text-slate-500">Gunakan webcam laptop atau kamera HP dengan bingkai panduan wajah</p>
                  </div>
                  {!isCameraActive ? (
                    <button
                      type="button"
                      onClick={() => startCamera()}
                      className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition inline-flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
                    >
                      <Video className="w-4 h-4" />
                      <span>Buka Kamera Sekarang</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={stopCameraStream}
                      className="bg-slate-700 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition cursor-pointer"
                    >
                      Matikan Kamera
                    </button>
                  )}
                </div>
              </div>

              {/* Live Camera Viewport Modal inside */}
              {isCameraActive && (
                <div className="bg-slate-950 p-5 rounded-3xl text-center space-y-4 border-2 border-amber-500/60 shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                  
                  {/* Camera Flash Overlay */}
                  {isFlashing && (
                    <div className="absolute inset-0 bg-white z-30 animate-out fade-out duration-300 pointer-events-none" />
                  )}

                  {/* Countdown Overlay */}
                  {countdownVal !== null && (
                    <div className="absolute inset-0 bg-slate-950/70 z-20 flex items-center justify-center backdrop-blur-2xs">
                      <div className="w-24 h-24 rounded-full bg-amber-500 text-slate-950 font-black text-5xl font-mono flex items-center justify-center animate-bounce shadow-2xl">
                        {countdownVal}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs text-amber-300 border-b border-slate-800 pb-2 px-1">
                    <span className="flex items-center gap-1.5 font-bold">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                      <span>Kamera Aktif • Standar Pasfoto {aspectRatio}</span>
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={toggleCameraFacing}
                        className="p-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded-lg text-xs font-bold transition flex items-center gap-1 border border-slate-700 cursor-pointer"
                        title="Tukar Kamera Depan / Belakang"
                      >
                        <FlipHorizontal className="w-4 h-4" />
                        <span className="text-[10px] hidden sm:inline">Flip Kamera</span>
                      </button>
                    </div>
                  </div>

                  {/* Video Container with Aspect Ratio Frame & Oval Face Guide */}
                  <div className="relative max-w-sm mx-auto rounded-2xl overflow-hidden bg-black flex items-center justify-center shadow-inner border border-slate-800"
                    style={{
                      aspectRatio: aspectRatio === '1:1' ? '1 / 1' : aspectRatio === '3:4' ? '3 / 4' : '35 / 45'
                    }}
                  >
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className={`w-full h-full object-cover ${facingMode === 'user' ? 'transform -scale-x-100' : ''}`}
                    />

                    {/* Oval Face Alignment Frame & Guidelines */}
                    <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center p-4">
                      {/* Face Oval */}
                      <div className="w-48 h-60 border-2 border-dashed border-amber-400/80 rounded-[50%] shadow-lg relative flex items-center justify-center">
                        <div className="w-full border-t border-amber-400/30 absolute" />
                        <div className="h-full border-l border-amber-400/30 absolute" />
                      </div>
                      
                      {/* Shoulder Guidelines */}
                      <div className="w-64 border-t-2 border-dashed border-amber-400/50 absolute bottom-6" />

                      <span className="absolute bottom-2 bg-slate-950/80 text-amber-300 text-[10px] font-bold px-3 py-1 rounded-full border border-amber-500/40 backdrop-blur-2xs">
                        Posisikan Wajah di Dalam Bingkai Oval
                      </span>
                    </div>
                  </div>

                  <canvas ref={canvasRef} className="hidden" />

                  <div className="flex items-center justify-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={stopCameraStream}
                      className="px-4 py-2.5 text-xs font-bold text-slate-300 hover:text-white bg-slate-800 rounded-xl transition cursor-pointer"
                    >
                      Batal
                    </button>
                    <button
                      type="button"
                      onClick={capturePhoto}
                      disabled={countdownVal !== null}
                      className="px-6 py-3 text-xs font-black text-slate-950 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 rounded-xl transition shadow-xl flex items-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
                    >
                      <Camera className="w-4 h-4 text-slate-950" />
                      <span>{countdownSetting > 0 ? `Ambil Foto (${countdownSetting}s)` : 'Jepret Foto Sekarang'}</span>
                    </button>
                  </div>
                </div>
              )}

              {cameraError && (
                <div className="bg-red-50 border border-red-200 text-red-800 p-3 rounded-xl text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{cameraError}</span>
                </div>
              )}

              {/* Save Photo Profile Button */}
              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
                >
                  Tutup Modal
                </button>
                <button
                  type="button"
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                  className="px-6 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-red-800 to-amber-700 hover:from-red-900 hover:to-amber-800 rounded-xl transition shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? 'Menyimpan...' : 'Simpan Perubahan Foto & Profil'}</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: PASSWORD CHANGE */}
          {activeTab === 'password' && (
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 text-amber-900 p-4 rounded-2xl text-xs space-y-1">
                <p className="font-bold">Keamanan Akun Peserta</p>
                <p className="text-slate-600">
                  Gunakan kombinasi kata sandi yang aman minimal 6 karakter.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-slate-500" />
                  <span>Kata Sandi Saat Ini</span>
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPass ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    placeholder="Masukkan kata sandi lama Anda"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-red-800 focus:border-transparent outline-none bg-white font-medium pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPass(!showCurrentPass)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    {showCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-slate-500" />
                    <span>Kata Sandi Baru</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPass ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      placeholder="Minimal 6 karakter"
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-red-800 focus:border-transparent outline-none bg-white font-medium pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPass(!showNewPass)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                    >
                      {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-slate-500" />
                    <span>Konfirmasi Kata Sandi Baru</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPass ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      placeholder="Ulangi kata sandi baru"
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-red-800 focus:border-transparent outline-none bg-white font-medium pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPass(!showConfirmPass)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                    >
                      {showConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-red-800 to-amber-700 hover:from-red-900 hover:to-amber-800 rounded-xl transition shadow-md flex items-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  <span>{isSaving ? 'Memproses...' : 'Ubah Kata Sandi'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
