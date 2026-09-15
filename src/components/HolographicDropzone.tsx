import React, { useState, useRef, useCallback } from 'react';
import { UploadCloud, FileText, Image as ImageIcon, Sparkles, CheckCircle2, RotateCcw } from 'lucide-react';
import { FileAnalysis } from '../types';

interface HolographicDropzoneProps {
  onFileLoaded: (file: FileAnalysis) => void;
  activeFile: FileAnalysis | null;
  onClearFile: () => void;
}

export const HolographicDropzone: React.FC<HolographicDropzoneProps> = ({
  onFileLoaded,
  activeFile,
  onClearFile,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mouse move handler for reactive holographic glow and subtle 3D tilt
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const px = Math.max(0, Math.min(100, (x / rect.width) * 100));
    const py = Math.max(0, Math.min(100, (y / rect.height) * 100));

    // Subtle tilt degrees (-4 to 4 deg)
    const rx = ((y - rect.height / 2) / (rect.height / 2)) * -4;
    const ry = ((x - rect.width / 2) / (rect.width / 2)) * 4;

    setMousePos({ x: px, y: py });
    setTilt({ rx, ry });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTilt({ rx: 0, ry: 0 });
    setMousePos({ x: 50, y: 50 });
  }, []);

  const processNativeFile = useCallback((file: File) => {
    const isImage = file.type.startsWith('image/');
    const isText =
      file.type.startsWith('text/') ||
      file.name.match(/\.(txt|md|json|csv|tsv|html|css|js|ts|jsx|tsx|xml|yml|yaml|sql|py)$/i) !== null;

    const extension = file.name.split('.').pop() || '';

    if (isImage) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const dataUrl = ev.target?.result as string;
        onFileLoaded({
          name: file.name,
          size: file.size,
          type: file.type || 'image/' + extension,
          lastModified: file.lastModified,
          extension,
          dataUrl,
          isImage: true,
          isText: false,
        });
      };
      reader.readAsDataURL(file);
    } else {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const content = ev.target?.result as string;
        onFileLoaded({
          name: file.name,
          size: file.size,
          type: file.type || 'text/plain',
          lastModified: file.lastModified,
          extension,
          content,
          isImage: false,
          isText: true,
        });
      };
      reader.readAsText(file);
    }
  }, [onFileLoaded]);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processNativeFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  // Sample load helpers
  const loadSampleText = () => {
    const sample = `أهلاً بك في أداة تحويل الملفات والنصوص المحلية المستقبلية!
تم تصميم هذا النظام ليعمل بكفاءة فائقة وخصوصية مطلقة بنسبة 100% داخل المتصفح.
جميع البيانات والملفات والنصوص تُعالج في الذاكرة العشوائية للجهاز، دون إرسال أي بايت واحد إلى أي خادم خارجي.

Features included:
- Text Case Converter (UPPERCASE, lowercase, Title Case, camelCase, snake_case, kebab-case).
- Arabic language helpers: إزالة التشكيل، توحيد الهمزات والألف، إزالة التطويل، وتحويل الأرقام المشرقية.
- Real-time Word & Character Counter with reading time estimation.
- Live Image Dimensions & Aspect Ratio Inspector with offline format conversion!`;

    onFileLoaded({
      name: 'sample_arabic_text.txt',
      size: new Blob([sample]).size,
      type: 'text/plain',
      lastModified: Date.now(),
      extension: 'txt',
      content: sample,
      isImage: false,
      isText: true,
    });
  };

  const loadSampleImage = () => {
    // Generate a sleek cyber holographic test image on an in-memory canvas
    const canvas = document.createElement('canvas');
    canvas.width = 1280;
    canvas.height = 720;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Futuristic gradient background
    const grad = ctx.createLinearGradient(0, 0, 1280, 720);
    grad.addColorStop(0, '#04060f');
    grad.addColorStop(0.5, '#0b192e');
    grad.addColorStop(1, '#050a18');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1280, 720);

    // Glowing grid lines
    ctx.strokeStyle = 'rgba(0, 242, 254, 0.15)';
    ctx.lineWidth = 1;
    for (let x = 0; x < 1280; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 720);
      ctx.stroke();
    }
    for (let y = 0; y < 720; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(1280, y);
      ctx.stroke();
    }

    // Glowing circle
    const radGrad = ctx.createRadialGradient(640, 360, 20, 640, 360, 240);
    radGrad.addColorStop(0, 'rgba(0, 242, 254, 0.8)');
    radGrad.addColorStop(0.4, 'rgba(138, 43, 226, 0.4)');
    radGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = radGrad;
    ctx.beginPath();
    ctx.arc(640, 360, 240, 0, Math.PI * 2);
    ctx.fill();

    // Text labels
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 38px Cairo, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('نموذج صورة هولوغرافية فائقة الجودة', 640, 340);

    ctx.fillStyle = '#00f2fe';
    ctx.font = '600 24px Orbitron, monospace';
    ctx.fillText('RESOLUTION: 1280 × 720 px (16:9) • 100% LOCAL', 640, 390);

    const dataUrl = canvas.toDataURL('image/png');
    onFileLoaded({
      name: 'hologram_sample_1280x720.png',
      size: 142800,
      type: 'image/png',
      lastModified: Date.now(),
      extension: 'png',
      dataUrl,
      isImage: true,
      isText: false,
    });
  };

  return (
    <div className="w-full mb-8 relative perspective-1000">
      {/* Hidden native input */}
      <input
        ref={fileInputRef}
        type="file"
        id="holographic-file-input"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            processNativeFile(e.target.files[0]);
          }
        }}
        accept="image/*,text/*,.txt,.md,.json,.csv,.js,.ts,.html,.css,.xml,.yaml,.py"
      />

      {/* Main Interactive Holographic Dropzone Card */}
      <div
        id="holographic-drop-area"
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        style={{
          transform: `perspective(1000px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
          transition: isDragOver ? 'border-color 0.2s, box-shadow 0.2s' : 'transform 0.15s ease-out',
        }}
        className={`relative cursor-pointer overflow-hidden rounded-2xl border-2 transition-all p-6 sm:p-10 text-center select-none backdrop-blur-xl ${
          isDragOver
            ? 'border-cyan-400 bg-cyan-950/40 shadow-[0_0_40px_rgba(0,242,254,0.45)]'
            : activeFile
            ? 'border-cyan-500/40 bg-[#080d1d]/85 shadow-[0_0_30px_rgba(0,242,254,0.15)] hover:border-cyan-400/80'
            : 'border-cyan-500/25 bg-[#070b19]/80 shadow-[0_15px_35px_rgba(0,0,0,0.5)] hover:border-cyan-400/60 hover:shadow-[0_0_30px_rgba(0,242,254,0.25)]'
        }`}
      >
        {/* Dynamic Holographic Spotlight tracking mouse */}
        <div
          className="pointer-events-none absolute inset-0 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle 380px at ${mousePos.x}% ${mousePos.y}%, rgba(0, 242, 254, ${
              isDragOver ? '0.22' : '0.12'
            }), transparent 70%)`,
          }}
        />

        {/* Ambient Plasma Glow in center */}
        <div className="pointer-events-none absolute -top-24 -left-24 w-72 h-72 bg-violet-600/10 rounded-full blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl" />

        {/* Holographic Cyber Corner Brackets */}
        <div className="pointer-events-none absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-cyan-400/80" />
        <div className="pointer-events-none absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-cyan-400/80" />
        <div className="pointer-events-none absolute bottom-3 right-3 w-4 h-3 border-b-2 border-r-2 border-cyan-400/80" />
        <div className="pointer-events-none absolute bottom-3 left-3 w-4 h-3 border-b-2 border-l-2 border-cyan-400/80" />

        {/* Holographic scanning laser line */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-scanline opacity-70" />

        {/* Inner Content */}
        <div className="relative z-10 flex flex-col items-center justify-center">
          {activeFile ? (
            <div className="w-full max-w-xl flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-cyan-500/15 border border-cyan-400/40 flex items-center justify-center text-cyan-300 mb-3 shadow-[0_0_20px_rgba(0,242,254,0.3)] animate-pulse">
                {activeFile.isImage ? (
                  <ImageIcon className="w-8 h-8 text-cyan-300" />
                ) : (
                  <FileText className="w-8 h-8 text-cyan-300" />
                )}
              </div>

              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-2">
                <CheckCircle2 className="w-3.5 h-3.5" />
                تم تحميل الملف بنجاح وتجهيزه للمعالجة
              </div>

              <h3 className="text-lg sm:text-xl font-bold text-white mb-1 truncate max-w-md font-code">
                {activeFile.name}
              </h3>

              <p className="text-xs text-slate-400 mb-4 font-mono">
                الحجم: {(activeFile.size / 1024).toFixed(1)} KB • النوع: {activeFile.type || activeFile.extension}
              </p>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  className="px-4 py-2 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/50 text-cyan-200 text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                >
                  <UploadCloud className="w-4 h-4" />
                  اختيار ملف آخر
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onClearFile();
                  }}
                  className="px-4 py-2 rounded-lg bg-slate-800/80 hover:bg-red-500/20 border border-slate-700 hover:border-red-500/40 text-slate-300 hover:text-red-300 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  إفراغ
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Glowing Icon Orb */}
              <div className="relative mb-4 group-hover:scale-105 transition-transform duration-300">
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-cyan-500/20 via-violet-500/20 to-blue-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shadow-[0_0_30px_rgba(0,242,254,0.25)]">
                  <UploadCloud className="w-10 h-10 animate-bounce" />
                </div>
                <div className="absolute -inset-1 rounded-full border border-cyan-400/20 animate-ping opacity-30" />
              </div>

              <h2 className="text-xl sm:text-2xl font-extrabold text-white mb-2 tracking-wide">
                منطقة السحب والإفلات الهولوغرافية
              </h2>

              <p className="text-slate-300 text-sm sm:text-base max-w-lg mb-4 leading-relaxed">
                اسحب وأفلت أي <span className="text-cyan-300 font-semibold">صورة</span> أو{' '}
                <span className="text-violet-300 font-semibold">ملف نصي / كود</span> هنا، أو انقر للاستعراض.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400 mb-6 font-mono">
                <span className="px-2.5 py-1 rounded-md bg-slate-900/80 border border-slate-800 text-slate-300">
                  PNG • JPG • WebP • SVG
                </span>
                <span className="px-2.5 py-1 rounded-md bg-slate-900/80 border border-slate-800 text-slate-300">
                  TXT • MD • JSON • CSV
                </span>
                <span className="px-2.5 py-1 rounded-md bg-emerald-950/60 border border-emerald-700/50 text-emerald-300">
                  ⚡ معالجة فورية محلية
                </span>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm shadow-[0_0_20px_rgba(0,242,254,0.4)] transition-all hover:scale-[1.02] cursor-pointer"
                >
                  استعراض الملفات من جهازك
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    loadSampleText();
                  }}
                  className="px-4 py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 hover:border-cyan-400/60 text-slate-300 hover:text-cyan-300 text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  تجربة نص نموذجي
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    loadSampleImage();
                  }}
                  className="px-4 py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 hover:border-violet-400/60 text-slate-300 hover:text-violet-300 text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-violet-400" />
                  تجربة صورة نموذجية
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
