import { create } from 'zustand';
import { createEmptySave, loadSave, writeSave, type Save } from '../services/storage/save';
import { era1Lessons } from '../learning/lessons/era1';

/** Igual que public.level_for_xp() en Supabase. */
export const levelForXp = (xp: number) => Math.floor(Math.sqrt(Math.max(xp, 0) / 100)) + 1;

export interface CompletionOutcome {
  awarded: boolean;
  eraUnlocked: boolean;
}

interface ProgressStore {
  save: Save;
  completeLesson: (lessonId: string, score: number, reward: { xp: number; coins: number }) => CompletionOutcome;
  isLessonUnlocked: (lessonId: string) => boolean;
  resetProgress: () => void;
}

const persist = (save: Save) => {
  writeSave(save);
  return save;
};

export const useProgress = create<ProgressStore>((set, get) => ({
  save: loadSave(),

  completeLesson: (lessonId, score, reward) => {
    const { save } = get();
    // Misma regla que complete_lesson(): una recompensa por lección.
    if (save.completedLessons[lessonId]) return { awarded: false, eraUnlocked: false };

    const eventId = crypto.randomUUID();
    let next: Save = {
      ...save,
      xp: save.xp + reward.xp,
      novacoins: save.novacoins + reward.coins,
      completedLessons: {
        ...save.completedLessons,
        [lessonId]: { score, completedAt: new Date().toISOString(), eventId },
      },
      pendingSync: [...save.pendingSync, { lessonId, score, eventId }],
    };

    // Misma regla que unlock_next_era(): todo lo publicado de la era debe estar completo.
    let eraUnlocked = false;
    const eraDone = era1Lessons.every((l) => next.completedLessons[l.id]);
    if (eraDone && !next.unlockedEras.includes(2)) {
      eraUnlocked = true;
      next = {
        ...next,
        unlockedEras: [...next.unlockedEras, 2],
        currentEra: 2,
        worlds: { ...next.worlds, 2: next.worlds[2] ?? { objects: [] } },
      };
    }

    set({ save: persist(next) });
    return { awarded: true, eraUnlocked };
  },

  isLessonUnlocked: (lessonId) => {
    const index = era1Lessons.findIndex((l) => l.id === lessonId);
    if (index <= 0) return index === 0;
    return Boolean(get().save.completedLessons[era1Lessons[index - 1]!.id]);
  },

  resetProgress: () => set({ save: persist(createEmptySave()) }),
}));
