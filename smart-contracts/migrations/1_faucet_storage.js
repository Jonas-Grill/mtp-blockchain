var faucet_storage = artifacts.require("FaucetStorage");

module.exports = function (deployer) {
    // deployment steps
    deployer.deploy(faucet_storage);
};