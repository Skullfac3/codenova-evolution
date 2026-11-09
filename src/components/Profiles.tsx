import { useMemo } from 'react';
import { useProgress } from '../store/progress';
import { loadAllProfileSaves } from '../services/storage/profiles';
import { itemById } from '../game/items';
import { ERAS } from '../learning/lessons';

/**
 * Perfiles: cambiar entre Administrador y Pruebas (sin PIN).
 * El Administrador ve el historial de compras de todos los perfiles.
 */
export function Profiles() {
  const save = useProgress((s) => s.save);
  const profiles = useProgress((s) => s.profiles);
  const activeProfileId = useProgress((s) => s.activeProfileId);
  const switchProfile = useProgress((s) => s.switchProfile);
  const isAdmin = Boolean(save.admin);

  // Se relee al cambiar la partida activa: al volver del perfil de Pruebas,
  // el admin ve las compras que se hicieron allí.
  const allSaves = useMemo(() => loadAllProfileSaves(profiles), [profiles, save]);
  const purchases = allSaves
    .flatMap(({ profile, save: s }) =>
      (s.purchases ?? []).map((p) => ({ ...p, profileName: profile.name, profileKind: profile.kind })),
    )
    .sort((a, b) => (a.at < b.at ? 1 : -1));

  return (
    <section className="profiles" data-testid="profiles">
      <h1>👤 Perfiles</h1>
      <p className="muted">
        Cambia de perfil cuando quieras, sin contraseña. El perfil de Pruebas es una partida normal;
        el Administrador tiene todo desbloqueado y ve todas las compras.
      </p>

      <div className="profile-list">
        {profiles.map((profile) => {
          const profileSave = allSaves.find((s) => s.profile.id === profile.id)?.save;
          const done = profileSave ? Object.keys(profileSave.completedLessons).length : 0;
          const active = profile.id === activeProfileId;
          return (
            <article key={profile.id} className={`profile-card ${active ? 'on' : ''}`} data-testid={`profile-${profile.id}`}>
              <div className="profile-info">
                <strong>
                  {profile.kind === 'admin' ? '🛡️ ' : '🧪 '}
                  {profile.name}
                </strong>
                <small className="muted">
                  {profile.kind === 'admin'
                    ? 'Administrador · todas las eras y lecciones desbloqueadas'
                    : `Jugador · ${profileSave?.xp ?? 0} XP · 🪙 ${profileSave?.novacoins ?? 0} · ${done} lecciones`}
                </small>
              </div>
              <button
                className="btn small"
                disabled={active}
                data-testid={`btn-switch-${profile.id}`}
                onClick={() => switchProfile(profile.id)}
              >
                {active ? 'Activo' : 'Cambiar'}
              </button>
            </article>
          );
        })}
      </div>

      {isAdmin ? (
        <div className="panel" data-testid="admin-panel">
          <h2>🧾 Compras de todos los perfiles</h2>
          {purchases.length === 0 ? (
            <p className="muted" data-testid="purchases-empty">
              Aún no hay compras. Haz retos en el perfil de Pruebas, gana NovaCoins y compra en la tienda:
              cada compra aparece aquí.
            </p>
          ) : (
            <ul className="purchase-list">
              {purchases.map((p) => (
                <li key={p.id} data-testid={`purchase-${p.id}`}>
                  <strong>{itemById(p.itemId)?.name ?? p.itemId}</strong>
                  <span>
                    🪙 {p.price} · {p.profileName}
                  </span>
                  <small className="muted">
                    {new Date(p.at).toLocaleString('es-MX', { dateStyle: 'short', timeStyle: 'short' })}
                  </small>
                </li>
              ))}
            </ul>
          )}
          <h2>Progreso por perfil</h2>
          <ul className="purchase-list">
            {allSaves.map(({ profile, save: s }) => (
              <li key={profile.id}>
                <strong>{profile.name}</strong>
                <span>
                  {Object.keys(s.completedLessons).length} lecciones · {s.xp} XP · 🪙 {s.novacoins}
                </span>
                <small className="muted">
                  Eras: {s.unlockedEras.map((e) => ERAS.find((x) => x.id === e)?.name ?? e).join(', ')}
                </small>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="muted">
          El historial de compras solo se ve en el perfil <strong>Administrador</strong>. Cambia a ese
          perfil para ver qué se ha comprado en cada perfil.
        </p>
      )}
    </section>
  );
}
