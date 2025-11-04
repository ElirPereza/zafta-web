import ValuesSection from "@/components/sections/ValuesSection";
import { generateMetadata as genMetadata } from "@/lib/metadata";

export const metadata = genMetadata({
  title: "Valores y Propósito",
  description:
    "Descubre los valores que guían nuestro trabajo en Zafta: calidad, tradición, amor y creatividad en cada bocado. Conoce nuestra misión y visión.",
  path: "/valores",
  keywords: [
    "valores Zafta",
    "misión",
    "visión",
    "calidad artesanal",
    "tradición",
    "propósito",
  ],
});

export default function ValoresPage() {
  return (
    <div className="pt-20">
      <ValuesSection />
    </div>
  );
}
