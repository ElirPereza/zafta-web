"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Store,
  Mail,
  CreditCard,
  Package,
  Instagram,
  Save,
} from "lucide-react";
import { useState } from "react";

export default function SettingsPage() {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    // TODO: Implement save functionality
    setTimeout(() => {
      setIsSaving(false);
    }, 1000);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-serif font-semibold text-foreground">
          Configuración
        </h1>
        <p className="text-sm text-muted-foreground font-sans mt-1">
          Administra la configuración general de tu tienda
        </p>
      </div>

      {/* Store Information */}
      <Card className="border-[hsl(var(--beige-400))]">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Store className="h-5 w-5 text-primary" />
            <CardTitle className="font-serif">
              Información de la Tienda
            </CardTitle>
          </div>
          <CardDescription className="font-sans">
            Datos básicos de tu negocio
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="storeName" className="font-sans">
                Nombre de la Tienda
              </Label>
              <Input
                id="storeName"
                defaultValue="ZAFTA"
                className="font-sans"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="storeEmail" className="font-sans">
                Email de Contacto
              </Label>
              <Input
                id="storeEmail"
                type="email"
                placeholder="contacto@zafta.com"
                className="font-sans"
              />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="storePhone" className="font-sans">
                Teléfono
              </Label>
              <Input
                id="storePhone"
                type="tel"
                placeholder="+57 300 123 4567"
                className="font-sans"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="storeWhatsapp" className="font-sans">
                WhatsApp
              </Label>
              <Input
                id="storeWhatsapp"
                type="tel"
                placeholder="+57 300 123 4567"
                className="font-sans"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="storeAddress" className="font-sans">
              Dirección
            </Label>
            <Input
              id="storeAddress"
              placeholder="Calle 123 #45-67, Bogotá"
              className="font-sans"
            />
          </div>
        </CardContent>
      </Card>

      {/* Social Media */}
      <Card className="border-[hsl(var(--beige-400))]">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Instagram className="h-5 w-5 text-primary" />
            <CardTitle className="font-serif">Redes Sociales</CardTitle>
          </div>
          <CardDescription className="font-sans">
            Enlaces a tus perfiles en redes sociales
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="instagram" className="font-sans">
                Instagram
              </Label>
              <Input
                id="instagram"
                placeholder="@zafta"
                className="font-sans"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="facebook" className="font-sans">
                Facebook
              </Label>
              <Input
                id="facebook"
                placeholder="facebook.com/zafta"
                className="font-sans"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Shipping Configuration */}
      <Card className="border-[hsl(var(--beige-400))]">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            <CardTitle className="font-serif">
              Configuración de Envíos
            </CardTitle>
          </div>
          <CardDescription className="font-sans">
            Gestiona las opciones de envío y tarifas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="freeShippingThreshold" className="font-sans">
                Envío Gratis Desde (COP)
              </Label>
              <Input
                id="freeShippingThreshold"
                type="number"
                defaultValue="200000"
                className="font-sans"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="baseShippingCost" className="font-sans">
                Costo Base de Envío (COP)
              </Label>
              <Input
                id="baseShippingCost"
                type="number"
                defaultValue="15000"
                className="font-sans"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="shippingZones" className="font-sans">
              Zonas de Envío Disponibles
            </Label>
            <Input
              id="shippingZones"
              placeholder="Bogotá, Medellín, Cali..."
              className="font-sans"
            />
          </div>
        </CardContent>
      </Card>

      {/* Payment Configuration */}
      <Card className="border-[hsl(var(--beige-400))]">
        <CardHeader>
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" />
            <CardTitle className="font-serif">Métodos de Pago</CardTitle>
          </div>
          <CardDescription className="font-sans">
            Configuración de pasarelas de pago
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-[hsl(var(--beige-400))] rounded-lg">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-[hsl(var(--beige-200))] rounded-lg flex items-center justify-center">
                  <CreditCard className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-sans font-medium">Wompi</p>
                  <p className="text-sm text-muted-foreground font-sans">
                    Tarjetas de crédito y débito
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="font-sans">
                Configurar
              </Button>
            </div>
            <div className="p-4 bg-[hsl(var(--beige-100))] rounded-lg">
              <p className="text-sm text-muted-foreground font-sans">
                Las credenciales de Wompi se configuran en las variables de
                entorno del proyecto. Consulta la documentación en{" "}
                <code className="font-mono">docs/WOMPI_SETUP.md</code>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Email Notifications */}
      <Card className="border-[hsl(var(--beige-400))]">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-primary" />
            <CardTitle className="font-serif">
              Notificaciones por Email
            </CardTitle>
          </div>
          <CardDescription className="font-sans">
            Configura los emails de notificación
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="notificationEmail" className="font-sans">
              Email de Notificaciones
            </Label>
            <Input
              id="notificationEmail"
              type="email"
              placeholder="admin@zafta.com"
              className="font-sans"
            />
            <p className="text-xs text-muted-foreground font-sans">
              Recibirás notificaciones de nuevos pedidos en este email
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end gap-4 pt-4 border-t border-[hsl(var(--beige-400))]">
        <Button variant="outline" className="font-sans" disabled={isSaving}>
          Cancelar
        </Button>
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="font-sans gap-2"
        >
          <Save className="h-4 w-4" />
          {isSaving ? "Guardando..." : "Guardar Cambios"}
        </Button>
      </div>

      {/* Info Notice */}
      <Card className="border-[hsl(var(--beige-400))] bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <p className="text-sm text-blue-900 font-sans">
            <strong>Nota:</strong> Esta página de configuración está en
            desarrollo. Actualmente, la mayoría de las configuraciones se
            gestionan a través de variables de entorno. Consulta la
            documentación del proyecto para más detalles.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
