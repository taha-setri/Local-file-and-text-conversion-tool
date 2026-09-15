import React from 'react';
import { ExternalLink, ShieldCheck, Zap, WifiOff } from 'lucide-react';

export const NetworkBar: React.FC = () => {
  return (
    <header className="w-full bg-[#060a17]/95 backdrop-blur-md border-b border-cyan-500/25 sticky top-0 z-50 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
        
        {/* Left / Start: Link to previous site & Network link */}
        <div className="flex items-center flex-wrap gap-2.5 sm:gap-4">
          <a
            id="network-prev-site-link"
            href="https://productivity-and-focus-center-pomod.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 hover:border-cyan-400 text-cyan-300 font-medium transition-all shadow-[0_0_12px_rgba(0,242,254,0.1)] hover:shadow-[0_0_16px_rgba(0,242,254,0.3)]"
            title="الانتقال إلى موقع مركز الإنتاجية والتركيز"
          >
            <Zap className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform" />
            <span className="font-semibold">الموقع السابق: مركز الإنتاجية والتركيز</span>
            <ExternalLink className="w-3 h-3 text-cyan-400/80 group-hover:translate-x-[-2px] transition-transform" />
          </a>

          <div className="hidden md:flex items-center gap-2 text-slate-400">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="text-emerald-400 font-medium flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              أمان محلي 100%
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-300 flex items-center gap-1">
              <WifiOff className="w-3 h-3 text-slate-400" />
              الخوادم الخارجية: صفر نقل (0 B)
            </span>
          </div>
        </div>

        {/* Right / End: Founder badge */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-cyan-500/30 text-slate-300 shadow-[0_0_10px_rgba(0,242,254,0.08)]">
            <span className="text-slate-400">المؤسس:</span>
            <span className="font-bold text-cyan-300 font-cyber tracking-wider">Taha setri</span>
          </div>
        </div>

      </div>
    </header>
  );
};
