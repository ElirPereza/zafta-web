import { Mail, Instagram } from "lucide-react";
import { FaTiktok, FaFacebook } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { CONTACT_EMAIL, INSTAGRAM_DM_URL, mailtoUrl } from "@/lib/contact";
import { generateMetadata as genMetadata } from "@/lib/metadata";

export const metadata = genMetadata({
  title: "Contacto",
  description:
    "Contáctanos por Instagram, correo, TikTok o Facebook para hacer tu pedido o resolver tus dudas. Estamos en Bogotá, Colombia.",
  path: "/contacto",
  keywords: [
    "contacto",
    "Instagram",
    "TikTok",
    "Facebook",
    "correo",
    "hacer pedido",
    "atención al cliente",
  ],
});

export default function ContactoPage() {
  return (
    <div className="pt-20 min-h-screen bg-background">
      <section className="py-32 px-6 md:px-8">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="mb-6 text-4xl md:text-5xl text-foreground">
            Contáctanos
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground font-sans mb-12 leading-relaxed">
            Estamos aquí para hacer realidad tu torta perfecta. Escríbenos y te
            responderemos lo antes posible.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
            <a
              href={INSTAGRAM_DM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <div className="p-8 bg-card rounded-2xl shadow-soft hover:shadow-warm transition-all duration-300 hover:-translate-y-1">
                <Instagram className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-gotham font-semibold mb-2">
                  Instagram
                </h3>
                <p className="text-muted-foreground mb-4">@zafta_reposteria</p>
                <Button variant="default" className="w-full">
                  Enviar mensaje
                </Button>
              </div>
            </a>

            <a href={mailtoUrl("Contacto desde la web")} className="block">
              <div className="p-8 bg-card rounded-2xl shadow-soft hover:shadow-warm transition-all duration-300 hover:-translate-y-1">
                <Mail className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-gotham font-semibold mb-2">
                  Correo
                </h3>
                <p className="text-muted-foreground mb-4 break-all text-sm">
                  {CONTACT_EMAIL}
                </p>
                <Button variant="default" className="w-full">
                  Escribir correo
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
                <h3 className="text-xl font-gotham font-semibold mb-2">
                  TikTok
                </h3>
                <p className="text-muted-foreground mb-4">@zafta_reposteria</p>
                <Button variant="default" className="w-full">
                  Seguir
                </Button>
              </div>
            </a>

            <a
              href="https://www.facebook.com/zaftareposteria"
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <div className="p-8 bg-card rounded-2xl shadow-soft hover:shadow-warm transition-all duration-300 hover:-translate-y-1">
                <FaFacebook className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-gotham font-semibold mb-2">
                  Facebook
                </h3>
                <p className="text-muted-foreground mb-4">@zaftareposteria</p>
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
