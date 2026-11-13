"""Pixel art de CodeNova Evolution (original): sprites 32x32, terrenos y edificios.

Dibuja todo con formas y rampas de color y genera src/game/sprites.data.ts.
Ejecutar desde la raíz del proyecto:

    python3 scripts/make_sprites.py                 # regenera sprites.data.ts
    python3 scripts/make_sprites.py --preview a.png # además guarda una hoja de vista previa

La luz viene de arriba a la izquierda. Cada material tiene una rampa de 4 a 6 tonos.
"""
import math, sys
import random
N = 32
R = {  # rampas: oscuro -> claro
 'k':   ['#1a1020'],
 'skin':['#8a4f3a','#c98a5e','#f0c08a','#ffe2bd'],
 'hair':['#1e1418','#3a2a22','#5c4030','#8a6444'],
 'tun': ['#1b3560','#2c5287','#3d6fb5','#6a9be0'],
 'lea': ['#4a2e1c','#7a5033','#a8733f','#d6a066'],
 'wood':['#3d2416','#6b4226','#8a5a34','#b07a48','#d9a56a'],
 'sto': ['#3e3948','#6e6878','#9a93a3','#c4bfcc','#ebe8f0'],
 'fire':['#a82a2a','#e0533d','#ff8a3d','#ffd166','#fff3b0','#ffffff'],
 'cat': ['#120b18','#2b2433','#453a52','#6a5c7a'],
 'gold':['#8a6420','#e0b84a','#ffe58a'],
 'pink':['#b85a70','#e88aa0'],
 'gra': ['#2f5a34','#3f6b3a','#5a8f4e','#7bb062','#a6d67a'],
 'wh':  ['#ffffff'],
 'red': ['#7a1f2a','#c0392b','#e8614a'],
 'eye': ['#3e70b6'],
 'moss':['#2f6b33','#4f9a45','#7cc45e','#b6ea8c'],
 'leaf':['#1f4a26','#2f6b33','#4f9a45','#7cc45e','#b6ea8c'],
 'clay':['#6e3520','#9a4f2c','#c06a3e','#e08f5a','#f5b98a'],
 'wat': ['#1f5f8f','#2f7fb8','#4aa3d8','#9fd8f0','#e6f7ff'],
 'dodo':['#3e3948','#6e6878','#9a93a3','#c4bfcc','#ebe8f0'],
 'beak':['#8a6420','#e0b84a','#ffd166','#fff3b0'],
 'liz': ['#2f5a1e','#4f7f2a','#73a838','#9fd04f','#d3f08a'],
 'owl': ['#3d2a1c','#6b4a30','#8b6a4a','#b08e68','#d8bf98'],
 'cream':['#b8a078','#e6d6b0','#fff4d6'],
 'dirt':['#5c3a24','#7a5033','#9c6b43','#b88456','#d4a474'],
 'straw':['#6e5420','#a8822f','#c9a24a','#e2bf5e','#f5dd8a'],
 'dark':['#120b18','#2a1a12','#2f2838'],
}
# La túnica usa letras fijas: el atuendo equipado las recolorea (ver OUTFIT_COLORS).
PINNED = {('tun', 0): 'V', ('tun', 1): 'U', ('tun', 2): 'T', ('tun', 3): 't', ('k', 0): 'k'}
class Spr:
    def __init__(s, n=N): s.g = {}; s.n = n
    def put(s, x, y, m, t):
        if 0 <= x < s.n and 0 <= y < s.n: s.g[(x, y)] = (m, t)
    def rect(s, x0, y0, x1, y1, m, t):
        for y in range(y0, y1+1):
            for x in range(x0, x1+1): s.put(x, y, m, t)
    def rows(s, y0, spans, m, t):
        """spans: lista de (x0,x1) por fila desde y0."""
        for i, sp in enumerate(spans):
            if sp is None: continue
            s.rect(sp[0], y0+i, sp[1], y0+i, m, t)
    def pts(s, m, t, *p):
        for x, y in p: s.put(x, y, m, t)
    def erase(s, *p):
        for q in p: s.g.pop(q, None)
    def bevel(s, m, hi, lo, depth=1):
        """Sombreado con luz arriba-izquierda sobre el material m."""
        cells = {p for p, v in s.g.items() if v[0] == m}
        base = {p: s.g[p][1] for p in cells}
        for (x, y) in cells:
            if any((x+d, y) not in s.g or (x, y+d) not in s.g for d in range(1, depth+1)):
                s.g[(x, y)] = (m, lo if base[(x, y)] > lo else base[(x, y)])
            elif (x-1, y) not in cells and (x-1, y) not in s.g or (x, y-1) not in s.g:
                s.g[(x, y)] = (m, hi)
    def outline(s, soft=()):
        """Contorno: oscuro general; materiales 'soft' usan su tono más oscuro."""
        new = {}
        for (x, y), (m, t) in list(s.g.items()):
            for dx, dy in ((1,0),(-1,0),(0,1),(0,-1)):
                q = (x+dx, y+dy)
                if q not in s.g and 0 <= q[0] < s.n and 0 <= q[1] < s.n:
                    if m in soft: new.setdefault(q, (m, 0))
                    else: new[q] = ('k', 0)
        s.g.update(new)
    def ell(s, cx, cy, rx, ry, m, t):
        for y in range(int(cy-ry)-1, int(cy+ry)+2):
            for x in range(int(cx-rx)-1, int(cx+rx)+2):
                if ((x-cx)/rx)**2 + ((y-cy)/ry)**2 <= 1.0: s.put(x, y, m, t)
    def cells(s, m): return {p for p, v in s.g.items() if v[0] == m}
    def round_shade(s, cells, m, cuts=(-.7, -.3, .25, .65), dither=True):
        """Volumen redondeado: del tono más claro (arriba-izquierda) al más oscuro."""
        if not cells: return
        xs = [p[0] for p in cells]; ys = [p[1] for p in cells]
        cx, cy = (min(xs)+max(xs))/2, (min(ys)+max(ys))/2
        rx, ry = max(1, (max(xs)-min(xs))/2), max(1, (max(ys)-min(ys))/2)
        top = len(cuts)
        for (x, y) in cells:
            v = (x-cx)/rx*.55 + (y-cy)/ry*.75
            t = top
            for c in cuts:
                if v < c: break
                if dither and v - c < .07 and (x + y) % 2: break
                t -= 1
            s.put(x, y, m, max(0, min(t, len(R[m])-1)))
    def line(s, x0, y0, x1, y1, m, t):
        n = max(abs(x1-x0), abs(y1-y0), 1)
        for i in range(n+1): s.put(round(x0+(x1-x0)*i/n), round(y0+(y1-y0)*i/n), m, t)
    def color(s, p):
        m, t = s.g[p]; return R[m][t]

