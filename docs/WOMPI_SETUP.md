# 🎯 Configuración de Wompi Payment Gateway

Esta guía te ayudará a configurar Wompi para aceptar pagos en línea en tu tienda de ZAFTA.

## 📋 Requisitos Previos

- Cuenta en Wompi (https://comercios.wompi.co)
- Cuenta bancaria en Colombia para recibir pagos
- Variables de entorno configuradas

---

## 🔑 Paso 1: Obtener Credenciales de Wompi

### 1.1 Registrarse en Wompi

1. Ve a https://comercios.wompi.co
2. Crea una cuenta comercial
3. Completa el proceso de verificación (KYC)

### 1.2 Obtener API Keys

Una vez aprobada tu cuenta, ve al Dashboard y obtén:

**Para Testing (Sandbox):**
- Public Key: `pub_test_X0zDA9xoKdePzhd8a0x9HAez7HgGO2fH`
- Integrity Secret: `test_integrity_[TU_SECRET]`
- Events Secret: `test_events_[TU_SECRET]`

**Para Producción:**
- Public Key: `pub_prod_[TU_KEY]`
- Integrity Secret: `prod_integrity_[TU_SECRET]`
- Events Secret: `prod_events_[TU_SECRET]`

---

## ⚙️ Paso 2: Configurar Variables de Entorno

Agrega las siguientes variables a tu archivo `.env`:

```env
# WOMPI PAYMENT GATEWAY
# Para testing, usa las credenciales de sandbox
NEXT_PUBLIC_WOMPI_PUBLIC_KEY=pub_test_X0zDA9xoKdePzhd8a0x9HAez7HgGO2fH
WOMPI_PRIVATE_KEY=test_private_[TU_KEY]
WOMPI_INTEGRITY_SECRET=test_integrity_[TU_SECRET]
WOMPI_EVENTS_SECRET=test_events_[TU_SECRET]

# URL de tu aplicación (necesaria para redirects)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### ⚠️ IMPORTANTE

- **NUNCA** subas tu archivo `.env` a Git
- Las keys de **Sandbox** (test) solo funcionan en modo desarrollo
- Para **Producción**, reemplaza con las keys prod_*

---

## 🔗 Paso 3: Configurar Webhook en Wompi

Los webhooks permiten a Wompi notificar a tu servidor cuando una transacción cambia de estado.

### 3.1 URL del Webhook

Tu URL de webhook es:
```
https://TU_DOMINIO.com/api/webhooks/wompi
```

**Para desarrollo local** (usar ngrok):
```
https://tu-subdominio.ngrok.io/api/webhooks/wompi
```

### 3.2 Configurar en Dashboard de Wompi

1. Ve a: https://comercios.wompi.co/dashboard/events
2. Click en "Agregar Evento"
3. Pega tu URL de webhook
4. Selecciona el evento: `transaction.updated`
5. Guarda

### 3.3 Verificar Webhook

Wompi enviará un evento de prueba. Verifica en los logs que se recibió correctamente:

```bash
bun dev
# Revisa la consola para ver: "Order {ORDER_NUMBER} updated: {STATUS}"
```

---

## 🧪 Paso 4: Probar con Credenciales de Sandbox

### Tarjetas de Prueba

**Transacción Aprobada:**
```
Número: 4242 4242 4242 4242
Fecha: Cualquier fecha futura
CVV: Cualquier 3 dígitos
```

**Transacción Rechazada:**
```
Número: 4111 1111 1111 1111
Fecha: Cualquier fecha futura
CVV: Cualquier 3 dígitos
```

### Nequi de Prueba

**Aprobado:** `3991111111`
**Rechazado:** `3992222222`

### PSE de Prueba

**Banco Aprobado:** Código `1`
**Banco Rechazado:** Código `2`

---

## 🚀 Paso 5: Flujo Completo de Prueba

### 5.1 Crear un Pedido

1. Ve a http://localhost:3000/productos
2. Agrega productos al carrito
3. Click en "Proceder al Pago"
4. Llena el formulario de checkout
5. Selecciona "Pago en Línea (Wompi)"
6. Click en "Ir a Pagar"

### 5.2 Completar el Pago

1. Se abrirá el widget de Wompi
2. Usa una tarjeta de prueba: `4242 4242 4242 4242`
3. Completa el formulario
4. Confirma el pago

### 5.3 Verificar Estado

1. Deberías ser redirigido a la página de confirmación
2. Ve al admin: http://localhost:3000/admin/pedidos
3. Verifica que el pedido aparezca como "CONFIRMADO"
4. El paymentStatus debe ser "PAID"

---

## 🔍 Paso 6: Debugging

### Ver Transacciones en Wompi

1. Ve a: https://comercios.wompi.co/dashboard/transactions
2. Verifica que la transacción aparezca
3. Click para ver detalles

### Verificar Webhooks Recibidos

En tu consola de desarrollo deberías ver:
```
Order ZAFTA-2024-XXXX updated: PAID
```

### Problemas Comunes

**Error: "Invalid signature"**
- Verifica que `WOMPI_INTEGRITY_SECRET` sea correcto
- Asegúrate de usar el secret correcto (test vs prod)

**Webhook no se recibe:**
- Verifica que la URL sea accesible públicamente
- Usa ngrok para desarrollo local
- Revisa que la ruta sea `/api/webhooks/wompi`

**Transacción queda en PENDING:**
- Revisa que el webhook esté configurado
- Verifica los logs del webhook handler
- Asegúrate de que `WOMPI_EVENTS_SECRET` sea correcto

---

## 🎯 Paso 7: Ir a Producción

### Checklist

- [ ] Cambiar todas las keys de `test_*` a `prod_*`
- [ ] Configurar webhook con URL de producción
- [ ] Probar una transacción real pequeña
- [ ] Verificar que lleguen los fondos a tu cuenta bancaria
- [ ] Configurar notificaciones de email (opcional)
- [ ] Habilitar SSL/HTTPS en tu dominio

### Variables de Producción

```env
NEXT_PUBLIC_WOMPI_PUBLIC_KEY=pub_prod_[TU_KEY_REAL]
WOMPI_PRIVATE_KEY=prod_private_[TU_KEY_REAL]
WOMPI_INTEGRITY_SECRET=prod_integrity_[TU_SECRET_REAL]
WOMPI_EVENTS_SECRET=prod_events_[TU_SECRET_REAL]
NEXT_PUBLIC_APP_URL=https://tu-dominio.com
```

---

## 📊 Comisiones de Wompi

Verifica las comisiones actuales en https://wompi.com/co/pricing

**Típicamente:**
- Tarjetas de crédito: ~2.99% + COP $900
- PSE: ~2.49% + COP $900
- Nequi/Daviplata: Variables

---

## 🆘 Soporte

**Documentación Oficial:**
- https://docs.wompi.co

**Soporte Wompi:**
- Email: soporte@wompi.co
- Chat: Disponible en el dashboard

**Errores en el Código:**
- Revisa los logs de Next.js
- Verifica la consola del navegador
- Usa `console.log` en los componentes para debug

---

## ✅ Resumen

1. ✅ Registrarse en Wompi
2. ✅ Obtener credenciales (test y prod)
3. ✅ Configurar `.env`
4. ✅ Configurar webhook
5. ✅ Probar con tarjetas de prueba
6. ✅ Verificar en admin panel
7. ✅ Ir a producción con keys reales

**¡Listo para recibir pagos!** 🎉

