// Require web3 for talking to api
const Web3 = require('web3')

// Require config
const configHandler = require('./config')

// Utils
const utils = require('./utils')

// Create config class with config path
const config = new configHandler.Config("../config/dev-config.json")

// Parse and set rpc url
const rpcURL = config.getRpcUrl
const web3 = new Web3(rpcURL)

// set coinbase adress
const coinbase_adress = config.getCoinbaseAdress

// adress to which we want to send the ether
const recipient_adress = "0x027EC434652921e35B5119A28768740A7B72DE5e"

utils.send_gas(coinbase_adress, recipient_adress, config.getInitialGasAmount)