import React, { useState, useEffect } from 'react';
import {
  Maximize2,
  Download,
  Copy,
  RotateCw,
  Palette,
  Layers,
  Sparkles,
  Sliders,
  Check,
  Eye,
  RefreshCw,
  ZoomIn,
} from 'lucide-react';
import { ImageProperties, ImageConversionSettings } from '../types';
import { analyzeImage, convertAndProcessImage } from '../utils/imageProcessors';

interface ImageToolsProps {
  dataUrl: string;
  fileSize: number;
  fileName: string;
  mimeType: string;
  onShowToast: (title: string, desc?: string, type?: 'success' | 'info' | 'warning') => void;
}

export const ImageTools: React.FC<ImageToolsProps> = ({
  dataUrl,
  fileSize,
  fileName,
  mimeType,
  onShowToast,
}) => {
  const [imageProps, setImageProps] = useState<ImageProperties | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [backdropMode, setBackdropMode] = useState<'dark' | 'checker' | 'light'>('checker');

  // Conversion settings
  const [settings, setSettings] = useState<ImageConversionSettings>({
    format: 'image/webp',
    quality: 90,
    scalePercent: 100,
    maintainAspect: true,
    grayscale: false,
    invert: false,
    rotate: 0,
  });

  // Converted result
  const [convertedResult, setConvertedResult] = useState<{
    blob: Blob;
    convertedDataUrl: string;
    sizeFormatted: string;
  } | null>(null);
  const [isConverting, setIsConverting] = useState<boolean>(false);

  // Analyze image on load
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    analyzeImage(dataUrl, fileSize, mimeType)
      .then((props) => {
        if (isMounted) {
          setImageProps(props);
          setLoading(false);
          // Initial conversion preview
          runConversion(props, settings);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setLoading(false);
          onShowToast('خطأ في تحليل الصورة', err.message, 'warning');
        }
      });

    return () => {
      isMounted = false;
    };
  }, [dataUrl, fileSize, mimeType]);

  const runConversion = async (props: ImageProperties, currentSettings: ImageConversionSettings) => {
    setIsConverting(true);
    try {
      const res = await convertAndProcessImage(dataUrl, currentSettings);
      setConvertedResult(res);
    } catch (err: any) {
      onShowToast('خطأ في التحويل', err.message, 'warning');
    } finally {
      setIsConverting(false);
    }
  };

  const handleSettingChange = (patch: Partial<ImageConversionSettings>) => {
    const updated = { ...settings, ...patch };
    setSettings(updated);
    if (imageProps) {
      runConversion(imageProps, updated);
    }
  };

  const handleCopyPaletteHex = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 2000);
    onShowToast('تم نسخ اللون', `كود اللون: ${hex}`, 'success');
  };

  const handleDownloadConverted = () => {
    if (!convertedResult) return;
    const ext = settings.format.split('/')[1] || 'png';
    const baseName = fileName.replace(/\.[^/.]+$/, '');
    const finalName = `${baseName}_converted_${settings.scalePercent}pct.${ext}`;

    const link = document.createElement('a');
    link.href = convertedResult.convertedDataUrl;
    link.download = finalName;
    link.click();

    onShowToast('تم التنزيل بنجاح', `تم حفظ الصورة المعدلة باسم ${finalName}`, 'success');
  };

  const handleCopyBase64 = () => {
    if (!convertedResult) return;
    navigator.clipboard.writeText(convertedResult.convertedDataUrl);
    onShowToast('تم النسخ', 'تم نسخ كود Base64 Data URI إلى الحافظة بنجاح.', 'success');
  };

  if (loading) {
    return (
      <div className="rounded-2xl bg-[#080d1e]/90 border border-cyan-500/20 p-12 text-center text-cyan-300">
        <RefreshCw className="w-8 h-8 mx-auto mb-3 animate-spin text-cyan-400" />
        <p className="font-bold">جارِ فحص خصائص وأبعاد الصورة هولوغرافياً...</p>
      </div>
    );
  }

  if (!imageProps) return null;

  return (
    <div className="w-full space-y-6">

      {/* Live Image Properties & Dimension HUD */}
      <div className="rounded-2xl bg-[#080d1e]/90 border border-cyan-500/25 p-5 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.4)]">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 border-b border-cyan-500/15 pb-3">
          <div className="flex items-center gap-2 text-cyan-300">
            <Maximize2 className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base sm:text-lg font-bold">معاينة حية لأبعاد وخصائص الصورة (Image Inspector)</h3>
          </div>
          <span className="px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
            {imageProps.aspectLabel}
          </span>
        </div>

        {/* 4 Core Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="rounded-xl bg-[#04060f]/80 border border-cyan-500/20 p-3 text-center group hover:border-cyan-400/60 transition-all">
            <span className="text-xs text-slate-400 block mb-1 font-medium">الأبعاد (العرض × الارتفاع)</span>
            <span className="text-xl sm:text-2xl font-extrabold text-cyan-300 font-cyber block tracking-tight">
              {imageProps.width} × {imageProps.height}
            </span>
            <span className="text-[10px] text-slate-500 font-mono">بكسل (Pixels)</span>
          </div>

          <div className="rounded-xl bg-[#04060f]/80 border border-violet-500/20 p-3 text-center group hover:border-violet-400/60 transition-all">
            <span className="text-xs text-slate-400 block mb-1 font-medium">نسبة العرض للارتفاع</span>
            <span className="text-xl sm:text-2xl font-extrabold text-violet-300 font-cyber block tracking-tight">
              {imageProps.aspectRatio}
            </span>
            <span className="text-[10px] text-slate-500 font-mono">({imageProps.aspectRatioFloat}:1)</span>
          </div>

          <div className="rounded-xl bg-[#04060f]/80 border border-emerald-500/20 p-3 text-center group hover:border-emerald-400/60 transition-all">
            <span className="text-xs text-slate-400 block mb-1 font-medium">الكثافة والدقة</span>
            <span className="text-xl sm:text-2xl font-extrabold text-emerald-300 font-cyber block tracking-tight">
              {imageProps.megapixels}
            </span>
            <span className="text-[10px] text-slate-500 font-mono">MegaPixels</span>
          </div>

          <div className="rounded-xl bg-[#04060f]/80 border border-amber-500/20 p-3 text-center group hover:border-amber-400/60 transition-all">
            <span className="text-xs text-slate-400 block mb-1 font-medium">حجم الملف الأصلي</span>
            <span className="text-xl sm:text-2xl font-extrabold text-amber-300 font-cyber block tracking-tight">
              {imageProps.sizeFormatted}
            </span>
            <span className="text-[10px] text-slate-500 font-mono">{mimeType.replace('image/', '').toUpperCase()}</span>
          </div>
        </div>

        {/* Live Visual Canvas Stage & Backdrop Toggles */}
        <div className="rounded-xl border border-slate-800 bg-[#03050c] p-3 overflow-hidden relative">
          <div className="flex items-center justify-between gap-2 mb-2 px-1">
            <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
              <Eye className="w-3.5 h-3.5 text-cyan-400" />
              المعاينة الحية التفاعلية:
            </span>

            {/* Backdrop modes */}
            <div className="flex items-center gap-1 text-[11px]">
              <span className="text-slate-500 ml-1">الخلفية:</span>
              <button
                onClick={() => setBackdropMode('checker')}
                className={`px-2 py-0.5 rounded ${
                  backdropMode === 'checker' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400'
                }`}
              >
                شفافة
              </button>
              <button
                onClick={() => setBackdropMode('dark')}
                className={`px-2 py-0.5 rounded ${
                  backdropMode === 'dark' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400'
                }`}
              >
                داكنة
              </button>
              <button
                onClick={() => setBackdropMode('light')}
                className={`px-2 py-0.5 rounded ${
                  backdropMode === 'light' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400'
                }`}
              >
                فاتحة
              </button>
            </div>
          </div>

          <div
            className={`w-full min-h-[260px] max-h-[440px] flex items-center justify-center rounded-lg overflow-hidden relative p-4 transition-colors ${
              backdropMode === 'checker'
                ? 'bg-checkerboard'
                : backdropMode === 'dark'
                ? 'bg-[#05070f]'
                : 'bg-slate-100'
            }`}
          >
            <img
              src={convertedResult ? convertedResult.convertedDataUrl : dataUrl}
              alt="معاينة حية"
              className="max-h-[380px] max-w-full object-contain rounded shadow-lg transition-transform duration-200"
            />
          </div>

          {/* Color Palette extracted */}
          {imageProps.palette.length > 0 && (
            <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-wrap items-center gap-2">
              <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">
                <Palette className="w-3.5 h-3.5 text-violet-400" />
                لوحة الألوان المستخرجة (انقر للنسخ):
              </span>
              <div className="flex flex-wrap items-center gap-2">
                {imageProps.palette.map((hex, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleCopyPaletteHex(hex)}
                    className="group flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-900 border border-slate-700 hover:border-cyan-400 text-[11px] font-mono transition-all cursor-pointer"
                    title={`نسخ كود اللون ${hex}`}
                  >
                    <span
                      className="w-3 h-3 rounded-full border border-white/20 shadow-sm"
                      style={{ backgroundColor: hex }}
                    />
                    <span className="text-slate-300">{hex}</span>
                    {copiedHex === hex && <Check className="w-3 h-3 text-emerald-400" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Advanced Converter & Resizer Controls */}
      <div className="rounded-2xl bg-[#080d1e]/90 border border-cyan-500/25 p-5 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.4)]">
        <div className="flex items-center gap-2 text-cyan-300 mb-4 border-b border-cyan-500/15 pb-3">
          <Sliders className="w-5 h-5 text-cyan-400" />
          <h3 className="text-base sm:text-lg font-bold">محول الصيغ وتغيير الحجم المحلي (Image Converter & Resizer)</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Format Selection */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-2">الصيغة المستهدفة (Target Format):</label>
            <div className="grid grid-cols-3 gap-2">
              {(['image/webp', 'image/png', 'image/jpeg'] as const).map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => handleSettingChange({ format: fmt })}
                  className={`py-2 px-3 rounded-xl text-xs font-bold font-mono transition-all cursor-pointer ${
                    settings.format === fmt
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400 shadow-[0_0_12px_rgba(0,242,254,0.2)]'
                      : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
                  }`}
                >
                  {fmt.replace('image/', '').toUpperCase()}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-slate-500 mt-2">
              * صيغة WebP توفر أفضل ضغط وجودة فائقة لصفحات الويب.
            </p>
          </div>

          {/* Quality Slider (for WebP and JPEG) */}
          <div>
            <div className="flex justify-between items-center text-xs font-semibold text-slate-300 mb-2">
              <span>جودة الضغط (Quality):</span>
              <span className="font-mono text-cyan-400 font-bold">{settings.quality}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              step="5"
              disabled={settings.format === 'image/png'}
              value={settings.quality}
              onChange={(e) => handleSettingChange({ quality: parseInt(e.target.value, 10) })}
              className="w-full accent-cyan-400 bg-slate-800 rounded-lg cursor-pointer h-2"
            />
            <p className="text-[11px] text-slate-500 mt-2">
              {settings.format === 'image/png' ? 'PNG بدون فقدان بيانات (Lossless).' : 'تقليل الجودة يقلل حجم الملف بشكل ملحوظ.'}
            </p>
          </div>

          {/* Scale Percentage */}
          <div>
            <div className="flex justify-between items-center text-xs font-semibold text-slate-300 mb-2">
              <span>نسبة تغيير الأبعاد (Scale):</span>
              <span className="font-mono text-violet-400 font-bold">{settings.scalePercent}%</span>
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {[100, 75, 50, 25].map((pct) => (
                <button
                  key={pct}
                  onClick={() => handleSettingChange({ scalePercent: pct })}
                  className={`py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                    settings.scalePercent === pct
                      ? 'bg-violet-500/20 text-violet-300 border border-violet-400'
                      : 'bg-slate-900 text-slate-400 border border-slate-800'
                  }`}
                >
                  {pct}%
                </button>
              ))}
            </div>
            <p className="text-[11px] text-slate-500 mt-2 font-mono">
              الأبعاد الناتجة:{' '}
              {Math.round((imageProps.width * settings.scalePercent) / 100)} ×{' '}
              {Math.round((imageProps.height * settings.scalePercent) / 100)} px
            </p>
          </div>
        </div>

        {/* Filters & Manipulations */}
        <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-slate-800/80">
          <button
            onClick={() => handleSettingChange({ grayscale: !settings.grayscale })}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              settings.grayscale
                ? 'bg-slate-300 text-slate-950 font-bold border border-white'
                : 'bg-slate-900 text-slate-400 border border-slate-800'
            }`}
          >
            أبيض وأسود (Grayscale)
          </button>

          <button
            onClick={() => handleSettingChange({ invert: !settings.invert })}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              settings.invert
                ? 'bg-violet-500/30 text-violet-300 border border-violet-400'
                : 'bg-slate-900 text-slate-400 border border-slate-800'
            }`}
          >
            عكس الألوان (Invert)
          </button>

          <button
            onClick={() => handleSettingChange({ rotate: (settings.rotate + 90) % 360 })}
            className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-bold border border-slate-800 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <RotateCw className="w-3.5 h-3.5 text-cyan-400" />
            تدوير 90° ({settings.rotate}°)
          </button>

          <div className="mr-auto flex items-center gap-2">
            {convertedResult && (
              <span className="text-xs text-emerald-400 font-mono bg-emerald-950/40 px-2.5 py-1 rounded-md border border-emerald-600/30">
                الحجم الناتج: {convertedResult.sizeFormatted}
              </span>
            )}
          </div>
        </div>

        {/* Converted Export & Download CTAs */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-end gap-3">
          <button
            onClick={handleCopyBase64}
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
          >
            <Copy className="w-4 h-4 text-violet-400" />
            نسخ كود Base64 Data URI
          </button>

          <button
            onClick={handleDownloadConverted}
            disabled={isConverting}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-extrabold text-sm shadow-[0_0_20px_rgba(0,242,254,0.4)] transition-all flex items-center gap-2 hover:scale-[1.02] cursor-pointer"
          >
            <Download className="w-4 h-4" />
            تنزيل الصورة المعالجة الآن
          </button>
        </div>

      </div>

    </div>
  );
};
