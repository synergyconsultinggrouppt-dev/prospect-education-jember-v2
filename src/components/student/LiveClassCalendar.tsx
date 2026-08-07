import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Calendar as CalendarIcon,
  Video,
  Bell,
  BellRing,
  Clock,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  CheckCircle2,
  Sparkles,
  Users,
  AlertCircle,
  Globe,
} from 'lucide-react';

export interface LiveSession {
  id: string;
  title: string;
  language: 'Mandarin' | 'Inggris' | 'Jepang';
  instructor: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  platform: 'Zoom' | 'Google Meet';
  meetingUrl: string;
  meetingId?: string;
  passcode?: string;
  description: string;
  isLiveNow?: boolean;
}

const mockSessions: LiveSession[] = [
  {
    id: 'ls-1',
    title: 'Pembekalan Mandarin Basic: Pinyin, Bopomofo & Percakapan Harian',
    language: 'Mandarin',
    instructor: 'Laoshi Chen Mei-Ling & Huang Laoshi',
    date: new Date().toISOString().split('T')[0], // Hari ini
    startTime: '19:00',
    endTime: '20:30',
    platform: 'Zoom',
    meetingUrl: 'https://zoom.us/j/8923412341',
    meetingId: '892 341 2341',
    passcode: 'PROSPECT2026',
    description: 'Sesi latihan pengenalan nada (tones), Zhuyin/Pinyin dasar, dan percakapan harian untuk persiapan pendaftar Taiwan IFP 1+4.',
    isLiveNow: true,
  },
  {
    id: 'ls-2',
    title: 'Pembekalan Bahasa Inggris Basic: Komunikasi & Orientasi Kampus',
    language: 'Inggris',
    instructor: 'Mr. David & Ms. Sarah',
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Besok
    startTime: '16:00',
    endTime: '17:30',
    platform: 'Google Meet',
    meetingUrl: 'https://meet.google.com/abc-defg-hij',
    description: 'Panduan percakapan dasar Bahasa Inggris untuk komunikasi awal, adaptasi orientasi kampus, dan perkuliahan di Taiwan.',
  },
  {
    id: 'ls-3',
    title: 'Pengenalan Budaya, Etika Kampus & Kehidupan di Taiwan',
    language: 'Mandarin',
    instructor: 'Laoshi Chen Mei-Ling',
    date: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0],
    startTime: '19:00',
    endTime: '20:30',
    platform: 'Zoom',
    meetingUrl: 'https://zoom.us/j/9912388123',
    meetingId: '991 238 8123',
    passcode: 'TAIWAN2026',
    description: 'Orientasi budaya, norma sosial, dan tips kehidupan mahasiswa 1 tahun pertama persiapan bahasa di Taiwan.',
  },
  {
    id: 'ls-4',
    title: 'Persiapan Percakapan Kaiwa (会話) Level N5-N4 (Program Jepang)',
    language: 'Jepang',
    instructor: 'Sensei Kenjiro & Tanaka-san',
    date: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
    startTime: '18:30',
    endTime: '20:00',
    platform: 'Google Meet',
    meetingUrl: 'https://meet.google.com/xyz-uvwx-rst',
    description: 'Sesi latihan wawancara kerja (Mensaetsu) & tata bahasa dasar kerja di Jepang untuk pendaftar IM Japan / SSW.',
  },
];

