# 🚀 Configuración Rápida de Wompi en Vercel

## ✅ Checklist de Configuración

### 1️⃣ Credenciales para Testing (Sandbox)

Usa estas credenciales de prueba de Wompi:

```env
NEXT_PUBLIC_WOMPI_PUBLIC_KEY=pub_test_X0zDA9xoKdePzhd8a0x9HAez7HgGO2fH
WOMPI_INTEGRITY_SECRET=test_integrity_nXDD03zDsZ6JyDArkCay6eIUJ8c5hJPL
WOMPI_EVENTS_SECRET=test_events_fgK8e6XJEiHs7pNtp4BDZsPJyBbt7gyJ
NEXT_PUBLIC_APP_URL=https://zafta-web1.vercel.app
```

---

## 🔧 Configurar en Vercel (5 minutos)

### Paso 1: Ir a Environment Variables

1. Abre: https://vercel.com/dashboard
2. Selecciona tu proyecto "zafta-web1"
3. Click en **Settings** (menú superior)
4. En el menú lateral: **Environment Variables**

### Paso 2: Agregar Variables

Click en **"Add New"** y agrega cada una:

#### Variable 1 - Public Key
```
Key: NEXT_PUBLIC_WOMPI_PUBLIC_KEY
Value: pub_test_X0zDA9xoKdePzhd8a0x9HAez7HgGO2fH
Environments: ✓ Production ✓ Preview ✓ Development
```
Click **Save**

#### Variable 2 - Integrity Secret
```
Key: WOMPI_INTEGRITY_SECRET
Value: test_integrity_nXDD03zDsZ6JyDArkCay6eIUJ8c5hJPL
Environments: ✓ Production ✓ Preview ✓ Development
```
Click **Save**

#### Variable 3 - Events Secret
```
Key: WOMPI_EVENTS_SECRET
Value: test_events_fgK8e6XJEiHs7pNtp4BDZsPJyBbt7gyJ
Environments: ✓ Production ✓ Preview ✓ Development
```
Click **Save**

#### Variable 4 - App URL
```
Key: NEXT_PUBLIC_APP_URL
Value: https://zafta-web1.vercel.app
Environments: ✓ Production ✓ Preview ✓ Development
```
Click **Save**

### Paso 3: Redeploy

1. Ve a la pestaña **Deployments**
2. En el deployment más reciente, click **⋯** (tres puntos)
3. Click **Redeploy**
4. Espera 1-2 minutos

---

## 🧪 Probar Wompi

### Test Rápido (2 minutos)

1. **Ir a:** https://zafta-web1.vercel.app/productos

2. **Agregar producto al carrito** → Click "Agregar"

3. **Ir al carrito** → Click en ícono del carrito (arriba derecha)

4. **Checkout** → Click "Proceder al Pago"

5. **Llenar formulario:**
   ```
   Nombre: Juan Pérez
   Email: test@example.com
   Teléfono: 3001234567
   Dirección: Calle 123 #45-67
   Ciudad: Bogotá
   Departamento: Cundinamarca
   ```

6. **Seleccionar:** "Pago en Línea (Wompi)"

7. **Click:** "Pagar con Wompi"

8. **Tarjeta de Prueba:**
   ```
   Número:     4242 4242 4242 4242
   Vencimiento: 12/25
   CVV:        123
   Nombre:     Juan Perez
   ```

9. **Click:** "Pagar"

### ✅ Resultado Esperado

- Widget de Wompi se abre
- Pago se procesa sin errores
- Redirect a página de confirmación
- Muestra número de orden: ZAFTA-2025-XXXX

---

## 🔗 Configurar Webhook (Opcional)

Para que las órdenes se actualicen automáticamente:

### Paso 1: Dashboard de Wompi

1. Ve a: https://comercios.wompi.co
2. Dashboard → **Events** o **Eventos**

### Paso 2: Crear Webhook

