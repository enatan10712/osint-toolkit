/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost'],
  },
  // Enable SWC minification for better performance
  swcMinify: true,
  // Configure webpack
  webpack: (config, { isServer }) => {
    // Important: return the modified config
    return config;
  },
  // Environment variables
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  },
  // Rewrite API routes for both development and production
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/:path*`,
      },
    ];
  },
  // Add output: 'standalone' for better compatibility with Vercel
  output: 'standalone',
  // Enable React 18 concurrent features
  experimental: {
    appDir: true,
    serverComponentsExternalPackages: ['@tremor/react'],
  },
  // Configure TypeScript
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: false,
  },
  // Configure ESLint
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
