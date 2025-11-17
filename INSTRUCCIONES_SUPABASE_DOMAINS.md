# Solución: Imágenes no cargan en dominio personalizado

## El Problema
Las imágenes de Supabase Storage funcionan en `zafta-eccomerce.vercel.app` pero NO en `zaftareposteria.com`.

## Causa
Supabase Storage tiene restricciones de origen (CORS) que solo permiten cargar imágenes desde dominios autorizados.

## Solución Paso a Paso

### Opción 1: Configurar en Supabase Dashboard (MÁS FÁCIL)

#### 1. Ve a Storage Settings
1. Abre [app.supabase.com](https://app.supabase.com)
2. Selecciona tu proyecto
3. En el menú lateral: **Storage** → **Settings** (icono de engranaje)
4. O busca: **Project Settings** → **Storage**

#### 2. Busca "Allowed Origins" o "CORS"
Puede estar en una de estas ubicaciones:
- Storage → Settings → CORS Configuration
- Project Settings → API → CORS Configuration
- Storage → Configuration (pestaña superior)

#### 3. Agrega tus dominios:
```
https://zaftareposteria.com
https://www.zaftareposteria.com
https://zafta-eccomerce.vercel.app
```

**IMPORTANTE:**
- Incluye `https://`
- NO pongas `/` al final
- Un dominio por línea

#### 4. Guarda los cambios
- Click en "Save" o "Update"
- Espera 1-2 minutos para que se propague

### Opción 2: Via SQL (SI NO ENCUENTRAS LA CONFIGURACIÓN)

Si no encuentras la configuración en la interfaz, ejecuta esto en el SQL Editor de Supabase:

#### 1. Ve a SQL Editor
En Supabase Dashboard: **SQL Editor** (menú lateral)

#### 2. Verifica políticas actuales del bucket 'gallery'
```sql
-- Ver políticas existentes
SELECT * FROM pg_policies
WHERE tablename = 'objects'
AND schemaname = 'storage';
```

#### 3. Crear/Actualizar política de lectura pública
```sql
-- Eliminar política antigua si existe
DROP POLICY IF EXISTS "Public Access" ON storage.objects;

-- Crear nueva política de acceso público para lectura
CREATE POLICY "Public Access"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'gallery');
```

#### 4. Hacer lo mismo para el bucket 'zafta-images'
```sql
DROP POLICY IF EXISTS "Public Access zafta-images" ON storage.objects;

CREATE POLICY "Public Access zafta-images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'zafta-images');
```

#### 5. Verificar que los buckets son públicos
```sql
-- Ver configuración de buckets
SELECT id, name, public
FROM storage.buckets;
```

Si `public` es `false`, actualiza:
```sql
UPDATE storage.buckets
SET public = true
WHERE name IN ('gallery', 'zafta-images');
```

### Opción 3: Actualizar Headers de Supabase (AVANZADO)

Si las opciones anteriores no funcionan, el problema puede ser headers HTTP.

#### 1. Ve a Project Settings
Dashboard → **Settings** → **API**

#### 2. Busca "Additional Configuration" o "Headers"

#### 3. Agrega headers CORS personalizados:
```
Access-Control-Allow-Origin: https://zaftareposteria.com, https://www.zaftareposteria.com
Access-Control-Allow-Methods: GET, HEAD, OPTIONS
Access-Control-Allow-Headers: *
```

## Verificación

### 1. Prueba directa en navegador
Copia una URL de imagen de Supabase, por ejemplo:
```
https://dqxagqpnxelbukfeptfi.supabase.co/storage/v1/object/public/gallery/personalizadas/123456.webp
```

Ábrela directamente en el navegador desde tu dominio `zaftareposteria.com`

### 2. Verifica en DevTools
1. Abre `zaftareposteria.com/inicio`
2. Abre DevTools (F12) → pestaña **Network**
3. Recarga la página
4. Busca las requests de imágenes de Supabase
5. Si ves error **CORS** o **403 Forbidden**, confirma que es el problema

### 3. Verifica headers de respuesta
En DevTools → Network → Click en una imagen → **Headers**

Debería incluir:
```
Access-Control-Allow-Origin: https://zaftareposteria.com
```

Si dice `https://zafta-eccomerce.vercel.app` solamente, entonces Supabase aún no tiene tu dominio autorizado.

## Contacto con Soporte Supabase

Si NINGUNA de las opciones anteriores funciona:

1. Ve a [supabase.com/dashboard/support](https://supabase.com/dashboard/support)
2. Abre un ticket explicando:

```
Título: CORS issue with custom domain on Storage

Descripción:
I have a Next.js app deployed on Vercel with a custom domain.
Images from Supabase Storage load correctly on vercel.app domain
but get blocked by CORS on my custom domain zaftareposteria.com.

Project ID: [tu-project-id]
Bucket: gallery, zafta-images
Custom domain: https://zaftareposteria.com

Please add this domain to the allowed origins for Storage.
```

## Si todo falla: Proxy alternativo

Como última opción, puedes crear un proxy en tu API para las imágenes:

```typescript
// src/app/api/image-proxy/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const imageUrl = request.nextUrl.searchParams.get('url');

  if (!imageUrl) {
    return NextResponse.json({ error: 'URL required' }, { status: 400 });
  }

  const response = await fetch(imageUrl);
  const blob = await response.blob();

  return new NextResponse(blob, {
    headers: {
      'Content-Type': response.headers.get('Content-Type') || 'image/jpeg',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
```

Luego usa:
```
https://zaftareposteria.com/api/image-proxy?url=https://supabase.co/storage/.../image.jpg
```

Pero esto NO es recomendado por performance.