export const LiveClassCalendar: React.FC = () => {
  const { currentCandidate } = useApp();
  const isTaiwanCandidate = currentCandidate?.selectedProgram?.startsWith('taiwan');

  const defaultLangFilter = isTaiwanCandidate ? 'Mandarin' : 'Semua';
  const [selectedLanguage, setSelectedLanguage] = useState<string>(defaultLangFilter);
  const [reminders, setReminders] = useState<Record<string, boolean>>({
    'ls-1': true,
  });
  const [activeTab, setActiveTab] = useState<'jadwal' | 'kalender'>('jadwal');
  const [alarmNotification, setAlarmNotification] = useState<string | null>(null);

  const toggleReminder = (sessionId: string, sessionTitle: string) => {
    const nextState = !reminders[sessionId];
    setReminders((prev) => ({
      ...prev,
      [sessionId]: nextState,
    }));

    if (nextState) {
      setAlarmNotification(`Pengingat aktif untuk: "${sessionTitle}". Alarm akan berbunyi 15 menit sebelum sesi dimulai.`);
      if ('Notification' in window && Notification.permission !== 'granted') {
        Notification.requestPermission();
      }
    } else {
      setAlarmNotification(`Pengingat dibatalkan untuk: "${sessionTitle}".`);
    }

    setTimeout(() => {
      setAlarmNotification(null);
    }, 4000);
  };

  const candidateSessions = mockSessions.filter((s) => {
    if (isTaiwanCandidate) {
      return s.language === 'Mandarin' || s.language === 'Inggris';
    } else {
      return s.language === 'Jepang';
    }
  });

  const filteredSessions = candidateSessions.filter((s) => {
    if (selectedLanguage === 'Semua') return true;
    return s.language === selectedLanguage;
  });

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 bg-red-50 text-red-800 px-3 py-1 rounded-full text-xs font-bold border border-red-200">
            <Video className="w-3.5 h-3.5 text-red-600 animate-pulse" />
            <span>SESI LIVE CLASS PEMBEKALAN BAHASA</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-serif">
            Jadwal Sesi Tatap Muka Online (Zoom / Meet)
          </h2>
          <p className="text-xs text-slate-500">
            Ikuti sesi interaktif Mandarin Basic, Inggris Basic, & Budaya Taiwan bersama instruktur LPK Prospect Education Jember.
          </p>
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-1 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shrink-0">
          <button
            onClick={() => setActiveTab('jadwal')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition ${
              activeTab === 'jadwal'
                ? 'bg-white text-red-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Daftar Sesi
          </button>
          <button
            onClick={() => setActiveTab('kalender')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition ${
              activeTab === 'kalender'
                ? 'bg-white text-red-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Kalender Mingguan
          </button>
        </div>
      </div>

      {/* Alarm Notification Banner */}
      {alarmNotification && (
        <div className="bg-amber-50 border border-amber-300 text-amber-900 p-4 rounded-2xl flex items-center justify-between gap-3 text-xs font-semibold animate-in fade-in">
          <div className="flex items-center gap-2.5">
            <BellRing className="w-5 h-5 text-amber-700 shrink-0" />
            <span>{alarmNotification}</span>
          </div>
        </div>
      )}

      {/* Language Filter Chips */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold text-slate-500 mr-2 flex items-center gap-1">
          <Globe className="w-3.5 h-3.5" /> Filter Program:
        </span>
        {['Semua', 'Mandarin', 'Inggris', 'Jepang'].map((lang) => (
          <button
            key={lang}
            onClick={() => setSelectedLanguage(lang)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition border ${
              selectedLanguage === lang
                ? 'bg-slate-950 text-amber-400 border-amber-500/40 shadow-xs'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border-slate-200'
            }`}
          >
            {lang === 'Semua'
              ? '🌐 Semua Bahasa'
              : lang === 'Mandarin'
              ? '🇹🇼 Mandarin Basic (Taiwan)'
              : lang === 'Inggris'
              ? '🔤 Inggris Basic'
              : '🇯🇵 Bahasa Jepang'}
          </button>
        ))}
      </div>

      {/* Tab 1: Daftar Sesi Card Grid */}
      {activeTab === 'jadwal' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredSessions.map((session) => {
            const hasReminder = reminders[session.id] || false;

            return (
              <div
                key={session.id}
                className={`relative rounded-3xl p-6 border transition-all ${
                  session.isLiveNow
                    ? 'bg-gradient-to-br from-red-950 via-slate-900 to-slate-950 border-amber-500/50 text-white shadow-xl ring-2 ring-red-500/30'
                    : 'bg-white border-slate-200 hover:border-slate-300 text-slate-900 shadow-xs'
                }`}
              >
                {/* Live Badge */}
                {session.isLiveNow && (
                  <div className="absolute top-4 right-4 inline-flex items-center gap-1.5 bg-red-600 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-md animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                    <span>SEDANG BERLANGSUNG</span>
                  </div>
                )}

                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                        session.isLiveNow
                          ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                          : 'bg-red-50 text-red-800 border border-red-200'
                      }`}
                    >
                      Bahasa {session.language}
                    </span>
                    <span
                      className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                        session.isLiveNow
                          ? 'bg-slate-800 text-slate-300'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {session.platform}
                    </span>
                  </div>

                  <div>
                    <h3
                      className={`text-base font-bold font-serif ${
                        session.isLiveNow ? 'text-white' : 'text-slate-900'
                      }`}
                    >
                      {session.title}
                    </h3>
                    <p
                      className={`text-xs mt-1 ${
                        session.isLiveNow ? 'text-slate-300' : 'text-slate-500'
                      }`}
                    >
                      Instruktur: <span className="font-semibold">{session.instructor}</span>
                    </p>
                  </div>

                  <p
                    className={`text-xs leading-relaxed ${
                      session.isLiveNow ? 'text-slate-300' : 'text-slate-600'
                    }`}
                  >
                    {session.description}
                  </p>

                  {/* Time & Meeting Info */}
                  <div
                    className={`p-3.5 rounded-2xl text-xs space-y-1.5 border ${
                      session.isLiveNow
                        ? 'bg-slate-900/90 border-slate-800 text-slate-200'
                        : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold">
                      <span className="flex items-center gap-1.5">
                        <CalendarIcon className="w-3.5 h-3.5 text-amber-500" />
                        <span>Tanggal: {session.date}</span>
                      </span>
                      <span className="flex items-center gap-1.5 text-red-600">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{session.startTime} - {session.endTime} WIB</span>
                      </span>
                    </div>

                    {session.meetingId && (
                      <p className="text-[11px] font-mono text-slate-400">
                        ID Sesi: {session.meetingId} • Passcode: {session.passcode}
                      </p>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-2 flex items-center justify-between gap-3">
                    {/* Alarm Toggle Button */}
                    <button
                      type="button"
                      onClick={() => toggleReminder(session.id, session.title)}
                      className={`px-3.5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border ${
                        hasReminder
                          ? 'bg-amber-500 text-slate-950 border-amber-400 font-extrabold shadow-sm'
                          : session.isLiveNow
                          ? 'bg-slate-800 hover:bg-slate-700 text-amber-300 border-slate-700'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
                      }`}
                      title={hasReminder ? 'Pengingat aktif' : 'Setel pengingat sebelum sesi'}
                    >
                      {hasReminder ? (
                        <>
                          <BellRing className="w-4 h-4 text-slate-950" />
                          <span>Pengingat Aktif</span>
                        </>
                      ) : (
                        <>
                          <Bell className="w-4 h-4 text-amber-600" />
                          <span>Setel Alarm (15m)</span>
                        </>
                      )}
                    </button>

                    {/* Join Link */}
                    <a
                      href={session.meetingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md ${
                        session.isLiveNow
                          ? 'bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700 text-white'
                          : 'bg-slate-900 hover:bg-slate-800 text-white'
                      }`}
                    >
                      <Video className="w-4 h-4" />
                      <span>Masuk Sesi {session.platform}</span>
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 2: Kalender Mingguan Simple View */}
      {activeTab === 'kalender' && (
        <div className="space-y-4">
          <div className="bg-slate-900 text-white p-4 rounded-2xl flex items-center justify-between text-xs font-bold">
            <span className="flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-amber-400" />
              <span>Minggu Ini - Juli / Agustus 2026</span>
            </span>
            <span className="text-amber-300 font-mono">4 Sesi Terjadwal</span>
          </div>

          <div className="border border-slate-200 rounded-2xl divide-y divide-slate-100 overflow-hidden bg-white">
            {filteredSessions.map((session, idx) => (
              <div
                key={session.id}
                className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50 transition"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-800 border border-red-200 flex flex-col items-center justify-center shrink-0 font-bold">
                    <span className="text-[10px] text-red-600 uppercase">
                      {new Date(session.date).toLocaleDateString('id-ID', { weekday: 'short' })}
                    </span>
                    <span className="text-sm font-black font-mono">
                      {new Date(session.date).getDate()}
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-md">
                        Bahasa {session.language}
                      </span>
                      <span className="text-xs font-mono font-bold text-slate-500">
                        {session.startTime} WIB
                      </span>
                    </div>
                    <h4 className="font-bold text-xs text-slate-900 mt-1">{session.title}</h4>
                    <p className="text-[11px] text-slate-500">{session.instructor} • {session.platform}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <button
                    type="button"
                    onClick={() => toggleReminder(session.id, session.title)}
                    className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 transition"
                    title="Toggle Alarm"
                  >
                    {reminders[session.id] ? (
                      <BellRing className="w-4 h-4 text-amber-600" />
                    ) : (
                      <Bell className="w-4 h-4 text-slate-400" />
                    )}
                  </button>

                  <a
                    href={session.meetingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition inline-flex items-center gap-1"
                  >
                    <span>Link Zoom</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
