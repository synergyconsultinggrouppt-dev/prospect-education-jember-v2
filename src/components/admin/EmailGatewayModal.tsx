import React, { useState, useEffect } from 'react';
import { EmailGatewayConfig, EmailNotificationLog, Candidate } from '../../types';
import { sendEmailNotificationApi, fetchEmailLogsApi, DEFAULT_EMAIL_CONFIG } from '../../utils/emailNotification';
import {
  Mail,
  Send,
  X,
  CheckCircle2,
  AlertCircle,
  Key,
  Server,
  Check,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Sliders,
  History,
  Info,
  Eye,
  FileCheck,
  UserCheck
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  config: EmailGatewayConfig;
  onSaveConfig: (newConfig: EmailGatewayConfig) => void;
  candidates?: Candidate[];
}

export const EmailGatewayModal: React.FC<Props> = ({
  isOpen,
  onClose,
  config: initialConfig,
  onSaveConfig,
  candidates = [],
}) => {
  const [activeTab, setActiveTab] = useState<'config' | 'test' | 'logs'>('config');
  const [formData, setFormData] = useState<EmailGatewayConfig>(initialConfig || DEFAULT_EMAIL_CONFIG);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Test Send States
  const [selectedCandidateId, setSelectedCandidateId] = useState<string>('');
  const [testEmail, setTestEmail] = useState('pendaftar@gmail.com');
  const [testName, setTestName] = useState('Calon Peserta Prospect');
  const [testRegNo, setTestRegNo] = useState('REG-PROSPECT-2026-001');
  const [testProgram, setTestProgram] = useState('Program Kuliah + Magang Taiwan (IFP 1+4)');
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    status: string;
    message: string;
  } | null>(null);

  // Email Logs
  const [logs, setLogs] = useState<EmailNotificationLog[]>([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState(false);
  const [previewLogHtml, setPreviewLogHtml] = useState<string | null>(null);

  useEffect(() => {
    if (initialConfig) {
      setFormData(initialConfig);
    }
  }, [initialConfig]);

  useEffect(() => {
    if (isOpen) {
      loadLogs();
      if (candidates.length > 0) {
        const first = candidates[0];
        setSelectedCandidateId(first.id);
        setTestEmail(first.biodata?.email || first.email || 'pendaftar@gmail.com');
        setTestName(first.fullName);
        setTestRegNo(first.registrationNumber);
        setTestProgram(
          first.program === 'TAIWAN' || first.program === 'S1_TAIWAN'
            ? 'Program Kuliah + Magang Taiwan (IFP 1+4)'
            : 'Program Pelatihan Kerja Jepang (Tokutei Ginou SSW)'
        );
      }
    }
  }, [isOpen, candidates]);

  const loadLogs = async () => {
    setIsLoadingLogs(true);
    try {
      const fetchedLogs = await fetchEmailLogsApi();
      setLogs(fetchedLogs);
    } catch (err) {
      console.warn('Error loading email logs:', err);
    } finally {
      setIsLoadingLogs(false);
    }
  };

  if (!isOpen) return null;

  const handleSelectCandidate = (candId: string) => {
    setSelectedCandidateId(candId);
    const cand = candidates.find((c) => c.id === candId);
    if (cand) {
      setTestEmail(cand.biodata?.email || cand.email || '');
      setTestName(cand.fullName);
      setTestRegNo(cand.registrationNumber);
      setTestProgram(
        cand.program === 'TAIWAN' || cand.program === 'S1_TAIWAN'
          ? 'Program Kuliah + Magang Taiwan (IFP 1+4)'
          : 'Program Pelatihan Kerja Jepang (Tokutei Ginou SSW)'
      );
    }
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveConfig(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleSendTestEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testEmail || !testEmail.includes('@')) {
      alert('Masukkan alamat email penerima yang valid.');
      return;
    }

    setIsSendingTest(true);
    setTestResult(null);

    const result = await sendEmailNotificationApi({
      recipientEmail: testEmail,
      recipientName: testName,
      subject: `🎉 Selamat! Akun Pendaftaran Prospect Education Jember Disetujui (${testRegNo})`,
      eventType: 'account_approval',
      candidateId: selectedCandidateId,
      registrationNumber: testRegNo,
      programTitle: testProgram,
      config: formData,
    });

    setIsSendingTest(false);
    setTestResult({
      success: result.success,
      status: result.status,
      message: result.message || result.errorMessage || 'Selesai diproses.',
    });

    loadLogs();
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-3 sm:p-4 bg-slate-900/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-auto">
        {/* Header Bar */}
        <div className="flex items-center justify-between p-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-500/20 border border-indigo-400/30 rounded-2xl text-indigo-300">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-white">Layanan Notifikasi Email Otomatis</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  SMTP & Service
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Pengiriman email otomatis kepada pendaftar saat akun/status mereka disetujui oleh admin
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 px-5 pt-3 gap-2">
          <button
            onClick={() => setActiveTab('config')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-t-xl border-t border-x transition-all ${
              activeTab === 'config'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 border-slate-200 dark:border-slate-800 border-b-transparent'
                : 'text-slate-500 hover:text-slate-800 border-transparent'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Pengaturan SMTP</span>
          </button>

          <button
            onClick={() => setActiveTab('test')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-t-xl border-t border-x transition-all ${
              activeTab === 'test'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 border-slate-200 dark:border-slate-800 border-b-transparent'
                : 'text-slate-500 hover:text-slate-800 border-transparent'
            }`}
          >
            <Send className="w-4 h-4" />
            <span>Uji Coba Kirim Email</span>
          </button>

          <button
            onClick={() => setActiveTab('logs')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-t-xl border-t border-x transition-all ${
              activeTab === 'logs'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 border-slate-200 dark:border-slate-800 border-b-transparent'
                : 'text-slate-500 hover:text-slate-800 border-transparent'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Riwayat Log ({logs.length})</span>
          </button>
        </div>

        {/* Modal Body Content */}
        <div className="p-6 max-h-[75vh] overflow-y-auto">
          {savedSuccess && (
            <div className="mb-5 p-3.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-2xl flex items-center gap-3 text-emerald-800 dark:text-emerald-200 text-xs font-bold animate-fadeIn">
              <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
              <span>Pengaturan Email Gateway berhasil disimpan! Sistem siap mengirim notifikasi otomatis.</span>
            </div>
          )}

          {/* TAB 1: CONFIGURATION */}
          {activeTab === 'config' && (
            <form onSubmit={handleSaveConfig} className="space-y-5">
              <div className="p-4 bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 rounded-2xl flex items-start gap-3">
                <Info className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                <div className="text-xs text-indigo-950 dark:text-indigo-200 space-y-1">
                  <p className="font-bold">Informasi Integrasi Email Gateway:</p>
                  <p>
                    Saat admin menyetujui pendaftaran akun pendaftar (Status <strong>Verified Admin</strong>), sistem akan secara otomatis mengirimkan email konfirmasi resmi berisi tautan portal LMS, instruksi login, dan detail pendaftaran.
                  </p>
                  <p className="text-[11px] opacity-80">
                    *Jika server SMTP tidak diisi, sistem berjalan dalam mode simulasi terintegrasi dan tetap mencatat seluruh log di database.
                  </p>
                </div>
              </div>

              {/* Activation Switch */}
              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700">
                <div>
                  <label className="text-xs font-extrabold text-slate-800 dark:text-slate-100 block">
                    Status Layanan Email Notifikasi
                  </label>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Aktifkan/nonaktifkan pengiriman email otomatis seluruh sistem
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, enabled: !formData.enabled })}
                  className={`w-14 h-8 rounded-full transition-colors relative p-1 ${
                    formData.enabled ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                >
                  <div
                    className={`w-6 h-6 bg-white rounded-full shadow-md transition-transform transform ${
                      formData.enabled ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Event Toggles */}
              <div className="space-y-2">
                <h4 className="text-xs font-extrabold text-slate-800 dark:text-slate-200">
                  Trigger Pengiriman Otomatis:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className="flex items-center gap-2.5 p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.notifyOnAccountApproval}
                      onChange={(e) => setFormData({ ...formData, notifyOnAccountApproval: e.target.checked })}
                      className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                    />
                    <span>Persetujuan Akun Pendaftar (Approval Admin)</span>
                  </label>

                  <label className="flex items-center gap-2.5 p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.notifyOnRegistration}
                      onChange={(e) => setFormData({ ...formData, notifyOnRegistration: e.target.checked })}
                      className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                    />
                    <span>Registrasi Baru Pendaftar</span>
                  </label>
                </div>
              </div>

              {/* SMTP Credentials Form */}
              <div className="border-t border-slate-200 dark:border-slate-800 pt-4 space-y-4">
                <h4 className="text-xs font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <Server className="w-4 h-4 text-indigo-600" />
                  <span>Pengaturan Konfigurasi Server SMTP (Opsional / Custom Server)</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      SMTP Host:
                    </label>
                    <input
                      type="text"
                      value={formData.smtpHost}
                      onChange={(e) => setFormData({ ...formData, smtpHost: e.target.value })}
                      placeholder="smtp.gmail.com atau smtp.mailtrap.io"
                      className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      SMTP Port:
                    </label>
                    <input
                      type="number"
                      value={formData.smtpPort}
                      onChange={(e) => setFormData({ ...formData, smtpPort: Number(e.target.value) })}
                      placeholder="587 / 465"
                      className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Username / Email SMTP:
                    </label>
                    <input
                      type="text"
                      value={formData.smtpUser}
                      onChange={(e) => setFormData({ ...formData, smtpUser: e.target.value })}
                      placeholder="notifikasi@prospecteducation.id"
                      className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Password SMTP / App Password:
                    </label>
                    <input
                      type="password"
                      value={formData.smtpPass}
                      onChange={(e) => setFormData({ ...formData, smtpPass: e.target.value })}
                      placeholder="••••••••••••••••"
                      className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Alamat Email Pengirim (From Email):
                    </label>
                    <input
                      type="email"
                      value={formData.fromEmail}
                      onChange={(e) => setFormData({ ...formData, fromEmail: e.target.value })}
                      placeholder="info@prospecteducation.id"
                      className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Nama Pengirim (From Name):
                    </label>
                    <input
                      type="text"
                      value={formData.fromName}
                      onChange={(e) => setFormData({ ...formData, fromName: e.target.value })}
                      placeholder="Prospect Education Cabang Jember"
                      className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-3 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-extrabold shadow-md hover:shadow-indigo-500/20 transition-all flex items-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Simpan Pengaturan Email</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: TEST SENDING */}
          {activeTab === 'test' && (
            <form onSubmit={handleSendTestEmail} className="space-y-5">
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
                <h4 className="text-xs font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-emerald-600" />
                  <span>Pilih Pendaftar atau Masukkan Email Penerima Simulasi</span>
                </h4>

                {candidates.length > 0 && (
                  <div>
                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                      Pilih dari Daftar Pendaftar:
                    </label>
                    <select
                      value={selectedCandidateId}
                      onChange={(e) => handleSelectCandidate(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      {candidates.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.fullName} ({c.registrationNumber}) &bull; {c.biodata?.email || c.email}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                      Nama Penerima:
                    </label>
                    <input
                      type="text"
                      value={testName}
                      onChange={(e) => setTestName(e.target.value)}
                      className="w-full px-3.5 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-medium outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                      Email Tujuan:
                    </label>
                    <input
                      type="email"
                      value={testEmail}
                      onChange={(e) => setTestEmail(e.target.value)}
                      className="w-full px-3.5 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-medium outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                      Nomor Pendaftaran:
                    </label>
                    <input
                      type="text"
                      value={testRegNo}
                      onChange={(e) => setTestRegNo(e.target.value)}
                      className="w-full px-3.5 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-medium outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                      Program Studi/Tujuan:
                    </label>
                    <input
                      type="text"
                      value={testProgram}
                      onChange={(e) => setTestProgram(e.target.value)}
                      className="w-full px-3.5 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-medium outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>

              {testResult && (
                <div
                  className={`p-4 rounded-2xl border text-xs font-bold ${
                    testResult.success
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                      : 'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800 text-red-900 dark:text-red-200'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {testResult.success ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-600" />
                    )}
                    <span>Status Pengiriman: {testResult.status.toUpperCase()}</span>
                  </div>
                  <p className="font-normal opacity-90">{testResult.message}</p>
                </div>
              )}

              <div className="flex justify-end gap-3">
                <button
                  type="submit"
                  disabled={isSendingTest}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {isSendingTest ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Mengirimkan Email...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Kirim Email Notifikasi Persetujuan</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: LOGS & HISTORY */}
          {activeTab === 'logs' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Riwayat 50 log pengiriman email notifikasi terbaru:
                </p>
                <button
                  onClick={loadLogs}
                  disabled={isLoadingLogs}
                  className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition-colors"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoadingLogs ? 'animate-spin' : ''}`} />
                  <span>Refresh Log</span>
                </button>
              </div>

              {logs.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
                  <Mail className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                  <p className="text-xs font-bold text-slate-600 dark:text-slate-300">Belum Ada Log Pengiriman Email</p>
                  <p className="text-[11px] text-slate-400">
                    Log otomatis akan muncul saat admin menyetujui akun pendaftar atau melakukan uji coba kirim email.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-100 dark:bg-slate-800 text-[11px] font-extrabold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                        <th className="p-3">Waktu</th>
                        <th className="p-3">Pendaftar</th>
                        <th className="p-3">Email Tujuan</th>
                        <th className="p-3">Jenis Event</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-center">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-xs text-slate-700 dark:text-slate-300">
                      {logs.map((log) => (
                        <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                          <td className="p-3 font-mono text-[11px] text-slate-500">
                            {new Date(log.sentAt).toLocaleString('id-ID', {
                              day: 'numeric',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </td>
                          <td className="p-3 font-bold text-slate-900 dark:text-slate-100">{log.candidateName}</td>
                          <td className="p-3 font-mono text-[11px] text-slate-600 dark:text-slate-400">{log.recipientEmail}</td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-200">
                              {log.eventType === 'account_approval' ? 'Persetujuan Akun' : log.eventType}
                            </span>
                          </td>
                          <td className="p-3">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                                log.status === 'sent'
                                  ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200'
                                  : 'bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200'
                              }`}
                            >
                              {log.status === 'sent' ? 'TERKIRIM (SMTP)' : 'SIMULASI DISPATCH'}
                            </span>
                          </td>
                          <td className="p-3 text-center">
                            {log.htmlPreview && (
                              <button
                                onClick={() => setPreviewLogHtml(log.htmlPreview || null)}
                                className="px-2.5 py-1 bg-indigo-50 dark:bg-indigo-900/40 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 rounded-lg text-[11px] font-bold flex items-center gap-1 mx-auto transition-colors"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>Preview</span>
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>

        {/* HTML Preview Modal Overlay */}
        {previewLogHtml && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden flex flex-col shadow-2xl">
              <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
                <span className="text-xs font-bold flex items-center gap-2">
                  <Eye className="w-4 h-4 text-emerald-400" />
                  Pratinjau HTML Template Email Notifikasi
                </span>
                <button onClick={() => setPreviewLogHtml(null)} className="p-1 hover:bg-white/10 rounded-lg">
                  <X className="w-5 h-5 text-slate-300" />
                </button>
              </div>
              <div className="p-4 overflow-y-auto flex-1 bg-slate-100">
                <iframe
                  srcDoc={previewLogHtml}
                  title="Email Preview"
                  className="w-full h-[500px] rounded-xl border border-slate-300 bg-white"
                />
              </div>
              <div className="p-3 bg-slate-50 border-t flex justify-end">
                <button
                  onClick={() => setPreviewLogHtml(null)}
                  className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold"
                >
                  Tutup Pratinjau
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
