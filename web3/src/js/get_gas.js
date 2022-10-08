// Require fs module to read json files
const fs = require('fs');

// Require web3 for talking to api
const Web3 = require('web3')

// Require config
const configHandler = require('./config')

// Create config class with config path
const config = new configHandler.Config("../config/dev-config.json")

// Parse and set rpc url
const rpcURL = config.getRpcUrl
const web3 = new Web3(rpcURL)

// set coinbase adress
const coinbase_adress = config.getCoinbaseAdress

// adress to which we want to send the ether
const recipient_adress = "0x027EC434652921e35B5119A28768740A7B72DE5e"

// Make sure the coinbase adress and the recipient adress are both valid
if (web3.utils.isAddress(coinbase_adress) && web3.utils.isAddress(recipient_adress)) {

    // get balance from coinbase adress
    web3.eth.getBalance(coinbase_adress, (err, wei) => {
        // Check if error occures
        if (!err) {
            // Transform wei to ether (1 ether = 1000000000000000000 wei)
            const ether = parseFloat(web3.utils.fromWei(new web3.utils.BN(wei), 'ether'));

            // If coinbase account has more gas than need send ether
            if (ether >= config.getGasAmount) {
                // Transfer gas to send into wei
                const gasAmountInWei = Web3.utils.toWei(new web3.utils.BN(config.getGasAmount))

                // Send ether
                web3.eth.sendTransaction({
                    from: coinbase_adress,
                    to: recipient_adress,
                    value: gasAmountInWei
                })
                    .then(function (err, receipt) {
                        console.log(`Successfully send ${config.getGasAmount} ether to '${recipient_adress}' from '${coinbase_adress}'.`)
                    });
            }
            else {
                console.log(`Coinbase adress do not has enough gas to send.`)
            }
        }
    })
}