# 🚀 Guía de Deployment en Vercel

## 📋 Variables de Entorno Requeridas

Para que la aplicación funcione correctamente en Vercel, **debes configurar todas estas variables de entorno** en tu proyecto.

### 🔗 Configurar Variables en Vercel

1. Ve a tu proyecto en Vercel: https://vercel.com/dashboard
2. Click en tu proyecto → **Settings** → **Environment Variables**
3. Agrega las siguientes variables:

---

## 🗄️ Base de Datos (PostgreSQL)

```env
# URL de conexión a PostgreSQL
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=require

# URL directa (para Prisma)
DIRECT_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=require
```

**Dónde obtenerlas:**
- Si usas **Supabase**: Dashboard → Settings → Database → Connection String
- Si usas **Neon/Railway/otro**: Copia la URL de conexión de tu proveedor

**Ejemplo con Supabase:**
```
DATABASE_URL=postgresql://postgres.abc123:PASSWORD@aws-0-us-west-1.pooler.supabase.com:5432/postgres
```

---

## 🔐 Autenticación (Clerk)

```env
# Clerk API Keys
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_XXXXXXXXX
CLERK_SECRET_KEY=sk_test_XXXXXXXXX

# Clerk Webhook Secret (para recibir eventos de usuario)
CLERK_WEBHOOK_SECRET=whsec_XXXXXXXXX
```

**Dónde obtenerlas:**
1. Ve a: https://dashboard.clerk.com
2. Selecciona tu aplicación
3. **API Keys** → Copia las keys
4. **Webhooks** → Copia el Signing Secret

---

## 💳 Pagos (Wompi)

### Para Testing (Sandbox):
```env
NEXT_PUBLIC_WOMPI_PUBLIC_KEY=pub_test_X0zDA9xoKdePzhd8a0x9HAez7HgGO2fH
WOMPI_INTEGRITY_SECRET=test_integrity_XXXXXXXXX
WOMPI_EVENTS_SECRET=test_events_XXXXXXXXX
```

### Para Producción:
```env
NEXT_PUBLIC_WOMPI_PUBLIC_KEY=pub_prod_XXXXXXXXX
WOMPI_INTEGRITY_SECRET=prod_integrity_XXXXXXXXX
WOMPI_EVENTS_SECRET=prod_events_XXXXXXXXX
```

**Dónde obtenerlas:**
1. Ve a: https://comercios.wompi.co
2. Dashboard → **Settings** → **API Keys**
3. Copia las credenciales según el ambiente

**Documentación:** Ver `docs/WOMPI_SETUP.md`

---

## 📦 Storage (Supabase)

```env
# Supabase URL y Anon Key
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Dónde obtenerlas:**
1. Ve a: https://supabase.com/dashboard
2. Selecciona tu proyecto
3. **Settings** → **API** → Copia URL y anon key

---

## 🌐 URLs de la Aplicación

```env
# URL de tu sitio (importante para Wompi redirects)
NEXT_PUBLIC_SITE_URL=https://tu-dominio.vercel.app
NEXT_PUBLIC_APP_URL=https://tu-dominio.vercel.app
```

**Nota:** Una vez que tengas dominio personalizado, actualiza estas URLs.

---

## 📊 Resumen de Variables

| Variable | Requerida | Dónde Obtenerla | Usado Para |
|----------|-----------|-----------------|------------|
| `DATABASE_URL` | ✅ Sí | Supabase/Neon | Conexión a PostgreSQL |
| `DIRECT_URL` | ⚠️ Recomendado | Supabase/Neon | Migraciones Prisma |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | ✅ Sí | Clerk Dashboard | Autenticación |
| `CLERK_SECRET_KEY` | ✅ Sí | Clerk Dashboard | Autenticación (server) |
| `CLERK_WEBHOOK_SECRET` | ✅ Sí | Clerk Webhooks | Sincronizar usuarios |
| `NEXT_PUBLIC_WOMPI_PUBLIC_KEY` | ✅ Sí | Wompi Dashboard | Pagos (client) |
| `WOMPI_INTEGRITY_SECRET` | ✅ Sí | Wompi Dashboard | Firma transacciones |
| `WOMPI_EVENTS_SECRET` | ✅ Sí | Wompi Dashboard | Verificar webhooks |
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ Sí | Supabase | Storage imágenes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ Sí | Supabase | Storage (client) |
| `NEXT_PUBLIC_SITE_URL` | ✅ Sí | Tu dominio | URLs absolutas |
| `NEXT_PUBLIC_APP_URL` | ✅ Sí | Tu dominio | Redirects Wompi |

---

## 🔧 Configuración Paso a Paso

### Paso 1: Configurar Base de Datos

1. **Supabase (Recomendado para este proyecto):**
   ```bash
   # Ya tienes Supabase configurado, solo necesitas:
   # 1. Ir a Supabase Dashboard
   # 2. Settings → Database → Connection String
   # 3. Copiar "Transaction" connection string
   ```

2. **Agregar en Vercel:**
   - Variable: `DATABASE_URL`
   - Value: La connection string de Supabase
   - Environment: Production, Preview, Development (todas)

### Paso 2: Configurar Clerk

1. **En Clerk Dashboard:**
   - Copia `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - Copia `CLERK_SECRET_KEY`

