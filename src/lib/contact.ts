// Canales de contacto oficiales de Zafta.
// La línea telefónica/WhatsApp anterior fue robada (nov 2026) y ya no se atiende,
// por eso la web solo publica Instagram y correo. Si hay un número nuevo,
// agregarlo aquí y volver a mostrarlo desde este archivo.

export const INSTAGRAM_HANDLE = "zafta_reposteria";
export const INSTAGRAM_URL = `https://instagram.com/${INSTAGRAM_HANDLE}`;
// Abre directamente el chat (DM) de Instagram con Zafta
export const INSTAGRAM_DM_URL = `https://ig.me/m/${INSTAGRAM_HANDLE}`;

export const CONTACT_EMAIL = "ventas@zaftareposteria.com";

export function mailtoUrl(subject: string, body?: string) {
  const params = new URLSearchParams({ subject });
  if (body) params.set("body", body);
  // URLSearchParams codifica espacios como "+", los clientes de correo esperan %20
  return `mailto:${CONTACT_EMAIL}?${params.toString().replace(/\+/g, "%20")}`;
}

/**
 * Abre el chat de Instagram. Instagram no permite precargar el texto como
 * WhatsApp, así que copiamos el mensaje al portapapeles para que el cliente
 * solo tenga que pegarlo. Devuelve true si se pudo copiar.
 */
export async function openInstagramChat(message?: string): Promise<boolean> {
  // Iniciar la copia mientras esta pestaña aún tiene el foco, y abrir la
  // ventana sin await de por medio para que el navegador no la bloquee.
  let copy: Promise<void> | null = null;
  if (message) {
    try {
      copy = navigator.clipboard.writeText(message);
    } catch {
      copy = null;
    }
  }
  // (sin "noopener" en features: con él window.open devuelve null siempre)
  const win = window.open(INSTAGRAM_DM_URL, "_blank");
  if (win) win.opener = null;

  let copied = false;
  if (copy) {
    try {
      await copy;
      copied = true;
    } catch {
      copied = false;
    }
  }
  if (!win) window.location.href = INSTAGRAM_DM_URL;
  return copied;
}
