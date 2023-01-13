class GanacheHelper {
    constructor() {
        var Web3 = require("web3");

        this.web3 = new Web3('http://localhost:8545');
    }

    async getAccount() {
        return await this.web3.eth.getAccounts()
    }
}

module.exports = { GanacheHelper };