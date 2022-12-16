/*
Store some account related functions
*/

class UniMaAccount {

    /**
     * Create Account class
     */
    constructor(web3) {
        // Require config
        const configHandler = require('./config')

        // Create config class with config path
        this.config = new configHandler.Config(web3)

        // Require utils
        const utilsHandler = require('./utils')

        this.utils = new utilsHandler.UniMaUtils()

        this.web3 = web3;
    }

    /**
     * Send eth to address
     * 
     * @param {address} _to address to send eth to
     */
    async sendEth(_to) {
        var faucetStorageContract = this.utils.get_contract(this.web3,
            "FaucetStorage",
            _to,
            await this.web3.eth.net.getId())

        const fromAddress = await web3.eth.requestAccounts()[0]

        await faucetStorageContract.methods.sendEth(_to).send({ from: fromAddress })
    }


    /**
     * Get balance of faucet smart contract 
     *
     * @returns faucet balance
     */
    async getFaucetBalance() {
        var faucetStorageContract = this.utils.get_contract(this.web3,
            "FaucetStorage",
            await this.web3.eth.getCoinbase(),
            await this.web3.eth.net.getId())

        return await faucetStorageContract.methods.getFaucetBalance().call()
    }

    /**
     * Return amount of UniMa Coins from address
     * 
     * @param {string} address address to check for first event transaction
     * @returns amount of UniMa Coins
     */
    async get_unima_coins(address) {
        // Placeholder function to return amount of UniMa Coins
        return 0;
    }
}

// export account class
module.exports = { UniMaAccount };
