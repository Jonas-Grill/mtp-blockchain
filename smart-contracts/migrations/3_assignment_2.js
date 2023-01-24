const configStorage = artifacts.require("ConfigStorage");

// Assignment 2: helper contracts
const assignment2Registry = artifacts.require("Assignment2Registry");
const assignment2Coin = artifacts.require("Assignment2Coin");
const assignment2Exchange = artifacts.require("Assignment2Exchange");

// Assignment 2
const assignment2Validator = artifacts.require("Assignment2Validator");
const assignment2ValidatorTaskB = artifacts.require("Assignment2ValidatorTaskB");


// Deploy or not for testing
const deploy = false

module.exports = async (deployer, network, account) => {
    // DEPLOY ASSIGNMENT 2 VALIDATOR
    if (deploy) {
        // deploy coin
        await deployer.deploy(assignment2Coin, "A2C", "A2C", configStorage.address);

        // deploy exchange
        await deployer.deploy(assignment2Exchange, assignment2Coin.address, configStorage.address, { from: account[0], value: "2000000000000" });

        // deploy registry
        await deployer.deploy(assignment2Registry, configStorage.address, assignment2Exchange.address);

        // DEPLOY VALIDATOR

        // ASSIGNMENT 2 VALIDATOR: fist deploy task b contract
        await deployer.deploy(assignment2ValidatorTaskB);

        // ASSIGNMENT 2 VALIDATOR: then deploy main contract and link to config storage and validator task b
        await deployer.deploy(assignment2Validator, configStorage.address, assignment2ValidatorTaskB.address, assignment2Coin.address, assignment2Registry.address);
    }
};