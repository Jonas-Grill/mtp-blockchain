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

        // Require utils
        const utilsHandler = require('./utils')

        this.utils = new utilsHandler.UniMaUtils()

        // Require web3 for talking to api
        this.Web3 = require('web3')

        // Parse and set rpc url
        this.web3 = new this.Web3()
        this.web3.setProvider(new this.web3.providers.HttpProvider(this.config.getRpcUrl));
    }

    /**
     * Send gas from adress to adress
     * 
     * @param {string} from coinbase adress which holds the eth/gas 
     * @param {string} to receiver adress which needs the eth/gas
     * @param {int} gas amount of eth/gas to send to receiver adress (default: config.getInitialGasAmount)
     */
    async send_gas(from, to, gas = this.config.getInitialGasAmount, blockNumberDifference = this.config.getFaucetBlocknumberDifference) {
        // Make sure the coinbase adress and the recipient adress are both valid
        if (this.web3.utils.isAddress(from) && this.web3.utils.isAddress(to)) {

            // faucet storage abi
            const abi = this.utils.get_contract_abi("FaucetStorage")

            // address from FaucetStorage contract
            const network_id = await this.web3.eth.net.getId();
            const faucet_storage_address = this.utils.get_contract_address("FaucetStorage", network_id)

            // Get faucetStorageContract using coinbase address
            var faucetStorageContract = new this.web3.eth.Contract(abi, faucet_storage_address, {
                from: this.config.getCoinbaseAdress,
            });

            // Get faucet object (blockNo, timestamp) given address 
            var faucetObject = await faucetStorageContract.methods.getFaucetUsage(to).call({
                from: this.config.getCoinbaseAdress,
            });

            // Get current block number
            let block = await this.web3.eth.getBlock("latest");
            const block_id_1 = Number(block.number)

            // Send eth if:
            // - 1. Faucet never used
            // - 2. Current block number is higher/equal to old block number plus offset
            if (faucetObject.blockNo == 0 || (Number(faucetObject.blockNo) + Number(blockNumberDifference)) <= block_id_1) {
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
                    });

                    // Get current block number
                    let block2 = await this.web3.eth.getBlock("latest")

                    await faucetStorageContract.methods.addFaucetUsage(to, Number(block2.number)).send({
                        from: this.config.getCoinbaseAdress,
                    });

                    console.log(`Successfully send ${gas} ether to '${to}' from '${from}'.`)
                }
                else {
                    console.log(`Coinbase adress do not has enough gas to send.`)
                    throw new Error("Coinbase adress do not has enough gas to send.")
                }
            }
            else {
                console.log(`Faucet used to recent.`)
                throw new Error("Faucet used to recent.")
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
     * See: _get_first_event_transaction_ for a faster approach.
     * 
     * Source: https://ethereum.stackexchange.com/questions/8900/how-to-get-transactions-by-account-using-web3-js
     * 
     * > Explanation: 
     *  The approach is a heuristic approach looping over all blocks and their transactions and 
     *  removing or adding the send/received balance to the most current balance from the adress. 
     *  If the balance is 0 the process can be stopped. Because no further transactions are 
     *  possible. Balance **cannot** be lower than 0. 
     * 
     * @param {adress} adress eth adress from where to get first transaction
     * @returns transaction object or empty dict if no first transaction
     */
    async get_first_transaction(adress) {
        var currentBlock = await this.web3.eth.getBlockNumber();
        var n = await this.web3.eth.getTransactionCount(adress, currentBlock);
        var bal = await this.web3.eth.getBalance(adress, currentBlock);

        var trx_object = {}

        // Loop over all blocks in a desc order IFF blocknumer is > 0 and balance from adress > 0
        for (var i = currentBlock; i >= 0 && (n > 0 || bal > 0); --i) {
            try {
                // get current block i
                var block = await this.web3.eth.getBlock(i, true);
                // make sure that the block has content and has a transaction
                if (block && block.transactions) {
                    // loop over all the transactions from this block
                    block.transactions.forEach(function (e) {
                        // if adress is the sender --> a transaction with this adress occured
                        if (adress == e.from) {
                            if (e.from != e.to)
                                // add balance to adress
                                bal = bal + Number(e.value);

                            trx_object = e;
                            --n;
                        }
                        // if the adress is the receiver --> a transaction with this adress occured
                        if (adress == e.to) {
                            if (e.from != e.to)
                                // remove balance from adress
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
     * Get first **event** transaction (occures when a contract is deployed)
     * 
     * Source: https://ethereum.stackexchange.com/questions/8900/how-to-get-transactions-by-account-using-web3-js
     * 
     * @param {string} adress adress to check for first event transaction
     * @returns transaction object or empty dict if no first transaction
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

    /**
     * Return amount of UniMa Coins from adress
     * 
     * @param {string} adress adress to check for first event transaction
     * @returns amount of UniMa Coins
     */
    async get_unima_coins(adress) {
        // Placeholder function to return amount of UniMa Coins
        return 0;
    }
}

// export account class
module.exports = { UniMaAccount };
