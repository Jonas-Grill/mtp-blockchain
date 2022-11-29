const SBCoin = artifacts.require("SBCoin");

const name = "KnowledgeCoin";
const symbol = "NOW";

contract("SBCoin", (accounts) => {
    it("should get name", async () => {
        const SBCoinInstance = await SBCoin.deployed(name, symbol);

        const value = await SBCoinInstance.name();

        assert.equal(value, name, "Name is " + name);
    });
});