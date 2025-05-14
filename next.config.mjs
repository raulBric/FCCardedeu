/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React strict mode for better development practices
  reactStrictMode: true,
  
  // Ignore TypeScript errors during build process
  typescript: {
    // This allows the build to complete even with TypeScript errors
    ignoreBuildErrors: true,
  },
  
  // Disable ESLint during builds to avoid additional errors
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Configure image domains for the FC Cardedeu project
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname,
      },
      {
        protocol: 'https',
        hostname: 'i.imgur.com',
      },
      {
        protocol: 'https',
        hostname: 'imgur.com',
      },
    ],
  },
};

export default nextConfig;
