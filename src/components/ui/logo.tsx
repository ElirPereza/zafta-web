import Image from "next/image";
import { cn } from "@/lib/utils";

export type LogoVariant =
  | "header"
  | "banner"
  | "banner-color-1"
  | "isotipo-burgundy"
  | "isotipo-rose"
  | "zafta-text"
  | "isotipo-optimized";

interface LogoProps {
  variant?: LogoVariant;
  className?: string;
  width?: number;
  height?: number;
}

/**
 * Logo component for ZAFTA brand
 *
 * Variants:
 * - header: Burgundy logo with text + tagline + isotipo (for light backgrounds like ivory)
 * - banner: Ivory/cream logo with text + tagline + isotipo (for dark backgrounds like burgundy/navy)
 * - banner-color-1: Complete logo with cake, ZAFTA text and tagline (burgundy color)
 * - isotipo-burgundy: Just the books icon in burgundy (for favicon, small spaces)
 * - isotipo-rose: Just the books icon in rose gold (for decorative elements)
 * - isotipo-optimized: Optimized cake icon with tight viewBox (no extra whitespace)
 * - zafta-text: Just the ZAFTA text with tight viewBox (no extra whitespace)
 */
export function Logo({
  variant = "header",
  className,
  width,
  height,
}: LogoProps) {
  const logoSources: Record<LogoVariant, string> = {
    header: "/SVG/logo-header.svg",
    banner: "/SVG/logo-banner.svg",
    "banner-color-1": "/SVG/logo-banner_color-1.svg",
    "isotipo-burgundy": "/SVG/logos-10.svg",
    "isotipo-rose": "/SVG/logos-11.svg",
    "isotipo-optimized": "/SVG/isotipo-optimized.svg",
    "zafta-text": "/SVG/zafta-optimized.svg",
  };

  // Default dimensions based on variant
  const defaultDimensions: Record<
    LogoVariant,
    { width: number; height: number }
  > = {
    header: { width: 180, height: 145 },
    banner: { width: 180, height: 145 },
    "banner-color-1": { width: 200, height: 162 },
    "isotipo-burgundy": { width: 80, height: 65 },
    "isotipo-rose": { width: 80, height: 65 },
    "isotipo-optimized": { width: 80, height: 70 },
    "zafta-text": { width: 180, height: 42 },
  };

  const dimensions = {
    width: width || defaultDimensions[variant].width,
    height: height || defaultDimensions[variant].height,
  };

  return (
    <Image
      src={logoSources[variant]}
      alt="ZAFTA - Repostería & Panadería"
      width={dimensions.width}
      height={dimensions.height}
      className={cn("object-contain", className)}
      priority={variant === "header" || variant === "banner"}
    />
  );
}
