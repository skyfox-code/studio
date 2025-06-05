
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  experimental: {
    // Add the allowedDevOrigins configuration here
    allowedDevOrigins: [
      "https://*.cluster-c3a7z3wnwzapkx3rfr5kz62dac.cloudworkstations.dev",
      // You can add more trusted origins if needed
    ],
  },
};

export default nextConfig;
