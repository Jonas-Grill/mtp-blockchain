const SBCoin = artifacts.require("SBCoin");

const name = "KnowledgeCoin";
const symbol = "NOW";

contract("SBCoin", (accounts) => {
    it("should get name", async () => {
        const SBCoinInstance = await SBCoin.deployed(name, symbol);

        const value = await SBCoinInstance.name();

        assert.equal(value, name, "Name is " + name);
    });

    it("should get symbol", async () => {
        const SBCoinInstance = await SBCoin.deployed(name, symbol);

        const value = await SBCoinInstance.symbol();

        assert.equal(value, symbol, "Symbol is " + symbol);
    });

    it("should get decimals", async () => {
        const SBCoinInstance = await SBCoin.deployed(name, symbol);

        const value = await SBCoinInstance.decimals();

        assert.equal(value, 18, "Decimals is 18");
    });

    it("should get totalSupply", async () => {
        const SBCoinInstance = await SBCoin.deployed(name, symbol);

        const value = (await SBCoinInstance.totalSupply()).toNumber();

        assert.notEqual(value, undefined, "TotalSupply is returned");
    });

    it("should get balanceOf", async () => {
        const SBCoinInstance = await SBCoin.deployed(name, symbol);

        const value = (await SBCoinInstance.balanceOf(accounts[0])).toNumber();

        assert.notEqual(value, undefined, "BalanceOf is returned");
    });

    it("should get allowance", async () => {
        const SBCoinInstance = await SBCoin.deployed(name, symbol);

        const value = (await SBCoinInstance.allowance(accounts[0], accounts[1])).toNumber();

        assert.notEqual(value, undefined, "Allowance is returned");
    });

    it("transfer should increase and decrease balanceOf", async () => {
        const SBCoinInstance = await SBCoin.deployed(name, symbol);

        const account1 = accounts[0];
        const account2 = accounts[2];
        const amount = 100;

        const account1BalanceBefore = (await SBCoinInstance.balanceOf(account1)).toNumber();
        const account2BalanceBefore = (await SBCoinInstance.balanceOf(account2)).toNumber();

        await SBCoinInstance.transfer(account2, amount, { from: account1 });

        const account1BalanceAfter = (await SBCoinInstance.balanceOf(account1)).toNumber();
        const account2BalanceAfter = (await SBCoinInstance.balanceOf(account2)).toNumber();

        assert.equal(account1BalanceAfter, account1BalanceBefore - amount, "Account1 balance decreased by " + amount);
        assert.equal(account2BalanceAfter, account2BalanceBefore + amount, "Account2 balance increased by " + amount);
    });
});