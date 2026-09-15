import { TextStats, TextCaseType } from '../types';

export function calculateTextStats(text: string): TextStats {
  if (!text) {
    return {
      charactersWithSpaces: 0,
      charactersNoSpaces: 0,
      words: 0,
      lines: 0,
      sentences: 0,
      paragraphs: 0,
      readingTimeSeconds: 0,
      speakingTimeSeconds: 0,
      avgWordLength: 0,
      topWords: [],
    };
  }

  const charactersWithSpaces = text.length;
  const charactersNoSpaces = text.replace(/\s/g, '').length;

  // Words regex that respects Arabic and other Unicode letters and numbers
  const wordsMatch: string[] = Array.from(text.match(/[\p{L}\p{N}_-]+/gu) || []);
  const words = wordsMatch.length;

  const lines = text.split(/\r\n|\r|\n/).length;

  // Sentences based on Arabic and English punctuation (. ! ? ؟ ؛)
  const sentencesMatch = text.split(/[.!?؟؛]+/).filter((s) => s.trim().length > 0);
  const sentences = sentencesMatch.length || (text.trim() ? 1 : 0);

  // Paragraphs
  const paragraphs = text
    .split(/\n+/)
    .filter((p) => p.trim().length > 0).length || (text.trim() ? 1 : 0);

  // Reading time (200 words per minute), speaking time (130 wpm)
  const readingTimeSeconds = Math.ceil((words / 200) * 60);
  const speakingTimeSeconds = Math.ceil((words / 130) * 60);

  const totalWordChars = wordsMatch.reduce<number>((acc, w) => acc + w.length, 0);
  const avgWordLength = words > 0 ? parseFloat((totalWordChars / words).toFixed(1)) : 0;

  // Top word frequencies (ignore short words <= 2 chars)
  const freqMap: Record<string, number> = {};
  for (const w of wordsMatch) {
    const clean = w.toLowerCase();
    if (clean.length > 2) {
      freqMap[clean] = (freqMap[clean] || 0) + 1;
    }
  }

  const topWords = Object.entries(freqMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([word, count]) => ({ word, count }));

  return {
    charactersWithSpaces,
    charactersNoSpaces,
    words,
    lines,
    sentences,
    paragraphs,
    readingTimeSeconds,
    speakingTimeSeconds,
    avgWordLength,
    topWords,
  };
}

export function transformTextCase(text: string, type: TextCaseType): string {
  switch (type) {
    case 'uppercase':
      return text.toUpperCase();

    case 'lowercase':
      return text.toLowerCase();

    case 'titlecase':
      return text.replace(
        /\w\S*/g,
        (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase()
      );

    case 'sentencecase':
      return text.toLowerCase().replace(/(^\s*\w|[.!?؟]\s*\w)/gu, (c) => c.toUpperCase());

    case 'camelcase': {
      const words = text
        .replace(/[^a-zA-Z0-9\u0621-\u064A]/g, ' ')
        .trim()
        .split(/\s+/);
      return words
        .map((w, idx) => {
          if (idx === 0) return w.toLowerCase();
          return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
        })
        .join('');
    }

    case 'pascalcase': {
      const words = text
        .replace(/[^a-zA-Z0-9\u0621-\u064A]/g, ' ')
        .trim()
        .split(/\s+/);
      return words
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join('');
    }

    case 'snakecase': {
      return text
        .trim()
        .replace(/([a-z])([A-Z])/g, '$1_$2')
        .replace(/[\s\W]+/g, '_')
        .replace(/^_+|_+$/g, '')
        .toLowerCase();
    }

    case 'kebabcase': {
      return text
        .trim()
        .replace(/([a-z])([A-Z])/g, '$1-$2')
        .replace(/[\s\W]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .toLowerCase();
    }

    case 'constantcase': {
      return text
        .trim()
        .replace(/([a-z])([A-Z])/g, '$1_$2')
        .replace(/[\s\W]+/g, '_')
        .replace(/^_+|_+$/g, '')
        .toUpperCase();
    }

    case 'remove_tashkeel':
      // Unicode ranges for Arabic diacritics: Fathah, Dammah, Kasrah, Sukun, Shaddah, Tanwin, etc.
      return text.replace(/[\u064B-\u065F\u0670]/g, '');

    case 'normalize_arabic':
      return text
        .replace(/[إأآا]/g, 'ا')
        .replace(/[ى]/g, 'ي')
        .replace(/[ؤ]/g, 'ء')
        .replace(/[ئ]/g, 'ء')
        .replace(/[\u064B-\u065F\u0670\u0640]/g, '');

    case 'remove_tatweel':
      // Kashida / Tatweel
      return text.replace(/\u0640/g, '');

    case 'hindi_to_arabic_digits': {
      const eastern = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
      let result = text;
      for (let i = 0; i < 10; i++) {
        result = result.replace(new RegExp(eastern[i], 'g'), String(i));
      }
      return result;
    }

    case 'arabic_to_hindi_digits': {
      const eastern = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
      let result = text;
      for (let i = 0; i < 10; i++) {
        result = result.replace(new RegExp(String(i), 'g'), eastern[i]);
      }
      return result;
    }

    case 'reverse':
      return text.split('').reverse().join('');

    case 'base64_encode':
      try {
        const bytes = new TextEncoder().encode(text);
        let binary = '';
        for (let i = 0; i < bytes.length; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary);
      } catch (e) {
        return 'خطأ في ترميز Base64: ' + String(e);
      }

    case 'base64_decode':
      try {
        const binary = atob(text.trim());
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
          bytes[i] = binary.charCodeAt(i);
        }
        return new TextDecoder().decode(bytes);
      } catch {
        return 'خطأ: النص ليس بتنسيق Base64 صالح.';
      }

    case 'url_encode':
      return encodeURIComponent(text);

    case 'url_decode':
      try {
        return decodeURIComponent(text);
      } catch {
        return 'خطأ: النص ليس بتنسيق URL مشفر صالح.';
      }

    case 'hex_encode': {
      const bytes = new TextEncoder().encode(text);
      return Array.from(bytes)
        .map((b) => b.toString(16).padStart(2, '0'))
        .join(' ');
    }

    case 'hex_decode': {
      try {
        const clean = text.replace(/[^0-9a-fA-F]/g, '');
        if (clean.length % 2 !== 0) throw new Error('Hex length must be even');
        const bytes = new Uint8Array(clean.length / 2);
        for (let i = 0; i < clean.length; i += 2) {
          bytes[i / 2] = parseInt(clean.substring(i, i + 2), 16);
        }
        return new TextDecoder().decode(bytes);
      } catch {
        return 'خطأ في فك ترميز Hex. تأكد من صحة الرموز السداسية عشرية.';
      }
    }

    default:
      return text;
  }
}

export async function computeCryptoHash(text: string, algorithm: 'SHA-256' | 'SHA-1'): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest(algorithm, data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}
