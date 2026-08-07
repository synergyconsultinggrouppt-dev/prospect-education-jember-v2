import React, { useState, useEffect } from 'react';
import { WhatsAppGatewayConfig, WhatsAppNotificationLog, Candidate } from '../../types';
import { sendWhatsAppNotificationApi, DEFAULT_WA_CONFIG } from '../../utils/whatsappNotification';
import {
  MessageSquare,
  Send,
  X,
  CheckCircle2,
  AlertCircle,
  Key,
  Smartphone,
  Check,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Layers,
  FileCheck,
  CreditCard,
  UserCheck,
  Radio,
  Sliders,
  History,
  Info
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  config: WhatsAppGatewayConfig;
  onSaveConfig: (newConfig: WhatsAppGatewayConfig) => void;
  candidates?: Candidate[];
}

export const WhatsAppGatewayModal: React.FC<Props> = ({
  isOpen,
  onClose,
  config: initialConfig,
  onSaveConfig,
  candidates = [],
}) => {
  const [activeTab, setActiveTab] = useState<'config' | 'test' | 'logs'>('config');
  const [formData, setFormData] = useState<WhatsAppGatewayConfig>(initialConfig || DEFAULT_WA_CONFIG);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Test send states
  const [testPhone, setTestPhone] = useState('082334554396');
  const [testMessage, setTestMessage] = useState(
    'Uji Coba Integrasi WhatsApp Gateway - Prospect Education Jember. Layanan notifikasi otomatis aktif dan siap digunakan!'
  );
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    status: string;
    message: string;
    whatsappUrl?: string;
  } | null>(null);

  // Simulated & Firestore Logs
  const [logs, setLogs] = useState<WhatsAppNotificationLog[]>([
    {
      id: 'LOG-001',
      candidateName: 'Ahmad Rizky Pratama',
      phone: '6281234567890',
      eventType: 'loa_approved',
      message: 'Surat LoA Resmi (LOA/PE-JBR/2026/001) telah disetujui.',
      status: 'sent',
      sentAt: new Date(Date.now() - 3600000).toISOString(),
      provider: 'fonnte',
    },
    {
      id: 'LOG-002',
      candidateName: 'Siti Nurhaliza',
      phone: '6285298765432',
      eventType: 'document_status',
      message: 'Status Berkas "Ijazah SMA" diubah menjadi TERVERIFIKASI.',
      status: 'sent',
      sentAt: new Date(Date.now() - 7200000).toISOString(),
      provider: 'fonnte',
    },
  ]);

  useEffect(() => {
    if (isOpen) {
      setFormData(initialConfig || DEFAULT_WA_CONFIG);
      setSavedSuccess(false);
      setTestResult(null);
    }
  }, [isOpen, initialConfig]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveConfig(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleSendTest = async () => {
    setIsSendingTest(true);
    setTestResult(null);

    try {
      const res = await sendWhatsAppNotificationApi({
        targetPhone: testPhone,
        message: testMessage,
        eventType: 'manual',
        candidateName: 'Uji Coba Admin',
        config: formData,
      });

      setTestResult({
        success: res.success,
        status: res.status,
        message: res.message || 'Pesan terkirim',
        whatsappUrl: res.whatsappUrl,
      });

      // Add to log list
      const newLog: WhatsAppNotificationLog = {
        id: `LOG-${Date.now()}`,
        candidateName: 'Uji Coba Admin',
        phone: res.normalizedPhone || testPhone,
        eventType: 'manual',
        message: testMessage,
        status: res.status as 'sent' | 'simulated' | 'failed',
        sentAt: new Date().toISOString(),
        provider: formData.provider,
      };
      setLogs((prev) => [newLog, ...prev]);
    } catch (err: any) {
      setTestResult({
        success: false,
        status: 'failed',
        message: err.message || 'Gagal mengirim pesan uji coba.',
      });
    } finally {
      setIsSendingTest(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200 text-slate-800">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#0F3D7A] via-[#092852] to-emerald-950 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
              <MessageSquare className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="font-black text-base text-emerald-300 font-serif flex items-center gap-2">
                <span>Integrasi WhatsApp API Gateway</span>
                <span className="bg-emerald-500 text-slate-950 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase">
                  AUTO-NOTIFY
                </span>
              </h3>
              <p className="text-xs text-sky-200">Pengiriman pesan otomatis status dokumen & persetujuan LoA peserta</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-4 pt-3 gap-2">
          <button
            onClick={() => setActiveTab('config')}
            className={`px-4 py-2.5 rounded-t-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'config'
                ? 'bg-white text-[#0F3D7A] border-t-2 border-x border-slate-200 border-t-[#0F3D7A] shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Konfigurasi Provider API</span>
          </button>

          <button
            onClick={() => setActiveTab('test')}
            className={`px-4 py-2.5 rounded-t-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'test'
                ? 'bg-white text-[#0F3D7A] border-t-2 border-x border-slate-200 border-t-[#0F3D7A] shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Send className="w-4 h-4" />
            <span>Uji Coba Kirim WA</span>
          </button>

          <button
            onClick={() => setActiveTab('logs')}
            className={`px-4 py-2.5 rounded-t-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'logs'
                ? 'bg-white text-[#0F3D7A] border-t-2 border-x border-slate-200 border-t-[#0F3D7A] shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Riwayat Pengiriman ({logs.length})</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[65vh] overflow-y-auto">
          {activeTab === 'config' && (
            <div className="space-y-6">
              {/* Service Toggle */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-white ${
                    formData.enabled ? 'bg-emerald-600' : 'bg-slate-400'
                  }`}>
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-900">Status Layanan WA Gateway</h4>
                    <p className="text-[11px] text-slate-500">
                      {formData.enabled ? 'Aktif - Pesan WA terkirim otomatis saat event dipicu' : 'Non-aktif - Mode manual/simulasi saja'}
                    </p>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.enabled}
                    onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>

              {/* Provider Selector */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700">Pilih Layanan Pihak Ketiga (WhatsApp API Gateway):</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, provider: 'fonnte' })}
                    className={`p-3 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between ${
                      formData.provider === 'fonnte'
                        ? 'border-emerald-500 bg-emerald-50/50 ring-2 ring-emerald-400/30'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-black text-xs text-emerald-900 font-mono">FONNTE API</span>
                      {formData.provider === 'fonnte' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1">Rekomendasi Indonesia. Kuota token gratis & cepat.</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, provider: 'wablas' })}
                    className={`p-3 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between ${
                      formData.provider === 'wablas'
                        ? 'border-emerald-500 bg-emerald-50/50 ring-2 ring-emerald-400/30'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-black text-xs text-emerald-900 font-mono">WABLAS GATEWAY</span>
                      {formData.provider === 'wablas' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1">Platform WA Blast & Notifikasi Bisnis Indonesia.</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, provider: 'generic_webhook' })}
                    className={`p-3 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between ${
                      formData.provider === 'generic_webhook'
                        ? 'border-emerald-500 bg-emerald-50/50 ring-2 ring-emerald-400/30'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-black text-xs text-emerald-900 font-mono">CUSTOM WEBHOOK</span>
                      {formData.provider === 'generic_webhook' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1">Direct REST/n8n/Zapier/Evolution API Webhook.</p>
                  </button>
                </div>
              </div>

              {/* API Credentials Input */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-4">
                <h4 className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                  <Key className="w-4 h-4 text-[#0F3D7A]" />
                  <span>Kredensial & Kunci API Gateway ({formData.provider.toUpperCase()})</span>
                </h4>

                {formData.provider !== 'generic_webhook' ? (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        API Token / Token Otentikasi Gateway:
                      </label>
                      <input
                        type="password"
                        value={formData.apiKey}
                        onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                        placeholder={
                          formData.provider === 'fonnte'
                            ? 'Masukkan Fonnte Token (Contoh: 8xK9pL2m...)'
                            : 'Masukkan Authorization Key Wablas...'
                        }
                        className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0F3D7A]"
                      />
                      <p className="text-[10px] text-slate-500 mt-1">
                        Dapatkan Token gratis dari dashboard provider ({formData.provider}.com). Jika dikosongkan, sistem berjalan dalam mode simulasi WhatsApp Web.
                      </p>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Nomor Pengirim CS Lembaga (Sender Phone):
                      </label>
                      <input
                        type="text"
                        value={formData.senderPhone}
                        onChange={(e) => setFormData({ ...formData, senderPhone: e.target.value })}
                        placeholder="082334554396"
                        className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0F3D7A]"
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      URL Custom Webhook Endpoint:
                    </label>
                    <input
                      type="text"
                      value={formData.customWebhookUrl || ''}
                      onChange={(e) => setFormData({ ...formData, customWebhookUrl: e.target.value })}
                      placeholder="https://n8n.mycompany.com/webhook/whatsapp-send"
                      className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0F3D7A]"
                    />
                  </div>
                )}
              </div>

              {/* Event Triggers Checklist */}
              <div className="space-y-3">
                <h4 className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                  <Radio className="w-4 h-4 text-emerald-600" />
                  <span>Pemicu Notifikasi WA Otomatis (Event Rules):</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <label className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-3 cursor-pointer hover:bg-slate-100 transition">
                    <input
                      type="checkbox"
                      checked={formData.notifyOnDocumentStatusChange}
                      onChange={(e) =>
                        setFormData({ ...formData, notifyOnDocumentStatusChange: e.target.checked })
                      }
                      className="mt-0.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <div>
                      <span className="font-bold text-slate-900">Perubahan Status Dokumen</span>
                      <p className="text-[10px] text-slate-500">Kirim WA saat berkas diverifikasi, perlu revisi, atau ditolak.</p>
                    </div>
                  </label>

                  <label className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-3 cursor-pointer hover:bg-slate-100 transition">
                    <input
                      type="checkbox"
                      checked={formData.notifyOnLoaApproval}
                      onChange={(e) =>
                        setFormData({ ...formData, notifyOnLoaApproval: e.target.checked })
                      }
                      className="mt-0.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <div>
                      <span className="font-bold text-slate-900">Persetujuan LoA Diterbitkan</span>
                      <p className="text-[10px] text-slate-500">Kirim WA dengan nomor LoA & tautan QR verifikasi saat disetujui Admin.</p>
                    </div>
                  </label>

                  <label className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-3 cursor-pointer hover:bg-slate-100 transition">
                    <input
                      type="checkbox"
                      checked={formData.notifyOnPaymentVerified}
                      onChange={(e) =>
                        setFormData({ ...formData, notifyOnPaymentVerified: e.target.checked })
                      }
                      className="mt-0.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <div>
                      <span className="font-bold text-slate-900">Pembayaran / DP Terverifikasi</span>
                      <p className="text-[10px] text-slate-500">Kirim WA pemberitahuan kuitansi pembayaran lunas dari Midtrans/Manual.</p>
                    </div>
                  </label>

                  <label className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-3 cursor-pointer hover:bg-slate-100 transition">
                    <input
                      type="checkbox"
                      checked={formData.notifyOnRegistration}
                      onChange={(e) =>
                        setFormData({ ...formData, notifyOnRegistration: e.target.checked })
                      }
                      className="mt-0.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <div>
                      <span className="font-bold text-slate-900">Registrasi Akun Baru</span>
                      <p className="text-[10px] text-slate-500">Kirim WA ucapan selamat datang beserta nomor registrasi ke calon peserta.</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'test' && (
            <div className="space-y-5">
              <div className="bg-sky-50 border border-sky-200 rounded-2xl p-4 flex items-start gap-3 text-sky-950">
                <Info className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
                <p className="text-xs text-sky-800">
                  Gunakan panel ini untuk menguji koneksi API Gateway WhatsApp ke nomor telepon Anda atau pengurus lembaga.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nomor WhatsApp Penerima Uji Coba:
                  </label>
                  <input
                    type="text"
                    value={testPhone}
                    onChange={(e) => setTestPhone(e.target.value)}
                    placeholder="Contoh: 082334554396"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0F3D7A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Isi Pesan Uji Coba:
                  </label>
                  <textarea
                    rows={4}
                    value={testMessage}
                    onChange={(e) => setTestMessage(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0F3D7A]"
                  />
                </div>

                <button
                  onClick={handleSendTest}
                  disabled={isSendingTest}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl text-xs transition cursor-pointer flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
                >
                  {isSendingTest ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Mengirim Pesan via API Gateway...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Kirim Uji Coba Pesan WA</span>
                    </>
                  )}
                </button>

                {testResult && (
                  <div
                    className={`p-4 rounded-2xl border text-xs space-y-2 ${
                      testResult.success
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                        : 'bg-red-50 border-red-300 text-red-950'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold">
                      <span className="flex items-center gap-1.5">
                        {testResult.success ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-red-600" />
                        )}
                        Status: {testResult.status.toUpperCase()}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        Provider: {formData.provider.toUpperCase()}
                      </span>
                    </div>

                    <p className="text-xs leading-relaxed">{testResult.message}</p>

                    {testResult.whatsappUrl && (
                      <a
                        href={testResult.whatsappUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 font-bold text-emerald-800 hover:text-emerald-950 text-xs underline mt-1"
                      >
                        <span>Buka Tautan Langsung di WA Web</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'logs' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-xs text-slate-800">
                  Log Riwayat Pesan WhatsApp Otomatis
                </h4>
                <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-2 py-1 rounded-md border border-slate-200">
                  Total {logs.length} Pesan
                </span>
              </div>

              {logs.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs">
                  Belum ada log pengiriman WhatsApp.
                </div>
              ) : (
                <div className="space-y-3">
                  {logs.map((log) => (
                    <div
                      key={log.id}
                      className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">{log.candidateName}</span>
                          <span className="font-mono text-[10px] text-slate-500">({log.phone})</span>
                        </div>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                            log.status === 'sent'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : 'bg-amber-100 text-amber-800 border border-amber-200'
                          }`}
                        >
                          {log.status}
                        </span>
                      </div>

                      <p className="text-slate-600 font-mono text-[11px] line-clamp-2 bg-white p-2 rounded-xl border border-slate-200">
                        {log.message}
                      </p>

                      <div className="flex items-center justify-between text-[10px] text-slate-400">
                        <span>Pemicu: {log.eventType.toUpperCase()}</span>
                        <span>{new Date(log.sentAt).toLocaleString('id-ID')}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 flex items-center justify-between">
          {savedSuccess && (
            <div className="flex items-center gap-1.5 text-emerald-700 font-bold text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Pengaturan WhatsApp API berhasil disimpan!</span>
            </div>
          )}
          {!savedSuccess && <div />}

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-200 transition cursor-pointer"
            >
              Tutup
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 rounded-xl bg-[#0F3D7A] hover:bg-[#092852] text-white font-bold text-xs transition cursor-pointer flex items-center gap-1.5 shadow-xs"
            >
              <Check className="w-4 h-4 text-amber-300" />
              <span>Simpan Pengaturan</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
