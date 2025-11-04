import InicioClient from "./InicioClient";
import { generateMetadata as genMetadata } from "@/lib/metadata";

export const metadata = genMetadata({
  title: "Inicio - Tortas Artesanales",
  description:
    "Descubre Zafta, tortas artesanales con más de 30 años de tradición familiar. Más que un postre, un legado auténtico. Chocolate, frutas, personalizadas y más.",
  path: "/inicio",
  keywords: [
    "tortas bogotá",
    "inicio",
    "home",
    "repostería artesanal",
    "mejor pastelería",
    "tortas caseras",
  ],
});

export default function InicioPage() {
  return <InicioClient />;
}
