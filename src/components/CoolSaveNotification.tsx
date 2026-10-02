import React, { useEffect, useState } from 'react';
import { CheckCircle2, Sparkles, X, ShieldCheck } from 'lucide-react';

export interface SaveNotificationData {
  title: string;
  message: string;
  badge?: string;
}

interface CoolSaveNotificationProps {
  data: SaveNotificationData | null;
  onClose: () => void;
  duration?: number;
}

export const CoolSaveNotification: React.FC<CoolSaveNotificationProps> = ({
  data,
  onClose,
  duration = 3500,
}) => {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (!data) return;

    // Pleasant subtle audio chime
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        if (ctx.state === 'suspended') {
          ctx.resume();
        }
        const now = ctx.currentTime;

        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(587.33, now); // D5
        gain1.gain.setValueAtTime(0.06, now);
        gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);
        osc1.connect(gain1);
        gain1.connect(ctx.destination);
        osc1.start(now);
        osc1.stop(now + 0.3);

        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(880, now + 0.1); // A5
        gain2.gain.setValueAtTime(0.08, now + 0.1);
        gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.start(now + 0.1);
        osc2.stop(now + 0.5);
      }
    } catch {
      // Audio autoplay policy fail-safe
    }

    setProgress(100);
    const intervalTime = 50;
    const step = (intervalTime / duration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return Math.max(0, prev - step);
      });
    }, intervalTime);

    const closeTimer = setTimeout(() => {
      onClose();
    }, duration);

    return () => {
      clearInterval(timer);
      clearTimeout(closeTimer);
    };
  }, [data, duration, onClose]);

  if (!data) return null;

  return (
    <div className="fixed top-5 right-5 sm:right-8 z-50 max-w-md w-[calc(100vw-2.5rem)] animate-in fade-in slide-in-from-top-6 duration-300 ease-out">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white p-4 sm:p-5 shadow-2xl border-2 border-emerald-500/50 ring-4 ring-emerald-500/20 backdrop-blur-xl">
        {/* Glow accent in top-right */}
        <div className="absolute -top-12 -right-12 w-28 h-28 bg-emerald-500/30 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-blue-500/20 rounded-full blur-xl pointer-events-none" />

        <div className="relative flex items-start gap-3.5">
          {/* Animated pulsing icon badge */}
          <div className="relative shrink-0 mt-0.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/30 ring-2 ring-emerald-300/40">
              <CheckCircle2 className="w-6 h-6 text-white stroke-[2.5]" />
            </div>
            <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 items-center justify-center">
                <Sparkles className="w-2.5 h-2.5 text-white" />
              </span>
            </span>
          </div>

          {/* Text Content */}
          <div className="flex-1 min-w-0 pr-6">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h4 className="font-extrabold text-sm text-white tracking-wide flex items-center gap-1.5">
                <span>{data.title}</span>
              </h4>
              {data.badge && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  {data.badge}
                </span>
              )}
            </div>

            <p className="text-xs text-slate-300 leading-relaxed break-words font-medium">
              {data.message}
            </p>
          </div>

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-0 right-0 p-1 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            title="Tutup Notifikasi"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Animated Countdown Progress Bar */}
        <div className="mt-3.5 w-full bg-slate-800/80 rounded-full h-1.5 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500 rounded-full transition-all duration-75 ease-linear shadow-xs"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};
