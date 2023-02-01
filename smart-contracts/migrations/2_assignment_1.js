const configStorage = artifacts.require("ConfigStorage");

// Assignment 1
const validator1 = artifacts.require("Validator1");

// Deploy or not for testing
const deploy = true

module.exports = async (deployer, network, account) => {
    if (deploy) {
        await deployer.deploy(validator1, configStorage.address);
    }
};