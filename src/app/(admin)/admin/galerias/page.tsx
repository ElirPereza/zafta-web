"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Upload, Trash2, Plus, Images } from "lucide-react";
import { createClient } from "@supabase/supabase-js";

interface GalleryImage {
  id: string;
  imageUrl: string;
  alt: string;
  section: "PERSONALIZADAS" | "EVENTOS";
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function GaleriasPage() {
  // Initialize Supabase client inside component
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Form state
  const [file, setFile] = useState<File | null>(null);
  const [alt, setAlt] = useState("");
  const [section, setSection] = useState<"PERSONALIZADAS" | "EVENTOS">(
    "PERSONALIZADAS",
  );

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const response = await fetch("/api/gallery");
      const data = await response.json();

      if (response.ok) {
        // Sort by section and displayOrder
        const sorted = data.images.sort((a: GalleryImage, b: GalleryImage) => {
          if (a.section !== b.section) {
            return a.section === "PERSONALIZADAS" ? -1 : 1;
          }
          return a.displayOrder - b.displayOrder;
        });
        setImages(sorted);
      } else {
        toast.error("Error al cargar las imágenes");
      }
    } catch (error) {
      toast.error("Error al cargar las imágenes");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file || !alt) {
      toast.error("Por favor completa todos los campos");
      return;
    }

    setUploading(true);

    try {
      // Upload to Supabase Storage
      const fileExt = file.name.split(".").pop();
      const fileName = `${section.toLowerCase()}/${Date.now()}.${fileExt}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("gallery")
        .upload(fileName, file);

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("gallery").getPublicUrl(fileName);

      // Create gallery image record
      const response = await fetch("/api/gallery", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageUrl: publicUrl,
          alt,
          section,
          displayOrder: images.filter((img) => img.section === section).length,
        }),
      });

      if (response.ok) {
        toast.success("Imagen subida correctamente");
        setIsDialogOpen(false);
        setFile(null);
        setAlt("");
        fetchImages();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al crear el registro");
      }
    } catch (error: any) {
      toast.error(error.message || "Error al subir la imagen");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (image: GalleryImage) => {
    if (!confirm("¿Estás seguro de eliminar esta imagen?")) {
      return;
    }

    try {
      // Delete from database
      const response = await fetch(`/api/gallery/${image.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Delete from Supabase Storage
        const fileName = image.imageUrl.split("/gallery/")[1];
        if (fileName) {
          await supabase.storage.from("gallery").remove([fileName]);
        }

        toast.success("Imagen eliminada correctamente");
        fetchImages();
      } else {
        toast.error("Error al eliminar la imagen");
      }
    } catch (error) {
      toast.error("Error al eliminar la imagen");
    }
  };

  const personalizadasImages = images.filter(
    (img) => img.section === "PERSONALIZADAS",
  );
  const eventosImages = images.filter((img) => img.section === "EVENTOS");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="text-4xl font-gotham font-bold text-[hsl(var(--midnight-navy))] mb-2">
            Gestión de Galerías
          </h1>
          <p className="text-[hsl(var(--midnight-navy))]/70 font-sans text-base">
            Administra las imágenes de Tortas Personalizadas y Eventos
            Especiales
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-[hsl(var(--midnight-navy))] hover:bg-[hsl(var(--midnight-navy))]/90 text-white shadow-lg hover:shadow-xl transition-all">
              <Plus className="h-4 w-4" />
              Nueva Imagen
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Subir Nueva Imagen</DialogTitle>
              <DialogDescription>
                Sube una imagen para mostrar en la galería del sitio web.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="section">Sección</Label>
                <Select
                  value={section}
                  onValueChange={(value: "PERSONALIZADAS" | "EVENTOS") =>
                    setSection(value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PERSONALIZADAS">
                      Tortas Personalizadas
                    </SelectItem>
                    <SelectItem value="EVENTOS">Eventos Especiales</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="alt">Descripción de la imagen</Label>
                <Input
                  id="alt"
                  value={alt}
                  onChange={(e) => setAlt(e.target.value)}
                  placeholder="Ej: Torta personalizada ZAFTA - Diseño único"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="file">Archivo de imagen</Label>
                <Input
                  id="file"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                disabled={uploading}
              >
                Cancelar
              </Button>
              <Button onClick={handleUpload} disabled={uploading}>
                {uploading ? "Subiendo..." : "Subir Imagen"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-4 border-[hsl(var(--rose-gold))]/30 border-t-[hsl(var(--burgundy))] rounded-full animate-spin" />
            <p className="text-[hsl(var(--midnight-navy))]/70 font-sans">
              Cargando imágenes...
            </p>
          </div>
        </div>
      )}

      {/* Tortas Personalizadas Section */}
      {!loading && (
        <Card className="border-[hsl(var(--beige-400))]">
          <CardHeader>
            <CardTitle className="font-sans flex items-center gap-2">
              <Images className="h-5 w-5" />
              Tortas Personalizadas
            </CardTitle>
            <CardDescription className="font-sans">
              {personalizadasImages.length} imagen
              {personalizadasImages.length !== 1 ? "es" : ""} (máximo
              recomendado: 3)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {personalizadasImages.length === 0 ? (
              <div className="relative overflow-hidden text-center py-8 border-2 border-dashed border-[hsl(var(--beige-400))] rounded-xl bg-gradient-to-br from-[hsl(var(--beige-50))] to-white">
                <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--rose-gold))]/5 to-transparent" />
                <div className="relative z-10">
                  <p className="text-[hsl(var(--midnight-navy))]/60 font-sans">
                    No hay imágenes en esta sección
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {personalizadasImages.map((image) => (
                  <div
                    key={image.id}
                    className="relative group rounded-lg overflow-hidden border-2 border-border"
                  >
                    <div className="aspect-square relative">
                      <Image
                        src={image.imageUrl}
                        alt={image.alt}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDelete(image)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="p-2 bg-background/95">
                      <p className="text-xs text-muted-foreground truncate">
                        {image.alt}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Eventos Especiales Section */}
      {!loading && (
        <Card className="border-[hsl(var(--beige-400))]">
          <CardHeader>
            <CardTitle className="font-sans flex items-center gap-2">
              <Images className="h-5 w-5" />
              Eventos Especiales
            </CardTitle>
            <CardDescription className="font-sans">
              {eventosImages.length} imagen
              {eventosImages.length !== 1 ? "es" : ""} (máximo recomendado: 3)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {eventosImages.length === 0 ? (
              <div className="relative overflow-hidden text-center py-8 border-2 border-dashed border-[hsl(var(--beige-400))] rounded-xl bg-gradient-to-br from-[hsl(var(--beige-50))] to-white">
                <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--rose-gold))]/5 to-transparent" />
                <div className="relative z-10">
                  <p className="text-[hsl(var(--midnight-navy))]/60 font-sans">
                    No hay imágenes en esta sección
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {eventosImages.map((image) => (
                  <div
                    key={image.id}
                    className="relative group rounded-lg overflow-hidden border-2 border-border"
                  >
                    <div className="aspect-square relative">
                      <Image
                        src={image.imageUrl}
                        alt={image.alt}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDelete(image)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="p-2 bg-background/95">
                      <p className="text-xs text-muted-foreground truncate">
                        {image.alt}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
