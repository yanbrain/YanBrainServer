/** @type {import('next').NextConfig} */
const path = require('path')

const nextConfig = {
  output: 'export',
  trailingSlash: true,
  transpilePackages: ['@yanbrain/shared'],
    experimental: {
        externalDir: true,
    },
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  },
  webpack: (config) => {
    config.resolve.alias['@yanbrain/shared'] = path.resolve(__dirname, '../shared/src')
    return config
  },
}

module.exports = nextConfig