# ───────── Explorador ─────────
def explorador(frame=0):
    s = Spr()
    # piernas y botas
    lx, rx = (11, 17) if frame == 0 else (10, 18)
    for x0 in (lx, rx):
        s.rect(x0, 25, x0+3, 27, 'skin', 2)
        s.rect(x0+3, 25, x0+3, 27, 'skin', 1)
        s.rect(x0, 28, x0+3, 30, 'lea', 2)
        s.rect(x0, 28, x0+3, 28, 'lea', 3)
        s.rect(x0+3, 29, x0+3, 30, 'lea', 1)
        s.rect(x0, 30, x0+3, 30, 'lea', 0)
    # túnica
    s.rows(16, [(11,20),(10,21),(10,21),(10,21),(10,21),(10,21),(10,21),(10,21),(10,22),(9,22)], 'tun', 2)
    # brazos
    ay = 0 if frame == 0 else 1
    for side, x0 in ((0, 7), (1, 22)):
        yy = 17 + (ay if side else -ay)
        s.rect(x0, yy, x0+2, yy+3, 'tun', 2)        # manga
        s.rect(x0, yy+4, x0+2, yy+7, 'skin', 2)     # brazo y mano
        s.rect(x0+2, yy+4, x0+2, yy+7, 'skin', 1)
        s.put(x0, yy+4, 'skin', 3); s.put(x0, yy+5, 'skin', 3)
        s.rect(x0, yy+3, x0+2, yy+3, 'tun', 1)
        s.put(x0, yy, 'tun', 3); s.put(x0+1, yy, 'tun', 3)
        if side: s.rect(x0+2, yy+1, x0+2, yy+3, 'tun', 0)
        s.erase((x0 if not side else x0+2, yy), (x0 if not side else x0+2, yy+7))
        s.put(x0+1, yy+7, 'skin', 1)
    # sombras y luces de la túnica
    s.rect(19, 17, 21, 25, 'tun', 1); s.rect(21, 18, 21, 25, 'tun', 0)
    s.rect(11, 17, 12, 20, 'tun', 3)
    s.rows(16, [(13,18),(14,17),(15,16)], 'skin', 1)          # cuello en V
    s.pts('skin', 2, (14,16),(15,16),(15,17))
    s.rect(10, 22, 21, 23, 'lea', 2); s.rect(10, 23, 21, 23, 'lea', 1)   # cinturón
    s.rect(15, 22, 16, 23, 'gold', 1); s.put(15, 22, 'gold', 2)
    s.pts('tun', 1, (13,24),(13,25),(17,24),(17,25),(15,25))            # pliegues
    s.pts('tun', 0, (22,24),(22,25),(20,25))
    # cabeza
    s.rows(3, [(12,19),(10,21),(9,22),(9,22),(8,23),(8,23),(8,23),(8,23),(8,23),(8,23),(9,22),(9,22),(10,21),(12,19)], 'skin', 2)
    s.rect(21, 9, 23, 13, 'skin', 1); s.rect(20, 14, 22, 14, 'skin', 1); s.rect(17, 16, 19, 16, 'skin', 1); s.rect(19,15,21,15,'skin',1)
    s.pts('skin', 3, (10,10),(10,11),(11,10))
    s.pts('pink', 1, (10,13),(11,13),(20,13),(21,13))                   # mejillas
    # ojos
    for ex in (12, 18):
        s.rect(ex, 10, ex+1, 12, 'hair', 0)
        s.put(ex, 10, 'wh', 0); s.put(ex+1, 12, 'eye', 0)
    s.pts('hair', 1, (11,9),(12,9),(13,9),(18,9),(19,9),(20,9))         # cejas
    s.pts('skin', 0, (15,14),(16,14))                                   # boca
    s.put(16, 12, 'skin', 1)                                            # nariz
    # cabello
    s.rows(1, [(13,18),(10,21),(9,22),(8,23),(8,23),(7,24),(7,24),(7,24)], 'hair', 2)
    s.rows(9, [(7,9),(7,8),(7,8),(7,7)], 'hair', 2)
    s.rows(9, [(22,24),(23,24),(23,24),(24,24)], 'hair', 1)
    s.pts('hair', 2, (11,9),(14,9),(15,9),(16,9),(17,9),(21,9),(15,10))  # flequillo
    s.pts('hair', 2, (12,0),(13,0),(17,0),(20,1),(9,2))                  # mechones
    s.pts('hair', 3, (11,3),(12,3),(13,2),(14,2),(10,4),(10,5),(15,4),(16,4),(17,3),(9,6))
    s.rect(20, 3, 23, 8, 'hair', 1); s.rect(22, 5, 24, 8, 'hair', 0)
    s.pts('hair', 1, (12,8),(16,8),(19,8),(9,8))
    # cinta
    s.rect(8, 6, 23, 7, 'red', 1); s.rect(8, 6, 19, 6, 'red', 2); s.rect(21, 6, 23, 7, 'red', 0)
    s.pts('red', 1, (24,8),(25,9),(25,10)); s.put(26, 10, 'red', 0)
    s.outline()
    return s

# ───────── Fogata ─────────
def fogata(frame=0):
    s = Spr()
    # piedras
    stones = [(3,24,8,29),(8,26,13,30),(14,27,19,30),(19,26,24,30),(24,24,28,29),(6,22,10,25),(21,22,26,25)]
    for i,(x0,y0,x1,y1) in enumerate(stones):
        s.rect(x0, y0, x1, y1, 'sto', 2)
        s.erase((x0,y0),(x1,y0),(x0,y1),(x1,y1))
        s.rect(x0+1, y0, x1-1, y0, 'sto', 3); s.put(x0+1, y0+1, 'sto', 4)
        s.rect(x0+1, y1, x1-1, y1, 'sto', 1); s.rect(x1, y0+1, x1, y1-1, 'sto', 1)
    # leños cruzados
    for i in range(14):
        x, y = 8+i, 25 - i//3
        s.rect(x, y, x, y+2, 'wood', 2); s.put(x, y, 'wood', 3); s.put(x, y+2, 'wood', 1)
        x2 = 23-i
        s.rect(x2, y, x2, y+2, 'wood', 2); s.put(x2, y, 'wood', 4); s.put(x2, y+2, 'wood', 0)
    s.rect(7, 25, 8, 27, 'wood', 4); s.rect(23, 25, 24, 27, 'wood', 3)
    s.pts('wood', 1, (7,26),(24,26))
    # llama por capas
    if frame == 0:
        L = [
         (0, 6, [(15,15),(15,16),(14,16),(14,17),(13,17),(12,18),(12,19),(11,19),(10,20),(10,20),(9,21),(9,21),(9,22),(9,22),(9,22),(10,21),(10,21),(11,20),(12,19)]),
         (1, 9, [(15,15),(14,16),(14,17),(13,18),(12,18),(12,19),(11,19),(11,20),(10,20),(10,20),(10,21),(10,21),(11,20),(11,20),(12,19),(13,18)]),
         (2, 12,[(15,15),(14,16),(14,16),(13,17),(13,18),(12,18),(12,19),(12,19),(12,19),(12,19),(12,19),(13,18),(13,18)]),
         (3, 15,[(15,15),(15,16),(14,16),(14,17),(13,17),(13,18),(13,18),(14,17),(14,17),(14,17)]),
         (4, 19,[(15,16),(15,16),(15,16),(15,16),(15,15)]),
        ]
        tongues = [(1,(19,9),(19,10),(20,10),(20,11),(19,11),(21,12),(21,13)), (0,(20,8),(21,11),(22,13),(22,14)),
                   (1,(10,14),(10,15),(9,16),(9,17),(10,16)), (0,(8,17),(8,18),(9,15))]
        sparks = [(3,(22,5)),(2,(9,9)),(3,(18,3))]
    else:
        L = [
         (0, 5, [(17,17),(16,17),(16,18),(15,18),(15,19),(14,19),(13,19),(13,20),(12,20),(11,20),(11,21),(10,21),(10,22),(9,22),(9,22),(9,22),(10,22),(10,21),(11,20),(12,19)]),
         (1, 8, [(17,17),(16,17),(15,18),(15,18),(14,19),(13,19),(13,20),(12,20),(11,20),(11,21),(11,21),(10,21),(11,21),(11,20),(12,20),(13,19),(13,18)]),
         (2, 11,[(16,16),(16,17),(15,17),(15,18),(14,18),(13,18),(13,19),(13,19),(12,19),(12,19),(12,19),(13,19),(13,18),(14,18)]),
         (3, 14,[(16,16),(15,16),(15,17),(14,17),(14,17),(14,18),(13,18),(13,18),(14,17),(14,17),(14,17)]),
         (4, 18,[(16,16),(15,16),(15,16),(15,16),(15,16),(15,15)]),
        ]
        tongues = [(1,(11,10),(11,11),(10,12),(10,13),(11,12),(9,14),(9,15)), (0,(10,9),(9,12),(8,15),(8,16)),
                   (1,(21,14),(21,15),(22,16),(22,17),(21,16)), (0,(23,17),(23,18),(22,15))]
        sparks = [(3,(8,6)),(2,(22,8)),(3,(13,2))]
    for t, y0, spans in L: s.rows(y0, spans, 'fire', t)
    for t, *p in tongues: s.pts('fire', t, *p)
    for t, p in sparks: s.put(p[0], p[1], 'fire', t)
    s.put(15, 23, 'fire', 5); s.put(16, 22, 'fire', 5)
    # brasas sobre los leños
    s.pts('fire', 2, (12,24),(19,24),(14,25),(17,25)); s.pts('fire', 3, (13,24),(18,24))
    # contorno solo para piedra y madera
    fire = {p for p, v in s.g.items() if v[0] == 'fire'}
    new = {}
    for (x, y), (m, t) in list(s.g.items()):
        if m == 'fire': continue
        for dx, dy in ((1,0),(-1,0),(0,1),(0,-1)):
            q = (x+dx, y+dy)
            if q not in s.g and 0 <= q[0] < N and 0 <= q[1] < N: new[q] = ('k', 0)
    s.g.update(new)
    return s

