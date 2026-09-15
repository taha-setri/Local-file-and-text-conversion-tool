import React from 'react';
import { ShieldCheck, HardDrive, WifiOff, EyeOff, Lock } from 'lucide-react';

export const PrivacyShield: React.FC = () => {
  return (
    <div className="w-full rounded-2xl bg-gradient-to-r from-[#070e24] via-[#091533] to-[#070e24] border border-cyan-500/30 p-6 relative overflow-hidden backdrop-blur-xl shadow-[0_10px_35px_rgba(0,0,0,0.5)]">
      {/* Subtle glowing radial glow */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Left text & icon */}
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-cyan-500/15 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shrink-0 shadow-[0_0_20px_rgba(0,242,254,0.25)]">
            <ShieldCheck className="w-8 h-8 text-cyan-400" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-1">
              <Lock className="w-3 h-3" />
              ضمان الأمان والخصوصية المطلقة 100%
            </div>
            <h3 className="text-lg font-bold text-white mb-1">
              معالجة محلية بالكامل داخل المتصفح (Zero Data Leakage)
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
              ملفاتك ونصوصك وصورك لا تغادر جهازك أبداً! جميع الخوارزميات (حساب الإحصائيات، تحويل الأحرف، فحص الأبعاد، وتحويل الصور) تعمل مباشرة عبر محرك JavaScript ومتصفحك الشخصي فقط دون أي اتصال بخوادم خارجية.
            </p>
          </div>
        </div>

        {/* Right badges */}
        <div className="grid grid-cols-2 gap-2.5 w-full md:w-auto shrink-0 text-xs font-medium">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-700/60 text-slate-300">
            <HardDrive className="w-4 h-4 text-cyan-400" />
            <span>تنفيذ داخل الذاكرة (RAM)</span>
          </div>

          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-700/60 text-slate-300">
            <WifiOff className="w-4 h-4 text-emerald-400" />
            <span>0 بكسل يغادر جهازك</span>
          </div>

          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-700/60 text-slate-300">
            <EyeOff className="w-4 h-4 text-violet-400" />
            <span>خالٍ من تتبع الكوكيز</span>
          </div>

          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-700/60 text-slate-300">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>مستقل عن الإنترنت (Offline)</span>
          </div>
        </div>

      </div>
    </div>
  );
};
