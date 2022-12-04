/*----------  Config Helper  ----------*/
// config
const configHandler = require("../../web3/config")
// Create config class with config path
const config = new configHandler.Config(configPath)



/*----------  Utils Helper  ----------*/
// utils
const utilsHelper = require("../../web3/utils")
// Create utils class
const utils = new utilsHelper.UniMaUtils()


// Set faucet gas value endpoint
exports.set_faucet_gas = async (address, faucet_gas) => {
    try {
        await config.setFaucetGas(address, faucet_gas)
        return { "success": true };
    }
    catch (err) {
        return { "success": false, "error": err.message };
    }
};

// Get faucet gas value endpoint
exports.get_faucet_gas = async (address) => {
    try {
        const faucet_gas = await config.getFreshFaucetGas()
        return { "success": true, "faucet_gas": faucet_gas };
    }
    catch (err) {
        return { "success": false, "error": err.message };
    }
};