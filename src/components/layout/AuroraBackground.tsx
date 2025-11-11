"use client";

import { ReactNode } from "react";

interface AuroraBackgroundProps {
  children: ReactNode;
  className?: string;
}

/**
 * Aurora Dream ZAFTA Background Wrapper
 * Provides consistent gradient background across all pages
 * Uses brand colors: Rose Gold, Salmon, Melocotón, Burgundy
 */
export const AuroraBackground = ({
  children,
  className = "",
}: AuroraBackgroundProps) => {
  return (
    <div
      className={`relative ${className}`}
      style={{
        background: `
          radial-gradient(ellipse 80% 60% at 10% 35%, rgba(229, 176, 151, 0.40), transparent 70%),
          radial-gradient(ellipse 70% 55% at 50% 50%, rgba(255, 180, 162, 0.35), transparent 68%),
          radial-gradient(ellipse 65% 50% at 85% 70%, rgba(255, 225, 217, 0.38), transparent 65%),
          radial-gradient(ellipse 60% 48% at 75% 15%, rgba(244, 168, 159, 0.32), transparent 68%),
          radial-gradient(ellipse 55% 45% at 20% 80%, rgba(128, 1, 31, 0.15), transparent 70%),
          linear-gradient(135deg, #FFFBEF 0%, #FFF5ED 100%)
        `,
      }}
    >
      {children}
    </div>
  );
};
