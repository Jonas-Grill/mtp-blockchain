const configStorage = artifacts.require("ConfigStorage");

// test 
const exampleAssignment = artifacts.require("ExampleAssignment");
const exampleAssignment2 = artifacts.require("ExampleAssignment2");
const exampleAssignmentValidator = artifacts.require("ExampleAssignmentValidator");
const exampleAssignmentValidator2 = artifacts.require("ExampleAssignmentValidator2");

// Deploy or not for testing
const deploy = true

module.exports = async (deployer, network, account) => {
    if (deploy) {
        // Assignment Validator 1
        console.log("Deploying ExampleAssignmentValidator...")
        await deployer.deploy(exampleAssignmentValidator, configStorage.address);

        await deployer.deploy(exampleAssignment, exampleAssignmentValidator.address);

        // Assignment Validator 2
        console.log("Deploying ExampleAssignmentValidator2...")
        await deployer.deploy(exampleAssignmentValidator2, configStorage.address);

        await deployer.deploy(exampleAssignment2, exampleAssignmentValidator2.address);
    }
};