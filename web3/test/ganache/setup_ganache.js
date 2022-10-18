class Ganache_Helper {
    constructor() {
        var Web3 = require("web3");

        this.web3 = new Web3('http://localhost:8545');
    }

    async get_account() {
        return await this.web3.eth.getAccounts()
    }
}

module.exports = { Ganache_Helper };