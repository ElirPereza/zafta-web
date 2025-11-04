import InstagramSection from "@/components/sections/InstagramSection";
import { generateMetadata as genMetadata } from "@/lib/metadata";

export const metadata = genMetadata({
  title: "Instagram",
  description:
    "Síguenos en Instagram (@zafta_reposteria) y descubre nuestras creaciones más recientes, momentos dulces y promociones especiales.",
  path: "/instagram",
  keywords: [
    "Instagram",
    "@zafta_reposteria",
    "redes sociales",
    "galería",
    "fotos tortas",
    "social media",
  ],
});

export default function InstagramPage() {
  return (
    <div className="pt-20">
      <InstagramSection />
    </div>
  );
}
