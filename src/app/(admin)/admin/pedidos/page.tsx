import { OrdersTable } from "@/components/admin/orders/OrdersTable";

export default function OrdersPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-gotham font-bold text-[hsl(var(--midnight-navy))] mb-2">
          Pedidos
        </h1>
        <p className="text-[hsl(var(--midnight-navy))]/70 font-sans text-base">
          Gestiona todos los pedidos de tu tienda
        </p>
      </div>

      {/* Orders Table */}
      <OrdersTable />
    </div>
  );
}
