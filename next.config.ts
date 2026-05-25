import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: [
        '10.10.7.37',
        '192.168.1.202',
        'oriencorapiddelivery.com',        // ← এটা যোগ করুন
        'www.oriencorapiddelivery.com',    // ← এটা যোগ করুন
      ],
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
        hostname: 'assets.oriencoinc.com',
      },
      {
        protocol: 'https',
        hostname: 't3.ftcdn.net',
      },
    ],
  },
};

export default nextConfig;