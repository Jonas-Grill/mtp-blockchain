/** @type {import('next').NextConfig} */
require("dotenv").config()
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    RPC_URL: "http://127.0.0.1:8545",
    NETWORK_ID: "1337",
  }
}

module.exports = nextConfig
