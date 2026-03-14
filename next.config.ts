import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/hadith",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
