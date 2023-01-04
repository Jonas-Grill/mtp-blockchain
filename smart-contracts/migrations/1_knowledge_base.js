const configStorage = artifacts.require("ConfigStorage");
const faucetStorage = artifacts.require("FaucetStorage");

// SB coin
const SBCoin = artifacts.require("SBCoin");

const name = "KnowledgeCoin";
const symbol = "NOW";

// test 
const exampleAssignment = artifacts.require("ExampleAssignment");
const exampleAssignmentValidator = artifacts.require("ExampleAssignmentValidator");

module.exports = async (deployer, network, account) => {
    await deployer.deploy(exampleAssignment);
    // deployment steps
    configContract = await deployer.deploy(configStorage)

    console.log("ConfigStorage deployed at " + configStorage.address)
    console.log("Deploying FaucetStorage...")
    // Faucet
    await deployer.deploy(faucetStorage, configStorage.address, { from: account[0], value: "20000000000000000000" });

    console.log("Deploying ExampleAssignmentValidator...")
    // Assignment Validator
    await deployer.deploy(exampleAssignmentValidator, configStorage.address);

    console.log("Deploying SBCoin...")
    await deployer.deploy(SBCoin, name, symbol, configStorage.address);
};