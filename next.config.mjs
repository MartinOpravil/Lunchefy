/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "efficient-jellyfish-588.convex.cloud",
      },
    ],
  },
};

export default nextConfig;