# ───────── Gato ─────────
def gato():
    s = Spr()
    # cola
    s.rows(17, [(24,26),(25,27),(26,28),(26,28),(26,28),(25,28),(24,27),(22,27),(21,26),(20,25),(20,24)], 'cat', 1)
    s.pts('cat', 2, (24,17),(25,18),(26,19),(26,20)); s.pts('cat', 0, (28,20),(28,21),(27,23),(26,25),(25,26))
    s.pts('cat', 3, (24,17),(25,17))
    # cuerpo sentado
    s.rows(17, [(11,20),(10,21),(9,22),(9,22),(8,23),(8,23),(8,23),(8,23),(8,23),(8,23),(8,23),(8,23),(9,23)], 'cat', 1)
    s.rect(21, 19, 23, 28, 'cat', 0); s.rect(20, 25, 22, 29, 'cat', 0)
    s.rows(19, [(13,17),(12,18),(12,18),(12,18),(13,17),(13,17)], 'cat', 2)     # pecho
    s.pts('cat', 3, (14,20),(15,20),(16,20),(14,21),(15,21),(15,22))
    # patas delanteras
    for x0 in (11, 16):
        s.rect(x0, 23, x0+3, 29, 'cat', 2); s.rect(x0+3, 23, x0+3, 29, 'cat', 1)
        s.rect(x0, 29, x0+3, 30, 'cat', 3); s.put(x0+3, 30, 'cat', 2)
        s.pts('cat', 1, (x0+1, 30))
    s.rect(15, 24, 15, 30, 'cat', 0)
    s.rect(8, 28, 10, 30, 'cat', 1); s.rect(8, 30, 10, 30, 'cat', 0); s.rect(20, 28, 23, 30, 'cat', 1); s.rect(20,30,23,30,'cat',0)
    # cabeza
    s.rows(6, [(9,22),(8,23),(7,24),(7,24),(7,24),(7,24),(7,24),(7,24),(8,23),(9,22),(11,20)], 'cat', 1)
    s.rect(22, 8, 24, 13, 'cat', 0); s.rect(20, 14, 23, 14, 'cat', 0); s.rect(18, 15, 22, 15, 'cat', 0)
    s.rows(6, [(10,15),(9,13),(8,10),(8,9)], 'cat', 2)
    # orejas
    s.rows(1, [(8,8),(8,9),(8,10),(8,11),(8,12)], 'cat', 1)
    s.rows(1, [(23,23),(22,23),(21,23),(20,23),(19,23)], 'cat', 1)
    s.pts('pink', 0, (9,4),(9,5),(10,5),(22,4),(22,5),(21,5)); s.pts('pink', 1, (9,3),(22,3))
    s.pts('cat', 2, (8,2),(8,3),(8,4)); s.pts('cat', 0, (23,2),(23,3),(23,4),(23,5))
    # ojos
    for ex in (10, 18):
        s.rect(ex, 9, ex+3, 12, 'gold', 1); s.rect(ex, 9, ex+3, 9, 'gold', 2)
        s.rect(ex+1, 9, ex+2, 12, 'cat', 0); s.put(ex+1, 9, 'wh', 0)
        s.erase(); s.put(ex, 12, 'gold', 0); s.put(ex+3, 12, 'gold', 0)
    s.pts('pink', 1, (15,13),(16,13)); s.put(16, 14, 'pink', 0); s.put(15,14,'pink',0)       # nariz
    s.pts('cat', 0, (14,15),(15,15),(16,15),(17,15))                                           # boca
    s.pts('cat', 3, (5,12),(6,12),(5,14),(6,14),(25,12),(26,12),(25,14),(26,14))               # bigotes
    # collar
    s.rect(11, 17, 20, 18, 'red', 1); s.rect(11, 17, 17, 17, 'red', 2); s.rect(19, 18, 20, 18, 'red', 0)
    s.rect(15, 18, 16, 19, 'gold', 1); s.put(15, 18, 'gold', 2)
    wh = {(5,12),(6,12),(5,14),(6,14),(25,12),(26,12),(25,14),(26,14)}
    keep = {p: s.g.pop(p) for p in wh}
    s.outline(); s.g.update(keep)
    return s

# ───────── Pasto ─────────
def pasto(seed=7):
    rnd = random.Random(seed)
    s = Spr(); s.rect(0, 0, 31, 31, 'gra', 2)
    w = lambda v: v % N
    for _ in range(7):   # manchas claras
        x, y = rnd.randrange(N), rnd.randrange(N)
        for dx, dy in ((0,0),(1,0),(2,0),(1,-1),(3,0),(2,1),(0,1),(1,1)):
            if rnd.random() < .8: s.put(w(x+dx), w(y+dy), 'gra', 3)
    for _ in range(7):   # manchas oscuras
        x, y = rnd.randrange(N), rnd.randrange(N)
        for dx, dy in ((0,0),(1,0),(2,0),(1,1),(0,1)):
            if rnd.random() < .8: s.put(w(x+dx), w(y+dy), 'gra', 1)
    for _ in range(5):  # matas de hojas
        x, y = rnd.randrange(N), rnd.randrange(N)
        for dx, dy, t in ((0,0,4),(0,1,3),(-1,1,3),(2,0,4),(2,1,3),(1,2,1),(0,2,1),(2,2,1),(1,1,1),(-1,2,0),(3,2,0)):
            s.put(w(x+dx), w(y+dy), 'gra', t)
    for _ in range(1 if seed % 3 == 0 else 0):   # florecitas
        x, y = rnd.randrange(2, 29), rnd.randrange(2, 29)
        s.put(x, y, 'fire', 3); s.put(x, y+1, 'gra', 0); s.put(x-1, y, 'wh', 0); s.put(x+1, y, 'wh', 0); s.put(x, y-1, 'wh', 0)
    return s

# ───────── Roca con musgo ─────────
def roca():
    s = Spr()
    s.rows(10, [(12,19),(9,22),(7,24),(6,25),(5,26),(4,27),(4,27),(3,28),(3,28),(3,28),(2,29),(2,29),(2,29),(2,29),(2,29),(3,29),(3,28),(4,28),(5,27),(7,25)], 'sto', 2)
    s.round_shade(s.cells('sto'), 'sto')
    # facetas y grietas
    s.line(17, 16, 20, 21, 'sto', 1); s.line(20, 21, 19, 25, 'sto', 1); s.line(18, 17, 21, 22, 'sto', 3)
    s.line(8, 22, 11, 26, 'sto', 1); s.pts('sto', 0, (20,22),(19,26),(11,27))
    s.pts('sto', 4, (6,17),(7,16),(7,17),(12,19),(13,19))
    # musgo
    edge = [14,15,16,16,17,16,15,16,17,18,17,16,15,15,16,15,14,14,13,13,12,12,11,11]
    for i, yb in enumerate(edge):
        x = 4 + i
        for y in range(9, yb+1):
            if (x, y) in s.g: s.put(x, y, 'moss', 2)
    mo = s.cells('moss')
    for (x, y) in mo:
        if (x, y+1) not in mo: s.put(x, y, 'moss', 0)
        elif (x, y+2) not in mo: s.put(x, y, 'moss', 1)
        elif (x, y-1) not in mo or (x-1, y) not in mo: s.put(x, y, 'moss', 3)
    s.pts('moss', 3, (10,13),(11,13),(14,12),(15,14),(8,15),(18,12))
    s.pts('moss', 1, (12,14),(16,13),(9,14),(20,13))
    s.pts('moss', 1, (7,18),(7,19),(13,19),(13,20),(13,21),(19,17),(19,18)); s.pts('moss', 0, (7,20),(13,22),(19,19))
    s.outline()
    return s

# ───────── Helecho ─────────
def helecho():
    """Cinco frondas en abanico: tallo fino y foliolos en diagonal, separados entre sí."""
    s = Spr()
    bx, by = 15.5, 29
    fronds = [  # (punta, control, largo máximo del foliolo, tono extra) de atrás hacia adelante
        ((15.5, 1), (15.5, 14), 3, 0),
        ((4, 5), (11, 8), 3, 0), ((27, 5), (20, 8), 3, -1),
        ((0, 20), (3, 8), 3, 0), ((31, 20), (28, 8), 3, -1),
    ]
    stems = []
    for (tx, ty), (cx, cy), lmax, dt in fronds:
        fine, arc, nxt, pts = [], 0.0, 0.0, []
        for i in range(401):
            u = i/400
            x = (1-u)**2*bx + 2*(1-u)*u*cx + u*u*tx; y = (1-u)**2*by + 2*(1-u)*u*cy + u*u*ty
            if fine: arc += math.hypot(x - fine[-1][0], y - fine[-1][1])
            fine.append((x, y))
            if arc >= nxt: pts.append((x, y, i)); nxt += 1.0
        L = len(pts)
        for j, (x, y, i) in enumerate(pts):
            if j < 5: continue
            x2, y2 = fine[min(i+6, 400)]; x1, y1 = fine[max(i-6, 0)]
            d = math.hypot(x2-x1, y2-y1) or 1; tx_, ty_ = (x2-x1)/d, (y2-y1)/d
            f = j / L
            ln = lmax if f < .6 else 2 if f < .85 else 1
            if j % 2 == 0:
                for sg in (1, -1):
                    nx, ny = -ty_*sg, tx_*sg
                    lit = (nx + ny) < 0
                    for k in range(1, ln+1):
                        px_, py_ = round(x + (nx*.85 + tx_*.5)*k), round(y + (ny*.85 + ty_*.5)*k)
                        t = (3 if lit else 2) + dt + (1 if k == ln and lit else 0)
                        if (px_, py_) not in s.g or s.g[(px_, py_)][1] < t: s.put(px_, py_, 'leaf', max(1, min(4, t)))
        stems.append([(round(x), round(y)) for (x, y, i) in pts])
    for st in stems:
        for j, (x, y) in enumerate(st): s.put(x, y, 'leaf', 0 if j < len(st) - 3 else 2)
    # sombra de cada foliolo, para separarlo del suelo
    for (x, y) in list(s.g):
        if (x, y+1) not in s.g and y < 30: s.g[(x, y+1)] = ('leaf', 0)
    # brote central
    s.rect(14, 26, 17, 30, 'leaf', 1); s.pts('leaf', 0, (17,27),(17,28),(17,29),(17,30),(13,30),(18,30),(14,26),(17,26)); s.pts('leaf', 3, (15,27),(15,28)); s.pts('leaf', 2, (14,27),(14,28),(16,27))
    return s

