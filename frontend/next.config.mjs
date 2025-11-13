/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['localhost'],
    unoptimized: true, // For static export
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': new URL('src', import.meta.url).pathname,
    };
    return config;
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // For static export
  output: 'export',
  distDir: 'out',
  // Optional: Add basePath if your app is not served from the root
  // basePath: '/frontend',
};

export default nextConfig;
