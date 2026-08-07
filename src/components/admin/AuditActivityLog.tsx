import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { AuditLogEntry } from '../../types';
import {
  ShieldCheck,
  Search,
  Filter,
  Download,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  UserCheck,
  Clock,
  Globe,
  FileText,
  Activity,
  Layers,
  Sparkles,
  Eye,
  X,
  Lock,
  Plus,
  Server,
  Terminal,
  ChevronRight,
  ShieldAlert,
  ArrowUpDown,
  RefreshCw,
  Key,
  Shield,
} from 'lucide-react';

interface AuditActivityLogProps {
  compact?: boolean;
}

export const AuditActivityLog: React.FC<AuditActivityLogProps> = ({ compact = false }) => {
  const { auditLogs, addAuditLog, clearAuditLogs, t } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'table' | 'timeline'>('table');
  const [inspectEntry, setInspectEntry] = useState<AuditLogEntry | null>(null);
  const [showAddLogModal, setShowAddLogModal] = useState(false);
  const [exportToast, setExportToast] = useState<string | null>(null);

  // New Audit Log Form State
  const [newActorName, setNewActorName] = useState('Rohim Egy, S.Pd. (Kepala Cabang / Admin Utama)');
  const [newActorRole, setNewActorRole] = useState<AuditLogEntry['actorRole']>('superadmin');
  const [newCategory, setNewCategory] = useState<AuditLogEntry['actionCategory']>('student_update');
  const [newTargetEntity, setNewTargetEntity] = useState('Siswa ID: CAND-005');
  const [newDescription, setNewDescription] = useState('Pengecekan berkas dan verifikasi manual dokumen pendaftaran.');
  const [newDetails, setNewDetails] = useState('Semua berkas ijazah dan rekomendasi sekolah terverifikasi sah.');
  const [newStatus, setNewStatus] = useState<AuditLogEntry['status']>('success');

  // Filtered Audit Logs
  const filteredLogs = useMemo(() => {
    return auditLogs.filter((log) => {
      const matchesSearch =
        log.actorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.actionDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.targetEntity.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.ipAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (log.details && log.details.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory =
        selectedCategory === 'all' || log.actionCategory === selectedCategory;

      const matchesRole =
        selectedRole === 'all' || log.actorRole === selectedRole;

      const matchesStatus =
        selectedStatus === 'all' || log.status === selectedStatus;

      return matchesSearch && matchesCategory && matchesRole && matchesStatus;
    });
  }, [auditLogs, searchQuery, selectedCategory, selectedRole, selectedStatus]);

  // Statistics
  const totalCount = auditLogs.length;
  const warningCount = auditLogs.filter((l) => l.status === 'warning' || l.status === 'failed').length;
  const adminActionsCount = auditLogs.filter((l) => l.actorRole === 'admin' || l.actorRole === 'superadmin').length;
  const webmasterActionsCount = auditLogs.filter((l) => l.actorRole === 'webmaster').length;

  // Handle Export Audit Log to CSV
  const handleExportCSV = () => {
    const headers = ['ID', 'Timestamp', 'Actor Name', 'Role', 'Category', 'Description', 'Target Entity', 'IP Address', 'Status', 'Details'];
    const rows = filteredLogs.map((log) => [
      log.id,
      `"${log.timestamp}"`,
      `"${log.actorName}"`,
      log.actorRole,
      log.actionCategory,
      `"${log.actionDescription.replace(/"/g, '""')}"`,
      `"${log.targetEntity.replace(/"/g, '""')}"`,
      `"${log.ipAddress}"`,
      log.status,
      `"${(log.details || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Audit_Activity_Log_Prospect_Jember_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setExportToast('Laporan Rekam Jejak Audit (CSV) berhasil diunduh untuk pengarsipan keamanan!');
    setTimeout(() => setExportToast(null), 4000);
  };

  // Submit Manual Log
  const handleAddLogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDescription.trim() || !newTargetEntity.trim()) return;

    addAuditLog({
      actorName: newActorName,
      actorRole: newActorRole,
      actionCategory: newCategory,
      actionDescription: newDescription,
      targetEntity: newTargetEntity,
      ipAddress: '180.252.122.45 (Admin Jember HQ)',
      status: newStatus,
      details: newDetails,
    });

    setShowAddLogModal(false);
    setNewDescription('Pengecekan berkas dan verifikasi manual dokumen pendaftaran.');
    setNewTargetEntity('Siswa ID: CAND-005');

    setExportToast('Entri rekam jejak audit baru berhasil dicatat dalam log sistem!');
    setTimeout(() => setExportToast(null), 4000);
  };

  const getCategoryBadge = (cat: AuditLogEntry['actionCategory']) => {
    switch (cat) {
      case 'student_update':
        return <span className="bg-blue-100 text-blue-800 border border-blue-200 px-2.5 py-0.5 rounded-full text-[10px] font-bold">Data Siswa</span>;
      case 'page_edit':
        return <span className="bg-purple-100 text-purple-800 border border-purple-200 px-2.5 py-0.5 rounded-full text-[10px] font-bold">Webmaster CMS</span>;
      case 'resource_upload':
        return <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full text-[10px] font-bold">Modul / Resource</span>;
      case 'financial_edit':
        return <span className="bg-amber-100 text-amber-800 border border-amber-200 px-2.5 py-0.5 rounded-full text-[10px] font-bold">Keuangan</span>;
      case 'security':
        return <span className="bg-red-100 text-red-800 border border-red-200 px-2.5 py-0.5 rounded-full text-[10px] font-bold">Keamanan</span>;
      default:
        return <span className="bg-slate-100 text-slate-700 border border-slate-200 px-2.5 py-0.5 rounded-full text-[10px] font-bold">Konfigurasi</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Export Toast */}
      {exportToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white border border-amber-500/50 p-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-5 duration-300">
          <div className="p-2 bg-amber-500/20 text-amber-400 rounded-xl">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-white">Log Keamanan Audit</p>
            <p className="text-[11px] text-slate-300">{exportToast}</p>
          </div>
        </div>
      )}

      {/* Main Banner Header */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-red-950 text-white rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-md">
        <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-red-500/20 border border-red-500/40 text-red-300 px-3.5 py-1 rounded-full text-xs font-bold shadow-2xs">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{t('Log Aktivitas & Akuntabilitas System Audit', 'System Audit & Activity Log')}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black font-serif text-white tracking-tight">
              Audit Activity Log Admin & Webmaster
            </h2>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Pencatatan real-time seluruh tindakan administratif, pembaruan konten website, verifikasi pendaftaran siswa, dan log perubahan data keuangan untuk transparansi dan keamanan sistem LPK Prospect Jember.
            </p>
          </div>

          {/* Quick Action CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <button
              onClick={() => setShowAddLogModal(true)}
              className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-xs px-4 py-3 rounded-2xl transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-amber-400" />
              <span>Tambah Log Manual</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="bg-red-800 hover:bg-red-900 text-white font-bold text-xs px-4 py-3 rounded-2xl transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Ekspor Laporan Audit (CSV)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-1 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-extrabold text-slate-400 tracking-wider">Total Log Terekam</span>
            <Activity className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black font-mono text-slate-900">{totalCount} Log</div>
          <p className="text-[10px] text-slate-500">Aktivitas admin & webmaster</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-1 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-extrabold text-slate-400 tracking-wider">Aksi Administrator</span>
            <UserCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black font-mono text-emerald-700">{adminActionsCount} Perubahan</div>
          <p className="text-[10px] text-slate-500">Verifikasi & status siswa</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-1 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-extrabold text-slate-400 tracking-wider">Aksi Webmaster</span>
            <Server className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-black font-mono text-purple-700">{webmasterActionsCount} Edit Page</div>
          <p className="text-[10px] text-slate-500">Pengaturan & CMS website</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-1 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-extrabold text-slate-400 tracking-wider">Peringatan Keamanan</span>
            <ShieldAlert className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black font-mono text-amber-600">{warningCount} Event</div>
          <p className="text-[10px] text-slate-500">Percobaan login / flag</p>
        </div>
      </div>

      {/* Filter Toolbar & View Toggle */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-4 shadow-2xs">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari log menurut nama aktor, deskripsi tindakan, entitas target, atau Alamat IP..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-red-800 focus:bg-white outline-none transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* View Mode Toggle Buttons */}
          <div className="flex items-center gap-1.5 shrink-0 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'table'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Tabel</span>
            </button>
            <button
              onClick={() => setViewMode('timeline')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'timeline'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Timeline</span>
            </button>
          </div>
        </div>

        {/* Dropdown Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-600 shrink-0">Kategori:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold text-slate-700 outline-none focus:ring-2 focus:ring-red-800 cursor-pointer"
            >
              <option value="all">Semua Kategori</option>
              <option value="student_update">Verifikasi Data Siswa</option>
              <option value="page_edit">Webmaster & CMS Page</option>
              <option value="resource_upload">Upload Modul / Berkas</option>
              <option value="financial_edit">Laporan Keuangan</option>
              <option value="security">Event Keamanan & IP</option>
            </select>
          </div>

          {/* Role Filter */}
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-600 shrink-0">Peran Aktor:</span>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold text-slate-700 outline-none focus:ring-2 focus:ring-red-800 cursor-pointer"
            >
              <option value="all">Semua Peran Aktor</option>
              <option value="superadmin">Super Admin / Pimpinan</option>
              <option value="admin">Administrator Staff</option>
              <option value="webmaster">Webmaster Developer</option>
              <option value="finance">Divisi Keuangan</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-600 shrink-0">Status Result:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold text-slate-700 outline-none focus:ring-2 focus:ring-red-800 cursor-pointer"
            >
              <option value="all">Semua Status Log</option>
              <option value="success">✅ Berhasil (Success)</option>
              <option value="warning">⚠️ Peringatan (Warning)</option>
              <option value="failed">❌ Gagal (Failed)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main View: Table vs Timeline */}
      {filteredLogs.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
            <Search className="w-6 h-6" />
          </div>
          <h4 className="font-bold text-slate-800 text-sm">Tidak Ada Log Audit Yang Sesuai Filter</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Coba sesuaikan kata kunci pencarian atau ubah opsi kategori dan status di atas.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setSelectedRole('all');
              setSelectedStatus('all');
            }}
            className="text-xs font-bold text-red-800 hover:underline cursor-pointer pt-2"
          >
            Reset Semua Filter
          </button>
        </div>
      ) : viewMode === 'table' ? (
        /* TABLE VIEW */
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-900 text-slate-300 border-b border-slate-800 font-bold uppercase tracking-wider text-[10px]">
                  <th className="p-4">Waktu Log</th>
                  <th className="p-4">Aktor / User</th>
                  <th className="p-4">Deskripsi Perubahan / Tindakan</th>
                  <th className="p-4">Target Entitas</th>
                  <th className="p-4">Kategori</th>
                  <th className="p-4">Alamat IP / Lokasi</th>
                  <th className="p-4 text-center">Status</th>
                  <th className="p-4 text-right">Opsi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLogs.map((log) => {
                  return (
                    <tr key={log.id} className="hover:bg-slate-50/80 transition">
                      {/* Timestamp */}
                      <td className="p-4 font-mono text-[11px] text-slate-600 whitespace-nowrap">
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{log.timestamp}</span>
                        </span>
                      </td>

                      {/* Actor Name & Role */}
                      <td className="p-4">
                        <div className="space-y-0.5">
                          <span className="font-bold text-slate-900 block">{log.actorName}</span>
                          <span className="text-[10px] text-slate-500 uppercase font-mono">{log.actorRole}</span>
                        </div>
                      </td>

                      {/* Description */}
                      <td className="p-4 max-w-xs">
                        <p className="text-slate-800 leading-snug line-clamp-2">{log.actionDescription}</p>
                      </td>

                      {/* Target Entity */}
                      <td className="p-4">
                        <span className="bg-slate-100 text-slate-700 font-mono text-[10px] px-2 py-1 rounded-md border border-slate-200">
                          {log.targetEntity}
                        </span>
                      </td>

                      {/* Category Badge */}
                      <td className="p-4">{getCategoryBadge(log.actionCategory)}</td>

                      {/* IP Address */}
                      <td className="p-4 font-mono text-[10px] text-slate-600">
                        <span className="flex items-center gap-1">
                          <Globe className="w-3 h-3 text-slate-400" />
                          <span>{log.ipAddress}</span>
                        </span>
                      </td>

                      {/* Status */}
                      <td className="p-4 text-center">
                        {log.status === 'success' ? (
                          <span className="inline-flex items-center gap-1 text-emerald-700 font-bold text-[10px] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3" /> Sukses
                          </span>
                        ) : log.status === 'warning' ? (
                          <span className="inline-flex items-center gap-1 text-amber-700 font-bold text-[10px] bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                            <AlertTriangle className="w-3 h-3" /> Warning
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-red-700 font-bold text-[10px] bg-red-50 px-2 py-0.5 rounded-full border border-red-200">
                            <ShieldAlert className="w-3 h-3" /> Failed
                          </span>
                        )}
                      </td>

                      {/* Inspect Action */}
                      <td className="p-4 text-right">
                        <button
                          onClick={() => setInspectEntry(log)}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] px-3 py-1.5 rounded-xl transition cursor-pointer inline-flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Inspeksi</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* TIMELINE VIEW */
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-6 shadow-xs">
          <div className="relative border-l-2 border-slate-200 ml-4 space-y-6">
            {filteredLogs.map((log) => {
              return (
                <div key={log.id} className="relative pl-6 space-y-1 group">
                  {/* Circle Marker */}
                  <div
                    className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-white ${
                      log.status === 'success'
                        ? 'bg-emerald-500'
                        : log.status === 'warning'
                        ? 'bg-amber-500'
                        : 'bg-red-500'
                    }`}
                  />

                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2 hover:bg-white hover:shadow-xs transition">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-xs">{log.actorName}</span>
                        <span className="text-[9px] font-mono uppercase bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded">
                          {log.actorRole}
                        </span>
                        {getCategoryBadge(log.actionCategory)}
                      </div>

                      <span className="text-[10px] font-mono text-slate-500">{log.timestamp}</span>
                    </div>

                    <p className="text-xs text-slate-800 font-medium">{log.actionDescription}</p>

                    <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500 pt-1">
                      <span className="font-mono text-slate-600 bg-white border border-slate-200 px-2 py-0.5 rounded">
                        Target: {log.targetEntity}
                      </span>

                      <div className="flex items-center gap-3">
                        <span className="font-mono text-[10px]">{log.ipAddress}</span>
                        <button
                          onClick={() => setInspectEntry(log)}
                          className="text-red-800 font-bold hover:underline cursor-pointer"
                        >
                          Detail Rinci &rarr;
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Inspect Technical Log Detail Modal */}
      {inspectEntry && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 space-y-5 shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => setInspectEntry(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 bg-slate-100 rounded-full cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="p-3 bg-slate-900 text-amber-400 rounded-2xl">
                <Terminal className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">Log ID: {inspectEntry.id}</span>
                <h3 className="font-bold text-slate-900 text-base font-serif">Rincian Hasil Inspeksi Keamanan Audit</h3>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Waktu Terekam</span>
                  <span className="font-mono font-bold text-slate-800">{inspectEntry.timestamp}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Alamat IP / Node</span>
                  <span className="font-mono font-bold text-slate-800">{inspectEntry.ipAddress}</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="font-bold text-slate-700">Aktor & Peran:</span>
                <div className="p-2.5 bg-slate-100 rounded-xl font-bold text-slate-800 flex items-center justify-between">
                  <span>{inspectEntry.actorName}</span>
                  <span className="text-[10px] uppercase font-mono bg-slate-200 text-slate-700 px-2 py-0.5 rounded">
                    {inspectEntry.actorRole}
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="font-bold text-slate-700">Tindakan Perubahan:</span>
                <p className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 leading-relaxed">
                  {inspectEntry.actionDescription}
                </p>
              </div>

              <div className="space-y-1">
                <span className="font-bold text-slate-700">Entitas Target:</span>
                <p className="p-2.5 bg-slate-100 rounded-xl font-mono text-slate-800">
                  {inspectEntry.targetEntity}
                </p>
              </div>

              {inspectEntry.details && (
                <div className="space-y-1">
                  <span className="font-bold text-slate-700">Catatan Detail Payload / Parameter:</span>
                  <pre className="p-3 bg-slate-900 text-emerald-400 rounded-xl font-mono text-[11px] overflow-x-auto whitespace-pre-wrap">
                    {inspectEntry.details}
                  </pre>
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setInspectEntry(null)}
                className="px-5 py-2.5 bg-slate-900 text-white font-bold rounded-xl text-xs hover:bg-slate-800 transition"
              >
                Tutup Sesi Inspeksi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Add Manual Audit Entry */}
      {showAddLogModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => setShowAddLogModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 bg-slate-100 rounded-full cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="p-3 bg-red-100 text-red-800 rounded-2xl">
                <Plus className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base font-serif">Pencatatan Audit Log Manual</h3>
                <p className="text-xs text-slate-500">Buat rekam jejak manual untuk pemeliharaan sistem atau penyesuaian khusus</p>
              </div>
            </div>

            <form onSubmit={handleAddLogSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Nama Aktor / User *</label>
                  <input
                    type="text"
                    required
                    value={newActorName}
                    onChange={(e) => setNewActorName(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-red-800"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Peran Aktor</label>
                  <select
                    value={newActorRole}
                    onChange={(e) => setNewActorRole(e.target.value as any)}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-red-800 bg-white"
                  >
                    <option value="superadmin">Super Admin</option>
                    <option value="admin">Administrator</option>
                    <option value="webmaster">Webmaster</option>
                    <option value="finance">Keuangan</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Kategori Tindakan</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-red-800 bg-white"
                  >
                    <option value="student_update">Verifikasi Data Siswa</option>
                    <option value="page_edit">Webmaster CMS Page</option>
                    <option value="resource_upload">Upload Modul</option>
                    <option value="financial_edit">Laporan Keuangan</option>
                    <option value="security">Event Keamanan</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Status Tindakan</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as any)}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-red-800 bg-white"
                  >
                    <option value="success">Berhasil (Success)</option>
                    <option value="warning">Peringatan (Warning)</option>
                    <option value="failed">Gagal (Failed)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Entitas Target *</label>
                <input
                  type="text"
                  required
                  value={newTargetEntity}
                  onChange={(e) => setNewTargetEntity(e.target.value)}
                  placeholder="Contoh: Siswa ID: CAND-005 atau Setting Website"
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-red-800"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Deskripsi Perubahan / Aktivitas *</label>
                <textarea
                  required
                  rows={2}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Jelaskan perubahan data yang dilakukan..."
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-red-800"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Catatan Detail Payload (Opsional)</label>
                <textarea
                  rows={2}
                  value={newDetails}
                  onChange={(e) => setNewDetails(e.target.value)}
                  placeholder="Informasi teknis tambahan..."
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-red-800"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddLogModal(false)}
                  className="w-1/2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="w-1/2 bg-red-800 hover:bg-red-900 text-white font-bold py-3 rounded-xl transition shadow-md"
                >
                  Simpan Audit Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
