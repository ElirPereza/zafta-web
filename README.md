# 🍰 Zafta - Tortas Artesanales

> Más que un postre, un legado auténtico.

Sitio web oficial de Zafta, pastelería artesanal con más de 30 años de tradición familiar.

## 🚀 Inicio Rápido

### Desarrollo

```bash
# Instalar dependencias
bun install

# Iniciar servidor de desarrollo
bun dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

### Build de Producción

```bash
# Crear build optimizado
bun run build

# Iniciar servidor de producción
bun start
```

### Code Quality

```bash
# Linter (Biome)
bun run lint

# Formatear código
bun run format
```

## 🛠️ Stack Tecnológico

- **Framework:** [Next.js 16](https://nextjs.org) (App Router)
- **Runtime:** React 19.2
- **Lenguaje:** TypeScript
- **Estilos:** Tailwind CSS v4
- **UI Components:** shadcn/ui
- **Fuentes:** Lust + Fredoka (BrandBook oficial)
- **Linter/Formatter:** Biome
- **Package Manager:** Bun

## 📚 Documentación

Toda la documentación del proyecto está en la carpeta [`docs/`](./docs):

- **[Plan de Migración](./docs/PLAN-DE-MIGRACION.md)** - Roadmap completo del proyecto
- **[Requirements](./docs/requirements.md)** - Especificación y BrandBook
- **[Estilos](./docs/ESTILOS-COMPATIBILIDAD.md)** - Compatibilidad de design system
- **[Fuentes](./docs/FUENTES-BRANDBOOK.md)** - Tipografía oficial (Lust + Fredoka)

### Para Desarrolladores

Lee **[CLAUDE.md](./CLAUDE.md)** para:
- Arquitectura del proyecto
- Comandos comunes
- Reglas de desarrollo
- Uso de agentes especializados

## 🎨 Design System

### Colores de Marca

```css
Rose Gold:     #E5B097
Rich Burgundy: #80011F
Midnight Navy: #111C3B
Ivory Cream:   #FFFBEF
```

### Tipografía

- **Lust** - Font principal (títulos, alto contraste)
- **Fredoka** - Font secundaria (cuerpo, UI)

## 📂 Estructura del Proyecto

```
zafta-web/
├── docs/                    # Documentación completa
├── public/                  # Assets estáticos
│   ├── fonts/lust/         # Fuente Lust (local)
│   └── zafta_assets/       # Imágenes de productos
├── src/
│   ├── app/                # Next.js App Router
│   │   ├── (site)/        # Route group - páginas públicas
│   │   ├── layout.tsx     # Root layout
│   │   └── globals.css    # Estilos globales
│   ├── components/         # Componentes React
│   │   ├── ui/            # shadcn/ui components
│   │   ├── layout/        # Navigation, Footer
│   │   └── sections/      # Hero, ProductGallery, etc.
│   └── lib/               # Utilidades
└── pagina_components/      # Referencia (Lovable/Vite)
```

## 🎯 Estado del Proyecto

### ✅ Completado

- [x] Fase 1: Fundamentos y Configuración
  - [x] Design system migrado (Tailwind v4)
  - [x] Fuentes configuradas (Lust + Fredoka)
  - [x] shadcn/ui instalado
  - [x] Estructura de carpetas creada

### 🔄 En Progreso

- [ ] Fase 2: Componentes de Layout (Navigation, Footer)
- [ ] Fase 3-5: Migración de componentes y páginas
- [ ] Fase 6: Optimizaciones Next.js
- [ ] Fase 7: Testing y QA
- [ ] Fase 8: Deploy a producción

Ver progreso completo en [PLAN-DE-MIGRACION.md](./docs/PLAN-DE-MIGRACION.md)

## 🌐 Deploy

El proyecto está optimizado para deploy en [Vercel](https://vercel.com):

```bash
# Deploy automático conectando el repositorio a Vercel
# o manualmente:
vercel
```

## 📝 Notas Importantes

- **Package Manager:** Este proyecto usa **Bun**. No usar npm/yarn/pnpm.
- **Linter:** Usa **Biome**, no ESLint/Prettier.
- **Fuentes:** Lust requiere archivos locales en `public/fonts/lust/`
- **Compatibilidad:** 100% compatible con componentes de `pagina_components/`

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📄 Licencia

Proyecto privado - Zafta © 2024

---

**Built with ❤️ using Next.js and Tailwind CSS**
