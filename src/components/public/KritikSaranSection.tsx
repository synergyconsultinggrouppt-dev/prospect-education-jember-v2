import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MessageSquarePlus, Send, CheckCircle2 } from 'lucide-react';

export const KritikSaranSection: React.FC = () => {
  const { submitFeedback } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.message) return;
    submitFeedback(formData);
    setSubmitted(true);
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  return (
    <section className="py-16 bg-white border-b border-slate-200">
      <div className="max-w-4xl mx-auto px-4 space-y-8">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold text-red-800 uppercase tracking-widest bg-red-100 px-3 py-1 rounded-full">
            KRITIK & SARAN
          </span>
          <h2 className="text-3xl font-black text-slate-900 font-serif">Formulir Kritik & Masukan</h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            Demi meningkatkan kualitas pelayanan Prospect Education Cabang Jember, kami sangat menghargai setiap aspirasi, tanggapan, dan pertanyaan Anda.
          </p>
        </div>

        {submitted ? (
          <div className="bg-emerald-50 border border-emerald-200 p-8 rounded-3xl text-center space-y-3 text-emerald-900 animate-in fade-in">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <h3 className="text-xl font-bold font-serif">Kritik & Saran Anda Berhasil Terkirim!</h3>
            <p className="text-xs text-emerald-700 max-w-md mx-auto">
              Terima kasih atas kepedulian Anda. Tim Manajemen Prospect Education Cabang Jember akan menindaklanjuti masukan Anda.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="bg-emerald-700 text-white font-bold text-xs px-5 py-2 rounded-xl hover:bg-emerald-800 transition"
            >
              Kirim Pesan Lain
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-slate-50 p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4 text-xs"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Nama Lengkap *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Contoh: Ahmad Subagyo"
                  className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Nomor Telepon / WhatsApp *</label>
                <input
                  type="text"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="081234567890"
                  className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Alamat Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="nama@email.com"
                  className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Subjek / Topik</label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="Pelayanan Admin / Info Program / Lainnya"
                  className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Isi Kritik & Saran *</label>
              <textarea
                rows={4}
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Tuliskan kritik, saran, atau masukan Anda secara jelas di sini..."
                className="w-full bg-white border border-slate-200 rounded-xl p-3.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-800 to-amber-700 hover:from-red-900 hover:to-amber-800 text-white font-bold py-3 rounded-xl shadow-md transition"
            >
              <Send className="w-4 h-4" />
              <span>Kirim Masukan Anda</span>
            </button>
          </form>
        )}
      </div>
    </section>
  );
};
