const FaucetStorage = artifacts.require("FaucetStorage");
const ConfigStorage = artifacts.require("ConfigStorage");

const prepareFaucet = async function prepareFaucet(fromAddress, toAddress) {
    const balance = await web3.eth.getBalance(toAddress)

    if (balance <= web3.utils.toWei('10', 'ether')) {
        await web3.eth.sendTransaction({ from: fromAddress, to: toAddress, value: web3.utils.toWei('10', 'ether') })
    }
}

contract("FaucetStorage", (accounts) => {
    it("should get gas from faucet", async () => {
        const ConfigStorageInstance = await ConfigStorage.deployed();
        const FaucetStorageInstance = await FaucetStorage.deployed(ConfigStorageInstance.address);

        // set config faucet gas to 1000
        await ConfigStorageInstance.setFaucetGas(2)

        // prepare faucet
        await prepareFaucet(accounts[0], FaucetStorageInstance.address)

        const balance_old = await web3.eth.getBalance(accounts[1])

        // send gas to account [1]
        await FaucetStorageInstance.sendEth(accounts[1])

        // check balance
        const balance_new = await web3.eth.getBalance(accounts[1])

        assert.notEqual(balance_new, balance_old, "Balance has changed");
    });

    it("should NOT get gas from faucet, because used to recent", async () => {
        const ConfigStorageInstance = await ConfigStorage.deployed();
        const FaucetStorageInstance = await FaucetStorage.deployed(ConfigStorageInstance.address);

        // set config faucet gas to 1000
        await ConfigStorageInstance.setFaucetGas(2)

        // prepare faucet
        await prepareFaucet(accounts[0], FaucetStorageInstance.address)

        let error = false
        try {
            // send gas to account [2]
            await FaucetStorageInstance.sendEth(accounts[2])

            // send gas to account [2]
            await FaucetStorageInstance.sendEth(accounts[2])
        }
        catch (exception) {
            error = true

            // Make dirty preparation for error message to catch only the important part
            // Why?
            //  - Eerror message on github actions prints the message differently than on local machine
            //  - "assert" has no "contains" method
            const message = exception.message.split("revert ")[1].split("!")[0]
            assert.equal(message, "Faucet used too recently", "Error message is correct")
        }

        assert.equal(error, true, "Error happened is true");
    });

    it("should NOT get gas from faucet, because not enough funds", async () => {
        const ConfigStorageInstance = await ConfigStorage.deployed();
        const FaucetStorageInstance = await FaucetStorage.deployed(ConfigStorageInstance.address);

        // set config faucet gas to 1000
        await ConfigStorageInstance.setFaucetGas(1000)

        let error = false
        try {
            // send gas to account [2]
            await FaucetStorageInstance.sendEth(accounts[4])
        }
        catch (exception) {
            error = true
            // Make dirty preparation for error message to catch only the important part
            // Why?
            //  - Eerror message on github actions prints the message differently than on local machine
            //  - "assert" has no "contains" method
            const message = exception.message.split("revert ")[1].split("!")[0]
            assert.equal(message, "Not enough funds in faucet", "Error message is correct")
        }

        assert.equal(error, true, "Error happened is true");
    });
});
