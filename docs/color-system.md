# Sistema de Colores Beige/Ivory - ZAFTA

Este documento explica la paleta de colores beige graduales que puedes usar en diferentes secciones de la página para crear jerarquía visual sutil.

## Paleta de Tonos Beige

De más claro a más fuerte (perfectos para combinar y crear profundidad):

### `--beige-50` - Casi Blanco
**HSL:** `45 100% 99%`
**Uso:** Highlights, áreas muy sutiles, hover states en fondos claros
**Ejemplo:** Fondo de tooltips, cards destacados

### `--beige-100` - Ivory Principal ✨ (Actual background)
**HSL:** `45 100% 97%`
**Uso:** **Navegación principal**, fondo de header
**Aplicado en:** `Navigation.tsx`

### `--beige-200` - Beige Muy Claro
**HSL:** `42 80% 95%`
**Uso:** Secciones alternas en páginas, para crear contraste suave con beige-100
**Ejemplo:** Sección de testimonios, galería de productos

```tsx
<section style={{ backgroundColor: "hsl(var(--beige-200))" }}>
  {/* Contenido */}
</section>
```

### `--beige-300` - Beige Claro
**HSL:** `40 60% 93%`
**Uso:** Cards, contenedores de contenido, áreas de producto
**Ejemplo:** Cards de productos individuales, contenedores de blog

```tsx
<div className="bg-[hsl(var(--beige-300))]">
  {/* Card content */}
</div>
```

### `--beige-400` - Beige Medio-Claro
**HSL:** `38 50% 90%`
**Uso:** Bordes sutiles, separadores, fondos de inputs
**Ejemplo:** Separadores entre secciones, fondos de formularios

```tsx
<input
  className="bg-[hsl(var(--beige-400))]"
  style={{ borderColor: "hsl(var(--beige-500))" }}
/>
```

### `--beige-500` - Beige Medio 🎨
**HSL:** `36 45% 87%`
**Uso:** **Footer**, áreas de énfasis, secciones que necesitan destacar
**Aplicado en:** `Footer.tsx` (con gradiente)

### `--beige-600` - Beige Medio-Fuerte
**HSL:** `34 40% 84%`
**Uso:** Hover states, bordes enfatizados, texto muted oscuro
**Ejemplo:** Estados hover en cards, bordes de elementos activos

```tsx
<button
  className="hover:bg-[hsl(var(--beige-600))]"
>
  Hover me
</button>
```

### `--beige-700` - Beige Fuerte
**HSL:** `32 35% 80%`
**Uso:** Texto muted, detalles sutiles, sombras internas
**Ejemplo:** Texto secundario, placeholders

## Ejemplos de Uso por Sección

### 1. Navegación (Header)
```tsx
// Ya aplicado en Navigation.tsx
style={{ backgroundColor: "hsl(var(--beige-100))" }}
```

### 2. Hero Section (Inicio)
```tsx
// Fondo más claro para destacar
<section className="bg-[hsl(var(--beige-50))]">
```

### 3. Secciones Alternas
```tsx
// Patrón de alternancia para profundidad visual
<section className="bg-[hsl(var(--beige-100))]"> {/* Sección 1 */}
<section className="bg-[hsl(var(--beige-200))]"> {/* Sección 2 */}
<section className="bg-[hsl(var(--beige-100))]"> {/* Sección 3 */}
```

### 4. Cards de Productos
```tsx
<div className="bg-[hsl(var(--beige-300))] hover:bg-[hsl(var(--beige-400))]">
  {/* Producto */}
</div>
```

### 5. Footer
```tsx
// Ya aplicado en Footer.tsx con gradiente
style={{
  background: `linear-gradient(135deg,
    hsl(var(--beige-500)) 0%,
    hsl(var(--beige-400)) 50%,
    hsl(var(--beige-500)) 100%)`
}}
```

### 6. Formularios
```tsx
<form className="bg-[hsl(var(--beige-200))] p-8">
  <input
    className="bg-[hsl(var(--beige-100))] border-[hsl(var(--beige-400))]"
  />
</form>
```

## Gradientes Recomendados

### Gradiente Suave (Secciones amplias)
```tsx
style={{
  background: `linear-gradient(180deg,
    hsl(var(--beige-100)) 0%,
    hsl(var(--beige-200)) 100%)`
}}
```

### Gradiente Medio (Footer, áreas destacadas)
```tsx
style={{
  background: `linear-gradient(135deg,
    hsl(var(--beige-500)) 0%,
    hsl(var(--beige-400)) 50%,
    hsl(var(--beige-500)) 100%)`
}}
```

### Gradiente Radial (Hero sections)
```tsx
style={{
  background: `radial-gradient(ellipse at center,
    hsl(var(--beige-50)) 0%,
    hsl(var(--beige-200)) 100%)`
}}
```

## Guía de Combinaciones

### ✅ Buenas Combinaciones

- **Header:** beige-100
- **Body/Main:** beige-50 o beige-100 (alternando con beige-200)
- **Cards:** beige-300 (sobre fondo beige-100 o beige-200)
- **Footer:** beige-500 con gradiente
- **Bordes:** beige-400 o beige-600
- **Hover:** Un tono más oscuro que el fondo base

### ❌ Evitar

- Saltos de más de 2-3 tonos entre secciones adyacentes (se ve desconectado)
- Usar el mismo tono para todo (pierde profundidad)
- Usar beige-700 como fondo principal (demasiado oscuro)

## Accesibilidad

Todos los tonos beige mantienen buen contraste con:
- **Texto principal:** `--foreground` (Midnight Navy)
- **Texto primario:** `--primary` (Rich Burgundy)
- **Texto secundario:** `--muted-foreground`

Contraste mínimo WCAG AA garantizado para texto sobre cualquier tono beige.

## Uso en Tailwind

Puedes usar estas clases directamente:

```tsx
// Como utilidad
className="bg-[hsl(var(--beige-300))]"

// O en style inline
style={{ backgroundColor: "hsl(var(--beige-400))" }}
```

## Resumen Visual

```
┌─────────────────────────────────────┐
│  beige-50  - Casi blanco            │  Más claro
│  beige-100 - Ivory (Header) ✨      │     ↑
│  beige-200 - Muy claro              │     │
│  beige-300 - Claro                  │     │
│  beige-400 - Medio-claro            │     │
│  beige-500 - Medio (Footer) 🎨      │     │
│  beige-600 - Medio-fuerte           │     │
│  beige-700 - Fuerte                 │     ↓
└─────────────────────────────────────┘  Más oscuro
```
