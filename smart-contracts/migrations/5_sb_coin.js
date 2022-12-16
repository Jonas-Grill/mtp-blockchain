const SBCoin = artifacts.require("SBCoin");

const name = "KnowledgeCoin";
const symbol = "NOW";

module.exports = (deployer, network, accounts) => {
    deployer.deploy(SBCoin, name, symbol);
}