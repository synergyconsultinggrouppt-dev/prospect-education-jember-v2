import React from 'react';
import {
  X,
  Camera,
  CheckCircle2,
  AlertTriangle,
  Info,
  Sparkles,
  UserCheck,
  Shirt,
  Maximize2,
  Calendar,
  Eye,
  Smile,
  ShieldCheck,
  ExternalLink,
} from 'lucide-react';

interface TaiwanPhotoGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectUploadPhoto?: () => void;
}

export const TaiwanPhotoGuideModal: React.FC<TaiwanPhotoGuideModalProps> = ({
  isOpen,
  onClose,
  onSelectUploadPhoto,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-2 border-b border-slate-100 dark:border-slate-800 pb-4 pr-8">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 px-3.5 py-1 rounded-full text-xs font-bold">
            <Camera className="w-4 h-4 text-amber-500" />
            <span>Spesifikasi Foto Paspor & Visa Taiwan (TETO)</span>
          </div>
          <h3 className="text-2xl font-black font-serif text-slate-900 dark:text-white tracking-tight">
            Panduan & Syarat Foto Proses Taiwan (35 x 45 mm)
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            Harap pastikan foto pasfoto yang Anda unggah memenuhi standar internasional TETO Taiwan di bawah ini agar berkas bebas dari penolakan imigrasi.
          </p>
        </div>

        {/* Visual Spec Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {/* Card 1: Ukuran & Waktu */}
          <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/60 space-y-2">
            <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm">
              <Maximize2 className="w-4 h-4 text-amber-500" />
              <span>Ukuran & Format Standard</span>
            </div>
            <ul className="space-y-1.5 text-slate-600 dark:text-slate-300">
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>Ukuran:</strong> 35 x 45 mm (3.5 cm x 4.5 cm).</span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>Latar Belakang:</strong> Putih Polos (tanpa corak/bayangan).</span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>Warna Foto:</strong> Berwarna (bukan Hitam Putih).</span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>Waktu Pengambilan:</strong> Terbaru (maksimal 6 bulan terakhir).</span>
              </li>
            </ul>
          </div>

          {/* Card 2: Pakaian */}
          <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/60 space-y-2">
            <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm">
              <Shirt className="w-4 h-4 text-amber-500" />
              <span>Ketentuan Pakaian</span>
            </div>
            <ul className="space-y-1.5 text-slate-600 dark:text-slate-300">
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span>Pakaian <strong>Formal, rapi & berkerah</strong> (kemeja/blazer).</span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span>Disarankan pakaian <strong>berwarna gelap / bercorak</strong>.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                <span><strong className="text-red-600 dark:text-red-400">Hindari kemeja putih</strong> agar warna pakaian tidak menyatu dengan background putih.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Detailed Face Rules Section */}
        <div className="bg-amber-50/70 dark:bg-amber-950/40 p-4 rounded-2xl border border-amber-200 dark:border-amber-800/60 space-y-3">
          <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200 font-bold text-sm">
            <UserCheck className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>Ketentuan Posisi Wajah & Ekspresi (Wajib)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-700 dark:text-slate-200">
            <div className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
              <span><strong>Arah Pandangan:</strong> Wajah menghadap lurus ke depan kamera.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
              <span><strong>Fokus Foto:</strong> Fokus wajah tajam & terlihat sangat jelas.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
              <span><strong>Telinga:</strong> Kedua daun telinga wajib terlihat jelas.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
              <span><strong>Ekspresi:</strong> Ekspresi netral, mulut tertutup (tidak terlihat gigi/tersenyum lebar).</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
              <span><strong>Make-up:</strong> Tipis & alami (tidak berlebihan/mencolok).</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
              <span><strong>Aksesoris:</strong> Tidak memakai kacamata, topi, atau aksesoris kepala berlebihan.</span>
            </div>
            <div className="flex items-start gap-2 sm:col-span-2 bg-white dark:bg-slate-800 p-2.5 rounded-xl border border-amber-200 dark:border-amber-800/80">
              <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <span><strong>Aturan Bagi Siswa Berjilbab:</strong> Dahi (area kening) wajib terlihat jelas, jilbab polos berwarna gelap, dan bagian wajah/pipi tidak tertutup jilbab berlebih.</span>
            </div>
          </div>
        </div>

        {/* Visual Mock Example Box */}
        <div className="bg-slate-900 text-white p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-18 bg-white rounded-lg p-1 border-2 border-amber-400 shrink-0 flex flex-col items-center justify-center text-slate-800 font-bold text-[9px] text-center shadow-md">
              <div className="w-8 h-10 bg-slate-800 rounded-full mb-1 flex items-center justify-center text-white text-[8px]">
                35x45
              </div>
              <span>BEBAS GIGI</span>
            </div>
            <div>
              <p className="font-bold text-xs text-amber-400">Siap Pasfoto Sesuai Spesifikasi?</p>
              <p className="text-[11px] text-slate-300">
                Lakukan foto di studio foto atau minta bantuan tim tim penata berkas LKP Prospect untuk memastikan kecocokan file.
              </p>
            </div>
          </div>

          {onSelectUploadPhoto && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onSelectUploadPhoto();
              }}
              className="w-full sm:w-auto px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-xs transition flex items-center justify-center gap-2 shrink-0 cursor-pointer shadow-sm"
            >
              <Camera className="w-4 h-4" />
              <span>Unggah Foto Sekarang</span>
            </button>
          )}
        </div>

        {/* Action Footer */}
        <div className="flex justify-end pt-2 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-xl text-xs transition cursor-pointer"
          >
            Tutup Panduan
          </button>
        </div>
      </div>
    </div>
  );
};
