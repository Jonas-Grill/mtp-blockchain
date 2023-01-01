const ConfigStorage = artifacts.require("ConfigStorage");

contract("ConfigStorage", (accounts) => {
    it("should get faucetGas", async () => {
        const ConfigStorageInstance = await ConfigStorage.deployed();

        const value = await ConfigStorageInstance.getFaucetGas();

        assert.equal(value, 2, "FaucetGas is 2");
    });

    it("should get faucetBlockNoDifference", async () => {
        const ConfigStorageInstance = await ConfigStorage.deployed();

        const value = await ConfigStorageInstance.getFaucetBlockNoDifference();

        assert.equal(value, 10, "FaucetBlockNoDifference is 10");
    });

    it("should add faucetGas", async () => {
        const ConfigStorageInstance = await ConfigStorage.deployed();

        await ConfigStorageInstance.setFaucetGas(20);

        const value = await ConfigStorageInstance.getFaucetGas();

        assert.equal(value, 20, "faucetGas is 20");
    });

    it("should add faucetBlockNoDifference", async () => {
        const ConfigStorageInstance = await ConfigStorage.deployed();

        await ConfigStorageInstance.setFaucetBlockNoDifference(30);

        const value = await ConfigStorageInstance.getFaucetBlockNoDifference();

        assert.equal(value, 30, "FaucetBlockNoDifference is 30");
    });
});
