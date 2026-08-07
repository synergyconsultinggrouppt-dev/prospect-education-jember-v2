import React from 'react';
import { AlertTriangle, Trash2, CheckCircle2, XCircle, ShieldAlert, RefreshCw, X } from 'lucide-react';

export interface ConfirmActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'success' | 'info';
  iconType?: 'trash' | 'alert' | 'approve' | 'reject' | 'reset';
  isLoading?: boolean;
}

export const ConfirmActionModal: React.FC<ConfirmActionModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Ya, Lanjutkan',
  cancelText = 'Batal',
  variant = 'danger',
  iconType = 'alert',
  isLoading = false,
}) => {
  if (!isOpen) return null;

  const renderIcon = () => {
    switch (iconType) {
      case 'trash':
        return <Trash2 className="w-6 h-6 text-red-600" />;
      case 'approve':
        return <CheckCircle2 className="w-6 h-6 text-emerald-600" />;
      case 'reject':
        return <XCircle className="w-6 h-6 text-red-600" />;
      case 'reset':
        return <RefreshCw className="w-6 h-6 text-amber-600" />;
      case 'alert':
      default:
        return <AlertTriangle className="w-6 h-6 text-amber-600" />;
    }
  };

  const getHeaderBg = () => {
    switch (variant) {
      case 'danger':
        return 'bg-red-50 border-red-100 text-red-900';
      case 'warning':
        return 'bg-amber-50 border-amber-100 text-amber-900';
      case 'success':
        return 'bg-emerald-50 border-emerald-100 text-emerald-900';
      case 'info':
      default:
        return 'bg-blue-50 border-blue-100 text-blue-900';
    }
  };

  const getConfirmBtnStyle = () => {
    switch (variant) {
      case 'danger':
        return 'bg-red-800 hover:bg-red-900 text-white shadow-md shadow-red-900/20';
      case 'warning':
        return 'bg-amber-600 hover:bg-amber-700 text-white shadow-md shadow-amber-600/20';
      case 'success':
        return 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-md shadow-emerald-700/20';
      case 'info':
      default:
        return 'bg-slate-900 hover:bg-slate-800 text-white shadow-md';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in zoom-in-95 duration-200 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-2xl border shrink-0 ${getHeaderBg()}`}>
            {renderIcon()}
          </div>

          <div className="space-y-1.5 pr-6">
            <h3 className="font-bold text-slate-900 text-base font-serif">{title}</h3>
            <div className="text-xs text-slate-600 leading-relaxed font-sans">{description}</div>
          </div>
        </div>

        <div className="bg-amber-50/60 border border-amber-200/80 rounded-2xl p-3 flex items-center gap-2.5 text-[11px] text-amber-900">
          <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
          <span>Aksi sensitif ini membutuhkan konfirmasi untuk mencegah kesalahan klik.</span>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-bold text-xs transition cursor-pointer"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            disabled={isLoading}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer flex items-center gap-1.5 ${getConfirmBtnStyle()}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
