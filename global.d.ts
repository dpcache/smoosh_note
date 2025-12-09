declare module "@prisma/nextjs-monorepo-workaround-plugin" {
  import type { NextConfig } from "next";

  export function withNextjsMonorepoWorkaround(config: NextConfig): NextConfig;
}