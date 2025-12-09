import type { NextConfig } from "next";
import { withNextjsMonorepoWorkaround } from "@prisma/nextjs-monorepo-workaround-plugin";

const nextConfig: NextConfig = {
  /* your existing config options */
};

export default withNextjsMonorepoWorkaround(nextConfig);