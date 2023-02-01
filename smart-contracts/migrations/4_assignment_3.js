const configStorage = artifacts.require("ConfigStorage");

// Assignment 3
const validator3 = artifacts.require("Validator3");

// Deploy or not for testing
const deploy = true

module.exports = async (deployer, network, account) => {
    if (deploy) {
        // DEPLOY ASSIGNMENT 3 VALIDATOR
        await deployer.deploy(validator3, configStorage.address);
    }
};