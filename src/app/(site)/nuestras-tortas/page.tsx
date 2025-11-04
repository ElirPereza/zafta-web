import NuestrasTortasClient from "./NuestrasTortasClient";
import { generateMetadata as genMetadata } from "@/lib/metadata";

export const metadata = genMetadata({
  title: "Nuestras Tortas",
  description:
    "Explora nuestro catálogo de tortas artesanales: chocolate, frutas, celebraciones y personalizadas. Cada torta es única y hecha con amor en Bogotá.",
  path: "/nuestras-tortas",
  keywords: [
    "catálogo tortas",
    "tipos de tortas",
    "tortas chocolate",
    "tortas frutas",
    "tortas celebración",
    "menú",
  ],
});

export default function NuestrasTortasPage() {
  return <NuestrasTortasClient />;
}