```
URL: https://zafta-web1.vercel.app/api/webhooks/wompi
Event: transaction.updated
```

### Paso 3: Verificar

Wompi enviará un evento de prueba. Si se recibe correctamente, verás:
- ✅ Status: Active
- ✅ Last delivery: Success

---

## 🐛 Problemas Comunes

### Widget no carga / Error en checkout

**Síntoma:** Spinner infinito o error al abrir Wompi

**Solución:**
1. Verifica que las 4 variables estén en Vercel
2. Haz Redeploy
3. Limpia caché del navegador (Ctrl+Shift+R)
4. Abre DevTools (F12) → Console → Busca errores

### "Order not found" después de pagar

**Síntoma:** Pago exitoso pero no hay confirmación

**Causa:** Probablemente base de datos no guardó la orden

**Solución:**
1. Verifica que `DATABASE_URL` esté configurada
2. Revisa los logs en Vercel → Deployments → Function Logs

### Pago se procesa pero orden no se actualiza

**Síntoma:** Orden queda en PENDING aunque pagaste

**Causa:** Webhook no configurado o no llega

**Solución:**
- En testing: Es normal, el webhook puede tardar
- En producción: Configurar webhook (ver arriba)

---

## 🎯 Otras Tarjetas de Prueba

### Pago Rechazado
```
Número: 4111 1111 1111 1111
```

### Nequi Aprobado
```
Teléfono: 3991111111
```

### Nequi Rechazado
```
Teléfono: 3992222222
```

---

## 🚀 Ir a Producción

Cuando quieras aceptar pagos reales:

### 1. Obtener Credenciales de Producción

1. Completar KYC en Wompi (verificación de identidad)
2. Dashboard → API Keys → **Production**
3. Copiar las keys `pub_prod_*` y `prod_*`

### 2. Actualizar Variables en Vercel

Reemplazar las variables de test con las de producción:

```env
NEXT_PUBLIC_WOMPI_PUBLIC_KEY=pub_prod_TU_KEY_REAL
WOMPI_INTEGRITY_SECRET=prod_integrity_TU_SECRET_REAL
WOMPI_EVENTS_SECRET=prod_events_TU_SECRET_REAL
```

### 3. Actualizar Webhook

Configurar el webhook nuevamente con las credenciales de producción.

### 4. Probar con Transacción Real

Hacer una compra pequeña real para verificar todo funciona.

---

## 📊 Resumen Visual

```
┌─────────────────────────────────────────┐
│  1. Agregar Variables en Vercel         │
│     ✓ NEXT_PUBLIC_WOMPI_PUBLIC_KEY     │
│     ✓ WOMPI_INTEGRITY_SECRET           │
│     ✓ WOMPI_EVENTS_SECRET              │
│     ✓ NEXT_PUBLIC_APP_URL              │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│  2. Redeploy en Vercel                  │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│  3. Probar con Tarjeta 4242...         │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│  4. (Opcional) Configurar Webhook      │
└─────────────────────────────────────────┘
                  ↓
            ✅ ¡Listo!
```

---

## ✅ Checklist Final

- [ ] 4 variables agregadas en Vercel
- [ ] Redeploy completado
- [ ] Pago de prueba exitoso
- [ ] Página de confirmación funciona
- [ ] (Opcional) Webhook configurado
- [ ] Admin panel muestra la orden

---

## 📞 Ayuda

**Documentación completa:**
- `docs/WOMPI_SETUP.md` - Setup completo
- `docs/WOMPI_QUICK_TEST.md` - Guía de testing
- `docs/WOMPI_TEST_PLAN.md` - Plan de pruebas

**Soporte Wompi:**
- Email: soporte@wompi.co
- Docs: https://docs.wompi.co
- Chat: Disponible en dashboard

**Problemas con el código:**
- Revisar logs en Vercel
- Abrir DevTools (F12) en el navegador
- Verificar que todas las variables estén configuradas
