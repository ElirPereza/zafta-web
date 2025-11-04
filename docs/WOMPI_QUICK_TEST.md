# 🚀 Wompi - Guía Rápida de Testing

## ✅ Estado Actual
- ✅ Configuración Wompi verificada (SANDBOX)
- ✅ Servidor corriendo en http://localhost:3000
- ✅ Listo para testing

---

## 🎯 Test Rápido (5 minutos)

### Paso 1: Agregar Productos al Carrito
1. Ir a: http://localhost:3000/productos
2. Hacer click en "Agregar al Carrito" en 2-3 productos
3. Verificar que el contador del carrito aumente

### Paso 2: Checkout
1. Click en el ícono del carrito (arriba derecha)
2. Click en "Proceder al Pago"
3. Completar formulario:
   ```
   Nombre: Juan Pérez
   Email: test@example.com
   Teléfono: 3001234567
   Dirección: Calle 123 # 45-67
   Ciudad: Bogotá
   Departamento: Cundinamarca
   ```

### Paso 3: Pago con Wompi
1. Seleccionar: "Pago en Línea (Wompi)"
2. Click en "Pagar con Wompi"
3. Esperar que cargue el widget (2-3 segundos)
4. Usar tarjeta de prueba:
   ```
   Número: 4242 4242 4242 4242
   Vencimiento: 12/25
   CVV: 123
   Nombre: Juan Perez
   ```
5. Click en "Pagar"

### Paso 4: Verificación
1. **Redirect automático** a `/pedido-confirmado/[id]`
2. Verificar que aparezca:
   - ✅ Número de orden (ZAFTA-2025-XXXX)
   - ✅ Resumen de productos
   - ✅ Total pagado
   - ✅ Dirección de envío
   - ✅ Mensaje de éxito

### Paso 5: Admin Panel (Opcional)
1. Ir a: http://localhost:3000/admin/pedidos
2. Buscar la orden recién creada
3. Verificar:
   - ✅ Status: CONFIRMED
   - ✅ Payment Status: PAID

---

## 🧪 Otras Tarjetas de Prueba

### Tarjeta Rechazada
```
Número: 4111 1111 1111 1111
Vencimiento: 12/25
CVV: 123
```
**Resultado:** Pago rechazado, orden queda en PENDING

### Nequi Aprobado
```
Teléfono: 3991111111
```

### Nequi Rechazado
```
Teléfono: 3992222222
```

---

## ⚠️ Nota sobre Webhooks

**Para desarrollo local:**
Los webhooks de Wompi NO llegarán automáticamente porque localhost no es accesible desde internet.

**Opciones:**
1. **Testing básico:** El pago se procesa, pero el estado no se actualiza automáticamente (necesita refresh manual en Wompi dashboard)
2. **Testing completo con ngrok:**
   ```bash
   # En otra terminal:
   ngrok http 3000

   # Configurar webhook en Wompi:
   # https://TU-SUBDOMINIO.ngrok.io/api/webhooks/wompi
   ```

**En producción:** Los webhooks funcionarán automáticamente con tu dominio real.

---

## 🎯 ¿Qué Verificar?

✅ **Funcional:**
- [ ] Widget de Wompi carga correctamente
- [ ] Pago se procesa sin errores
- [ ] Redirect a página de confirmación
- [ ] Información de orden correcta

✅ **Visual:**
- [ ] Diseño consistente con branding Zafta
- [ ] No hay errores visuales
- [ ] Responsive en móvil

✅ **Técnico:**
- [ ] No hay errores en consola del navegador (F12)
- [ ] No hay errores en terminal del servidor

---

## 🐛 Si Algo Falla

### El widget no carga
1. Abrir DevTools (F12) → Console
2. Buscar errores en rojo
3. Verificar que `NEXT_PUBLIC_WOMPI_PUBLIC_KEY` esté en .env

### "Order not found"
1. Verificar que el formulario de checkout se completó correctamente
2. Revisar terminal del servidor para errores
3. Verificar conexión a base de datos

### Pago se procesa pero página no cambia
1. Revisar consola del navegador
2. Verificar que no haya errores de CORS
3. Intentar refrescar la página

---

## 📊 Resultado Esperado

**✅ Test Exitoso si:**
1. El pago se procesa sin errores
2. Aparece la página de confirmación
3. El número de orden es visible
4. La información es correcta

**❌ Test Fallido si:**
1. Widget no carga
2. Error al procesar pago
3. No hay redirect después del pago
4. Errores en consola

---

## 📋 Checklist Final

- [ ] Pago con tarjeta aprobada funciona
- [ ] Página de confirmación se muestra correctamente
- [ ] Información de orden es correcta
- [ ] (Opcional) Admin panel muestra la orden
- [ ] (Opcional) Pago rechazado maneja error correctamente

---

## 🚀 Siguiente Paso: Producción

Una vez validado en sandbox, reemplazar en `.env`:
```env
# Cambiar de test_* a prod_*
NEXT_PUBLIC_WOMPI_PUBLIC_KEY=pub_prod_TU_KEY_REAL
WOMPI_INTEGRITY_SECRET=prod_integrity_TU_SECRET_REAL
WOMPI_EVENTS_SECRET=prod_events_TU_SECRET_REAL
```

---

**Tiempo estimado:** 5-10 minutos para test completo
**Documentación completa:** Ver `WOMPI_TEST_PLAN.md`
