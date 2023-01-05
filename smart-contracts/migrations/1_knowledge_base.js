const configStorage = artifacts.require("ConfigStorage");
const faucetStorage = artifacts.require("FaucetStorage");

// SB coin
const SBCoin = artifacts.require("SBCoin");

const name = "KnowledgeCoin";
const symbol = "NOW";

// test 
const exampleAssignment = artifacts.require("ExampleAssignment");
const exampleAssignmentValidator = artifacts.require("ExampleAssignmentValidator");
const exampleAssignmentValidator2 = artifacts.require("ExampleAssignmentValidator2");

module.exports = async (deployer, network, account) => {
    await deployer.deploy(exampleAssignment);
    // deployment steps
    configContract = await deployer.deploy(configStorage)

    console.log("ConfigStorage deployed at " + configStorage.address)
    console.log("Deploying FaucetStorage...")
    // Faucet
    await deployer.deploy(faucetStorage, configStorage.address, { from: account[0], value: "20000000000000000000" });

    // Assignment Validator 1
    console.log("Deploying ExampleAssignmentValidator...")
    await deployer.deploy(exampleAssignmentValidator, configStorage.address);

    // Assignment Validator 2
    console.log("Deploying ExampleAssignmentValidator2...")
    await deployer.deploy(exampleAssignmentValidator2, configStorage.address);

    console.log("Deploying SBCoin...")
    await deployer.deploy(SBCoin, name, symbol, configStorage.address);
};