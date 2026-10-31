/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  experimental: {
    serverActions: {
      // A sale ad may carry 10 photos of up to 2 MB each (see `AD_IMAGE_MAX_COUNT`).
      bodySizeLimit: "25mb",
    },
  },
};

export default nextConfig;
