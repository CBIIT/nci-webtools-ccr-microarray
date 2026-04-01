import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.API_BASE_URL || "http://localhost:9220"}/api/:path*`,
      },
      {
        source: "/images/:path*",
        destination: `${process.env.API_BASE_URL || "http://localhost:9220"}/images/:path*`,
      },
      {
        source: "/ping",
        destination: `${process.env.API_BASE_URL || "http://localhost:9220"}/ping`,
      },
    ];
  },
};

export default nextConfig;
