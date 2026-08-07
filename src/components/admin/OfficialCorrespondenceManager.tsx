import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Candidate, LetterheadConfig, LetterTemplate, IssuedLetter } from '../../types';
import {
  Printer,
  FileText,
  Building,
  Edit3,
  Plus,
  Trash2,
  Copy,
  Check,
  Image,
  Stamp,
  Send,
  Download,
  Eye,
  Settings,
  Search,
  Save,
  RefreshCw,
  FileCheck,
  AlertCircle,
  X,
  FileCode,
  Sparkles,
  Info,
  ChevronRight,
  UserCheck
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  selectedCandidateForIssue?: Candidate | null;
}

export const OfficialCorrespondenceManager: React.FC<Props> = ({
  isOpen,
  onClose,
  selectedCandidateForIssue,
}) => {
  const {
    candidates,
    letterheadConfig,
    updateLetterheadConfig,
    letterTemplates,
    addLetterTemplate,
    updateLetterTemplate,
    deleteLetterTemplate,
    issuedLetters,
    issueNewLetter,
    deleteIssuedLetter,
    whatsappConfig,
    emailConfig,
    currentRole,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'kop' | 'templates' | 'issue' | 'archive'>('kop');

  // Kop Config local state
  const [kopForm, setKopForm] = useState<LetterheadConfig>(letterheadConfig);
  const [kopSavedNotice, setKopSavedNotice] = useState(false);

  // Template local state
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(letterTemplates[0]?.id || '');
  const [editingTemplate, setEditingTemplate] = useState<LetterTemplate | null>(null);
  const [isCreatingTemplate, setIsCreatingTemplate] = useState(false);
  const [copiedTag, setCopiedTag] = useState<string | null>(null);

  // Issue Letter local state
  const [selectedCandidateId, setSelectedCandidateId] = useState<string>(
    selectedCandidateForIssue?.id || candidates[0]?.id || ''
  );
  const [issueTemplateId, setIssueTemplateId] = useState<string>(letterTemplates[0]?.id || '');
  const [customLetterNumber, setCustomLetterNumber] = useState<string>('');
  const [issueDate, setIssueDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [issueNotes, setIssueNotes] = useState<string>('');
  const [issueSuccessMsg, setIssueSuccessMsg] = useState<string | null>(null);

  // Archive Filter
  const [archiveSearch, setArchiveSearch] = useState<string>('');
  const [selectedArchiveLetter, setSelectedArchiveLetter] = useState<IssuedLetter | null>(null);

  if (!isOpen) return null;

  const handleSaveKop = () => {
    updateLetterheadConfig(kopForm);
    setKopSavedNotice(true);
    setTimeout(() => setKopSavedNotice(false), 3000);
  };

  const currentTemplate = letterTemplates.find((t) => t.id === selectedTemplateId) || letterTemplates[0];
  const activeCandidate = candidates.find((c) => c.id === selectedCandidateId) || candidates[0];

  // Helper to generate dynamic letter text
  const replacePlaceholders = (text: string, candidate?: Candidate, customNum?: string) => {
    if (!candidate) return text;

    const progName = candidate.selectedProgram === 'taiwan_ifp' || candidate.selectedProgram === 'taiwan_4_1'
      ? 'Program Kuliah + Magang Taiwan (IFP 1+4)'
      : candidate.selectedProgram === 'japan_im' || candidate.selectedProgram === 'japan_ssw'
      ? 'Program Pelatihan Kerja Jepang (Tokutei Ginou SSW)'
      : 'Program Diklat Prospect Education Jember';

    const formatLetterNo = customNum || `10${issuedLetters.length + 1}/PROSPECT-JBR/${currentTemplate?.code || 'SURAT'}/${new Date().getMonth() + 1}/${new Date().getFullYear()}`;

    return text
      .replaceAll('{NAMA_SISWA}', candidate.fullName || '-')
      .replaceAll('{NOMOR_REGISTRASI}', candidate.registrationNumber || '-')
      .replaceAll('{NIK}', candidate.nik || '-')
      .replaceAll('{PROGRAM}', progName)
      .replaceAll('{TEMPAT_LAHIR}', candidate.birthPlace || 'Jember')
      .replaceAll('{TANGGAL_LAHIR}', candidate.birthDate || '-')
      .replaceAll('{ALAMAT_SISWA}', candidate.address || '-')
      .replaceAll('{NAMA_ORANGTUA}', candidate.parentName || '-')
      .replaceAll('{TELEPON_SISWA}', candidate.phone || '-')
      .replaceAll('{EMAIL_SISWA}', candidate.email || '-')
      .replaceAll('{TANGGAL_SURAT}', new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }))
      .replaceAll('{NOMOR_SURAT}', formatLetterNo)
      .replaceAll('{KOTA_PENERBITAN}', kopForm.cityIssued || 'Jember')
      .replaceAll('{TAHUN_AKADEMIK}', `${new Date().getFullYear()}/${new Date().getFullYear() + 1}`);
  };

  const handleCopyTag = (tag: string) => {
    navigator.clipboard.writeText(tag);
    setCopiedTag(tag);
    setTimeout(() => setCopiedTag(null), 2000);
  };

  const handleCreateTemplate = () => {
    const newTpl: LetterTemplate = {
      id: `tpl-${Date.now()}`,
      title: 'Surat Keterangan Baru',
      code: 'SK-BARU',
      category: 'Surat Keterangan',
      subject: 'Perihal Surat Keterangan Baru',
      numberFormat: '{SEQ}/PROSPECT-JBR/SK-BARU/{MM}/{YYYY}',
      bodyContent: '<p>Tulis isi paragraf surat resmi di sini dengan variabel placeholder.</p>',
      signerName: kopForm.defaultSignerName,
      signerTitle: kopForm.defaultSignerTitle,
      signerNip: kopForm.defaultSignerNip,
      updatedAt: new Date().toISOString().split('T')[0],
    };
    addLetterTemplate(newTpl);
    setSelectedTemplateId(newTpl.id);
    setEditingTemplate(newTpl);
    setIsCreatingTemplate(false);
  };

  const handleSaveEditingTemplate = () => {
    if (editingTemplate) {
      updateLetterTemplate(editingTemplate);
      setEditingTemplate(null);
    }
  };

  const handleIssueLetter = () => {
    if (!activeCandidate || !currentTemplate) return;

    const letterNo = customLetterNumber || `10${issuedLetters.length + 1}/PROSPECT-JBR/${currentTemplate.code}/${new Date().getMonth() + 1}/${new Date().getFullYear()}`;
    const populatedHtml = replacePlaceholders(currentTemplate.bodyContent, activeCandidate, letterNo);

    const newIssued: IssuedLetter = {
      id: `iss-${Date.now()}`,
      letterNumber: letterNo,
      templateId: currentTemplate.id,
      templateTitle: currentTemplate.title,
      candidateId: activeCandidate.id,
      candidateName: activeCandidate.fullName,
      candidateRegNumber: activeCandidate.registrationNumber,
      subject: currentTemplate.subject,
      issueDate: issueDate,
      contentHtml: populatedHtml,
      signerName: currentTemplate.signerName || kopForm.defaultSignerName,
      signerTitle: currentTemplate.signerTitle || kopForm.defaultSignerTitle,
      issuedBy: currentRole === 'superadmin' ? 'Super Admin / Direksi' : 'Staf Administrasi Prospect',
      status: 'published',
      downloadCount: 0,
    };

    issueNewLetter(newIssued);
    setIssueSuccessMsg(`Surat Resmi No. ${letterNo} berhasil diterbitkan dan disimpan ke Arsip!`);
    setTimeout(() => setIssueSuccessMsg(null), 4000);
  };

  const availableTags = [
    { tag: '{NAMA_SISWA}', label: 'Nama Lengkap Siswa' },
    { tag: '{NOMOR_REGISTRASI}', label: 'Nomor Registrasi / ID' },
    { tag: '{NIK}', label: 'NIK / Nomor KTP' },
    { tag: '{PROGRAM}', label: 'Nama Program Studi / Vokasi' },
    { tag: '{TEMPAT_LAHIR}', label: 'Tempat Lahir' },
    { tag: '{TANGGAL_LAHIR}', label: 'Tanggal Lahir' },
    { tag: '{ALAMAT_SISWA}', label: 'Alamat Domisili Siswa' },
    { tag: '{NAMA_ORANGTUA}', label: 'Nama Orang Tua / Wali' },
    { tag: '{TELEPON_SISWA}', label: 'Nomor HP / WhatsApp' },
    { tag: '{NOMOR_SURAT}', label: 'Nomor Surat Terbit' },
    { tag: '{TANGGAL_SURAT}', label: 'Tanggal Surat (Format Indo)' },
    { tag: '{KOTA_PENERBITAN}', label: 'Kota Penerbitan (Jember)' },
  ];

  const filteredArchives = issuedLetters.filter(
    (item) =>
      item.candidateName.toLowerCase().includes(archiveSearch.toLowerCase()) ||
      item.letterNumber.toLowerCase().includes(archiveSearch.toLowerCase()) ||
      item.templateTitle.toLowerCase().includes(archiveSearch.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex justify-center items-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-6xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden printable-content">
        {/* Top Header Bar */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between gap-4 shrink-0 print:hidden">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-600/20 text-indigo-400 rounded-2xl border border-indigo-500/30">
              <Building className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-wide">
                  Surat Menyurat & Kop Surat Resmi
                </h2>
                <span className="bg-indigo-950 text-indigo-300 border border-indigo-500/40 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                  E-Office
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Kelola kop lembaga, logo, stempel, template dokumen resmi, dan cetak surat siswa
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800 rounded-full transition cursor-pointer"
            title="Tutup Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="bg-slate-900/90 border-b border-slate-800 px-6 pt-3 flex flex-wrap gap-2 shrink-0 print:hidden">
          <button
            onClick={() => setActiveTab('kop')}
            className={`px-4 py-2.5 font-bold text-xs rounded-t-xl transition flex items-center gap-2 cursor-pointer border-b-2 ${
              activeTab === 'kop'
                ? 'bg-slate-800 text-indigo-400 border-indigo-500 shadow-xs'
                : 'text-slate-400 hover:text-slate-200 border-transparent'
            }`}
          >
            <Building className="w-4 h-4" />
            <span>1. Pengaturan Kop Surat & Logo</span>
          </button>

          <button
            onClick={() => setActiveTab('templates')}
            className={`px-4 py-2.5 font-bold text-xs rounded-t-xl transition flex items-center gap-2 cursor-pointer border-b-2 ${
              activeTab === 'templates'
                ? 'bg-slate-800 text-indigo-400 border-indigo-500 shadow-xs'
                : 'text-slate-400 hover:text-slate-200 border-transparent'
            }`}
          >
            <FileCode className="w-4 h-4" />
            <span>2. Editor Template Surat ({letterTemplates.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('issue')}
            className={`px-4 py-2.5 font-bold text-xs rounded-t-xl transition flex items-center gap-2 cursor-pointer border-b-2 ${
              activeTab === 'issue'
                ? 'bg-slate-800 text-indigo-400 border-indigo-500 shadow-xs'
                : 'text-slate-400 hover:text-slate-200 border-transparent'
            }`}
          >
            <Send className="w-4 h-4" />
            <span>3. Terbitkan & Pratinjau Surat</span>
          </button>

          <button
            onClick={() => setActiveTab('archive')}
            className={`px-4 py-2.5 font-bold text-xs rounded-t-xl transition flex items-center gap-2 cursor-pointer border-b-2 ${
              activeTab === 'archive'
                ? 'bg-slate-800 text-indigo-400 border-indigo-500 shadow-xs'
                : 'text-slate-400 hover:text-slate-200 border-transparent'
            }`}
          >
            <FileCheck className="w-4 h-4" />
            <span>4. Arsip Surat Keluar ({issuedLetters.length})</span>
          </button>
        </div>

        {/* Tab Body Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-200">
          {/* TAB 1: KOP SURAT CONFIG & PREVIEW */}
          {activeTab === 'kop' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Kop Form Settings */}
              <div className="lg:col-span-5 space-y-4 bg-slate-950 p-5 rounded-2xl border border-slate-800">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <h3 className="font-bold text-sm text-white flex items-center gap-2">
                    <Settings className="w-4 h-4 text-indigo-400" />
                    <span>Identitas Kop Surat Resmi</span>
                  </h3>
                  <button
                    onClick={handleSaveKop}
                    className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Simpan Kop</span>
                  </button>
                </div>

                {kopSavedNotice && (
                  <div className="p-3 bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs rounded-xl flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Identitas Kop Surat berhasil diperbarui!</span>
                  </div>
                )}

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-slate-400 mb-1 font-medium">Nama Lembaga Utama</label>
                    <input
                      type="text"
                      value={kopForm.institutionName}
                      onChange={(e) => setKopForm({ ...kopForm, institutionName: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1 font-medium">Sub-Nama / Bidang Lembaga</label>
                    <input
                      type="text"
                      value={kopForm.institutionSubName}
                      onChange={(e) => setKopForm({ ...kopForm, institutionSubName: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1 font-medium">Legalitas & Nomor Izin Resm</label>
                    <textarea
                      rows={2}
                      value={kopForm.legalLicense}
                      onChange={(e) => setKopForm({ ...kopForm, legalLicense: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1 font-medium">Alamat Kantor Lengkap</label>
                    <input
                      type="text"
                      value={kopForm.address}
                      onChange={(e) => setKopForm({ ...kopForm, address: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-slate-400 mb-1 font-medium">No. Telepon</label>
                      <input
                        type="text"
                        value={kopForm.phone}
                        onChange={(e) => setKopForm({ ...kopForm, phone: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1 font-medium">WhatsApp Office</label>
                      <input
                        type="text"
                        value={kopForm.whatsapp}
                        onChange={(e) => setKopForm({ ...kopForm, whatsapp: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-slate-400 mb-1 font-medium">Email Resmi</label>
                      <input
                        type="email"
                        value={kopForm.email}
                        onChange={(e) => setKopForm({ ...kopForm, email: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1 font-medium">Website</label>
                      <input
                        type="text"
                        value={kopForm.website}
                        onChange={(e) => setKopForm({ ...kopForm, website: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1 font-medium">URL Logo Lembaga (Image URL / Base64)</label>
                    <input
                      type="text"
                      value={kopForm.logoUrl}
                      onChange={(e) => setKopForm({ ...kopForm, logoUrl: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500 text-xs"
                      placeholder="https://domain.com/logo.png"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-slate-400 mb-1 font-medium">Kota Penerbitan</label>
                      <input
                        type="text"
                        value={kopForm.cityIssued}
                        onChange={(e) => setKopForm({ ...kopForm, cityIssued: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1 font-medium">Model Garis Kop</label>
                      <select
                        value={kopForm.headerLineStyle}
                        onChange={(e) => setKopForm({ ...kopForm, headerLineStyle: e.target.value as any })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
                      >
                        <option value="double">Garis Ganda (Double Rule Standard)</option>
                        <option value="single">Garis Tunggal (Single Line)</option>
                        <option value="accent_bar">Accent Bar Biru Modern</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800">
                    <label className="block text-indigo-300 mb-1 font-bold">Penandatangan Resmi Default</label>
                    <div className="space-y-2">
                      <input
                        type="text"
                        placeholder="Nama Pejabat (misal: Rohim Egy P., S.Pd., M.M.)"
                        value={kopForm.defaultSignerName}
                        onChange={(e) => setKopForm({ ...kopForm, defaultSignerName: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-white focus:outline-none focus:border-indigo-500"
                      />
                      <input
                        type="text"
                        placeholder="Jabatan (misal: Kepala Cabang Prospect Education)"
                        value={kopForm.defaultSignerTitle}
                        onChange={(e) => setKopForm({ ...kopForm, defaultSignerTitle: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-slate-200 focus:outline-none focus:border-indigo-500"
                      />
                      <input
                        type="text"
                        placeholder="NIP / NIK Pejabat"
                        value={kopForm.defaultSignerNip}
                        onChange={(e) => setKopForm({ ...kopForm, defaultSignerNip: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-slate-300 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Live Preview Kop Surat on Paper A4 */}
              <div className="lg:col-span-7 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Eye className="w-4 h-4 text-indigo-400" />
                    <span>Pratinjau Hasil Kop Surat (A4 Standard)</span>
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Hasil presisi sesuai cetakan kertas A4
                  </span>
                </div>

                <div className="bg-white text-slate-900 p-8 sm:p-10 rounded-2xl shadow-xl border border-slate-200 min-h-[500px] flex flex-col justify-between font-serif">
                  {/* Kop Surat Live Render */}
                  <div>
                    <div className="flex items-center gap-5 border-b pb-4 mb-4" style={{ borderColor: '#0f172a' }}>
                      <img
                        src={kopForm.logoUrl}
                        alt="Logo Lembaga"
                        className="w-20 h-20 object-contain shrink-0"
                        onError={(e) => {
                          // Fallback logo if broken URL
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=200';
                        }}
                      />
                      <div className="flex-1 text-center font-sans">
                        <h1 className="font-extrabold text-lg sm:text-xl tracking-wide uppercase text-blue-900">
                          {kopForm.institutionName}
                        </h1>
                        <p className="font-bold text-xs sm:text-sm text-slate-800 tracking-wider uppercase mt-0.5">
                          {kopForm.institutionSubName}
                        </p>
                        <p className="text-[10.5px] text-slate-600 mt-1 font-medium">
                          {kopForm.legalLicense}
                        </p>
                        <p className="text-[10px] text-slate-500 mt-0.5">
                          {kopForm.address} | Telp: {kopForm.phone} | WA: {kopForm.whatsapp}
                        </p>
                        <p className="text-[10px] text-indigo-900 font-semibold mt-0.5">
                          Website: {kopForm.website} | Email: {kopForm.email}
                        </p>
                      </div>
                    </div>

                    {/* Header Line Divider Style */}
                    {kopForm.headerLineStyle === 'double' && (
                      <div className="border-b-4 border-double border-slate-900 -mt-3 mb-6" />
                    )}
                    {kopForm.headerLineStyle === 'single' && (
                      <div className="border-b-2 border-slate-900 -mt-3 mb-6" />
                    )}
                    {kopForm.headerLineStyle === 'accent_bar' && (
                      <div className="h-1.5 bg-gradient-to-r from-blue-900 via-indigo-700 to-amber-500 rounded-full -mt-3 mb-6" />
                    )}

                    {/* Sample Letter Body Text */}
                    <div className="font-sans text-xs text-slate-800 leading-relaxed space-y-3 pt-2">
                      <div className="text-center space-y-1 mb-5">
                        <h2 className="font-bold text-sm tracking-widest uppercase text-slate-900 underline underline-offset-4">
                          SURAT KETERANGAN RESMI
                        </h2>
                        <p className="text-[11px] text-slate-600">
                          Nomor: 101/PROSPECT-JBR/SK/08/2026
                        </p>
                      </div>

                      <p>
                        Yang bertanda tangan di bawah ini Kepala <strong>{kopForm.institutionName}</strong> menerangkan dengan sebenarnya bahwa kop surat ini telah dikonfigurasi secara resmi dan sah untuk penandatanganan dokumen administrasi pendaftaran, penerbitan LoA, serta sertifikat diklat.
                      </p>

                      <table className="w-full text-xs border border-slate-300 border-collapse my-3">
                        <tbody>
                          <tr className="bg-slate-50">
                            <td className="p-2 font-bold border border-slate-300 w-1/3">Kota Penerbitan</td>
                            <td className="p-2 border border-slate-300">{kopForm.cityIssued}</td>
                          </tr>
                          <tr>
                            <td className="p-2 font-bold border border-slate-300">Pejabat Pengesah</td>
                            <td className="p-2 border border-slate-300">{kopForm.defaultSignerName}</td>
                          </tr>
                          <tr className="bg-slate-50">
                            <td className="p-2 font-bold border border-slate-300">Jabatan Resm</td>
                            <td className="p-2 border border-slate-300">{kopForm.defaultSignerTitle}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Sample Signatures Area */}
                  <div className="font-sans pt-6 border-t border-dashed border-slate-300 flex justify-end">
                    <div className="text-center w-64 space-y-1">
                      <p className="text-xs text-slate-700">
                        {kopForm.cityIssued}, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                      <p className="text-xs font-bold text-slate-900">{kopForm.defaultSignerTitle}</p>
                      
                      {/* Stamp & Signature simulation */}
                      <div className="h-16 my-1 flex items-center justify-center relative">
                        <span className="text-[10px] text-slate-400 italic font-mono border border-dashed border-slate-300 px-3 py-1 rounded">
                          [Tanda Tangan & Stempel Resmi]
                        </span>
                      </div>

                      <p className="font-bold text-xs text-slate-900 underline">{kopForm.defaultSignerName}</p>
                      <p className="text-[10px] text-slate-600">{kopForm.defaultSignerNip}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: TEMPLATE EDITOR */}
          {activeTab === 'templates' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Template Selector Sidebar */}
              <div className="lg:col-span-4 space-y-3 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <h3 className="font-bold text-xs text-white uppercase tracking-wider flex items-center gap-1.5">
                    <FileCode className="w-4 h-4 text-indigo-400" />
                    <span>Daftar Template Surat</span>
                  </h3>
                  <button
                    onClick={handleCreateTemplate}
                    className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Baru</span>
                  </button>
                </div>

                <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                  {letterTemplates.map((tpl) => (
                    <div
                      key={tpl.id}
                      onClick={() => {
                        setSelectedTemplateId(tpl.id);
                        setEditingTemplate(tpl);
                      }}
                      className={`p-3 rounded-xl border text-xs cursor-pointer transition flex items-start justify-between gap-2 ${
                        selectedTemplateId === tpl.id
                          ? 'bg-indigo-950/80 border-indigo-500 text-white shadow-xs'
                          : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="px-1.5 py-0.5 bg-slate-800 text-indigo-300 text-[10px] font-mono font-bold rounded">
                            {tpl.code}
                          </span>
                          <span className="font-bold text-xs text-slate-100 line-clamp-1">{tpl.title}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 line-clamp-1">{tpl.subject}</p>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(`Hapus template "${tpl.title}"?`)) {
                            deleteLetterTemplate(tpl.id);
                          }
                        }}
                        className="p-1 text-slate-500 hover:text-red-400 hover:bg-slate-800 rounded transition cursor-pointer"
                        title="Hapus Template"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Tag Placeholders Quick Copy Palette */}
                <div className="pt-3 border-t border-slate-800 space-y-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Klik untuk Copy Tag Variabel:
                  </span>
                  <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto text-[10px]">
                    {availableTags.map((item) => (
                      <button
                        key={item.tag}
                        onClick={() => handleCopyTag(item.tag)}
                        className="px-2 py-1 bg-slate-900 hover:bg-indigo-900/50 border border-slate-700 hover:border-indigo-500/50 text-indigo-300 rounded-lg transition flex items-center gap-1 cursor-pointer"
                        title={item.label}
                      >
                        <code>{item.tag}</code>
                        {copiedTag === item.tag ? (
                          <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                        ) : (
                          <Copy className="w-2.5 h-2.5 opacity-60 shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Template Editor Form & Preview */}
              <div className="lg:col-span-8 space-y-4">
                {editingTemplate ? (
                  <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4 text-xs">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                      <div className="flex items-center gap-2">
                        <Edit3 className="w-4 h-4 text-indigo-400" />
                        <h3 className="font-bold text-sm text-white">Edit Template: {editingTemplate.title}</h3>
                      </div>
                      <button
                        onClick={handleSaveEditingTemplate}
                        className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                      >
                        <Save className="w-4 h-4" />
                        <span>Simpan Template</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-slate-400 mb-1 font-medium">Judul Template</label>
                        <input
                          type="text"
                          value={editingTemplate.title}
                          onChange={(e) => setEditingTemplate({ ...editingTemplate, title: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-400 mb-1 font-medium">Kode Surat Singkat</label>
                        <input
                          type="text"
                          value={editingTemplate.code}
                          onChange={(e) => setEditingTemplate({ ...editingTemplate, code: e.target.value.toUpperCase() })}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-indigo-300 font-mono font-bold focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-400 mb-1 font-medium">Kategori Surat</label>
                        <select
                          value={editingTemplate.category}
                          onChange={(e) => setEditingTemplate({ ...editingTemplate, category: e.target.value as any })}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
                        >
                          <option value="LoA">Letter of Acceptance (LoA)</option>
                          <option value="Surat Keterangan">Surat Keterangan</option>
                          <option value="Rekomendasi">Surat Rekomendasi</option>
                          <option value="Permohonan Visa">Permohonan Visa</option>
                          <option value="Perjanjian">Surat Perjanjian</option>
                          <option value="Pernyataan">Surat Pernyataan</option>
                          <option value="Lainnya">Lainnya</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-400 mb-1 font-medium">Perihal / Subject Surat</label>
                        <input
                          type="text"
                          value={editingTemplate.subject}
                          onChange={(e) => setEditingTemplate({ ...editingTemplate, subject: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-400 mb-1 font-medium">Format Penomoran Otomatis</label>
                        <input
                          type="text"
                          value={editingTemplate.numberFormat}
                          onChange={(e) => setEditingTemplate({ ...editingTemplate, numberFormat: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-indigo-300 font-mono focus:outline-none focus:border-indigo-500"
                          placeholder="{SEQ}/PROSPECT-JBR/CODE/{MM}/{YYYY}"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-slate-300 font-bold">Isi Paragraf Surat (HTML / Text formatted)</label>
                        <span className="text-[11px] text-slate-500">
                          Gunakan tag HTML seperti &lt;p&gt;, &lt;strong&gt;, &lt;table&gt; atau variabel &#123;TAG&#125;
                        </span>
                      </div>
                      <textarea
                        rows={12}
                        value={editingTemplate.bodyContent}
                        onChange={(e) => setEditingTemplate({ ...editingTemplate, bodyContent: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-slate-200 font-mono text-xs focus:outline-none focus:border-indigo-500 leading-relaxed"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-950 p-8 rounded-2xl border border-slate-800 text-center space-y-3">
                    <Info className="w-8 h-8 text-indigo-400 mx-auto" />
                    <p className="text-sm font-bold text-white">Pilih template dari daftar di samping untuk diedit</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: ISSUE NEW LETTER & LIVE PRINT PREVIEW */}
          {activeTab === 'issue' && (
            <div className="space-y-6">
              {/* Controls Bar */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 grid grid-cols-1 md:grid-cols-12 gap-4 items-center text-xs print:hidden">
                <div className="md:col-span-4 space-y-1">
                  <label className="block text-slate-400 font-medium">Pilih Siswa / Pendaftar Target</label>
                  <select
                    value={selectedCandidateId}
                    onChange={(e) => setSelectedCandidateId(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold focus:outline-none focus:border-indigo-500 cursor-pointer"
                  >
                    {candidates.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.fullName} ({c.registrationNumber || c.selectedProgram})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-4 space-y-1">
                  <label className="block text-slate-400 font-medium">Pilih Jenis Template Surat</label>
                  <select
                    value={issueTemplateId}
                    onChange={(e) => {
                      setIssueTemplateId(e.target.value);
                      setSelectedTemplateId(e.target.value);
                    }}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-indigo-300 font-bold focus:outline-none focus:border-indigo-500 cursor-pointer"
                  >
                    {letterTemplates.map((t) => (
                      <option key={t.id} value={t.id}>
                        [{t.code}] {t.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-4 flex items-center justify-end gap-2 pt-4 md:pt-0">
                  <button
                    onClick={() => window.print()}
                    className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold rounded-xl transition flex items-center gap-2 cursor-pointer shadow-xs border border-slate-700"
                    title="Cetak Langsung ke Printer atau Simpan PDF"
                  >
                    <Printer className="w-4 h-4 text-emerald-400" />
                    <span>Cetak / PDF</span>
                  </button>

                  <button
                    onClick={handleIssueLetter}
                    className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition flex items-center gap-2 cursor-pointer shadow-md"
                  >
                    <Send className="w-4 h-4" />
                    <span>Terbitkan & Simpan</span>
                  </button>
                </div>
              </div>

              {issueSuccessMsg && (
                <div className="p-3 bg-emerald-950 border border-emerald-500/50 text-emerald-300 text-xs rounded-xl flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{issueSuccessMsg}</span>
                </div>
              )}

              {/* Full Printable A4 Canvas Document */}
              <div className="bg-white text-slate-900 p-8 sm:p-12 rounded-2xl shadow-2xl border border-slate-200 max-w-4xl mx-auto min-h-[750px] flex flex-col justify-between font-serif printable-content">
                {/* Header Kop Surat */}
                <div>
                  <div className="flex items-center gap-5 border-b pb-4 mb-4" style={{ borderColor: '#0f172a' }}>
                    <img
                      src={kopForm.logoUrl}
                      alt="Logo Lembaga"
                      className="w-20 h-20 object-contain shrink-0"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=200';
                      }}
                    />
                    <div className="flex-1 text-center font-sans">
                      <h1 className="font-extrabold text-lg sm:text-xl tracking-wide uppercase text-blue-900">
                        {kopForm.institutionName}
                      </h1>
                      <p className="font-bold text-xs sm:text-sm text-slate-800 tracking-wider uppercase mt-0.5">
                        {kopForm.institutionSubName}
                      </p>
                      <p className="text-[10.5px] text-slate-600 mt-1 font-medium">
                        {kopForm.legalLicense}
                      </p>
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        {kopForm.address} | Telp: {kopForm.phone} | WA: {kopForm.whatsapp}
                      </p>
                      <p className="text-[10px] text-indigo-900 font-semibold mt-0.5">
                        Website: {kopForm.website} | Email: {kopForm.email}
                      </p>
                    </div>
                  </div>

                  <div className="border-b-4 border-double border-slate-900 -mt-3 mb-6" />

                  {/* Letter Header Info */}
                  <div className="font-sans text-xs space-y-4 pt-1">
                    <div className="text-center space-y-1 mb-6">
                      <h2 className="font-extrabold text-sm sm:text-base tracking-wider uppercase text-slate-900 underline underline-offset-4">
                        {currentTemplate?.subject || 'SURAT KETERANGAN RESMI'}
                      </h2>
                      <p className="text-xs text-slate-700 font-semibold font-mono">
                        Nomor: 10{issuedLetters.length + 1}/PROSPECT-JBR/{currentTemplate?.code || 'SK'}/{new Date().getMonth() + 1}/{new Date().getFullYear()}
                      </p>
                    </div>

                    {/* Populated Body Content */}
                    <div
                      className="prose prose-slate max-w-none text-xs leading-relaxed text-slate-800 space-y-3"
                      dangerouslySetInnerHTML={{
                        __html: replacePlaceholders(currentTemplate?.bodyContent || '', activeCandidate),
                      }}
                    />
                  </div>
                </div>

                {/* Signatures & Verification Stamp Area */}
                <div className="font-sans pt-8 border-t border-slate-200 mt-8 flex items-end justify-between gap-6">
                  {/* Digital QR Code Verification */}
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center space-y-1 shrink-0">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${encodeURIComponent(
                        `VERIFIED-DOCUMENT:10${issuedLetters.length + 1}/PROSPECT-JBR/${currentTemplate?.code || 'SK'}`
                      )}`}
                      alt="QR Verification"
                      className="w-16 h-16 mx-auto"
                    />
                    <p className="text-[9px] font-bold text-slate-600">VERIFIKASI DIGITAL</p>
                    <p className="text-[8px] text-slate-400 font-mono">PROSPECT E-OFFICE</p>
                  </div>

                  {/* Official Signature Box */}
                  <div className="text-center w-64 space-y-1">
                    <p className="text-xs text-slate-700">
                      {kopForm.cityIssued}, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                    <p className="text-xs font-bold text-slate-900">
                      {currentTemplate?.signerTitle || kopForm.defaultSignerTitle}
                    </p>

                    <div className="h-20 my-1 flex items-center justify-center relative">
                      <img
                        src="https://api.dicebear.com/7.x/initials/svg?seed=RE"
                        alt="Signature"
                        className="h-14 opacity-80"
                      />
                    </div>

                    <p className="font-bold text-xs text-slate-900 underline">
                      {currentTemplate?.signerName || kopForm.defaultSignerName}
                    </p>
                    <p className="text-[10px] text-slate-600">
                      {currentTemplate?.signerNip || kopForm.defaultSignerNip}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: ARSIP SURAT KELUAR */}
          {activeTab === 'archive' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Cari berdasarkan nama siswa, no. surat, atau jenis..."
                    value={archiveSearch}
                    onChange={(e) => setArchiveSearch(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="text-xs text-slate-400">
                  Total Surat Terbit: <strong className="text-white">{issuedLetters.length}</strong>
                </div>
              </div>

              <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left text-slate-300">
                    <thead className="bg-slate-900 text-slate-400 uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="p-3">No. Surat</th>
                        <th className="p-3">Siswa Target</th>
                        <th className="p-3">Jenis Template</th>
                        <th className="p-3">Tanggal Terbit</th>
                        <th className="p-3">Penerbit</th>
                        <th className="p-3 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80">
                      {filteredArchives.map((letter) => (
                        <tr key={letter.id} className="hover:bg-slate-900/50 transition">
                          <td className="p-3 font-mono font-bold text-indigo-300">{letter.letterNumber}</td>
                          <td className="p-3 font-bold text-white">
                            {letter.candidateName}
                            {letter.candidateRegNumber && (
                              <span className="block text-[10px] text-slate-400 font-mono font-normal">
                                {letter.candidateRegNumber}
                              </span>
                            )}
                          </td>
                          <td className="p-3">{letter.templateTitle}</td>
                          <td className="p-3 text-slate-400">{letter.issueDate}</td>
                          <td className="p-3">{letter.issuedBy}</td>
                          <td className="p-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => setSelectedArchiveLetter(letter)}
                                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-indigo-300 rounded-lg transition flex items-center gap-1 text-[11px] font-bold cursor-pointer"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>Lihat</span>
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`Hapus arsip surat ${letter.letterNumber}?`)) {
                                    deleteIssuedLetter(letter.id);
                                  }
                                }}
                                className="p-1 text-slate-500 hover:text-red-400 hover:bg-slate-800 rounded transition cursor-pointer"
                                title="Hapus Arsip"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}

                      {filteredArchives.length === 0 && (
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-slate-500 italic">
                            Belum ada surat resmi yang terbit dalam arsip.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal View Archive Detail */}
        {selectedArchiveLetter && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex justify-center items-center p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-3xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <h3 className="font-bold text-sm text-white">
                    Arsip Surat: {selectedArchiveLetter.letterNumber}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Siswa: {selectedArchiveLetter.candidateName} | Diterbitkan: {selectedArchiveLetter.issueDate}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedArchiveLetter(null)}
                  className="p-1.5 text-slate-400 hover:text-white bg-slate-800 rounded-full cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="bg-white text-slate-900 p-8 rounded-2xl text-xs space-y-4 border border-slate-200">
                <div className="text-center space-y-1 mb-4 border-b pb-3">
                  <h4 className="font-extrabold text-sm uppercase text-blue-900">{kopForm.institutionName}</h4>
                  <p className="text-[10px] text-slate-600">{kopForm.address}</p>
                </div>

                <div className="text-center font-bold text-slate-900 underline uppercase">
                  {selectedArchiveLetter.subject}
                </div>

                <div
                  className="prose text-xs text-slate-800 space-y-2"
                  dangerouslySetInnerHTML={{ __html: selectedArchiveLetter.contentHtml }}
                />

                <div className="pt-6 flex justify-end text-right text-xs">
                  <div>
                    <p>{kopForm.cityIssued}, {selectedArchiveLetter.issueDate}</p>
                    <p className="font-bold">{selectedArchiveLetter.signerTitle}</p>
                    <p className="mt-8 font-bold underline">{selectedArchiveLetter.signerName}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl flex items-center gap-2 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Cetak Surat Ini</span>
                </button>
                <button
                  onClick={() => setSelectedArchiveLetter(null)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-bold rounded-xl cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
