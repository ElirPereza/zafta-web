# 🧪 Plan de Testing - Wompi Sandbox

## Estado de Configuración
✅ **WOMPI_PUBLIC_KEY** - Configurado (Sandbox)
✅ **WOMPI_INTEGRITY_SECRET** - Configurado
✅ **WOMPI_EVENTS_SECRET** - Configurado
✅ **APP_URL** - Configurado

---

## 🎯 Objetivos del Testing

1. **Flujo de Checkout Completo** - Verificar que el proceso de compra funcione end-to-end
2. **Integración Widget Wompi** - Confirmar que el widget se carga correctamente
3. **Procesamiento de Pagos** - Probar transacciones exitosas y fallidas
4. **Webhooks** - Verificar que los webhooks actualicen el estado de las órdenes
5. **Experiencia de Usuario** - Validar redirects y mensajes de confirmación

---

## 📋 Casos de Prueba

### Test 1: Flujo de Pago Exitoso
**Objetivo:** Verificar que un pago exitoso complete correctamente

**Pasos:**
1. Iniciar servidor: `bun dev`
2. Ir a: http://localhost:3000/productos
3. Agregar productos al carrito (ej: 2 tortas)
4. Click en "Proceder al Pago"
5. Completar formulario de checkout:
   - Nombre: Juan Pérez
   - Email: test@example.com
   - Teléfono: 3001234567
   - Dirección de envío completa
6. Seleccionar método de pago: "Pago en Línea (Wompi)"
7. Click en "Pagar con Wompi"
8. Usar tarjeta de prueba APROBADA:
   - Número: `4242 4242 4242 4242`
   - Fecha: Cualquier fecha futura (ej: 12/25)
   - CVV: `123`
   - Nombre: Juan Pérez
9. Confirmar pago

**Resultado Esperado:**
- ✅ Widget de Wompi se carga correctamente
- ✅ Pago procesado exitosamente
- ✅ Redirect a `/pedido-confirmado/[id]`
- ✅ Mensaje de confirmación visible
- ✅ Order status en DB: `CONFIRMED`
- ✅ Payment status en DB: `PAID`

---

### Test 2: Pago Rechazado
**Objetivo:** Verificar manejo de pagos rechazados

**Pasos:**
1-6. Igual que Test 1
7. Usar tarjeta de prueba RECHAZADA:
   - Número: `4111 1111 1111 1111`
   - Fecha: Cualquier fecha futura
   - CVV: `123`
8. Confirmar pago

**Resultado Esperado:**
- ✅ Widget muestra mensaje de error
- ✅ Usuario puede reintentar
- ✅ Order status: `PENDING`
- ✅ Payment status: `FAILED` (después del webhook)

---

### Test 3: Nequi (Opcional)
**Objetivo:** Probar método de pago alternativo

**Pasos:**
1-6. Igual que Test 1
7. Seleccionar Nequi como método de pago
8. Usar teléfono de prueba: `3991111111` (aprobado)

**Resultado Esperado:**
- ✅ Flujo Nequi completa correctamente
- ✅ Estados actualizados correctamente

---

### Test 4: Webhook Testing
**Objetivo:** Verificar que los webhooks actualicen las órdenes

**Nota:** Para desarrollo local se requiere ngrok

**Pasos:**
1. Instalar ngrok: https://ngrok.com/download
2. Ejecutar: `ngrok http 3000`
3. Copiar URL pública (ej: `https://abc123.ngrok.io`)
4. Configurar webhook en Wompi:
   - Dashboard: https://comercios.wompi.co/dashboard/events
   - URL: `https://abc123.ngrok.io/api/webhooks/wompi`
   - Evento: `transaction.updated`
5. Realizar un pago de prueba (Test 1)
6. Revisar logs del servidor

**Resultado Esperado:**
- ✅ Webhook recibido correctamente
- ✅ Firma verificada
- ✅ Order actualizada automáticamente
- ✅ Log: "Order ZAFTA-2024-XXXX updated: PAID"

---

### Test 5: Admin Panel
**Objetivo:** Verificar que las órdenes aparezcan en el admin

**Pasos:**
1. Completar Test 1 (pago exitoso)
2. Ir a: http://localhost:3000/admin/pedidos
3. Buscar la orden recién creada

**Resultado Esperado:**
- ✅ Orden visible en la tabla
- ✅ Estado: CONFIRMED
- ✅ Payment Status: PAID
- ✅ Total correcto
- ✅ Información de cliente visible
- ✅ Click en orden muestra detalles completos

---

### Test 6: Página de Confirmación
**Objetivo:** Verificar experiencia post-pago

**Pasos:**
1. Completar Test 1
2. Verificar página de confirmación

**Resultado Esperado:**
- ✅ Número de orden visible
- ✅ Resumen de productos comprados
- ✅ Total pagado
- ✅ Información de envío
- ✅ Mensaje de "¡Gracias por tu compra!"
- ✅ Instrucciones de próximos pasos

