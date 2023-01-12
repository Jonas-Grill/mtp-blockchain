/*----------  NOWConfig Helper  ----------*/
// config
const configHandler = require("../../web3/config")

/*----------  Utils Helper  ----------*/
// utils
const utilsHelper = require("../../web3/utils")
// Create utils class
const utils = new utilsHelper.NOWUtils()


// Set faucet gas value endpoint
exports.setFaucetGas = async (web3, faucetGas) => {
    const config = new configHandler.NOWConfig(web3)

    await config.setFaucetGas(faucetGas)
};

// Get faucet gas value endpoint
exports.getFaucetGas = async (web3) => {
    const config = new configHandler.NOWConfig(web3)

    return await config.getFreshFaucetGas()
};