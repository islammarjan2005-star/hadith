import { getChapterAudio } from '@/lib/api';
import { QueueItem, Chapter } from '@/types';

export async function resolveAudioUrl(reciterId: number, chapterId: number): Promise<string> {
  try {
    const audio = await getChapterAudio(reciterId, chapterId);
    return audio.audio_url;
  } catch {
    const paddedId = chapterId.toString().padStart(3, '0');
    return `https://download.quranicaudio.com/quran/mishaari_raashid_al_3afaasee/${paddedId}.mp3`;
  }
}

export function buildQueueFromChapters(
  chapters: Chapter[],
  reciterName: string
): QueueItem[] {
  return chapters.map((ch) => ({
    chapterId: ch.id,
    chapterName: ch.name_simple,
    chapterNameArabic: ch.name_arabic,
    audioUrl: '', // resolved on demand
    reciterName,
  }));
}