# ───────── Columna ─────────
def columna():
    s = Spr()
    s.rect(6, 1, 25, 2, 'sto', 3); s.rect(8, 3, 23, 4, 'sto', 2); s.rect(10, 5, 21, 5, 'sto', 1)
    flute = [4, 3, 4, 2, 3, 2, 3, 1, 2, 1, 1, 0]
    for i, t in enumerate(flute): s.rect(10+i, 6, 10+i, 25, 'sto', t)
    s.rect(8, 26, 23, 27, 'sto', 2); s.rect(6, 28, 25, 30, 'sto', 3)
    # luces y sombras de capitel y base
    s.rect(6, 1, 22, 1, 'sto', 4); s.rect(23, 1, 25, 2, 'sto', 2); s.rect(6, 2, 25, 2, 'sto', 2); s.rect(6, 2, 9, 2, 'sto', 3)
    s.rect(8, 3, 12, 3, 'sto', 4); s.rect(19, 3, 23, 4, 'sto', 1); s.rect(8, 4, 18, 4, 'sto', 2)
    s.rect(10, 6, 21, 6, 'sto', 0); s.rect(10, 6, 13, 6, 'sto', 1)
    s.rect(8, 26, 12, 26, 'sto', 4); s.rect(19, 26, 23, 27, 'sto', 1)
    s.rect(6, 28, 20, 28, 'sto', 4); s.rect(21, 28, 25, 30, 'sto', 2); s.rect(6, 30, 25, 30, 'sto', 1); s.rect(6, 29, 7, 29, 'sto', 4)
    # grietas y desgaste
    s.line(18, 10, 16, 13, 'sto', 0); s.line(16, 13, 17, 16, 'sto', 0); s.pts('sto', 0, (12,20),(13,21),(13,22),(20,23))
    s.pts('sto', 4, (11,12),(11,13),(11,18),(12,9))
    s.erase((6,1),(25,1),(25,30),(6,30))
    # un poco de hiedra
    s.pts('moss', 2, (10,23),(10,24),(11,25),(9,26),(10,26),(8,27),(9,28),(7,28)); s.pts('moss', 3, (10,22),(9,25),(8,26)); s.pts('moss', 0, (11,26),(10,27),(8,29))
    s.outline()
    return s

# ───────── Ánfora ─────────
def anfora():
    s = Spr()
    body = [(11,20),(11,20),(13,18),(13,18),(13,18),(13,18),(11,20),(9,22),(7,24),(6,25),(5,26),(5,26),(5,26),(5,26),(5,26),(5,26),(5,26),(5,26),(6,25),(7,24),(8,23),(10,21),(11,20),(12,19),(13,18),(12,19),(11,20),(11,20)]
    s.rows(3, body, 'clay', 2)
    s.round_shade(s.cells('clay'), 'clay', cuts=(-.6, -.2, .3, .7))
    s.rect(11, 3, 20, 3, 'clay', 4); s.rect(11, 4, 20, 4, 'clay', 1); s.rect(18, 3, 20, 3, 'clay', 3)
    s.rect(13, 5, 13, 8, 'clay', 4); s.rect(17, 5, 18, 8, 'clay', 1)
    # asas
    for sg, x0 in ((-1, 12), (1, 19)):
        pts = [(x0+sg*1, 5), (x0+sg*2, 5), (x0+sg*3, 6), (x0+sg*4, 7), (x0+sg*4, 8), (x0+sg*4, 9), (x0+sg*3, 10)]
        for (x, y) in pts: s.put(x, y, 'clay', 3 if sg < 0 else 1)
        s.put(x0+sg*3, 5, 'clay', 2 if sg < 0 else 0)
    # bandas doradas y greca
    def band(y, m, tones):
        for x in range(4, 28):
            if (x, y) in s.g and s.g[(x, y)][0] == 'clay':
                s.put(x, y, m, tones[0] if x < 11 else tones[1] if x < 21 else tones[2])
    band(12, 'gold', (2, 1, 0)); band(22, 'gold', (2, 1, 0)); band(13, 'dark', (1, 1, 0)); band(21, 'dark', (1, 1, 0))
    for x in range(6, 26):
        k = (x - 6) % 4
        for y in ((15, 16, 17, 18) if k == 0 else (15,) if k == 1 else (15, 17, 18) if k == 2 else (18,)):
            if (x, y) in s.g: s.put(x, y, 'dark', 1 if x < 21 else 0)
    s.pts('clay', 4, (8,14),(8,15),(9,14),(7,16)); s.pts('wh', 0, (8,13))
    s.rect(11, 30, 20, 30, 'clay', 0)
    s.outline()
    return s

# ───────── Fuente ─────────
def fuente():
    s = Spr()
    # pila grande
    s.ell(15.5, 18, 14, 5, 'sto', 3)
    s.rows(18, [(2,29),(2,29),(2,29),(2,29),(3,28),(3,28),(4,27),(5,26),(7,24)], 'sto', 2)
    wall = {p for p in s.cells('sto') if p[1] >= 20}
    s.round_shade(wall, 'sto', cuts=(-.75, -.35, .2, .6))
    for x in range(2, 30):
        if (x, 20) in s.g and x % 5 == 3:
            for y in range(21, 27):
                if (x, y) in s.g: s.put(x, y, 'sto', max(0, s.g[(x, y)][1]-1))
    s.rows(27, [(9,22),(7,24),(6,25),(6,25)], 'sto', 2)
    s.rect(6, 29, 25, 29, 'sto', 3); s.rect(20, 28, 25, 30, 'sto', 1); s.rect(6, 30, 25, 30, 'sto', 0); s.rect(7, 28, 12, 28, 'sto', 4)
    # borde de la pila y agua
    rim = {p for p in s.cells('sto') if p[1] < 20}
    for (x, y) in rim: s.put(x, y, 'sto', 4 if x < 12 and y < 17 else 3 if x < 22 else 2)
    s.ell(15.5, 17.5, 11.5, 3, 'wat', 2)
    for (x, y) in s.cells('wat'):
        if (x, y-1) not in s.cells('wat'): s.put(x, y, 'wat', 0)
        elif y >= 19: s.put(x, y, 'wat', 3)
        elif x > 21: s.put(x, y, 'wat', 1)
    # pilar central y plato superior
    s.rect(14, 8, 17, 17, 'sto', 3); s.rect(14, 8, 14, 17, 'sto', 4); s.rect(17, 8, 17, 17, 'sto', 1); s.rect(16, 8, 16, 17, 'sto', 2)
    s.rows(5, [(10,21),(10,21),(11,20),(13,18)], 'sto', 3)
    s.rect(10, 5, 17, 5, 'sto', 4); s.rect(18, 5, 21, 6, 'sto', 2); s.rect(11, 7, 20, 7, 'sto', 1); s.rect(13, 8, 18, 8, 'sto', 0)
    s.rect(11, 4, 20, 4, 'wat', 3); s.rect(12, 4, 15, 4, 'wat', 4)
    # chorro y caídas
    s.pts('wat', 4, (15,1),(16,2),(15,3),(16,3)); s.pts('wat', 3, (15,2),(16,1),(14,3),(17,3),(15,0))
    for x, tone in ((10, 3), (21, 2)):
        for y in range(5, 17): s.put(x - (1 if x == 10 and y > 7 else 0) + (1 if x == 21 and y > 7 else 0), y, 'wat', 4 if y % 3 == 0 else tone)
    s.pts('wat', 4, (7,16),(8,17),(10,17),(11,16),(20,16),(22,17),(23,16),(24,17),(13,18),(18,18),(15,19),(16,19))
    s.pts('wh', 0, (9,16),(22,16))
    w = {p: s.g.pop(p) for p in list(s.g) if s.g[p][0] in ('wat', 'wh') and p[1] < 15}
    s.outline(); s.g.update(w)
    return s

