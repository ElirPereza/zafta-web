"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";

interface WompiCheckoutProps {
  orderId: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

declare global {
  interface Window {
    WidgetCheckout: any;
  }
}

export function WompiCheckout({
  orderId,
  onSuccess,
  onError,
}: WompiCheckoutProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const checkoutRef = useRef<any>(null);

  useEffect(() => {
    // Cargar el script de Wompi
    const script = document.createElement("script");
    script.src = "https://checkout.wompi.co/widget.js";
    script.async = true;

    script.onload = async () => {
      try {
        // Inicializar transacción con nuestra API
        const response = await fetch("/api/wompi/init-transaction", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId }),
        });

        if (!response.ok) {
          throw new Error("Error al inicializar transacción");
        }

        const data = await response.json();

        // Crear instancia del Widget de Wompi
        if (window.WidgetCheckout) {
          checkoutRef.current = new window.WidgetCheckout({
            currency: data.currency,
            amountInCents: data.amountInCents,
            reference: data.reference,
            publicKey: data.publicKey,
            signature: data.signature,
            redirectUrl: data.redirectUrl,
            customerData: {
              email: data.customerEmail,
              fullName: data.customerName,
              phoneNumber: data.customerPhone,
            },
          });

          setLoading(false);
        }
      } catch (err) {
        console.error("Error loading Wompi:", err);
        const errorMsg =
          err instanceof Error ? err.message : "Error al cargar Wompi";
        setError(errorMsg);
        if (onError) onError(errorMsg);
        setLoading(false);
      }
    };

    script.onerror = () => {
      const errorMsg = "Error al cargar el script de Wompi";
      setError(errorMsg);
      if (onError) onError(errorMsg);
      setLoading(false);
    };

    document.body.appendChild(script);

    return () => {
      // Cleanup
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [orderId, onError]);

  const handlePayment = () => {
    if (checkoutRef.current) {
      checkoutRef.current.open((result: any) => {
        if (result.transaction) {
          console.log("Transaction:", result.transaction);
          if (onSuccess) onSuccess();
        }
      });
    }
  };

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg font-sans text-sm">
        {error}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-3 text-muted-foreground font-sans">
          Cargando método de pago...
        </span>
      </div>
    );
  }

  return (
    <div ref={containerRef}>
      <button
        type="button"
        onClick={handlePayment}
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-sans font-medium py-3 px-4 rounded-lg transition-colors"
      >
        Pagar con Wompi
      </button>
    </div>
  );
}
