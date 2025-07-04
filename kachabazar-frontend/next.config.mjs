/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      }
    ],
    domains: ['t4.ftcdn.net', 'localhost', '127.0.0.1'],
  },
  experimental: {
    suppressHydrationWarning: true,
  },
};

export default nextConfig;
