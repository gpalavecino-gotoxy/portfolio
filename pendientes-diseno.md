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

---

## 6. Animaciones nuevas (investigación + implementación)

Investigación de animaciones originales para portfolios de dev/AI engineer (evitando clichés tipo terminal falso, matrix rain, typewriter en loop). Se implementaron 5:

1. **Reveal palabra-por-palabra en el statement del hero** — JS envuelve cada palabra en un `<span>`, fade+blur escalonado al cargar. Degrada a texto plano estático sin JS o con `prefers-reduced-motion`.
2. **Spotlight extendido a los work-cards** — reutiliza el mismo mecanismo del hero (radial-gradient + posición del mouse vía custom properties), pero por card.
3. **Command palette (Ctrl/Cmd+K)** — modal con búsqueda/filtro sobre secciones, proyectos y links externos. Se abre con el atajo, con el botón del footer ("Ctrl K to jump around"), navegación por teclado (flechas, Enter, Escape, Tab bloqueado al input).
4. **Magnetic pull en el CTA primario del hero** ("Get in touch" únicamente, envuelto en `.btn-magnet`) — se acerca sutilmente al cursor cuando está cerca.
5. **Reveal-on-scroll nativo vía CSS** (`animation-timeline: view()`) con `@supports`, reemplazando el IntersectionObserver en navegadores que lo soportan (el JS se auto-desactiva cuando detecta soporte nativo).

Todo respeta `prefers-reduced-motion` y `(hover: hover) and (pointer: fine)`, sin dependencias nuevas.

**Nota de testing:** el navegador de este entorno de automatización se colgó varias veces durante la verificación (error "renderer frozen/unresponsive" repetido en pestañas distintas), lo que hizo poco confiable probar clicks/scroll por coordenadas y leer `scrollY` en pleno scroll animado. Se verificó lo que sí fue estable: sintaxis JS/HTML/CSS válida, apertura del palette y filtrado en vivo (confirmado por screenshot), `.click()` disparado por JS abre/cierra el estado correctamente, media queries evaluando bien, y un bug real encontrado y arreglado (el `render()` del palette reconstruía toda la lista en cada `mouseenter`, lo cual podía invalidar el nodo justo antes de un click — ahora `updateActive()` solo togglea clases sin tocar el DOM). Recomendado: probarlo manualmente en el navegador real después de deployar.
