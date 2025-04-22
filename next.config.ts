import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['mgbqfocaamecvtmxwoia.supabase.co'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'mgbqfocaamecvtmxwoia.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};

export default nextConfig;
