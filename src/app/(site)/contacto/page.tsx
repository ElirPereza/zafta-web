import { Phone, Instagram } from "lucide-react";
import { FaTiktok } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { generateMetadata as genMetadata } from "@/lib/metadata";

export const metadata = genMetadata({
  title: "Contacto",
  description:
    "Contáctanos por WhatsApp, Instagram o TikTok para hacer tu pedido o resolver tus dudas. Estamos en Bogotá, Colombia. Respuesta rápida garantizada.",
  path: "/contacto",
  keywords: [
    "contacto",
    "WhatsApp",
    "Instagram",
    "TikTok",
    "teléfono",
    "hacer pedido",
    "atención al cliente",
  ],
});

export default function ContactoPage() {
  return (
    <div className="pt-20 min-h-screen bg-background">
      <section className="py-32 px-6 md:px-8">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="mb-6 text-4xl md:text-5xl italic text-foreground">
            Contáctanos
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground font-sans mb-12 leading-relaxed">
            Estamos aquí para hacer realidad tu torta perfecta. Escríbenos y te
            responderemos lo antes posible.
          </p>

          <div className="grid md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <a
              href="https://wa.me/573217590897"
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <div className="p-8 bg-card rounded-2xl shadow-soft hover:shadow-warm transition-all duration-300 hover:-translate-y-1">
                <Phone className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-sans italic mb-2">WhatsApp</h3>
                <p className="text-muted-foreground mb-4">+57 321 759 0897</p>
                <Button variant="default" className="w-full">
                  Enviar mensaje
                </Button>
              </div>
            </a>

            <a
              href="https://instagram.com/zafta_reposteria"
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <div className="p-8 bg-card rounded-2xl shadow-soft hover:shadow-warm transition-all duration-300 hover:-translate-y-1">
                <Instagram className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-sans italic mb-2">Instagram</h3>
                <p className="text-muted-foreground mb-4">@zafta_reposteria</p>
                <Button variant="default" className="w-full">
                  Seguir
                </Button>
              </div>
            </a>

            <a
              href="https://www.tiktok.com/@zafta_reposteria"
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <div className="p-8 bg-card rounded-2xl shadow-soft hover:shadow-warm transition-all duration-300 hover:-translate-y-1">
                <FaTiktok className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-sans italic mb-2">TikTok</h3>
                <p className="text-muted-foreground mb-4">@zafta_reposteria</p>
                <Button variant="default" className="w-full">
                  Seguir
                </Button>
              </div>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
