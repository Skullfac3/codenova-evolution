import { create } from 'zustand';
import { createEmptySave, type Save } from '../services/storage/save';
import {
  loadProfiles,
  loadProfileSave,
  writeProfiles,
  writeProfileSave,
  createAdminSave,
  type Profile,
  type ProfilesState,
} from '../services/storage/profiles';
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
  profiles: Profile[];
  activeProfileId: string;
  activeProfile: () => Profile;
  switchProfile: (profileId: string) => void;
  completeLesson: (lessonId: string, score: number, reward: { xp: number; coins: number }) => CompletionOutcome;
  isLessonUnlocked: (lessonId: string) => boolean;
  isEraUnlocked: (era: number) => boolean;
  isEraComplete: (era: number) => boolean;
  resetProgress: () => void;
  /** Aplica una acción del refugio o la tienda (reglas en game/economy.ts) y guarda si funcionó. */
  act: (action: (save: Save) => Result) => Result;
}

const eraDone = (save: Save, era: number) => {
  const lessons = lessonsOfEra(era);
  return lessons.length > 0 && lessons.every((l) => save.completedLessons[l.id]);
};

/**
 * Una era está abierta si está en `unlockedEras`, o si todas las eras
 * anteriores están vacías o completas: las eras anunciadas sin
 * lecciones (hoy HTML en la Era 1 y CSS en la Era 2) no bloquean el
 * camino hacia la siguiente era con contenido. Sin esto, nadie nuevo
 * podría llegar nunca a JavaScript, que vive en la Era 3.
 */
const eraOpen = (save: Save, era: number): boolean => {
  if (save.admin) return true;
  if (save.unlockedEras.includes(era)) return true;
  return ERAS.filter((e) => e.id < era).every((e) => e.lessons.length === 0 || eraDone(save, e.id));
};

const initialProfiles: ProfilesState = loadProfiles();
const initialProfile = initialProfiles.profiles.find((p) => p.id === initialProfiles.activeId) ?? initialProfiles.profiles[0]!;

export const useProgress = create<ProgressStore>((set, get) => {
  const persist = (save: Save) => {
    writeProfileSave(get().activeProfileId, save);
    return save;
  };

  return {
    save: loadProfileSave(initialProfile),
    profiles: initialProfiles.profiles,
    activeProfileId: initialProfiles.activeId,

    activeProfile: () => get().profiles.find((p) => p.id === get().activeProfileId) ?? get().profiles[0]!,

    switchProfile: (profileId) => {
      const { activeProfileId, save, profiles } = get();
      if (profileId === activeProfileId) return;
      const next = profiles.find((p) => p.id === profileId);
      if (!next) return;
      writeProfileSave(activeProfileId, save);
      const nextSave = loadProfileSave(next);
      writeProfiles({ activeId: profileId, profiles });
      set({ save: nextSave, activeProfileId: profileId });
    },

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
      // El Administrador ve todas las lecciones, sin completar nada.
      if (save.admin) return true;
      if (!eraOpen(save, lesson.era)) return false;
      const siblings = lessonsOfEra(lesson.era);
      const index = siblings.findIndex((l) => l.id === lessonId);
      return index === 0 || Boolean(save.completedLessons[siblings[index - 1]!.id]);
    },

    isEraUnlocked: (era) => eraOpen(get().save, era),

    isEraComplete: (era) => eraDone(get().save, era),

    resetProgress: () => {
      const profile = get().activeProfile();
      const fresh = profile.kind === 'admin' ? createAdminSave() : createEmptySave();
      set({ save: persist({ ...fresh, explorerName: profile.kind === 'admin' ? 'Administrador' : profile.name }) });
    },

    act: (action) => {
      const result = action(get().save);
      if (result.ok) set({ save: persist(result.save) });
      return result;
    },
  };
});
