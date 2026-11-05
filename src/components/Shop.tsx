import { useProgress } from '../store/progress';
import { protoSay } from '../store/proto';
import { ITEMS, type ItemKind } from '../game/items';
import { buyItem } from '../game/economy';
import { OUTFIT_COLORS } from '../game/sprites';
import { ERAS } from '../learning/lessons';
import { SpriteIcon } from './SpriteIcon';

const KIND_LABEL: Record<ItemKind, string> = { decoration: 'Adorno', outfit: 'Atuendo', pet: 'Mascota' };

export function Shop({ onGoToHabitat }: { onGoToHabitat: () => void }) {
  const save = useProgress((s) => s.save);
  const act = useProgress((s) => s.act);
  const eras = [...new Set(ITEMS.map((i) => i.era))];

  const owned = (id: string) => (id.startsWith('pet-') ? save.pets.filter((p) => p.itemId === id).length : save.inventory[id] ?? 0);

  return (
    <section className="shop" data-testid="shop">
      <div className="shop-head">
        <h1>🛒 Tienda</h1>
        <span className="wallet" data-testid="wallet">🪙 {save.novacoins} NovaCoins</span>
      </div>
      <p className="muted">Todo aquí es decorativo. Las NovaCoins se ganan aprendiendo; el conocimiento nunca se compra.</p>

      {eras.map((era) => {
        const info = ERAS.find((e) => e.id === era)!;
        const unlocked = save.unlockedEras.includes(era);
        return (
          <div key={era} className={`shop-era ${unlocked ? '' : 'locked'}`}>
            <h2>{info.icon} {info.name}{!unlocked && ' · 🔒'}</h2>
            <div className="shop-grid">
              {ITEMS.filter((i) => i.era === era).map((item) => {
                const n = owned(item.id);
                const isOwnedOutfit = item.kind === 'outfit' && n > 0;
                const missing = item.price - save.novacoins;
                return (
                  <article key={item.id} className="shop-item" data-testid={`shop-${item.id}`}>
                    <SpriteIcon sprite={item.sprite} overrides={item.kind === 'outfit' ? OUTFIT_COLORS[item.id] : undefined} size={56} />
                    <div className="shop-info">
                      <strong>{item.name}</strong>
                      <small className="muted">{KIND_LABEL[item.kind]}{n > 0 ? ` · tienes ${n}` : ''}</small>
                      <small>{item.description}</small>
                    </div>
                    <button
                      className="btn small primary"
                      disabled={!unlocked || isOwnedOutfit || missing > 0}
                      data-testid={`buy-${item.id}`}
                      onClick={() => {
                        const r = act((s) => buyItem(s, item.id));
                        if (r.ok) {
                          const where = item.kind === 'pet' ? 'Ya pasea por tu refugio.' : item.kind === 'outfit' ? 'Póntelo en tu refugio.' : 'Colócalo en modo Decorar.';
                          protoSay(`¡${item.name}! ${where}`, 'happy', 3500);
                        } else protoSay(r.reason, 'sad', 3000);
                      }}
                    >
                      {!unlocked ? `Era ${era}` : isOwnedOutfit ? 'Ya es tuyo' : missing > 0 ? `Faltan ${missing}` : `🪙 ${item.price}`}
                    </button>
                  </article>
                );
              })}
            </div>
          </div>
        );
      })}

      <button className="btn big" onClick={onGoToHabitat} data-testid="btn-back-habitat">🏡 Ir a mi refugio</button>
    </section>
  );
}
