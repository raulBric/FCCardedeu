import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['aiuizlmgicsqsrqdasgv.supabase.co'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'aiuizlmgicsqsrqdasgv.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};

export default nextConfig;
