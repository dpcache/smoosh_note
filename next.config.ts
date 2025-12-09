import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    '/*': ['./prisma/client/**/*'],
  },
};

export default nextConfig;
