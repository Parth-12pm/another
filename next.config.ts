/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:8000/api/:path*",
      },
      {
        source: "/verify-migration/:path*",
        destination: "http://localhost:8000/verify-migration/:path*",
      },
    ];
  },
};

module.exports = nextConfig;
