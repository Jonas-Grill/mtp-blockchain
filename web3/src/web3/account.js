/*
Store some account related functions
*/

class UniMaAccount {

    /**
     * Create Account class
     * 
     * @param {string} coinbaseAddress other coinbase address (default: "")
     * @param {string} config_path path to the config file (default: "config/dev-config.json")
     */
    constructor(config_path = "config/dev-config.json") {
        // Require config
        const configHandler = require('./config')

        // Create config class with config path
        this.config = new configHandler.Config(config_path)

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
     * Send gas from address to address
     *  > Set default for _gas_ and _blockNumberDifference_ to -1. -1 will be replaced with the default value
     *  which is saved in the smart contract.  
     * 
     * @param {string} from coinbase address which holds the eth/gas 
     * @param {string} to receiver address which needs the eth/gas
     * @param {int} gas amount of eth/gas to send to receiver address (default: -1)
     * @param {int} blockNumberDifference block no differen between current block and last faucet usage (default: -1)
     */
    async send_gas(from, to, gas = -1, blockNumberDifference = -1) {
        /**  
         * Because node js doesn't allow await/async for default values in the function header, we need to do the
         * following solution. We set the default to -1. If the _config.getFreshFaucetGas_ function receives the
         * default value -1 (a value which is not possible in the normal usage), the function will return the current
         * value from the smart contract. If the value is e.g. 10 it will return 10 and ignores what is written in the
         * smart contract/config. 
         * We do this for gas and blockNumberDifference
        */
        gas = await this.config.getFreshFaucetGas(gas)
        blockNumberDifference = await this.config.getFreshFaucetBlockNoDifference(blockNumberDifference)

        // Make sure the coinbase address and the recipient address are both valid
        if (this.web3.utils.isAddress(from) && this.web3.utils.isAddress(to)) {
            // Get FaucetStorage smart-contract using coinbase address
            var faucetStorageContract = this.utils.get_contract(this.web3, "FaucetStorage", this.config.getCoinbaseAddress, await this.web3.eth.net.getId())

            // Get faucet object (blockNo, timestamp) given address 
            var faucetObject = await faucetStorageContract.methods.getFaucetUsage(to).call({
                from: this.config.getCoinbaseAddress,
            });

            // Get current block number
            let block = await this.web3.eth.getBlock("latest");
            const block_id_1 = Number(block.number)

            // Send eth if:
            // - 1. Faucet never used
            // - 2. Current block number is higher/equal to old block number plus offset
            if (faucetObject.blockNo == 0 || (Number(faucetObject.blockNo) + Number(blockNumberDifference)) <= block_id_1) {
                // get balance from coinbase address
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
                        from: this.config.getCoinbaseAddress,
                    });

                    console.log(`Successfully send ${gas} ether to '${to}' from '${from}'.`)
                }
                else {
                    console.log(`Coinbase address do not has enough gas to send.`)
                    throw new Error("Coinbase address do not has enough gas to send.")
                }
            }
            else {
                console.log(`Faucet used too recent.`)
                throw new Error("Faucet used too recent.")
            }
        }
        else {
            console.log(`Either the from or the to address is not a valid address.`)
            throw new Error("Either the from or the to address is not a valid address.")
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
     *  removing or adding the send/received balance to the most current balance from the address. 
     *  If the balance is 0 the process can be stopped. Because no further transactions are 
     *  possible. Balance **cannot** be lower than 0. 
     * 
     * @param {address} address eth address from where to get first transaction
     * @returns transaction object or empty dict if no first transaction
     */
    async get_first_transaction(address) {
        var currentBlock = await this.web3.eth.getBlockNumber();
        var n = await this.web3.eth.getTransactionCount(address, currentBlock);
        var bal = await this.web3.eth.getBalance(address, currentBlock);

        var trx_object = {}

        // Loop over all blocks in a desc order IFF blocknumer is > 0 and balance from address > 0
        for (var i = currentBlock; i >= 0 && (n > 0 || bal > 0); --i) {
            try {
                // get current block i
                var block = await this.web3.eth.getBlock(i, true);
                // make sure that the block has content and has a transaction
                if (block && block.transactions) {
                    // loop over all the transactions from this block
                    block.transactions.forEach(function (e) {
                        // if address is the sender --> a transaction with this address occured
                        if (address == e.from) {
                            if (e.from != e.to)
                                // add balance to address
                                bal = bal + Number(e.value);

                            trx_object = e;
                            --n;
                        }

                        // if the address is the receiver --> a transaction with this address occured
                        if (address == e.to) {
                            if (e.from != e.to)
                                // remove balance from address
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
     * @param {string} address address to check for first event transaction
     * @returns transaction object or empty dict if no first transaction
     */
    async get_first_event_transaction(address) {
        var trx_object = {}

        web3.eth.getPastLogs({ fromBlock: '0x0', address: address })
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
