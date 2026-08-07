import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PortfolioCertificate, StudentSkill, StudentPortfolio } from '../../types';
import {
  Award,
  Sparkles,
  Plus,
  Trash2,
  ExternalLink,
  Share2,
  Copy,
  CheckCircle2,
  Building2,
  GraduationCap,
  Briefcase,
  FileText,
  UserCheck,
  Globe2,
  Eye,
  X,
  Edit3,
  ShieldCheck,
  Code,
  Languages,
  Wrench,
  HeartHandshake,
  Check,
  Download,
  QrCode,
  Calendar,
} from 'lucide-react';

export const PersonalPortfolio: React.FC = () => {
  const {
    currentCandidate,
    getPortfolioByCandidateId,
    updatePortfolioBio,
    addPortfolioCertificate,
    deletePortfolioCertificate,
    addPortfolioSkill,
    deletePortfolioSkill,
    t,
  } = useApp();

  const myCandidateId = currentCandidate?.id || 'CAND-001';
  const myCandidateName = currentCandidate?.fullName || 'Ahmad Subagyo';

  const portfolio = getPortfolioByCandidateId(myCandidateId) || {
    candidateId: myCandidateId,
    candidateName: myCandidateName,
    bioSummary:
      'Peserta aktif Program Beasiswa Taiwan IFP 1+4 Universitas National Formosa (NFU). Memiliki disiplin tinggi, kompetensi bahasa Mandarin dasar-menengah (TOCFL A2), serta keahlian bidang Pemesinan Teknik & Pemrograman CNC.',
    careerGoals:
      'Menyelesaikan pendidikan Sarjana Teknik Elektro / Industri di Taiwan dan berkarir sebagai Engineer Profesional di perusahaan manufaktur multinasional.',
    skills: [],
    certificates: [],
    shareCode: `PORTFOLIO-${myCandidateId}-2026`,
    isPublic: true,
    updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
  };

  // Modals & UI States
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bioInput, setBioInput] = useState(portfolio.bioSummary);
  const [goalsInput, setGoalsInput] = useState(portfolio.careerGoals);

  const [showAddSkillModal, setShowAddSkillModal] = useState(false);
  const [showAddCertModal, setShowAddCertModal] = useState(false);
  const [showPartnerPreviewModal, setShowPartnerPreviewModal] = useState(false);
  const [inspectCert, setInspectCert] = useState<PortfolioCertificate | null>(null);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Skill Form State
  const [skillName, setSkillName] = useState('');
  const [skillCategory, setSkillCategory] = useState<StudentSkill['category']>('Bahasa');
  const [skillProficiency, setSkillProficiency] = useState<StudentSkill['proficiency']>('Menengah');
  const [skillCertTitle, setSkillCertTitle] = useState('');

  // Cert Form State
  const [certTitle, setCertTitle] = useState('');
  const [certIssuer, setCertIssuer] = useState('');
  const [certIssueDate, setCertIssueDate] = useState(new Date().toISOString().split('T')[0]);
  const [certCategory, setCertCategory] = useState<PortfolioCertificate['category']>('Sertifikat LPK');
  const [certCredentialUrl, setCertCredentialUrl] = useState('');

  // Filtering
  const [activeSkillCategory, setActiveSkillCategory] = useState<string>('all');
  const [activeCertCategory, setActiveCertCategory] = useState<string>('all');

  const handleSaveBio = (e: React.FormEvent) => {
    e.preventDefault();
    updatePortfolioBio(myCandidateId, bioInput, goalsInput);
    setIsEditingBio(false);
    triggerToast('Profil ringkasan bio & target karir berhasil diperbarui!');
  };

  const handleAddSkillSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!skillName.trim()) return;

    addPortfolioSkill(myCandidateId, {
      name: skillName,
      category: skillCategory,
      proficiency: skillProficiency,
      certificateTitle: skillCertTitle || undefined,
    });

    setSkillName('');
    setSkillCertTitle('');
    setShowAddSkillModal(false);
    triggerToast('Keahlian baru berhasil ditambahkan ke portofolio digital!');
  };

  const handleAddCertSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!certTitle.trim() || !certIssuer.trim()) return;

    addPortfolioCertificate(myCandidateId, {
      title: certTitle,
      issuer: certIssuer,
      issueDate: certIssueDate,
      category: certCategory,
      credentialUrl: certCredentialUrl || undefined,
      fileUrl: '#cert-file-uploaded',
      verifiedStatus: 'self_uploaded',
    });

    setCertTitle('');
    setCertIssuer('');
    setCertCredentialUrl('');
    setShowAddCertModal(false);
    triggerToast('Sertifikat digital berhasil diunggah ke portofolio!');
  };

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleCopyShareLink = () => {
    const link = `${window.location.origin}/portfolio/${portfolio.shareCode}`;
    navigator.clipboard.writeText(link);
    triggerToast('Link Portofolio Mitra berhasil disalin ke clipboard!');
  };

  const getCategoryIcon = (category: StudentSkill['category']) => {
    switch (category) {
      case 'Bahasa':
        return <Languages className="w-4 h-4 text-sky-500" />;
      case 'Teknis & Vokasi':
        return <Wrench className="w-4 h-4 text-amber-500" />;
      case 'Soft Skills':
        return <HeartHandshake className="w-4 h-4 text-emerald-500" />;
      case 'Sertifikasi':
        return <ShieldCheck className="w-4 h-4 text-purple-500" />;
    }
  };

  const filteredSkills = portfolio.skills.filter(
    (s) => activeSkillCategory === 'all' || s.category === activeSkillCategory
  );

  const filteredCerts = portfolio.certificates.filter(
    (c) => activeCertCategory === 'all' || c.category === activeCertCategory
  );

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white border border-emerald-500/50 p-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-5 duration-300">
          <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-white">Portofolio Profesional</p>
            <p className="text-[11px] text-slate-300">{toastMessage}</p>
          </div>
        </div>
      )}

      {/* Header Banner & Share Actions */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-md">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 px-3.5 py-1 rounded-full text-xs font-bold">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>{t('Portofolio Profesional & Sertifikat Digital', 'Personal Portfolio & Digital Certificates')}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black font-serif text-white tracking-tight">
              Portofolio Kompetensi Siswa
            </h2>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Tampilkan sertifikat bahasa, kompetensi teknik/vokasi, serta pencapaian prestasi Anda secara terverifikasi. Profil ini siap dibagikan kepada universitas mitra di Taiwan dan perusahaan penerima di Jepang.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
              <span className="bg-slate-800/80 text-slate-300 px-3 py-1 rounded-xl font-mono text-[11px] border border-slate-700">
                Kode Berbagi: <strong className="text-amber-400">{portfolio.shareCode}</strong>
              </span>
              <span className="text-slate-400 text-[11px]">
                Terakhir Diperbarui: {portfolio.updatedAt}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0">
            <button
              onClick={() => setShowPartnerPreviewModal(true)}
              className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs px-4 py-3 rounded-2xl transition border border-slate-700 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Eye className="w-4 h-4 text-sky-400" />
              <span>Tampilan Mitra (Preview)</span>
            </button>

            <button
              onClick={handleCopyShareLink}
              className="w-full sm:w-auto bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs px-5 py-3 rounded-2xl transition shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span>Bagikan Link Portofolio</span>
            </button>
          </div>
        </div>
      </div>

      {/* Section 1: Bio & Career Objective */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-2xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-50 text-indigo-800 rounded-xl">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm font-serif">
                Profil & Ringkasan Karir Internasional
              </h3>
              <p className="text-[11px] text-slate-500">
                Informasi singkat yang dibaca oleh komite seleksi beasiswa & HRD universitas / perusahaan partner
              </p>
            </div>
          </div>

          {!isEditingBio && (
            <button
              onClick={() => setIsEditingBio(true)}
              className="text-xs font-bold text-indigo-900 bg-indigo-50 hover:bg-indigo-100 px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Profil</span>
            </button>
          )}
        </div>

        {isEditingBio ? (
          <form onSubmit={handleSaveBio} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Ringkasan Biografi & Latar Belakang *</label>
              <textarea
                required
                rows={3}
                value={bioInput}
                onChange={(e) => setBioInput(e.target.value)}
                className="w-full border border-slate-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-indigo-800"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Target Karir & Studi Lanjutan *</label>
              <textarea
                required
                rows={2}
                value={goalsInput}
                onChange={(e) => setGoalsInput(e.target.value)}
                className="w-full border border-slate-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-indigo-800"
              />
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsEditingBio(false)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 py-2 rounded-xl transition cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                className="bg-indigo-900 hover:bg-indigo-950 text-white font-bold px-5 py-2 rounded-xl transition shadow-xs cursor-pointer"
              >
                Simpan Perubahan
              </button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1.5">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Ringkasan Biografi</span>
              <p className="text-slate-800 leading-relaxed font-sans">{portfolio.bioSummary}</p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1.5">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Target Karir & Studi Lanjutan</span>
              <p className="text-slate-800 leading-relaxed font-sans">{portfolio.careerGoals}</p>
            </div>
          </div>
        )}
      </div>

      {/* Section 2: Professional Skills & Competencies */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-50 text-amber-800 rounded-xl">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm font-serif">
                Keahlian & Kompetensi Terverifikasi
              </h3>
              <p className="text-[11px] text-slate-500">
                Keahlian bahasa, teknis vokasi, dan soft skills yang dikuasai
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowAddSkillModal(true)}
            className="text-xs font-bold text-slate-900 bg-amber-400 hover:bg-amber-300 px-3.5 py-2 rounded-xl transition shadow-xs flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Keahlian</span>
          </button>
        </div>

        {/* Skill Category Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {['all', 'Bahasa', 'Teknis & Vokasi', 'Soft Skills', 'Sertifikasi'].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveSkillCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                activeSkillCategory === cat
                  ? 'bg-slate-900 text-amber-400 shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat === 'all' ? 'Semua Kategori' : cat}
            </button>
          ))}
        </div>

        {/* Skill Cards Grid */}
        {filteredSkills.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            Belum ada keahlian pada kategori ini. Klik "Tambah Keahlian" untuk mengisi.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredSkills.map((sk) => (
              <div
                key={sk.id}
                className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2 hover:border-indigo-300 transition relative group"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-white rounded-lg shadow-2xs">
                      {getCategoryIcon(sk.category)}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs">{sk.name}</h4>
                      <span className="text-[10px] text-slate-500 block">{sk.category}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => deletePortfolioSkill(myCandidateId, sk.id)}
                    title="Hapus Keahlian"
                    className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-600 p-1 transition cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-200/60">
                  <span className="text-slate-500 font-medium">Tingkat Kemampuan:</span>
                  <span className="font-bold text-indigo-900 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                    {sk.proficiency}
                  </span>
                </div>

                {sk.certificateTitle && (
                  <p className="text-[10px] text-slate-500 italic truncate pt-0.5">
                    <strong>Bukti:</strong> {sk.certificateTitle}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Section 3: Digital Certificates Showcase */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-50 text-emerald-800 rounded-xl">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm font-serif">
                Koleksi Sertifikat Digital & Penghargaan
              </h3>
              <p className="text-[11px] text-slate-500">
                Unggah dan kelola sertifikat resmi bahasa, BNSP, pelatihan LPK, dan kejuaraan
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowAddCertModal(true)}
            className="text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 px-3.5 py-2 rounded-xl transition shadow-xs flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Unggah Sertifikat Baru</span>
          </button>
        </div>

        {/* Cert Category Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {['all', 'Bahasa', 'Vokasi & Keahlian', 'Sertifikat LPK', 'Prestasi & Penghargaan'].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCertCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                activeCertCategory === cat
                  ? 'bg-emerald-800 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat === 'all' ? 'Semua Sertifikat' : cat}
            </button>
          ))}
        </div>

        {/* Cert Grid */}
        {filteredCerts.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            Belum ada sertifikat digital pada kategori ini.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCerts.map((cert) => (
              <div
                key={cert.id}
                className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3 hover:border-emerald-300 transition shadow-xs flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                      {cert.category}
                    </span>

                    <button
                      onClick={() => deletePortfolioCertificate(myCandidateId, cert.id)}
                      title="Hapus Sertifikat"
                      className="text-slate-400 hover:text-red-600 p-1 transition cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <h4 className="font-bold text-slate-900 text-xs font-serif line-clamp-2">
                    {cert.title}
                  </h4>

                  <div className="space-y-1 text-[11px] text-slate-600">
                    <p>
                      <strong className="text-slate-700">Penerbit:</strong> {cert.issuer}
                    </p>
                    <p className="flex items-center gap-1 text-[10px] font-mono text-slate-400">
                      <Calendar className="w-3 h-3" />
                      <span>Tanggal Terbit: {cert.issueDate}</span>
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Terverifikasi Sah</span>
                  </span>

                  <button
                    onClick={() => setInspectCert(cert)}
                    className="text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl transition flex items-center gap-1 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Lihat Draf</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal 1: Add New Skill */}
      {showAddSkillModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => setShowAddSkillModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 bg-slate-100 rounded-full cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="p-3 bg-amber-100 text-amber-900 rounded-2xl">
                <Wrench className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base font-serif">
                  Tambah Keahlian Baru
                </h3>
                <p className="text-xs text-slate-500">
                  Tambahkan kompetensi bahasa, keahlian teknis, atau soft skills
                </p>
              </div>
            </div>

            <form onSubmit={handleAddSkillSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Nama Keahlian / Kompetensi *</label>
                <input
                  type="text"
                  required
                  value={skillName}
                  onChange={(e) => setSkillName(e.target.value)}
                  placeholder="Contoh: Bahasa Mandarin TOCFL A2 / Pemrograman CNC / Welder SMAW..."
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Kategori *</label>
                  <select
                    value={skillCategory}
                    onChange={(e) => setSkillCategory(e.target.value as any)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 font-bold text-slate-800 outline-none cursor-pointer"
                  >
                    <option value="Bahasa">Bahasa</option>
                    <option value="Teknis & Vokasi">Teknis & Vokasi</option>
                    <option value="Soft Skills">Soft Skills</option>
                    <option value="Sertifikasi">Sertifikasi</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Tingkat Kemampuan *</label>
                  <select
                    value={skillProficiency}
                    onChange={(e) => setSkillProficiency(e.target.value as any)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 font-bold text-slate-800 outline-none cursor-pointer"
                  >
                    <option value="Pemula">Pemula</option>
                    <option value="Menengah">Menengah</option>
                    <option value="Mahir">Mahir</option>
                    <option value="Ahli">Ahli</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Nama Sertifikat Pendukung (Opsional)</label>
                <input
                  type="text"
                  value={skillCertTitle}
                  onChange={(e) => setSkillCertTitle(e.target.value)}
                  placeholder="Contoh: Sertifikat Evaluasi Mandarin LPK Prospect..."
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddSkillModal(false)}
                  className="w-1/2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="w-1/2 bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold py-3 rounded-xl transition shadow-md cursor-pointer"
                >
                  Simpan Keahlian
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Add New Digital Certificate */}
      {showAddCertModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => setShowAddCertModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 bg-slate-100 rounded-full cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="p-3 bg-emerald-100 text-emerald-800 rounded-2xl">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base font-serif">
                  Unggah Sertifikat Digital Baru
                </h3>
                <p className="text-xs text-slate-500">
                  Tambahkan bukti sertifikasi resmi untuk dipamerkan ke mitra kampus/perusahaan
                </p>
              </div>
            </div>

            <form onSubmit={handleAddCertSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Judul Sertifikat *</label>
                <input
                  type="text"
                  required
                  value={certTitle}
                  onChange={(e) => setCertTitle(e.target.value)}
                  placeholder="Contoh: Sertifikat Kelulusan Mandarin Level A2 / Sertifikat Keahlian BNSP..."
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Lembaga Penerbit *</label>
                  <input
                    type="text"
                    required
                    value={certIssuer}
                    onChange={(e) => setCertIssuer(e.target.value)}
                    placeholder="Contoh: LPK Prospect / BNSP RI / Dinas Pendidikan..."
                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Kategori Sertifikat *</label>
                  <select
                    value={certCategory}
                    onChange={(e) => setCertCategory(e.target.value as any)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 font-bold text-slate-800 outline-none cursor-pointer"
                  >
                    <option value="Sertifikat LPK">Sertifikat LPK</option>
                    <option value="Bahasa">Bahasa</option>
                    <option value="Vokasi & Keahlian">Vokasi & Keahlian</option>
                    <option value="Prestasi & Penghargaan">Prestasi & Penghargaan</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Tanggal Terbit *</label>
                  <input
                    type="date"
                    required
                    value={certIssueDate}
                    onChange={(e) => setCertIssueDate(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Link Verifikasi (Opsional)</label>
                  <input
                    type="text"
                    value={certCredentialUrl}
                    onChange={(e) => setCertCredentialUrl(e.target.value)}
                    placeholder="https://credential-check.com/id..."
                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>
              </div>

              {/* Simulated File Upload Drag Area */}
              <div className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-2xl p-4 text-center space-y-1 transition cursor-pointer bg-slate-50">
                <Download className="w-6 h-6 text-emerald-600 mx-auto" />
                <p className="font-bold text-slate-800">Unggah File Sertifikat (PDF / JPG / PNG)</p>
                <p className="text-[10px] text-slate-400">Ukuran maksimal 5MB (Otomatis terkonversi ke URL Aman LPK)</p>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddCertModal(false)}
                  className="w-1/2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="w-1/2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3 rounded-xl transition shadow-md cursor-pointer"
                >
                  Unggah Sertifikat
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 3: Partner View Preview */}
      {showPartnerPreviewModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 relative my-8">
            <button
              onClick={() => setShowPartnerPreviewModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 bg-slate-100 rounded-full cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Partner View Header */}
            <div className="bg-slate-900 text-white p-6 rounded-2xl space-y-3">
              <div className="flex items-center justify-between text-xs text-amber-400 font-mono">
                <span>PORTAL REKRUTMEN MITRA UNIVERSITAS & PERUSAHAAN</span>
                <span className="bg-amber-400/20 px-2.5 py-0.5 rounded-full border border-amber-400/30">
                  VERIFIED CANDIDATE
                </span>
              </div>

              <div className="flex items-center gap-4 pt-1">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-indigo-600 text-white font-black font-serif text-2xl flex items-center justify-center shadow-md">
                  {portfolio.candidateName.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg font-serif">{portfolio.candidateName}</h3>
                  <p className="text-xs text-slate-300">
                    Kandidat Resmi LPK Prospect Education Jember | ID: {portfolio.candidateId}
                  </p>
                </div>
              </div>
            </div>

            {/* Content Details */}
            <div className="space-y-4 text-xs">
              <div className="space-y-1">
                <h4 className="font-bold text-slate-900 uppercase font-serif tracking-wider text-[11px]">
                  1. Ringkasan Biografi & Tujuan Karir
                </h4>
                <p className="p-3 bg-slate-50 rounded-xl text-slate-700 leading-relaxed">
                  {portfolio.bioSummary}
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 uppercase font-serif tracking-wider text-[11px]">
                  2. Kompetensi & Keahlian Utama
                </h4>
                <div className="flex flex-wrap gap-2">
                  {portfolio.skills.map((s) => (
                    <span
                      key={s.id}
                      className="bg-indigo-50 border border-indigo-200 text-indigo-900 font-bold px-3 py-1.5 rounded-xl text-[11px]"
                    >
                      {s.name} ({s.proficiency})
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 uppercase font-serif tracking-wider text-[11px]">
                  3. Daftar Sertifikat Resmi Terlampir
                </h4>
                <div className="space-y-1.5">
                  {portfolio.certificates.map((c) => (
                    <div
                      key={c.id}
                      className="p-3 bg-emerald-50/50 border border-emerald-200 rounded-xl flex items-center justify-between"
                    >
                      <div>
                        <p className="font-bold text-slate-900">{c.title}</p>
                        <p className="text-[10px] text-slate-500">Penerbit: {c.issuer} ({c.issueDate})</p>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                        Terverifikasi
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between text-xs border-t border-slate-100">
              <span className="text-slate-500 flex items-center gap-1 font-mono text-[11px]">
                <QrCode className="w-4 h-4 text-indigo-600" />
                <span>Verifikasi Berkas Sah LPK Prospect Jember</span>
              </span>

              <button
                onClick={() => setShowPartnerPreviewModal(false)}
                className="bg-slate-900 text-white font-bold px-5 py-2.5 rounded-xl hover:bg-slate-800 transition cursor-pointer"
              >
                Tutup Pratinjau
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Inspect Single Cert Modal */}
      {inspectCert && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => setInspectCert(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 bg-slate-100 rounded-full cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2">
              <Award className="w-10 h-10 text-emerald-700 mx-auto" />
              <h4 className="font-bold text-slate-900 text-sm font-serif">{inspectCert.title}</h4>
              <p className="text-xs text-slate-600">Diterbitkan oleh {inspectCert.issuer}</p>
            </div>

            <div className="text-xs space-y-1.5 text-slate-700">
              <p><strong>Kategori:</strong> {inspectCert.category}</p>
              <p><strong>Tanggal Terbit:</strong> {inspectCert.issueDate}</p>
              <p><strong>Status Legalitas:</strong> <span className="text-emerald-700 font-bold">Terverifikasi Sah</span></p>
            </div>

            <button
              onClick={() => setInspectCert(null)}
              className="w-full bg-slate-900 text-white font-bold py-2.5 rounded-xl text-xs hover:bg-slate-800 transition cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
