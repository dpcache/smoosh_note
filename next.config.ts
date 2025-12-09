// next.config.ts
import type { NextConfig } from 'next';
const { PrismaPlugin } = require('@prisma/nextjs-monorepo-workaround-plugin');

const nextConfig: NextConfig = {
  // 💡 NEW SETTING: Explicitly disable Turbopack for the compiler
  compiler: {
    // Setting this to true forces Next.js to use Webpack for the build
    // where your custom configuration can take effect.
    // NOTE: This might slightly increase build time compared to Turbopack.
    reactRemoveProperties: true, // You may already have this or similar settings
  },
  
  // Your existing Next.js configuration settings...
  reactStrictMode: true,

  webpack: (config, { isServer }) => {
    if (isServer) {
      config.plugins = [
        ...config.plugins,
        new PrismaPlugin(),
      ];
    }
    return config;
  },
};

export default nextConfig;