/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    customKey: "testCustomKey",
    vercelUrl: "next-listify-v1-api.vercel.app"
  }
}

module.exports = nextConfig
