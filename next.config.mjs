/** @type {import('next').NextConfig} */

const nextConfig = {
  // Optional: Add rewrites if you want to simplify accessing the GraphQL endpoint
  async rewrites() {
    return [
      {
        source: '/graphql',
        destination: '/api/graphql', // Redirects /graphql to /api/graphql
      },
    ];
  },
  webpack(config, { isServer }) {
    // Suppress warnings about critical dependency in Sequelize
    if (isServer) {
      config.ignoreWarnings = [
        (warning) => warning.message.includes("Critical dependency: the request of a dependency is an expression"),
      ];
    }
    return config;
  },
};

export default nextConfig;
