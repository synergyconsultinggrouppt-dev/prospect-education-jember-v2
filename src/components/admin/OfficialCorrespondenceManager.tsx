import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Candidate, LetterheadConfig, LetterTemplate, IssuedLetter, LetterStyleConfig, LetterTemplateVersion } from '../../types';
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
  Tag,
  Sparkles,
  Info,
  ChevronRight,
  UserCheck,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ExternalLink,
  Share2,
  ScanLine,
  Globe,
  Palette,
  Type,
  Sliders,
  Code,
  RotateCcw,
  Layout,
  History,
  Clock,
  ArrowLeft
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  selectedCandidateForIssue?: Candidate | null;
}

export const getLetterTemplateStyle = (styleConfig?: LetterStyleConfig): React.CSSProperties => {
  if (!styleConfig) {
    return {
      fontFamily: "'Times New Roman', Times, serif",
      fontSize: '11pt',
      lineHeight: '1.6',
      paddingTop: '32px',
      paddingBottom: '32px',
      paddingLeft: '32px',
      paddingRight: '32px',
      marginTop: '0px',
      marginBottom: '0px',
    };
  }

  let fontFam = styleConfig.fontFamily || 'serif';
  if (fontFam === 'serif') fontFam = "'Times New Roman', Times, serif";
  if (fontFam === 'georgia') fontFam = "Georgia, 'Times New Roman', serif";
  if (fontFam === 'garamond') fontFam = "Garamond, 'Times New Roman', serif";
  if (fontFam === 'sans-serif' || fontFam === 'jakarta') fontFam = "'Plus Jakarta Sans', Arial, sans-serif";
  if (fontFam === 'arial') fontFam = "Arial, Helvetica, sans-serif";
  if (fontFam === 'mono') fontFam = "'Courier New', Courier, monospace";

  return {
    fontFamily: fontFam,
    fontSize: styleConfig.fontSize || '11pt',
    lineHeight: styleConfig.lineHeight || '1.6',
    paddingTop: styleConfig.paddingTop || '32px',
    paddingBottom: styleConfig.paddingBottom || '32px',
    paddingLeft: styleConfig.paddingLeft || '32px',
    paddingRight: styleConfig.paddingRight || '32px',
    marginTop: styleConfig.marginTop || '0px',
    marginBottom: styleConfig.marginBottom || '0px',
  };
};

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
    currentRole,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'kop' | 'templates' | 'issue' | 'archive'>('kop');

  // Kop Config local state with fallbacks for QR Code settings
  const [kopForm, setKopForm] = useState<LetterheadConfig>({
    ...letterheadConfig,
    enableQrVerification: letterheadConfig?.enableQrVerification ?? true,
    qrPosition: letterheadConfig?.qrPosition || 'bottom_footer',
    qrVerificationBaseUrl: letterheadConfig?.qrVerificationBaseUrl || `${typeof window !== 'undefined' ? window.location.origin : ''}/verify-letter`,
    qrLabelText: letterheadConfig?.qrLabelText || 'VERIFIKASI KEASLIAN DOKUMEN',
    enableDigitalHash: letterheadConfig?.enableDigitalHash ?? true,
  });
  const [kopSavedNotice, setKopSavedNotice] = useState(false);

  // Template local state
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(letterTemplates[0]?.id || '');
  const [editingTemplate, setEditingTemplate] = useState<LetterTemplate | null>(null);
  const [templateEditSubTab, setTemplateEditSubTab] = useState<'content' | 'style'>('content');
  const [copiedTag, setCopiedTag] = useState<string | null>(null);

  // Version History local state
  const [isVersionHistoryOpen, setIsVersionHistoryOpen] = useState(false);
  const [selectedVersionForPreview, setSelectedVersionForPreview] = useState<LetterTemplateVersion | null>(null);
  const [saveChangeNote, setSaveChangeNote] = useState<string>('');
  const [saveNotificationMsg, setSaveNotificationMsg] = useState<string | null>(null);

  // Template Preview Modal State
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [previewCandidateSource, setPreviewCandidateSource] = useState<'dummy' | string>('dummy');
  const [copiedPreviewHtml, setCopiedPreviewHtml] = useState(false);

  // Rich Dummy Candidate Data for Template Preview Simulation
  const dummyCandidate: Candidate = {
    id: 'cand-dummy-01',
    fullName: 'Ahmad Rizky Pratama, S.Tr.',
    email: 'ahmad.rizky@prospect.sch.id',
    registrationNumber: 'REG-2026-JP089',
    selectedProgram: 'taiwan_ifp',
    status: 'diklat_bahasa',
    createdAt: '2026-01-10',
    updatedAt: '2026-08-01',
    biodata: {
      nik: '3509192408010003',
      birthPlace: 'Jember',
      birthDate: '14 Agustus 2002',
      gender: 'Laki-laki',
      address: 'Jl. Kalimantan No. 42, Kec. Sumbersari, Kabupaten Jember, Jawa Timur',
      phoneWA: '081234567890',
      parentName: 'Bambang Setyobudi',
      education: 'D4 Teknik Informatika'
    },
    documents: [
      { id: 'doc-1', title: 'Paspor RI', docType: 'paspor', isVerified: true, fileName: 'C8294017' }
    ],
    passportNumber: 'C8294017',
    departureDate: '15 September 2026',
    targetUniversity: 'National Taiwan University of Science and Technology (NTUST)',
    destinationCountry: 'Taiwan (R.O.C)',
    contractStartDate: '01 September 2026',
    contractEndDate: '31 Agustus 2029',
  } as any;

  const activePreviewCandidate = previewCandidateSource === 'dummy'
    ? dummyCandidate
    : candidates.find((c) => c.id === previewCandidateSource) || dummyCandidate;

  const activePreviewTemplate = editingTemplate || letterTemplates.find((t) => t.id === selectedTemplateId) || letterTemplates[0];

  // Issue Letter local state
  const [selectedCandidateId, setSelectedCandidateId] = useState<string>(
    selectedCandidateForIssue?.id || candidates[0]?.id || ''
  );
  const [issueTemplateId, setIssueTemplateId] = useState<string>(letterTemplates[0]?.id || '');
  const [customLetterNumber, setCustomLetterNumber] = useState<string>('');
  const [issueDate, setIssueDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [issueSuccessMsg, setIssueSuccessMsg] = useState<string | null>(null);

  // Archive Filter
  const [archiveSearch, setArchiveSearch] = useState<string>('');
  const [selectedArchiveLetter, setSelectedArchiveLetter] = useState<IssuedLetter | null>(null);

  // Interactive QR Code Verification Modal State
  const [verifyingLetterData, setVerifyingLetterData] = useState<{
    letterNumber: string;
    candidateName: string;
    candidateRegNumber?: string;
    templateTitle: string;
    issueDate: string;
    signerName: string;
    signerTitle: string;
    verificationHash: string;
    verificationUrl: string;
  } | null>(null);
  const [copiedVerifyLink, setCopiedVerifyLink] = useState(false);

  // Synchronize local states when props or context candidates update
  useEffect(() => {
    if (selectedCandidateForIssue?.id) {
      setSelectedCandidateId(selectedCandidateForIssue.id);
      setActiveTab('issue');
    } else if (!selectedCandidateId && candidates.length > 0) {
      setSelectedCandidateId(candidates[0].id);
    }
  }, [selectedCandidateForIssue, candidates]);

  // Synchronize letter templates selection state
  useEffect(() => {
    if (letterTemplates.length > 0) {
      if (!selectedTemplateId || !letterTemplates.some((t) => t.id === selectedTemplateId)) {
        setSelectedTemplateId(letterTemplates[0].id);
      }
      if (!issueTemplateId || !letterTemplates.some((t) => t.id === issueTemplateId)) {
        setIssueTemplateId(letterTemplates[0].id);
      }
    }
  }, [letterTemplates]);

  // Synchronize letterhead config when context updates
  useEffect(() => {
    if (letterheadConfig) {
      setKopForm({
        ...letterheadConfig,
        enableQrVerification: letterheadConfig.enableQrVerification ?? true,
        qrPosition: letterheadConfig.qrPosition || 'bottom_footer',
        qrVerificationBaseUrl: letterheadConfig.qrVerificationBaseUrl || `${typeof window !== 'undefined' ? window.location.origin : ''}/verify-letter`,
        qrLabelText: letterheadConfig.qrLabelText || 'VERIFIKASI KEASLIAN DOKUMEN',
        enableDigitalHash: letterheadConfig.enableDigitalHash ?? true,
      });
    }
  }, [letterheadConfig]);

  if (!isOpen) return null;

  const handleSaveKop = () => {
    updateLetterheadConfig(kopForm);
    setKopSavedNotice(true);
    setTimeout(() => setKopSavedNotice(false), 3000);
  };

  const currentTemplate = letterTemplates.find((t) => t.id === selectedTemplateId) || letterTemplates[0];
  const activeCandidate = candidates.find((c) => c.id === selectedCandidateId) || candidates[0];

  // Helper to generate dynamic letter text safely
  const replacePlaceholders = (text: string = '', candidate?: Candidate, customNum?: string) => {
    if (!text) return '';
    if (!candidate) return text;

    const progName = candidate.selectedProgram === 'taiwan_ifp' || candidate.selectedProgram === 'taiwan_4_1'
      ? 'Program Kuliah + Magang Taiwan (IFP 1+4)'
      : candidate.selectedProgram === 'japan_im' || candidate.selectedProgram === 'japan_ssw'
      ? 'Program Pelatihan Kerja Jepang (Tokutei Ginou SSW)'
      : 'Program Diklat Prospect Education Jember';

    const passportNo = (candidate as any).passportNumber || candidate.documents?.find((d: any) => d.docType === 'paspor')?.fileName || candidate.biodata?.nik || 'C7102984';
    const departureDate = (candidate as any).departureDate || '15 September 2026';
    const targetUniv = (candidate as any).targetUniversity || (candidate.selectedProgram?.includes('taiwan') ? 'National Taiwan University of Science and Technology (NTUST)' : candidate.selectedProgram?.includes('japan') ? 'Aichi Vocational Training Center Japan' : 'Partner Institute International');
    const destCountry = (candidate as any).destinationCountry || (candidate.selectedProgram?.includes('taiwan') ? 'Taiwan (R.O.C)' : candidate.selectedProgram?.includes('japan') ? 'Jepang (Japan)' : 'Jerman');

    const startDate = (candidate as any).contractStartDate || new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    const endDate = (candidate as any).contractEndDate || new Date(new Date().setFullYear(new Date().getFullYear() + 3)).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

    const formatLetterNo = customNum || `10${issuedLetters.length + 1}/PROSPECT-JBR/${currentTemplate?.code || 'SURAT'}/${new Date().getMonth() + 1}/${new Date().getFullYear()}`;

    return text
      .replaceAll('{NAMA_SISWA}', candidate.fullName || '-')
      .replaceAll('{NOMOR_REGISTRASI}', candidate.registrationNumber || '-')
      .replaceAll('{NIK}', candidate.biodata?.nik || '-')
      .replaceAll('{NO_PASPOR}', passportNo)
      .replaceAll('{PROGRAM}', progName)
      .replaceAll('{UNIVERSITAS_TUJUAN}', targetUniv)
      .replaceAll('{NEGARA_TUJUAN}', destCountry)
      .replaceAll('{TANGGAL_KEBERANGKATAN}', departureDate)
      .replaceAll('{TANGGAL_MULAI_KONTRAK}', startDate)
      .replaceAll('{TANGGAL_SELESAI_KONTRAK}', endDate)
      .replaceAll('{TEMPAT_LAHIR}', candidate.biodata?.birthPlace || 'Jember')
      .replaceAll('{TANGGAL_LAHIR}', candidate.biodata?.birthDate || '-')
      .replaceAll('{ALAMAT_SISWA}', candidate.biodata?.address || '-')
      .replaceAll('{NAMA_ORANGTUA}', candidate.biodata?.parentName || '-')
      .replaceAll('{TELEPON_SISWA}', candidate.biodata?.phoneWA || '-')
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

  const handleInsertTag = (tag: string) => {
    if (editingTemplate) {
      setEditingTemplate({
        ...editingTemplate,
        bodyContent: editingTemplate.bodyContent + ` ${tag} `,
      });
      setCopiedTag(tag);
      setTimeout(() => setCopiedTag(null), 2000);
    }
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
  };

  const handleSaveEditingTemplate = () => {
    if (editingTemplate) {
      const currentVersions = editingTemplate.versionHistory || [];
      const newVersionNum = currentVersions.length + 1;

      const newVersionSnapshot: LetterTemplateVersion = {
        id: `ver-${Date.now()}`,
        versionNumber: newVersionNum,
        title: editingTemplate.title,
        subject: editingTemplate.subject,
        numberFormat: editingTemplate.numberFormat,
        bodyContent: editingTemplate.bodyContent,
        signerName: editingTemplate.signerName,
        signerTitle: editingTemplate.signerTitle,
        signerNip: editingTemplate.signerNip,
        styleConfig: editingTemplate.styleConfig,
        savedAt: new Date().toLocaleString('id-ID', {
          day: '2-digit', month: 'short', year: 'numeric',
          hour: '2-digit', minute: '2-digit'
        }),
        savedBy: 'Admin Cabang',
        changeNote: saveChangeNote.trim() || `Versi ${newVersionNum}: Perubahan template disalin`
      };

      const updatedTemplate: LetterTemplate = {
        ...editingTemplate,
        updatedAt: new Date().toISOString().split('T')[0],
        versionHistory: [newVersionSnapshot, ...currentVersions]
      };

      updateLetterTemplate(editingTemplate.id, updatedTemplate);
      setEditingTemplate(updatedTemplate);
      setSaveChangeNote('');
      setSaveNotificationMsg(`✓ Template tersimpan! Snapshot Versi ${newVersionNum} berhasil dikunci.`);
      setTimeout(() => setSaveNotificationMsg(null), 4500);
    }
  };

  const handleRestoreVersion = (version: LetterTemplateVersion) => {
    if (!editingTemplate) return;

    if (window.confirm(`Apakah Anda yakin ingin memulihkan Versi ${version.versionNumber} (${version.savedAt})?\n\nCatatan Versi: "${version.changeNote || 'Tanpa catatan'}"\n\nSeluruh teks dan konfigurasi tata letak template akan dikembalikan ke versi ini.`)) {
      const currentVersions = editingTemplate.versionHistory || [];
      const newVersionNum = currentVersions.length + 1;

      const restoreSnapshot: LetterTemplateVersion = {
        id: `ver-${Date.now()}`,
        versionNumber: newVersionNum,
        title: version.title,
        subject: version.subject,
        numberFormat: version.numberFormat,
        bodyContent: version.bodyContent,
        signerName: version.signerName,
        signerTitle: version.signerTitle,
        signerNip: version.signerNip,
        styleConfig: version.styleConfig,
        savedAt: new Date().toLocaleString('id-ID', {
          day: '2-digit', month: 'short', year: 'numeric',
          hour: '2-digit', minute: '2-digit'
        }),
        savedBy: 'Admin Cabang',
        changeNote: `Restored dari Versi ${version.versionNumber} (${version.savedAt})`
      };

      const restoredTemplate: LetterTemplate = {
        ...editingTemplate,
        title: version.title,
        subject: version.subject,
        numberFormat: version.numberFormat,
        bodyContent: version.bodyContent,
        signerName: version.signerName || editingTemplate.signerName,
        signerTitle: version.signerTitle || editingTemplate.signerTitle,
        signerNip: version.signerNip || editingTemplate.signerNip,
        styleConfig: version.styleConfig || editingTemplate.styleConfig,
        updatedAt: new Date().toISOString().split('T')[0],
        versionHistory: [restoreSnapshot, ...currentVersions]
      };

      updateLetterTemplate(editingTemplate.id, restoredTemplate);
      setEditingTemplate(restoredTemplate);
      setSelectedVersionForPreview(null);
      setIsVersionHistoryOpen(false);
      setSaveNotificationMsg(`✓ Berhasil memulihkan Versi ${version.versionNumber}! Diterapkan sebagai Versi ${newVersionNum}.`);
      setTimeout(() => setSaveNotificationMsg(null), 5000);
    }
  };

  // Helper to construct verification hash and URL
  const generateVerificationInfo = (letterNo: string, candidate?: Candidate) => {
    const cleanNo = letterNo.replaceAll('/', '-');
    const hashSeed = `${cleanNo}-${candidate?.registrationNumber || 'REG'}-PROSPECT`;
    const hash = `PR-HASH-${Math.abs(
      hashSeed.split('').reduce((acc, char) => (acc << 5) - acc + char.charCodeAt(0), 0)
    ).toString(16).toUpperCase()}-2026`;

    const baseUrl = kopForm.qrVerificationBaseUrl || `${window.location.origin}/verify-letter`;
    const url = `${baseUrl}?no=${encodeURIComponent(letterNo)}&hash=${encodeURIComponent(hash)}&name=${encodeURIComponent(candidate?.fullName || '')}`;

    return { hash, url };
  };

  const handleIssueLetter = () => {
    if (!activeCandidate || !currentTemplate) return;

    const letterNo = customLetterNumber || `10${issuedLetters.length + 1}/PROSPECT-JBR/${currentTemplate.code}/${new Date().getMonth() + 1}/${new Date().getFullYear()}`;
    const populatedHtml = replacePlaceholders(currentTemplate.bodyContent, activeCandidate, letterNo);
    const { hash, url } = generateVerificationInfo(letterNo, activeCandidate);

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
      verificationHash: hash,
      verificationUrl: url,
    };

    issueNewLetter(newIssued);
    setIssueSuccessMsg(`Surat Resmi No. ${letterNo} berhasil diterbitkan dan tersimpan di Arsip dengan QR Code Verifikasi!`);
    setTimeout(() => setIssueSuccessMsg(null), 4000);
  };

  // Render QR Code Box
  const renderQrWidget = (
    letterNo: string,
    verificationHash: string,
    candidateName: string,
    size: number = 72,
    onVerifyClick?: () => void
  ) => {
    if (!kopForm.enableQrVerification) return null;

    const baseUrl = kopForm.qrVerificationBaseUrl || `${window.location.origin}/verify-letter`;
    const qrData = `${baseUrl}?no=${encodeURIComponent(letterNo)}&hash=${encodeURIComponent(verificationHash)}&name=${encodeURIComponent(candidateName)}`;
    const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&margin=1&data=${encodeURIComponent(qrData)}`;

    return (
      <div
        onClick={onVerifyClick}
        className="p-2 bg-slate-50 border border-slate-300 rounded-xl text-center space-y-1 shrink-0 inline-block hover:border-indigo-500 hover:shadow-md transition cursor-pointer group select-none"
        title="Klik untuk Uji Scan Verifikasi Keaslian Surat"
      >
        <div className="relative mx-auto inline-block">
          <img
            src={qrImageUrl}
            alt="QR Verification Code"
            style={{ width: `${size}px`, height: `${size}px` }}
            className="mx-auto block rounded"
          />
          <div className="absolute inset-0 bg-indigo-900/20 opacity-0 group-hover:opacity-100 transition flex items-center justify-center rounded">
            <ScanLine className="w-5 h-5 text-indigo-800 animate-pulse" />
          </div>
        </div>
        <p className="text-[8.5px] font-bold text-slate-800 uppercase leading-none tracking-tight">
          {kopForm.qrLabelText || 'VERIFIKASI KEASLIAN'}
        </p>
        {kopForm.enableDigitalHash && (
          <p className="text-[7.5px] text-slate-600 font-mono font-semibold leading-none">
            {verificationHash || 'PR-VERIFY-2026'}
          </p>
        )}
      </div>
    );
  };

  const availableTags = [
    { tag: '{NAMA_SISWA}', label: 'Nama Lengkap Siswa' },
    { tag: '{NOMOR_REGISTRASI}', label: 'Nomor Registrasi / ID Siswa' },
    { tag: '{NIK}', label: 'NIK / Nomor KTP' },
    { tag: '{NO_PASPOR}', label: 'Nomor Paspor Siswa' },
    { tag: '{TANGGAL_KEBERANGKATAN}', label: 'Rencana Tanggal Keberangkatan' },
    { tag: '{UNIVERSITAS_TUJUAN}', label: 'Instansi / Universitas Tujuan' },
    { tag: '{NEGARA_TUJUAN}', label: 'Negara Tujuan (Taiwan/Jepang)' },
    { tag: '{TANGGAL_MULAI_KONTRAK}', label: 'Tanggal Mulai Kontrak' },
    { tag: '{TANGGAL_SELESAI_KONTRAK}', label: 'Tanggal Selesai Kontrak' },
    { tag: '{PROGRAM}', label: 'Nama Program Studi / Vokasi' },
    { tag: '{TEMPAT_LAHIR}', label: 'Tempat Lahir' },
    { tag: '{TANGGAL_LAHIR}', label: 'Tanggal Lahir' },
    { tag: '{ALAMAT_SISWA}', label: 'Alamat Domisili Siswa' },
    { tag: '{NAMA_ORANGTUA}', label: 'Nama Orang Tua / Wali' },
    { tag: '{TELEPON_SISWA}', label: 'Nomor HP / WhatsApp' },
    { tag: '{EMAIL_SISWA}', label: 'Email Resmi Siswa' },
    { tag: '{NOMOR_SURAT}', label: 'Nomor Surat Terbit Otomatis' },
    { tag: '{TANGGAL_SURAT}', label: 'Tanggal Surat (Format Indo)' },
    { tag: '{KOTA_PENERBITAN}', label: 'Kota Penerbitan (Jember)' },
    { tag: '{TAHUN_AKADEMIK}', label: 'Tahun Akademik / Angkatan' },
  ];

  const filteredArchives = issuedLetters.filter(
    (item) =>
      item.candidateName.toLowerCase().includes(archiveSearch.toLowerCase()) ||
      item.letterNumber.toLowerCase().includes(archiveSearch.toLowerCase()) ||
      item.templateTitle.toLowerCase().includes(archiveSearch.toLowerCase())
  );

  // Live issue letter data helper for preview
  const liveLetterNo = customLetterNumber || `10${issuedLetters.length + 1}/PROSPECT-JBR/${currentTemplate?.code || 'SK'}/${new Date().getMonth() + 1}/${new Date().getFullYear()}`;
  const liveVerifyInfo = generateVerificationInfo(liveLetterNo, activeCandidate);

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
                <span className="bg-indigo-950 text-indigo-300 border border-indigo-500/40 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase flex items-center gap-1">
                  <QrCode className="w-3 h-3 text-emerald-400" />
                  <span>QR Verified</span>
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Kelola kop lembaga, logo, stempel, QR Code verifikasi keaslian dinamis, dan cetak surat resmi
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
        <div className="bg-slate-950/90 px-6 pt-3 border-b border-slate-800 flex items-center gap-2 overflow-x-auto shrink-0 print:hidden">
          <button
            onClick={() => setActiveTab('kop')}
            className={`px-4 py-2.5 font-bold text-xs rounded-t-xl transition flex items-center gap-2 cursor-pointer border-b-2 ${
              activeTab === 'kop'
                ? 'bg-slate-800 text-indigo-400 border-indigo-500 shadow-xs'
                : 'text-slate-400 hover:text-slate-200 border-transparent'
            }`}
          >
            <Building className="w-4 h-4" />
            <span>1. Kop Surat & QR Verifikasi</span>
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
                    <span>Pengaturan Kop Surat & QR Verifikasi berhasil disimpan!</span>
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
                    <label className="block text-slate-400 mb-1 font-medium">Legalitas & Nomor Izin Resmi</label>
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
                    <label className="block text-slate-400 mb-1 font-medium">URL Logo Lembaga (Image URL)</label>
                    <input
                      type="text"
                      value={kopForm.logoUrl}
                      onChange={(e) => setKopForm({ ...kopForm, logoUrl: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500 text-xs"
                      placeholder="https://domain.com/logo.png"
                    />
                  </div>

                  {/* QR CODE CONFIGURATION SECTION */}
                  <div className="pt-3 border-t border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-indigo-300 flex items-center gap-1.5 text-xs">
                        <QrCode className="w-4 h-4 text-emerald-400" />
                        <span>Pengaturan QR Code Verifikasi Dokumen</span>
                      </span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={kopForm.enableQrVerification}
                          onChange={(e) => setKopForm({ ...kopForm, enableQrVerification: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                      </label>
                    </div>

                    {kopForm.enableQrVerification && (
                      <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 space-y-3 text-xs">
                        <div>
                          <label className="block text-slate-400 mb-1 font-medium">Posisi QR Code Pada Surat</label>
                          <select
                            value={kopForm.qrPosition || 'bottom_footer'}
                            onChange={(e) => setKopForm({ ...kopForm, qrPosition: e.target.value as any })}
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold focus:outline-none focus:border-indigo-500 cursor-pointer"
                          >
                            <option value="bottom_footer">📌 Bagian Bawah Dokumen (Berdampingan TTD)</option>
                            <option value="top_kop">📌 Dalam Kop Surat (Sudut Kanan Atas)</option>
                            <option value="both">📌 Dua Posisi (Atas Kop & Bawah Footer)</option>
                          </select>
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="text-slate-400 font-medium">URL Link Verifikasi Dokumen</label>
                            <button
                              onClick={() => setKopForm({ ...kopForm, qrVerificationBaseUrl: `${window.location.origin}/verify-letter` })}
                              className="text-[10px] text-indigo-400 hover:underline flex items-center gap-0.5 cursor-pointer"
                            >
                              <Globe className="w-3 h-3" />
                              <span>Gunakan Domain Aktif</span>
                            </button>
                          </div>
                          <input
                            type="text"
                            value={kopForm.qrVerificationBaseUrl || ''}
                            onChange={(e) => setKopForm({ ...kopForm, qrVerificationBaseUrl: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-emerald-300 font-mono text-[11px] focus:outline-none focus:border-indigo-500"
                            placeholder="https://prospektus-education.id/verify-letter"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-slate-400 mb-1 font-medium">Label Teks QR</label>
                            <input
                              type="text"
                              value={kopForm.qrLabelText || ''}
                              onChange={(e) => setKopForm({ ...kopForm, qrLabelText: e.target.value })}
                              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-slate-200 focus:outline-none focus:border-indigo-500"
                            />
                          </div>

                          <div className="flex items-center pt-4">
                            <label className="flex items-center gap-2 cursor-pointer text-slate-300 font-medium text-[11px]">
                              <input
                                type="checkbox"
                                checked={kopForm.enableDigitalHash}
                                onChange={(e) => setKopForm({ ...kopForm, enableDigitalHash: e.target.checked })}
                                className="rounded bg-slate-950 border-slate-700 text-indigo-600 focus:ring-0"
                              />
                              <span>Cetak Kode Hash Keamanan</span>
                            </label>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
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
                    Sesuai format cetakan resmi A4
                  </span>
                </div>

                <div className="bg-white text-slate-900 p-8 sm:p-10 rounded-2xl shadow-xl border border-slate-200 min-h-[500px] flex flex-col justify-between font-serif">
                  {/* Kop Surat Live Render */}
                  <div>
                    <div className="flex items-center gap-4 border-b pb-4 mb-4" style={{ borderColor: '#0f172a' }}>
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

                      {/* Header QR Code if top_kop or both */}
                      {(kopForm.qrPosition === 'top_kop' || kopForm.qrPosition === 'both') && (
                        <div className="shrink-0 hidden sm:block">
                          {renderQrWidget(
                            '101/PROSPECT-JBR/SK/08/2026',
                            'PR-HASH-SAMPLE-KOP',
                            'Contoh Peserta',
                            60,
                            () =>
                              setVerifyingLetterData({
                                letterNumber: '101/PROSPECT-JBR/SK/08/2026',
                                candidateName: 'Siswa Contoh (Simulasi Kop)',
                                candidateRegNumber: 'REG-2026-DEMO',
                                templateTitle: 'Surat Keterangan Resmi Kop Surat',
                                issueDate: new Date().toLocaleDateString('id-ID'),
                                signerName: kopForm.defaultSignerName,
                                signerTitle: kopForm.defaultSignerTitle,
                                verificationHash: 'PR-HASH-SAMPLE-KOP',
                                verificationUrl: `${kopForm.qrVerificationBaseUrl}?no=101/PROSPECT-JBR/SK/08/2026&hash=PR-HASH-SAMPLE-KOP`,
                              })
                          )}
                        </div>
                      )}
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
                            <td className="p-2 font-bold border border-slate-300">Jabatan Resmi</td>
                            <td className="p-2 border border-slate-300">{kopForm.defaultSignerTitle}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Sample Signatures Area */}
                  <div className="font-sans pt-6 border-t border-dashed border-slate-300 flex items-end justify-between gap-4">
                    {/* Footer QR Code if bottom_footer or both */}
                    {(kopForm.qrPosition === 'bottom_footer' || kopForm.qrPosition === 'both') ? (
                      <div>
                        {renderQrWidget(
                          '101/PROSPECT-JBR/SK/08/2026',
                          'PR-HASH-SAMPLE-KOP',
                          'Contoh Peserta',
                          68,
                          () =>
                            setVerifyingLetterData({
                              letterNumber: '101/PROSPECT-JBR/SK/08/2026',
                              candidateName: 'Siswa Contoh (Simulasi Kop)',
                              candidateRegNumber: 'REG-2026-DEMO',
                              templateTitle: 'Surat Keterangan Resmi Kop Surat',
                              issueDate: new Date().toLocaleDateString('id-ID'),
                              signerName: kopForm.defaultSignerName,
                              signerTitle: kopForm.defaultSignerTitle,
                              verificationHash: 'PR-HASH-SAMPLE-KOP',
                              verificationUrl: `${kopForm.qrVerificationBaseUrl}?no=101/PROSPECT-JBR/SK/08/2026&hash=PR-HASH-SAMPLE-KOP`,
                            })
                        )}
                      </div>
                    ) : (
                      <div />
                    )}

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

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTemplateId(tpl.id);
                            setEditingTemplate(tpl);
                            setIsPreviewModalOpen(true);
                          }}
                          className="p-1 text-indigo-400 hover:text-white hover:bg-indigo-900/50 rounded transition cursor-pointer"
                          title="Pratinjau Surat dengan Data Dummy"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
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
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-3">
                      <div className="flex items-center gap-2">
                        <Edit3 className="w-4 h-4 text-indigo-400" />
                        <h3 className="font-bold text-sm text-white">Edit Template: {editingTemplate.title}</h3>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Sub-tab Navigation */}
                        <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-xl border border-slate-800">
                          <button
                            type="button"
                            onClick={() => setTemplateEditSubTab('content')}
                            className={`px-3 py-1 rounded-lg font-bold text-xs flex items-center gap-1.5 transition cursor-pointer ${
                              templateEditSubTab === 'content'
                                ? 'bg-indigo-600 text-white shadow-xs'
                                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                            }`}
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>Konten Teks</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setTemplateEditSubTab('style')}
                            className={`px-3 py-1 rounded-lg font-bold text-xs flex items-center gap-1.5 transition cursor-pointer ${
                              templateEditSubTab === 'style'
                                ? 'bg-indigo-600 text-white shadow-xs'
                                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                            }`}
                          >
                            <Palette className="w-3.5 h-3.5" />
                            <span>Style & Layout CSS</span>
                            {editingTemplate.styleConfig?.customCss && (
                              <span className="w-2 h-2 rounded-full bg-emerald-400" title="Ada CSS kustom aktif" />
                            )}
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => setIsVersionHistoryOpen(true)}
                          className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-amber-300 hover:text-white font-bold rounded-xl border border-amber-500/40 hover:border-amber-400 transition flex items-center gap-1.5 cursor-pointer shadow-xs relative"
                          title="Lihat riwayat revisi & pulihkan versi sebelumnya"
                        >
                          <RotateCcw className="w-4 h-4 text-amber-400" />
                          <span>Riwayat Versi</span>
                          {editingTemplate.versionHistory && editingTemplate.versionHistory.length > 0 && (
                            <span className="bg-amber-500/20 text-amber-300 text-[10px] font-mono px-1.5 py-0.2 rounded-full border border-amber-500/40">
                              {editingTemplate.versionHistory.length}
                            </span>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => setIsPreviewModalOpen(true)}
                          className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-indigo-300 hover:text-white font-bold rounded-xl border border-indigo-500/40 hover:border-indigo-400 transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                          title="Pratinjau Hasil Rendering Template Surat dengan Data Dummy"
                        >
                          <Eye className="w-4 h-4 text-indigo-400" />
                          <span className="hidden sm:inline">Pratinjau Surat</span>
                        </button>

                        <button
                          type="button"
                          onClick={handleSaveEditingTemplate}
                          className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <Save className="w-4 h-4" />
                          <span>Simpan Template</span>
                        </button>
                      </div>
                    </div>

                    {/* Change Note Input Bar */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 bg-slate-900 p-2.5 rounded-xl border border-slate-800 text-xs">
                      <div className="flex items-center gap-2 grow">
                        <span className="text-[11px] font-bold text-amber-400 shrink-0 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Catatan Perubahan Versi:</span>
                        </span>
                        <input
                          type="text"
                          value={saveChangeNote}
                          onChange={(e) => setSaveChangeNote(e.target.value)}
                          placeholder="Misal: Perbaikan tata letak pasal 2, penyesuaian penomoran otomatis..."
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1 text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                      <span className="text-[10px] text-slate-500 text-right shrink-0">
                        *Disimpan sebagai snapshot versi saat mengeklik "Simpan Template"
                      </span>
                    </div>

                    {/* Notification Toast */}
                    {saveNotificationMsg && (
                      <div className="p-3 bg-emerald-950/80 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs font-bold flex items-center justify-between animate-fade-in shadow-md">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span>{saveNotificationMsg}</span>
                        </div>
                        <button onClick={() => setSaveNotificationMsg(null)} className="p-0.5 hover:text-white">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}

                    {/* SUB-TAB 1: KONTEN TEKS & PARAGRAF */}
                    {templateEditSubTab === 'content' && (
                      <div className="space-y-4">
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
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                            <label className="text-slate-300 font-bold">Isi Paragraf Surat (HTML / Text formatted)</label>
                            <span className="text-[11px] text-slate-400">
                              Klik tombol tag di bawah untuk langsung menyisipkan placeholder dinamis
                            </span>
                          </div>

                          {/* Insertion Toolbar */}
                          <div className="mb-3 p-2.5 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                                <Tag className="w-3.5 h-3.5" />
                                <span>Sisipkan Placeholder Dinamis:</span>
                              </span>
                              <span className="text-[10px] text-slate-500">Otomatis Terisi dari Data Siswa</span>
                            </div>
                            <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto">
                              {availableTags.map((item) => (
                                <button
                                  key={item.tag}
                                  type="button"
                                  onClick={() => handleInsertTag(item.tag)}
                                  className="px-2 py-1 bg-slate-950 hover:bg-indigo-600/30 border border-slate-700 hover:border-indigo-400 text-indigo-300 hover:text-white rounded-lg text-[10.5px] font-mono transition flex items-center gap-1 cursor-pointer"
                                  title={`Klik untuk menyisipkan ${item.label} ke teks surat`}
                                >
                                  <Plus className="w-3 h-3 text-indigo-400 shrink-0" />
                                  <span>{item.tag}</span>
                                </button>
                              ))}
                            </div>
                          </div>

                          <textarea
                            rows={12}
                            value={editingTemplate.bodyContent}
                            onChange={(e) => setEditingTemplate({ ...editingTemplate, bodyContent: e.target.value })}
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-slate-200 font-mono text-xs focus:outline-none focus:border-indigo-500 leading-relaxed"
                          />
                        </div>
                      </div>
                    )}

                    {/* SUB-TAB 2: TATA LETAK CSS & GAYA VISUAL */}
                    {templateEditSubTab === 'style' && (
                      <div className="space-y-4 pt-1">
                        {/* Banner Info */}
                        <div className="p-3.5 bg-indigo-950/40 border border-indigo-500/30 rounded-xl flex items-start gap-3">
                          <Sliders className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                          <div className="space-y-1 text-xs">
                            <h4 className="font-bold text-indigo-200">
                              Kustomisasi Gaya Visual & Layout Khusus [{editingTemplate.code}]
                            </h4>
                            <p className="text-slate-300 leading-relaxed">
                              Atur jenis font, padding, margin, dan aturan CSS spesifik untuk jenis surat ini agar memiliki impresi visual yang unik dan khas saat dicetak.
                            </p>
                          </div>
                        </div>

                        {/* Section 1: Typography (Font Family, Font Size, Line Height) */}
                        <div className="p-4 bg-slate-900/90 rounded-xl border border-slate-800 space-y-3">
                          <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
                            <Type className="w-4 h-4 text-indigo-400" />
                            <span>Tipografi & Jenis Font Per Jenis Surat</span>
                          </h4>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div>
                              <label className="block text-slate-400 mb-1 font-medium text-[11px]">Jenis Font (Font Family)</label>
                              <select
                                value={editingTemplate.styleConfig?.fontFamily || 'serif'}
                                onChange={(e) =>
                                  setEditingTemplate({
                                    ...editingTemplate,
                                    styleConfig: { ...(editingTemplate.styleConfig || {}), fontFamily: e.target.value },
                                  })
                                }
                                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold focus:outline-none focus:border-indigo-500 cursor-pointer text-xs"
                              >
                                <option value="georgia">Georgia (Elegan & Akademik)</option>
                                <option value="serif">Times New Roman (Klasik Formal)</option>
                                <option value="garamond">Garamond (Perjanjian & Legal)</option>
                                <option value="jakarta">Plus Jakarta Sans (Modern Clean)</option>
                                <option value="arial">Arial (Standar Administrasi)</option>
                                <option value="mono">Courier New (Teknis & Kode)</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-slate-400 mb-1 font-medium text-[11px]">Ukuran Font Utama (Base Size)</label>
                              <select
                                value={editingTemplate.styleConfig?.fontSize || '11pt'}
                                onChange={(e) =>
                                  setEditingTemplate({
                                    ...editingTemplate,
                                    styleConfig: { ...(editingTemplate.styleConfig || {}), fontSize: e.target.value },
                                  })
                                }
                                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-indigo-300 font-mono font-bold focus:outline-none focus:border-indigo-500 cursor-pointer text-xs"
                              >
                                <option value="10pt">10pt (Sangat Ringkas)</option>
                                <option value="10.5pt">10.5pt (Ringkas)</option>
                                <option value="11pt">11pt (Standar Resmi)</option>
                                <option value="11.5pt">11.5pt (Medium)</option>
                                <option value="12pt">12pt (Legibel Besar)</option>
                                <option value="13pt">13pt (Besar / Sertifikat)</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-slate-400 mb-1 font-medium text-[11px]">Jarak Antar Baris (Line Height)</label>
                              <select
                                value={editingTemplate.styleConfig?.lineHeight || '1.6'}
                                onChange={(e) =>
                                  setEditingTemplate({
                                    ...editingTemplate,
                                    styleConfig: { ...(editingTemplate.styleConfig || {}), lineHeight: e.target.value },
                                  })
                                }
                                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-indigo-300 font-mono font-bold focus:outline-none focus:border-indigo-500 cursor-pointer text-xs"
                              >
                                <option value="1.3">1.3 (Padat)</option>
                                <option value="1.4">1.4 (Rapat)</option>
                                <option value="1.5">1.5 (Proporsional)</option>
                                <option value="1.6">1.6 (Standar Nyaman)</option>
                                <option value="1.8">1.8 (Renggang Formal)</option>
                                <option value="2.0">2.0 (Ganda / Double Space)</option>
                              </select>
                            </div>
                          </div>
                        </div>

                        {/* Section 2: Padding & Margins */}
                        <div className="p-4 bg-slate-900/90 rounded-xl border border-slate-800 space-y-3">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
                              <Layout className="w-4 h-4 text-indigo-400" />
                              <span>Padding & Margin Halaman Surat</span>
                            </h4>

                            {/* Quick Presets */}
                            <div className="flex items-center gap-1.5 text-[10.5px]">
                              <span className="text-slate-400 font-medium">Preset:</span>
                              <button
                                type="button"
                                onClick={() =>
                                  setEditingTemplate({
                                    ...editingTemplate,
                                    styleConfig: {
                                      ...(editingTemplate.styleConfig || {}),
                                      paddingTop: '20px',
                                      paddingBottom: '20px',
                                      paddingLeft: '24px',
                                      paddingRight: '24px',
                                    },
                                  })
                                }
                                className="px-2 py-0.5 bg-slate-950 hover:bg-slate-800 text-slate-300 rounded border border-slate-700 cursor-pointer transition"
                              >
                                Ringkas (20px)
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  setEditingTemplate({
                                    ...editingTemplate,
                                    styleConfig: {
                                      ...(editingTemplate.styleConfig || {}),
                                      paddingTop: '32px',
                                      paddingBottom: '32px',
                                      paddingLeft: '32px',
                                      paddingRight: '32px',
                                    },
                                  })
                                }
                                className="px-2 py-0.5 bg-slate-950 hover:bg-slate-800 text-indigo-300 rounded border border-slate-700 cursor-pointer font-bold transition"
                              >
                                Standar (32px)
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  setEditingTemplate({
                                    ...editingTemplate,
                                    styleConfig: {
                                      ...(editingTemplate.styleConfig || {}),
                                      paddingTop: '48px',
                                      paddingBottom: '48px',
                                      paddingLeft: '48px',
                                      paddingRight: '48px',
                                    },
                                  })
                                }
                                className="px-2 py-0.5 bg-slate-950 hover:bg-slate-800 text-slate-300 rounded border border-slate-700 cursor-pointer transition"
                              >
                                Longgar (48px)
                              </button>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            <div>
                              <label className="block text-slate-400 mb-1 font-medium text-[10.5px]">Padding Atas (Top)</label>
                              <input
                                type="text"
                                value={editingTemplate.styleConfig?.paddingTop || '32px'}
                                onChange={(e) =>
                                  setEditingTemplate({
                                    ...editingTemplate,
                                    styleConfig: { ...(editingTemplate.styleConfig || {}), paddingTop: e.target.value },
                                  })
                                }
                                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-white font-mono focus:outline-none focus:border-indigo-500 text-xs"
                                placeholder="32px / 1.5cm"
                              />
                            </div>
                            <div>
                              <label className="block text-slate-400 mb-1 font-medium text-[10.5px]">Padding Bawah (Bottom)</label>
                              <input
                                type="text"
                                value={editingTemplate.styleConfig?.paddingBottom || '32px'}
                                onChange={(e) =>
                                  setEditingTemplate({
                                    ...editingTemplate,
                                    styleConfig: { ...(editingTemplate.styleConfig || {}), paddingBottom: e.target.value },
                                  })
                                }
                                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-white font-mono focus:outline-none focus:border-indigo-500 text-xs"
                                placeholder="32px / 1.5cm"
                              />
                            </div>
                            <div>
                              <label className="block text-slate-400 mb-1 font-medium text-[10.5px]">Padding Kiri (Left)</label>
                              <input
                                type="text"
                                value={editingTemplate.styleConfig?.paddingLeft || '32px'}
                                onChange={(e) =>
                                  setEditingTemplate({
                                    ...editingTemplate,
                                    styleConfig: { ...(editingTemplate.styleConfig || {}), paddingLeft: e.target.value },
                                  })
                                }
                                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-white font-mono focus:outline-none focus:border-indigo-500 text-xs"
                                placeholder="32px / 1.5cm"
                              />
                            </div>
                            <div>
                              <label className="block text-slate-400 mb-1 font-medium text-[10.5px]">Padding Kanan (Right)</label>
                              <input
                                type="text"
                                value={editingTemplate.styleConfig?.paddingRight || '32px'}
                                onChange={(e) =>
                                  setEditingTemplate({
                                    ...editingTemplate,
                                    styleConfig: { ...(editingTemplate.styleConfig || {}), paddingRight: e.target.value },
                                  })
                                }
                                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-white font-mono focus:outline-none focus:border-indigo-500 text-xs"
                                placeholder="32px / 1.5cm"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Section 3: Simple CSS Code Editor */}
                        <div className="p-4 bg-slate-900/90 rounded-xl border border-slate-800 space-y-3">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
                              <Code className="w-4 h-4 text-indigo-400" />
                              <span>Editor CSS Kustom Spesifik Template (CSS Code Editor)</span>
                            </h4>
                            <span className="text-[10px] text-slate-400">Aturan CSS ini khusus berlaku untuk rendering jenis surat ini</span>
                          </div>

                          {/* Snippet Insertion Buttons */}
                          <div className="flex flex-wrap gap-1.5 pt-0.5">
                            <span className="text-[10px] text-indigo-300 font-bold self-center mr-1">+ Sisipkan Snippet CSS:</span>
                            <button
                              type="button"
                              onClick={() => {
                                const current = editingTemplate.styleConfig?.customCss || '';
                                const snippet = `\n.printable-content p { text-align: justify; text-indent: 1.5em; }`;
                                setEditingTemplate({
                                  ...editingTemplate,
                                  styleConfig: { ...(editingTemplate.styleConfig || {}), customCss: current + snippet },
                                });
                              }}
                              className="px-2 py-1 bg-slate-950 hover:bg-indigo-900/40 text-indigo-300 text-[10px] font-mono rounded-lg border border-slate-700 cursor-pointer transition"
                            >
                              Paragraf Justify & Tab
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const current = editingTemplate.styleConfig?.customCss || '';
                                const snippet = `\n.printable-content h2 { color: #1e3a8a; border-bottom: 2px solid #1e3a8a; padding-bottom: 4px; }`;
                                setEditingTemplate({
                                  ...editingTemplate,
                                  styleConfig: { ...(editingTemplate.styleConfig || {}), customCss: current + snippet },
                                });
                              }}
                              className="px-2 py-1 bg-slate-950 hover:bg-indigo-900/40 text-indigo-300 text-[10px] font-mono rounded-lg border border-slate-700 cursor-pointer transition"
                            >
                              Header Sub-judul Navy
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const current = editingTemplate.styleConfig?.customCss || '';
                                const snippet = `\n.printable-content table { border-collapse: collapse; border: 1px solid #94a3b8; } .printable-content td, .printable-content th { border: 1px solid #cbd5e1; padding: 8px; }`;
                                setEditingTemplate({
                                  ...editingTemplate,
                                  styleConfig: { ...(editingTemplate.styleConfig || {}), customCss: current + snippet },
                                });
                              }}
                              className="px-2 py-1 bg-slate-950 hover:bg-indigo-900/40 text-indigo-300 text-[10px] font-mono rounded-lg border border-slate-700 cursor-pointer transition"
                            >
                              Tabel Border Formal
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const current = editingTemplate.styleConfig?.customCss || '';
                                const snippet = `\n.printable-content strong { color: #1e3a8a; font-weight: 800; }`;
                                setEditingTemplate({
                                  ...editingTemplate,
                                  styleConfig: { ...(editingTemplate.styleConfig || {}), customCss: current + snippet },
                                });
                              }}
                              className="px-2 py-1 bg-slate-950 hover:bg-indigo-900/40 text-indigo-300 text-[10px] font-mono rounded-lg border border-slate-700 cursor-pointer transition"
                            >
                              Cetak Tebal Navy
                            </button>
                          </div>

                          <textarea
                            rows={6}
                            value={editingTemplate.styleConfig?.customCss || ''}
                            onChange={(e) =>
                              setEditingTemplate({
                                ...editingTemplate,
                                styleConfig: { ...(editingTemplate.styleConfig || {}), customCss: e.target.value },
                              })
                            }
                            placeholder="/* Ketikkan aturan CSS kustom di sini, e.g. .printable-content table { border-color: #1e3a8a; } */"
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-indigo-300 font-mono text-xs focus:outline-none focus:border-indigo-500 leading-relaxed"
                          />
                        </div>

                        {/* Reset Styles Button */}
                        <div className="flex items-center justify-between pt-1 text-xs">
                          <span className="text-slate-400">
                            Gaya aktif: <strong className="text-indigo-300">{editingTemplate.styleConfig?.fontFamily || 'serif'}</strong> | Font: <strong className="text-white">{editingTemplate.styleConfig?.fontSize || '11pt'}</strong> | Line Height: <strong className="text-white">{editingTemplate.styleConfig?.lineHeight || '1.6'}</strong>
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              setEditingTemplate({
                                ...editingTemplate,
                                styleConfig: {
                                  fontFamily: 'serif',
                                  fontSize: '11pt',
                                  lineHeight: '1.6',
                                  paddingTop: '32px',
                                  paddingBottom: '32px',
                                  paddingLeft: '32px',
                                  paddingRight: '32px',
                                  customCss: '',
                                },
                              })
                            }
                            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl transition border border-slate-800 flex items-center gap-1.5 cursor-pointer"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Reset Gaya ke Default</span>
                          </button>
                        </div>
                      </div>
                    )}
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
                    onClick={() =>
                      setVerifyingLetterData({
                        letterNumber: liveLetterNo,
                        candidateName: activeCandidate?.fullName || 'Siswa Target',
                        candidateRegNumber: activeCandidate?.registrationNumber || 'REG-2026',
                        templateTitle: currentTemplate?.title || 'Surat Resmi',
                        issueDate: issueDate,
                        signerName: currentTemplate?.signerName || kopForm.defaultSignerName,
                        signerTitle: currentTemplate?.signerTitle || kopForm.defaultSignerTitle,
                        verificationHash: liveVerifyInfo.hash,
                        verificationUrl: liveVerifyInfo.url,
                      })
                    }
                    className="px-3 py-2.5 bg-emerald-900/60 hover:bg-emerald-800 text-emerald-300 font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer border border-emerald-500/40"
                    title="Uji Scan QR Code Verifikasi Keaslian Surat"
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Uji Verifikasi QR</span>
                  </button>

                  <button
                    onClick={() => window.print()}
                    className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold rounded-xl transition flex items-center gap-2 cursor-pointer shadow-xs border border-slate-700"
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
              {(() => {
                const currentTpl = letterTemplates.find((t) => t.id === selectedTemplateId);
                return (
                  <div
                    className="bg-white text-slate-900 rounded-2xl shadow-2xl border border-slate-200 max-w-4xl mx-auto min-h-[750px] flex flex-col justify-between printable-content"
                    style={getLetterTemplateStyle(currentTpl?.styleConfig)}
                  >
                    {currentTpl?.styleConfig?.customCss && (
                      <style>{currentTpl.styleConfig.customCss}</style>
                    )}
                    {/* Header Kop Surat */}
                <div>
                  <div className="flex items-center gap-4 border-b pb-4 mb-4 kop-surat-container" style={{ borderColor: '#0f172a' }}>
                    <img
                      src={kopForm.logoUrl}
                      alt="Logo Lembaga"
                      className="w-20 h-20 object-contain shrink-0 kop-logo"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=200';
                      }}
                    />
                    <div className="flex-1 text-center font-sans kop-text-area">
                      <h1 className="font-extrabold text-lg sm:text-xl tracking-wide uppercase text-blue-900 kop-title">
                        {kopForm.institutionName}
                      </h1>
                      <p className="font-bold text-xs sm:text-sm text-slate-800 tracking-wider uppercase mt-0.5 kop-subtitle">
                        {kopForm.institutionSubName}
                      </p>
                      <p className="text-[10.5px] text-slate-600 mt-1 font-medium kop-legal">
                        {kopForm.legalLicense}
                      </p>
                      <p className="text-[10px] text-slate-500 mt-0.5 kop-address">
                        {kopForm.address} | Telp: {kopForm.phone} | WA: {kopForm.whatsapp}
                      </p>
                      <p className="text-[10px] text-indigo-900 font-semibold mt-0.5 kop-contact">
                        Website: {kopForm.website} | Email: {kopForm.email}
                      </p>
                    </div>

                    {/* QR Code in Top Kop Header if position is top_kop or both */}
                    {(kopForm.qrPosition === 'top_kop' || kopForm.qrPosition === 'both') && (
                      <div className="shrink-0 hidden sm:block">
                        {renderQrWidget(
                          liveLetterNo,
                          liveVerifyInfo.hash,
                          activeCandidate?.fullName || 'Peserta',
                          65,
                          () =>
                            setVerifyingLetterData({
                              letterNumber: liveLetterNo,
                              candidateName: activeCandidate?.fullName || 'Siswa Target',
                              candidateRegNumber: activeCandidate?.registrationNumber || 'REG-2026',
                              templateTitle: currentTemplate?.title || 'Surat Resmi',
                              issueDate: issueDate,
                              signerName: currentTemplate?.signerName || kopForm.defaultSignerName,
                              signerTitle: currentTemplate?.signerTitle || kopForm.defaultSignerTitle,
                              verificationHash: liveVerifyInfo.hash,
                              verificationUrl: liveVerifyInfo.url,
                            })
                        )}
                      </div>
                    )}
                  </div>

                  <div className="border-b-4 border-double border-slate-900 -mt-3 mb-6 kop-divider" />

                  {/* Letter Header Info */}
                  <div className="font-sans text-xs space-y-4 pt-1">
                    <div className="text-center space-y-1 mb-6">
                      <h2 className="font-extrabold text-sm sm:text-base tracking-wider uppercase text-slate-900 underline underline-offset-4">
                        {currentTemplate?.subject || 'SURAT KETERANGAN RESMI'}
                      </h2>
                      <p className="text-xs text-slate-700 font-semibold font-mono">
                        Nomor: {liveLetterNo}
                      </p>
                    </div>

                    {/* Populated Body Content */}
                    <div
                      className="prose prose-slate max-w-none text-xs leading-relaxed text-slate-800 space-y-3"
                      dangerouslySetInnerHTML={{
                        __html: replacePlaceholders(currentTemplate?.bodyContent || '', activeCandidate, liveLetterNo),
                      }}
                    />
                  </div>
                </div>

                {/* Signatures & Verification Stamp Area */}
                <div className="font-sans pt-8 border-t border-slate-200 mt-8 flex items-end justify-between gap-6">
                  {/* Digital QR Code Verification in Footer if bottom_footer or both */}
                  {(kopForm.qrPosition === 'bottom_footer' || kopForm.qrPosition === 'both') ? (
                    <div>
                      {renderQrWidget(
                        liveLetterNo,
                        liveVerifyInfo.hash,
                        activeCandidate?.fullName || 'Peserta',
                        72,
                        () =>
                          setVerifyingLetterData({
                            letterNumber: liveLetterNo,
                            candidateName: activeCandidate?.fullName || 'Siswa Target',
                            candidateRegNumber: activeCandidate?.registrationNumber || 'REG-2026',
                            templateTitle: currentTemplate?.title || 'Surat Resmi',
                            issueDate: issueDate,
                            signerName: currentTemplate?.signerName || kopForm.defaultSignerName,
                            signerTitle: currentTemplate?.signerTitle || kopForm.defaultSignerTitle,
                            verificationHash: liveVerifyInfo.hash,
                            verificationUrl: liveVerifyInfo.url,
                          })
                      )}
                    </div>
                  ) : (
                    <div />
                  )}

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
            );
          })()}
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
                        <th className="p-3">Status QR Verifikasi</th>
                        <th className="p-3">Tanggal Terbit</th>
                        <th className="p-3 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80">
                      {filteredArchives.map((letter) => {
                        const hash = letter.verificationHash || `PR-HASH-${letter.id.slice(-6).toUpperCase()}-2026`;
                        const url = letter.verificationUrl || `${kopForm.qrVerificationBaseUrl || 'https://prospektus-education.id/verify-letter'}?no=${encodeURIComponent(letter.letterNumber)}`;

                        return (
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
                            <td className="p-3">
                              <span className="px-2 py-1 bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 rounded-lg text-[10px] font-mono font-bold inline-flex items-center gap-1">
                                <QrCode className="w-3 h-3 text-emerald-400" />
                                <span>{hash}</span>
                              </span>
                            </td>
                            <td className="p-3 text-slate-400">{letter.issueDate}</td>
                            <td className="p-3 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() =>
                                    setVerifyingLetterData({
                                      letterNumber: letter.letterNumber,
                                      candidateName: letter.candidateName,
                                      candidateRegNumber: letter.candidateRegNumber,
                                      templateTitle: letter.templateTitle,
                                      issueDate: letter.issueDate,
                                      signerName: letter.signerName,
                                      signerTitle: letter.signerTitle,
                                      verificationHash: hash,
                                      verificationUrl: url,
                                    })
                                  }
                                  className="px-2 py-1 bg-emerald-900/40 hover:bg-emerald-800/60 text-emerald-300 rounded-lg transition flex items-center gap-1 text-[11px] font-bold cursor-pointer border border-emerald-500/30"
                                  title="Uji Scan QR Code Verifikasi"
                                >
                                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                                  <span>Uji QR</span>
                                </button>
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
                        );
                      })}

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

              {(() => {
                const archiveTpl = letterTemplates.find((t) => t.id === selectedArchiveLetter.templateId);
                return (
                  <div
                    className="bg-white text-slate-900 rounded-2xl text-xs space-y-4 border border-slate-200 printable-content"
                    style={getLetterTemplateStyle(archiveTpl?.styleConfig)}
                  >
                    {archiveTpl?.styleConfig?.customCss && (
                      <style>{archiveTpl.styleConfig.customCss}</style>
                    )}
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

                <div className="pt-6 border-t border-slate-200 flex items-end justify-between gap-4">
                  <div>
                    {renderQrWidget(
                      selectedArchiveLetter.letterNumber,
                      selectedArchiveLetter.verificationHash || 'PR-VERIFY-ARCHIVE',
                      selectedArchiveLetter.candidateName,
                      65,
                      () =>
                        setVerifyingLetterData({
                          letterNumber: selectedArchiveLetter.letterNumber,
                          candidateName: selectedArchiveLetter.candidateName,
                          candidateRegNumber: selectedArchiveLetter.candidateRegNumber,
                          templateTitle: selectedArchiveLetter.templateTitle,
                          issueDate: selectedArchiveLetter.issueDate,
                          signerName: selectedArchiveLetter.signerName,
                          signerTitle: selectedArchiveLetter.signerTitle,
                          verificationHash: selectedArchiveLetter.verificationHash || 'PR-VERIFY-ARCHIVE',
                          verificationUrl: selectedArchiveLetter.verificationUrl || `${kopForm.qrVerificationBaseUrl}?no=${encodeURIComponent(selectedArchiveLetter.letterNumber)}`,
                        })
                    )}
                  </div>

                  <div className="text-right text-xs">
                    <p>{kopForm.cityIssued}, {selectedArchiveLetter.issueDate}</p>
                    <p className="font-bold">{selectedArchiveLetter.signerTitle}</p>
                    <p className="mt-8 font-bold underline">{selectedArchiveLetter.signerName}</p>
                  </div>
                </div>
              </div>
            );
          })()}

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      setVerifyingLetterData({
                        letterNumber: selectedArchiveLetter.letterNumber,
                        candidateName: selectedArchiveLetter.candidateName,
                        candidateRegNumber: selectedArchiveLetter.candidateRegNumber,
                        templateTitle: selectedArchiveLetter.templateTitle,
                        issueDate: selectedArchiveLetter.issueDate,
                        signerName: selectedArchiveLetter.signerName,
                        signerTitle: selectedArchiveLetter.signerTitle,
                        verificationHash: selectedArchiveLetter.verificationHash || 'PR-VERIFY-ARCHIVE',
                        verificationUrl: selectedArchiveLetter.verificationUrl || `${kopForm.qrVerificationBaseUrl}?no=${encodeURIComponent(selectedArchiveLetter.letterNumber)}`,
                      })
                    }
                    className="px-3.5 py-2 bg-emerald-900/60 hover:bg-emerald-800 text-emerald-300 text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer border border-emerald-500/40"
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Uji Scan QR Verifikasi</span>
                  </button>

                  <button
                    onClick={() => window.print()}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl flex items-center gap-2 cursor-pointer"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Cetak Surat Ini</span>
                  </button>
                </div>

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

        {/* MODAL SCANNER & VERIFIKASI KEASLIAN DOKUMEN (PUBLIC & ADMIN CERTIFICATE VERIFIER) */}
        {verifyingLetterData && (
          <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-lg flex justify-center items-center p-4">
            <div className="bg-slate-900 border border-slate-700/90 rounded-3xl max-w-xl w-full p-6 space-y-5 shadow-2xl relative overflow-hidden animate-in fade-in zoom-in duration-200">
              {/* Background Decorative Glow */}
              <div className="absolute -right-16 -top-16 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -left-16 -bottom-16 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

              {/* Modal Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-white flex items-center gap-1.5">
                      <span>Verifikasi Keaslian Dokumen Resmi</span>
                    </h3>
                    <p className="text-[11px] text-slate-400 font-mono">
                      Sistem Digital E-Office Prospect Education
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setVerifyingLetterData(null)}
                  className="p-1.5 text-slate-400 hover:text-white bg-slate-800 rounded-full transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Status Banner Verified */}
              <div className="p-4 bg-gradient-to-r from-emerald-950/90 via-emerald-900/60 to-slate-900 border border-emerald-500/50 rounded-2xl flex items-start gap-3 shadow-md">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-extrabold text-xs text-emerald-300 uppercase tracking-wide">
                      DOKUMEN DIVERIFIKASI 100% SAH & TERDAFTAR RESMI
                    </h4>
                    <span className="px-2 py-0.5 bg-emerald-500 text-slate-950 text-[9px] font-black rounded-full uppercase">
                      VALID
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Surat ini tercatat secara elektronik dalam basis data resmi <strong>{kopForm.institutionName}</strong>.
                  </p>
                </div>
              </div>

              {/* Detail Certificate Table */}
              <div className="bg-slate-950/90 rounded-2xl border border-slate-800 p-4 space-y-3 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                  <span className="text-slate-400 font-medium">Nomor Surat Terbit</span>
                  <span className="font-mono font-extrabold text-indigo-300 text-sm">
                    {verifyingLetterData.letterNumber}
                  </span>
                </div>

                <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                  <span className="text-slate-400 font-medium">Nama Siswa / Pemilik</span>
                  <span className="font-bold text-white text-xs">
                    {verifyingLetterData.candidateName}
                  </span>
                </div>

                {verifyingLetterData.candidateRegNumber && (
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                    <span className="text-slate-400 font-medium">No. Registrasi Siswa</span>
                    <span className="font-mono text-slate-300">
                      {verifyingLetterData.candidateRegNumber}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                  <span className="text-slate-400 font-medium">Perihal Dokumen</span>
                  <span className="font-medium text-slate-200">
                    {verifyingLetterData.templateTitle}
                  </span>
                </div>

                <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                  <span className="text-slate-400 font-medium">Tanggal Diterbitkan</span>
                  <span className="text-slate-300">
                    {verifyingLetterData.issueDate}
                  </span>
                </div>

                <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                  <span className="text-slate-400 font-medium">Pejabat Pengesah</span>
                  <div className="text-right">
                    <span className="font-bold text-white block">{verifyingLetterData.signerName}</span>
                    <span className="text-[10px] text-slate-400">{verifyingLetterData.signerTitle}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-slate-400 font-medium">Hash Keamanan Digital</span>
                  <span className="font-mono text-[11px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
                    {verifyingLetterData.verificationHash}
                  </span>
                </div>
              </div>

              {/* Public Link Copy & Actions */}
              <div className="space-y-2 pt-1">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Link Verifikasi Keaslian Dokumen:
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={verifyingLetterData.verificationUrl}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-emerald-300 font-mono text-[10px] select-all focus:outline-none"
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(verifyingLetterData.verificationUrl);
                      setCopiedVerifyLink(true);
                      setTimeout(() => setCopiedVerifyLink(false), 2000);
                    }}
                    className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition flex items-center gap-1 shrink-0 cursor-pointer"
                  >
                    {copiedVerifyLink ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-300" />
                        <span>Tersalin!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Salin Link</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl flex items-center gap-1.5 transition cursor-pointer border border-slate-700"
                >
                  <Printer className="w-4 h-4 text-emerald-400" />
                  <span>Cetak Sertifikat Verifikasi</span>
                </button>

                <button
                  onClick={() => setVerifyingLetterData(null)}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition cursor-pointer"
                >
                  Selesai
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL PRATINJAU TEMPLATE SURAT (PREVIEW WITH DUMMY OR CANDIDATE DATA) */}
        {isPreviewModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
            <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-5xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
              {/* Modal Header */}
              <div className="p-4 sm:p-5 bg-slate-950 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-indigo-900/60 border border-indigo-500/40 text-indigo-300 text-[10px] font-mono font-bold rounded-md">
                      PREVIEW TEMPLATE
                    </span>
                    <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                      <Eye className="w-4 h-4 text-indigo-400" />
                      <span>Pratinjau Hasil Rendering Surat</span>
                    </h3>
                  </div>
                  <p className="text-xs text-slate-400">
                    Melihat hasil automatisasi placeholder dinamis sebelum template disimpan atau diterbitkan.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition flex items-center gap-1.5 border border-slate-700 cursor-pointer"
                    title="Cetak pratinjau surat ini"
                  >
                    <Printer className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="hidden sm:inline">Cetak</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsPreviewModalOpen(false)}
                    className="p-1.5 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition cursor-pointer"
                    title="Tutup Modal Pratinjau"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Modal Controls Bar & Data Switcher */}
              <div className="p-3.5 bg-slate-950/60 border-b border-slate-800 text-xs space-y-3 shrink-0">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="flex items-center gap-2 flex-1">
                    <label className="text-slate-300 font-bold shrink-0 flex items-center gap-1.5">
                      <UserCheck className="w-4 h-4 text-indigo-400" />
                      <span>Pilih Sumber Data Simulasi:</span>
                    </label>
                    <select
                      value={previewCandidateSource}
                      onChange={(e) => setPreviewCandidateSource(e.target.value)}
                      className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-indigo-300 font-bold focus:outline-none focus:border-indigo-500 cursor-pointer flex-1 max-w-md text-xs"
                    >
                      <option value="dummy">
                        Simulasi Data Dummy (Ahmad Rizky Pratama - REG-2026-JP089)
                      </option>
                      <optgroup label="Siswa Terdaftar di Sistem">
                        {candidates.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.fullName} ({c.registrationNumber || c.selectedProgram})
                          </option>
                        ))}
                      </optgroup>
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const rendered = replacePlaceholders(
                          activePreviewTemplate?.bodyContent || '',
                          activePreviewCandidate
                        );
                        navigator.clipboard.writeText(rendered);
                        setCopiedPreviewHtml(true);
                        setTimeout(() => setCopiedPreviewHtml(false), 2000);
                      }}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition flex items-center gap-1.5 border border-slate-700 cursor-pointer"
                    >
                      {copiedPreviewHtml ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Teks Rendered Tersalin</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-indigo-400" />
                          <span>Salin Teks Rendered</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Dynamic Placeholder Values Summary Cards */}
                <div className="p-2.5 bg-slate-900/90 rounded-xl border border-slate-800 text-[11px] space-y-1.5">
                  <div className="flex items-center justify-between text-slate-400 font-bold text-[10px] uppercase tracking-wider">
                    <span className="flex items-center gap-1 text-indigo-400">
                      <Sparkles className="w-3 h-3" />
                      <span>Nilai Dynamic Placeholder Terisi:</span>
                    </span>
                    <span className="text-slate-500 font-normal">
                      {previewCandidateSource === 'dummy' ? 'Menggunakan Profil Dummy Kualifikasi Internasional' : 'Menggunakan Profil Real Siswa'}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 pt-0.5">
                    <div className="p-1.5 bg-slate-950 rounded-lg border border-slate-800">
                      <span className="text-[9.5px] text-slate-500 font-mono block">&#123;NAMA_SISWA&#125;</span>
                      <span className="font-bold text-white truncate block">{activePreviewCandidate.fullName}</span>
                    </div>
                    <div className="p-1.5 bg-slate-950 rounded-lg border border-slate-800">
                      <span className="text-[9.5px] text-slate-500 font-mono block">&#123;NO_PASPOR&#125;</span>
                      <span className="font-bold text-indigo-300 font-mono truncate block">
                        {(activePreviewCandidate as any).passportNumber || 'C8294017'}
                      </span>
                    </div>
                    <div className="p-1.5 bg-slate-950 rounded-lg border border-slate-800">
                      <span className="text-[9.5px] text-slate-500 font-mono block">&#123;TANGGAL_KEBERANGKATAN&#125;</span>
                      <span className="font-bold text-emerald-400 truncate block">
                        {(activePreviewCandidate as any).departureDate || '15 Sept 2026'}
                      </span>
                    </div>
                    <div className="p-1.5 bg-slate-950 rounded-lg border border-slate-800">
                      <span className="text-[9.5px] text-slate-500 font-mono block">&#123;UNIVERSITAS_TUJUAN&#125;</span>
                      <span className="font-bold text-amber-300 truncate block">
                        {(activePreviewCandidate as any).targetUniversity || 'NTUST Taiwan'}
                      </span>
                    </div>
                    <div className="p-1.5 bg-slate-950 rounded-lg border border-slate-800">
                      <span className="text-[9.5px] text-slate-500 font-mono block">&#123;NEGARA_TUJUAN&#125;</span>
                      <span className="font-bold text-cyan-300 truncate block">
                        {(activePreviewCandidate as any).destinationCountry || 'Taiwan (R.O.C)'}
                      </span>
                    </div>
                    <div className="p-1.5 bg-slate-950 rounded-lg border border-slate-800">
                      <span className="text-[9.5px] text-slate-500 font-mono block">&#123;NOMOR_REGISTRASI&#125;</span>
                      <span className="font-bold text-slate-300 font-mono truncate block">
                        {activePreviewCandidate.registrationNumber || 'REG-2026-JP089'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Document Body Scrollable Canvas */}
              <div className="p-4 sm:p-8 overflow-y-auto flex-1 bg-slate-950/40">
                <div
                  className="bg-white text-slate-900 rounded-2xl shadow-xl border border-slate-200 max-w-4xl mx-auto min-h-[680px] flex flex-col justify-between printable-content"
                  style={getLetterTemplateStyle(activePreviewTemplate?.styleConfig)}
                >
                  {activePreviewTemplate?.styleConfig?.customCss && (
                    <style>{activePreviewTemplate.styleConfig.customCss}</style>
                  )}
                  {/* Header Kop Surat */}
                  <div>
                    <div className="flex items-center gap-4 border-b pb-4 mb-4 kop-surat-container" style={{ borderColor: '#0f172a' }}>
                      <img
                        src={kopForm.logoUrl}
                        alt="Logo Lembaga"
                        className="w-20 h-20 object-contain shrink-0 kop-logo"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=200';
                        }}
                      />
                      <div className="flex-1 text-center font-sans kop-text-area">
                        <h1 className="font-extrabold text-lg sm:text-xl tracking-wide uppercase text-blue-900 kop-title">
                          {kopForm.institutionName}
                        </h1>
                        <p className="font-bold text-xs sm:text-sm text-slate-800 tracking-wider uppercase mt-0.5 kop-subtitle">
                          {kopForm.institutionSubName}
                        </p>
                        <p className="text-[10.5px] text-slate-600 mt-1 font-medium kop-legal">
                          {kopForm.legalLicense}
                        </p>
                        <p className="text-[10px] text-slate-500 mt-0.5 kop-address">
                          {kopForm.address} | Telp: {kopForm.phone} | WA: {kopForm.whatsapp}
                        </p>
                        <p className="text-[10px] text-indigo-900 font-semibold mt-0.5 kop-contact">
                          Website: {kopForm.website} | Email: {kopForm.email}
                        </p>
                      </div>

                      {/* Top Header QR Code if enabled */}
                      {(kopForm.qrPosition === 'top_kop' || kopForm.qrPosition === 'both') && (
                        <div className="shrink-0 hidden sm:block">
                          {renderQrWidget(
                            `101/PROSPECT-JBR/${activePreviewTemplate?.code || 'SURAT'}/${new Date().getMonth() + 1}/${new Date().getFullYear()}`,
                            'SIM-HASH-882910',
                            activePreviewCandidate.fullName,
                            65
                          )}
                        </div>
                      )}
                    </div>

                    <div className="border-b-4 border-double border-slate-900 -mt-3 mb-6 kop-divider" />

                    {/* Letter Header Info */}
                    <div className="font-sans text-xs space-y-4 pt-1">
                      <div className="text-center space-y-1 mb-6">
                        <h2 className="font-extrabold text-sm sm:text-base tracking-wider uppercase text-slate-900 underline underline-offset-4">
                          {activePreviewTemplate?.subject || 'SURAT KETERANGAN RESMI'}
                        </h2>
                        <p className="text-xs text-slate-700 font-semibold font-mono">
                          Nomor: 101/PROSPECT-JBR/{activePreviewTemplate?.code || 'SURAT'}/{new Date().getMonth() + 1}/{new Date().getFullYear()}
                        </p>
                      </div>

                      {/* Populated Body Content */}
                      <div
                        className="prose prose-slate max-w-none text-xs leading-relaxed text-slate-800 space-y-3"
                        dangerouslySetInnerHTML={{
                          __html: replacePlaceholders(
                            activePreviewTemplate?.bodyContent || '',
                            activePreviewCandidate
                          ),
                        }}
                      />
                    </div>
                  </div>

                  {/* Signatures & Verification Area */}
                  <div className="font-sans pt-8 border-t border-slate-200 mt-8 flex items-end justify-between gap-6">
                    {(kopForm.qrPosition === 'bottom_footer' || kopForm.qrPosition === 'both') ? (
                      <div>
                        {renderQrWidget(
                          `101/PROSPECT-JBR/${activePreviewTemplate?.code || 'SURAT'}/${new Date().getMonth() + 1}/${new Date().getFullYear()}`,
                          'SIM-HASH-882910',
                          activePreviewCandidate.fullName,
                          72
                        )}
                      </div>
                    ) : (
                      <div />
                    )}

                    {/* Official Signature Box */}
                    <div className="text-center w-64 space-y-1">
                      <p className="text-xs text-slate-700">
                        {kopForm.cityIssued}, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                      <p className="text-xs font-bold text-slate-900">
                        {activePreviewTemplate?.signerTitle || kopForm.defaultSignerTitle}
                      </p>

                      <div className="h-20 my-1 flex items-center justify-center relative">
                        <img
                          src="https://api.dicebear.com/7.x/initials/svg?seed=RE"
                          alt="Signature"
                          className="h-16 opacity-80"
                        />
                        <div className="absolute right-2 bottom-0 transform rotate-[-12deg] pointer-events-none opacity-85">
                          <div className="border-2 border-dashed border-red-700/60 p-1 rounded-full text-[9px] font-bold text-red-800 uppercase tracking-tighter flex items-center justify-center w-16 h-16 bg-red-50/30">
                            STEMPEL RESMI
                          </div>
                        </div>
                      </div>

                      <p className="font-bold text-xs underline text-slate-900">
                        {activePreviewTemplate?.signerName || kopForm.defaultSignerName}
                      </p>
                      {activePreviewTemplate?.signerNip && (
                        <p className="text-[10px] text-slate-600 font-mono">
                          {activePreviewTemplate.signerNip}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-3 shrink-0 text-xs">
                <span className="text-slate-400 font-medium hidden sm:inline">
                  Template Aktif: <strong className="text-white">{activePreviewTemplate?.title}</strong>
                </span>

                <div className="flex items-center gap-2 ml-auto">
                  {editingTemplate && (
                    <button
                      type="button"
                      onClick={() => {
                        handleSaveEditingTemplate();
                        setIsPreviewModalOpen(false);
                      }}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>Simpan Template Ini</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setIsPreviewModalOpen(false)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl transition cursor-pointer border border-slate-700"
                  >
                    Tutup Pratinjau
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VERSION HISTORY MODAL */}
        {isVersionHistoryOpen && editingTemplate && (
          <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex justify-center items-center p-3 sm:p-5 overflow-y-auto animate-fade-in">
            <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
              {/* Modal Header */}
              <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between gap-4 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-amber-500/20 text-amber-400 rounded-2xl border border-amber-500/30">
                    <History className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-white">
                        Riwayat Versi Template: <span className="text-amber-400">{editingTemplate.title}</span>
                      </h3>
                      <span className="bg-amber-950 text-amber-300 border border-amber-500/40 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full uppercase">
                        {editingTemplate.code}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">
                      Setiap perubahan disimpan sebagai snapshot versi berseri. Pilih versi mana saja untuk memulihkan (restore) teks dan tata letak jika terjadi kesalahan pengeditan.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setIsVersionHistoryOpen(false);
                    setSelectedVersionForPreview(null);
                  }}
                  className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-full transition cursor-pointer"
                  title="Tutup Riwayat"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body: Grid of History List & Preview */}
              <div className="p-6 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left List of Versions */}
                <div className="lg:col-span-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-xs text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-amber-400" />
                      <span>Daftar Snapshot Versi ({editingTemplate.versionHistory?.length || 0})</span>
                    </h4>
                  </div>

                  {(!editingTemplate.versionHistory || editingTemplate.versionHistory.length === 0) ? (
                    <div className="p-8 text-center bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
                      <History className="w-8 h-8 text-slate-600 mx-auto" />
                      <p className="text-xs text-slate-400">
                        Belum ada riwayat revisi tersimpan untuk template ini. Klik <strong className="text-indigo-300">"Simpan Template"</strong> pada editor untuk mengunci snapshot versi pertama.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
                      {editingTemplate.versionHistory.map((ver, idx) => {
                        const isLatest = idx === 0;
                        const isSelected = selectedVersionForPreview?.id === ver.id;

                        return (
                          <div
                            key={ver.id}
                            onClick={() => setSelectedVersionForPreview(ver)}
                            className={`p-3.5 rounded-2xl border text-xs cursor-pointer transition space-y-2 ${
                              isSelected
                                ? 'bg-amber-950/40 border-amber-500 text-white shadow-md'
                                : isLatest
                                ? 'bg-slate-950 border-emerald-500/50 text-slate-200'
                                : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                                  isLatest ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-slate-800 text-amber-300'
                                }`}>
                                  Versi {ver.versionNumber}
                                </span>
                                {isLatest && (
                                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-800">
                                    Terbaru (Aktif)
                                  </span>
                                )}
                              </div>
                              <span className="text-[10.5px] text-slate-400 font-mono">{ver.savedAt}</span>
                            </div>

                            <div className="text-[11px] text-slate-300 line-clamp-2 italic bg-slate-900/60 p-2 rounded-xl border border-slate-800/80">
                              "{ver.changeNote || 'Tanpa catatan perubahan'}"
                            </div>

                            <div className="flex items-center justify-between pt-1 border-t border-slate-800/60">
                              <span className="text-[10px] text-slate-500">
                                Oleh: {ver.savedBy || 'Admin'} • {ver.bodyContent.length} Karakter
                              </span>
                              <div className="flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedVersionForPreview(ver);
                                  }}
                                  className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-[10.5px] font-bold transition flex items-center gap-1"
                                >
                                  <Eye className="w-3 h-3 text-amber-400" />
                                  <span>Inspeksi</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleRestoreVersion(ver);
                                  }}
                                  className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold rounded-lg text-[10.5px] transition flex items-center gap-1 shadow-xs"
                                >
                                  <RotateCcw className="w-3 h-3" />
                                  <span>Pulihkan</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Right Preview Panel for Selected Version */}
                <div className="lg:col-span-7 bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4 text-xs">
                  {selectedVersionForPreview ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-1 bg-amber-500/20 text-amber-300 font-mono font-bold text-xs rounded-lg border border-amber-500/40">
                            Inspeksi Versi {selectedVersionForPreview.versionNumber}
                          </span>
                          <span className="text-slate-400 text-xs">Dibuat: {selectedVersionForPreview.savedAt}</span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRestoreVersion(selectedVersionForPreview)}
                          className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-md"
                        >
                          <RotateCcw className="w-4 h-4" />
                          <span>Pulihkan Template ke Versi Ini</span>
                        </button>
                      </div>

                      <div className="space-y-2">
                        <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                          <div>
                            <span className="text-slate-400 block">Perihal Surat:</span>
                            <strong className="text-white">{selectedVersionForPreview.subject}</strong>
                          </div>
                          <div>
                            <span className="text-slate-400 block">Format Nomor:</span>
                            <strong className="text-amber-300 font-mono">{selectedVersionForPreview.numberFormat}</strong>
                          </div>
                        </div>

                        <div>
                          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                            Catatan Perubahan Versi Ini:
                          </span>
                          <p className="text-xs text-slate-200 bg-slate-900 p-2.5 rounded-xl border border-slate-800 italic">
                            "{selectedVersionForPreview.changeNote || 'Tidak ada catatan khusus yang ditulis.'}"
                          </p>
                        </div>

                        <div>
                          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                            Pratinjau Teks & Paragraf Versi {selectedVersionForPreview.versionNumber}:
                          </span>
                          <div
                            className="bg-white text-slate-900 p-4 rounded-xl max-h-72 overflow-y-auto border border-slate-300 font-serif text-[11px] leading-relaxed shadow-inner"
                            dangerouslySetInnerHTML={{ __html: selectedVersionForPreview.bodyContent }}
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-center p-6 space-y-3">
                      <Eye className="w-10 h-10 text-slate-700" />
                      <p className="text-slate-400 text-xs">
                        Klik salah satu snapshot versi di sebelah kiri untuk menginspeksi teks, perihal, dan format surat sebelum memulihkannya.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-end gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setIsVersionHistoryOpen(false);
                    setSelectedVersionForPreview(null);
                  }}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl transition cursor-pointer"
                >
                  Tutup Riwayat
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
