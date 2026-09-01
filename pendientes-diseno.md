# Pendientes de diseño

## ~~1. Hero: demasiados elementos (tenía 5, máximo son 4)~~ — Resuelto

Se sacó el eyebrow (su info de rol se sumó al statement: "Senior Software Engineer building intelligent systems...") y quedaron los tags como cuarto elemento: headline → statement → tags → CTAs.

---

## ~~2. Fuentes cargando dos veces~~ — Resuelto

Se borró el `@import` de Google Fonts en `css/styles.css`. Queda solo el `<link>` en el HTML con `rel="preconnect"`.

---

## 3. Dos tarjetas de proyectos sin imagen

Las tarjetas de **AI Service** y **YOLOv8** no tienen ningún visual. Si en algún momento hay screenshots o imágenes para estos proyectos, agregarlas.

---

## 4. (Menor) Etiqueta de CTA inconsistente

- Nav + Hero dicen **"Get in touch"** (scroll a #contact)
- Sección Contact dice **"Send a message"** (abre email)

Dos etiquetas distintas para la misma intención de contacto. Es defendible porque una es navegación y la otra es acción directa, pero queda anotado.

---

## ~~5. Paleta "AI purple/blue"~~ — Resuelto

Auditoría con el skill `design-taste-frontend` (tasteskill): el canvas violeta oscuro + dos blooms radiales violeta/azul fijos + acento rosa-violeta (315°) + spotlight violeta que sigue el mouse eran cuatro efectos apilados haciendo el mismo trabajo de "atmósfera AI" — el default más reconocible de landing generada por IA (regla LILA del skill).

**Cambio:** paleta zinc neutra (hue 260°, casi sin croma) + acento único ámbar/burnt-orange (hue 55°). Se sacaron los dos blooms fijos; queda solo el spotlight del cursor, recoloreado a un highlight neutro muy sutil (no ámbar) como único efecto de atmósfera. Se actualizó también `og-image.html` y se regeneró `assets/og-image.png` con la misma paleta.
