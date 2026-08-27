import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "5mb",
    },
  },
  outputFileTracingIncludes: {
    "/*": ["./content/**/*", "./package.json"],
  },
};

export default nextConfig;
