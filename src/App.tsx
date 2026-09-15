import React, { useState, useEffect } from 'react';
import {
  FileText,
  Image as ImageIcon,
  ShieldCheck,
  Zap,
  Sparkles,
  Sliders,
  CheckCircle2,
  Info,
  Layers,
} from 'lucide-react';
import { NetworkBar } from './components/NetworkBar';
import { HolographicDropzone } from './components/HolographicDropzone';
import { TextTools } from './components/TextTools';
import { ImageTools } from './components/ImageTools';
import { PrivacyShield } from './components/PrivacyShield';
import { Footer } from './components/Footer';
import { FileAnalysis, ToastMessage } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<'text' | 'image' | 'privacy'>('text');
  const [activeFile, setActiveFile] = useState<FileAnalysis | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Toast notification helper
  const showToast = (title: string, desc?: string, type: 'success' | 'info' | 'warning' = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, title, desc, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  // When a file is loaded into the Holographic Dropzone
  const handleFileLoaded = (file: FileAnalysis) => {
    setActiveFile(file);
    if (file.isImage) {
      setActiveTab('image');
      showToast('تم تحميل الصورة بنجاح', `تم استيراد ${file.name}، فحص الأبعاد جاهز.`, 'success');
    } else {
      setActiveTab('text');
      showToast('تم تحميل النص بنجاح', `تم استيراد ${file.name} في محرر النصوص.`, 'success');
    }
  };

  const handleClearFile = () => {
    setActiveFile(null);
    showToast('تم الإفراغ', 'تمت إزالة الملف المحدد.', 'info');
  };

  return (
    <div className="min-h-screen bg-[#04060f] text-slate-100 flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* Top Network Bar */}
      <NetworkBar />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-8 pb-16">
        
        {/* Futuristic Hero Section */}
        <section className="text-center mb-10 relative">
          {/* Subtle Ambient Background Flare */}
          <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-32 bg-gradient-to-r from-cyan-500/15 via-violet-600/10 to-cyan-500/15 rounded-full blur-3xl -z-10" />

          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-xs font-semibold mb-4 shadow-[0_0_15px_rgba(0,242,254,0.15)] animate-pulse">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>نظام معالجة هولوغرافي محلي 100% • حماية مطلقة للبيانات</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-cyan-400 mb-4 tracking-tight">
            أداة تحويل الملفات والنصوص المحلية
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            محول النصوص وحالات الأحرف المتقدم، عداد كلمات وأحرف لحظي بدقة فائقة، وفاحص ومعاينة حية لأبعاد وخصائص الصور مع إمكانية التحويل والتنزيل المباشر داخل متصفحك.
          </p>
        </section>

        {/* Futuristic Glowing Holographic Dropzone */}
        <HolographicDropzone
          onFileLoaded={handleFileLoaded}
          activeFile={activeFile}
          onClearFile={handleClearFile}
        />

        {/* View Selection Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 border-b border-cyan-500/20 pb-4">
          <div className="flex items-center gap-2 bg-[#080d1e] p-1.5 rounded-2xl border border-cyan-500/30 shadow-[0_0_20px_rgba(0,242,254,0.1)]">
            
            <button
              id="tab-text-btn"
              type="button"
              onClick={() => setActiveTab('text')}
              className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'text'
                  ? 'bg-gradient-to-r from-cyan-500/30 to-blue-600/30 text-cyan-200 border border-cyan-400/60 shadow-[0_0_15px_rgba(0,242,254,0.25)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <FileText className="w-4 h-4 text-cyan-400" />
              <span>محول النصوص والعداد اللحظي</span>
            </button>

            <button
              id="tab-image-btn"
              type="button"
              onClick={() => setActiveTab('image')}
              className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'image'
                  ? 'bg-gradient-to-r from-cyan-500/30 to-blue-600/30 text-cyan-200 border border-cyan-400/60 shadow-[0_0_15px_rgba(0,242,254,0.25)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <ImageIcon className="w-4 h-4 text-violet-400" />
              <span>معاينة وفاحص أبعاد الصور</span>
              {activeFile?.isImage && (
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              )}
            </button>

            <button
              id="tab-privacy-btn"
              type="button"
              onClick={() => setActiveTab('privacy')}
              className={`hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'privacy'
                  ? 'bg-gradient-to-r from-cyan-500/30 to-blue-600/30 text-cyan-200 border border-cyan-400/60 shadow-[0_0_15px_rgba(0,242,254,0.25)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>شهادة الأمان والخصوصية</span>
            </button>
          </div>
        </div>

        {/* Tab Content Display */}
        {activeTab === 'text' && (
          <TextTools
            initialText={activeFile?.isText ? activeFile.content : undefined}
            onShowToast={showToast}
          />
        )}

        {activeTab === 'image' && (
          activeFile?.isImage && activeFile.dataUrl ? (
            <ImageTools
              dataUrl={activeFile.dataUrl}
              fileSize={activeFile.size}
              fileName={activeFile.name}
              mimeType={activeFile.type}
              onShowToast={showToast}
            />
          ) : (
            <div className="rounded-2xl bg-[#080d1e]/80 border border-cyan-500/20 p-12 text-center text-slate-300 backdrop-blur-xl">
              <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mx-auto mb-4 text-cyan-300">
                <ImageIcon className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">لم يتم تحديد أي صورة حتى الآن</h3>
              <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto mb-6">
                يرجى سحب وإفلات صورة داخل المنطقة الهولوغرافية بالأعلى، أو النقر على زر التجربة السريعة لمعاينة أبعاد وخصائص عينة اختبارية.
              </p>
              <button
                type="button"
                onClick={() => {
                  const input = document.getElementById('holographic-file-input') as HTMLInputElement;
                  input?.click();
                }}
                className="px-5 py-2.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/50 text-cyan-200 text-xs font-bold transition-all cursor-pointer"
              >
                اختيار صورة من جهازك
              </button>
            </div>
          )
        )}

        {activeTab === 'privacy' && (
          <div className="space-y-6">
            <PrivacyShield />
          </div>
        )}

        {/* Persistent Privacy Guarantee Strip at the bottom of the page */}
        {activeTab !== 'privacy' && (
          <div className="mt-12">
            <PrivacyShield />
          </div>
        )}

      </main>

      {/* Floating Toast Notification Container */}
      <div className="fixed bottom-5 left-5 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="pointer-events-auto flex items-start gap-2.5 px-4 py-3 rounded-xl bg-[#070d1e]/95 border border-cyan-500/40 text-slate-100 shadow-[0_0_25px_rgba(0,242,254,0.3)] backdrop-blur-xl animate-in slide-in-from-bottom-3 duration-200 max-w-sm"
          >
            <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <h5 className="text-xs font-bold text-white">{toast.title}</h5>
              {toast.desc && <p className="text-[11px] text-slate-300 mt-0.5">{toast.desc}</p>}
            </div>
          </div>
        ))}
      </div>

      {/* Footer with Disclaimer, Cookies Policy, and Founder Taha setri */}
      <Footer />

    </div>
  );
}
