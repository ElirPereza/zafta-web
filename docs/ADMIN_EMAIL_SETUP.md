# Configuración del Email de Administrador

## ¿Qué es ADMIN_EMAIL?

Esta variable de entorno controla quién puede acceder al panel de administración de ZAFTA. Solo el email configurado en esta variable tendrá acceso completo al admin panel.

## Configuración

### 1. Agregar la variable de entorno

En tu archivo `.env` (o `.env.local`), agrega:

```bash
ADMIN_EMAIL=tu-email@ejemplo.com
```

**Reemplaza** `tu-email@ejemplo.com` con el email que usas en Clerk para iniciar sesión.

### 2. Ejemplo completo

```bash
# ============================================================================
# APP CONFIGURATION
# ============================================================================

NEXT_PUBLIC_APP_URL=http://localhost:3000

# Admin email - Only this email can access the admin panel
ADMIN_EMAIL=maria@zafta.com
```

## ¿Cómo funciona?

1. Cuando intentas acceder a `/admin`, el sistema verifica tu identidad con Clerk
2. Si estás autenticado, obtiene tu email principal
3. Compara tu email con el `ADMIN_EMAIL` configurado
4. Si coinciden (sin importar mayúsculas/minúsculas), te permite entrar
5. Si no coinciden, te redirige a `/inicio`

## Deployment en Producción

### Vercel

1. Ve a tu proyecto en Vercel
2. Settings > Environment Variables
3. Agrega una nueva variable:
   - **Key**: `ADMIN_EMAIL`
   - **Value**: `tu-email@ejemplo.com`
4. Guarda y redeploy

### Otras plataformas

Agrega la variable de entorno `ADMIN_EMAIL` con tu email en la configuración de tu plataforma de hosting.

## Seguridad

- ✅ Solo un email puede acceder al admin panel
- ✅ No necesitas crear usuarios en la base de datos
- ✅ Simple y seguro
- ✅ Fácil de cambiar el administrador

## Cambiar el administrador

Para cambiar quién tiene acceso al panel:

1. Actualiza el valor de `ADMIN_EMAIL` en tu archivo `.env`
2. En producción, actualiza la variable de entorno en tu plataforma de hosting
3. Redeploy si es necesario

## Troubleshooting

### No puedo acceder al admin panel

1. Verifica que `ADMIN_EMAIL` esté configurado en `.env`
2. Asegúrate de que el email coincida **exactamente** con el email de tu cuenta Clerk
3. Verifica que sea tu email **principal** en Clerk
4. Reinicia el servidor de desarrollo: `bun dev`

### Me redirige a /inicio

Esto significa que tu email no coincide con `ADMIN_EMAIL`. Verifica:

```bash
# En tu terminal
echo $ADMIN_EMAIL  # Linux/Mac
echo %ADMIN_EMAIL%  # Windows

# O revisa el archivo .env directamente
cat .env | grep ADMIN_EMAIL
```

## Multi-admin (futuro)

Si necesitas múltiples administradores en el futuro, puedes:

1. Usar una lista separada por comas:
   ```bash
   ADMIN_EMAIL=admin1@zafta.com,admin2@zafta.com
   ```

2. Modificar el código en `src/app/(admin)/admin/layout.tsx`:
   ```typescript
   const adminEmails = adminEmail.split(',').map(e => e.trim().toLowerCase());
   const isAdmin = adminEmails.includes(userEmail.toLowerCase());
   ```

Por ahora, el sistema está configurado para un solo administrador, que es suficiente para tu caso de uso.
