import HowToBuy from "@/components/sections/HowToBuy";
import { generateMetadata as genMetadata } from "@/lib/metadata";

export const metadata = genMetadata({
  title: "Cómo Comprar",
  description:
    "Descubre cómo hacer tu pedido de tortas artesanales en Zafta. Proceso simple, rápido y seguro. Entregamos en Bogotá y alrededores.",
  path: "/como-comprar",
  keywords: [
    "hacer pedido",
    "cómo ordenar",
    "proceso de compra",
    "entrega domicilio",
    "guía de compra",
  ],
});

export default function ComoComprarPage() {
  return <HowToBuy />;
}
