"use client";

import type { Product } from "@prisma/client";
import { Eye, Pencil, Trash2, GripVertical, Package } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface SortableRowProps {
  product: Product;
  onDelete: (id: string) => void;
  formatPrice: (price: number | string) => string;
}

function SortableRow({ product, onDelete, formatPrice }: SortableRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: product.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <TableRow
      ref={setNodeRef}
      style={style}
      className={`${isDragging ? "bg-gradient-to-r from-[hsl(var(--rose-gold))]/20 to-transparent" : ""} hover:bg-gradient-to-r hover:from-[hsl(var(--rose-gold))]/5 hover:to-transparent transition-colors border-b border-[hsl(var(--beige-300))]/50`}
    >
      {/* Drag Handle - Always visible */}
      <TableCell className="w-8 md:w-12">
        <button
          className="cursor-grab active:cursor-grabbing p-1 md:p-2 hover:bg-[hsl(var(--rose-gold))]/20 rounded-md transition-colors"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4 md:h-5 md:w-5 text-[hsl(var(--rose-gold))]/70" />
        </button>
      </TableCell>

      {/* Image - Smaller on mobile */}
      <TableCell className="w-12 md:w-16">
        <div className="relative w-12 h-12 md:w-16 md:h-16 rounded-lg overflow-hidden bg-gradient-to-br from-[hsl(var(--beige-100))] to-[hsl(var(--beige-50))] border-2 border-[hsl(var(--beige-300))]">
          {product.images && product.images.length > 0 ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Eye className="h-4 w-4 md:h-6 md:w-6 text-[hsl(var(--rose-gold))]/50" />
            </div>
          )}
        </div>
      </TableCell>

      {/* Name - Always visible */}
      <TableCell className="font-sans font-semibold text-sm md:text-base text-[hsl(var(--midnight-navy))]">
        {product.name}
      </TableCell>

      {/* Category - Hidden on mobile */}
      <TableCell className="hidden md:table-cell font-sans">
        {product.category ? (
          <Badge
            variant="outline"
            className="font-sans text-xs bg-[hsl(var(--beige-100))] text-[hsl(var(--midnight-navy))] border-[hsl(var(--midnight-navy))]/30"
          >
            {product.category}
          </Badge>
        ) : (
          <span className="text-[hsl(var(--midnight-navy))]/50 text-sm">-</span>
        )}
      </TableCell>

      {/* Price - Smaller font on mobile */}
      <TableCell className="font-semibold text-sm md:text-base text-[hsl(var(--midnight-navy))]" style={{ fontFamily: 'Fredoka, sans-serif' }}>
        {formatPrice(Number(product.price))}
      </TableCell>

      {/* Stock - Hidden on small screens, visible on tablet+ */}
      <TableCell className="hidden lg:table-cell font-sans">
        <Badge
          variant={product.inStock ? "default" : "secondary"}
          className={`font-sans text-xs ${
            product.inStock
              ? "bg-gradient-to-r from-green-50 to-green-100 text-green-700 border-green-300"
              : "bg-gradient-to-r from-red-50 to-red-100 text-red-700 border-red-300"
          }`}
        >
          {product.inStock ? "En Stock" : "Agotado"}
        </Badge>
      </TableCell>

      {/* Featured - Hidden on mobile */}
      <TableCell className="hidden md:table-cell">
        <Badge
          variant={product.featured ? "default" : "outline"}
          className={`font-sans text-xs ${
            product.featured
              ? "bg-gradient-to-r from-[hsl(var(--rose-gold))]/90 to-[hsl(var(--rose-gold))] text-white border-[hsl(var(--rose-gold))]"
              : "text-[hsl(var(--midnight-navy))]/50 border-[hsl(var(--beige-300))]"
          }`}
        >
          {product.featured ? "Destacado" : "-"}
        </Badge>
      </TableCell>

      {/* Actions - Always visible, compact on mobile */}
      <TableCell className="text-right w-20 md:w-auto">
        <div className="flex items-center justify-end gap-1 md:gap-2">
          <Link href={`/admin/productos/${product.id}/editar`}>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 md:h-10 md:w-10 hover:bg-[hsl(var(--rose-gold))]/20 hover:text-[hsl(var(--rose-gold))]"
            >
              <Pencil className="h-3 w-3 md:h-4 md:w-4" />
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(product.id)}
            className="h-8 w-8 md:h-10 md:w-10 hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 className="h-3 w-3 md:h-4 md:w-4 text-red-600" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}

