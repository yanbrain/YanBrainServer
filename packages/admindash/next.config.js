/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  trailingSlash: true,
  transpilePackages: ['@yanbrain/shared'],
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_CLOUD_FUNCTIONS_URL: process.env.NEXT_PUBLIC_CLOUD_FUNCTIONS_URL,
    NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  },
}

module.exports = nextConfig
