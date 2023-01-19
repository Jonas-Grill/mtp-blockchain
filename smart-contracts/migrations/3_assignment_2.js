const configStorage = artifacts.require("ConfigStorage");

// Assignment 2
const assignment2Validator = artifacts.require("Assignment2Validator");
const assignment2ValidatorTaskB = artifacts.require("Assignment2ValidatorTaskB");


// Deploy or not for testing
const deploy = true

module.exports = async (deployer, network, account) => {
    // DEPLOY ASSIGNMENT 2 VALIDATOR
    if (deploy) {

        // ASSIGNMENT 2 VALIDATOR: fist deploy task b contract
        await deployer.deploy(assignment2ValidatorTaskB);

        // ASSIGNMENT 2 VALIDATOR: then deploy main contract and link to config storage and validator task b
        await deployer.deploy(assignment2Validator, configStorage.address, assignment2ValidatorTaskB.address);
    }
};