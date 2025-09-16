import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  transpilePackages: [
    "@harbor-app/ui",
    "@harbor-app/location",
    "@harbor-app/backend",
  ],
  images: {
    remotePatterns: [new URL("https://glad-roadrunner-639.convex.cloud/**")],
  },
};

export default nextConfig;