# ───────── Dodo ─────────
def dodo():
    s = Spr()
    # cola rizada
    s.pts('dodo', 4, (3,14),(4,13),(5,13),(3,16),(4,15),(5,15),(2,17)); s.pts('dodo', 3, (4,14),(5,14),(4,16),(5,16),(3,17),(4,17),(5,17),(6,14),(6,15))
    # cuerpo, cuello y cabeza
    s.ell(14, 20, 9.5, 7, 'dodo', 2); s.rows(11, [(16,22),(16,22),(15,22),(14,22),(13,22)], 'dodo', 2); s.ell(20.5, 8.5, 5, 5, 'dodo', 2)
    s.round_shade(s.cells('dodo') - {(3,14),(4,13),(5,13),(3,16),(4,15),(5,15),(2,17),(4,14),(5,14),(4,16),(5,16),(3,17),(4,17),(5,17),(6,14),(6,15)}, 'dodo', cuts=(-.75, -.3, .25, .7))
    # ala
    for y, (x0, x1) in enumerate([(9,16),(8,18),(7,19),(7,19),(8,19),(9,18),(11,17)], start=17):
        for x in range(x0, x1+1): s.put(x, y, 'dodo', 1 if x > x0+1 and y > 17 else 3)
    s.pts('dodo', 0, (18,19),(19,20),(18,21),(17,22),(15,23),(13,23)); s.pts('dodo', 4, (9,17),(10,17),(8,18),(8,19),(12,19),(13,20),(15,19))
    # pecho claro
    s.pts('dodo', 4, (20,15),(21,16),(21,17),(20,16),(22,18),(21,18))
    # pico grande con gancho
    s.rows(7, [(24,27),(24,29),(24,30),(24,30),(24,30),(25,30),(28,30)], 'beak', 2)
    s.rect(24, 7, 27, 7, 'beak', 3); s.rect(24, 8, 26, 8, 'beak', 3); s.rect(24, 10, 29, 10, 'beak', 0); s.rect(25, 11, 27, 12, 'beak', 1)
    s.pts('beak', 0, (29,12),(30,12),(30,13),(29,13)); s.pts('beak', 1, (30,9),(30,10),(30,11),(28,12)); s.put(26, 9, 'beak', 0)
    s.rect(23, 6, 23, 12, 'dodo', 4)
    # ojo
    s.rect(20, 7, 21, 8, 'dark', 0); s.put(20, 7, 'wh', 0); s.pts('dodo', 4, (19,6),(20,6),(21,6),(22,7))
    # patas
    for x0 in (11, 16):
        s.rect(x0, 27, x0+1, 29, 'beak', 1); s.put(x0, 27, 'beak', 0); s.put(x0+1, 27, 'beak', 0)
        s.rect(x0-1, 30, x0+3, 30, 'beak', 2); s.put(x0+3, 30, 'beak', 1); s.put(x0, 29, 'beak', 2)
    s.outline()
    return s

# ───────── Lagartija ─────────
def lagartija():
    s = Spr()
    # cola
    tail = [(9,22),(8,23),(7,24),(6,25),(5,26),(4,27),(3,27),(2,27),(1,26),(1,25),(2,24)]
    for i, (x, y) in enumerate(tail):
        s.put(x, y, 'liz', 2); 
        if i < 6: s.put(x, y-1, 'liz', 3); s.put(x+1, y, 'liz', 1)
    # patas traseras y delanteras (detrás del cuerpo)
    for x0 in (10, 21):
        s.rect(x0, 23, x0+2, 26, 'liz', 1); s.rect(x0-1, 27, x0+3, 27, 'liz', 2); s.pts('liz', 3, (x0-1,27),(x0+1,27),(x0+3,27)); s.put(x0, 23, 'liz', 2)
    # cuerpo y cabeza
    s.ell(15.5, 21, 8, 3.6, 'liz', 2); s.ell(26, 19.5, 4.5, 3.2, 'liz', 2); s.rect(21, 18, 24, 22, 'liz', 2)
    body = {p for p in s.cells('liz') if 17 <= p[1] <= 24 and p[0] >= 7 and p not in tail}
    s.round_shade(body, 'liz', cuts=(-.6, -.2, .3, .7))
    s.rows(22, [(8,22),(9,21)], 'liz', 1); s.rows(22, [(24,29)], 'liz', 1)
    s.pts('beak', 3, (20,22),(21,22),(22,22),(23,22),(24,22),(25,22),(26,22),(27,22)); s.pts('beak', 2, (12,24),(13,24),(14,24),(15,24),(16,24),(17,24),(18,24))
    # cresta solar
    for x in range(9, 23, 2): s.put(x, 17 if 12 < x < 20 else 18, 'beak', 2); s.put(x, 16 if 12 < x < 20 else 17, 'fire', 2)
    s.pts('beak', 3, (11,19),(14,19),(17,19),(20,19)); s.pts('liz', 4, (12,18),(15,18),(18,18),(24,17),(25,17))
    # ojo y boca
    s.rect(26, 18, 27, 19, 'dark', 0); s.put(26, 18, 'wh', 0); s.pts('liz', 4, (25,17),(26,17),(27,17),(28,18))
    s.pts('liz', 0, (27,21),(28,21),(29,21),(30,20)); s.put(30, 19, 'liz', 1)
    # patas del frente
    for x0 in (13, 23):
        s.rect(x0, 24, x0+2, 27, 'liz', 2); s.put(x0, 24, 'liz', 3); s.rect(x0+2, 24, x0+2, 27, 'liz', 1)
        s.rect(x0-1, 28, x0+4, 28, 'liz', 3); s.pts('liz', 4, (x0-1,28),(x0+1,28),(x0+3,28)); s.put(x0+4, 28, 'liz', 1)
    s.outline()
    return s

# ───────── Búho ─────────
def buho():
    s = Spr()
    s.ell(15.5, 18, 9.5, 11, 'owl', 2)
    s.rows(2, [(7,8),(7,9),(7,10),(7,11),(8,12)], 'owl', 2); s.rows(2, [(23,24),(22,24),(21,24),(20,24),(19,23)], 'owl', 2)
    s.round_shade(s.cells('owl'), 'owl', cuts=(-.7, -.3, .3, .7))
    s.pts('owl', 0, (24,3),(24,4),(24,5)); s.pts('owl', 4, (7,2),(7,3),(8,3))
    # alas
    for y in range(15, 27):
        w = 3 if y < 24 else 2
        for x in list(range(6, 6+w)) + list(range(26-w, 26)):
            if (x, y) in s.g: s.put(x, y, 'owl', 1 if x < 16 else 0)
    s.pts('owl', 2, (6,16),(6,18),(6,20),(7,22)); s.pts('owl', 0, (8,17),(8,19),(8,21),(8,23))
    # disco facial
    s.ell(11.5, 11.5, 4.6, 4.6, 'cream', 1); s.ell(19.5, 11.5, 4.6, 4.6, 'cream', 1)
    for (x, y) in s.cells('cream'):
        if x > 20 or y > 14: s.put(x, y, 'cream', 0)
        elif x < 10 and y < 10: s.put(x, y, 'cream', 2)
    # ojos
    for ex in (11.5, 19.5):
        s.ell(ex, 11.5, 2.6, 2.6, 'gold', 1)
        x0 = int(ex - .5)
        s.rect(x0, 11, x0+1, 12, 'dark', 0); s.put(x0, 10, 'gold', 2); s.put(x0+1, 10, 'gold', 2); s.put(x0-1, 10, 'wh', 0)
        s.put(x0+2, 13, 'gold', 0); s.put(x0+1, 13, 'gold', 0)
    # cejas y pico
    s.line(8, 7, 14, 9, 'owl', 0); s.line(23, 7, 17, 9, 'owl', 0); s.line(8, 6, 14, 8, 'owl', 1); s.line(23, 6, 17, 8, 'owl', 1)
    s.rows(13, [(15,16),(15,16),(15,16),(16,16)], 'beak', 2); s.put(15, 13, 'beak', 3); s.put(16, 15, 'beak', 0); s.put(16, 16, 'beak', 0)
    # pecho con plumas en V
    s.ell(15.5, 22, 5.5, 5.5, 'cream', 1)
    chest = {p for p in s.cells('cream') if p[1] >= 17}
    for (x, y) in chest:
        if x > 18: s.put(x, y, 'cream', 0)
    for (cx, cy) in ((13,19),(17,19),(11,22),(15,22),(19,22),(13,25),(17,25)):
        for p in ((cx-1, cy), (cx, cy+1), (cx+1, cy)):
            if p in chest: s.put(p[0], p[1], 'owl', 2 if cx < 17 else 1)
    # patas
    for x0 in (11, 17):
        s.rect(x0, 29, x0+3, 30, 'beak', 2); s.rect(x0, 30, x0+3, 30, 'beak', 1); s.put(x0+1, 30, 'beak', 0); s.put(x0+3, 29, 'beak', 1)
    s.outline()
    return s

# ───────── Terrenos ─────────
def tierra(seed=3):
    rnd = random.Random(seed)
    s = Spr(); s.rect(0, 0, 31, 31, 'dirt', 2)
    w = lambda v: v % N
    for _ in range(8):   # manchas claras
        x, y = rnd.randrange(N), rnd.randrange(N)
        for dx, dy in ((0,0),(1,0),(2,0),(3,0),(1,1),(2,1),(1,-1)):
            if rnd.random() < .85: s.put(w(x+dx), w(y+dy), 'dirt', 3)
    for _ in range(7):   # surcos oscuros
        x, y = rnd.randrange(N), rnd.randrange(N)
        for dx in range(rnd.randrange(2, 5)): s.put(w(x+dx), y, 'dirt', 1)
    for _ in range(4):   # piedritas
        x, y = rnd.randrange(1, 29), rnd.randrange(1, 29)
        s.put(x, y, 'dirt', 4); s.put(x+1, y, 'dirt', 4); s.put(x, y+1, 'dirt', 3); s.put(x+1, y+1, 'dirt', 1); s.put(x+2, y+1, 'dirt', 0); s.put(x+1, y+2, 'dirt', 0)
    return s

