import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Bell,
  CheckCircle2,
  FileCheck,
  Megaphone,
  Award,
  CreditCard,
  AlertCircle,
  X,
  CheckCheck,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

export const NotificationBell: React.FC<{ className?: string }> = ({ className = '' }) => {
  const {
    t,
    language,
    notifications,
    unreadNotificationsCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    setActiveTab,
    currentCandidate,
  } = useApp();

  const [isOpen, setIsOpen] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'verification' | 'announcement'>('all');
  const popoverRef = useRef<HTMLDivElement>(null);

  // Close popover when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  // Filter notifications relevant to current candidate or global announcements
  const filteredNotifs = notifications.filter((n) => {
    // If notification has a specific candidateId, only show if it matches current student candidate
    if (n.candidateId && currentCandidate && n.candidateId !== currentCandidate.id) {
      return false;
    }
    if (filterType === 'verification') return n.type === 'verification';
    if (filterType === 'announcement') return n.type === 'announcement';
    return true;
  });

  // Calculate unread count synchronized with current student / global view
  const relevantUnreadCount = notifications.filter((n) => {
    if (n.isRead) return false;
    if (n.candidateId && currentCandidate && n.candidateId !== currentCandidate.id) {
      return false;
    }
    return true;
  }).length;

  const getIcon = (type: string, isRead: boolean) => {
    switch (type) {
      case 'verification':
        return (
          <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
            <FileCheck className="w-4 h-4" />
          </div>
        );
      case 'announcement':
        return (
          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
            <Megaphone className="w-4 h-4" />
          </div>
        );
      case 'loa':
        return (
          <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
            <Award className="w-4 h-4" />
          </div>
        );
      case 'payment':
        return (
          <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
            <CreditCard className="w-4 h-4" />
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
            <Bell className="w-4 h-4" />
          </div>
        );
    }
  };

  const handleNotificationClick = (id: string, linkTab?: string) => {
    markNotificationAsRead(id);
    setIsOpen(false);
    if (linkTab) {
      setActiveTab(linkTab);
    }
  };

  return (
    <div className={`relative inline-block ${className}`} ref={popoverRef}>
      {/* Bell Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-controls="notification-popover"
        className="relative p-2 sm:p-2.5 rounded-xl text-slate-700 dark:text-slate-200 hover:text-[#0F3D7A] dark:hover:text-amber-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all focus-visible:ring-2 focus-visible:ring-[#0F3D7A] focus-visible:outline-hidden cursor-pointer"
        title={t('Notifikasi & Alert', 'Notifications & Alerts')}
        aria-label={`${t('Notifikasi & Alert', 'Notifications & Alerts')} (${relevantUnreadCount} belum dibaca)`}
      >
        <Bell className="w-4.5 h-4.5 sm:w-5 sm:h-5" aria-hidden="true" />
        {relevantUnreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-red-600 text-[10px] font-black text-white items-center justify-center shadow-xs">
              {relevantUnreadCount > 9 ? '9+' : relevantUnreadCount}
            </span>
          </span>
        )}
      </button>

      {/* Notification Dropdown Popover */}
      {isOpen && (
        <div
          id="notification-popover"
          role="dialog"
          aria-label={t('Pemberitahuan & Alert', 'Notifications & Alerts')}
          className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
        >
          {/* Header */}
          <div className="p-4 bg-[#0F3D7A] text-white flex items-center justify-between border-b border-blue-900">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-blue-500/30 text-amber-300 rounded-lg">
                <Bell className="w-4 h-4" aria-hidden="true" />
              </div>
              <div>
                <h4 className="font-bold text-sm leading-tight">
                  {t('Pemberitahuan & Alert', 'Notifications & Alerts')}
                </h4>
                <p className="text-[11px] text-blue-200">
                  Prospect Education Jember
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {unreadNotificationsCount > 0 && (
                <button
                  onClick={markAllNotificationsAsRead}
                  aria-label={t('Tandai semua notifikasi telah dibaca', 'Mark all notifications as read')}
                  className="text-[11px] text-emerald-300 hover:text-white font-medium flex items-center gap-1 bg-emerald-900/60 hover:bg-emerald-800/60 px-2 py-1 rounded-lg transition focus-visible:ring-1 focus-visible:ring-emerald-400"
                  title={t('Tandai semua dibaca', 'Mark all as read')}
                >
                  <CheckCheck className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{t('Dibaca Semua', 'Mark Read')}</span>
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                aria-label={t('Tutup notifikasi', 'Close notifications')}
                className="text-blue-200 hover:text-white p-1 rounded-lg hover:bg-blue-800/50 transition focus-visible:ring-1 focus-visible:ring-white"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="px-4 py-2 bg-slate-50 border-b border-slate-200 flex items-center gap-1.5 text-xs overflow-x-auto" role="tablist" aria-label="Filter notifikasi">
            <button
              onClick={() => setFilterType('all')}
              role="tab"
              aria-selected={filterType === 'all'}
              className={`px-3 py-1 rounded-full font-medium transition focus-visible:ring-2 focus-visible:ring-[#0F3D7A] ${
                filterType === 'all'
                  ? 'bg-[#0F3D7A] text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              {t('Semua', 'All')} ({notifications.length})
            </button>
            <button
              onClick={() => setFilterType('verification')}
              role="tab"
              aria-selected={filterType === 'verification'}
              className={`px-3 py-1 rounded-full font-medium transition focus-visible:ring-2 focus-visible:ring-[#0F3D7A] ${
                filterType === 'verification'
                  ? 'bg-[#0F3D7A] text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              {t('Verifikasi', 'Verification')}
            </button>
            <button
              onClick={() => setFilterType('announcement')}
              role="tab"
              aria-selected={filterType === 'announcement'}
              className={`px-3 py-1 rounded-full font-medium transition focus-visible:ring-2 focus-visible:ring-[#0F3D7A] ${
                filterType === 'announcement'
                  ? 'bg-[#0F3D7A] text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              {t('Pengumuman', 'Announcements')}
            </button>
          </div>

          {/* Notification List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
            {filteredNotifs.length === 0 ? (
              <div className="p-8 text-center text-slate-400 space-y-2">
                <Bell className="w-8 h-8 mx-auto text-slate-300 stroke-[1.5]" />
                <p className="text-xs font-medium">
                  {t('Tidak ada notifikasi saat ini.', 'No notifications right now.')}
                </p>
              </div>
            ) : (
              filteredNotifs.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleNotificationClick(item.id, item.linkTab)}
                  className={`p-3.5 flex items-start gap-3 hover:bg-slate-50 transition cursor-pointer relative group ${
                    !item.isRead ? 'bg-amber-50/40' : ''
                  }`}
                >
                  {!item.isRead && (
                    <span className="absolute left-2 top-4 w-2 h-2 rounded-full bg-red-600"></span>
                  )}
                  <div className="pl-1">{getIcon(item.type, item.isRead)}</div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between gap-1">
                      <h5
                        className={`text-xs leading-snug ${
                          !item.isRead ? 'font-bold text-slate-900' : 'font-semibold text-slate-700'
                        }`}
                      >
                        {language === 'en' ? item.titleEn : item.titleId}
                      </h5>
                      <span className="text-[10px] text-slate-400 shrink-0 font-medium">
                        {item.timestamp}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                      {language === 'en' ? item.messageEn : item.messageId}
                    </p>
                    {item.linkTab && (
                      <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-red-600 group-hover:underline pt-0.5">
                        {t('Lihat rincian', 'View details')}
                        <ChevronRight className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-2.5 bg-slate-50 border-t border-slate-200 text-center">
            <button
              onClick={() => {
                setActiveTab('berita');
                setIsOpen(false);
              }}
              className="text-xs font-bold text-red-600 hover:text-red-700 transition"
            >
              {t('Lihat Seluruh Pengumuman & Berita', 'View All News & Announcements')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
