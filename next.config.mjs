/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: false,
  },
  webpack: (config) => {
    // Avoid webpack warning about serializing big strings in filesystem cache
    config.cache = false
    return config
  },
}

export default nextConfig
