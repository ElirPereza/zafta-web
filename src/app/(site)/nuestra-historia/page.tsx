import OurStory from "@/components/sections/OurStory";

export const metadata = {
  title: "Nuestra Historia y Valores - Zafta Tortas Artesanales",
  description: "Conoce la historia de Zafta, más de 30 años de tradición familiar en repostería artesanal. Descubre nuestros valores, misión y visión.",
};

export default function NuestraHistoriaPage() {
  return (
    <div className="pt-20">
      <OurStory />
    </div>
  );
}
