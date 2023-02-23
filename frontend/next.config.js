/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    RPC_URL: process.env.PROVIDER || "http://127.0.0.1:8545",
    NETWORK_ID: process.env.NETWORK_ID || 1337,
    FAUCET_URL: process.env.FAUCET_URL || "http://localhost:8080",
  }
}

module.exports = nextConfig
