Documento MD entregable (cópialo tal cual a tu repo como /docs/zafta-migracion.md)
# Zafta — Especificación de Migración Web (Next.js + shadcn/ui)

> Objetivo: Migrar el sitio “Lovable” a Next.js 14 (App Router) aplicando el BrandBook de Zafta y elevando la experiencia con animaciones modernas, alto performance y gobernanza de contenido.

## 1) Fundamentos de Marca (resumen ejecutivo)
- **Tono:** femenino, cálido y cercano; sugiere sin exagerar. Ejemplo guía en BrandBook.  
- **Paleta:** Rose Gold `#E5B097`, Rich Burgundy `#80011F`, Midnight Navy `#111C3B`, Ivory Cream `#FFFBEF`.  
- **Tipografías:** *Lust* (títulos, alto contraste) y **Fredoka** (texto). En web usaremos **Playfair Display** como fallback compatible para *Lust* (o **Lora**).  
- **Historia y Promesa:** legado familiar de ~30 años, receta de Fanny Wagner; “te entregamos más que un postre, un legado auténtico”.  
_Referencias: tono (p.7), paleta (p.14), tipografías (p.15), historia/promesa (p.4–6)._  

## 2) Stack técnico
- **Next.js 14 (App Router) + TypeScript + Tailwind + shadcn/ui + Framer Motion**.
- **Vercel** (CI/CD), imágenes con `next/image`, fuentes con `next/font`.
- **Accesibilidad:** WCAG AA; contrastes burgundy/ivory; `aria-*`, `focus-visible`.

## 3) Design System (tokens y tipografía)
### 3.1 Colores (CSS variables)
```css
:root{
  --rose-gold:#E5B097; --burgundy:#80011F; --midnight:#111C3B; --ivory:#FFFBEF;
  --bg: var(--ivory); --fg: var(--midnight); --brand: var(--burgundy);
}


Mapear en tailwind.config.ts a colors.rose, colors.burgundy, colors.midnight, colors.ivory.

3.2 Tipografías

Títulos: Playfair Display 600/700 (fallback de Lust), itálicas opcionales en claims.

Texto UI y párrafos: Fredoka 300–500.

Cargar con next/font y exponer utilidades font-title, font-body.

3.3 Componentes shadcn a usar

button, card, badge, accordion, navigation-menu, dialog, sheet, input, textarea, toast, tooltip.

4) Arquitectura de información (páginas)

Rutas bajo src/app/(site)/...

4.1 Inicio (/inicio)

Hero: claim emocional + imagen de torta; CTAs: “Hacer pedido” (abre Sheet con pasos + deeplink WhatsApp), “Ver nuestras tortas”.

Promesa Zafta: 4 Cards: Legado, Hecho en casa, Memoria, Creatividad.

Destacados de producto: 3–6 ProductCard.

Testimonios: carrusel simple.

InstagramGrid: 3–6 posts.

Animaciones: fadeInUp, stagger en secciones; parallax sutil en hero.

4.2 Cómo Comprar (/como-comprar)

Pasos: Explora → WhatsApp → Fecha → Pago → Entrega.

Información: horarios, cobertura de envíos, medios de pago.

CTA persistente a WhatsApp.

4.3 Nuestras Tortas (/nuestras-tortas)

Grid de Cards con filtros por tag (chocolate, frutos, cumpleaños).

Datos mock (nombre, breve descripción emocional, porciones, precio aprox., foto).

4.4 Nuestra Historia (/nuestra-historia)

Timeline: origen (Fanny Wagner), crecimiento y presente. Foto destacada.

4.5 Valores y Propósito (/valores-proposito)

Bloques: Tradición, Amor, Creatividad, Memoria. Copys cortos y cercanos.

4.6 FAQ (/faq)

Acordeón con 8–10 preguntas (pedido mínimo, conservación, porciones, urgencias, envíos).

4.7 Contacto (/contacto)

Formulario (nombre, teléfono, mensaje) + mapa (placeholder) + WhatsApp.

5) Animaciones y microinteracciones

Framer Motion: presets fadeInUp, staggerChildren, parallax.

Estados: hover sutil (elevación y escala 1.01), focus ring burgundy.

Performance: motion solo cuando visible (viewport once), prefers-reduced-motion respetado.

6) Voz y contenido

Guía de tono (no “2x1 urgente”; sí “huele a recuerdos”).

Glosario de frases cálidas reutilizables (archivo quotes.ts).

7) SEO y analítica

Metadata por ruta; OpenGraph e imágenes social.

Sitemap automático, robots.txt.

Medición: Vercel Analytics o Plausible.

8) Accesibilidad y performance

Contraste mínimo AA (burgundy/ivory y midnight/ivory).

Imágenes optimizadas y lazy, fuentes display:swap.

Objetivo Lighthouse ≥ 90 en Performance/SEO/A11y.

9) Estructura de carpetas
src/
  app/(site)/
    inicio/ page.tsx
    como-comprar/ page.tsx
    nuestras-tortas/ page.tsx
    nuestra-historia/ page.tsx
    valores-proposito/ page.tsx
    faq/ page.tsx
    contacto/ page.tsx
  components/
    logo-zafta.tsx nav-main.tsx hero.tsx product-card.tsx
    step-card.tsx timeline.tsx instagram-grid.tsx
  lib/ motion.ts quotes.ts
  styles/ globals.css theme.css

10) Checklist de migración

 Crear repo y scaffold (Next.js + TS + Tailwind + shadcn/ui + Framer Motion).

 Configurar tokens de color y tipografías.

 Implementar Layout, Nav y Footer.

 Construir /inicio con animaciones.

 Implementar páginas de contenido (6 rutas).

 Integrar CTA y deeplink WhatsApp.

 Subir logos/íconos (SVG/PNG) y favicon.

 SEO (metadata OG), Sitemap, robots.

 QA de accesibilidad y Lighthouse.

 Deploy a Vercel y verificación de dominio.


# ENTREGAR
**Mejoras clave**
- Consolidación de **Design System** con tokens alineados a la paleta del BrandBook (p. 14) y tipografías mapeadas a equivalentes web (p. 15).  
- **Arquitectura App Router** y **componentización shadcn** lista para escalar.  
- **Animaciones modernas** con presets reutilizables y foco en performance.  
- **Prompts operativos** para que Claude Code genere el proyecto y las vistas end-to-end sin ambigüedad.

**Técnicas aplicadas**
- Asignación de rol (“senior front-end engineer”), descomposición por fases, especificaciones de salida, **few-shot estructural** en prompts, **optimización de restricciones** (A11y/SEO/Perf) y **marco sistemático** para animaciones.

**Consejo profesional**
- Si “Lust” no está disponible para web, mantén **Playfair Display** en títulos y revisa kerning/leading para preservar la **presencia elegante** del libro de marca. Mantén el **burgundy** como color de marca en CTAs y ring de enfoque para reforzar identidad en cada interacción.

> ¿Quieres que además genere un **ticketing plan** (epics → stories → tasks) o que empaquete el **README** y un **script de seeds** para los productos mock? Puedo incorporarlo en el mismo MD en un siguiente entregable.