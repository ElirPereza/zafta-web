import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "mepbpnfghvmmycbqhbfy.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "mepbpnfghvmmycbqhbfy.supabase.co",
        port: "",
        pathname: "/storage/v1/object/sign/**",
      },
    ],
  },
};

export default nextConfig;
