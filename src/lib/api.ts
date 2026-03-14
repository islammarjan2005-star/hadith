import { Chapter, Verse, Reciter, AudioFile, ChapterAudio, SearchResult } from '@/types';

const BASE_URL = 'https://api.quran.com/api/v4';
const AUDIO_CDN = 'https://verses.quran.com';

async function fetchApi<T>(endpoint: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${endpoint}`, { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export async function getChapters(): Promise<Chapter[]> {
  const data = await fetchApi<{ chapters: Chapter[] }>('/chapters?language=en');
  return data.chapters;
}

export async function getChapter(id: number): Promise<Chapter> {
  const data = await fetchApi<{ chapter: Chapter }>(`/chapters/${id}?language=en`);
  return data.chapter;
}

export async function getVerses(
  chapterId: number,
  page: number = 1
): Promise<{ verses: Verse[]; pagination: { total_pages: number; current_page: number; total_records: number } }> {
  const data = await fetchApi<{
    verses: Verse[];
    pagination: { total_pages: number; current_page: number; total_records: number };
  }>(
    `/verses/by_chapter/${chapterId}?language=en&translations=131&fields=text_uthmani&per_page=50&page=${page}`
  );
  return data;
}

export async function getAudioFiles(
  reciterId: number,
  chapterId: number
): Promise<AudioFile[]> {
  const data = await fetchApi<{ audio_files: AudioFile[] }>(
    `/recitations/${reciterId}/by_chapter/${chapterId}`
  );
  return data.audio_files.map((f) => ({
    ...f,
    url: f.url.startsWith('http') ? f.url : `${AUDIO_CDN}/${f.url}`,
  }));
}

export async function getChapterAudio(
  reciterId: number,
  chapterId: number
): Promise<ChapterAudio> {
  const data = await fetchApi<{ audio_file: ChapterAudio }>(
    `/chapter_recitations/${reciterId}/${chapterId}`
  );
  return data.audio_file;
}

export async function getReciters(): Promise<Reciter[]> {
  const data = await fetchApi<{ recitations: Reciter[] }>('/resources/recitations?language=en');
  return data.recitations;
}

export async function searchVerses(query: string, page: number = 1): Promise<SearchResult> {
  const data = await fetchApi<SearchResult>(
    `/search?q=${encodeURIComponent(query)}&size=20&page=${page}&language=en`
  );
  return data;
}
