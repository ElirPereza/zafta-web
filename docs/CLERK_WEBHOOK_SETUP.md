# Configuración del Webhook de Clerk

Este documento explica cómo configurar el webhook de Clerk para sincronizar usuarios con la base de datos.

## ¿Qué hace el webhook?

El webhook sincroniza automáticamente los usuarios de Clerk con nuestra base de datos:
- **Crear usuario**: Cuando un usuario se registra en Clerk, se crea automáticamente en la tabla `UserMetadata`
- **Actualizar usuario**: Cuando se actualiza el rol de un usuario en Clerk, se actualiza en la base de datos
- **Eliminar usuario**: Cuando se elimina un usuario de Clerk, se elimina de la base de datos

## Sistema de Roles

Los roles se asignan de dos formas:

### 1. Por Email (Recomendado para el Super Admin)
El usuario con el email configurado en la variable de entorno `ADMIN_EMAIL` será automáticamente `SUPER_ADMIN`:
- Configura `ADMIN_EMAIL=maldonadoelir@gmail.com` en tu archivo `.env`
- Cuando ese usuario se registre, automáticamente tendrá rol `SUPER_ADMIN`
- No necesitas configurar nada en Clerk metadata

### 2. Por Metadata de Clerk (Para otros admins)
También puedes asignar roles manualmente en Clerk:
- `super_admin` → `SUPER_ADMIN` en la base de datos
- `admin` → `ADMIN` en la base de datos
- Sin rol o cualquier otro valor → `CUSTOMER` en la base de datos

## Pasos para Configurar

### 1. Ir al Dashboard de Clerk

1. Ve a [https://dashboard.clerk.com](https://dashboard.clerk.com)
2. Selecciona tu aplicación
3. En el menú lateral, ve a **Webhooks**

### 2. Crear un Nuevo Webhook

1. Click en **+ Add Endpoint**
2. En **Endpoint URL**, ingresa: `https://your-domain.com/api/webhooks/clerk`
   - Para desarrollo local con ngrok: `https://your-ngrok-url.ngrok.io/api/webhooks/clerk`
   - Para producción: `https://zafta-web.vercel.app/api/webhooks/clerk`

### 3. Seleccionar Eventos

Marca los siguientes eventos:
- ✅ `user.created`
- ✅ `user.updated`
- ✅ `user.deleted`

### 4. Copiar el Signing Secret

1. Después de crear el webhook, Clerk te mostrará un **Signing Secret**
2. Copia este secret
3. Pégalo en tu archivo `.env`:
   ```
   CLERK_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxx
   ```

### 5. Configurar el Email del Super Admin

1. En tu archivo `.env`, asegúrate de tener configurado:
   ```
   ADMIN_EMAIL=maldonadoelir@gmail.com
   ```
2. El usuario que se registre con este email será automáticamente `SUPER_ADMIN`

### 6. Guardar y Activar

1. Click en **Create**
2. Verifica que el webhook esté **Enabled**

## Configurar Roles de Usuario

### Para hacer un usuario ADMIN:

1. Ve a **Users** en el dashboard de Clerk
2. Click en el usuario que quieres hacer admin
3. Ve a la pestaña **Metadata**
4. En **Public metadata**, agrega:
   ```json
   {
     "role": "admin"
   }
   ```
5. Click en **Save**

### Para hacer un usuario SUPER_ADMIN:

Sigue los mismos pasos pero usa:
```json
{
  "role": "super_admin"
}
```

## Probar el Webhook

### Opción 1: Registrar un nuevo usuario

1. Registra un nuevo usuario en `/auth/sign-up`
2. Verifica que aparezca en la tabla `UserMetadata` con rol `CUSTOMER`

### Opción 2: Actualizar rol de usuario existente

1. Edita el metadata de un usuario en Clerk (como se explicó arriba)
2. El rol se actualizará automáticamente en la base de datos

### Opción 3: Ver logs del webhook

1. En el dashboard de Clerk, ve a **Webhooks**
2. Click en tu webhook
3. Ve a la pestaña **Logs**
4. Aquí verás todas las llamadas al webhook y su estado

## Desarrollo Local con ngrok

Para probar webhooks en desarrollo local:

1. Instala ngrok: `npm install -g ngrok` o descarga de [ngrok.com](https://ngrok.com)
2. Ejecuta tu servidor de desarrollo: `bun dev`
3. En otra terminal, ejecuta: `ngrok http 3000`
4. Copia la URL de ngrok (ejemplo: `https://abc123.ngrok.io`)
5. Usa esta URL en el webhook de Clerk: `https://abc123.ngrok.io/api/webhooks/clerk`

## Verificar que Funciona

### En la consola de tu aplicación:

Cuando el webhook funciona correctamente, verás logs como:
```
✅ User created in database: user@example.com with role: CUSTOMER
✅ User updated in database: user_xxxxx with new role: ADMIN
✅ User deleted from database: user_xxxxx
```

### En la base de datos:

```sql
-- Ver todos los usuarios y sus roles
SELECT * FROM "UserMetadata";

-- Ver solo admins
SELECT * FROM "UserMetadata" WHERE role IN ('ADMIN', 'SUPER_ADMIN');
```

## Troubleshooting

### Error: "Error occurred -- no svix headers"
- El webhook no está configurado correctamente en Clerk
- Verifica que la URL del webhook sea correcta

### Error: "Error verifying webhook"
- El `CLERK_WEBHOOK_SECRET` en `.env` es incorrecto
- Copia el secret correcto desde el dashboard de Clerk

### El usuario no aparece en la base de datos
- Verifica que el webhook esté **Enabled** en Clerk
- Verifica que los eventos `user.created`, `user.updated`, `user.deleted` estén seleccionados
- Revisa los logs del webhook en el dashboard de Clerk

### El rol no se actualiza
- Asegúrate de estar editando el **Public metadata**, no el Private metadata
- Verifica que el valor sea exactamente `"admin"` o `"super_admin"` (en minúsculas)
- El campo debe llamarse `"role"`

## Seguridad

⚠️ **IMPORTANTE**:
- NUNCA compartas tu `CLERK_WEBHOOK_SECRET`
- NUNCA lo subas a Git (está en `.gitignore`)
- Usa secrets diferentes para desarrollo y producción
- En producción, usa HTTPS siempre

## Siguiente Paso

Una vez configurado el webhook, el siguiente paso es actualizar el middleware para verificar roles desde la base de datos. Ver: `docs/MIDDLEWARE_ROLE_CHECK.md`
