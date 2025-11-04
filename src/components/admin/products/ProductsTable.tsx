"use client";

import type { Product } from "@prisma/client";
import { Eye, Pencil, Trash2 } from "lucide-react";
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

export function ProductsTable() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = useCallback(async () => {
    try {
      const response = await fetch("/api/products");
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

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
        <h3 className="text-lg font-serif font-semibold text-foreground mb-2">
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
    <div className="border border-beige-400 rounded-lg overflow-hidden bg-white">
      <Table>
        <TableHeader>
          <TableRow className="bg-beige-100">
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
          {products.map((product) => (
            <TableRow key={product.id}>
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
                <Badge variant="outline" className="font-sans">
                  {product.category}
                </Badge>
              </TableCell>
              <TableCell className="font-sans">
                {formatPrice(product.price)}
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
                    onClick={() => handleDelete(product.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
