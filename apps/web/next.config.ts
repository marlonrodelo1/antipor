import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "standalone",
  // En monorepo con npm workspaces, Next debe trazar archivos desde la raiz
  // del repo para incluir los packages locales (@antiport/ai) en el bundle.
  outputFileTracingRoot: path.join(__dirname, "../.."),
};

export default nextConfig;
