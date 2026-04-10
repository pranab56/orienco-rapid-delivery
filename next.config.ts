import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverActions: {
      allowedOrigins: ['10.10.7.37', '192.168.1.202'],
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
      },
      {
        protocol: 'https',
        hostname: 'www.mamp.one',
      },
      {
        protocol: 'https',
        hostname: 't3.ftcdn.net',
      },
    ],
  },
};

export default nextConfig;
