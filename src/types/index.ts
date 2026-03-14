export interface Chapter {
  id: number;
  revelation_place: string;
  revelation_order: number;
  bismillah_pre: boolean;
  name_simple: string;
  name_complex: string;
  name_arabic: string;
  verses_count: number;
  pages: number[];
  translated_name: {
    language_name: string;
    name: string;
  };
}

export interface Verse {
  id: number;
  verse_number: number;
  verse_key: string;
  hizb_number: number;
  rub_el_hizb_number: number;
  ruku_number: number;
  manzil_number: number;
  sajdah_number: number | null;
  text_uthmani: string;
  page_number: number;
  juz_number: number;
  translations?: Translation[];
  words?: Word[];
}

export interface Translation {
  id: number;
  resource_id: number;
  text: string;
}

export interface Word {
  id: number;
  position: number;
  text_uthmani: string;
  translation: {
    text: string;
    language_name: string;
  };
  transliteration: {
    text: string;
    language_name: string;
  };
}

export interface Reciter {
  id: number;
  reciter_name: string;
  style: string | null;
  translated_name: {
    name: string;
    language_name: string;
  };
}

export interface AudioFile {
  url: string;
  duration: number;
  format: string;
  verse_key: string;
}

export interface ChapterAudio {
  id: number;
  chapter_id: number;
  file_size: number;
  format: string;
  audio_url: string;
}

export interface SearchResult {
  search: {
    query: string;
    total_results: number;
    current_page: number;
    total_pages: number;
    results: SearchVerse[];
  };
}

export interface SearchVerse {
  verse_key: string;
  verse_id: number;
  text: string;
  highlighted: string | null;
  translations: {
    text: string;
    resource_id: number;
    name: string;
    language_name: string;
  }[];
}

export interface QueueItem {
  chapterId: number;
  chapterName: string;
  chapterNameArabic: string;
  audioUrl: string;
  reciterName: string;
}
