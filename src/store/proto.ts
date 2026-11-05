import { create } from 'zustand';
import type { ProtoMood } from '../game/proto';

interface ProtoStore {
  mood: ProtoMood;
  message: string | null;
  /** Id que cambia con cada mensaje, para reiniciar el temporizador. */
  messageId: number;
  say: (message: string | null, mood?: ProtoMood, ms?: number) => void;
}

let timer: ReturnType<typeof setTimeout> | undefined;

/** Estado de ánimo y globo de diálogo de Proto-0, compartido por toda la app. */
export const useProto = create<ProtoStore>((set, get) => ({
  mood: 'idle',
  message: null,
  messageId: 0,
  say: (message, mood = 'talking', ms = 4000) => {
    clearTimeout(timer);
    set({ message, mood, messageId: get().messageId + 1 });
    timer = setTimeout(() => set({ message: null, mood: 'idle' }), ms);
  },
}));

export const protoSay = (message: string | null, mood?: ProtoMood, ms?: number) =>
  useProto.getState().say(message, mood, ms);

/** Consejos que Proto-0 da al tocarlo, según la era. */
export const TIPS: Record<number, string[]> = {
  1: [
    'Las instrucciones se ejecutan de arriba hacia abajo.',
    'El texto va entre comillas; los números no.',
    'Usa const por defecto y let solo si el valor cambia.',
    'typeof te dice el tipo de cualquier valor.',
    'Toca los atajos sobre el editor para no escribir todo.',
    'Con NovaCoins puedes comprar adornos en la tienda.',
  ],
  2: [
    'Los índices de un arreglo empiezan en 0.',
    'Un while sin cambio dentro nunca termina. ¡Cuidado!',
    'return devuelve un valor y termina la función.',
    '&& pide que todo sea verdadero; || con uno basta.',
    'Puedes llevar una mascota de la Prehistoria a esta era.',
    'Escribe "for" en el editor y elige de la lista.',
  ],
};

export const tipFor = (era: number) => {
  const tips = TIPS[Math.min(era, 2)] ?? TIPS[1]!;
  return tips[Math.floor(Math.random() * tips.length)]!;
};
