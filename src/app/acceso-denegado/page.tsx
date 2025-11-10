import { ShieldX } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { generateMetadata as genMetadata } from "@/lib/metadata";

export const metadata = genMetadata({
  title: "Acceso Denegado",
  description: "No tienes permisos para acceder a esta área.",
  path: "/acceso-denegado",
  noIndex: true,
});

export default function AccesoDenegadoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[hsl(var(--beige-50))] via-[hsl(var(--rose-gold))]/5 to-[hsl(var(--beige-100))] flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        <div className="mb-8 flex justify-center">
          <div className="rounded-full bg-destructive/10 p-6">
            <ShieldX className="h-16 w-16 text-destructive" />
          </div>
        </div>

        <h1 className="text-4xl font-sans italic mb-4 text-foreground">
          Acceso Denegado
        </h1>

        <p className="text-lg text-muted-foreground font-sans mb-8 leading-relaxed">
          No tienes permisos para acceder al panel de administración.
        </p>

        <div className="space-y-4">
          <Link href="/inicio">
            <Button size="lg" className="w-full">
              Volver al Inicio
            </Button>
          </Link>

          <p className="text-sm text-muted-foreground font-sans">
            Si crees que deberías tener acceso, contacta al administrador del
            sitio.
          </p>
        </div>
      </div>
    </div>
  );
}
