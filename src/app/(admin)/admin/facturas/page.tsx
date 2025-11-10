import { prisma } from "@/lib/prisma";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Download, Eye, FileText } from "lucide-react";
import Link from "next/link";

async function getInvoices() {
  const invoices = await prisma.invoice.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return invoices;
}

async function getInvoiceStats() {
  const [totalInvoices, paidInvoices, totalAmount] = await Promise.all([
    prisma.invoice.count(),
    prisma.invoice.count({
      where: {
        paidAt: {
          not: null,
        },
      },
    }),
    prisma.invoice.aggregate({
      where: {
        paidAt: {
          not: null,
        },
      },
      _sum: {
        total: true,
      },
    }),
  ]);

  return {
    totalInvoices,
    paidInvoices,
    totalAmount: totalAmount._sum.total || 0,
  };
}

function formatPrice(price: number | string) {
  const numPrice = typeof price === "string" ? parseFloat(price) : price;
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(numPrice);
}

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString("es-CO", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default async function InvoicesPage() {
  const [invoices, stats] = await Promise.all([
    getInvoices(),
    getInvoiceStats(),
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-sans font-semibold text-foreground">
          Facturas
        </h1>
        <p className="text-sm text-muted-foreground font-sans mt-1">
          Gestiona las facturas de los pedidos
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-[hsl(var(--beige-400))]">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium font-sans">
              Total Facturas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-sans">
              {stats.totalInvoices}
            </div>
          </CardContent>
        </Card>
        <Card className="border-[hsl(var(--beige-400))]">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium font-sans">
              Facturas Pagadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-sans">
              {stats.paidInvoices}
            </div>
          </CardContent>
        </Card>
        <Card className="border-[hsl(var(--beige-400))]">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium font-sans">
              Total Facturado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-sans">
              {formatPrice(Number(stats.totalAmount))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Invoices Table */}
      <Card className="border-[hsl(var(--beige-400))]">
        <CardHeader>
          <CardTitle className="font-sans">Lista de Facturas</CardTitle>
          <CardDescription className="font-sans">
            Todas las facturas generadas en el sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          {invoices.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-[hsl(var(--beige-400))] rounded-lg bg-[hsl(var(--beige-50))]">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-sans font-semibold text-foreground mb-2">
                No hay facturas
              </h3>
              <p className="text-sm text-muted-foreground font-sans">
                Las facturas se generarán automáticamente cuando se confirmen
                pedidos
              </p>
            </div>
          ) : (
            <div className="border border-[hsl(var(--beige-400))] rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-[hsl(var(--beige-100))]">
                    <TableHead className="font-sans font-semibold">
                      Número
                    </TableHead>
                    <TableHead className="font-sans font-semibold">
                      Cliente
                    </TableHead>
                    <TableHead className="font-sans font-semibold">
                      Fecha Emisión
                    </TableHead>
                    <TableHead className="font-sans font-semibold">
                      Total
                    </TableHead>
                    <TableHead className="font-sans font-semibold">
                      Estado
                    </TableHead>
                    <TableHead className="font-sans font-semibold text-right">
                      Acciones
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-sans font-medium">
                        {invoice.invoiceNumber}
                      </TableCell>
                      <TableCell className="font-sans">
                        <div>
                          <p className="font-medium">{invoice.customerName}</p>
                          <p className="text-sm text-muted-foreground">
                            {invoice.customerEmail}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="font-sans text-sm">
                        {formatDate(invoice.issuedAt)}
                      </TableCell>
                      <TableCell className="font-sans font-medium">
                        {formatPrice(Number(invoice.total))}
                      </TableCell>
                      <TableCell>
                        {invoice.paidAt ? (
                          <Badge
                            variant="outline"
                            className="font-sans bg-green-100 text-green-800 border-green-300"
                          >
                            Pagada
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="font-sans bg-yellow-100 text-yellow-800 border-yellow-300"
                          >
                            Pendiente
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/admin/pedidos/${invoice.orderId}`}>
                            <Button
                              variant="ghost"
                              size="icon"
                              title="Ver pedido"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          {invoice.pdfUrl && (
                            <a
                              href={invoice.pdfUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Button
                                variant="ghost"
                                size="icon"
                                title="Descargar PDF"
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                            </a>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
