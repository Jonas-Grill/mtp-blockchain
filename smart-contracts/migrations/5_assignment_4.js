const configStorage = artifacts.require("ConfigStorage");

// Assignment 4
const validator4 = artifacts.require("Validator4");

// Deploy or not for testing
const deploy = true

module.exports = async (deployer, network, account) => {
    if (deploy) {
        // DEPLOY ASSIGNMENT 3 VALIDATOR
        await deployer.deploy(validator4, configStorage.address, { from: account[0], value: "2000000000000" });
    }
};