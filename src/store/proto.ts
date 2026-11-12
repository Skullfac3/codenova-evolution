import { create } from 'zustand';
import type { ProtoMood } from '../game/proto';

interface ProtoStore {
  mood: ProtoMood;
  message: string | null;
  /** Id que cambia con cada mensaje, para reiniciar el temporizador. */
  messageId: number;
  say: (message: string | null, mood?: ProtoMood, ms?: number) => void;
  /** Era elegida en el refugio; null = la más alta desbloqueada. Proto-0 toma el aspecto de esa era. */
  viewEra: number | null;
  setViewEra: (era: number | null) => void;
}

let timer: ReturnType<typeof setTimeout> | undefined;

/** Estado de ánimo y globo de diálogo de Proto-0, compartido por toda la app. */
export const useProto = create<ProtoStore>((set, get) => ({
  mood: 'idle',
  message: null,
  messageId: 0,
  viewEra: null,
  setViewEra: (viewEra) => set({ viewEra }),
  say: (message, mood = 'talking', ms = 4000) => {
    clearTimeout(timer);
    set({ message, mood, messageId: get().messageId + 1 });
    timer = setTimeout(() => set({ message: null, mood: 'idle' }), ms);
  },
}));

export const protoSay = (message: string | null, mood?: ProtoMood, ms?: number) =>
  useProto.getState().say(message, mood, ms);

/**
 * Consejos que Proto-0 da al tocarlo, según la era.
 * Era 1 HTML, Era 2 CSS, Era 3 JavaScript (las eras 4 y 5 aún no
 * tienen contenido, así que sus consejos son los de JavaScript).
 */
export const TIPS: Record<number, string[]> = {
  1: [
    'Las etiquetas se abren y se cierran: <p>texto</p>.',
    'Todo lo visible de una página vive dentro de <body>.',
    '<h1> es el título principal; solo debe haber uno por página.',
    'Los enlaces usan <a href="..."> y las imágenes <img src="...">.',
    'Las listas se hacen con <ul> y <li>.',
    'La estructura es el esqueleto: primero el orden, luego el estilo.',
  ],
  2: [
    'Un selector dice a qué elemento se aplica el estilo.',
    'color cambia el texto; background cambia el fondo.',
    'Las clases (con punto: .titulo) reutilizan el mismo estilo.',
    'margin separa por fuera; padding separa por dentro.',
    'Con flexbox es más fácil centrar y alinear elementos.',
    'Puedes llevar una mascota de la Prehistoria a esta era.',
  ],
  3: [
    'Las instrucciones se ejecutan de arriba hacia abajo.',
    'El texto va entre comillas; los números no.',
    'Usa const por defecto y let solo si el valor cambia.',
    'typeof te dice el tipo de cualquier valor.',
    'Toca los atajos sobre el editor para no escribir todo.',
    'Con NovaCoins puedes comprar adornos en la tienda.',
    'Los índices de un arreglo empiezan en 0.',
    'Un while sin cambio dentro nunca termina. ¡Cuidado!',
    'return devuelve un valor y termina la función.',
    '&& pide que todo sea verdadero; || con uno basta.',
    'Escribe "for" en el editor y elige de la lista.',
  ],
};

export const tipFor = (era: number) => {
  const tips = TIPS[Math.min(era, 3)] ?? TIPS[1]!;
  return tips[Math.floor(Math.random() * tips.length)]!;
};
