import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Define public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
  "/",
  "/inicio",
  "/productos(.*)",
  "/nuestras-tortas(.*)",
  "/nuestra-historia",
  "/valores-proposito",
  "/como-comprar",
  "/faq",
  "/contacto",
  "/checkout(.*)", // Guest checkout flow
  "/pedido-confirmado(.*)", // Order confirmation page
  "/auth/sign-in(.*)",
  "/auth/sign-up(.*)",
  "/acceso-denegado", // Access denied page
  "/api/webhooks(.*)", // All webhooks (Clerk, Wompi, etc.)
  "/api/products(.*)", // Public product API
  "/api/orders(.*)", // Public orders API for guest checkout
  "/api/shipping(.*)", // Public shipping calculation API
  "/api/wompi(.*)", // Wompi payment integration
  "/api/gallery(.*)", // Public gallery images API
  "/api/discount-popup(.*)", // Public discount popup API
  "/api/auth/check-role", // Allow access to role checking API
]);

export default clerkMiddleware(async (auth, request) => {
  // Protect all routes except public routes
  // Admin routes require authentication here, but email validation is done at page level
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
