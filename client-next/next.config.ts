import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  experimental: {
    proxyTimeout: 1000 * 60 * 15, // 15 minutes — matching reference project
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:9220"}/api/:path*`,
      },
      {
        source: "/images/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:9220"}/images/:path*`,
      },
      {
        source: "/api/ping",
        destination: `${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:9220"}/ping`,
      },
    ];
  },
};

export default nextConfig;
