
const configStorage = artifacts.require("ConfigStorage");
const faucetStorage = artifacts.require("FaucetStorage");

// SB coin
const SBCoin = artifacts.require("SBCoin");

const name = "KnowledgeCoin";
const symbol = "NOW";

// Deploy or not for testing
const deploy = false

module.exports = async (deployer, network, account) => {
    if (deploy) {
        console.log("USE ACCOUNT: " + account[0])
        // deployment steps
        configContract = await deployer.deploy(configStorage)

        console.log("ConfigStorage deployed at " + configStorage.address)
        console.log("Deploying FaucetStorage...")
        // Faucet
        await deployer.deploy(faucetStorage, configStorage.address, { from: account[0], value: "20000000000000000000" });

        console.log("Deploying SBCoin...")
        await deployer.deploy(SBCoin, name, symbol, configStorage.address);
    }
};