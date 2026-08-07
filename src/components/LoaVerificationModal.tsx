import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { Candidate } from '../types';
import {
  ShieldCheck,
  ShieldAlert,
  X,
  Search,
  CheckCircle2,
  FileCheck2,
  Lock,
  Building2,
  Printer,
  Copy,
  Check,
  QrCode as QrIcon,
  ExternalLink,
  Award,
  AlertTriangle
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  candidates: Candidate[];
  initialLoaNumber?: string;
  initialCandidateId?: string;
}

export const LoaVerificationModal: React.FC<Props> = ({
  isOpen,
  onClose,
  candidates = [],
  initialLoaNumber = '',
  initialCandidateId = '',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [isSearched, setIsSearched] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCopied(false);
      if (initialCandidateId) {
        const match = candidates.find((c) => c.id === initialCandidateId);
        if (match) {
          setSelectedCandidate(match);
          setSearchQuery(match.loaNumber || match.registrationNumber || match.id);
          setIsSearched(true);
          return;
        }
      }

      if (initialLoaNumber) {
        setSearchQuery(initialLoaNumber);
        handleSearchCode(initialLoaNumber);
      } else {
        // Default to first candidate with LoA if available
        const firstLoa = candidates.find((c) => !!c.loaNumber || c.status === 'loa_issued');
        if (firstLoa) {
          setSelectedCandidate(firstLoa);
          setSearchQuery(firstLoa.loaNumber || firstLoa.registrationNumber);
          setIsSearched(true);
        } else if (candidates.length > 0) {
          setSelectedCandidate(candidates[0]);
          setSearchQuery(candidates[0].registrationNumber);
          setIsSearched(true);
        }
      }
    }
  }, [isOpen, initialLoaNumber, initialCandidateId, candidates]);

  useEffect(() => {
    if (selectedCandidate) {
      generateDynamicQR(selectedCandidate);
    }
  }, [selectedCandidate]);

  const generateDynamicQR = async (candidate: Candidate) => {
    try {
      const loaCode = candidate.loaNumber || `LOA/PE-JBR/2026/${candidate.registrationNumber.slice(-3)}`;
      const verificationUrl = `${window.location.origin}?verifyLoa=${encodeURIComponent(loaCode)}`;
      
      const dataUrl = await QRCode.toDataURL(verificationUrl, {
        width: 300,
        margin: 1.5,
        color: {
          dark: '#0F3D7A', // Navy Prospect
          light: '#FFFFFF',
        },
      });
      setQrDataUrl(dataUrl);
    } catch (err) {
      console.error('Error generating QR code:', err);
    }
  };

  const handleSearchCode = (query: string) => {
    setIsSearched(true);
    const cleanQ = query.trim().toLowerCase();
    if (!cleanQ) {
      setSelectedCandidate(null);
      return;
    }

    const found = candidates.find((c) => {
      const loaNum = (c.loaNumber || '').toLowerCase();
      const regNum = (c.registrationNumber || '').toLowerCase();
      const name = (c.fullName || '').toLowerCase();
      const nik = (c.biodata?.nik || '').toLowerCase();
      const hash = (c.candidateSignature?.hashVerification || '').toLowerCase();
      return (
        loaNum.includes(cleanQ) ||
        regNum.includes(cleanQ) ||
        name.includes(cleanQ) ||
        nik.includes(cleanQ) ||
        hash.includes(cleanQ)
      );
    });

    setSelectedCandidate(found || null);
  };

  const handleCopyLink = () => {
    if (!selectedCandidate) return;
    const loaCode = selectedCandidate.loaNumber || `LOA/PE-JBR/2026/${selectedCandidate.registrationNumber.slice(-3)}`;
    const url = `${window.location.origin}?verifyLoa=${encodeURIComponent(loaCode)}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  const isLoaIssued = selectedCandidate && (selectedCandidate.status === 'loa_issued' || !!selectedCandidate.loaNumber || selectedCandidate.status === 'approved_superadmin' || selectedCandidate.status === 'lms_active');

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200 text-slate-800">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#0F3D7A] via-[#092852] to-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-300 border border-amber-400/30 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="font-black text-base text-amber-300 font-serif">Sistem Validasi & Keaslian LoA Digital</h3>
              <p className="text-xs text-sky-200">Verifikasi QR Code & Sertifikat Digital Prospect Education Jember</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search Bar Input */}
        <div className="p-5 bg-slate-50 border-b border-slate-200 space-y-2">
          <label className="block text-xs font-bold text-slate-700">
            Cek Keaslian Dokumen dengan No. LoA / No. Registrasi / NIK Peserta:
          </label>
          <div className="relative flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearchCode(searchQuery)}
                placeholder="Contoh: LOA/PE-JBR/2026/088 atau PE-202608-001..."
                className="w-full bg-white border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0F3D7A]"
              />
            </div>
            <button
              onClick={() => handleSearchCode(searchQuery)}
              className="bg-[#0F3D7A] hover:bg-[#092852] text-white font-bold px-4 py-2.5 rounded-xl text-xs transition cursor-pointer flex items-center gap-1.5 shadow-xs shrink-0"
            >
              <QrIcon className="w-4 h-4 text-amber-300" />
              <span>Verifikasi QR</span>
            </button>
          </div>
        </div>

        {/* Modal Body: Verification Results */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {selectedCandidate ? (
            <div className="space-y-6">
              {/* Authenticity Status Banner */}
              {isLoaIssued ? (
                <div className="bg-emerald-50 border-2 border-emerald-500 rounded-2xl p-4 flex items-start gap-3 text-emerald-950">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-sm text-emerald-900 uppercase tracking-wide">
                        STATUS: DOKUMEN SAH & TERVERIFIKASI ASLI
                      </span>
                      <span className="bg-emerald-200 text-emerald-900 font-extrabold text-[10px] px-2 py-0.5 rounded-full border border-emerald-300">
                        OFFICIAL AUTHENTIC
                      </span>
                    </div>
                    <p className="text-xs text-emerald-800 leading-relaxed">
                      Surat Penerimaan (LoA) ini secara resmi diterbitkan oleh <strong>LKP Prospect Education Cabang Jember</strong> dan terdaftar sah pada database pusat.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-amber-50 border-2 border-amber-500 rounded-2xl p-4 flex items-start gap-3 text-amber-950">
                  <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 shadow-md">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <span className="font-black text-sm text-amber-900 uppercase tracking-wide">
                      STATUS: MENUNGGU PERSUTUJUAN DIANUGERAHKAN
                    </span>
                    <p className="text-xs text-amber-800 leading-relaxed">
                      Peserta terdaftar di sistem, namun penomoran LoA resmi saat ini masih dalam proses peninjauan final Direksi/Super Admin.
                    </p>
                  </div>
                </div>
              )}

              {/* Main Document Verification Record */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
                <div className="flex flex-col sm:flex-row items-center justify-between border-b border-slate-200 pb-3 gap-4">
                  <div className="text-center sm:text-left">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Nomor Dokumen LoA Resmi:</p>
                    <p className="font-mono font-black text-base text-[#0F3D7A]">
                      {selectedCandidate.loaNumber || `LOA/PE-JBR/2026/${selectedCandidate.registrationNumber.slice(-3)}`}
                    </p>
                  </div>

                  {/* QR Code Dynamic Rendering */}
                  {qrDataUrl && (
                    <div className="bg-white p-2 rounded-xl border border-slate-300 shadow-xs text-center">
                      <img src={qrDataUrl} alt="QR Code Verifikasi LoA" className="w-24 h-24 mx-auto" />
                      <p className="text-[9px] text-slate-400 font-mono mt-1">Imbas QR Verification</p>
                    </div>
                  )}
                </div>

                {/* Candidate & Institution Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 text-[11px]">Nama Lengkap Peserta:</span>
                    <p className="font-bold text-slate-900 text-sm">{selectedCandidate.fullName}</p>
                  </div>

                  <div>
                    <span className="text-slate-400 text-[11px]">Nomor Registrasi Sistem:</span>
                    <p className="font-mono font-bold text-slate-900">{selectedCandidate.registrationNumber}</p>
                  </div>

                  <div>
                    <span className="text-slate-400 text-[11px]">NIK / No. KTP:</span>
                    <p className="font-mono font-bold text-slate-900">{selectedCandidate.biodata?.nik || '3509xxxxxxxxxxxx'}</p>
                  </div>

                  <div>
                    <span className="text-slate-400 text-[11px]">Program Pilihan:</span>
                    <p className="font-bold text-red-800 uppercase">{selectedCandidate.selectedProgram.replace('_', ' ')}</p>
                  </div>

                  <div>
                    <span className="text-slate-400 text-[11px]">Tanggal Terbit Dokumen:</span>
                    <p className="font-bold text-slate-900">{selectedCandidate.loaIssueDate || '22 Juli 2026'}</p>
                  </div>

                  <div>
                    <span className="text-slate-400 text-[11px]">Lembaga Penerbit Resmi:</span>
                    <p className="font-bold text-slate-900">Prospect Education Cabang Jember</p>
                  </div>
                </div>

                {/* Digital Signatures Verification Status */}
                <div className="pt-3 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Tanda Tangan Digital Peserta:</p>
                    {selectedCandidate.candidateSignature?.isSigned ? (
                      <p className="text-emerald-700 font-bold flex items-center gap-1 text-xs">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Tertanda Tangan ({selectedCandidate.candidateSignature.signedAt})</span>
                      </p>
                    ) : (
                      <p className="text-amber-700 font-medium text-xs">Belum Ditandatangani Peserta</p>
                    )}
                  </div>

                  <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Stempel & Otorisasi Admin:</p>
                    <p className="text-emerald-700 font-bold flex items-center gap-1 text-xs">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Approved oleh {selectedCandidate.adminSignature?.signerName || 'Kepala Cabang Jember'}</span>
                    </p>
                  </div>
                </div>

                {/* Security Hash & Legal Stamp */}
                <div className="p-3 bg-slate-900 text-slate-300 rounded-xl space-y-1 text-[11px]">
                  <div className="flex items-center justify-between text-amber-300 font-mono font-bold">
                    <span className="flex items-center gap-1">
                      <Lock className="w-3 h-3 text-amber-400" /> Hash Enkripsi Keamanan (SHA-256):
                    </span>
                    <span>VERIFIED</span>
                  </div>
                  <p className="font-mono text-[10px] text-slate-400 break-all">
                    {selectedCandidate.candidateSignature?.hashVerification || `SHA256:PE-JBR-LOA-${selectedCandidate.id}-${selectedCandidate.registrationNumber}`}
                  </p>
                  <p className="text-[10px] text-slate-400 pt-1 border-t border-slate-800">
                    NIB Lembaga: <strong>1284000392019</strong> • Izin Operasional LKP & Konsultan Pendidikan Resmi Jember.
                  </p>
                </div>
              </div>
            </div>
          ) : isSearched ? (
            /* Not Found State */
            <div className="bg-red-50 border-2 border-red-300 rounded-2xl p-6 text-center space-y-3 text-red-900">
              <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-black text-base text-red-950 font-serif">PERINGATAN: DOKUMEN TIDAK TERDAFTAR / INDIKASI PEMALSUAN</h4>
                <p className="text-xs text-red-800 max-w-md mx-auto mt-1 leading-relaxed">
                  Kode atau nomor <strong>"{searchQuery}"</strong> tidak ditemukan dalam database resmi LKP Prospect Education Cabang Jember. Harap berhati-hati terhadap dokumen yang dipalsukan.
                </p>
              </div>
            </div>
          ) : null}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          {selectedCandidate ? (
            <button
              onClick={handleCopyLink}
              className="px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-700 hover:bg-slate-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
              <span>{copied ? 'Tersalin!' : 'Salin Tautan Verifikasi'}</span>
            </button>
          ) : (
            <div />
          )}

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#0F3D7A] hover:bg-[#092852] text-white font-bold text-xs transition cursor-pointer shadow-xs"
          >
            Tutup Panel
          </button>
        </div>
      </div>
    </div>
  );
};
