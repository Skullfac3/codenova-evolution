import { useEffect, useRef } from 'react';
import { SPRITE_SIZE, spriteCanvas, type SpriteKey } from '../game/sprites';

/** Un sprite del juego dibujado como ícono nítido (sin suavizado). */
export function SpriteIcon({ sprite, size = 48, overrides }: { sprite: SpriteKey; size?: number; overrides?: Record<string, string> }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const ctx = ref.current!.getContext('2d')!;
    ctx.clearRect(0, 0, SPRITE_SIZE, SPRITE_SIZE);
    ctx.drawImage(spriteCanvas(sprite, overrides), 0, 0);
  }, [sprite, overrides]);
  return <canvas ref={ref} width={SPRITE_SIZE} height={SPRITE_SIZE} className="sprite-icon" style={{ width: size, height: size }} aria-hidden />;
}
