// next.config.ts
import type { NextConfig } from 'next';
// Use a type-safe require to import the plugin, as it's typically a CommonJS module
const { PrismaPlugin } = require('@prisma/nextjs-monorepo-workaround-plugin');

const nextConfig: NextConfig = {
  // Your existing Next.js configuration settings go here...
  // For example:
  reactStrictMode: true,

  webpack: (config, { isServer }) => {
    // 💡 CRITICAL STEP: Apply the Prisma Plugin ONLY on the server build
    if (isServer) {
      config.plugins = [
        ...config.plugins,
        // The plugin ensures the Query Engine binary is copied into the Vercel function bundle.
        new PrismaPlugin(),
      ];
    }

    return config;
  },
};

export default nextConfig;