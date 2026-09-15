export interface FileAnalysis {
  name: string;
  size: number;
  type: string;
  lastModified: number;
  extension: string;
  content?: string;
  dataUrl?: string;
  isImage: boolean;
  isText: boolean;
}

export interface ImageProperties {
  width: number;
  height: number;
  aspectRatio: string;
  aspectRatioFloat: number;
  aspectLabel: string;
  megapixels: string;
  sizeFormatted: string;
  mimeType: string;
  palette: string[];
}

export interface ImageConversionSettings {
  format: 'image/png' | 'image/jpeg' | 'image/webp';
  quality: number;
  scalePercent: number;
  customWidth?: number;
  customHeight?: number;
  maintainAspect: boolean;
  grayscale: boolean;
  invert: boolean;
  rotate: number; // 0, 90, 180, 270
}

export interface TextStats {
  charactersWithSpaces: number;
  charactersNoSpaces: number;
  words: number;
  lines: number;
  sentences: number;
  paragraphs: number;
  readingTimeSeconds: number;
  speakingTimeSeconds: number;
  avgWordLength: number;
  topWords: { word: string; count: number }[];
}

export type TextCaseType =
  | 'uppercase'
  | 'lowercase'
  | 'titlecase'
  | 'sentencecase'
  | 'camelcase'
  | 'pascalcase'
  | 'snakecase'
  | 'kebabcase'
  | 'constantcase'
  | 'remove_tashkeel'
  | 'normalize_arabic'
  | 'remove_tatweel'
  | 'hindi_to_arabic_digits'
  | 'arabic_to_hindi_digits'
  | 'reverse'
  | 'base64_encode'
  | 'base64_decode'
  | 'url_encode'
  | 'url_decode'
  | 'hex_encode'
  | 'hex_decode';

export interface ToastMessage {
  id: string;
  title: string;
  desc?: string;
  type?: 'success' | 'info' | 'warning';
}
