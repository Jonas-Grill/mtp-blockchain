/*
Store some account related functions
*/

class NOWAccount {

    /**
     * Create Account class
     */
    constructor(_web3) {
        // Require config
        const configHandler = require('./config')

        // Create config class with config path
        this.config = new configHandler.NOWConfig(_web3)

        // Require utils
        const utilsHandler = require('./utils')

        this.utils = new utilsHandler.NOWUtils()

        this.web3 = _web3;
    }

    /**
     * Send eth to address
     * 
     * @param {address} _to address to send eth to
     */
    async sendEth(_to) {
        const faucetStorageContract = this.utils.getContract(this.web3,
            "FaucetStorage",
            _to,
            await this.web3.eth.net.getId());

        faucetStorageContract.options.gasLimit = 500000
        faucetStorageContract.options.gas = 500000

        const fromAddress = await this.utils.getFromAccount(this.web3);

        await faucetStorageContract.methods.sendEth(_to).send({ from: fromAddress })
    }

    /**
     * Get balance of faucet smart contract 
     *
     * @returns faucet balance
     */
    async getFaucetBalance() {
        const fromAddress = await this.utils.getFromAccount(this.web3);

        var faucetStorageContract = this.utils.getContract(this.web3,
            "FaucetStorage",
            fromAddress,
            await this.web3.eth.net.getId())

        return await faucetStorageContract.methods.getFaucetBalance().call({ from: await this.utils.getFromAccount(this.web3) })
    }

    /**
     * Return amount of Knowledge Coins from address
     * 
     * @param {string} address address to check for first event transaction
     * @returns amount of Knowledge Coins
     */
    async getKnowledgeCoinBalance(address) {
        var knowledgeCoinContract = this.utils.getContract(this.web3,
            "SBCoin",
            address,
            await this.web3.eth.net.getId())

        return await knowledgeCoinContract.methods.balanceOf(address).call({ from: await this.utils.getFromAccount(this.web3) })
    }
}

// export account class
module.exports = { NOWAccount };
