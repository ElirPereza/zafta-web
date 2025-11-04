import CheckoutClient from "./CheckoutClient";
import { generateMetadata as genMetadata } from "@/lib/metadata";

export const metadata = genMetadata({
  title: "Checkout - Finalizar Pedido",
  description: "Completa tu pedido de tortas artesanales Zafta. Pago seguro y entrega confiable.",
  path: "/checkout",
  noIndex: true, // No indexar página de checkout
});

export default function CheckoutPage() {
  return <CheckoutClient />;
}
