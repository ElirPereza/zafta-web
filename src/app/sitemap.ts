import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://zafta.com";

// Make sitemap dynamic to avoid build-time DB access issues
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static routes
  const staticRoutes = [
    {
      url: `${SITE_URL}/inicio`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 1,
    },
    {
      url: `${SITE_URL}/productos`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/nuestras-tortas`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/nuestra-historia`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/valores`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/como-comprar`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/faq`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/contacto`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/instagram`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.5,
    },
  ];

  // Dynamic routes - Products (if we want individual product pages in the future)
  // For now, we're using a product gallery, so we don't have individual product pages
  // But we can fetch products from database for potential future use
  let productRoutes: MetadataRoute.Sitemap = [];

  try {
    const products = await prisma.product.findMany({
      where: {
        inStock: true,
      },
      select: {
        slug: true,
        updatedAt: true,
      },
      take: 100, // Limit to avoid huge sitemaps
    });

    // Uncomment this when/if we have individual product pages
    /*
    productRoutes = products.map((product) => ({
      url: `${SITE_URL}/productos/${product.slug}`,
      lastModified: product.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));
    */
  } catch (error) {
    console.error("Error fetching products for sitemap:", error);
    // Continue without product routes if there's an error
  }

  return [...staticRoutes, ...productRoutes];
}
