import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AttendanceRecord } from '../../types';
import {
  QrCode,
  MapPin,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  Download,
  FileSpreadsheet,
  Plus,
  Edit2,
  UserCheck,
  Map,
  ShieldCheck,
  Calendar,
  AlertCircle,
  X,
  Check,
} from 'lucide-react';

export const AdminAttendanceMonitoring: React.FC = () => {
  const { attendances, candidates, addAttendanceRecord, updateAttendanceStatus } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<'all' | 'qr' | 'gps'>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedDate, setSelectedDate] = useState<string>('');

  // Manual Attendance Modal State
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [manualCandidateId, setManualCandidateId] = useState(candidates[0]?.id || '');
  const [manualClass, setManualClass] = useState('Kelas Bahasa Mandarin Intensif Level A1 - Ruang 102');
  const [manualMethod, setManualMethod] = useState<'qr' | 'gps'>('qr');
  const [manualStatus, setManualStatus] = useState<'hadir' | 'terlambat' | 'izin' | 'sakit'>('hadir');
  const [manualNotes, setManualNotes] = useState('');

  // Status Edit State
  const [editingAttendance, setEditingAttendance] = useState<AttendanceRecord | null>(null);
  const [editStatus, setEditStatus] = useState<AttendanceRecord['status']>('hadir');
  const [editNotes, setEditNotes] = useState('');

  const todayStr = new Date().toISOString().split('T')[0];

  // Filtering attendances
  const filteredAttendances = attendances.filter((att) => {
    const matchesSearch =
      att.candidateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      att.registrationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      att.className.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesMethod = selectedMethod === 'all' || att.method === selectedMethod;
    const matchesStatus = selectedStatus === 'all' || att.status === selectedStatus;
    const matchesDate = !selectedDate || att.date === selectedDate;

    return matchesSearch && matchesMethod && matchesStatus && matchesDate;
  });

  // Calculate KPIs
  const todayAttendances = attendances.filter((a) => a.date === todayStr);
  const totalToday = todayAttendances.length;
  const todayQrCount = todayAttendances.filter((a) => a.method === 'qr').length;
  const todayGpsCount = todayAttendances.filter((a) => a.method === 'gps').length;
  const todayOnTime = todayAttendances.filter((a) => a.status === 'hadir').length;

  // Handle Manual Attendance Submit
  const handleCreateManualAttendance = (e: React.FormEvent) => {
    e.preventDefault();
    const candidate = candidates.find((c) => c.id === manualCandidateId);
    if (!candidate) return;

    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];

    addAttendanceRecord({
      candidateId: candidate.id,
      candidateName: candidate.fullName,
      registrationNumber: candidate.registrationNumber,
      className: manualClass,
      programType: candidate.selectedProgram || 'taiwan_ifp',
      method: manualMethod,
      date: todayStr,
      checkInTime: timeStr,
      status: manualStatus,
      locationName: manualMethod === 'qr' ? 'Presensi Manual oleh Admin Jember' : 'Gedung LKP Prospect Education Jember',
      verifiedBySystem: true,
      notes: manualNotes || 'Input Presensi Manual oleh Administrator Jember',
    });

    setIsManualModalOpen(false);
    setManualNotes('');
  };

  // Handle Update Status
  const handleSaveEditStatus = () => {
    if (!editingAttendance) return;
    updateAttendanceStatus(editingAttendance.id, editStatus, editNotes);
    setEditingAttendance(null);
  };

  // Export Attendance CSV
  const handleExportCSV = () => {
    if (attendances.length === 0) return;

    const headers = [
      'No',
      'Tanggal',
      'Jam Check-In',
      'No Registrasi',
      'Nama Peserta',
      'Nama Kelas',
      'Metode Presensi',
      'Status Kehadiran',
      'Lokasi Presensi',
      'Catatan System',
    ];

    const rows = filteredAttendances.map((att, idx) => [
      idx + 1,
      `"${att.date}"`,
      `"${att.checkInTime}"`,
      `"${att.registrationNumber}"`,
      `"${att.candidateName.replace(/"/g, '""')}"`,
      `"${att.className.replace(/"/g, '""')}"`,
      `"${att.method === 'qr' ? 'QR Code Scanner' : 'GPS Geolocation'}"`,
      `"${att.status.toUpperCase()}"`,
      `"${(att.locationName || '-').replace(/"/g, '""')}"`,
      `"${(att.notes || '-').replace(/"/g, '""')}"`,
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Rekap_Absensi_Kelas_Bahasa_Prospect_${todayStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 px-3 py-1 rounded-full text-xs font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>MODUL MONITORING ABSENSI REAL-TIME</span>
          </div>
          <h2 className="text-2xl font-black font-serif text-white">Monitoring Kehadiran Kelas Bahasa</h2>
          <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
            Pantau kehadiran harian peserta kelas bahasa (Mandarin & Jepang) secara real-time. Terhubung dengan pindaian QR Code pendaftaran dan lokasi GPS Geolocation Kampus Prospect Jember.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <button
            onClick={() => setIsManualModalOpen(true)}
            className="bg-amber-400 hover:bg-amber-300 active:scale-98 text-slate-950 font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-md transition flex items-center justify-center gap-2 shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-slate-950" />
            <span>Input Absen Manual</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="bg-emerald-600 hover:bg-emerald-500 active:scale-98 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-md transition flex items-center justify-center gap-2 shrink-0 cursor-pointer border border-emerald-500/40"
            title="Unduh Rekap Absensi dalam Format Excel (.csv)"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-200" />
            <span>Export Rekap Excel</span>
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Presensi Hari Ini</span>
            <div className="p-2 bg-blue-50 text-blue-900 rounded-xl">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-blue-900 font-serif">{totalToday} Peserta</p>
          <p className="text-[10px] text-slate-500">Tanggal: {todayStr}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Via QR Code Scanner</span>
            <div className="p-2 bg-amber-50 text-amber-700 rounded-xl">
              <QrCode className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-amber-700 font-serif">{todayQrCount} Peserta</p>
          <p className="text-[10px] text-slate-500">Pindaian Pintu Kelas LKP</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Via GPS Geolocation</span>
            <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl">
              <MapPin className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-emerald-600 font-serif">{todayGpsCount} Peserta</p>
          <p className="text-[10px] text-slate-500">Validasi Radius Kampus</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Hadir Tepat Waktu</span>
            <div className="p-2 bg-sky-50 text-sky-700 rounded-xl">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-sky-800 font-serif">{todayOnTime} Peserta</p>
          <p className="text-[10px] text-slate-500">Masuk Sebelum 08:15 WIB</p>
        </div>
      </div>

      {/* Filters & Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4">
        {/* Search & Filter Controls */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama peserta / no registrasi..."
              className="w-full text-xs pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-slate-50"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto text-xs">
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold text-slate-500 px-2">Metode:</span>
              <button
                onClick={() => setSelectedMethod('all')}
                className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
                  selectedMethod === 'all' ? 'bg-blue-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200'
                }`}
              >
                Semua
              </button>
              <button
                onClick={() => setSelectedMethod('qr')}
                className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
                  selectedMethod === 'qr' ? 'bg-blue-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200'
                }`}
              >
                QR Code
              </button>
              <button
                onClick={() => setSelectedMethod('gps')}
                className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
                  selectedMethod === 'gps' ? 'bg-blue-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200'
                }`}
              >
                GPS
              </button>
            </div>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-slate-50 text-slate-800 font-bold p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer"
            >
              <option value="all">Semua Status</option>
              <option value="hadir">Status: Hadir</option>
              <option value="terlambat">Status: Terlambat</option>
              <option value="izin">Status: Izin / Sakit</option>
            </select>

            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-slate-50 text-slate-800 font-bold p-2 rounded-xl border border-slate-200 focus:outline-none cursor-pointer"
            />

            {selectedDate && (
              <button
                onClick={() => setSelectedDate('')}
                className="text-[11px] text-red-600 hover:underline font-bold"
              >
                Reset Tanggal
              </button>
            )}
          </div>
        </div>

        {/* Real-time Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="p-3.5">Peserta</th>
                <th className="p-3.5">Kelas Bahasa</th>
                <th className="p-3.5 text-center">Metode</th>
                <th className="p-3.5 text-center">Waktu Check-In</th>
                <th className="p-3.5 text-center">Status</th>
                <th className="p-3.5">Lokasi / Catatan</th>
                <th className="p-3.5 text-center">Aksi Admin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAttendances.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">
                    <Clock className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    Tidak ada rekaman absensi yang sesuai filter.
                  </td>
                </tr>
              ) : (
                filteredAttendances.map((att) => (
                  <tr key={att.id} className="hover:bg-slate-50/80 transition">
                    <td className="p-3.5">
                      <div className="font-extrabold text-blue-950">{att.candidateName}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{att.registrationNumber}</div>
                    </td>
                    <td className="p-3.5 text-slate-800 font-medium">{att.className}</td>
                    <td className="p-3.5 text-center">
                      {att.method === 'qr' ? (
                        <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-900 border border-amber-300 px-2.5 py-1 rounded-full text-[10px] font-extrabold">
                          <QrCode className="w-3 h-3 text-amber-700" />
                          <span>QR Code</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-900 border border-emerald-300 px-2.5 py-1 rounded-full text-[10px] font-extrabold">
                          <MapPin className="w-3 h-3 text-emerald-700" />
                          <span>GPS Location</span>
                        </span>
                      )}
                    </td>
                    <td className="p-3.5 text-center font-mono">
                      <div className="font-bold text-slate-900">{att.checkInTime}</div>
                      <div className="text-[10px] text-slate-500">{att.date}</div>
                    </td>
                    <td className="p-3.5 text-center">
                      {att.status === 'hadir' && (
                        <span className="inline-block bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-full text-[10px]">
                          ✓ Hadir
                        </span>
                      )}
                      {att.status === 'terlambat' && (
                        <span className="inline-block bg-amber-100 text-amber-800 font-bold px-2.5 py-1 rounded-full text-[10px]">
                          ⏰ Terlambat
                        </span>
                      )}
                      {(att.status === 'izin' || att.status === 'sakit') && (
                        <span className="inline-block bg-sky-100 text-sky-800 font-bold px-2.5 py-1 rounded-full text-[10px]">
                          ✉ Izin / Sakit
                        </span>
                      )}
                    </td>
                    <td className="p-3.5 text-slate-600 max-w-xs">
                      <p className="font-medium text-slate-800 text-[11px] truncate">{att.locationName || '-'}</p>
                      {att.notes && <p className="text-[10px] text-slate-500 italic truncate">{att.notes}</p>}
                    </td>
                    <td className="p-3.5 text-center">
                      <button
                        onClick={() => {
                          setEditingAttendance(att);
                          setEditStatus(att.status);
                          setEditNotes(att.notes || '');
                        }}
                        className="text-xs font-bold text-blue-900 hover:text-sky-700 bg-sky-50 px-2.5 py-1.5 rounded-lg border border-sky-200 transition inline-flex items-center gap-1 cursor-pointer"
                        title="Ubah status kehadiran peserta"
                      >
                        <Edit2 className="w-3 h-3 text-blue-800" />
                        <span>Edit Status</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MANUAL ATTENDANCE MODAL */}
      {isManualModalOpen && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 border border-slate-200 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold font-serif text-slate-900 text-base flex items-center gap-2">
                <Plus className="w-5 h-5 text-amber-500" />
                <span>Input Presensi Manual</span>
              </h3>
              <button
                onClick={() => setIsManualModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateManualAttendance} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-800 mb-1">Pilih Peserta:</label>
                <select
                  value={manualCandidateId}
                  onChange={(e) => setManualCandidateId(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-slate-50 font-bold"
                >
                  {candidates.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.fullName} ({c.registrationNumber})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Nama Kelas:</label>
                <select
                  value={manualClass}
                  onChange={(e) => setManualClass(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-slate-50 font-medium"
                >
                  <option value="Kelas Bahasa Mandarin Intensif Level A1 - Ruang 102">Mandarin Level A1 (Ruang 102)</option>
                  <option value="Kelas Bahasa Mandarin Pembekalan IFP - Lab Bahasa">Mandarin IFP (Lab Bahasa)</option>
                  <option value="Kelas Bahasa Jepang Dasar (Shokyu N5) - Ruang 104">Jepang Shokyu N5 (Ruang 104)</option>
                  <option value="Kelas Bahasa Jepang Tokutei Ginou SSW - Ruang 201">Jepang Tokutei Ginou (Ruang 201)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Metode Presensi:</label>
                  <select
                    value={manualMethod}
                    onChange={(e) => setManualMethod(e.target.value as any)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 font-bold"
                  >
                    <option value="qr">QR Code</option>
                    <option value="gps">GPS Geolocation</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">Status Kehadiran:</label>
                  <select
                    value={manualStatus}
                    onChange={(e) => setManualStatus(e.target.value as any)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 font-bold text-emerald-700"
                  >
                    <option value="hadir">Hadir</option>
                    <option value="terlambat">Terlambat</option>
                    <option value="izin">Izin / Sakit</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Catatan Admin:</label>
                <textarea
                  value={manualNotes}
                  onChange={(e) => setManualNotes(e.target.value)}
                  placeholder="Contoh: Sakit dengan surat keterangan dokter / Disetujui Admin Jember..."
                  rows={2}
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-slate-50"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsManualModalOpen(false)}
                  className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold rounded-xl shadow-md cursor-pointer"
                >
                  Simpan Presensi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT STATUS MODAL */}
      {editingAttendance && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 border border-slate-200 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold font-serif text-slate-900 text-base">Ubah Status Kehadiran</h3>
              <button onClick={() => setEditingAttendance(null)} className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <p className="font-bold text-blue-950">{editingAttendance.candidateName}</p>
                <p className="text-[11px] text-slate-500">{editingAttendance.className} ({editingAttendance.date})</p>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Status Kehadiran Baru:</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as any)}
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 font-bold"
                >
                  <option value="hadir">✓ Hadir (Tepat Waktu)</option>
                  <option value="terlambat">⏰ Terlambat</option>
                  <option value="izin">✉ Izin / Sakit</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Catatan / Alasan Perubahan:</label>
                <textarea
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="Tambahkan catatan koreksi admin..."
                  rows={3}
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-slate-50"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingAttendance(null)}
                  className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleSaveEditStatus}
                  className="px-5 py-2 bg-blue-900 hover:bg-blue-800 text-white font-bold rounded-xl shadow-md cursor-pointer"
                >
                  Simpan Perubahan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
