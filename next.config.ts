import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [],
    remotePatterns: [
      // Add remote patterns here if needed
      // Example:
      // {
      //   protocol: 'https',
      //   hostname: 'example.com',
      //   port: '',
      //   pathname: '/images/**',
      // },
    ],
  },
  // Enable React strict mode for development
  reactStrictMode: true,
  // Disable x-powered-by header for security
  poweredByHeader: false,
  // Configure compression
  compress: true,
  // Configure i18n
  i18n: {
    locales: ['en-US'],
    defaultLocale: 'en-US',
  },
  // Optimize for search engines
  swcMinify: true,
  // Use trailing slashes for SEO benefits
  trailingSlash: true,
};

export default nextConfig;
