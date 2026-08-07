import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { ProgramType } from '../../types';
import {
  MessageSquare,
  Send,
  Video,
  Calendar,
  Clock,
  Award,
  Star,
  CheckCircle2,
  Sparkles,
  UserCheck,
  PhoneCall,
  Paperclip,
  Smile,
  ChevronRight,
  BookOpen,
  GraduationCap,
  Info,
  X,
  HelpCircle,
  FileText,
  BadgeCheck,
  Bot,
  Zap,
} from 'lucide-react';

export interface InstructorMentor {
  id: string;
  name: string;
  title: string;
  specialty: string;
  programType: ProgramType | 'all';
  avatarUrl: string;
  rating: number;
  reviewCount: number;
  status: 'online' | 'busy' | 'offline';
  statusText: string;
  bio: string;
  education: string;
  officeHours: string;
  responseTime: string;
  isPrimaryAssigned?: boolean;
}

export interface ChatMessageItem {
  id: string;
  sender: 'student' | 'mentor';
  senderName: string;
  text: string;
  timestamp: string;
  topicTag?: string;
  isRead?: boolean;
}

export const MentorConnect: React.FC = () => {
  const { currentCandidate, t } = useApp();

  // Instructors list tailored for LPK Prospect Jember
  const mentorsList: InstructorMentor[] = [
    {
      id: 'mentor-01',
      name: 'Laoshi Chen Mei-Ling, M.Ed.',
      title: 'Instruktur Utama Bahasa Mandarin & Beasiswa Taiwan',
      specialty: 'TOCFL A1-B2, Persiapan Wawancara TETO & Essai Beasiswa',
      programType: 'taiwan_ifp',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
      rating: 4.98,
      reviewCount: 142,
      status: 'online',
      statusText: 'Online • Siap Berkonsultasi',
      bio: 'Lulusan Master Education National Taiwan Normal University (NTNU). Membimbing lebih dari 350+ mahasiswa Indonesia lolos Beasiswa Taiwan IFP & 4+1.',
      education: 'M.Ed. NTNU Taipei, Taiwan',
      officeHours: 'Senin - Jumat (09.00 - 17.00 WIB)',
      responseTime: '< 10 Menit',
      isPrimaryAssigned: currentCandidate?.selectedProgram?.includes('taiwan') ?? true,
    },
    {
      id: 'mentor-02',
      name: 'Sensei Kenji Sato, S.S.',
      title: 'Head Instructor Bahasa Jepang & Tokutei Ginou',
      specialty: 'JLPT N5-N3, JFT-Basic & Percakapan Kaiwa Industri',
      programType: 'japan_ssw',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
      rating: 4.95,
      reviewCount: 188,
      status: 'online',
      statusText: 'Online • Di Ruang Dosen Jember',
      bio: 'Eks-Tenaga Ahli Tokutei Ginou Caregiver Osaka 5 tahun & Pemegang Sertifikat N1 JLPT. Penguji resmi wawancara kerja perusahaan Jepang.',
      education: 'S1 Sastra Jepang & Sertifikasi N1 Tokyo',
      officeHours: 'Senin - Sabtu (08.00 - 16.00 WIB)',
      responseTime: '< 15 Menit',
      isPrimaryAssigned: currentCandidate?.selectedProgram?.includes('japan') ?? false,
    },
    {
      id: 'mentor-03',
      name: 'Sensei Hiroshi Tanaka',
      title: 'Master Pelatih Magang IM Japan & Fisiologis Kerja',
      specialty: 'Kedisiplinan Fisik, Mentoring Wawancara User & Kaizen',
      programType: 'japan_im',
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80',
      rating: 4.92,
      reviewCount: 110,
      status: 'busy',
      statusText: 'Mengajar Kelas Kaiwa (Selesai 15:30)',
      bio: 'Spesialis pembekalan fisik & mental magang IM Japan. Berpengalaman 8 tahun mendampingi peserta asal Jember hingga berangkat ke Aichi & Shizuoka.',
      education: 'Sertifikasi K3 & Manajemen Industri Japan',
      officeHours: 'Selasa - Sabtu (10.00 - 18.00 WIB)',
      responseTime: '< 30 Menit',
    },
    {
      id: 'mentor-04',
      name: 'Ibu Rina Wulandari, S.Pd.',
      title: 'Konsultan Dokumen Visa & Administrasi Luar Negeri',
      specialty: 'Apostille Kemenkumham, Legalisir TETO & Paspor',
      programType: 'all',
      avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80',
      rating: 4.99,
      reviewCount: 230,
      status: 'online',
      statusText: 'Online • Kantor Administrasi Jember',
      bio: 'Kepala Divisi Administrasi & Konsultasi Visa Prospect Jember. Berkoordinasi dengan VISA HUB INDONESIA untuk kelancaran visa.',
      education: 'S1 Pendidikan & Manajemen Publik',
      officeHours: 'Senin - Jumat (08.00 - 16.00 WIB)',
      responseTime: '< 5 Menit',
    },
  ];

  // Active selected mentor state
  const [selectedMentor, setSelectedMentor] = useState<InstructorMentor>(
    mentorsList.find((m) => m.isPrimaryAssigned) || mentorsList[0]
  );

  // Chat conversation state per mentor
  const [conversations, setConversations] = useState<Record<string, ChatMessageItem[]>>({
    'mentor-01': [
      {
        id: 'm1-1',
        sender: 'mentor',
        senderName: 'Laoshi Chen Mei-Ling, M.Ed.',
        text: 'Nǐ hǎo! Selamat datang di sesi MentorConnect. Saya instruktur pendamping akademis Anda untuk persiapan Taiwan IFP 1+4. Ada materi Mandarin Basic, Inggris Basic, atau pengenalan budaya Taiwan yang ingin dibahas hari ini?',
        timestamp: '10:00 WIB',
      },
    ],
    'mentor-02': [
      {
        id: 'm2-1',
        sender: 'mentor',
        senderName: 'Sensei Kenji Sato, S.S.',
        text: 'Konnichiwa! Saya Sensei Sato. Jangan ragu bertanya mengenai hafalan Kanji JLPT N5-N4 atau pola kalimat Kaiwa wawancara kerja Jepang ya.',
        timestamp: '09:15 WIB',
      },
    ],
  });

  const [messageInput, setMessageInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingDate, setBookingDate] = useState('2026-07-29');
  const [bookingTime, setBookingTime] = useState('10:00');
  const [bookingTopic, setBookingTopic] = useState('Latihan Wawancara User (Simulasi Live)');
  const [bookingSuccessToast, setBookingSuccessToast] = useState<string | null>(null);

  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages update
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [conversations, selectedMentor.id, isTyping]);

  // Current messages
  const currentMessages = conversations[selectedMentor.id] || [
    {
      id: `init-${selectedMentor.id}`,
      sender: 'mentor',
      senderName: selectedMentor.name,
      text: `Halo ${currentCandidate?.fullName || 'Siswa'}! Saya ${selectedMentor.name}. Selamat datang di ruang konsultasi akademik MentorConnect. Ada yang bisa saya bantu?`,
      timestamp: 'Baru saja',
    },
  ];

  // Handle Send Message
  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!messageInput.trim()) return;

    const userMsgText = messageInput.trim();
    const nowStr = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';

    const newStudentMsg: ChatMessageItem = {
      id: `msg-${Date.now()}`,
      sender: 'student',
      senderName: currentCandidate?.fullName || 'Anda',
      text: userMsgText,
      timestamp: nowStr,
    };

    // Append student message
    setConversations((prev) => ({
      ...prev,
      [selectedMentor.id]: [...(prev[selectedMentor.id] || []), newStudentMsg],
    }));

    setMessageInput('');
    setIsTyping(true);

    // Simulate Instructor Auto Response
    setTimeout(() => {
      setIsTyping(false);
      let replyText = '';

      const lower = userMsgText.toLowerCase();
      if (lower.includes('interview') || lower.includes('wawancara')) {
        replyText = `Baik ${currentCandidate?.fullName || 'Siswa'}, untuk persiapan wawancara: pastikan Anda sudah menghafal perkenalan diri (Jikoshoukai / Zìwǒ jièshào) dan alasan memilih program ini. Mau kita jadwalkan sesi gladi bersih 1-on-1 via Google Meet?`;
      } else if (lower.includes('grammar') || lower.includes('tata bahasa') || lower.includes('tocfl') || lower.includes('jlpt')) {
        replyText = `Mengenai materi tata bahasa, saya sudah mengunggah modul ringkasan di tab 'Modul & Materi PDF'. Anda bisa mengunduhnya secara offline. Mau saya berikan contoh soal latihan tambahan di sini?`;
      } else if (lower.includes('visa') || lower.includes('dokumen') || lower.includes('ijazah')) {
        replyText = `Untuk verifikasi dokumen dan pengurusan visa, pastikan ijazah dan transkrip nilai sudah diketik rapi sesuai ejaan paspor. Tim kami akan mengecek kelengkapannya dalam 1x24 jam.`;
      } else {
        replyText = `Terima kasih pesan Anda, ${currentCandidate?.fullName || 'Siswa'}! Saya telah mencatat pertanyaan Anda. Sebagai instruktur pendamping, saya menyarankan Anda rutin menyelesaikan modul LMS harian. Apakah ada poin khusus yang membingungkan?`;
      }

      const mentorReplyMsg: ChatMessageItem = {
        id: `reply-${Date.now()}`,
        sender: 'mentor',
        senderName: selectedMentor.name,
        text: replyText,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
      };

      setConversations((prev) => ({
        ...prev,
        [selectedMentor.id]: [...(prev[selectedMentor.id] || []), mentorReplyMsg],
      }));
    }, 1600);
  };

  // Quick Topic Prompts
  const handleQuickTopicClick = (topicText: string) => {
    setMessageInput(topicText);
  };

  // Handle Book Session Submit
  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowBookingModal(false);

    const confirmationMsg = `Sesi Bimbingan 1-on-1 bersama ${selectedMentor.name} berhasil dijadwalkan pada ${bookingDate} jam ${bookingTime} WIB. Tautan Google Meet telah dikirimkan ke email Anda.`;
    setBookingSuccessToast(confirmationMsg);
    setTimeout(() => setBookingSuccessToast(null), 5000);

    // Add automated message from mentor confirming appointment
    const appointmentMsg: ChatMessageItem = {
      id: `app-confirm-${Date.now()}`,
      sender: 'mentor',
      senderName: selectedMentor.name,
      text: `📅 *Konfirmasi Janji Konsultasi:* Sesi 1-on-1 topik "${bookingTopic}" telah terkonfirmasi untuk tanggal ${bookingDate} pukul ${bookingTime} WIB. Sampai jumpa di ruang virtual Meet!`,
      timestamp: 'Baru saja',
    };

    setConversations((prev) => ({
      ...prev,
      [selectedMentor.id]: [...(prev[selectedMentor.id] || []), appointmentMsg],
    }));
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {bookingSuccessToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white border border-emerald-500/50 p-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-5 duration-300 max-w-md">
          <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div className="space-y-0.5">
            <p className="text-xs font-bold text-white">Sesi Mentoring Dikonfirmasi</p>
            <p className="text-[11px] text-slate-300 leading-relaxed">{bookingSuccessToast}</p>
          </div>
        </div>
      )}

      {/* Hero Header */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-red-950 text-white rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-md">
        <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-red-500/20 border border-red-500/40 text-red-300 px-3.5 py-1 rounded-full text-xs font-bold shadow-2xs">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>MentorConnect • Bimbingan Akademik Real-Time</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black font-serif text-white tracking-tight">
              Konsultasi Langsung Bersama Instruktur Ahli
            </h2>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Diskusikan kendala pembelajaran bahasa, simulasi wawancara kerja/beasiswa, serta strategi penyiapan dokumen bersama guru pembimbing LKP & Konsultan Prospect Jember.
            </p>
          </div>

          {/* Active Primary Mentor Badge */}
          <div className="bg-slate-900/90 border border-slate-700 p-4 rounded-2xl shrink-0 flex items-center gap-4 shadow-xl">
            <div className="relative">
              <img
                src={selectedMentor.avatarUrl}
                alt={selectedMentor.name}
                className="w-14 h-14 rounded-2xl object-cover border-2 border-amber-400/60 shadow-md"
              />
              <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-slate-900 rounded-full" />
            </div>

            <div className="space-y-1 min-w-0">
              <span className="text-[10px] uppercase font-bold text-amber-400 flex items-center gap-1">
                <BadgeCheck className="w-3.5 h-3.5" /> Pembimbing Akademik Anda
              </span>
              <h4 className="font-bold text-white text-xs sm:text-sm truncate">{selectedMentor.name}</h4>
              <p className="text-[11px] text-slate-400 truncate">{selectedMentor.title}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Instructors List & Chat Window */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Instructors Directory (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200 p-4 space-y-3 shadow-xs">
            <div className="flex items-center justify-between px-2 pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-xs sm:text-sm flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-red-800" />
                <span>Pilih Guru / Mentor</span>
              </h3>
              <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                {mentorsList.length} Pengajar
              </span>
            </div>

            {/* Mentor Cards List */}
            <div className="space-y-2.5">
              {mentorsList.map((mentor) => {
                const isSelected = mentor.id === selectedMentor.id;

                return (
                  <div
                    key={mentor.id}
                    onClick={() => setSelectedMentor(mentor)}
                    className={`p-3.5 rounded-2xl border transition cursor-pointer relative ${
                      isSelected
                        ? 'bg-red-50/80 border-red-300 shadow-xs ring-2 ring-red-800/20'
                        : 'bg-white border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {mentor.isPrimaryAssigned && (
                      <span className="absolute top-2 right-2 text-[9px] font-black bg-amber-500 text-amber-950 px-2 py-0.2 rounded-full uppercase tracking-wider">
                        Utama
                      </span>
                    )}

                    <div className="flex items-start gap-3">
                      <div className="relative shrink-0">
                        <img
                          src={mentor.avatarUrl}
                          alt={mentor.name}
                          className="w-11 h-11 rounded-xl object-cover border border-slate-200 shadow-2xs"
                        />
                        <span
                          className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white ${
                            mentor.status === 'online'
                              ? 'bg-emerald-500'
                              : mentor.status === 'busy'
                              ? 'bg-amber-500'
                              : 'bg-slate-300'
                          }`}
                        />
                      </div>

                      <div className="min-w-0 space-y-1 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <h4 className="font-bold text-slate-900 text-xs truncate">{mentor.name}</h4>
                          <span className="text-[10px] font-bold text-amber-600 flex items-center gap-0.5 shrink-0">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                            {mentor.rating}
                          </span>
                        </div>

                        <p className="text-[10px] text-slate-500 line-clamp-1">{mentor.specialty}</p>

                        <div className="flex items-center justify-between text-[10px] pt-1">
                          <span className="text-slate-400 font-mono">Balas {mentor.responseTime}</span>
                          <span
                            className={`font-semibold ${
                              mentor.status === 'online'
                                ? 'text-emerald-700'
                                : mentor.status === 'busy'
                                ? 'text-amber-700'
                                : 'text-slate-400'
                            }`}
                          >
                            {mentor.status === 'online' ? 'Online' : 'Sibuk'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Selected Instructor Profile Detail Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-5 space-y-4 shadow-xs">
            <div className="flex items-center gap-3">
              <img
                src={selectedMentor.avatarUrl}
                alt={selectedMentor.name}
                className="w-12 h-12 rounded-2xl object-cover border border-slate-200 shadow-2xs"
              />
              <div>
                <h4 className="font-bold text-slate-900 text-xs sm:text-sm">{selectedMentor.name}</h4>
                <p className="text-[11px] text-red-800 font-medium">{selectedMentor.title}</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-2xl border border-slate-100">
              "{selectedMentor.bio}"
            </p>

            <div className="space-y-2 text-xs text-slate-700">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="truncate">{selectedMentor.education}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{selectedMentor.officeHours}</span>
              </div>
            </div>

            <button
              onClick={() => setShowBookingModal(true)}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-3 rounded-2xl transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-amber-400" />
              <span>Jadwalkan Mentoring 1-on-1 (Meet)</span>
            </button>
          </div>
        </div>

        {/* Right Column: Interactive Chat Session Window (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 shadow-md overflow-hidden flex flex-col h-[650px]">
          {/* Chat Header Bar */}
          <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between border-b border-slate-800 shrink-0">
            <div className="flex items-center gap-3.5">
              <div className="relative">
                <img
                  src={selectedMentor.avatarUrl}
                  alt={selectedMentor.name}
                  className="w-10 h-10 rounded-xl object-cover border border-slate-700"
                />
                <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-slate-900 rounded-full" />
              </div>

              <div>
                <h3 className="font-bold text-xs sm:text-sm text-white flex items-center gap-1.5">
                  <span>{selectedMentor.name}</span>
                  <BadgeCheck className="w-4 h-4 text-amber-400 inline-block" />
                </h3>
                <p className="text-[11px] text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {selectedMentor.statusText}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowBookingModal(true)}
                className="hidden sm:inline-flex items-center gap-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-400/40 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer"
              >
                <Video className="w-3.5 h-3.5" />
                <span>Video Call 1-on-1</span>
              </button>
            </div>
          </div>

          {/* Messages Scrollable Container */}
          <div ref={chatContainerRef} className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-slate-50/70 text-xs">
            {/* Session Welcome Info Card */}
            <div className="bg-amber-50 border border-amber-200/70 rounded-2xl p-3.5 text-center space-y-1 max-w-lg mx-auto shadow-2xs">
              <div className="inline-flex items-center gap-1.5 text-amber-900 font-bold text-xs">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Sesi Bimbingan Akademik Aktif</span>
              </div>
              <p className="text-amber-800 text-[11px] leading-relaxed">
                Pesan Anda terhubung langsung dengan {selectedMentor.name}. Gunakan ruang ini untuk berdiskusi tugas, tata bahasa, atau tips wawancara.
              </p>
            </div>

            {/* Message Bubbles */}
            {currentMessages.map((msg) => {
              const isStudent = msg.sender === 'student';

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isStudent ? 'items-end' : 'items-start'} space-y-1`}
                >
                  <span className="text-[10px] text-slate-400 font-bold px-1 flex items-center gap-1">
                    {!isStudent && <UserCheck className="w-3 h-3 text-red-700" />}
                    <span>{isStudent ? 'Anda' : msg.senderName}</span>
                    <span>•</span>
                    <span>{msg.timestamp}</span>
                  </span>

                  <div
                    className={`p-4 rounded-2xl max-w-lg shadow-2xs leading-relaxed text-xs ${
                      isStudent
                        ? 'bg-red-800 text-white rounded-br-none'
                        : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              );
            })}

            {/* Simulated Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-2 text-slate-400 text-xs bg-white border border-slate-200 px-3.5 py-2.5 rounded-2xl w-max rounded-bl-none animate-pulse">
                <Bot className="w-4 h-4 text-red-800" />
                <span>{selectedMentor.name} sedang mengetik balasan...</span>
              </div>
            )}
          </div>

          {/* Quick Prompts Bar */}
          <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2 overflow-x-auto text-[11px] shrink-0">
            <span className="text-slate-400 font-bold text-[10px] uppercase shrink-0 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500" /> Rekomendasi Topik:
            </span>
            <button
              onClick={() => handleQuickTopicClick('Mohon masukkan untuk simulasi wawancara user saya minggu depan.')}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium px-3 py-1 rounded-xl transition cursor-pointer whitespace-nowrap"
            >
              Simulasi Wawancara User
            </button>
            <button
              onClick={() => handleQuickTopicClick('Bantu jelaskan tata bahasa Mandarin Basic / Inggris Basic ini.')}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium px-3 py-1 rounded-xl transition cursor-pointer whitespace-nowrap"
            >
              Tanya Mandarin & Inggris Basic
            </button>
            <button
              onClick={() => handleQuickTopicClick('Bagaimana persiapan pengenalan budaya & wawancara universitas Taiwan IFP 1+4?')}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium px-3 py-1 rounded-xl transition cursor-pointer whitespace-nowrap"
            >
              Tips Wawancara Taiwan IFP 1+4
            </button>
          </div>

          {/* Input Box */}
          <form onSubmit={handleSendMessage} className="p-3.5 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0">
            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder={`Tulis pesan atau pertanyaan untuk ${selectedMentor.name}...`}
              className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs outline-none focus:ring-2 focus:ring-red-800 focus:bg-white transition"
            />

            <button
              type="submit"
              disabled={!messageInput.trim()}
              className="bg-red-800 hover:bg-red-900 disabled:opacity-50 text-white font-bold p-3 rounded-2xl transition shadow-md flex items-center justify-center shrink-0 cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Booking 1-on-1 Mentoring Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => setShowBookingModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 bg-slate-100 rounded-full cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <img
                src={selectedMentor.avatarUrl}
                alt={selectedMentor.name}
                className="w-12 h-12 rounded-2xl object-cover border border-slate-200"
              />
              <div>
                <h3 className="font-bold text-slate-900 text-base font-serif">Reservasi Mentoring 1-on-1</h3>
                <p className="text-xs text-slate-500">Sesi video call eksklusif bersama {selectedMentor.name}</p>
              </div>
            </div>

            <form onSubmit={handleBookingSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Topik Konsultasi Utama</label>
                <select
                  value={bookingTopic}
                  onChange={(e) => setBookingTopic(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-red-800 bg-white"
                >
                  <option value="Latihan Wawancara User (Simulasi Live)">Latihan Wawancara User / Universitas (Simulasi Live)</option>
                  <option value="Bedah Soal Ujian TOCFL / JLPT">Bedah Soal Ujian TOCFL / JLPT N4-N3</option>
                  <option value="Persiapan Dokumen & Wawancara Taiwan IFP 1+4">Persiapan Dokumen & Wawancara Taiwan IFP 1+4</option>
                  <option value="Konsultasi Kesiapan Mental & Fisik IM Japan">Konsultasi Kesiapan Mental & Fisik IM Japan</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Pilih Tanggal</label>
                  <input
                    type="date"
                    required
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-red-800 bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Pilih Jam (WIB)</label>
                  <select
                    value={bookingTime}
                    onChange={(e) => setBookingTime(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-red-800 bg-white"
                  >
                    <option value="09:00">09:00 WIB</option>
                    <option value="10:00">10:00 WIB</option>
                    <option value="13:30">13:30 WIB</option>
                    <option value="15:00">15:00 WIB</option>
                    <option value="19:00">19:00 WIB (Sesi Malam)</option>
                  </select>
                </div>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-[11px] space-y-1">
                <p className="font-bold flex items-center gap-1">
                  <Info className="w-3.5 h-3.5 text-amber-700" /> Catatan Sesi Virtual:
                </p>
                <p className="text-amber-800">
                  Tautan Google Meet otomatis dikirim ke email registered Anda. Harap persiapkan kamera dan dokumen pendukung 5 menit sebelum jadwal.
                </p>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowBookingModal(false)}
                  className="w-1/2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="w-1/2 bg-red-800 hover:bg-red-900 text-white font-bold py-3 rounded-xl transition shadow-md"
                >
                  Konfirmasi Janji
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
