import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StudentDocument } from '../../types';
import { DocumentChecklist } from './DocumentChecklist';
import { DocumentVerificationModule } from './DocumentVerificationModule';
import { FileUploadZone } from './FileUploadZone';
import {
  Upload,
  CheckCircle2,
  AlertCircle,
  FileText,
  Clock,
  Eye,
  ShieldCheck,
  CheckSquare,
  FolderCheck,
  FileCheck2,
} from 'lucide-react';

export const DocumentUpload: React.FC = () => {
  const { currentCandidate, uploadCandidateDocument, t } = useApp();
  const [subTab, setSubTab] = useState<'upload' | 'verification' | 'checklist'>('upload');

  const documentTypes: { id: StudentDocument['docType']; title: string; required: boolean; desc: string }[] = [
    { id: 'ktp', title: 'Fotokopi / Scan KTP Peserta', required: true, desc: 'Format PDF/JPG, maksimal 5MB. NIK terlihat jelas.' },
    { id: 'ijazah', title: 'Ijazah / SKL Legalisir', required: true, desc: 'Scan Ijazah SMA/SMK/S1 beserta transkrip nilai.' },
    { id: 'pasfoto', title: 'Pasfoto Terbaru (4x6)', required: true, desc: 'Background putih polos, berpakaian rapi kemeja.' },
    { id: 'paspor', title: 'Paspor Aktif (Opsional)', required: false, desc: 'Scan halaman depan paspor yang masih berlaku min. 18 bulan.' },
    { id: 'kk', title: 'Kartu Keluarga (KK)', required: true, desc: 'Scan KK keluarga asal peserta.' },
    { id: 'surat_izin', title: 'Surat Izin Orang Tua / Wali', required: true, desc: 'Surat bermaterai ditandatangan orang tua.' },
  ];

  return (
    <div className="space-y-6">
      {/* Sub-navigation selector */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap sm:flex-nowrap items-center gap-2">
        <button
          type="button"
          onClick={() => setSubTab('upload')}
          className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer ${
            subTab === 'upload'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Upload className="w-4 h-4 text-amber-400" />
          <span>{t('Upload & File Drop Zone', 'Upload & File Drop Zone')}</span>
        </button>

        <button
          type="button"
          onClick={() => setSubTab('verification')}
          className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer ${
            subTab === 'verification'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>{t('Status & Modul Verifikasi Agensi', 'Agency Document Verification')}</span>
        </button>

        <button
          type="button"
          onClick={() => setSubTab('checklist')}
          className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer ${
            subTab === 'checklist'
              ? 'bg-red-800 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FolderCheck className="w-4 h-4 text-amber-300" />
          <span>{t('Checklist Berkas Fisik', 'Physical Folder Checklist')}</span>
        </button>
      </div>

      {subTab === 'upload' ? (
        <FileUploadZone />
      ) : subTab === 'verification' ? (
        <DocumentVerificationModule />
      ) : (
        <DocumentChecklist />
      )}
    </div>
  );
};

