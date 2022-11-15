var test_assignment_validator = artifacts.require("TestAssignmentValidator");

module.exports = function (deployer) {
    // deployment steps
    deployer.deploy(test_assignment_validator);
};