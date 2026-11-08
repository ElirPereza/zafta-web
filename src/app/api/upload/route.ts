import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/admin";

export const runtime = "nodejs";

// Buckets a los que el panel puede subir, con la carpeta por defecto de cada uno.
const BUCKETS: Record<string, { defaultFolder: string }> = {
  "zafta-images": { defaultFolder: "products" },
  gallery: { defaultFolder: "" },
};

const FOLDER_PATTERN = /^[a-z0-9_-]{0,40}$/;
const PATH_PATTERN = /^[A-Za-z0-9_\-./]{1,200}$/;

// Use service role key for server-side operations (bypasses RLS policies)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  },
);

function resolveBucket(value: unknown): string | null {
  const bucket = typeof value === "string" && value ? value : "zafta-images";
  return bucket in BUCKETS ? bucket : null;
}

// POST /api/upload - Sube una imagen a Supabase Storage (solo administradores)
export async function POST(request: Request) {
  try {
    const admin = await requireAdmin();
    if (!admin.ok) {
      return admin.response;
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const bucket = resolveBucket(formData.get("bucket"));
    if (!bucket) {
      return NextResponse.json({ error: "Invalid bucket" }, { status: 400 });
    }

    const folderValue = formData.get("folder");
    const folder =
      typeof folderValue === "string"
        ? folderValue
        : BUCKETS[bucket].defaultFolder;
    if (!FOLDER_PATTERN.test(folder)) {
      return NextResponse.json({ error: "Invalid folder" }, { status: 400 });
    }

    // Validate file type
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only JPG, PNG, and WEBP are allowed." },
        { status: 400 },
      );
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File size must be less than 5MB" },
        { status: 400 },
      );
    }

    // Generate unique filename
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = folder ? `${folder}/${fileName}` : fileName;

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Supabase Storage
    const { error } = await supabase.storage
      .from(bucket)
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      console.error("Supabase upload error:", error);
      return NextResponse.json(
        { error: "Error uploading file to storage" },
        { status: 500 },
      );
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(filePath);

    return NextResponse.json(
      { url: publicUrl, path: filePath },
      { status: 200 },
    );
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Error uploading file" },
      { status: 500 },
    );
  }
}

// DELETE /api/upload - Borra un archivo de Supabase Storage (solo administradores)
// Body: { bucket: string, path: string }
export async function DELETE(request: Request) {
  try {
    const admin = await requireAdmin();
    if (!admin.ok) {
      return admin.response;
    }

    const body = (await request.json().catch(() => ({}))) as {
      bucket?: unknown;
      path?: unknown;
    };

    const bucket = resolveBucket(body.bucket);
    if (!bucket) {
      return NextResponse.json({ error: "Invalid bucket" }, { status: 400 });
    }

    const path = typeof body.path === "string" ? body.path : "";
    if (!PATH_PATTERN.test(path) || path.includes("..")) {
      return NextResponse.json({ error: "Invalid path" }, { status: 400 });
    }

    const { error } = await supabase.storage.from(bucket).remove([path]);

    if (error) {
      console.error("Supabase remove error:", error);
      return NextResponse.json(
        { error: "Error deleting file from storage" },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete upload error:", error);
    return NextResponse.json({ error: "Error deleting file" }, { status: 500 });
  }
}
