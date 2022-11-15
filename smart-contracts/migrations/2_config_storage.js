var config_storage = artifacts.require("ConfigStorage");

module.exports = function (deployer) {
    // deployment steps
    deployer.deploy(config_storage);
};