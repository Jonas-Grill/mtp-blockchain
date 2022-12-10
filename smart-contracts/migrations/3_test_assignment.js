var test_assignment = artifacts.require("TestAssignment");

module.exports = function (deployer) {
    // deployment steps
    deployer.deploy(test_assignment);
};