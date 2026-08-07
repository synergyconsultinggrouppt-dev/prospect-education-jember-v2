import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Send, User, ShieldCheck, MessageCircle, Sparkles } from 'lucide-react';

export const StudentChat: React.FC = () => {
  const { currentCandidate, sendCandidateChatMessage } = useApp();
  const [text, setText] = useState('');

  if (!currentCandidate) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    sendCandidateChatMessage(currentCandidate.id, text);
    setText('');
  };

  const handleQuickQuestion = (q: string) => {
    sendCandidateChatMessage(currentCandidate.id, q);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[600px]">
      {/* Header */}
      <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-900 text-amber-300 rounded-2xl flex items-center justify-center font-bold">
            <MessageCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm">Layanan Konsultasi Admin Cabang Jember</h3>
            <p className="text-[10px] text-emerald-400 flex items-center gap-1 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Admin Online & Siap Membantu
            </p>
          </div>
        </div>

        <span className="text-[10px] bg-slate-800 text-slate-300 px-3 py-1 rounded-full font-mono">
          ID: {currentCandidate.registrationNumber}
        </span>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50 text-xs">
        {currentCandidate.chatMessages.map((msg) => {
          const isMe = msg.sender === 'student';
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} space-y-1`}
            >
              <span className="text-[9px] text-slate-400 font-bold px-1">
                {isMe ? 'Anda' : msg.senderName} • {msg.timestamp}
              </span>
              <div
                className={`p-3.5 rounded-2xl max-w-md shadow-2xs leading-relaxed ${
                  isMe
                    ? 'bg-red-800 text-white rounded-br-none'
                    : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none'
                }`}
              >
                {msg.text}
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Prompts */}
      <div className="p-3 bg-white border-t border-slate-200 flex flex-wrap gap-2 text-[11px]">
        <span className="text-slate-400 font-bold flex items-center gap-1 self-center text-[10px]">
          <Sparkles className="w-3 h-3 text-amber-500" /> Tanya Cepat:
        </span>
        <button
          onClick={() => handleQuickQuestion('Kapan jadwal interview user saya?')}
          className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium px-2.5 py-1 rounded-lg transition"
        >
          Jadwal Interview User?
        </button>
        <button
          onClick={() => handleQuickQuestion('Apakah dokumen verifikasi saya sudah lengkap?')}
          className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium px-2.5 py-1 rounded-lg transition"
        >
          Dokumen Lengkap?
        </button>
        <button
          onClick={() => handleQuickQuestion('Berapa estimasi waktu penerbitan visa?')}
          className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium px-2.5 py-1 rounded-lg transition"
        >
          Estimasi Visa?
        </button>
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-4 bg-white border-t border-slate-200 flex items-center gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Tuliskan pertanyaan Anda untuk Admin Jember di sini..."
          className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-600"
        />
        <button
          type="submit"
          className="bg-gradient-to-r from-red-800 to-amber-700 hover:from-red-900 hover:to-amber-800 text-white font-bold p-2.5 rounded-xl transition shadow-md shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
