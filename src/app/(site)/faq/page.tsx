import FAQ from "@/components/sections/FAQ";
import { generateMetadata as genMetadata } from "@/lib/metadata";

export const metadata = genMetadata({
  title: "Preguntas Frecuentes",
  description:
    "Encuentra respuestas a las preguntas más comunes sobre nuestras tortas artesanales, pedidos, entregas, ingredientes y más.",
  path: "/faq",
  keywords: [
    "preguntas frecuentes",
    "dudas",
    "FAQ",
    "información",
    "ayuda",
    "pedidos",
  ],
});

export default function FAQPage() {
  return (
    <div className="pt-20">
      <FAQ />
    </div>
  );
}
