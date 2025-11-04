import OurStory from "@/components/sections/OurStory";
import { generateMetadata as genMetadata } from "@/lib/metadata";

export const metadata = genMetadata({
  title: "Nuestra Historia",
  description:
    "Conoce la historia de Zafta, más de 30 años de tradición familiar en repostería artesanal. Desde 1985 con Fanny Wagner hasta hoy. Descubre nuestro legado.",
  path: "/nuestra-historia",
  keywords: [
    "historia Zafta",
    "tradición familiar",
    "Fanny Wagner",
    "30 años",
    "legado repostero",
    "timeline",
  ],
  image: "/timeline/2024.jpg",
});

export default function NuestraHistoriaPage() {
  return (
    <div className="pt-20">
      <OurStory />
    </div>
  );
}
