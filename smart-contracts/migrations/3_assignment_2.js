const configStorage = artifacts.require("ConfigStorage");

// Assignment 2
const validator2 = artifacts.require("Validator2");

// Deploy or not for testing
const deploy = true

module.exports = async (deployer, network, account) => {
    if (deploy) {
        // ASSIGNMENT 2 VALIDATOR:
        await deployer.deploy(validator2, configStorage.address, { value: "2000000000000" });
    }

};