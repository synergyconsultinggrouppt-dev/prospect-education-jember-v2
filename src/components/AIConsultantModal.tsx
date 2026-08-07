import React, { useState } from 'react';
import { Bot, X, Send, Sparkles, MessageSquare, Loader2 } from 'lucide-react';

export const AIConsultantModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<
    { sender: 'user' | 'bot'; text: string; time: string }[]
  >([
    {
      sender: 'bot',
      text: 'Halo! Saya Prospect AI Consultant. Ada yang bisa saya bantu mengenai Program Kuliah S1 Taiwan (IFP 1+4), Program Magang/Kerja Jepang (IM Japan & Tokutei Ginou SSW), syarat pendaftaran, atau lokasi kantor kami di Jember?',
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  // Handle escape key to close chat modal
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userText = input.trim();
    const time = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

    setMessages((prev) => [...prev, { sender: 'user', text: userText, time }]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/consultant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userText }),
      });
      const data = await res.json();

      if (data.response) {
        setMessages((prev) => [
          ...prev,
          { sender: 'bot', text: data.response, time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            sender: 'bot',
            text: 'Maaf, terjadi gangguan jaringan. Silakan hubungi langsung Customer Service Cabang Jember di WA 0823-3455-4396.',
            time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: 'Terjadi kendala teknis. Anda juga bisa langsung berkonsultasi via WhatsApp di 0823-3455-4396.',
          time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        aria-expanded={isOpen}
        aria-label="Buka Prospect AI Consultant Chat"
        className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-[#071E3D] via-[#0F3D7A] to-[#1E40AF] hover:from-[#05152B] hover:to-[#1D4ED8] text-white p-3.5 rounded-full shadow-2xl flex items-center gap-2 group transition transform hover:scale-105 border border-sky-300/40 focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:outline-hidden cursor-pointer"
      >
        <div className="relative">
          <Bot className="w-6 h-6 text-amber-300" aria-hidden="true" />
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
        </div>
        <span className="font-extrabold text-xs pr-1 hidden sm:inline">AI Consultant</span>
      </button>

      {/* Chat Window Dialog */}
      {isOpen && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsOpen(false);
          }}
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-end sm:justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Prospect AI Consultant Chatbot"
            className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md h-[550px] max-h-[90vh] my-auto flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#071E3D] via-[#0F3D7A] to-[#1E40AF] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 bg-amber-400 text-slate-950 rounded-xl flex items-center justify-center font-bold shadow-xs">
                  <Bot className="w-5 h-5" aria-hidden="true" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-extrabold text-sm">Prospect AI Consultant</h3>
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" aria-hidden="true" />
                  </div>
                  <p className="text-[10px] text-sky-200 font-medium">
                    Konsultasi Program Taiwan & Jepang (24/7)
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                aria-label="Tutup jendela percakapan AI"
                className="text-slate-200 hover:text-white p-1 rounded-lg hover:bg-white/10 transition focus-visible:ring-1 focus-visible:ring-amber-300 cursor-pointer"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50 text-xs" aria-live="polite" aria-label="Riwayat Percakapan">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 shadow-2xs whitespace-pre-line leading-relaxed ${
                      m.sender === 'user'
                        ? 'bg-[#0F3D7A] text-white rounded-tr-none font-medium'
                        : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
                    }`}
                  >
                    {m.text}
                  </div>
                  <span className="text-[9px] text-slate-400 mt-1 px-1">{m.time}</span>
                </div>
              ))}

              {loading && (
                <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-2xl px-3.5 py-2.5 w-fit">
                  <Loader2 className="w-4 h-4 text-[#0F3D7A] animate-spin" aria-hidden="true" />
                  <span className="text-slate-500 font-medium text-xs">Prospect AI sedang mengetik...</span>
                </div>
              )}
            </div>

            {/* Quick Prompt Suggestions */}
            <div className="px-3 py-2 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto text-[11px] no-scrollbar" role="group" aria-label="Saran Pertanyaan Cepat">
              <button
                onClick={() => setInput('Apa saja syarat kuliah S1 IFP 1+4 di Taiwan?')}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-full shrink-0 focus-visible:ring-2 focus-visible:ring-red-600"
              >
                Syarat Taiwan 1+4
              </button>
              <button
                onClick={() => setInput('Berapa gaji Tokutei Ginou SSW di Jepang?')}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-full shrink-0 focus-visible:ring-2 focus-visible:ring-red-600"
              >
                Gaji SSW Jepang
              </button>
              <button
                onClick={() => setInput('Di mana lokasi kantor Prospect Education Jember?')}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-full shrink-0 focus-visible:ring-2 focus-visible:ring-red-600"
              >
                Lokasi Kantor
              </button>
            </div>

            {/* Input Bar */}
            <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ketik pertanyaan Anda di sini..."
                aria-label="Ketik pertanyaan konsultasi AI"
                className="flex-1 bg-slate-100 text-slate-800 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-red-600 focus:bg-white"
              />
              <button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                aria-label="Kirim pesan ke Prospect AI"
                className="bg-gradient-to-r from-red-800 to-amber-700 text-white p-2.5 rounded-xl shadow-xs hover:from-red-900 hover:to-amber-800 disabled:opacity-50 transition focus-visible:ring-2 focus-visible:ring-red-600"
              >
                <Send className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