export function ProductsTable() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);
  const [saving, setSaving] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const fetchProducts = useCallback(async () => {
    try {
      const response = await fetch("/api/products");
      const data = await response.json();
      // Handle both old format (array) and new format (object with products)
      const productsArray = Array.isArray(data) ? data : data.products || [];
      // Sort by displayOrder if available, otherwise by createdAt
      const sorted = productsArray.sort((a: Product, b: Product) => {
        if (a.displayOrder !== undefined && b.displayOrder !== undefined) {
          return a.displayOrder - b.displayOrder;
        }
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      });
      setProducts(sorted);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = products.findIndex((p) => p.id === active.id);
    const newIndex = products.findIndex((p) => p.id === over.id);

    const newProducts = arrayMove(products, oldIndex, newIndex);
    setProducts(newProducts);
    setHasChanges(true);
  };

  const handleSaveOrder = async () => {
    setSaving(true);
    try {
      const updates = products.map((product, index) => ({
        id: product.id,
        displayOrder: index,
      }));

      const response = await fetch("/api/products/reorder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ updates }),
      });

      if (response.ok) {
        setHasChanges(false);

        // Revalidar la cache del homepage
        await fetch("/api/revalidate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ path: "/inicio" }),
        });

        alert(
          "¡Orden actualizado correctamente! La página se actualizará automáticamente.",
        );

        // Refrescar la lista de productos
        await fetchProducts();
      } else {
        throw new Error("Error saving order");
      }
    } catch (error) {
      console.error("Error updating product order:", error);
      alert("Error al actualizar el orden. Intenta de nuevo.");
      // Revert on error
      fetchProducts();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este producto?")) {
      return;
    }

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setProducts(products.filter((p) => p.id !== id));
      } else {
        alert("Error al eliminar el producto");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Error al eliminar el producto");
    }
  };

  const formatPrice = (price: number | string) => {
    const numPrice = typeof price === "string" ? parseFloat(price) : price;
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(numPrice);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-[hsl(var(--rose-gold))]/30 border-t-[hsl(var(--rose-gold))] rounded-full animate-spin" />
          <p className="text-[hsl(var(--midnight-navy))]/70 font-sans">
            Cargando productos...
          </p>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="relative overflow-hidden text-center py-12 border-2 border-dashed border-[hsl(var(--beige-400))] rounded-xl bg-gradient-to-br from-[hsl(var(--beige-50))] to-white shadow-sm">
        <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--rose-gold))]/5 to-transparent" />
        <div className="relative z-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[hsl(var(--rose-gold))]/20 to-[hsl(var(--rose-gold))]/10 mb-4">
            <Package className="h-8 w-8 text-[hsl(var(--rose-gold))]" />
          </div>
          <h3 className="text-lg font-gotham font-semibold text-[hsl(var(--midnight-navy))] mb-2">
            No hay productos
          </h3>
          <p className="text-sm text-[hsl(var(--midnight-navy))]/60 font-sans mb-4">
            Comienza agregando tu primer producto al catálogo
          </p>
          <Link href="/admin/productos/nuevo">
            <Button className="bg-[hsl(var(--midnight-navy))] hover:bg-[hsl(var(--midnight-navy))]/90 text-white shadow-lg">
              Crear Producto
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="border-2 border-[hsl(var(--beige-400))] rounded-xl overflow-hidden bg-white shadow-lg">
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-[hsl(var(--rose-gold))] scrollbar-track-[hsl(var(--beige-100))]">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <Table className="min-w-[800px] w-full">
              <TableHeader>
                <TableRow className="bg-gradient-to-r from-[hsl(var(--beige-100))] to-[hsl(var(--beige-50))] hover:from-[hsl(var(--beige-200))] hover:to-[hsl(var(--beige-100))]">
                  <TableHead className="font-gotham font-bold w-8 md:w-12 text-[hsl(var(--midnight-navy))]"></TableHead>
                  <TableHead className="font-gotham font-bold w-12 md:w-16 text-xs md:text-sm text-[hsl(var(--midnight-navy))]">
                    Imagen
                  </TableHead>
                  <TableHead className="font-gotham font-bold text-xs md:text-sm text-[hsl(var(--midnight-navy))]">
                    Nombre
                  </TableHead>
                  <TableHead className="hidden md:table-cell font-gotham font-bold text-xs md:text-sm text-[hsl(var(--midnight-navy))]">
                    Categoría
                  </TableHead>
                  <TableHead className="font-gotham font-bold text-xs md:text-sm text-[hsl(var(--midnight-navy))]">
                    Precio
                  </TableHead>
                  <TableHead className="hidden lg:table-cell font-gotham font-bold text-xs md:text-sm text-[hsl(var(--midnight-navy))]">
                    Stock
                  </TableHead>
                  <TableHead className="hidden md:table-cell font-gotham font-bold text-xs md:text-sm text-[hsl(var(--midnight-navy))]">
                    Destacado
                  </TableHead>
                  <TableHead className="font-gotham font-bold text-right text-xs md:text-sm w-20 md:w-auto text-[hsl(var(--midnight-navy))]">
                    Acciones
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <SortableContext
                  items={products.map((p) => p.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {products.map((product) => (
                    <SortableRow
                      key={product.id}
                      product={product}
                      onDelete={handleDelete}
                      formatPrice={formatPrice}
                    />
                  ))}
                </SortableContext>
              </TableBody>
            </Table>
          </DndContext>
        </div>
      </div>

      {hasChanges && (
        <div className="flex justify-end p-4 rounded-xl bg-gradient-to-r from-[hsl(var(--rose-gold))]/10 to-transparent border border-[hsl(var(--rose-gold))]/30">
          <Button
            onClick={handleSaveOrder}
            disabled={saving}
            className="font-gotham bg-[hsl(var(--midnight-navy))] hover:bg-[hsl(var(--midnight-navy))]/90 text-white shadow-lg"
          >
            {saving ? "Guardando..." : "Guardar Orden"}
          </Button>
        </div>
      )}
    </div>
  );
}
