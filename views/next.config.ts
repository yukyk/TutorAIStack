import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Prevent webpack from bundling these packages — they use native bindings
  serverExternalPackages: ['mysql2', 'bcryptjs'],
};

export default nextConfig;
