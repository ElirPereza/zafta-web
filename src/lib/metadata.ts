import type { Metadata } from "next";

// Base site configuration
export const SITE_CONFIG = {
  name: "Zafta",
  title: "Zafta - Tortas Artesanales con Legado Familiar",
  description:
    "Más que un postre, un legado auténtico. Tortas artesanales hechas con amor y tradición familiar de más de 30 años en Bogotá, Colombia.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://zafta.com",
  ogImage: "/zafta_assets/hero-cake.jpg",
  keywords: [
    "tortas artesanales",
    "repostería",
    "pastelería",
    "tortas Bogotá",
    "tortas personalizadas",
    "postres artesanales",
    "repostería colombiana",
    "tortas de celebración",
    "tortas de chocolate",
    "tortas de frutas",
    "zafta",
    "legado familiar",
    "tradición repostera",
  ],
  contact: {
    phone: "+57 300 123 4567",
    whatsapp: "573001234567",
    email: "hola@zafta.com",
    instagram: "@zafta_reposteria",
  },
};

// Generate structured metadata for a page
export function generateMetadata({
  title,
  description,
  path = "/",
  keywords = [],
  image,
  noIndex = false,
}: {
  title?: string;
  description?: string;
  path?: string;
  keywords?: string[];
  image?: string;
  noIndex?: boolean;
}): Metadata {
  const pageTitle = title
    ? `${title} | ${SITE_CONFIG.name}`
    : SITE_CONFIG.title;
  const pageDescription = description || SITE_CONFIG.description;
  const pageUrl = `${SITE_CONFIG.url}${path}`;
  const pageImage = image
    ? `${SITE_CONFIG.url}${image}`
    : `${SITE_CONFIG.url}${SITE_CONFIG.ogImage}`;

  const allKeywords = [
    ...SITE_CONFIG.keywords,
    ...keywords,
  ];

  return {
    title: pageTitle,
    description: pageDescription,
    keywords: allKeywords,
    authors: [{ name: SITE_CONFIG.name }],
    creator: SITE_CONFIG.name,
    publisher: SITE_CONFIG.name,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
    openGraph: {
      type: "website",
      locale: "es_CO",
      url: pageUrl,
      title: pageTitle,
      description: pageDescription,
      siteName: SITE_CONFIG.name,
      images: [
        {
          url: pageImage,
          width: 1200,
          height: 630,
          alt: pageTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: pageDescription,
      images: [pageImage],
      creator: SITE_CONFIG.contact.instagram,
    },
    alternates: {
      canonical: pageUrl,
    },
    category: "food",
  };
}

// Generate JSON-LD structured data for organization
export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Bakery",
    name: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    url: SITE_CONFIG.url,
    logo: `${SITE_CONFIG.url}/SVG/logo-header.svg`,
    image: `${SITE_CONFIG.url}${SITE_CONFIG.ogImage}`,
    telephone: SITE_CONFIG.contact.phone,
    email: SITE_CONFIG.contact.email,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Bogotá",
      addressCountry: "CO",
    },
    sameAs: [
      `https://instagram.com/${SITE_CONFIG.contact.instagram.replace("@", "")}`,
      `https://wa.me/${SITE_CONFIG.contact.whatsapp}`,
    ],
    servesCuisine: "Repostería Artesanal",
    priceRange: "$$",
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "18:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Saturday"],
        opens: "09:00",
        closes: "14:00",
      },
    ],
  };
}

// Generate JSON-LD structured data for breadcrumbs
export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE_CONFIG.url}${item.url}`,
    })),
  };
}
