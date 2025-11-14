/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost'],
  },
  // Enable SWC minification for better performance
  swcMinify: true,
  
  // Configure webpack for better CSS handling
  webpack: (config, { isServer }) => {
    // Add CSS loader configuration
    config.module.rules.push({
      test: /\.css$/,
      use: [
        'style-loader',
        {
          loader: 'css-loader',
          options: {
            importLoaders: 1,
            modules: false, // Disable CSS modules for global CSS
          },
        },
        'postcss-loader',
      ],
    });
    
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
    serverComponentsExternalPackages: ['@tremor/react'],
  },
  
  // Configure TypeScript
  typescript: {
    // Enable for production builds even with type errors (not recommended for production)
    ignoreBuildErrors: false,
  },
  
  // Configure ESLint
  eslint: {
    // Allow production builds even with ESLint errors
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
