"""Íconos de CodeNova Evolution: Proto-0 en pixel art (cuadrícula 32x32, original)."""
from PIL import Image, ImageDraw

PAL = {
    '.': (27, 19, 37),      # fondo cueva
    'o': (13, 8, 18),       # contorno
    'L': (230, 220, 239),   # metal luz
    'M': (182, 166, 200),   # metal
    'D': (122, 103, 144),   # metal sombra
    'A': (255, 138, 61),    # antena (fogata)
    'a': (255, 208, 138),   # brillo antena
    'E': (255, 138, 61),    # ojo
    'e': (217, 104, 42),    # ojo sombra
    'Y': (255, 240, 194),   # brillo ojo
    'g': (123, 211, 137),   # rejilla encendida
    'k': (42, 31, 53),      # rejilla apagada
}
N = 32
g = [['.'] * N for _ in range(N)]

def put(x, y, c): g[y][x] = c
def hline(x0, x1, y, c):
    for x in range(x0, x1 + 1): put(x, y, c)
def rect(x0, y0, x1, y1, c):
    for y in range(y0, y1 + 1): hline(x0, x1, y, c)

# Antena
hline(14, 17, 2, 'o'); rect(13, 3, 18, 4, 'o'); rect(14, 3, 17, 4, 'A'); put(14, 3, 'a'); put(15, 3, 'a')
hline(14, 17, 5, 'o')
for y in (6, 7, 8): put(14, y, 'o'); put(15, y, 'L'); put(16, y, 'D'); put(17, y, 'o')

# Orejas (tornillos laterales)
for x0, (c1, c2) in ((2, ('M', 'D')), (27, ('M', 'D'))):
    rect(x0, 14, x0 + 2, 21, 'o')
    rect(x0 + (1 if x0 == 2 else 0), 15, x0 + (2 if x0 == 2 else 1), 20, c1)
    for y in range(15, 21): put(x0 + (2 if x0 == 2 else 1), y, c2)

# Cabeza
rect(5, 9, 26, 28, 'o')
rect(6, 10, 25, 27, 'M')
hline(6, 24, 10, 'L')
for y in range(10, 27): put(6, y, 'L'); put(25, y, 'D')
hline(6, 25, 27, 'D')
for (x, y) in ((8, 11), (23, 11), (8, 26), (23, 26)): put(x, y, 'D')  # remaches

# Ojos
for ex in (8, 18):
    rect(ex, 13, ex + 5, 18, 'o')
    rect(ex + 1, 14, ex + 4, 17, 'E')
    hline(ex + 1, ex + 4, 17, 'e')
    put(ex + 1, 14, 'Y')

# Boca (rejilla)
rect(10, 21, 21, 24, 'o')
for y in (22, 23):
    for x in range(11, 21):
        put(x, y, 'g' if (x + y) % 2 == 0 else 'k')

# Cuello
rect(11, 29, 20, 30, 'o'); rect(12, 29, 19, 30, 'D')

ART = Image.new('RGB', (N, N))
for y in range(N):
    for x in range(N):
        ART.putpixel((x, y), PAL[g[y][x]])

BBOX = (2, 2, 30, 31)  # zona con dibujo (sin márgenes)
ROBOT = ART.crop(BBOX)

def scaled(img, k): return img.resize((img.width * k, img.height * k), Image.NEAREST)

def on_bg(size, k):
    bg = Image.new('RGB', (size, size), PAL['.'])
    r = scaled(ROBOT, k)
    bg.paste(r, ((size - r.width) // 2, (size - r.height) // 2 + k // 2))
    return bg

# Ejecutar desde la raíz del proyecto: python3 scripts/make_icons.py
out = 'public/icons/'
on_bg(192, 6).save(out + 'icon-192.png')
on_bg(512, 16).save(out + 'icon-512.png')
on_bg(512, 12).save(out + 'icon-maskable-512.png')   # dibujo dentro de la zona segura (80 %)
on_bg(180, 5).save(out + 'apple-touch-icon.png')

# favicon.svg: un <rect> por tramo horizontal de color
rects = []
for y in range(N):
    x = 0
    while x < N:
        c = g[y][x]; x1 = x
        while x1 + 1 < N and g[y][x1 + 1] == c: x1 += 1
        if c != '.':
            r_, g_, b_ = PAL[c]
            rects.append(f'<rect x="{x}" y="{y}" width="{x1 - x + 1}" height="1" fill="#{r_:02x}{g_:02x}{b_:02x}"/>')
        x = x1 + 1
svg = ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" shape-rendering="crispEdges">'
       '<rect width="32" height="32" rx="5" fill="#1b1325"/>' + ''.join(rects) + '</svg>')
open('public/favicon.svg', 'w').write(svg)
print('ok', len(rects), 'rects')
