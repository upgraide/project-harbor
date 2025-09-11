import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  transpilePackages: [
    "@harbor-app/ui",
    "@harbor-app/location",
    "@harbor-app/backend",
  ],
};

export default nextConfig;
