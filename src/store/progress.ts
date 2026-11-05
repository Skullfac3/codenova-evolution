import { create } from 'zustand';
import { createEmptySave, loadSave, writeSave, type Save } from '../services/storage/save';
import { ERAS, findLesson, lessonsOfEra } from '../learning/lessons';
import type { Result } from '../game/economy';

/** Igual que public.level_for_xp() en Supabase. */
export const levelForXp = (xp: number) => Math.floor(Math.sqrt(Math.max(xp, 0) / 100)) + 1;

export interface CompletionOutcome {
  awarded: boolean;
  /** Era desbloqueada con esta lección, si hubo una. */
  eraUnlocked: number | null;
}

interface ProgressStore {
  save: Save;
  completeLesson: (lessonId: string, score: number, reward: { xp: number; coins: number }) => CompletionOutcome;
  isLessonUnlocked: (lessonId: string) => boolean;
  isEraComplete: (era: number) => boolean;
  resetProgress: () => void;
  /** Aplica una acción del refugio o la tienda (reglas en game/economy.ts) y guarda si funcionó. */
  act: (action: (save: Save) => Result) => Result;
}

const persist = (save: Save) => {
  writeSave(save);
  return save;
};

const eraDone = (save: Save, era: number) => {
  const lessons = lessonsOfEra(era);
  return lessons.length > 0 && lessons.every((l) => save.completedLessons[l.id]);
};

export const useProgress = create<ProgressStore>((set, get) => ({
  save: loadSave(),

  completeLesson: (lessonId, score, reward) => {
    const { save } = get();
    // Misma regla que complete_lesson(): una recompensa por lección.
    if (save.completedLessons[lessonId]) return { awarded: false, eraUnlocked: null };

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
    let eraUnlocked: number | null = null;
    const era = findLesson(lessonId)?.era;
    const nextEra = ERAS.find((e) => e.id === (era ?? 0) + 1);
    if (era && nextEra && eraDone(next, era) && !next.unlockedEras.includes(nextEra.id)) {
      eraUnlocked = nextEra.id;
      next = {
        ...next,
        unlockedEras: [...next.unlockedEras, nextEra.id],
        currentEra: nextEra.id,
        worlds: { ...next.worlds, [nextEra.id]: next.worlds[nextEra.id] ?? { objects: [] } },
      };
    }

    set({ save: persist(next) });
    return { awarded: true, eraUnlocked };
  },

  isLessonUnlocked: (lessonId) => {
    const lesson = findLesson(lessonId);
    if (!lesson) return false;
    const { save } = get();
    if (!save.unlockedEras.includes(lesson.era)) return false;
    const siblings = lessonsOfEra(lesson.era);
    const index = siblings.findIndex((l) => l.id === lessonId);
    return index === 0 || Boolean(save.completedLessons[siblings[index - 1]!.id]);
  },

  isEraComplete: (era) => eraDone(get().save, era),

  resetProgress: () => set({ save: persist(createEmptySave()) }),

  act: (action) => {
    const result = action(get().save);
    if (result.ok) set({ save: persist(result.save) });
    return result;
  },
}));
