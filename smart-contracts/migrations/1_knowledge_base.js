const { config } = require("process");

const configStorage = artifacts.require("ConfigStorage");
const faucetStorage = artifacts.require("FaucetStorage");

// SB coin
const SBCoin = artifacts.require("SBCoin");

const name = "KnowledgeCoin";
const symbol = "NOW";

// test 
const testAssignment = artifacts.require("TestAssignment");
const testAssignmentValidator = artifacts.require("TestAssignmentValidator");

module.exports = async (deployer) => {
    await deployer.deploy(testAssignment);
    // deployment steps
    configContract = await deployer.deploy(configStorage)

    console.log("ConfigStorage deployed at " + configStorage.address)
    console.log("Deploying FaucetStorage...")
    // Faucet
    await deployer.deploy(faucetStorage, configStorage.address);

    console.log("Deploying TestAssignmentValidator...")
    // Assignment Validator
    await deployer.deploy(testAssignmentValidator, configStorage.address);

    console.log("Deploying SBCoin...")
    await deployer.deploy(SBCoin, name, symbol, configStorage.address);
};