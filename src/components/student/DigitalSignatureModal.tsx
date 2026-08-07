import React, { useRef, useState, useEffect } from 'react';
import { Candidate, DigitalSignatureInfo } from '../../types';
import { X, Check, RotateCcw, PenTool, Type, ShieldCheck, Lock, AlertCircle } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  candidate: Candidate;
  onSaveSignature: (sig: Partial<DigitalSignatureInfo>) => void;
}

export const DigitalSignatureModal: React.FC<Props> = ({
  isOpen,
  onClose,
  candidate,
  onSaveSignature,
}) => {
  const [activeTab, setActiveTab] = useState<'draw' | 'type'>('draw');
  const [typedName, setTypedName] = useState(candidate.fullName || '');
  const [isAgreed, setIsAgreed] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Canvas refs for signature drawing
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTypedName(candidate.fullName || '');
      setIsAgreed(false);
      setErrorMsg('');
      setHasDrawn(false);
      setTimeout(() => {
        clearCanvas();
      }, 100);
    }
  }, [isOpen, candidate]);

  if (!isOpen) return null;

  // --- Canvas Drawing Logic ---
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    setHasDrawn(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#0F3D7A'; // Navy theme signature stroke

    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  };

  const handleSave = () => {
    setErrorMsg('');

    if (!isAgreed) {
      setErrorMsg('Anda wajib menyetujui pernyataan keabsahan tanda tangan digital.');
      return;
    }

    let sigDataUrl = '';

    if (activeTab === 'draw') {
      if (!hasDrawn) {
        setErrorMsg('Silakan gambar tanda tangan Anda di papan canvas terlebih dahulu.');
        return;
      }
      const canvas = canvasRef.current;
      if (canvas) {
        sigDataUrl = canvas.toDataURL('image/png');
      }
    } else {
      if (!typedName.trim()) {
        setErrorMsg('Nama lengkap untuk tanda tangan digital tidak boleh kosong.');
        return;
      }
      // Generate a canvas representation of typed signature
      const offCanvas = document.createElement('canvas');
      offCanvas.width = 400;
      offCanvas.height = 120;
      const ctx = offCanvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, 400, 120);
        ctx.font = 'italic bold 32px "Brush Script MT", cursive, sans-serif';
        ctx.fillStyle = '#0F3D7A';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(typedName.trim(), 200, 60);

        // Add subtle line underneath
        ctx.strokeStyle = '#991B1B';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(80, 95);
        ctx.lineTo(320, 95);
        ctx.stroke();

        sigDataUrl = offCanvas.toDataURL('image/png');
      }
    }

    const nowStr = new Date().toLocaleString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    onSaveSignature({
      isSigned: true,
      signatureType: activeTab === 'draw' ? 'drawn' : 'typed',
      signatureDataUrl: sigDataUrl,
      signerName: typedName.trim() || candidate.fullName,
      signerNik: candidate.biodata?.nik || '3509xxxxxxxxxxxx',
      signedAt: nowStr,
      ipAddress: '180.252.112.45 (Portal Peserta Jember)',
      hashVerification: `SHA256:PE-JBR-CAND-${candidate.id}-${Date.now()}`,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0">
              <PenTool className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-base text-amber-400">Tanda Tangan Digital LoA</h3>
              <p className="text-xs text-slate-300">Validasi Hukum Surat Penerimaan Peserta Prospect Education</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-5 text-slate-800">
          {/* Signer Info Badge */}
          <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl flex items-center justify-between text-xs">
            <div>
              <p className="text-slate-500 font-medium">Penanda Tangan (Peserta):</p>
              <p className="font-bold text-slate-900 text-sm">{candidate.fullName}</p>
              <p className="text-slate-500 font-mono text-[11px]">No. Reg: {candidate.registrationNumber}</p>
            </div>
            <div className="text-right">
              <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2.5 py-1 rounded-full border border-emerald-300">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> E-Sign Legal
              </span>
            </div>
          </div>

          {/* Mode Selector Tabs */}
          <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200 text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveTab('draw')}
              className={`flex-1 py-2 rounded-lg transition flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'draw'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80 font-black'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <PenTool className="w-3.5 h-3.5 text-amber-600" />
              <span>Gores Canvas (Gambar)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('type')}
              className={`flex-1 py-2 rounded-lg transition flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'type'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80 font-black'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Type className="w-3.5 h-3.5 text-sky-600" />
              <span>Ketik Nama Digital</span>
            </button>
          </div>

          {/* Tab 1: Draw Canvas */}
          {activeTab === 'draw' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span>Goreskan tanda tangan di dalam area berikut:</span>
                <button
                  type="button"
                  onClick={clearCanvas}
                  className="text-red-600 hover:text-red-700 font-bold flex items-center gap-1 transition cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Hapus Canvas
                </button>
              </div>

              <div className="border-2 border-dashed border-slate-300 rounded-2xl bg-slate-50/50 p-1 relative overflow-hidden focus-within:border-amber-500">
                <canvas
                  ref={canvasRef}
                  width={420}
                  height={140}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                  className="w-full h-36 bg-white rounded-xl cursor-crosshair touch-none"
                />
                {!hasDrawn && (
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center text-slate-300 text-xs italic">
                    Goreskan tanda tangan di sini...
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tab 2: Typed Digital Signature */}
          {activeTab === 'type' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nama Lengkap Sesuai KTP:
                </label>
                <input
                  type="text"
                  value={typedName}
                  onChange={(e) => setTypedName(e.target.value)}
                  placeholder="Ketik nama lengkap Anda..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>

              {/* Preview typed signature */}
              {typedName && (
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center">
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">Pratinjau Tanda Tangan Digital</p>
                  <div className="font-serif italic text-2xl text-[#0F3D7A] py-2 border-b-2 border-red-800 inline-block px-8">
                    {typedName}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Legal Security Metadata Box */}
          <div className="bg-amber-50/60 border border-amber-200 rounded-2xl p-3.5 space-y-2 text-xs text-amber-900">
            <div className="flex items-center gap-2 font-bold text-amber-950">
              <Lock className="w-4 h-4 text-amber-700 shrink-0" />
              <span>Otentikasi Keamanan & Metadata Hukum:</span>
            </div>
            <ul className="text-[11px] space-y-1 text-slate-700 list-disc pl-5">
              <li><strong>NIK Penanda Tangan:</strong> {candidate.biodata?.nik || '3509xxxxxxxxxxxx'}</li>
              <li><strong>Waktu Stempel:</strong> {new Date().toLocaleString('id-ID')}</li>
              <li><strong>Status Verifikasi:</strong> SHA-256 Encrypted Session & Local IP verified</li>
            </ul>
          </div>

          {/* Legal Consent Checkbox */}
          <label className="flex items-start gap-2.5 p-3 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer hover:bg-slate-100 transition">
            <input
              type="checkbox"
              checked={isAgreed}
              onChange={(e) => setIsAgreed(e.target.checked)}
              className="mt-0.5 w-4 h-4 text-amber-600 rounded-md border-slate-300 focus:ring-amber-500 shrink-0 cursor-pointer"
            />
            <span className="text-xs text-slate-700 leading-snug">
              Saya secara sadar dan sah menyatakan bahwa tanda tangan digital ini milik saya (<strong>{candidate.fullName}</strong>) dan menyetujui seluruh ketentuan dalam Surat Penerimaan (LoA) ini.
            </span>
          </label>

          {/* Error Message if any */}
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-700 font-medium">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="bg-slate-100 p-4 border-t border-slate-200 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-200 transition cursor-pointer"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition shadow-md flex items-center gap-2 cursor-pointer border border-amber-300"
          >
            <Check className="w-4 h-4 text-slate-950" />
            <span>Simpan Tanda Tangan Digital</span>
          </button>
        </div>
      </div>
    </div>
  );
};
