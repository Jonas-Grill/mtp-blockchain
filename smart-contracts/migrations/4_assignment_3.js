const configStorage = artifacts.require("ConfigStorage");

// Assignment 3
const assignment3Validator = artifacts.require("Assignment3Validator");
const assignment3ValidatorExtend = artifacts.require("Assignment3ValidatorExtend");


// Deploy or not for testing
const deploy = true

module.exports = async (deployer, network, account) => {
    if (deploy) {
        // DEPLOY ASSIGNMENT 3 VALIDATOR
        Assignment3ValidatorExtendContract = await deployer.deploy(Assignment3ValidatorExtend);

        await deployer.deploy(assignment3Validator, configStorage.address, Assignment3ValidatorExtend.address);
    }
};