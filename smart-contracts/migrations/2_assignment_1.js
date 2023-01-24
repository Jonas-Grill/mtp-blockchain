const configStorage = artifacts.require("ConfigStorage");

// Assignment 1
const assignment1Validator = artifacts.require("Assignment1Validator");
const assignment1Tests = artifacts.require("Assignment1Tests");

// Deploy or not for testing
const deploy = false

module.exports = async (deployer, network, account) => {
    if (deploy) {
        // DEPLOY ASSIGNMENT 1 VALIDATOR
        assignment1TestsContract = await deployer.deploy(assignment1Tests);


        console.log("Assignment 1 Tests Contract Address: " + assignment1Tests.address);

        await deployer.deploy(assignment1Validator, configStorage.address, assignment1Tests.address);
    }
};