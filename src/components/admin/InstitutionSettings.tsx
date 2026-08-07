import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ConfirmActionModal } from './ConfirmActionModal';
import {
  Building2,
  MapPin,
  UserCheck,
  Phone,
  Mail,
  Save,
  CheckCircle,
  FileText,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Info,
} from 'lucide-react';

export const InstitutionSettings: React.FC = () => {
  const { websiteSettings, updateWebsiteSettings, addAuditLog, currentRole } = useApp();

  const isSuperAdmin = currentRole === 'superadmin' || currentRole === 'super_admin';

  const [formState, setFormState] = useState({
    siteName: websiteSettings?.siteName || 'Prospect Education Cabang Jember',
    officeAddress:
      websiteSettings?.officeAddress ||
      'Jl. Balung-Jenggawah, Wetan Kali, Balung Lor, Kec. Balung, Kabupaten Jember, Jawa Timur 68161',
    officialSignatoryName: websiteSettings?.officialSignatoryName || 'Rohim Egy, S.Pd.',
    officialSignatoryTitle:
      websiteSettings?.officialSignatoryTitle || 'Kepala Cabang Prospect Education Jember',
    csPhoneWhatsApp: websiteSettings?.csPhoneWhatsApp || '082334554396',
    contactEmail: websiteSettings?.contactEmail || 'info@prospect-jember.id',
    siteTagline:
      websiteSettings?.siteTagline ||
      'LKP & Konsultan Pendidikan - Program Taiwan IFP 1+4 & Kerja Jepang IM / SSW',
  });

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateWebsiteSettings(formState);
    
    // Add audit log entry
    if (addAuditLog) {
      addAuditLog({
        actorName: `${formState.officialSignatoryName} (Super Admin / Admin)`,
        actorRole: isSuperAdmin ? 'superadmin' : 'admin',
        actionCategory: 'system_setting',
        actionDescription: `Mengubah data profil lembaga: Nama (${formState.siteName}), Alamat (${formState.officeAddress}), Penandatangan (${formState.officialSignatoryName} - ${formState.officialSignatoryTitle}).`,
        targetEntity: 'Pengaturan Lembaga & Dokumen Resmi',
      });
    }

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  const handleReset = () => {
    const defaultData = {
      siteName: 'Prospect Education Cabang Jember',
      officeAddress: 'Jl. Balung-Jenggawah, Wetan Kali, Balung Lor, Kec. Balung, Kabupaten Jember, Jawa Timur 68161',
      officialSignatoryName: 'Rohim Egy, S.Pd.',
      officialSignatoryTitle: 'Kepala Cabang Prospect Education Jember',
      csPhoneWhatsApp: '082334554396',
      contactEmail: 'info@prospect-jember.id',
      siteTagline: 'LKP & Konsultan Pendidikan - Program Taiwan IFP 1+4 & Kerja Jepang IM / SSW',
    };
    setFormState(defaultData);
    updateWebsiteSettings(defaultData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-[#0F3D7A] rounded-3xl p-6 md:p-8 text-white relative overflow-hidden shadow-xl border border-blue-900">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-linear-to-l from-blue-900/40 to-transparent pointer-events-none" />
        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
            <Building2 className="w-4 h-4" />
            <span>Modul Pengaturan Lembaga & Dokumen Resmi</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-serif tracking-tight">
            Identitas Lembaga & Pejabat Penandatangan
          </h2>
          <p className="text-xs sm:text-sm text-slate-200 max-w-2xl leading-relaxed">
            Kelola nama instansi, alamat kantor, dan pejabat resmi penandatangan. Data ini secara otomatis diterapkan langsung ke seluruh dokumen cetak siswa seperti <span className="text-amber-300 font-semibold underline">Surat Keterangan Aktif</span>, LoA Beasiswa, Sertifikat Digital, serta Kuitansi Pembayaran.
          </p>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-50 border-2 border-emerald-500 rounded-2xl flex items-center justify-between text-emerald-900 text-xs font-bold animate-in zoom-in-95 duration-200 shadow-md">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>Pengaturan profil lembaga dan pejabat penandatangan berhasil diperbarui dan disinkronkan ke seluruh sistem!</span>
          </div>
          <span className="text-[10px] bg-emerald-200 text-emerald-900 px-2 py-1 rounded-lg">Tersimpan</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* FORM SETTINGS */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base font-serif flex items-center gap-2">
                <Building2 className="w-5 h-5 text-red-800" />
                <span>Profil Lembaga & Kontak Resmi</span>
              </h3>
              <span className="text-[11px] font-mono bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full">
                Super Admin Access
              </span>
            </div>

            {/* Site Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
                <span>Nama Resmi Lembaga / Instansi *</span>
                <span className="text-[10px] text-slate-400">Tampil di Kop Surat & Banner</span>
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  value={formState.siteName}
                  onChange={(e) => setFormState({ ...formState, siteName: e.target.value })}
                  placeholder="Contoh: Prospect Education Cabang Jember"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-700"
                />
              </div>
            </div>

            {/* Office Address */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
                <span>Alamat Kantor Resmi Lembaga *</span>
                <span className="text-[10px] text-slate-400">Dicantumkan di Kop Surat</span>
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <textarea
                  rows={2}
                  required
                  value={formState.officeAddress}
                  onChange={(e) => setFormState({ ...formState, officeAddress: e.target.value })}
                  placeholder="Contoh: Jl. Balung-Jenggawah, Wetan Kali, Balung Lor, Kec. Balung, Kabupaten Jember, Jawa Timur 68161"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-700 leading-relaxed"
                />
              </div>
            </div>

            {/* Signatory Divider */}
            <div className="pt-2 border-t border-slate-100">
              <div className="flex items-center gap-2 mb-3">
                <UserCheck className="w-4 h-4 text-amber-600" />
                <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider">
                  Pejabat Penandatangan Resmi (Signatory Official)
                </h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Official Signatory Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800">
                    Nama Pejabat Penandatangan *
                  </label>
                  <input
                    type="text"
                    required
                    value={formState.officialSignatoryName}
                    onChange={(e) =>
                      setFormState({ ...formState, officialSignatoryName: e.target.value })
                    }
                    placeholder="Contoh: Rohim Egy, S.Pd."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-600"
                  />
                </div>

                {/* Official Signatory Title */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800">
                    Jabatan Pejabat *
                  </label>
                  <input
                    type="text"
                    required
                    value={formState.officialSignatoryTitle}
                    onChange={(e) =>
                      setFormState({ ...formState, officialSignatoryTitle: e.target.value })
                    }
                    placeholder="Contoh: Kepala Cabang Prospect Education Jember"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-600"
                  />
                </div>
              </div>
            </div>

            {/* Contact Details */}
            <div className="pt-2 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  <span>No. WhatsApp / CS Hotline *</span>
                </label>
                <input
                  type="text"
                  required
                  value={formState.csPhoneWhatsApp}
                  onChange={(e) => setFormState({ ...formState, csPhoneWhatsApp: e.target.value })}
                  placeholder="Contoh: 082334554396"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-blue-600" />
                  <span>Email Resmi *</span>
                </label>
                <input
                  type="email"
                  required
                  value={formState.contactEmail}
                  onChange={(e) => setFormState({ ...formState, contactEmail: e.target.value })}
                  placeholder="Contoh: info@prospect-jember.id"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>

            {/* Tagline */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800">
                Tagline Sub-Judul Institusi
              </label>
              <input
                type="text"
                value={formState.siteTagline}
                onChange={(e) => setFormState({ ...formState, siteTagline: e.target.value })}
                placeholder="LKP & Konsultan Pendidikan - Program Taiwan IFP 1+4 & Kerja Jepang IM / SSW"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400"
              />
            </div>

            {/* Action Buttons */}
            <div className="pt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setIsResetConfirmOpen(true)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset Standar Default</span>
              </button>

              <button
                type="submit"
                className="px-6 py-2.5 bg-[#0F3D7A] hover:bg-[#092852] text-amber-300 font-extrabold rounded-xl text-xs transition shadow-lg flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <Save className="w-4 h-4" />
                <span>Simpan & Terapkan Ke Semua Dokumen</span>
              </button>
            </div>
          </form>
        </div>

        {/* PREVIEW CARD */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 text-white rounded-3xl p-5 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-400" />
                <h4 className="font-bold text-xs uppercase tracking-wider text-amber-400">
                  Pratinjau Dokumen Real-time
                </h4>
              </div>
              <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">
                Surat Keterangan Aktif
              </span>
            </div>

            {/* Live Paper Mockup */}
            <div className="bg-white text-slate-900 rounded-2xl p-4 sm:p-5 shadow-inner border border-slate-200 text-left font-serif space-y-3">
              {/* Kop Surat Header */}
              <div className="border-b-2 border-double border-slate-900 pb-3 text-center space-y-1">
                <div className="flex items-center justify-center gap-1.5 text-red-900 font-black text-[11px] tracking-wide uppercase">
                  <Building2 className="w-4 h-4 text-red-800 shrink-0" />
                  <span>{formState.siteName.toUpperCase()}</span>
                </div>
                <p className="text-[9px] text-slate-600 font-sans leading-tight">
                  {formState.officeAddress} | Telp/WA: {formState.csPhoneWhatsApp} | Email: {formState.contactEmail}
                </p>
              </div>

              {/* Title */}
              <div className="text-center space-y-0.5 py-1">
                <h5 className="font-black text-xs text-slate-900 underline tracking-wider uppercase">
                  SURAT KETERANGAN AKTIF BELAJAR
                </h5>
                <p className="text-[9px] text-slate-500 font-mono">Nomor: 008/SK-PROSPECT/VIII/2026</p>
              </div>

              {/* Content excerpt */}
              <div className="text-[10px] text-slate-800 space-y-1.5 leading-relaxed font-sans">
                <p>
                  Yang bertanda tangan di bawah ini, <strong className="font-serif">{formState.officialSignatoryTitle}</strong> menerangkan bahwa:
                </p>
                <div className="pl-3 py-1 bg-slate-50 rounded-lg border border-slate-200 text-[9.5px] font-mono space-y-0.5">
                  <p><span className="text-slate-500">Nama Siswa :</span> Ahmad Subagyo</p>
                  <p><span className="text-slate-500">Program    :</span> Taiwan IFP 1+4 Scholarship</p>
                  <p><span className="text-slate-500">Status     :</span> Peserta Terdaftar & Aktif</p>
                </div>
              </div>

              {/* Signature block */}
              <div className="pt-2 flex justify-end font-sans">
                <div className="text-center w-40 space-y-0.5">
                  <p className="text-[9px] text-slate-500">Jember, 01 Agustus 2026</p>
                  <p className="font-bold text-[9.5px] text-slate-900 leading-tight">
                    {formState.officialSignatoryTitle}
                  </p>
                  
                  {/* Seal placeholder */}
                  <div className="h-10 my-1 flex items-center justify-center relative">
                    <div className="w-14 h-14 rounded-full border-2 border-red-800 border-dashed flex items-center justify-center text-red-800 text-[6.5px] font-bold uppercase text-center p-0.5 rotate-[-10deg] opacity-75">
                      STEMPEL RESMI
                    </div>
                    <span className="absolute font-serif italic text-slate-900 font-bold text-xs underline">
                      {formState.officialSignatoryName}
                    </span>
                  </div>

                  <p className="text-[8.5px] text-slate-500 font-mono">{formState.officialSignatoryTitle}</p>
                </div>
              </div>
            </div>

            <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/60 flex items-start gap-2 text-[11px] text-slate-300 leading-relaxed">
              <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <p>
                Pratinjau ini memperlihatkan bagaimana nama lembaga, alamat kantor, dan nama penandatangan akan langsung tercetak di Surat Keterangan Aktif siswa saat diunduh / dipratinjau.
              </p>
            </div>
          </div>

          <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-amber-900 text-xs space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-amber-950">
              <ShieldCheck className="w-4 h-4 text-amber-700" />
              <span>Proteksi Otoritas & Audit Security</span>
            </div>
            <p className="text-[11px] leading-relaxed text-amber-800">
              Setiap kali Anda mengubah profil lembaga atau pejabat penandatangan, aksi tersebut akan secara otomatis tercatat di <strong className="underline">Audit Activity Log</strong> sistem untuk menjamin transparansi dan keamanan legalitas dokumen.
            </p>
          </div>
        </div>
      </div>

      <ConfirmActionModal
        isOpen={isResetConfirmOpen}
        onClose={() => setIsResetConfirmOpen(false)}
        onConfirm={handleReset}
        title="Reset Profil Lembaga ke Standar Awal?"
        description="Apakah Anda yakin ingin mengembalikan seluruh nama lembaga, alamat kantor, dan pejabat penandatangan ke standar resmi bawaan awal Prospect Education?"
        confirmText="Ya, Reset Pengaturan"
        variant="warning"
        iconType="reset"
      />
    </div>
  );
};
