"use client";

import type { Product } from "@prisma/client";
import { Eye, Pencil, Trash2, GripVertical } from "lucide-react";
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
    <TableRow ref={setNodeRef} style={style} className={isDragging ? "bg-beige-100" : ""}>
      {/* Drag Handle - Always visible */}
      <TableCell className="w-8 md:w-12">
        <button
          className="cursor-grab active:cursor-grabbing p-1 md:p-2 hover:bg-beige-100 rounded-md transition-colors"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground" />
        </button>
      </TableCell>

      {/* Image - Smaller on mobile */}
      <TableCell className="w-12 md:w-16">
        <div className="relative w-12 h-12 md:w-16 md:h-16 rounded-lg overflow-hidden bg-beige-100">
          {product.images && product.images.length > 0 ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Eye className="h-4 w-4 md:h-6 md:w-6 text-muted-foreground" />
            </div>
          )}
        </div>
      </TableCell>

      {/* Name - Always visible */}
      <TableCell className="font-sans font-medium text-sm md:text-base">
        {product.name}
      </TableCell>

      {/* Category - Hidden on mobile */}
      <TableCell className="hidden md:table-cell font-sans">
        {product.category ? (
          <Badge variant="outline" className="font-sans text-xs">
            {product.category}
          </Badge>
        ) : (
          <span className="text-muted-foreground text-sm">-</span>
        )}
      </TableCell>

      {/* Price - Smaller font on mobile */}
      <TableCell className="font-sans text-sm md:text-base">
        {formatPrice(Number(product.price))}
      </TableCell>

      {/* Stock - Hidden on small screens, visible on tablet+ */}
      <TableCell className="hidden lg:table-cell font-sans">
        <Badge
          variant={product.inStock ? "default" : "secondary"}
          className="font-sans text-xs"
        >
          {product.inStock ? "En Stock" : "Agotado"}
        </Badge>
      </TableCell>

      {/* Featured - Hidden on mobile */}
      <TableCell className="hidden md:table-cell">
        <Badge
          variant={product.featured ? "default" : "outline"}
          className="font-sans text-xs"
        >
          {product.featured ? "Destacado" : "-"}
        </Badge>
      </TableCell>

      {/* Actions - Always visible, compact on mobile */}
      <TableCell className="text-right w-20 md:w-auto">
        <div className="flex items-center justify-end gap-1 md:gap-2">
          <Link href={`/admin/productos/${product.id}/editar`}>
            <Button variant="ghost" size="icon" className="h-8 w-8 md:h-10 md:w-10">
              <Pencil className="h-3 w-3 md:h-4 md:w-4" />
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(product.id)}
            className="h-8 w-8 md:h-10 md:w-10"
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
    })
  );

  const fetchProducts = useCallback(async () => {
    try {
      const response = await fetch("/api/products");
      const data = await response.json();
      // Handle both old format (array) and new format (object with products)
      const productsArray = Array.isArray(data) ? data : (data.products || []);
      // Sort by displayOrder if available, otherwise by createdAt
      const sorted = productsArray.sort((a: Product, b: Product) => {
        if (a.displayOrder !== undefined && b.displayOrder !== undefined) {
          return a.displayOrder - b.displayOrder;
        }
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
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

        alert("¡Orden actualizado correctamente! La página se actualizará automáticamente.");

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
        <p className="text-muted-foreground font-sans">Cargando productos...</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12 border border-dashed border-beige-400 rounded-lg bg-beige-50">
        <h3 className="text-lg font-sans font-semibold text-foreground mb-2">
          No hay productos
        </h3>
        <p className="text-sm text-muted-foreground font-sans mb-4">
          Comienza agregando tu primer producto al catálogo
        </p>
        <Link href="/admin/productos/nuevo">
          <Button>Crear Producto</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="border border-beige-400 rounded-lg overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <Table className="min-w-full">
            <TableHeader>
              <TableRow className="bg-beige-100">
                <TableHead className="font-sans font-semibold w-8 md:w-12"></TableHead>
                <TableHead className="font-sans font-semibold w-12 md:w-16 text-xs md:text-sm">Imagen</TableHead>
                <TableHead className="font-sans font-semibold text-xs md:text-sm">Nombre</TableHead>
                <TableHead className="hidden md:table-cell font-sans font-semibold text-xs md:text-sm">Categoría</TableHead>
                <TableHead className="font-sans font-semibold text-xs md:text-sm">Precio</TableHead>
                <TableHead className="hidden lg:table-cell font-sans font-semibold text-xs md:text-sm">Stock</TableHead>
                <TableHead className="hidden md:table-cell font-sans font-semibold text-xs md:text-sm">Destacado</TableHead>
                <TableHead className="font-sans font-semibold text-right text-xs md:text-sm w-20 md:w-auto">
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
        <div className="flex justify-end">
          <Button
            onClick={handleSaveOrder}
            disabled={saving}
            className="font-sans"
          >
            {saving ? "Guardando..." : "Guardar Orden"}
          </Button>
        </div>
      )}
    </div>
  );
}
