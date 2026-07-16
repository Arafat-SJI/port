/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      // CV uploads up to 5MB + multipart overhead; About images up to 3MB
      bodySizeLimit: "6mb",
    },
  },
};

export default nextConfig;
