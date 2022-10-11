/*
Store some utils functions
*/

class Utils {

    constructor(path = "config/dev-config.json") {
        // Require config
        const configHandler = require('./config')

        // Create config class with config path
        this.config = new configHandler.Config(path)

        // Require web3 for talking to api
        this.Web3 = require('web3')

        // Parse and set rpc url
        this.web3 = new this.Web3(this.config.getRpcUrl)
    }

    // Send gas from adress to adress
    async send_gas(from, to, gas) {
        // Make sure the coinbase adress and the recipient adress are both valid
        if (this.web3.utils.isAddress(from) && this.web3.utils.isAddress(to)) {

            // get balance from coinbase adress
            var wei = await this.web3.eth.getBalance(from)
            // Transform wei to ether (1 ether = 1000000000000000000 wei)
            const ether = parseFloat(this.web3.utils.fromWei(new this.web3.utils.BN(wei), 'ether'));

            // If coinbase account has more gas than need send ether
            if (ether >= gas) {
                // Transfer gas to send into wei
                const initialGasAmountInWei = this.Web3.utils.toWei(new this.web3.utils.BN(gas))

                // Send ether
                await this.web3.eth.sendTransaction({
                    from: from,
                    to: to,
                    value: initialGasAmountInWei
                })
                    .then(function (err, receipt) {
                        Promise.resolve(`Successfully send ${gas} ether to '${to}' from '${from}'.`)
                        console.log(`Successfully send ${gas} ether to '${to}' from '${from}'.`)
                    });
            }
            else {
                Primise.resolve(`Coinbase adress do not has enough gas to send.`)
                console.log(`Coinbase adress do not has enough gas to send.`)
            }
        }
    }

    /**
     * Returns the eth amount from wei
     * 
     * @param {int} wei
     * @returns eth
     */
    wei_to_eth(wei) {
        return Number(wei) / Number(1000000000000000000);
    }

    /**
     * Returns the wei amount from eth
     * 
     * @param {float} eth 
     */
    eth_to_wei(eth) {
        return parseFloat(eth) * Number(1000000000000000000);
    }


}

// export config class
module.exports = { Utils };
