import InstagramSection from "@/components/sections/InstagramSection";

export const metadata = {
  title: "Instagram - Zafta Tortas Artesanales",
  description: "Síguenos en Instagram y descubre nuestras creaciones más recientes. @zafta_reposteria",
};

export default function InstagramPage() {
  return (
    <div className="pt-20">
      <InstagramSection />
    </div>
  );
}
