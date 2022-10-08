var unimacoin = artifacts.require("UniMaCoin");

module.exports = function (deployer) {
    // deployment steps
    deployer.deploy(unimacoin);
};