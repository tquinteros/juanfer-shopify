import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ hostname: "cdn.shopify.com" }, { hostname: "eu-central-1.graphassets.com" }, { hostname: "www.lick.com" }],
  },
};

export default nextConfig;
