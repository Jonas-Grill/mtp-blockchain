class GanacheHelper {
    constructor() {
        var Web3 = require("web3");

        this.web3 = new Web3('http://localhost:8545');
    }

    async getAccount() {
        return await this.web3.eth.getAccounts()
    }

    async sendFaucetFunds(from, faucetAddress) {
        await this.web3.eth.sendTransaction({ from: from, to: faucetAddress, value: 20 * (10 ** 18) })
    }
}

module.exports = { GanacheHelper };