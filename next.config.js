/** @type {import('next').NextConfig} */
const nextConfig = {
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
  // Use trailing slashes for SEO benefits
  trailingSlash: true,
};

module.exports = nextConfig;
