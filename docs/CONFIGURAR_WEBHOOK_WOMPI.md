# 🔗 Configurar Webhook de Wompi con ngrok

## ¿Qué es el Webhook?

El webhook permite que Wompi le avise a tu servidor cuando:
- ✅ Un pago fue aprobado
- ❌ Un pago fue rechazado
- 🔄 El estado de una transacción cambió

**IMPORTANTE:** Wompi necesita una URL pública. Como tu servidor está en `localhost`, necesitas **ngrok** para crear un túnel público.

---

## 📥 Opción 1: Usar ngrok (Gratis y Fácil)

### Paso 1: Instalar ngrok

#### Windows (con Chocolatey):
```bash
choco install ngrok
```

#### O descarga directamente:
1. Ve a: https://ngrok.com/download
2. Descarga ngrok para Windows
3. Descomprime el .zip
4. Mueve `ngrok.exe` a una carpeta en tu PATH

### Paso 2: Crear cuenta en ngrok (Gratis)

1. Ve a: https://dashboard.ngrok.com/signup
2. Regístrate (gratis)
3. Copia tu **Authtoken**

### Paso 3: Autenticar ngrok

```bash
ngrok config add-authtoken TU_AUTHTOKEN_AQUI
```

### Paso 4: Crear túnel a tu servidor

Abre una **nueva terminal** y ejecuta:

```bash
# Tu servidor está en puerto 3001
ngrok http 3001
```

Verás algo así:
```
Session Status                online
Account                       Tu Nombre (Plan: Free)
Forwarding                    https://abc123.ngrok-free.app -> http://localhost:3001
```

**🎯 Copia esta URL:** `https://abc123.ngrok-free.app`

---

## 🔧 Paso 5: Configurar Webhook en Wompi

### En el Dashboard de Wompi:

1. **Ve a:** Configuración > Webhooks (o Events)
2. **URL del Webhook:** Pega tu URL de ngrok + la ruta:
   ```
   https://abc123.ngrok-free.app/api/webhooks/wompi
   ```
3. **Evento:** Selecciona `transaction.updated`
4. **Guardar**

---

## ✅ Paso 6: Verificar que Funciona

### Test Manual:

1. **Mantén ngrok corriendo** en una terminal
2. **Mantén bun dev corriendo** en otra terminal
3. **Haz una compra de prueba** con tarjeta 4242 4242 4242 4242
4. **Revisa los logs** en la terminal de `bun dev`

Deberías ver:
```
Order ZAFTA-2024-XXXX updated: PAID
```

---

## 📋 Opción 2: Dejar el Webhook para Después

Si no quieres configurar ngrok ahora:

### En Wompi:
- **Deja el campo de Webhook vacío** por ahora
- **O pon:** `https://example.com/api/webhooks/wompi`

### Consecuencia:
- ⚠️ Los pedidos NO se actualizarán automáticamente a "PAID"
- 📝 Tendrás que actualizar manualmente en el admin
- ✅ Los pagos SÍ funcionarán, solo no recibirás la confirmación automática

### Para Producción:
Cuando subas tu sitio a un dominio real:
```
https://tu-dominio.com/api/webhooks/wompi
```

---

## 🎯 Resumen Rápido

### Con ngrok (Recomendado):
```bash
# Terminal 1
bun dev

# Terminal 2
ngrok http 3001

# Copia la URL de ngrok: https://abc123.ngrok-free.app
# Pégala en Wompi: https://abc123.ngrok-free.app/api/webhooks/wompi
```

### Sin ngrok (Temporal):
```bash
# En Wompi, deja el webhook vacío
# Los pagos funcionarán pero no se actualizarán automáticamente
# Actualiza manualmente en /admin/pedidos
```

---

## 🆘 Problemas Comunes

### ngrok dice "command not found"
```bash
# Instala con Chocolatey
choco install ngrok

# O descarga de: https://ngrok.com/download
```

### Webhook devuelve 401 Unauthorized
- Verifica que `WOMPI_EVENTS_SECRET` esté correcto en `.env`
- Reinicia `bun dev` después de cambiar `.env`

### ngrok se desconecta
- La versión gratis se desconecta cada 2 horas
- Solo vuelve a ejecutar `ngrok http 3001`
- Actualiza la URL en Wompi

---

## 🚀 Para Producción

Cuando tu sitio esté en un dominio real (ej: zafta.com):

1. **Webhook URL:**
   ```
   https://zafta.com/api/webhooks/wompi
   ```

2. **Ya NO necesitas ngrok** (solo es para desarrollo local)

3. **Verifica que HTTPS esté activo** (Wompi requiere HTTPS)

---

## 📞 Ayuda

Si tienes problemas:
1. Revisa los logs de `bun dev`
2. Revisa los logs de ngrok
3. Revisa el dashboard de Wompi > Webhooks > Logs

¡Listo! 🎉
