const FaucetStorage = artifacts.require("FaucetStorage");

contract("FaucetStorage", (accounts) => {
    it("should add proper faucet usage", async () => {
        const faucetStorageInstance = await FaucetStorage.deployed();

        await faucetStorageInstance.addFaucetUsage(accounts[0], 11);

        const user = await faucetStorageInstance.getFaucetUsage(accounts[0]);

        assert.equal(user.blockNo, 11, "BlockNo is 11");
    });

    it("should override faucet usage", async () => {
        const faucetStorageInstance = await FaucetStorage.deployed();

        await faucetStorageInstance.addFaucetUsage(accounts[0], 11);

        const user1 = await faucetStorageInstance.getFaucetUsage(accounts[0]);

        assert.equal(user1.blockNo, 11, "BlockNo is 11");

        await faucetStorageInstance.addFaucetUsage(accounts[0], 22);

        const user2 = await faucetStorageInstance.getFaucetUsage(accounts[0]);

        assert.equal(user2.blockNo, 22, "BlockNo is 22");
    });

    it("should get not existing entry", async () => {
        const faucetStorageInstance = await FaucetStorage.deployed();

        const user = await faucetStorageInstance.getFaucetUsage(accounts[1]);

        assert.equal(user.blockNo, 0, "BlockNo is 0");
    });
});
