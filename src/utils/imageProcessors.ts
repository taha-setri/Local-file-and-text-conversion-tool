import { ImageProperties, ImageConversionSettings } from '../types';

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function calculateAspectRatio(width: number, height: number): { ratio: string; floatVal: number; label: string } {
  if (!width || !height) return { ratio: '0:0', floatVal: 0, label: 'غير محدد' };

  function gcd(a: number, b: number): number {
    return b === 0 ? a : gcd(b, a % b);
  }

  const divisor = gcd(width, height);
  const rw = width / divisor;
  const rh = height / divisor;
  const floatVal = parseFloat((width / height).toFixed(3));

  // Determine common aspect ratio labels
  let label = `${rw}:${rh}`;
  if (Math.abs(floatVal - 1.777) < 0.05) label = '16:9 (عريض قياسي)';
  else if (Math.abs(floatVal - 1.333) < 0.05) label = '4:3 (شاشة كلاسيكية)';
  else if (Math.abs(floatVal - 1.0) < 0.02) label = '1:1 (مربع متطابق)';
  else if (Math.abs(floatVal - 0.5625) < 0.05) label = '9:16 (شاشة عمودية/Story)';
  else if (Math.abs(floatVal - 2.333) < 0.08) label = '21:9 (سينمائي فائق)';
  else if (Math.abs(floatVal - 1.5) < 0.05) label = '3:2 (تصوير فوتوغرافي)';

  return {
    ratio: `${rw}:${rh}`,
    floatVal,
    label,
  };
}

export async function analyzeImage(dataUrl: string, fileSize: number, mimeType: string): Promise<ImageProperties> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      const width = img.naturalWidth || img.width;
      const height = img.naturalHeight || img.height;
      const megapixels = ((width * height) / 1000000).toFixed(2) + ' MP';
      const { ratio, floatVal, label } = calculateAspectRatio(width, height);

      // Extract color palette via canvas
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      let palette: string[] = [];

      if (ctx) {
        // scale down for fast analysis
        canvas.width = 64;
        canvas.height = 64;
        ctx.drawImage(img, 0, 0, 64, 64);
        const imgData = ctx.getImageData(0, 0, 64, 64).data;
        const colorCounts: Record<string, number> = {};

        for (let i = 0; i < imgData.length; i += 16) {
          const r = Math.round(imgData[i] / 32) * 32;
          const g = Math.round(imgData[i + 1] / 32) * 32;
          const b = Math.round(imgData[i + 2] / 32) * 32;
          const a = imgData[i + 3];
          if (a > 128) {
            const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
            colorCounts[hex] = (colorCounts[hex] || 0) + 1;
          }
        }

        palette = Object.entries(colorCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 6)
          .map(([hex]) => hex);
      }

      resolve({
        width,
        height,
        aspectRatio: ratio,
        aspectRatioFloat: floatVal,
        aspectLabel: label,
        megapixels,
        sizeFormatted: formatFileSize(fileSize),
        mimeType,
        palette,
      });
    };
    img.onerror = () => reject(new Error('فشل تحميل الصورة للمعاينة'));
    img.src = dataUrl;
  });
}

export async function convertAndProcessImage(
  dataUrl: string,
  settings: ImageConversionSettings
): Promise<{ blob: Blob; convertedDataUrl: string; sizeFormatted: string }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      let targetWidth = img.naturalWidth || img.width;
      let targetHeight = img.naturalHeight || img.height;

      if (settings.scalePercent && settings.scalePercent !== 100) {
        const factor = settings.scalePercent / 100;
        targetWidth = Math.round(targetWidth * factor);
        targetHeight = Math.round(targetHeight * factor);
      } else if (settings.customWidth && settings.customHeight) {
        targetWidth = settings.customWidth;
        targetHeight = settings.customHeight;
      }

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('فشل تهيئة سياق الرسم في المتصفح'));
        return;
      }

      // Handle rotation
      const rotateDeg = settings.rotate % 360;
      if (rotateDeg === 90 || rotateDeg === 270) {
        canvas.width = targetHeight;
        canvas.height = targetWidth;
      } else {
        canvas.width = targetWidth;
        canvas.height = targetHeight;
      }

      ctx.save();
      // Apply rotation transformation around center
      if (rotateDeg !== 0) {
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((rotateDeg * Math.PI) / 180);
        ctx.drawImage(img, -targetWidth / 2, -targetHeight / 2, targetWidth, targetHeight);
      } else {
        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
      }
      ctx.restore();

      // Apply image filters if requested
      if (settings.grayscale || settings.invert) {
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const d = imgData.data;
        for (let i = 0; i < d.length; i += 4) {
          let r = d[i];
          let g = d[i + 1];
          let b = d[i + 2];

          if (settings.grayscale) {
            const v = 0.2126 * r + 0.7152 * g + 0.0722 * b;
            r = v;
            g = v;
            b = v;
          }

          if (settings.invert) {
            r = 255 - r;
            g = 255 - g;
            b = 255 - b;
          }

          d[i] = r;
          d[i + 1] = g;
          d[i + 2] = b;
        }
        ctx.putImageData(imgData, 0, 0);
      }

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('فشل إنشاء ملف الصورة المعالجة'));
            return;
          }
          const convertedDataUrl = canvas.toDataURL(settings.format, settings.quality / 100);
          resolve({
            blob,
            convertedDataUrl,
            sizeFormatted: formatFileSize(blob.size),
          });
        },
        settings.format,
        settings.quality / 100
      );
    };
    img.onerror = () => reject(new Error('فشل معالجة الصورة'));
    img.src = dataUrl;
  });
}
