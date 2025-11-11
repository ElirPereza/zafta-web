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
      <TableCell>
        <button
          className="cursor-grab active:cursor-grabbing p-2 hover:bg-beige-100 rounded-md transition-colors"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-5 w-5 text-muted-foreground" />
        </button>
      </TableCell>
      <TableCell>
        <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-beige-100">
          {product.images && product.images.length > 0 ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Eye className="h-6 w-6 text-muted-foreground" />
            </div>
          )}
        </div>
      </TableCell>
      <TableCell className="font-sans font-medium">
        {product.name}
      </TableCell>
      <TableCell className="font-sans">
        {product.category ? (
          <Badge variant="outline" className="font-sans">
            {product.category}
          </Badge>
        ) : (
          <span className="text-muted-foreground text-sm">-</span>
        )}
      </TableCell>
      <TableCell className="font-sans">
        {formatPrice(Number(product.price))}
      </TableCell>
      <TableCell className="font-sans">
        <Badge
          variant={product.inStock ? "default" : "secondary"}
          className="font-sans"
        >
          {product.inStock ? "En Stock" : "Agotado"}
        </Badge>
      </TableCell>
      <TableCell>
        <Badge
          variant={product.featured ? "default" : "outline"}
          className="font-sans"
        >
          {product.featured ? "Destacado" : "-"}
        </Badge>
      </TableCell>
      <TableCell className="text-right">
        <div className="flex items-center justify-end gap-2">
          <Link href={`/admin/productos/${product.id}/editar`}>
            <Button variant="ghost" size="icon">
              <Pencil className="h-4 w-4" />
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(product.id)}
          >
            <Trash2 className="h-4 w-4 text-red-600" />
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
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <Table>
            <TableHeader>
              <TableRow className="bg-beige-100">
                <TableHead className="font-sans font-semibold w-12"></TableHead>
                <TableHead className="font-sans font-semibold">Imagen</TableHead>
                <TableHead className="font-sans font-semibold">Nombre</TableHead>
                <TableHead className="font-sans font-semibold">Categoría</TableHead>
                <TableHead className="font-sans font-semibold">Precio</TableHead>
                <TableHead className="font-sans font-semibold">Stock</TableHead>
                <TableHead className="font-sans font-semibold">Destacado</TableHead>
                <TableHead className="font-sans font-semibold text-right">
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
