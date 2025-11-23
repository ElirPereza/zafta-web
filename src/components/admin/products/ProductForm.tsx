"use client";

import type { Product, ProductSize } from "@prisma/client";
import { Upload, X, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

interface SizeInput {
  id?: string;
  name: string;
  price: number | "";
}

interface ProductWithSizes extends Product {
  sizes?: ProductSize[];
}

interface ProductFormProps {
  product?: ProductWithSizes;
}

export function ProductForm({ product }: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(
    product?.images?.[0] || null,
  );
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    name: product?.name || "",
    slug: product?.slug || "",
    description: product?.description || "",
    price: product?.price ? Number(product.price) : ("" as any),
    comparePrice: product?.comparePrice
      ? Number(product.comparePrice)
      : ("" as any),
    category: product?.category || "",
    inStock: product?.inStock ?? true,
    featured: product?.featured ?? false,
  });

  // Sizes state
  const [sizes, setSizes] = useState<SizeInput[]>(
    product?.sizes?.map((s) => ({
      id: s.id,
      name: s.name,
      price: Number(s.price),
    })) || [],
  );

  const addSize = () => {
    setSizes([...sizes, { name: "", price: "" }]);
  };

  const removeSize = (index: number) => {
    setSizes(sizes.filter((_, i) => i !== index));
  };

  const updateSize = (
    index: number,
    field: keyof SizeInput,
    value: string | number,
  ) => {
    const newSizes = [...sizes];
    if (field === "price") {
      newSizes[index][field] = value === "" ? "" : Number(value);
    } else {
      newSizes[index][field] = value as string;
    }
    setSizes(newSizes);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let images = product?.images || [];

      // Upload image to Supabase if a new image was selected
      if (imageFile) {
        const formDataImage = new FormData();
        formDataImage.append("file", imageFile);

        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: formDataImage,
        });

        if (!uploadResponse.ok) {
          const errorData = await uploadResponse.json();
          throw new Error(errorData.error || "Error al subir la imagen");
        }

        const uploadData = await uploadResponse.json();
        images = [uploadData.url];
      }

      // Generate slug from name if not provided
      const slug =
        formData.slug ||
        formData.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");

      // Create or update product
      const url = product ? `/api/products/${product.id}` : "/api/products";

      const method = product ? "PUT" : "POST";

      // Filter and validate sizes
      const validSizes = sizes
        .filter((s) => s.name.trim() && s.price !== "")
        .map((s, index) => ({
          id: s.id,
          name: s.name.trim(),
          price: Number(s.price),
          displayOrder: index,
        }));

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          price: Number(formData.price) || 0,
          comparePrice: formData.comparePrice
            ? Number(formData.comparePrice)
            : null,
          slug,
          images,
          sizes: validSizes,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al guardar el producto");
      }

      router.push("/admin/productos");
      router.refresh();
    } catch (error) {
      console.error("Error:", error);
      alert(
        error instanceof Error ? error.message : "Error al guardar el producto",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white border border-beige-400 rounded-lg p-6 space-y-6">
        {/* Image Upload */}
        <div className="space-y-2">
          <Label htmlFor="image" className="font-sans">
            Imagen del Producto
          </Label>
          {imagePreview ? (
            <div className="relative w-full h-64 rounded-lg overflow-hidden bg-beige-100">
              <Image
                src={imagePreview}
                alt="Preview"
                fill
                className="object-cover"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-lg hover:bg-beige-100 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <label
              htmlFor="image"
              className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-beige-400 rounded-lg cursor-pointer bg-beige-50 hover:bg-beige-100 transition-colors"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="h-10 w-10 text-muted-foreground mb-3" />
                <p className="mb-2 text-sm text-muted-foreground font-sans">
                  <span className="font-semibold">Click para subir</span> o
                  arrastra y suelta
                </p>
                <p className="text-xs text-muted-foreground font-sans">
                  PNG, JPG o WEBP (MAX. 5MB)
                </p>
              </div>
              <input
                id="image"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageChange}
              />
            </label>
          )}
        </div>

        {/* Name */}
        <div className="space-y-2">
          <Label htmlFor="name" className="font-sans">
            Nombre del Producto *
          </Label>
          <Input
            id="name"
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Ej: Torta de Chocolate"
            className="font-sans"
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description" className="font-sans">
            Descripción
          </Label>
          <Textarea
            id="description"
            value={formData.description || ""}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder="Describe el producto..."
            rows={4}
            className="font-sans"
          />
        </div>

        {/* Price and Compare Price */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="price" className="font-sans">
              Precio (COP) *
            </Label>
            <Input
              id="price"
              type="number"
              required
              min="0"
              step="100"
              value={formData.price}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  price:
                    e.target.value === ""
                      ? ("" as any)
                      : Number(e.target.value),
                })
              }
              placeholder="50000"
              className="font-sans"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="comparePrice" className="font-sans">
              Precio Anterior (Opcional)
            </Label>
            <Input
              id="comparePrice"
              type="number"
              min="0"
              step="100"
              value={formData.comparePrice || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  comparePrice:
                    e.target.value === ""
                      ? ("" as any)
                      : Number(e.target.value),
                })
              }
              placeholder="70000"
              className="font-sans"
            />
            <p className="text-xs text-muted-foreground font-sans">
              Precio tachado para mostrar descuento
            </p>
          </div>
        </div>

        {/* Category */}
        <div className="space-y-2">
          <Label htmlFor="category" className="font-sans">
            Categoría (Opcional)
          </Label>
          <Select
            value={formData.category}
            onValueChange={(value) =>
              setFormData({ ...formData, category: value })
            }
          >
            <SelectTrigger className="font-sans">
              <SelectValue placeholder="Selecciona una categoría" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="CHOCOLATE" className="font-sans">
                Chocolate
              </SelectItem>
              <SelectItem value="FRUTAS" className="font-sans">
                Frutas
              </SelectItem>
              <SelectItem value="CELEBRACION" className="font-sans">
                Celebración
              </SelectItem>
              <SelectItem value="CLASICA" className="font-sans">
                Clásica
              </SelectItem>
              <SelectItem value="ESPECIAL" className="font-sans">
                Especial
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Product Sizes */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="font-sans font-semibold">
                Tamaños y Precios
              </Label>
              <p className="text-sm text-muted-foreground font-sans">
                Define diferentes tamaños con sus precios. Si no agregas
                tamaños, se usará el precio base.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addSize}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Agregar Tamaño
            </Button>
          </div>

          {sizes.length > 0 && (
            <div className="space-y-3">
              {sizes.map((size, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 border border-beige-400 rounded-lg bg-beige-50"
                >
                  <div className="flex-1">
                    <Input
                      placeholder="Ej: Pequeña (6 porciones)"
                      value={size.name}
                      onChange={(e) =>
                        updateSize(index, "name", e.target.value)
                      }
                      className="font-sans"
                    />
                  </div>
                  <div className="w-40">
                    <Input
                      type="number"
                      placeholder="Precio"
                      min="0"
                      step="100"
                      value={size.price}
                      onChange={(e) =>
                        updateSize(index, "price", e.target.value)
                      }
                      className="font-sans"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeSize(index)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Stock and Featured Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center justify-between p-4 border border-beige-400 rounded-lg bg-beige-50">
            <div className="space-y-0.5">
              <Label htmlFor="inStock" className="font-sans font-semibold">
                En Stock
              </Label>
              <p className="text-sm text-muted-foreground font-sans">
                Marca si el producto está disponible
              </p>
            </div>
            <Switch
              id="inStock"
              checked={formData.inStock}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, inStock: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between p-4 border border-beige-400 rounded-lg bg-beige-50">
            <div className="space-y-0.5">
              <Label htmlFor="featured" className="font-sans font-semibold">
                Producto Destacado
              </Label>
              <p className="text-sm text-muted-foreground font-sans">
                Aparece en la página de inicio
              </p>
            </div>
            <Switch
              id="featured"
              checked={formData.featured}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, featured: checked })
              }
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={loading}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={loading}
          className="bg-[hsl(var(--rose-gold))] hover:bg-[hsl(var(--rose-gold))]/90 text-white"
        >
          {loading
            ? "Guardando..."
            : product
              ? "Actualizar Producto"
              : "Crear Producto"}
        </Button>
      </div>
    </form>
  );
}
