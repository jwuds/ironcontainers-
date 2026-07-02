import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(__dirname),
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "www.conexdepot.com" },
      { protocol: "https", hostname: "conexdepotshipping.com" },
    ],
  },
};

export default nextConfig;
