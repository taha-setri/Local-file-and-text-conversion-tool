import React from 'react';
import { ExternalLink, Shield, Cookie, User, Heart, ArrowUp } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full mt-20 border-t border-cyan-500/20 bg-[#04060f] relative overflow-hidden text-slate-300">
      {/* Cyber Grid pattern */}
      <div className="absolute inset-0 cyber-grid opacity-30 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 relative z-10">
        
        {/* Main 3-column layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          
          {/* Column 1: Disclaimer (إخلاء المسؤولية) */}
          <div className="rounded-xl bg-[#080d1e]/70 border border-slate-800 p-5 backdrop-blur-md">
            <div className="flex items-center gap-2 text-cyan-300 mb-3">
              <Shield className="w-5 h-5 text-cyan-400" />
              <h4 className="text-base font-bold text-white">إخلاء المسؤولية (Disclaimer)</h4>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              تطبيق &quot;أداة تحويل الملفات والنصوص المحلية&quot; هو نظام خدمي يعمل بتقنيات الويب الحديثة من جانب العميل فقط (Client-Side Only). جميع عمليات التحويل، والمعالجة، وضغط وتغيير حجم الصور، وتحويل حالات النصوص تجري بالكامل محلياً داخل متصفح المستخدم دون أن يتم إرسال أو حفظ أي ملف أو نص على أي خوادم سحابية. يتم استخدام الأداة على مسؤولية المستخدم الخاصة دون أي ضمانات صريحة أو ضمنية.
            </p>
          </div>

          {/* Column 2: Cookies Policy (ملفات تعريف الارتباط والكوكيز) */}
          <div className="rounded-xl bg-[#080d1e]/70 border border-slate-800 p-5 backdrop-blur-md">
            <div className="flex items-center gap-2 text-cyan-300 mb-3">
              <Cookie className="w-5 h-5 text-cyan-400" />
              <h4 className="text-base font-bold text-white">سياسة الكوكيز (Cookies & Storage)</h4>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-3">
              هذا الموقع نظيف وخالٍ تماماً بنسبة 100% من أي ملفات تعريف ارتباط (Cookies) خارجية لأغراض التتبع أو الإعلانات أو جمع البيانات الشخصية.
            </p>
            <div className="text-xs text-emerald-400 bg-emerald-950/40 p-2.5 rounded-lg border border-emerald-500/20 font-mono">
              ✓ صفر كوكيز تتبع (No Third-Party Cookies)
              <br />
              ✓ حفظ التفضيلات محلياً فقط في متصفحك (LocalStorage)
            </div>
          </div>

          {/* Column 3: Founder & Network link */}
          <div className="rounded-xl bg-gradient-to-br from-[#080d1e] to-cyan-950/30 border border-cyan-500/30 p-5 backdrop-blur-md relative">
            <div className="flex items-center gap-2 text-cyan-300 mb-3">
              <User className="w-5 h-5 text-cyan-400" />
              <h4 className="text-base font-bold text-white">المؤسس والمشروع</h4>
            </div>
            
            <div className="mb-4">
              <span className="text-xs text-slate-400 block mb-1">اسم المؤسس والمطور:</span>
              <div className="text-xl font-extrabold text-white font-cyber tracking-wider flex items-center gap-2">
                <span className="text-cyan-400">Taha setri</span>
                <span className="text-xs text-slate-400 font-sans font-normal">(طه ستري)</span>
              </div>
            </div>

            <p className="text-xs text-slate-300 mb-4 leading-relaxed">
              تم تطوير هذا التطبيق لتوفير حل هولوغرافي متقدم يحترم الخصوصية الرقمية ويوفر أدوات تحويل سريعة ومحلية للمبدعين والمطورين.
            </p>

            <a
              href="https://productivity-and-focus-center-pomod.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-bold text-cyan-300 hover:text-white bg-cyan-500/10 hover:bg-cyan-500/25 px-3 py-2 rounded-lg border border-cyan-400/40 transition-all shadow-sm group"
            >
              <span>الانتقال لموقع مركز الإنتاجية والتركيز</span>
              <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-[-2px] transition-transform" />
            </a>
          </div>

        </div>

        {/* Bottom copyright bar */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span>© 2026 أداة تحويل الملفات والنصوص المحلية • تأسيس وتطوير</span>
            <span className="text-cyan-400 font-bold font-cyber">Taha setri</span>
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer"
          >
            <span>العودة للأعلى</span>
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>

      </div>
    </footer>
  );
};
