# Configuración de Supabase Storage

Este documento explica cómo configurar Supabase Storage para almacenar imágenes de productos.

## ¿Qué es Supabase Storage?

Supabase Storage es un servicio de almacenamiento de archivos que permite:
- Almacenar imágenes de productos
- Servir archivos con URLs públicas
- Control de acceso y permisos
- CDN integrado para mejor performance

## Pasos para Configurar

### 1. Acceder a Supabase Dashboard

1. Ve a [https://app.supabase.com](https://app.supabase.com)
2. Selecciona tu proyecto (ya configurado con la base de datos)
3. En el menú lateral, ve a **Storage**

### 2. Crear un Bucket

1. Click en **New bucket**
2. Configura el bucket:
   - **Name**: `zafta-images`
   - **Public bucket**: ✅ Marcado (para que las imágenes sean públicas)
   - **File size limit**: 5 MB (opcional)
   - **Allowed MIME types**: `image/jpeg, image/png, image/webp` (opcional)
3. Click en **Create bucket**

### 3. Configurar Políticas de Seguridad (RLS)

Por defecto, Supabase tiene Row Level Security (RLS) habilitado. Necesitas crear políticas:

#### Política para Lectura Pública (GET)
```sql
-- Permitir que cualquiera pueda ver las imágenes
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'zafta-images' );
```

#### Política para Upload (POST) - Solo Admins
```sql
-- Permitir que solo usuarios autenticados suban archivos
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'zafta-images' AND
  auth.role() = 'authenticated'
);
```

#### Política para Actualizar (PUT) - Solo Admins
```sql
-- Permitir que solo usuarios autenticados actualicen archivos
CREATE POLICY "Authenticated users can update"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'zafta-images' AND
  auth.role() = 'authenticated'
);
```

#### Política para Eliminar (DELETE) - Solo Admins
```sql
-- Permitir que solo usuarios autenticados eliminen archivos
CREATE POLICY "Authenticated users can delete"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'zafta-images' AND
  auth.role() = 'authenticated'
);
```

### 4. Estructura de Carpetas

Las imágenes se organizan en la siguiente estructura:
```
zafta-images/
└── products/
    ├── 1234567890-abc123.webp
    ├── 1234567891-def456.webp
    └── ...
```

### 5. Verificar Variables de Entorno

Las variables de entorno ya están configuradas en tu archivo `.env`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://dqxagqpnxelbukfeptfi.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Cómo Funciona el Upload

### 1. Flujo de Upload
```
Usuario selecciona imagen → ProductForm
        ↓
    Validación (tipo, tamaño)
        ↓
    POST /api/upload
        ↓
    Verificación de permisos (admin)
        ↓
    Upload a Supabase Storage
        ↓
    Retorna URL pública
        ↓
    Guarda URL en base de datos
```

### 2. Código de Ejemplo

#### Upload desde el Formulario
```typescript
const formDataImage = new FormData();
formDataImage.append("file", imageFile);

const uploadResponse = await fetch("/api/upload", {
  method: "POST",
  body: formDataImage,
});

const { url } = await uploadResponse.json();
```

#### Guardar en Base de Datos
```typescript
await prisma.product.create({
  data: {
    name: "Torta de Chocolate",
    imageUrl: url, // URL pública de Supabase
    // ... otros campos
  },
});
```

## Validaciones Implementadas

### En el Cliente (ProductForm)
- Solo permite seleccionar archivos de imagen
- Preview de la imagen antes de subir

### En el Servidor (API Route)
- ✅ Usuario debe estar autenticado
- ✅ Usuario debe ser ADMIN o SUPER_ADMIN
- ✅ Tipo de archivo: JPG, PNG, WEBP
- ✅ Tamaño máximo: 5MB
- ✅ Nombre de archivo único (timestamp + random)

## URLs Públicas

Las imágenes subidas tienen URLs públicas como:
```
https://dqxagqpnxelbukfeptfi.supabase.co/storage/v1/object/public/zafta-images/products/1234567890-abc123.webp
```

Estas URLs:
- Son permanentes mientras el archivo exista
- Se sirven a través del CDN de Supabase
- Están optimizadas para performance
- Funcionan con `next/image` para optimización adicional

## Buenas Prácticas

### 1. Optimización de Imágenes
Antes de subir, considera optimizar las imágenes:
- Convertir a WebP para mejor compresión
- Reducir dimensiones si son muy grandes (recomendado: 1200x1200px max)
- Usar herramientas como TinyPNG, Squoosh, o sharp

### 2. Nombres de Archivo
El sistema genera nombres únicos automáticamente:
```
{timestamp}-{random}.{extension}
Ejemplo: 1705432100-x7k9m2.webp
```

### 3. Limpieza de Archivos Huérfanos
Si eliminas un producto, considera también eliminar su imagen de Storage:
```typescript
// En el futuro, puedes implementar esto
const deleteImage = async (imageUrl: string) => {
  const path = imageUrl.split('/').slice(-2).join('/');
  await supabase.storage.from('zafta-images').remove([path]);
};
```

## Troubleshooting

### Error: "Error uploading file to storage"
**Causa**: Problema con permisos o bucket no existe

**Solución**:
1. Verifica que el bucket `zafta-images` existe
2. Verifica que el bucket es público
3. Verifica las políticas RLS

### Error: "Invalid file type"
**Causa**: Intentando subir un archivo que no es JPG, PNG o WEBP

**Solución**: Solo sube imágenes en formatos permitidos

### Error: "File size must be less than 5MB"
**Causa**: Imagen demasiado grande

**Solución**:
1. Comprime la imagen usando TinyPNG o similar
2. Reduce las dimensiones de la imagen

### Las imágenes no se ven
**Causa**: URL incorrecta o bucket no público

**Solución**:
1. Verifica que el bucket `zafta-images` esté marcado como público
2. Verifica la política de lectura pública
3. Copia y pega la URL en el navegador para verificar

## Límites y Cuotas

Supabase Free Tier incluye:
- 1 GB de almacenamiento
- 2 GB de transferencia mensual
- Suficiente para ~200-500 imágenes de productos optimizadas

Si necesitas más, considera:
- Optimizar imágenes existentes
- Actualizar a plan Pro de Supabase
- Usar un CDN adicional

## Siguiente Paso

Con Supabase Storage configurado, ahora puedes:
1. Crear productos con imágenes desde el panel de admin
2. Las imágenes se mostrarán en el catálogo público
3. Gestionar el inventario completo

Para crear la vista pública del catálogo, ver: `docs/CLIENT_CATALOG.md` (próximamente)
