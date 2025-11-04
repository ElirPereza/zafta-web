# Lust Font - Fuente Principal de Zafta

## 📋 Descripción

**Lust** es la fuente principal del BrandBook de Zafta.

- **Tipo:** Tipografía con alto contraste
- **Uso:** Ideal para títulos
- **Características:** Gran presencia visual, elegante, sofisticada
- **Variantes requeridas:** Fine Display Regular Italic

## 📥 Instrucciones de Instalación

### Archivos Necesarios

Coloca los siguientes archivos de la fuente Lust en esta carpeta:

```
public/fonts/lust/
├── lust-regular-italic.woff2          (peso 400, italic)
├── lust-display-regular-italic.woff2  (peso 600, italic)
└── README.md                          (este archivo)
```

### Formatos Recomendados

- **WOFF2** (prioridad) - Mejor compresión y soporte moderno
- **WOFF** (fallback) - Soporte navegadores antiguos
- **TTF/OTF** (opcional) - Si WOFF2 no está disponible

## 🔧 Configuración Actual

La fuente está configurada en `src/app/layout.tsx`:

```typescript
const lust = localFont({
  src: [
    {
      path: "../../public/fonts/lust/lust-regular-italic.woff2",
      weight: "400",
      style: "italic",
    },
    {
      path: "../../public/fonts/lust/lust-display-regular-italic.woff2",
      weight: "600",
      style: "italic",
    },
  ],
  variable: "--font-lust",
  display: "swap",
  fallback: ["Didot", "Bodoni MT", "Playfair Display", "serif"],
});
```

## 🎯 Fallbacks Configurados

Si Lust no está disponible, se usarán en orden:

1. **Didot** - Fuente serif elegante similar
2. **Bodoni MT** - Alto contraste, similar a Lust
3. **Playfair Display** - Disponible en Google Fonts
4. **serif** - Genérica del sistema

## ⚠️ Licencia

**IMPORTANTE:** Lust es una fuente comercial. Asegúrate de tener la licencia apropiada para uso web.

- No incluir archivos de fuente sin licencia válida
- Verificar términos de uso para web embedding
- Contactar al proveedor de la fuente si es necesario

## 🔗 Dónde Obtener Lust

La fuente Lust puede obtenerse de:
- Foundry original de la tipografía
- Licencias comerciales de fuentes
- Proveedor autorizado del cliente

## ✅ Verificación

Una vez agregados los archivos de fuente:

```bash
# Verificar que los archivos existen
ls public/fonts/lust/

# Debería mostrar:
# lust-regular-italic.woff2
# lust-display-regular-italic.woff2
# README.md
```

## 🚀 Testing

Para probar que la fuente se carga correctamente:

1. Inicia el servidor de desarrollo: `bun dev`
2. Abre DevTools → Network
3. Busca las fuentes `lust-*.woff2`
4. Verifica que se cargan con status 200

## 📝 Notas

- Si los archivos de fuente no están disponibles, los fallbacks se activarán automáticamente
- El rendimiento es óptimo con WOFF2
- Las fuentes se cargan con `display: swap` para mejor rendimiento
