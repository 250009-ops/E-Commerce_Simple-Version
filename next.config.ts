import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "plus.unsplash.com",
        pathname: "/**",
      },
    ],
  },
  async redirects() {
    return [
      { source: "/products", destination: "/inventory", permanent: true },
      { source: "/products/:slug", destination: "/inventory/:slug", permanent: true },
      { source: "/cart", destination: "/pick-list", permanent: true },
      { source: "/checkout", destination: "/dispatch", permanent: true },
      { source: "/orders", destination: "/movements", permanent: true },
    ];
  },
};

export default nextConfig;