---

## 🔍 Checklist de Verificación

### Antes de Comenzar
- [ ] Servidor de desarrollo corriendo (`bun dev`)
- [ ] Base de datos accesible
- [ ] Variables de entorno cargadas
- [ ] Productos en stock disponibles

### Durante Testing
- [ ] Widget de Wompi carga sin errores
- [ ] No hay errores en consola del navegador
- [ ] No hay errores en logs del servidor
- [ ] Transiciones suaves entre pasos
- [ ] Mensajes de error claros (si aplica)

### Después de Cada Test
- [ ] Verificar orden en base de datos
- [ ] Revisar estados (order.status y paymentStatus)
- [ ] Confirmar transaction ID guardado
- [ ] Verificar en dashboard de Wompi

---

## 🐛 Problemas Comunes y Soluciones

### Widget no carga
**Síntoma:** Spinner infinito o error
**Solución:**
- Verificar `NEXT_PUBLIC_WOMPI_PUBLIC_KEY` en .env
- Revisar consola del navegador para errores
- Verificar que el script de Wompi se cargue: https://checkout.wompi.co/widget.js

### Pago exitoso pero orden no se actualiza
**Síntoma:** Status queda en PENDING
**Solución:**
- Verificar webhook configurado en dashboard de Wompi
- Revisar logs del webhook handler
- Para desarrollo local: usar ngrok
- Verificar `WOMPI_EVENTS_SECRET` correcto

### "Invalid signature" en webhook
**Síntoma:** Error 401 en webhook
**Solución:**
- Verificar `WOMPI_EVENTS_SECRET` coincide con dashboard
- Asegurarse de usar el secret correcto (test vs prod)
- Revisar que no haya espacios extra en .env

### Transacción duplicada
**Síntoma:** Múltiples órdenes para el mismo pago
**Solución:**
- Verificar que el código verifique `paymentStatus === "PAID"`
- No recargar página durante procesamiento
- Implementar idempotency checks

---

## 📊 Registro de Testing

### Sesión de Testing: [FECHA]

| Test | Estado | Notas | Screenshot |
|------|--------|-------|-----------|
| Test 1: Pago Exitoso | ⏳ Pendiente | | |
| Test 2: Pago Rechazado | ⏳ Pendiente | | |
| Test 3: Nequi | ⏳ Pendiente | | |
| Test 4: Webhook | ⏳ Pendiente | | |
| Test 5: Admin Panel | ⏳ Pendiente | | |
| Test 6: Confirmación | ⏳ Pendiente | | |

### Bugs Encontrados
- [ ] Ninguno por el momento

### Mejoras Sugeridas
- [ ] Ninguna por el momento

---

## ✅ Criterios de Aceptación

Para considerar el testing exitoso, se debe cumplir:

1. ✅ **Flujo Completo:** Usuario puede completar compra end-to-end
2. ✅ **Pagos Procesados:** Transacciones aprobadas y rechazadas se manejan correctamente
3. ✅ **Estados Correctos:** Orders y payments se actualizan según corresponde
4. ✅ **Webhooks Funcionando:** (Opcional para dev local, requerido para producción)
5. ✅ **UX Correcta:** Mensajes claros, redirects funcionan, sin errores visibles
6. ✅ **Admin Panel:** Órdenes visibles y administrables

---

## 🚀 Próximos Pasos - Producción

Una vez completado el testing en sandbox:

1. **Obtener Credenciales de Producción**
   - Completar KYC en Wompi
   - Obtener keys `prod_*`

2. **Actualizar Variables de Entorno**
   ```env
   NEXT_PUBLIC_WOMPI_PUBLIC_KEY=pub_prod_[TU_KEY_REAL]
   WOMPI_INTEGRITY_SECRET=prod_integrity_[TU_SECRET_REAL]
   WOMPI_EVENTS_SECRET=prod_events_[TU_SECRET_REAL]
   ```

3. **Configurar Webhook de Producción**
   - URL: `https://zafta.com/api/webhooks/wompi`
   - Evento: `transaction.updated`

4. **Testing en Producción**
   - Realizar transacción real pequeña
   - Verificar flujo completo
   - Confirmar recepción de fondos

5. **Monitoreo**
   - Configurar alertas para errores
   - Revisar dashboard de Wompi regularmente
   - Verificar webhooks se reciben correctamente

---

## 📞 Soporte

**Wompi:**
- Docs: https://docs.wompi.co
- Email: soporte@wompi.co
- Chat: Dashboard de comercios

**Documentación Interna:**
- Setup: `docs/WOMPI_SETUP.md`
- Configurar Webhook: `docs/CONFIGURAR_WEBHOOK_WOMPI.md`
- Obtener Credenciales: `docs/OBTENER_CREDENCIALES_WOMPI.md`
