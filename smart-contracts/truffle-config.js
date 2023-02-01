require("dotenv").config();
const HDWalletProvider = require("@truffle/hdwallet-provider");

const getEnv = env => {
  const value = process.env[env];
  if (typeof value === 'undefined') {
    throw new Error(`${env} has not been set.`);
  }
  return value;
};

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*"
    },
    unima: {
      provider: function() {
        return new HDWalletProvider({
          mnemonic: {
            phrase: getEnv('ETH_WALLET_MNEMONIC')
          },
          providerOrUrl: "http://192.168.178.68:8506"
        });
      },
      network_id: 1337
    },
    dashboard: {
      networkCheckTimeout: 120000,
    }
  },
  compilers: {
    solc: {
      version: "^0.8.17",
      settings: {
        optimizer: {
          enabled: false,
          runs: 200
        },
        viaIR: false
      }
    }
  },
  dashboard: {
    port: 24012,
  },
  plugins: ["truffle-contract-size"]
};