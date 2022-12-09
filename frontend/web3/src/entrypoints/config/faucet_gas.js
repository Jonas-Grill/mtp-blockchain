/*----------  Config Helper  ----------*/
// config
const configHandler = require("../../web3/config")

/*----------  Utils Helper  ----------*/
// utils
const utilsHelper = require("../../web3/utils")
// Create utils class
const utils = new utilsHelper.UniMaUtils()


// Set faucet gas value endpoint
exports.set_faucet_gas = async (web3, faucet_gas) => {
    try {
        const config = new configHandler.Config(web3)

        const accounts = await web3.eth.requestAccounts()

        await config.setFaucetGas(accounts[0], faucet_gas)
        return { "success": true };
    }
    catch (err) {
        return { "success": false, "error": err.message };
    }
};

// Get faucet gas value endpoint
exports.get_faucet_gas = async (web3) => {
    try {
        const config = new configHandler.Config(web3)

        const faucet_gas = await config.getFreshFaucetGas()
        return { "success": true, "faucet_gas": faucet_gas };
    }
    catch (err) {
        return { "success": false, "error": err.message };
    }
};