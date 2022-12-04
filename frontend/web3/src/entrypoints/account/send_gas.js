/*----------  Account Helper ----------*/
// Get account Handler
const accountHandler = require("../../web3/account")

const account = new accountHandler.UniMaAccount()

/*----------  Config Helper  ----------*/
// config
const configHandler = require("../../web3/config")
// Create config class with config path
const config = new configHandler.Config()

// Send gas endpoint
exports.send_gas = async (address, to_address) => {
    await account.send_gas(config.getCoinbaseAddress, to_address)
    try {
        await account.send_gas(config.getCoinbaseAddress, to_address)
        return { "success": true };
    }
    catch (err) {
        return { "success": false, "error": err.message };
    }
};
