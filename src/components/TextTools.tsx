import React, { useState, useMemo, useEffect } from 'react';
import {
  Copy,
  Check,
  Trash2,
  Download,
  ClipboardPaste,
  Sliders,
  Type,
  Hash,
  Clock,
  Sparkles,
  Key,
  Shield,
  FileDown,
} from 'lucide-react';
import { calculateTextStats, transformTextCase, computeCryptoHash } from '../utils/textProcessors';
import { TextCaseType } from '../types';

interface TextToolsProps {
  initialText?: string;
  onShowToast: (title: string, desc?: string, type?: 'success' | 'info' | 'warning') => void;
}

export const TextTools: React.FC<TextToolsProps> = ({ initialText = '', onShowToast }) => {
  const [text, setText] = useState<string>(initialText);
  const [copied, setCopied] = useState<boolean>(false);
  const [activeCategory, setActiveCategory] = useState<'case' | 'arabic' | 'crypto'>('case');
  const [shaHash, setShaHash] = useState<string>('');
  const [isHashing, setIsHashing] = useState<boolean>(false);

  // Sync when initialText changes from file drop
  useEffect(() => {
    if (initialText) {
      setText(initialText);
    }
  }, [initialText]);

  // Real-time statistics calculation
  const stats = useMemo(() => calculateTextStats(text), [text]);

  const handleCaseTransform = (type: TextCaseType, label: string) => {
    if (!text.trim()) {
      onShowToast('تنبيه', 'يرجى إدخال نص أولاً لتطبيق التحويل.', 'warning');
      return;
    }
    const transformed = transformTextCase(text, type);
    setText(transformed);
    onShowToast('تم التحويل بنجاح', `تم تطبيق تحويل: ${label}`, 'success');
  };

  const handleGenerateHash = async () => {
    if (!text.trim()) {
      onShowToast('تنبيه', 'يرجى إدخال نص لحساب البصمة الرقمية.', 'warning');
      return;
    }
    setIsHashing(true);
    try {
      const hash = await computeCryptoHash(text, 'SHA-256');
      setShaHash(hash);
      onShowToast('بصمة SHA-256', 'تم احتساب البصمة التشفيرية محلياً 100%.', 'success');
    } catch {
      onShowToast('خطأ', 'تعذر حساب البصمة التشفيرية.', 'warning');
    } finally {
      setIsHashing(false);
    }
  };

  const handleCopyText = async (customText?: string) => {
    const toCopy = customText ?? text;
    if (!toCopy) return;
    try {
      await navigator.clipboard.writeText(toCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      onShowToast('تم النسخ', 'تم نسخ النص إلى الحافظة بنجاح.', 'success');
    } catch {
      onShowToast('تنبيه', 'تعذر الوصول التلقائي للحافظة، يرجى النسخ يدوياً.', 'warning');
    }
  };

  const handlePasteText = async () => {
    try {
      const clipText = await navigator.clipboard.readText();
      if (clipText) {
        setText(clipText);
        onShowToast('تم اللصق', 'تم استيراد النص من الحافظة.', 'success');
      }
    } catch {
      onShowToast('تنبيه', 'يرجى لصق النص يدوياً داخل المربع.', 'info');
    }
  };

  const handleDownloadTxt = () => {
    if (!text) return;
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `text_converted_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    onShowToast('تم التنزيل', 'تم حفظ الملف النصي على جهازك بنجاح.', 'success');
  };

  const handleCleanSpaces = () => {
    if (!text) return;
    const cleaned = text
      .split('\n')
      .map((line) => line.replace(/\s+/g, ' ').trim())
      .join('\n')
      .replace(/\n{3,}/g, '\n\n');
    setText(cleaned);
    onShowToast('تنسيق', 'تم تنظيف المسافات والأسطر الزائدة.', 'success');
  };

  return (
    <div className="w-full space-y-6">
      
      {/* Real-time Word & Character Counter Dashboard */}
      <div className="rounded-2xl bg-[#080d1e]/90 border border-cyan-500/25 p-5 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.4)] relative overflow-hidden">
        <div className="flex items-center justify-between gap-4 mb-4 border-b border-cyan-500/15 pb-3">
          <div className="flex items-center gap-2 text-cyan-300">
            <Hash className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base sm:text-lg font-bold">عداد الكلمات والأحرف اللحظي (Real-Time Metrics)</h3>
          </div>
          <div className="text-xs font-mono text-emerald-400 flex items-center gap-1.5 bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-500/30">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            تحديث لحظي
          </div>
        </div>

        {/* Primary Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="rounded-xl bg-[#04060f]/80 border border-cyan-500/20 p-3 text-center relative group hover:border-cyan-400/60 transition-all">
            <span className="text-xs text-slate-400 block mb-1 font-medium">الأحرف (مع المسافات)</span>
            <span className="text-2xl sm:text-3xl font-extrabold text-cyan-300 font-cyber block tracking-tight">
              {stats.charactersWithSpaces.toLocaleString()}
            </span>
          </div>

          <div className="rounded-xl bg-[#04060f]/80 border border-cyan-500/20 p-3 text-center relative group hover:border-cyan-400/60 transition-all">
            <span className="text-xs text-slate-400 block mb-1 font-medium">الأحرف (بدون مسافات)</span>
            <span className="text-2xl sm:text-3xl font-extrabold text-white font-cyber block tracking-tight">
              {stats.charactersNoSpaces.toLocaleString()}
            </span>
          </div>

          <div className="rounded-xl bg-[#04060f]/80 border border-violet-500/20 p-3 text-center relative group hover:border-violet-400/60 transition-all">
            <span className="text-xs text-slate-400 block mb-1 font-medium">الكلمات الإجمالية</span>
            <span className="text-2xl sm:text-3xl font-extrabold text-violet-300 font-cyber block tracking-tight">
              {stats.words.toLocaleString()}
            </span>
          </div>

          <div className="rounded-xl bg-[#04060f]/80 border border-slate-700/60 p-3 text-center relative group hover:border-slate-500 transition-all">
            <span className="text-xs text-slate-400 block mb-1 font-medium">عدد الأسطر</span>
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-200 font-cyber block tracking-tight">
              {stats.lines.toLocaleString()}
            </span>
          </div>

          <div className="rounded-xl bg-[#04060f]/80 border border-slate-700/60 p-3 text-center relative group hover:border-slate-500 transition-all">
            <span className="text-xs text-slate-400 block mb-1 font-medium">عدد الجمل</span>
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-200 font-cyber block tracking-tight">
              {stats.sentences.toLocaleString()}
            </span>
          </div>

          <div className="rounded-xl bg-[#04060f]/80 border border-amber-500/20 p-3 text-center relative group hover:border-amber-400/60 transition-all">
            <span className="text-xs text-slate-400 block mb-1 font-medium flex items-center justify-center gap-1">
              <Clock className="w-3 h-3 text-amber-400" />
              زمن القراءة
            </span>
            <span className="text-2xl sm:text-3xl font-extrabold text-amber-300 font-cyber block tracking-tight">
              {stats.readingTimeSeconds}ث
            </span>
            <span className="text-[10px] text-slate-500 font-mono">الإلقاء: {stats.speakingTimeSeconds}ث</span>
          </div>
        </div>

        {/* Secondary Word Insights (Keywords & Paragraphs) */}
        {stats.topWords.length > 0 && (
          <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-400 font-semibold">أعلى الكلمات تكراراً:</span>
            {stats.topWords.map((item, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-md bg-cyan-950/60 border border-cyan-700/40 text-cyan-300 font-mono text-[11px]"
              >
                {item.word} ({item.count})
              </span>
            ))}
            <span className="text-slate-500 mr-auto text-[11px]">
              الفقرات: {stats.paragraphs} • متوسط طول الكلمة: {stats.avgWordLength} حرف
            </span>
          </div>
        )}
      </div>

      {/* Main Textarea with Holographic Action Header */}
      <div className="rounded-2xl bg-[#080d1e]/90 border border-cyan-500/25 p-5 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.4)]">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <Type className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-white">محرر النصوص التفاعلي</h3>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handlePasteText}
              className="px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
              title="لصق النص من الحافظة"
            >
              <ClipboardPaste className="w-3.5 h-3.5 text-cyan-400" />
              لصق
            </button>

            <button
              onClick={handleCleanSpaces}
              className="px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
              title="إزالة المسافات المزدوجة والأسطر الفارغة الزائدة"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              تنظيف المسافات
            </button>

            <button
              onClick={() => handleCopyText()}
              className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                copied
                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                  : 'bg-cyan-500/20 hover:bg-cyan-500/30 border-cyan-500/40 text-cyan-200'
              }`}
              title="نسخ النص كاملاً"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'تم النسخ!' : 'نسخ النص'}
            </button>

            <button
              onClick={handleDownloadTxt}
              className="px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
              title="حفظ كملف نصي .txt"
            >
              <FileDown className="w-3.5 h-3.5 text-violet-400" />
              حفظ TXT
            </button>

            <button
              onClick={() => {
                setText('');
                setShaHash('');
              }}
              className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-red-500/20 border border-slate-700 hover:border-red-500/40 text-slate-400 hover:text-red-300 text-xs transition-all cursor-pointer"
              title="مسح النص"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Text Area */}
        <div className="relative">
          <textarea
            id="main-text-input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="اكتب هنا، أو الصق نصك، أو أسقط أي ملف نصي في منطقة السحب والإفلات بالأعلى لمعالجته فورياً..."
            rows={8}
            className="w-full bg-[#04060f]/90 text-slate-100 border border-cyan-500/30 focus:border-cyan-400 rounded-xl p-4 text-base font-code leading-relaxed outline-none transition-all focus:shadow-[0_0_25px_rgba(0,242,254,0.25)] resize-y placeholder:text-slate-500"
            dir="auto"
          />
        </div>

        {/* Transform Tools Navigation Tabs */}
        <div className="mt-6 border-t border-slate-800/80 pt-5">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              <span className="text-sm font-bold text-slate-200">أدوات تحويل النصوص المتقدمة:</span>
            </div>

            <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => setActiveCategory('case')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeCategory === 'case'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                أحرف إنجليزية ولاتينية
              </button>
              <button
                type="button"
                onClick={() => setActiveCategory('arabic')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeCategory === 'arabic'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                أدوات اللغة العربية
              </button>
              <button
                type="button"
                onClick={() => setActiveCategory('crypto')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeCategory === 'crypto'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                تشفير وترميز محلي
              </button>
            </div>
          </div>

          {/* Sub-category: English Case converters */}
          {activeCategory === 'case' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
              <button
                onClick={() => handleCaseTransform('uppercase', 'UPPERCASE')}
                className="px-3 py-2.5 rounded-xl bg-slate-900/80 hover:bg-cyan-950/50 border border-slate-800 hover:border-cyan-400/50 text-slate-200 hover:text-cyan-200 text-xs font-semibold transition-all text-right flex flex-col cursor-pointer"
              >
                <span className="font-bold font-mono text-cyan-300">UPPERCASE</span>
                <span className="text-[11px] text-slate-400">تحويل كل الأحرف إلى كبيرة</span>
              </button>

              <button
                onClick={() => handleCaseTransform('lowercase', 'lowercase')}
                className="px-3 py-2.5 rounded-xl bg-slate-900/80 hover:bg-cyan-950/50 border border-slate-800 hover:border-cyan-400/50 text-slate-200 hover:text-cyan-200 text-xs font-semibold transition-all text-right flex flex-col cursor-pointer"
              >
                <span className="font-bold font-mono text-cyan-300">lowercase</span>
                <span className="text-[11px] text-slate-400">تحويل كل الأحرف إلى صغيرة</span>
              </button>

              <button
                onClick={() => handleCaseTransform('titlecase', 'Title Case')}
                className="px-3 py-2.5 rounded-xl bg-slate-900/80 hover:bg-cyan-950/50 border border-slate-800 hover:border-cyan-400/50 text-slate-200 hover:text-cyan-200 text-xs font-semibold transition-all text-right flex flex-col cursor-pointer"
              >
                <span className="font-bold font-mono text-cyan-300">Title Case</span>
                <span className="text-[11px] text-slate-400">بداية كل كلمة حرف كبير</span>
              </button>

              <button
                onClick={() => handleCaseTransform('sentencecase', 'Sentence case')}
                className="px-3 py-2.5 rounded-xl bg-slate-900/80 hover:bg-cyan-950/50 border border-slate-800 hover:border-cyan-400/50 text-slate-200 hover:text-cyan-200 text-xs font-semibold transition-all text-right flex flex-col cursor-pointer"
              >
                <span className="font-bold font-mono text-cyan-300">Sentence case</span>
                <span className="text-[11px] text-slate-400">بداية الجمل حرف كبير</span>
              </button>

              <button
                onClick={() => handleCaseTransform('camelcase', 'camelCase')}
                className="px-3 py-2.5 rounded-xl bg-slate-900/80 hover:bg-cyan-950/50 border border-slate-800 hover:border-cyan-400/50 text-slate-200 hover:text-cyan-200 text-xs font-semibold transition-all text-right flex flex-col cursor-pointer"
              >
                <span className="font-bold font-mono text-cyan-300">camelCase</span>
                <span className="text-[11px] text-slate-400">صيغة سنام الجمل البرمجية</span>
              </button>

              <button
                onClick={() => handleCaseTransform('pascalcase', 'PascalCase')}
                className="px-3 py-2.5 rounded-xl bg-slate-900/80 hover:bg-cyan-950/50 border border-slate-800 hover:border-cyan-400/50 text-slate-200 hover:text-cyan-200 text-xs font-semibold transition-all text-right flex flex-col cursor-pointer"
              >
                <span className="font-bold font-mono text-cyan-300">PascalCase</span>
                <span className="text-[11px] text-slate-400">صيغة باسكال البرمجية</span>
              </button>

              <button
                onClick={() => handleCaseTransform('snakecase', 'snake_case')}
                className="px-3 py-2.5 rounded-xl bg-slate-900/80 hover:bg-cyan-950/50 border border-slate-800 hover:border-cyan-400/50 text-slate-200 hover:text-cyan-200 text-xs font-semibold transition-all text-right flex flex-col cursor-pointer"
              >
                <span className="font-bold font-mono text-cyan-300">snake_case</span>
                <span className="text-[11px] text-slate-400">فصل الكلمات بشرطة سفلية</span>
              </button>

              <button
                onClick={() => handleCaseTransform('kebabcase', 'kebab-case')}
                className="px-3 py-2.5 rounded-xl bg-slate-900/80 hover:bg-cyan-950/50 border border-slate-800 hover:border-cyan-400/50 text-slate-200 hover:text-cyan-200 text-xs font-semibold transition-all text-right flex flex-col cursor-pointer"
              >
                <span className="font-bold font-mono text-cyan-300">kebab-case</span>
                <span className="text-[11px] text-slate-400">فصل الكلمات بشرطة وسطية</span>
              </button>

              <button
                onClick={() => handleCaseTransform('constantcase', 'CONSTANT_CASE')}
                className="px-3 py-2.5 rounded-xl bg-slate-900/80 hover:bg-cyan-950/50 border border-slate-800 hover:border-cyan-400/50 text-slate-200 hover:text-cyan-200 text-xs font-semibold transition-all text-right flex flex-col cursor-pointer"
              >
                <span className="font-bold font-mono text-cyan-300">CONSTANT_CASE</span>
                <span className="text-[11px] text-slate-400">أحرف كبيرة مع شرطة سفلية</span>
              </button>

              <button
                onClick={() => handleCaseTransform('reverse', 'عكس الحروف')}
                className="px-3 py-2.5 rounded-xl bg-slate-900/80 hover:bg-cyan-950/50 border border-slate-800 hover:border-cyan-400/50 text-slate-200 hover:text-cyan-200 text-xs font-semibold transition-all text-right flex flex-col cursor-pointer"
              >
                <span className="font-bold font-mono text-cyan-300">Reverse Text</span>
                <span className="text-[11px] text-slate-400">عكس ترتيب الحروف تماماً</span>
              </button>
            </div>
          )}

          {/* Sub-category: Arabic Tools */}
          {activeCategory === 'arabic' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              <button
                onClick={() => handleCaseTransform('remove_tashkeel', 'إزالة التشكيل')}
                className="px-3.5 py-3 rounded-xl bg-slate-900/80 hover:bg-cyan-950/50 border border-slate-800 hover:border-cyan-400/50 text-slate-200 hover:text-cyan-200 text-xs font-semibold transition-all text-right flex flex-col cursor-pointer"
              >
                <span className="font-bold text-cyan-300 text-sm mb-0.5">إزالة التشكيل والحركات</span>
                <span className="text-[11px] text-slate-400">حذف الفتحة والضمة والكسرة والتنوين والشدة</span>
              </button>

              <button
                onClick={() => handleCaseTransform('normalize_arabic', 'توحيد الهمزات والألف')}
                className="px-3.5 py-3 rounded-xl bg-slate-900/80 hover:bg-cyan-950/50 border border-slate-800 hover:border-cyan-400/50 text-slate-200 hover:text-cyan-200 text-xs font-semibold transition-all text-right flex flex-col cursor-pointer"
              >
                <span className="font-bold text-cyan-300 text-sm mb-0.5">توحيد الهمزات والألف</span>
                <span className="text-[11px] text-slate-400">تحويل (إ، أ، آ) إلى (ا) وتوحيد الياء والألف المقصورة</span>
              </button>

              <button
                onClick={() => handleCaseTransform('remove_tatweel', 'إزالة التطويل')}
                className="px-3.5 py-3 rounded-xl bg-slate-900/80 hover:bg-cyan-950/50 border border-slate-800 hover:border-cyan-400/50 text-slate-200 hover:text-cyan-200 text-xs font-semibold transition-all text-right flex flex-col cursor-pointer"
              >
                <span className="font-bold text-cyan-300 text-sm mb-0.5">إزالة الكشيدة والتطويل (ـ)</span>
                <span className="text-[11px] text-slate-400">حذف مسافات المد الزخرفية بين الأحرف العربية</span>
              </button>

              <button
                onClick={() => handleCaseTransform('hindi_to_arabic_digits', 'أرقام عربية')}
                className="px-3.5 py-3 rounded-xl bg-slate-900/80 hover:bg-cyan-950/50 border border-slate-800 hover:border-cyan-400/50 text-slate-200 hover:text-cyan-200 text-xs font-semibold transition-all text-right flex flex-col cursor-pointer"
              >
                <span className="font-bold text-cyan-300 text-sm mb-0.5">تحويل إلى أرقام عربية (123)</span>
                <span className="text-[11px] text-slate-400">تحويل الأرقام الهندية/المشرقية (١٢٣) إلى (123)</span>
              </button>

              <button
                onClick={() => handleCaseTransform('arabic_to_hindi_digits', 'أرقام هندية')}
                className="px-3.5 py-3 rounded-xl bg-slate-900/80 hover:bg-cyan-950/50 border border-slate-800 hover:border-cyan-400/50 text-slate-200 hover:text-cyan-200 text-xs font-semibold transition-all text-right flex flex-col cursor-pointer"
              >
                <span className="font-bold text-cyan-300 text-sm mb-0.5">تحويل إلى أرقام مشرقية (١٢٣)</span>
                <span className="text-[11px] text-slate-400">تحويل الأرقام (123) إلى أرقام مشرقية (١٢٣)</span>
              </button>
            </div>
          )}

          {/* Sub-category: Crypto & Encoders */}
          {activeCategory === 'crypto' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <button
                  onClick={() => handleCaseTransform('base64_encode', 'Base64 Encode')}
                  className="px-3 py-2 rounded-xl bg-slate-900/80 hover:bg-violet-950/50 border border-slate-800 hover:border-violet-400/50 text-slate-200 text-xs font-bold transition-all flex flex-col cursor-pointer"
                >
                  <span className="text-violet-300 font-mono">Base64 Encode</span>
                  <span className="text-[11px] text-slate-400 font-normal">ترميز Base64</span>
                </button>

                <button
                  onClick={() => handleCaseTransform('base64_decode', 'Base64 Decode')}
                  className="px-3 py-2 rounded-xl bg-slate-900/80 hover:bg-violet-950/50 border border-slate-800 hover:border-violet-400/50 text-slate-200 text-xs font-bold transition-all flex flex-col cursor-pointer"
                >
                  <span className="text-violet-300 font-mono">Base64 Decode</span>
                  <span className="text-[11px] text-slate-400 font-normal">فك ترميز Base64</span>
                </button>

                <button
                  onClick={() => handleCaseTransform('url_encode', 'URL Encode')}
                  className="px-3 py-2 rounded-xl bg-slate-900/80 hover:bg-violet-950/50 border border-slate-800 hover:border-violet-400/50 text-slate-200 text-xs font-bold transition-all flex flex-col cursor-pointer"
                >
                  <span className="text-violet-300 font-mono">URL Encode</span>
                  <span className="text-[11px] text-slate-400 font-normal">ترميز روابط الويب</span>
                </button>

                <button
                  onClick={() => handleCaseTransform('url_decode', 'URL Decode')}
                  className="px-3 py-2 rounded-xl bg-slate-900/80 hover:bg-violet-950/50 border border-slate-800 hover:border-violet-400/50 text-slate-200 text-xs font-bold transition-all flex flex-col cursor-pointer"
                >
                  <span className="text-violet-300 font-mono">URL Decode</span>
                  <span className="text-[11px] text-slate-400 font-normal">فك ترميز روابط الويب</span>
                </button>
              </div>

              {/* SHA-256 Hash generator */}
              <div className="rounded-xl bg-[#04060f] border border-cyan-500/20 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1.5 text-xs text-cyan-300 font-bold">
                    <Key className="w-3.5 h-3.5" />
                    توليد بصمة التشفير التراكمية (SHA-256 Hash):
                  </div>
                  <button
                    onClick={handleGenerateHash}
                    disabled={isHashing}
                    className="px-3 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/40 text-cyan-200 text-xs font-bold transition-all cursor-pointer"
                  >
                    {isHashing ? 'جار الحساب...' : 'حساب SHA-256 الآن'}
                  </button>
                </div>

                {shaHash && (
                  <div className="flex items-center gap-2 mt-2">
                    <input
                      type="text"
                      readOnly
                      value={shaHash}
                      className="flex-1 bg-slate-950 border border-cyan-500/30 text-emerald-400 font-mono text-xs rounded-lg px-3 py-2"
                    />
                    <button
                      onClick={() => handleCopyText(shaHash)}
                      className="px-3 py-2 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-xs font-bold border border-cyan-500/40"
                    >
                      نسخ
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};
