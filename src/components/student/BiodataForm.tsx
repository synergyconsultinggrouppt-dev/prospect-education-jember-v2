import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CandidateBiodata } from '../../types';
import { Save, CheckCircle2, UserCheck } from 'lucide-react';

export const BiodataForm: React.FC = () => {
  const { currentCandidate, updateCandidateBiodata } = useApp();

  const [form, setForm] = useState<CandidateBiodata>(
    currentCandidate?.biodata || {
      nik: '',
      fullName: currentCandidate?.fullName || '',
      birthPlace: 'Jember',
      birthDate: '2003-01-01',
      gender: 'Laki-Laki',
      religion: 'Islam',
      address: '',
      district: 'Balung',
      regency: 'Kabupaten Jember',
      phoneWA: '',
      email: currentCandidate?.email || '',
      education: 'SMA/SMK',
      major: 'MIPA',
      parentName: '',
      parentPhone: '',
      parentJob: '',
    }
  );

  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentCandidate) return;
    updateCandidateBiodata(currentCandidate.id, form);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 font-serif">Formulir Biodata Peserta</h2>
          <p className="text-xs text-slate-500">Lengkapi data pribadi Anda secara benar sesuai dokumen KTP / Ijazah.</p>
        </div>
        <span className="text-xs font-bold text-red-800 bg-red-50 border border-red-200 px-3 py-1 rounded-full">
          Nomor Registrasi: {currentCandidate?.registrationNumber}
        </span>
      </div>

      {saved && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Biodata berhasil diperbarui! Melanjut ke tahap Upload Dokumen.</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 text-xs">
        {/* Data Pribadi */}
        <div className="space-y-4">
          <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-1 flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-red-700" /> Data Pribadi
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-bold text-slate-700">NIK (Nomor Induk Kependudukan) *</label>
              <input
                type="text"
                required
                maxLength={16}
                value={form.nik}
                onChange={(e) => setForm({ ...form, nik: e.target.value })}
                placeholder="3509xxxxxxxxxxxx"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Nama Lengkap (Sesuai Ijazah) *</label>
              <input
                type="text"
                required
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                placeholder="Nama Lengkap"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Tempat Lahir *</label>
              <input
                type="text"
                required
                value={form.birthPlace}
                onChange={(e) => setForm({ ...form, birthPlace: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Tanggal Lahir *</label>
              <input
                type="date"
                required
                value={form.birthDate}
                onChange={(e) => setForm({ ...form, birthDate: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Jenis Kelamin *</label>
              <select
                value={form.gender}
                onChange={(e) => setForm({ ...form, gender: e.target.value as any })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-600"
              >
                <option value="Laki-Laki">Laki-Laki</option>
                <option value="Perempuan">Perempuan</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Nomor Telepon / WhatsApp *</label>
              <input
                type="text"
                required
                value={form.phoneWA}
                onChange={(e) => setForm({ ...form, phoneWA: e.target.value })}
                placeholder="081234567890"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Alamat Email *</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700">Alamat Tempat Tinggal Lengkap *</label>
            <textarea
              rows={2}
              required
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              placeholder="Dusun, RT/RW, Desa/Kelurahan..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-600"
            />
          </div>
        </div>

        {/* Pendidikan & Orang Tua */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-1">
            Pendidikan & Data Orang Tua
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Asal Sekolah / PT *</label>
              <input
                type="text"
                required
                value={form.education}
                onChange={(e) => setForm({ ...form, education: e.target.value })}
                placeholder="SMKN 1 Balung / SMAN 2 Jember"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Jurusan *</label>
              <input
                type="text"
                required
                value={form.major}
                onChange={(e) => setForm({ ...form, major: e.target.value })}
                placeholder="Teknik Mesin / Keperawatan / MIPA"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Nama Orang Tua / Wali *</label>
              <input
                type="text"
                required
                value={form.parentName}
                onChange={(e) => setForm({ ...form, parentName: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">No. HP Orang Tua *</label>
              <input
                type="text"
                required
                value={form.parentPhone}
                onChange={(e) => setForm({ ...form, parentPhone: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Pekerjaan Orang Tua</label>
              <input
                type="text"
                value={form.parentJob}
                onChange={(e) => setForm({ ...form, parentJob: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-800 to-amber-700 hover:from-red-900 hover:to-amber-800 text-white font-bold py-3 rounded-xl shadow-md transition"
        >
          <Save className="w-4 h-4" />
          <span>Simpan Biodata Peserta</span>
        </button>
      </form>
    </div>
  );
};
