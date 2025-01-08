/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Don't bundle server-only modules on the client side
      config.resolve.fallback = {
        ...config.resolve.fallback,
        '@elastic/elasticsearch': false,
      };
    }
    return config;
  },
};

module.exports = nextConfig; 