def losa(seed=1):
    rnd = random.Random(seed)
    s = Spr(); s.rect(0, 0, 31, 31, 'sto', 1)
    for (x0, y0, x1, y1) in ((1, 1, 30, 13), (1, 16, 14, 30), (17, 16, 30, 30)):
        s.rect(x0, y0, x1, y1, 'sto', 3)
        s.rect(x0, y0, x1, y0, 'sto', 4); s.rect(x0, y0, x0, y1, 'sto', 4)
        s.rect(x0, y1, x1, y1, 'sto', 2); s.rect(x1, y0, x1, y1, 'sto', 2)
        for _ in range(5):
            x, y = rnd.randrange(x0+2, x1-2), rnd.randrange(y0+2, y1-1)
            s.put(x, y, 'sto', 2); s.put(x+1, y, 'sto', 2)
    s.rect(0, 14, 31, 14, 'sto', 0); s.rect(15, 15, 15, 31, 'sto', 0); s.rect(0, 0, 31, 0, 'sto', 1); s.rect(0, 15, 31, 15, 'sto', 1); s.rect(16, 16, 16, 31, 'sto', 1)
    if seed % 2:    # grieta
        x, y = rnd.randrange(6, 22), 3
        for _ in range(7): s.put(x, y, 'sto', 1); s.put(x+1, y+1, 'sto', 4); y += 1; x += rnd.choice((-1, 0, 1))
    else:           # musgo en la junta
        for x in range(rnd.randrange(2, 8), rnd.randrange(10, 14)): s.put(x, 14, 'moss', 1); s.put(x, 15, 'moss', 2 if x % 2 else 0)
    return s

def borde(side):
    """Franja de pasto que invade una casilla de tierra o losa por un lado."""
    s = Spr()
    depth = [3, 4, 4, 3, 2, 3, 5, 4, 3, 3, 2, 3, 4, 5, 4, 3, 3, 2, 3, 4, 3, 3, 4, 5, 3, 2, 3, 4, 4, 3, 2, 3]
    for i, d in enumerate(depth):
        for j in range(d + 1):
            t = 0 if j == d else 1 if j == d-1 else 3 if (i*7 + j*3) % 11 == 0 else 2
            x, y = {'n': (i, j), 's': (i, 31-j), 'o': (j, i), 'e': (31-j, i)}[side]
            if side in ('s', 'e') and j >= d-1: t = 4 if j == d and i % 3 == 0 else 3     # del lado de la luz
            s.put(x, y, 'gra', t)
    return s

# ───────── Edificios (64x64) ─────────
def choza():
    s = Spr(64)
    # paredes de troncos
    for i, x0 in enumerate(range(10, 54, 4)):
        s.rect(x0, 36, x0+3, 58, 'wood', 2); s.rect(x0, 36, x0, 58, 'wood', 4 if x0 < 30 else 3); s.rect(x0+3, 36, x0+3, 58, 'wood', 0 if x0 > 36 else 1)
        for y in range(38 + (i*5) % 7, 58, 7): s.put(x0+1, y, 'wood', 1); s.put(x0+2, y+1, 'wood', 1)
    s.rect(46, 36, 53, 58, 'wood', 1)
    for x0 in (46, 50): s.rect(x0, 36, x0, 58, 'wood', 2); s.rect(x0+3, 36, x0+3, 58, 'wood', 0)
    s.rect(10, 36, 53, 38, 'wood', 0); s.rect(10, 39, 53, 39, 'wood', 1)            # sombra del alero
    s.rect(10, 46, 53, 47, 'lea', 1); s.rect(10, 46, 40, 46, 'lea', 3)               # amarre de cuerda
    for x in range(11, 53, 3): s.put(x, 47, 'lea', 0)
    # puerta con cortina de piel
    s.rows(41, [(27,36),(26,37)], 'wood', 0); s.rect(25, 43, 38, 58, 'wood', 0)
    s.rows(42, [(28,35),(27,36)], 'dark', 1); s.rect(27, 44, 36, 58, 'dark', 1); s.rect(27, 44, 28, 58, 'dark', 0)
    s.rows(43, [(31,36),(31,36),(32,36),(32,36),(32,36),(33,36),(33,36),(33,36),(34,36),(34,36),(34,36),(35,36)], 'lea', 2)
    for y in range(43, 55): 
        if (36, y) in s.g: s.put(36, y, 'lea', 1)
    s.pts('lea', 3, (31,43),(32,45),(33,48),(34,51))
    # piedras al pie
    for (x0, x1) in ((8,14),(15,19),(20,25),(39,44),(45,50),(51,56)):
        s.rect(x0, 56, x1, 59, 'sto', 2); s.rect(x0+1, 55, x1-1, 55, 'sto', 3); s.rect(x0+1, 56, x0+2, 56, 'sto', 4); s.rect(x0, 59, x1, 59, 'sto', 1); s.rect(x1, 56, x1, 59, 'sto', 1)
    # techo de paja en capas
    for y in range(6, 38):
        half = 3 + (y - 6) * 27 / 31
        layer = (y - 6) % 7
        for x in range(round(31.5 - half), round(31.5 + half) + 1):
            side = (x - 31.5) / half
            t = 3 if side < -.25 else 2 if side < .35 else 1
            if layer == 6: t = max(0, t - 2)
            elif layer == 5 and (x % 3 == 0): t = max(0, t - 1)
            elif layer == 0 and side < .2: t = min(4, t + 1)
            elif (x * 5 + y * 3) % 9 == 0: t = max(0, t - 1)
            elif (x * 3 + y * 7) % 13 == 0: t = min(4, t + 1)
            s.put(x + ((y * 3) % 2 if layer == 6 else 0) * 0, y, 'straw', t)
    for x in range(3, 61):       # flecos del alero
        if x % 3 != 1: s.put(x, 38, 'straw', 1 if x < 36 else 0)
        if x % 4 == 0: s.put(x, 39, 'straw', 0)
    # palos cruzados en la punta
    s.line(27, 1, 34, 8, 'wood', 3); s.line(36, 1, 29, 8, 'wood', 2); s.line(28, 1, 35, 8, 'wood', 1); s.line(31, 0, 31, 6, 'wood', 4); s.line(32, 0, 32, 6, 'wood', 1)
    s.rect(29, 6, 34, 7, 'lea', 2); s.rect(33, 6, 34, 7, 'lea', 1)
    s.outline()
    return s

def templo():
    s = Spr(64)
    # escalones
    s.rect(4, 52, 59, 54, 'sto', 3); s.rect(2, 55, 61, 58, 'sto', 3); s.rect(0, 59, 63, 62, 'sto', 2)
    s.rect(4, 52, 59, 52, 'sto', 4); s.rect(2, 55, 61, 55, 'sto', 4); s.rect(0, 59, 63, 59, 'sto', 4)
    s.rect(4, 54, 59, 54, 'sto', 1); s.rect(2, 58, 61, 58, 'sto', 1); s.rect(0, 62, 63, 62, 'sto', 0)
    for x in range(6, 62, 9): s.rect(x, 56, x, 57, 'sto', 2); s.rect(x+4, 60, x+4, 61, 'sto', 1)
    # interior
    s.rect(6, 22, 57, 51, 'dark', 2); s.rect(6, 22, 57, 26, 'dark', 0); s.rect(27, 30, 36, 51, 'dark', 0)
    s.rect(29, 34, 34, 51, 'fire', 2); s.rect(30, 36, 33, 51, 'fire', 3); s.rect(31, 40, 32, 51, 'fire', 4)   # luz del santuario
    # columnas estriadas
    for cx in (6, 20, 37, 51):
        tones = [4, 3, 4, 2, 3, 1, 0]
        for i, t in enumerate(tones): s.rect(cx+i, 24, cx+i, 49, 'sto', t)
        s.rect(cx-1, 22, cx+7, 23, 'sto', 3); s.rect(cx-1, 22, cx+4, 22, 'sto', 4); s.rect(cx+5, 22, cx+7, 23, 'sto', 1)
        s.rect(cx, 24, cx+6, 24, 'sto', 1)
        s.rect(cx-1, 50, cx+7, 51, 'sto', 3); s.rect(cx-1, 50, cx+4, 50, 'sto', 4); s.rect(cx+5, 50, cx+7, 51, 'sto', 1)
    s.pts('sto', 0, (9,33),(10,34),(10,35),(40,41),(41,42),(54,30),(54,31))
    # entablamento
    s.rect(2, 16, 61, 21, 'sto', 3); s.rect(2, 16, 61, 16, 'sto', 4); s.rect(2, 21, 61, 21, 'sto', 1); s.rect(56, 17, 61, 20, 'sto', 2)
    for x in range(5, 60, 6): s.rect(x, 18, x+1, 19, 'sto', 1); s.put(x, 18, 'sto', 0)
    s.rect(2, 17, 61, 17, 'gold', 1); s.rect(2, 17, 30, 17, 'gold', 2); s.rect(50, 17, 61, 17, 'gold', 0)
    # frontón
    for y in range(3, 16):
        half = 2 + (y - 3) * 28 / 12
        for x in range(round(31.5 - half), round(31.5 + half) + 1):
            edge = abs(x - 31.5) > half - 2.2 or y == 15
            s.put(x, y, 'sto', (4 if x < 31 else 2) if edge else (3 if x < 40 else 2))
    s.rect(3, 15, 60, 15, 'sto', 1)
    s.ell(31.5, 10.5, 3.6, 3.6, 'gold', 1)
    s.pts('gold', 2, (30,8),(31,8),(29,9),(30,9),(29,10)); s.pts('gold', 0, (33,12),(34,11),(32,13),(33,13),(34,12))
    for (x, y) in ((31,5),(32,5),(26,10),(37,10),(27,7),(36,7),(27,13),(36,13),(25,11),(38,11)): s.put(x, y, 'gold', 1)
    s.rect(30, 1, 33, 2, 'gold', 1); s.put(30, 1, 'gold', 2); s.put(33, 2, 'gold', 0)
    s.outline()
    return s

