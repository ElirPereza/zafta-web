# 📚 Documentación del Proyecto Zafta

Esta carpeta contiene toda la documentación técnica y guías del proyecto Zafta.

## 📂 Estructura de Documentación

### 🎯 Planificación y Estrategia

- **[PLAN-DE-MIGRACION.md](./PLAN-DE-MIGRACION.md)** - Plan completo de migración de Lovable a Next.js 16
  - 8 fases detalladas
  - Checklist de tareas
  - Estimaciones de tiempo
  - Métricas de éxito

- **[requirements.md](./requirements.md)** - Especificación completa del proyecto
  - Fundamentos de marca del BrandBook
  - Stack técnico
  - Design system tokens
  - Arquitectura de información
  - Checklist de migración

### 🎨 Design System y Estilos

- **[ESTILOS-COMPATIBILIDAD.md](./ESTILOS-COMPATIBILIDAD.md)** - Verificación de compatibilidad de estilos
  - Comparación pagina_components vs src/app
  - Variables CSS HSL de Zafta (100% compatible)
  - Dark mode variables
  - Custom utilities
  - Garantía de migración sin problemas

- **[FUENTES-BRANDBOOK.md](./FUENTES-BRANDBOOK.md)** - Fuentes oficiales del BrandBook
  - **Lust** - Font Principal (títulos)
  - **Fredoka** - Font Secundaria (cuerpo)
  - Configuración Next.js
  - Ejemplos de uso
  - Checklist de implementación

- **[FONTS-COMPATIBILIDAD.md](./FONTS-COMPATIBILIDAD.md)** - Compatibilidad de fuentes
  - Estrategia de doble sistema
  - Optimización con next/font
  - Fallbacks inteligentes
  - Pruebas de compatibilidad

## 🚀 Comenzando

### Para Desarrolladores Nuevos

1. Lee **[requirements.md](./requirements.md)** para entender el proyecto
2. Revisa **[PLAN-DE-MIGRACION.md](./PLAN-DE-MIGRACION.md)** para ver el roadmap
3. Consulta **[FUENTES-BRANDBOOK.md](./FUENTES-BRANDBOOK.md)** para configurar las fuentes
4. Verifica **[ESTILOS-COMPATIBILIDAD.md](./ESTILOS-COMPATIBILIDAD.md)** antes de migrar componentes

### Para Claude Code / IA

Lee **[../CLAUDE.md](../CLAUDE.md)** en la raíz del proyecto para:
- Comandos de desarrollo
- Stack tecnológico
- Arquitectura del proyecto
- Reglas de desarrollo
- Uso de agentes especializados

## 📋 Guías Rápidas

### Colores del Brand
```css
--rose-gold: #E5B097
--burgundy: #80011F
--midnight: #111C3B
--ivory: #FFFBEF
```

### Fuentes
```
Títulos:   Lust (serif principal)
Cuerpo:    Fredoka (sans secundaria)
```

### Comandos Útiles
```bash
bun dev           # Desarrollo
bun run build     # Build producción
bun run lint      # Linter con Biome
bun run format    # Formatear código
```

## 🔗 Enlaces Importantes

- [BrandBook de Zafta](./requirements.md#1-fundamentos-de-marca-resumen-ejecutivo) - Fundamentos de marca
- [Design System](./requirements.md#3-design-system-tokens-y-tipografía) - Tokens y configuración
- [Arquitectura](./PLAN-DE-MIGRACION.md#estructura-de-carpetas) - Estructura de carpetas

## 📝 Notas

- Toda la documentación está en español
- Mantener actualizada según cambios del proyecto
- Usar formato Markdown con sintaxis GitHub Flavored
- Incluir emojis solo donde sea necesario para claridad

---

**Última actualización:** Fase 1 completada - Fundamentos y configuración ✅
