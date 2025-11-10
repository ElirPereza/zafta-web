import { OrdersTable } from "@/components/admin/orders/OrdersTable";

export default function OrdersPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-sans font-semibold text-foreground">
            Pedidos
          </h1>
          <p className="text-sm text-muted-foreground font-sans mt-1">
            Gestiona todos los pedidos de tu tienda
          </p>
        </div>
      </div>

      {/* Orders Table */}
      <OrdersTable />
    </div>
  );
}
