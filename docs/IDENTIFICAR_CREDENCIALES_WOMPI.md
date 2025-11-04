# 🔍 Identificar Credenciales en el Dashboard de Wompi

## 📍 Ubicación: Dónde Encontrar las Credenciales

### Paso 1: Entrar al Dashboard
1. Ve a: https://comercios.wompi.co
2. Inicia sesión
3. Estarás en el dashboard principal

### Paso 2: Ir a Settings (Configuración)
- Busca en el menú lateral: **"Configuración"** o **"Settings"**
- Dentro de Settings, busca: **"API Keys"** o **"Claves de API"**

---

## 🔑 Identificar Cada Credencial

Verás **DOS SECCIONES**:

### 🧪 SANDBOX (Pruebas) ← USA ESTA
Para desarrollo y pruebas

### 🚀 PRODUCTION (Producción) ← NO USES ESTA TODAVÍA
Para pagos reales

---

## 📋 En la Sección SANDBOX, Verás:

### 1️⃣ **Public Key** (Llave Pública)
```
Nombre en Wompi: "Public Key" o "Llave Pública"
Formato: pub_test_XXXXXXXXXXXXXXXXXXXX
Ejemplo: pub_test_X0zDA9xoKdePzhd8a0x9HAez7HgGO2fH

✅ Esta SÍ se puede exponer
📋 Copiar a: NEXT_PUBLIC_WOMPI_PUBLIC_KEY
```

### 2️⃣ **Private Key** (Llave Privada)
```
Nombre en Wompi: "Private Key" o "Llave Privada" o "Secret Key"
Formato: prv_test_XXXXXXXXXXXXXXXXXXXX
Ejemplo: prv_test_abcdefghijklmnopqrstuvwxyz123456

⚠️ NUNCA exponerla públicamente
📋 Copiar a: WOMPI_PRIVATE_KEY
```

### 3️⃣ **Integrity Secret** (Secreto de Integridad)
```
Nombre en Wompi: "Integrity Secret" o "Production Integrity"
Formato: test_integrity_XXXXXXXXXXXXXXXXXXXX
Ejemplo: test_integrity_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6

⚠️ NUNCA exponerlo públicamente
📋 Copiar a: WOMPI_INTEGRITY_SECRET
```

### 4️⃣ **Events Secret** (Secreto de Eventos)
```
Nombre en Wompi: "Events Secret" o "Webhook Secret"
Formato: test_events_XXXXXXXXXXXXXXXXXXXX
Ejemplo: test_events_z9y8x7w6v5u4t3s2r1q0p9o8n7m6l5k4

⚠️ NUNCA exponerlo públicamente
📋 Copiar a: WOMPI_EVENTS_SECRET
```

---

## 📝 Checklist: ¿Qué Copiar?

Marca lo que YA copiaste a tu `.env`:

```
[ ] NEXT_PUBLIC_WOMPI_PUBLIC_KEY=pub_test_XXXX
[ ] WOMPI_PRIVATE_KEY=prv_test_XXXX
[ ] WOMPI_INTEGRITY_SECRET=test_integrity_XXXX
[ ] WOMPI_EVENTS_SECRET=test_events_XXXX
```

---

## 🎯 Formato Correcto en .env

Tu archivo `.env` debe tener:

```env
# ============================================================================
# WOMPI - SANDBOX
# ============================================================================

# 1. Public Key (empieza con pub_test_)
NEXT_PUBLIC_WOMPI_PUBLIC_KEY=pub_test_TU_KEY_REAL_AQUI

# 2. Private Key (empieza con prv_test_)
WOMPI_PRIVATE_KEY=prv_test_TU_KEY_REAL_AQUI

# 3. Integrity Secret (contiene integrity)
WOMPI_INTEGRITY_SECRET=test_integrity_TU_SECRET_REAL_AQUI

# 4. Events Secret (contiene events)
WOMPI_EVENTS_SECRET=test_events_TU_SECRET_REAL_AQUI

# URL de tu app
NEXT_PUBLIC_APP_URL=http://localhost:3001
```

---

## ⚠️ IMPORTANTE: Sin Espacios

Al copiar, asegúrate de:
- ❌ NO dejar espacios antes o después del `=`
- ❌ NO copiar espacios al inicio o final de la key
- ✅ Copiar TODA la key completa
- ✅ Sin comillas

### ❌ MAL:
```env
NEXT_PUBLIC_WOMPI_PUBLIC_KEY = pub_test_XXXX
WOMPI_PRIVATE_KEY="prv_test_XXXX"
```

### ✅ BIEN:
```env
NEXT_PUBLIC_WOMPI_PUBLIC_KEY=pub_test_XXXX
WOMPI_PRIVATE_KEY=prv_test_XXXX
```

---

## 🔍 ¿No Encuentras Alguna?

### Si solo ves 2 keys (Public y Private):
Los secrets pueden estar en otra sección:
- Busca: **"Production Keys"** o **"Secrets"**
- Busca: **"Webhooks"** o **"Events"**

### Si dice "Production" en lugar de "test":
Algunas versiones de Wompi muestran:
- `prod_integrity_XXXX` en lugar de `test_integrity_XXXX`
- Úsalo igual, funciona para sandbox

### Si no ves "Events Secret":
- Ve a la sección de **Webhooks**
- Ahí debería estar el Events Secret

---

## ✅ Verificar

Una vez que copies todas, ejecuta:

```bash
bun run scripts/verify-wompi.ts
```

Debe mostrar:
```
✅ NEXT_PUBLIC_WOMPI_PUBLIC_KEY: Configurado
✅ WOMPI_PRIVATE_KEY: Configurado
✅ WOMPI_INTEGRITY_SECRET: Configurado
✅ WOMPI_EVENTS_SECRET: Configurado

✅ ¡Configuración de Wompi completa!
```

---

## 🆘 Si Algo No Funciona

### Error: "NO configurado"
- Verifica que copiaste la key completa
- Revisa que no haya espacios extra
- Asegúrate de que `.env` está guardado

### Error: "Formato inválido"
- Public key DEBE empezar con `pub_test_` o `pub_prod_`
- Verifica que no cortaste la key al copiar

### No puedo encontrar una credencial
- Toma un screenshot del dashboard de Wompi
- Muéstramelo y te ayudo a identificar cada una

---

## 📞 Ayuda Rápida

**¿Tienes dudas?** Dime:
1. ¿Qué ves en tu dashboard de Wompi?
2. ¿Cuántas "keys" o "secrets" ves?
3. ¿Qué nombres tienen?

¡Te ayudo a identificar cada una! 🚀