2. **Configurar Webhook:**
   - URL: `https://tu-dominio.vercel.app/api/webhooks/clerk`
   - Eventos: `user.created`, `user.updated`
   - Copia el `Signing Secret`

3. **Agregar en Vercel:**
   - Agregar las 3 variables de Clerk

### Paso 3: Configurar Wompi

1. **Modo Testing (Sandbox):**
   - Usar las keys `pub_test_*` y `test_*`
   - Ideal para pruebas iniciales

2. **Modo Producción:**
   - Completar KYC en Wompi
   - Usar keys `pub_prod_*` y `prod_*`

3. **Configurar Webhook:**
   - URL: `https://tu-dominio.vercel.app/api/webhooks/wompi`
   - Evento: `transaction.updated`

### Paso 4: Configurar Supabase Storage

1. **En Supabase:**
   - Settings → API
   - Copiar URL y anon key

2. **Crear Bucket (si no existe):**
   ```sql
   -- En Supabase SQL Editor:
   INSERT INTO storage.buckets (id, name, public)
   VALUES ('products', 'products', true);
   ```

### Paso 5: Configurar URLs

1. **Durante desarrollo:**
   ```env
   NEXT_PUBLIC_SITE_URL=https://tu-proyecto.vercel.app
   ```

2. **Con dominio personalizado:**
   ```env
   NEXT_PUBLIC_SITE_URL=https://zafta.com
   ```

---

## 🔄 Ejecutar Migraciones de Prisma

Después de configurar las variables, necesitas ejecutar las migraciones:

1. **En Vercel, agregar Build Command personalizado:**
   ```bash
   # Settings → General → Build & Development Settings
   # Build Command:
   prisma generate && prisma migrate deploy && next build
   ```

   O si prefieres usar bun:
   ```bash
   bunx prisma generate && bunx prisma migrate deploy && bun run build
   ```

2. **Alternativamente, ejecutar manualmente:**
   ```bash
   # Desde tu terminal local:
   DATABASE_URL="tu_database_url_de_vercel" bunx prisma migrate deploy
   ```

---

## ✅ Verificar Deployment

### 1. Build Exitoso
- [ ] Build completa sin errores
- [ ] No hay warnings de variables faltantes

### 2. Funcionalidades
- [ ] Autenticación funciona (Sign in/Sign up)
- [ ] Productos se cargan correctamente
- [ ] Carrito funciona
- [ ] Checkout procesa órdenes
- [ ] Pagos con Wompi funcionan
- [ ] Admin panel accesible (con rol admin)

### 3. Webhooks
- [ ] Webhook de Clerk recibe eventos
- [ ] Webhook de Wompi actualiza órdenes

---

## 🐛 Troubleshooting

### Error: "PrismaClientInitializationError"
**Causa:** `DATABASE_URL` no configurada o incorrecta
**Solución:** Verificar que la variable esté en Vercel y sea válida

### Error: "Clerk: Missing publishableKey"
**Causa:** Variables de Clerk no configuradas
**Solución:** Agregar `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` en Vercel

### Error: "Failed to load Wompi widget"
**Causa:** `NEXT_PUBLIC_WOMPI_PUBLIC_KEY` incorrecta
**Solución:** Verificar key en dashboard de Wompi

### Webhooks no llegan
**Causa:** URL incorrecta o secrets mal configurados
**Solución:**
1. Verificar URL en dashboard del proveedor
2. Verificar que los secrets coincidan
3. Revisar logs en Vercel → Deployments → Function Logs

### Imágenes no cargan
**Causa:** Supabase storage no configurado
**Solución:**
1. Verificar `NEXT_PUBLIC_SUPABASE_URL` y `ANON_KEY`
2. Verificar que el bucket `products` existe y es público

---

## 🎯 Checklist Final Pre-Producción

- [ ] Todas las variables de entorno configuradas
- [ ] Build exitoso en Vercel
- [ ] Base de datos migrada
- [ ] Productos de prueba creados
- [ ] Autenticación funcionando
- [ ] Pagos en modo sandbox testeados
- [ ] Admin panel accesible
- [ ] Webhooks configurados y funcionando
- [ ] Dominio personalizado configurado (opcional)
- [ ] SSL/HTTPS habilitado (automático en Vercel)

---

## 🚀 Ir a Producción con Wompi

Una vez todo funcione en sandbox:

1. **Completar KYC en Wompi**
2. **Actualizar variables de entorno:**
   - Cambiar de `pub_test_*` a `pub_prod_*`
   - Cambiar de `test_*` a `prod_*`
3. **Actualizar webhook URL** en dashboard de Wompi
4. **Realizar transacción de prueba pequeña**
5. **Verificar recepción de fondos**

---

## 📞 Soporte

**Vercel:**
- Docs: https://vercel.com/docs
- Support: https://vercel.com/support

**Prisma:**
- Docs: https://www.prisma.io/docs

**Clerk:**
- Docs: https://clerk.com/docs
- Support: support@clerk.com

**Wompi:**
- Docs: https://docs.wompi.co
- Support: soporte@wompi.co

**Supabase:**
- Docs: https://supabase.com/docs
- Support: https://supabase.com/support
