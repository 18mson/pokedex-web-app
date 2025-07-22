import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: { unoptimized: true },
  experimental: {
    scrollRestoration: true
  },
};

export default nextConfig;
