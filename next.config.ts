import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    '/api/**/*': ['./prisma/.prisma/client/**/*'],
    '/*': ['./prisma/client/**/*'],
  },
};

export default nextConfig;
