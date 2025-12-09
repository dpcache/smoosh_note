// next.config.ts
import type { NextConfig } from "next";
import { withNextjsMonorepoWorkaround } from "@prisma/nextjs-monorepo-workaround-plugin";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // your other config here
};

export default withNextjsMonorepoWorkaround(nextConfig);