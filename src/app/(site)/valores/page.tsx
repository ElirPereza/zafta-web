import ValuesSection from "@/components/sections/ValuesSection";

export const metadata = {
  title: "Valores y Propósito - Zafta Tortas Artesanales",
  description: "Descubre los valores que guían nuestro trabajo: calidad, tradición y amor en cada bocado.",
};

export default function ValoresPage() {
  return (
    <div className="pt-20">
      <ValuesSection />
    </div>
  );
}
