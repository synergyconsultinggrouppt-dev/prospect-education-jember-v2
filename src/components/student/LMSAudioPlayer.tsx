import React, { useState, useEffect } from 'react';
import { LMSDialogLine, LMSVocabulary } from '../../types';
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Headphones,
  Languages,
} from 'lucide-react';

interface LMSAudioPlayerProps {
  title: string;
  language?: 'Mandarin' | 'Jepang' | 'Inggris';
  transcript?: LMSDialogLine[];
  vocabulary?: LMSVocabulary[];
}

export const LMSAudioPlayer: React.FC<LMSAudioPlayerProps> = ({
  title,
  language = 'Mandarin',
  transcript = [],
  vocabulary = [],
}) => {
  const [isPlayingAll, setIsPlayingAll] = useState(false);
  const [activeLineIndex, setActiveLineIndex] = useState<number | null>(null);
  const [speakingWord, setSpeakingWord] = useState<string | null>(null);
  const [speechRate, setSpeechRate] = useState<number>(0.9); // Normal slightly slow for learning

  // Determine speech synthesis language code
  const langCode =
    language === 'Mandarin'
      ? 'zh-TW'
      : language === 'Jepang'
      ? 'ja-JP'
      : 'en-US';

  const speakText = (text: string, onEndCallback?: () => void) => {
    if (!('speechSynthesis' in window)) {
      alert('Browser Anda tidak mendukung fitur Web Speech API audio synthesis.');
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = langCode;
    utterance.rate = speechRate;
    utterance.pitch = 1.0;

    utterance.onend = () => {
      setSpeakingWord(null);
      if (onEndCallback) {
        onEndCallback();
      }
    };

    utterance.onerror = () => {
      setSpeakingWord(null);
      setIsPlayingAll(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  const handlePlaySingleLine = (line: LMSDialogLine, index: number) => {
    setIsPlayingAll(false);
    setActiveLineIndex(index);
    speakText(line.text, () => {
      setActiveLineIndex(null);
    });
  };

  const handlePlayWord = (term: string) => {
    setIsPlayingAll(false);
    setSpeakingWord(term);
    speakText(term, () => {
      setSpeakingWord(null);
    });
  };

  const handlePlayAllDialog = () => {
    if (isPlayingAll) {
      window.speechSynthesis.cancel();
      setIsPlayingAll(false);
      setActiveLineIndex(null);
      return;
    }

    if (transcript.length === 0) return;

    setIsPlayingAll(true);
    let currentIndex = 0;

    const playNext = () => {
      if (currentIndex < transcript.length) {
        setActiveLineIndex(currentIndex);
        const line = transcript[currentIndex];
        currentIndex++;
        speakText(line.text, () => {
          setTimeout(playNext, 800); // 800ms natural pause between speakers
        });
      } else {
        setIsPlayingAll(false);
        setActiveLineIndex(null);
      }
    };

    playNext();
  };

  const handleStop = () => {
    window.speechSynthesis.cancel();
    setIsPlayingAll(false);
    setActiveLineIndex(null);
    setSpeakingWord(null);
  };

  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return (
    <div className="bg-slate-900 text-white rounded-3xl p-5 sm:p-7 border border-slate-800 space-y-6 shadow-md">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold shadow-xs">
            <Headphones className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-400 bg-amber-950/80 border border-amber-500/40 px-2 py-0.5 rounded-full">
                AUDIO LISTENING & DIALOG LAB
              </span>
              <span className="text-[10px] font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded-md">
                {language === 'Mandarin' ? '🇹🇼 Aksen Standar Taiwan (zh-TW)' : language === 'Jepang' ? '🇯🇵 Aksen Standar Jepang (ja-JP)' : 'Global English'}
              </span>
            </div>
            <h4 className="text-base font-bold text-white mt-0.5">{title}</h4>
          </div>
        </div>

        {/* Speed and Main Controls */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Speed selector */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <span className="text-[10px] text-slate-400 px-2 font-medium">Kecepatan:</span>
            {[0.75, 0.9, 1.0].map((rate) => (
              <button
                key={rate}
                onClick={() => setSpeechRate(rate)}
                className={`px-2 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                  speechRate === rate
                    ? 'bg-amber-400 text-slate-950'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {rate}x
              </button>
            ))}
          </div>

          {/* Play / Stop Toggle Button */}
          {transcript.length > 0 && (
            <button
              onClick={handlePlayAllDialog}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-xs cursor-pointer ${
                isPlayingAll
                  ? 'bg-red-600 hover:bg-red-500 text-white'
                  : 'bg-amber-400 hover:bg-amber-300 text-slate-950'
              }`}
            >
              {isPlayingAll ? (
                <>
                  <Pause className="w-4 h-4" />
                  <span>Jeda Audio</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>Putar Percakapan Lengkap</span>
                </>
              )}
            </button>
          )}

          <button
            onClick={handleStop}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition cursor-pointer"
            title="Reset Audio"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Transcript Dialog Lines */}
      {transcript.length > 0 && (
        <div className="space-y-3">
          <p className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <Languages className="w-4 h-4 text-amber-400" />
            <span>Naskah Dialog & Panduan Pelafalan Interaktif:</span>
            <span className="text-[10px] text-slate-400 font-normal ml-auto">(Klik speaker pada setiap baris untuk melatih pengucapan)</span>
          </p>

          <div className="space-y-2.5">
            {transcript.map((line, idx) => {
              const isActive = activeLineIndex === idx;
              return (
                <div
                  key={idx}
                  className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row items-start justify-between gap-3 ${
                    isActive
                      ? 'bg-amber-950/40 border-amber-400/80 ring-2 ring-amber-400/20'
                      : 'bg-slate-950/70 border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded-md border border-amber-500/20">
                        {line.speaker}
                      </span>
                    </div>

                    <p className="text-base sm:text-lg font-bold text-white tracking-wide">
                      {line.text}
                    </p>

                    <p className="text-xs font-medium text-amber-200/90 font-mono">
                      {line.reading}
                    </p>

                    <p className="text-xs text-slate-300 italic pt-0.5">
                      "{line.translation}"
                    </p>
                  </div>

                  <button
                    onClick={() => handlePlaySingleLine(line, idx)}
                    className={`p-2.5 rounded-xl border transition shrink-0 cursor-pointer ${
                      isActive
                        ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md animate-pulse'
                        : 'bg-slate-800 hover:bg-slate-700 text-amber-300 border-slate-700'
                    }`}
                    title="Dengarkan Pelafalan Baris Ini"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Vocabulary Audio Quick Drill */}
      {vocabulary.length > 0 && (
        <div className="pt-2 border-t border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h5 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Daftar Kosakata Kunci (Klik untuk Mendengarkan Suara):</span>
            </h5>
            <span className="text-[10px] text-slate-400">{vocabulary.length} Kosakata</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {vocabulary.map((vocab, vIdx) => {
              const isSpeaking = speakingWord === vocab.term;
              return (
                <div
                  key={vIdx}
                  onClick={() => handlePlayWord(vocab.term)}
                  className={`p-3 rounded-2xl border cursor-pointer transition flex items-center justify-between gap-2.5 ${
                    isSpeaking
                      ? 'bg-emerald-950/60 border-emerald-400 ring-2 ring-emerald-400/30'
                      : 'bg-slate-950/80 border-slate-800 hover:bg-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-white">{vocab.term}</p>
                    <p className="text-[11px] text-amber-300 font-mono">{vocab.reading}</p>
                    <p className="text-[11px] text-slate-400 truncate">{vocab.meaning}</p>
                  </div>

                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border ${
                      isSpeaking
                        ? 'bg-emerald-400 text-slate-950 border-emerald-300 animate-bounce'
                        : 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}
                  >
                    <Volume2 className="w-4 h-4" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
