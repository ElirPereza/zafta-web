/**
 * Script to upload existing gallery images to Supabase Storage
 * and create database records for them.
 *
 * Run with: bun run src/scripts/upload-gallery-images.ts
 */

import { createClient } from "@supabase/supabase-js";
import { prisma } from "@/lib/prisma";
import { readFileSync } from "fs";
import { join } from "path";

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing Supabase environment variables");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface ImageToUpload {
  localPath: string;
  section: "PERSONALIZADAS" | "EVENTOS";
  alt: string;
  displayOrder: number;
}

const imagesToUpload: ImageToUpload[] = [
  // Personalizadas images
  {
    localPath: "public/especiales/perso1.jpg",
    section: "PERSONALIZADAS",
    alt: "Torta personalizada 1",
    displayOrder: 1,
  },
  {
    localPath: "public/especiales/perso2.jpg",
    section: "PERSONALIZADAS",
    alt: "Torta personalizada 2",
    displayOrder: 2,
  },
  {
    localPath: "public/especiales/perso3.jpg",
    section: "PERSONALIZADAS",
    alt: "Torta personalizada 3",
    displayOrder: 3,
  },
  // Eventos images
  {
    localPath: "public/eventos/eventos-1.jpg",
    section: "EVENTOS",
    alt: "Evento especial 1",
    displayOrder: 1,
  },
  {
    localPath: "public/eventos/eventos-2.jpg",
    section: "EVENTOS",
    alt: "Evento especial 2",
    displayOrder: 2,
  },
  {
    localPath: "public/eventos/eventos-3.jpg",
    section: "EVENTOS",
    alt: "Evento especial 3",
    displayOrder: 3,
  },
];

async function uploadImage(imageInfo: ImageToUpload) {
  try {
    console.log(`📤 Uploading ${imageInfo.localPath}...`);

    // Read the file
    const filePath = join(process.cwd(), imageInfo.localPath);
    const fileBuffer = readFileSync(filePath);

    // Generate storage path
    const fileName = imageInfo.localPath.split("/").pop()!;
    const storagePath = `${imageInfo.section.toLowerCase()}/${Date.now()}-${fileName}`;

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("gallery")
      .upload(storagePath, fileBuffer, {
        contentType: "image/jpeg",
        upsert: false,
      });

    if (uploadError) {
      console.error(`❌ Error uploading ${fileName}:`, uploadError.message);
      return null;
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("gallery").getPublicUrl(storagePath);

    console.log(`✅ Uploaded to: ${publicUrl}`);

    // Create database record
    const dbRecord = await prisma.galleryImage.create({
      data: {
        imageUrl: publicUrl,
        alt: imageInfo.alt,
        section: imageInfo.section,
        displayOrder: imageInfo.displayOrder,
        isActive: true,
      },
    });

    console.log(`✅ Created database record with ID: ${dbRecord.id}`);

    return dbRecord;
  } catch (error) {
    console.error(`❌ Error processing ${imageInfo.localPath}:`, error);
    return null;
  }
}

async function main() {
  console.log("🚀 Starting gallery images upload...\n");

  let successCount = 0;
  let errorCount = 0;

  for (const imageInfo of imagesToUpload) {
    const result = await uploadImage(imageInfo);
    if (result) {
      successCount++;
    } else {
      errorCount++;
    }
    console.log(""); // Empty line for readability
  }

  console.log("📊 Upload Summary:");
  console.log(`   ✅ Successful: ${successCount}`);
  console.log(`   ❌ Failed: ${errorCount}`);
  console.log(`   📁 Total: ${imagesToUpload.length}`);

  await prisma.$disconnect();
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