# ───────── Exportar ─────────
# ───────── Sprites v2 (redibujo SNES aprobado por Erick, portado a 32x32) ─────────
# Cuadrículas 16x16 aprobadas (ref. Mega Man X / Chrono Trigger), remapeadas a los
# caracteres de la paleta de main (misma rampa, tono equivalente) y escaladas 2x al
# estampar: cada píxel v2 es un bloque 2x2 nítido en el mundo de 32px. La túnica
# usa las letras fijas V,U,T,t (OUTFIT_COLORS en sprites.ts las recolorea por atuendo).
_CHAR2HEX = {
    '!': '#8a6444',
    '#': '#a8733f',
    '$': '#d6a066',
    '%': '#8a4f3a',
    '&': '#c98a5e',
    '(': '#b88456',
    ')': '#d4a474',
    '*': '#3a2a22',
    '+': '#3e70b6',
    ',': '#f5dd8a',
    '-': '#1e1418',
    '/': '#9c6b43',
    '0': '#b08e68',
    '1': '#d8bf98',
    '2': '#2b2433',
    '3': '#453a52',
    '4': '#6a5c7a',
    '5': '#b85a70',
    '6': '#e88aa0',
    '7': '#7a1f2a',
    '8': '#c0392b',
    '9': '#e8614a',
    ':': '#3f6b3a',
    ';': '#5a8f4e',
    '<': '#7bb062',
    '=': '#5c4030',
    '>': '#a6d67a',
    '?': '#4a2e1c',
    '@': '#7a5033',
    'A': '#e08f5a',
    'B': '#f5b98a',
    'C': '#120b18',
    'D': '#2a1a12',
    'E': '#8a6420',
    'F': '#e0b84a',
    'G': '#ffe58a',
    'H': '#1f5f8f',
    'I': '#2f7fb8',
    'J': '#4aa3d8',
    'K': '#9fd8f0',
    'L': '#e6f7ff',
    'M': '#2f5a1e',
    'N': '#4f7f2a',
    'O': '#73a838',
    'P': '#9fd04f',
    'Q': '#d3f08a',
    'R': '#b8a078',
    'S': '#e6d6b0',
    'T': '#3d6fb5',
    'U': '#2c5287',
    'V': '#1b3560',
    'W': '#fff4d6',
    'X': '#3d2a1c',
    'Y': '#6b4a30',
    'Z': '#8b6a4a',
    '[': '#6e5420',
    ']': '#a8822f',
    '^': '#2f5a34',
    '_': '#f0c08a',
    '`': '#2f2838',
    'a': '#a82a2a',
    'b': '#e0533d',
    'c': '#ff8a3d',
    'd': '#ffd166',
    'e': '#fff3b0',
    'f': '#ffffff',
    'g': '#6e6878',
    'h': '#9a93a3',
    'i': '#c4bfcc',
    'j': '#ebe8f0',
    'k': '#1a1020',
    'l': '#3d2416',
    'm': '#6b4226',
    'n': '#8a5a34',
    'o': '#b07a48',
    'p': '#d9a56a',
    'q': '#2f6b33',
    'r': '#4f9a45',
    's': '#7cc45e',
    't': '#6a9be0',
    'u': '#b6ea8c',
    'v': '#3e3948',
    'w': '#1f4a26',
    'x': '#6e3520',
    'y': '#9a4f2c',
    'z': '#c06a3e',
    '{': '#c9a24a',
    '|': '#5c3a24',
    '}': '#e2bf5e',
    '~': '#ffe2bd',
}
_HEX2MT = {}
for _m, _tones in R.items():
    for _t, _h in enumerate(_tones):
        _HEX2MT.setdefault(_h, (_m, _t))
V2_GRIDS_16 = {
    'fogata1': [
        '................',
        '......b....b....',
        '......cc..c.....',
        '.......cc.......',
        '......ccdc......',
        '.....ccddcc.....',
        '....ccdfdc......',
        '....ccdeecc.....',
        '...ccddddccc....',
        '...cdeeeddcc....',
        '....ccddcc......',
        '...non..non.....',
        '..ggnonnnogg....',
        '.ghhgnnnnghhg...',
        '..gg......gg....',
        '................',
    ],
    'fogata2': [
        '................',
        '.....b....b.....',
        '.....c..cc......',
        '.......cc.......',
        '......cdcc......',
        '.....ccddcc.....',
        '....ccdfdc......',
        '....ccdeecc.....',
        '...cccddddcc....',
        '....ccdeeedc....',
        '....ccddcc......',
        '...non..non.....',
        '..ggnonnnogg....',
        '.ghhgnnnnghhg...',
        '..gg......gg....',
        '................',
    ],
    'roca': [
        '................',
        '................',
        '................',
        '................',
        '................',
        '......2222......',
        '....22<<<<22....',
        '...2i<><<<<<i2..',
        '..2h<<<<hhhii2..',
        '..2hh<hhhhig32..',
        '.2hhhhhhhggggg2.',
        '.2gghhhhh3gggg2.',
        '.2gggghh3ggggg2.',
        '..22gggggggg22..',
        '....22222222....',
        '................',
    ],
    'helecho': [
        '................',
        '.......>........',
        '...>...>...>....',
        '....>..>..>.....',
        '..>>>>.>.>>>>...',
        '....>>q>q>q>....',
        '.>...>q>q>...>..',
        '..>>.>q>q>.>>...',
        '....>>q>q>>.....',
        '..>>>.>q>.>>>...',
        '.....>>q>>......',
        '......>q>.......',
        '.......>........',
        '......:w:.......',
        '................',
        '................',
    ],
    'columna': [
        '...2222222222...',
        '...2iiiiiiii2...',
        '...2ihhhhhhi2...',
        '....2ihig2......',
        '....2ihig2......',
        '....2ihig2......',
        '....2ihig2......',
        '....2ihig2......',
        '....2ihig2......',
        '....2ihig2......',
        '....2igg32......',
        '....2igg32......',
        '....2gggggg2....',
        '...2iiiiiiii2...',
        '...2gggggggg2...',
        '...2222222222...',
    ],
    'anfora': [
        '................',
        '.....222222.....',
        '....2AAAAAA2....',
        '.....2AzzA2.....',
        '.....2AzzA2.....',
        '...222Azzzz222..',
        '..2AAzzzzzzzA2..',
        '.2AAzdddddddzz2.',
        '.2Azz22z22zzzy2.',
        '.2Azzzzzzzzzzy2.',
        '.2Azdddddddzzy2.',
        '.2Azzzzzzzzzyy2.',
        '..2Azzzzzzyy2...',
        '...2Azzzxy2.....',
        '....22222222....',
        '................',
    ],
    'fuente': [
        '.......f........',
        '......KfK.......',
        '.....K.J.K......',
        '.......J........',
        '.....2hhi2......',
        '......2h2.......',
        '......2h2.......',
        '..222222222222..',
        '.2iiiiiiiiiiii2.',
        '.2hKKfJKfKKJKh2.',
        '.2hJJJKJJJKJ+h2.',
        '.2ghhhhhhhhhhg2.',
        '..2gg3ggggggg2..',
        '...2222222222...',
        '................',
        '................',
    ],
    'dodo': [
        '................',
        '................',
        '................',
        '................',
        '.......222......',
        '......2iii2.....',
        '......2if2i2....',
        '......2iiii2dd2.',
        '.......2ii24d2..',
        '.....22hi44h22..',
        '....2hhhi442....',
        '...2hhhhh44h2...',
        '....2hhhh442....',
        '.....222422.....',
        '......d...d.....',
        '.....dd..dd.....',
    ],
    'lagartija': [
        '................',
        '................',
        '................',
        '................',
        '................',
        '................',
        '................',
        '...........22...',
        '..........2>>2..',
        '...2222222>fPP2.',
        '.22>>>>>>>>PP2..',
        '2PPPPPPPPPM22...',
        '.22.2M2..2M2....',
        '....22....22....',
        '................',
        '................',
    ],
    'buho': [
        '................',
        '................',
        '....2......2....',
        '....2Z2..2Z2....',
        '....2?Z22Z?2....',
        '...2ZffSSffZ2...',
        '...2Zf2SS2fZ2...',
        '...2ZZSd4SZZ2...',
        '...2ZSSdSSSZ2...',
        '...2?SZSZSS?2...',
        '...2ZSSZSZSZ2...',
        '....2ZSSSSZ2....',
        '.....2ZZZZ2.....',
        '.....d2..2d.....',
        '................',
        '................',
    ],
    'gato': [
        '................',
        '................',
        '................',
        '.....2....2.....',
        '....24F2.24F2...',
        '....2444442.....',
        '....2444442.....',
        '....2Ff44fF2....',
        '....2444442.22..',
        '.....2FFF2..22..',
        '....2444442.22..',
        '....2444442222..',
        '....224444222...',
        '....22.22.22....',
        '................',
        '................',
    ],
    'explorador1': [
        '................',
        '......2222......',
        '.....2****2.....',
        '....2!*****2....',
        '....2*____*2....',
        '....2_2__2_2....',
        '....2______2....',
        '.....2_$$(2.....',
        '....2tTTTT2.....',
        '...2_TTTTTT_2...',
        '...2_2TTTT2_2...',
        '....2TTUUV2.....',
        '....2UU22UU2....',
        '.....2_2.2(2....',
        '.....22...22....',
        '................',
    ],
    'explorador2': [
        '................',
        '......2222......',
        '.....2****2.....',
        '....2!*****2....',
        '....2*____*2....',
        '....2_2__2_2....',
        '....2______2....',
        '.....2_$$(2.....',
        '....2tTTTT2.....',
        '...2_TTTTTT_2...',
        '...2_2TTTT2_2...',
        '....2TTUUV2.....',
        '....2UU22UU2....',
        '....2_2...2_2...',
        '....22.....22...',
        '................',
    ],
}
def v2spr(key):
    s = Spr()
    for y, row in enumerate(V2_GRIDS_16[key]):
        for x, ch in enumerate(row):
            if ch == '.': continue
            m, t = _HEX2MT[_CHAR2HEX[ch]]
            for dy in (0, 1):
                for dx in (0, 1):
                    s.put(2 * x + dx, 2 * y + dy, m, t)
    return s
