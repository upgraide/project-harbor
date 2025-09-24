import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      new URL("https://aromatic-narwhal-876.convex.cloud/**"),
      new URL("https://placehold.co/**"),
    ],
  },
};

export default nextConfig;
