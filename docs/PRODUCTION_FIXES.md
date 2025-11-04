# 🔧 Fixes para Producción

## Problemas Identificados en Vercel

### 1. ⚠️ Clerk con Development Keys

**Error:**
```
Clerk: Clerk has been loaded with development keys.
Development instances have strict usage limits.
```

**Causa:** Estás usando las keys de desarrollo (`pk_test_*` y `sk_test_*`) en producción.

**Solución:**

#### Paso 1: Obtener Production Keys de Clerk

1. Ve a: https://dashboard.clerk.com
2. Selecciona tu aplicación
3. En el menú lateral: **API Keys**
4. Cambiar de "Development" a **"Production"** (switch arriba)
5. Copiar las nuevas keys:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` (empieza con `pk_live_*`)
   - `CLERK_SECRET_KEY` (empieza con `sk_live_*`)

#### Paso 2: Actualizar en Vercel

1. Ve a: https://vercel.com/dashboard
2. Tu proyecto → **Settings** → **Environment Variables**
3. **Busca y EDITA** estas 2 variables (no agregues nuevas):

   **Variable 1:**
   ```
   Key: NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
   Nuevo Value: pk_live_XXXXXXXXX (tu key de production)
   Environment: Production
   ```

   **Variable 2:**
   ```
   Key: CLERK_SECRET_KEY
   Nuevo Value: sk_live_XXXXXXXXX (tu key de production)
   Environment: Production
   ```

4. Mantén las keys de `test_*` para Preview y Development

#### Paso 3: Actualizar Webhook de Clerk

1. Dashboard Clerk → **Webhooks**
2. Editar tu webhook existente
3. Asegúrate que la URL sea: `https://zafta-web1.vercel.app/api/webhooks/clerk`
4. Copia el nuevo **Signing Secret** (puede cambiar con production keys)
5. Actualizar en Vercel:
   ```
   Key: CLERK_WEBHOOK_SECRET
   Value: whsec_XXXXXXXXX (nuevo secret)
   Environment: Production
   ```

#### Paso 4: Redeploy

Vercel → **Deployments** → Último deployment → **⋯** → **Redeploy**

---

### 2. ⚠️ Prop Deprecado: afterSignInUrl

**Error:**
```
The prop "afterSignInUrl" is deprecated and should be replaced
with "fallbackRedirectUrl" or "forceRedirectUrl"
```

**Causa:** Clerk ha deprecado ciertas props de redirección.

**Solución:** Ya está solucionado en el código. Si persiste, agregar explícitamente:

```tsx
// En sign-in page
<SignIn
  fallbackRedirectUrl="/inicio"
  signUpUrl="/auth/sign-up"
/>

// En sign-up page
<SignUp
  fallbackRedirectUrl="/inicio"
  signInUrl="/auth/sign-in"
/>
```

Voy a aplicar este fix ahora.

---

### 3. ❌ Imágenes 404 de Unsplash

**Error:**
```
Failed to load resource: the server responded with a status of 404
photo-1588195538326-c5b1e5b80c7f
photo-1588195538326-c5aeb790a8c3
```

**Causa:** Esos IDs de imagen no existen en Unsplash.

**Solución:** Reemplazar con IDs válidos de imágenes de tortas.

**URLs válidas para tortas:**
```
https://images.unsplash.com/photo-1578985545062-69928b1d9587  ✅ Torta de chocolate
https://images.unsplash.com/photo-1464349095431-e9a21285b5f3  ✅ Torta de cumpleaños
https://images.unsplash.com/photo-1621303837174-89787a7d4729  ✅ Torta de limón
https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e  ✅ Pastel con fresas
https://images.unsplash.com/photo-1576618148400-f54bed99fcfd  ✅ Cupcakes
https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62  ✅ Torta con flores
```

Voy a corregir los archivos afectados ahora.

---

## ✅ Checklist de Producción

- [ ] **Clerk Production Keys** configuradas en Vercel
- [ ] **Webhook de Clerk** actualizado con URL de producción
- [ ] **Wompi** configurado (ver `WOMPI_VERCEL_SETUP.md`)
- [ ] **Database** conectada (Supabase/PostgreSQL)
- [ ] **Supabase Storage** configurado
- [ ] **Imágenes** cargando correctamente
- [ ] **No hay errores** en consola de producción
- [ ] **SEO** verificado (sitemap, robots.txt)

---

## 🧪 Verificación Post-Deployment

Después de aplicar los fixes:

1. **Abrir:** https://zafta-web1.vercel.app
2. **DevTools (F12)** → Console
3. **Verificar:**
   - ✅ Sin errores de Clerk development keys
   - ✅ Sin errores 404 de imágenes
   - ✅ Sin warnings de props deprecados

4. **Probar funcionalidad:**
   - [ ] Sign in/Sign up funciona
   - [ ] Productos se cargan
   - [ ] Carrito funciona
   - [ ] Checkout procesa
   - [ ] Admin panel accesible

---

## 📊 Diferencia Development vs Production

| Aspecto | Development | Production |
|---------|------------|-----------|
| Clerk Keys | `pk_test_*`, `sk_test_*` | `pk_live_*`, `sk_live_*` |
| Wompi Keys | `pub_test_*`, `test_*` | `pub_prod_*`, `prod_*` |
| Límites | Muy limitado | Sin límites |
| Webhooks | Requiere ngrok | Directo |
| Pagos | Tarjetas de prueba | Pagos reales |

---

## 🚨 Importante

**NUNCA uses keys de PRODUCTION en desarrollo local.**
Mantén siempre:
- Local (`.env`): Development keys
- Vercel Preview: Development keys
- Vercel Production: Production keys

---

## 📞 Soporte

**Clerk:**
- Dashboard: https://dashboard.clerk.com
- Docs: https://clerk.com/docs
- Support: support@clerk.com

**Unsplash:**
- Buscar imágenes: https://unsplash.com/s/photos/cake
- API Docs: https://unsplash.com/documentation