SPRITES = {
    'fogata1': lambda: v2spr('fogata1'), 'fogata2': lambda: v2spr('fogata2'), 'roca': lambda: v2spr('roca'),
    'helecho': lambda: v2spr('helecho'), 'columna': lambda: v2spr('columna'), 'anfora': lambda: v2spr('anfora'),
    'fuente': lambda: v2spr('fuente'), 'dodo': lambda: v2spr('dodo'), 'lagartija': lambda: v2spr('lagartija'),
    'buho': lambda: v2spr('buho'), 'gato': lambda: v2spr('gato'),
    'explorador1': lambda: v2spr('explorador1'), 'explorador2': lambda: v2spr('explorador2'),
}
TILES = {
    'pasto1': lambda: pasto(7), 'pasto2': lambda: pasto(8), 'pasto3': lambda: pasto(9),
    'tierra1': lambda: tierra(3), 'tierra2': lambda: tierra(5), 'losa1': lambda: losa(1), 'losa2': lambda: losa(2),
    'bordeN': lambda: borde('n'), 'bordeS': lambda: borde('s'), 'bordeE': lambda: borde('e'), 'bordeO': lambda: borde('o'),
}
BUILDINGS = {'choza': choza, 'templo': templo}
POOL = [c for c in 'abcdefghijlmnopqrsuvwxyzABCDEFGHIJKLMNOPQRSWXYZ0123456789+-*=!?@#$%&_~^:;<>|/()[]{},`' if c not in PINNED.values()]

def build():
    groups = {name: {k: f() for k, f in grp.items()} for name, grp in (('SPRITES', SPRITES), ('TILES', TILES), ('BUILDINGS', BUILDINGS))}
    chars, pool, by_hex = dict(PINNED), iter(POOL), {}
    for grp in groups.values():
        for s in grp.values():
            for v in sorted(set(s.g.values())):
                if v in chars: continue
                h = R[v[0]][v[1]]          # un mismo color comparte letra (salvo la túnica)
                if h not in by_hex: by_hex[h] = next(pool)
                chars[v] = by_hex[h]
    return groups, chars

def to_rows(s, chars):
    return [''.join(chars[s.g[(x, y)]] if (x, y) in s.g else '.' for x in range(s.n)) for y in range(s.n)]

def write_ts(groups, chars, path='src/game/sprites.data.ts'):
    out = ['/**', ' * ARCHIVO GENERADO por scripts/make_sprites.py. No lo edites a mano:',
           ' * cambia el script y vuelve a ejecutarlo.', " * Cada carácter es un color de PALETTE; '.' es transparente.", ' */',
           'export const PALETTE: Record<string, string> = {']
    seen = set()
    for (m, t), c in sorted(chars.items(), key=lambda kv: (kv[0][0], kv[0][1])):
        if c in seen: continue
        seen.add(c); out.append(f"  '{c}': '{R[m][t]}', // {m} {t}")
    out.append('};')
    for name, const in (('SPRITES', 'RAW_SPRITES'), ('TILES', 'RAW_TILES'), ('BUILDINGS', 'RAW_BUILDINGS')):
        out.append(''); out.append(f'export const {const} = {{')
        for k, s in groups[name].items():
            out.append(f'  {k}: [')
            out += [f"    '{r}'," for r in to_rows(s, chars)]
            out.append('  ],')
        out.append('} satisfies Record<string, string[]>;')
    open(path, 'w', encoding='utf8').write('\n'.join(out) + '\n')

def preview(groups, path):
    from PIL import Image
    def img(s):
        im = Image.new('RGBA', (s.n, s.n), (0, 0, 0, 0))
        for p in s.g:
            h = s.color(p); im.putpixel(p, tuple(int(h[i:i+2], 16) for i in (1, 3, 5)) + (255,))
        return im
    T = {k: img(s) for k, s in groups['TILES'].items()}
    def scene(kind, building):
        sc = Image.new('RGBA', (320, 288))
        for ty in range(9):
            for tx in range(10):
                k = kind(tx, ty)
                sc.paste(T[k + str(1 + (tx * 7 + ty * 13) % (3 if k == 'pasto' else 2))], (tx * 32, ty * 32))
        for ty in range(9):
            for tx in range(10):
                if kind(tx, ty) == 'pasto': continue
                for side, (dx, dy) in (('N', (0, -1)), ('S', (0, 1)), ('O', (-1, 0)), ('E', (1, 0))):
                    if 0 <= tx+dx < 10 and 0 <= ty+dy < 9 and kind(tx+dx, ty+dy) == 'pasto': sc.alpha_composite(T['borde' + side], (tx*32, ty*32))
        sc.alpha_composite(img(groups['BUILDINGS'][building]), (32, 32))
        return sc
    e1 = scene(lambda x, y: 'tierra' if (x == 2 and y >= 3) or (y == 6 and x >= 2) else 'pasto', 'choza')
    e2 = scene(lambda x, y: 'losa' if (1 <= x <= 8 and 3 <= y <= 7) else 'pasto', 'templo')
    S = {k: img(s) for k, s in groups['SPRITES'].items()}
    for sc, items in ((e1, (('fogata1', 5, 3), ('roca', 7, 2), ('helecho', 8, 5), ('dodo', 6, 7), ('lagartija', 4, 4), ('explorador1', 3, 5))),
                      (e2, (('columna', 4, 3), ('anfora', 6, 4), ('fuente', 5, 5), ('buho', 7, 6), ('gato', 3, 6), ('explorador2', 2, 4)))):
        for k, x, y in items: sc.alpha_composite(S[k], (x * 32, y * 32))
    sheet = Image.new('RGB', (320 * 2 + 30, 288 * 4 + 30), (38, 30, 48))
    sheet.paste(e1.resize((640, 576), Image.NEAREST), (10, 10)); sheet.paste(e2.resize((640, 576), Image.NEAREST), (10, 596))
    sheet.save(path)

if __name__ == '__main__':
    groups, chars = build()
    write_ts(groups, chars)
    if '--preview' in sys.argv: preview(groups, sys.argv[sys.argv.index('--preview') + 1])
    print('ok', sum(len(g) for g in groups.values()), 'dibujos,', len(chars), 'colores')
