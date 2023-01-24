module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*"
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