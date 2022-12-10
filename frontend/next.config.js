/** @type {import('next').NextConfig} */
require("dotenv").config()
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    RPC_URL: "http://127.0.0.1:8545",
    COINBASE_ADDRESS: "0x917441412223Ac1104617Ca07ca9853504BEA5d0",
    NETWORK_ID: "1337"
  }
}

module.exports = nextConfig
