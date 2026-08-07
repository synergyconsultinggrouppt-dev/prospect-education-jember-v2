import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
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
} from 'lucide-react';

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileEditModal: React.FC<ProfileEditModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { currentCandidate, updateCandidateProfile, t } = useApp();

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

  // Camera start handler
  const startCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 640 }, facingMode: 'user' },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsCameraActive(true);
    } catch (err: any) {
      console.error('Camera access error:', err);
      setCameraError(
        'Tidak dapat mengakses kamera. Pastikan izin kamera telah diberikan di browser atau gunakan fitur unggah foto.'
      );
      setIsCameraActive(false);
    }
  };

  // Capture photo from video stream
  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if (context) {
        canvas.width = video.videoWidth || 400;
        canvas.height = video.videoHeight || 400;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        setAvatarPreview(dataUrl);
        stopCameraStream();
        setSuccessMessage('Foto berhasil diambil melalui kamera!');
        setTimeout(() => setSuccessMessage(null), 3000);
      }
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
        setSuccessMessage('Foto berhasil dipilih!');
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

      setSuccessMessage('Profil & Kontak berhasil diperbarui!');
      setTimeout(() => {
        setIsSaving(false);
        setSuccessMessage(null);
      }, 2000);
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
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 p-6 bg-slate-50 rounded-2xl border border-slate-200 text-center">
                
                {/* Photo Preview Card */}
                <div className="flex flex-col items-center gap-2">
                  <div className="w-32 h-32 rounded-3xl bg-slate-200 border-4 border-white shadow-md overflow-hidden relative group flex items-center justify-center">
                    {avatarPreview ? (
                      <img
                        src={avatarPreview}
                        alt="Preview Foto"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-12 h-12 text-slate-400" />
                    )}
                  </div>
                  <span className="text-[11px] font-bold text-slate-500">
                    {avatarPreview ? 'Foto Profil Saat Ini' : 'Belum Ada Foto'}
                  </span>
                </div>

                <div className="space-y-3 text-left max-w-sm">
                  <h4 className="font-bold text-sm text-slate-900">
                    Format Foto Profil Pasfoto Resmi
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Gunakan foto formal dengan wajah menghadap ke depan. Anda dapat mengunggah file gambar (JPG/PNG) atau menggunakan kamera webcam secara langsung.
                  </p>
                  {avatarPreview && (
                    <button
                      type="button"
                      onClick={() => setAvatarPreview(null)}
                      className="text-xs font-bold text-red-700 hover:underline inline-flex items-center gap-1"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Hapus Foto Profil</span>
                    </button>
                  )}
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
                    <p className="text-[11px] text-slate-500">Pilih file gambar JPG atau PNG (Maks 5MB)</p>
                  </div>
                  <label className="cursor-pointer bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition inline-block">
                    <span>Pilih Berkas Foto</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Live Camera Capture Box */}
                <div className="p-4 border-2 border-dashed border-slate-300 rounded-2xl hover:border-amber-600 transition text-center space-y-3 bg-white flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-800 mx-auto flex items-center justify-center">
                      <Camera className="w-5 h-5" />
                    </div>
                    <h5 className="font-bold text-xs text-slate-900">Ambil Foto dengan Kamera</h5>
                    <p className="text-[11px] text-slate-500">Ambil pasfoto secara instan menggunakan webcam/kamera HP</p>
                  </div>
                  {!isCameraActive ? (
                    <button
                      type="button"
                      onClick={startCamera}
                      className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition inline-flex items-center justify-center gap-1.5"
                    >
                      <Video className="w-4 h-4" />
                      <span>Aktifkan Kamera</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={stopCameraStream}
                      className="bg-slate-700 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition"
                    >
                      Matikan Kamera
                    </button>
                  )}
                </div>
              </div>

              {/* Live Camera Viewport Modal inside */}
              {isCameraActive && (
                <div className="bg-slate-950 p-4 rounded-3xl text-center space-y-4 border border-amber-500/40 shadow-xl">
                  <div className="relative max-w-sm mx-auto rounded-2xl overflow-hidden bg-black aspect-square flex items-center justify-center">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="w-full h-full object-cover transform -scale-x-100"
                    />
                    {/* Face Guide Frame */}
                    <div className="absolute inset-8 border-2 border-dashed border-amber-400/60 rounded-full pointer-events-none" />
                  </div>

                  <canvas ref={canvasRef} className="hidden" />

                  <div className="flex items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={stopCameraStream}
                      className="px-4 py-2 text-xs font-bold text-slate-300 hover:text-white bg-slate-800 rounded-xl transition"
                    >
                      Batal
                    </button>
                    <button
                      type="button"
                      onClick={capturePhoto}
                      className="px-6 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 rounded-xl transition shadow-lg flex items-center gap-2"
                    >
                      <Camera className="w-4 h-4" />
                      <span>Ambil Foto Sekarang</span>
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
                  Selesai
                </button>
                <button
                  type="button"
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                  className="px-6 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-red-800 to-amber-700 hover:from-red-900 hover:to-amber-800 rounded-xl transition shadow-md flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? 'Menyimpan...' : 'Simpan Foto Profil'}</span>
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
