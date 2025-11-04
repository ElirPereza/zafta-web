# 🔑 Cómo Obtener Credenciales de Wompi (Sandbox)

## 📋 Paso 1: Registrarse en Wompi

1. **Ve a:** https://comercios.wompi.co
2. **Click en:** "Crear cuenta" o "Registrarse"
3. **Completa el formulario:**
   - Nombre del comercio: "ZAFTA Repostería Artesanal"
   - Email: Tu email
   - Teléfono: Tu número
   - Contraseña

4. **Verifica tu email** - Revisa tu bandeja de entrada

---

## 🔧 Paso 2: Acceder al Dashboard

1. **Inicia sesión** en https://comercios.wompi.co
2. Verás el dashboard principal

---

## 🗝️ Paso 3: Obtener API Keys

### 3.1 Navegar a Settings

1. En el menú lateral, busca **"Configuración"** o **"Settings"**
2. Click en **"API Keys"** o **"Claves de API"**

### 3.2 Copiar Credenciales de SANDBOX

Verás dos secciones:
- **SANDBOX** (Pruebas) ← Usa estas
- **PRODUCTION** (Producción) ← NO uses estas todavía

En la sección **SANDBOX**, copia:

#### A. Public Key
```
pub_test_XXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```
- Esta key es **pública** (se puede exponer en el frontend)
- Empieza con `pub_test_`

#### B. Integrity Secret
```
test_integrity_XXXXXXXXXXXXXXXXXXXXXX
```
- Esta es **secreta** (NUNCA la compartas)
- Contiene la palabra `integrity`

#### C. Events Secret
```
test_events_XXXXXXXXXXXXXXXXXXXXXXXXXXX
```
- Esta es **secreta** (NUNCA la compartas)
- Contiene la palabra `events`

---

## 📝 Paso 4: Configurar en tu Proyecto

1. **Abre tu archivo `.env`** en el proyecto
2. **Busca las líneas de Wompi** y reemplaza con tus credenciales:

```env
# WOMPI - Sandbox Credentials
NEXT_PUBLIC_WOMPI_PUBLIC_KEY=pub_test_TU_KEY_AQUI
WOMPI_INTEGRITY_SECRET=test_integrity_TU_SECRET_AQUI
WOMPI_EVENTS_SECRET=test_events_TU_SECRET_AQUI
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

3. **Guarda el archivo** (.env)

---

## ✅ Paso 5: Verificar Configuración

En tu terminal, ejecuta:

```bash
bun run scripts/verify-wompi.ts
```

Deberías ver:
```
✅ NEXT_PUBLIC_WOMPI_PUBLIC_KEY: Configurado
   ✓ Formato válido (SANDBOX)
✅ WOMPI_INTEGRITY_SECRET: Configurado
   ✓ Formato válido
✅ WOMPI_EVENTS_SECRET: Configurado
✅ NEXT_PUBLIC_APP_URL: Configurado

✅ ¡Configuración de Wompi completa!
```

---

## 🧪 Paso 6: Probar Integración

```bash
# Inicia el servidor
bun dev

# En el navegador:
# 1. http://localhost:3000/productos
# 2. Agrega productos al carrito
# 3. Procede al checkout
# 4. Selecciona "Pago en Línea (Wompi)"
# 5. Usa tarjeta de prueba: 4242 4242 4242 4242
```

---

## ⚠️ IMPORTANTE

### ❌ NO HAGAS ESTO:
- Subir el archivo `.env` a Git
- Compartir tus secrets en público
- Usar las keys de PRODUCTION para pruebas

### ✅ SÍ HACER ESTO:
- Mantener `.env` en `.gitignore`
- Usar SANDBOX para desarrollo
- Cambiar a PRODUCTION solo cuando estés listo

---

## 🆘 ¿Problemas?

### No veo "API Keys" en el Dashboard
- Asegúrate de haber verificado tu email
- Puede que necesites completar el perfil de tu comercio primero
- Contacta a soporte@wompi.co

### Las keys no funcionan
- Verifica que copiaste las keys completas (sin espacios)
- Asegúrate de usar las de SANDBOX (test_)
- Ejecuta `bun run scripts/verify-wompi.ts`

### El webhook no funciona
- Lo configuraremos después con ngrok
- Por ahora, solo necesitas las API keys

---

## 📞 Soporte Wompi

- **Email:** soporte@wompi.co
- **Documentación:** https://docs.wompi.co
- **Chat:** Disponible en el dashboard

---

## 🎉 ¡Siguiente Paso!

Una vez tengas las credenciales configuradas, ejecuta:

```bash
bun run scripts/verify-wompi.ts
```

Si todo está ✅, ¡estás listo para probar pagos!
