import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  experimental: {
    proxyTimeout: 1000 * 60 * 15, // 15 minutes — matching reference project
    proxyClientMaxBodySize: Infinity, // no upload size limit, matching legacy behavior
  },
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
    ];
  },
};

export default nextConfig;
