/*
Store some account related functions
*/

class UniMaAccount {

    /**
     * Create Account class
     * 
     * @param {string} path path to the config file (default: "config/dev-config.json")
     */
    constructor(path = "config/dev-config.json") {
        // Require config
        const configHandler = require('./config')

        // Create config class with config path
        this.config = new configHandler.Config(path)

        // Require web3 for talking to api
        this.Web3 = require('web3')

        // Parse and set rpc url
        this.web3 = new this.Web3()
        this.web3.setProvider(new this.web3.providers.HttpProvider(this.config.getRpcUrl));
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

    /**
     * Send gas from adress to adress
     * 
     * @param {string} from coinbase adress which holds the eth/gas 
     * @param {string} to receiver adress which needs the eth/gas
     * @param {int} gas amount of eth/gas to send to receiver adress (default: config.getInitialGasAmount)
     */
    async send_gas(from, to, gas = this.config.getInitialGasAmount) {
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
                        console.log(`Successfully send ${gas} ether to '${to}' from '${from}'.`)
                    });
            }
            else {
                console.log(`Coinbase adress do not has enough gas to send.`)
                throw new Error("Coinbase adress do not has enough gas to send.")
            }
        }
        else {
            console.log(`Either the from or the to adress is not a valid adress.`)
            throw new Error("Either the from or the to adress is not a valid adress.")
        }
    }

    /**
     * Get first transaction or error
     * 
     * See: get_first_event_transaction for a faster approach.
     * 
     * https://ethereum.stackexchange.com/questions/8900/how-to-get-transactions-by-account-using-web3-js
     * 
     * @param {adress} adress eth adress from where to get first transaction
     */
    async get_first_transaction(adress) {
        var currentBlock = await this.web3.eth.getBlockNumber();
        var n = await this.web3.eth.getTransactionCount(adress, currentBlock);
        var bal = await this.web3.eth.getBalance(adress, currentBlock);

        var trx_object = {}

        console.log(currentBlock)
        for (var i = currentBlock; i >= 0 && (n > 0 || bal > 0); --i) {
            try {
                var block = await this.web3.eth.getBlock(i, true);
                if (block && block.transactions) {
                    block.transactions.forEach(function (e) {
                        if (adress == e.from) {
                            if (e.from != e.to)
                                bal = bal + Number(e.value);

                            trx_object = e;
                            --n;
                        }
                        if (adress == e.to) {
                            if (e.from != e.to)
                                bal = bal - Number(e.value);

                            trx_object = e;
                        }
                    });
                }
            } catch (e) {
                console.error("Error in block " + i, e);
                throw new Error("Error in block " + i, e)
            }
        }

        return trx_object;
    }

    /**
     * Get first event transaction (occures when deployed a contract)
     * 
     * https://ethereum.stackexchange.com/questions/8900/how-to-get-transactions-by-account-using-web3-js
     * 
     * @param {string} adress adress to check for first event transaction
     * @returns 
     */
    async get_first_event_transaction(adress) {
        var trx_object = {}

        web3.eth.getPastLogs({ fromBlock: '0x0', address: adress })
            .then(res => {
                res.forEach(rec => {
                    trx_object = rec
                });
            }).catch(function (err) {
                console.log("getPastLogs failed", err);
                throw new Error("Error in block " + i, e)
            });

        return trx_object;
    }

}

// export config class
module.exports = { UniMaAccount };
