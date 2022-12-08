/*----------  Account Helper ----------*/
// Get account Handler
const accountHandler = require("../../web3/account")

/*----------  Config Helper  ----------*/
// config
const configHandler = require("../../web3/config")
// Create config class with config path




// Send gas endpoint
exports.send_gas = async (web3, to_address) => {

    try {
        const account = new accountHandler.UniMaAccount(web3)
        const config = new configHandler.Config(web3)

        await account.send_gas(config.getCoinbaseAddress, to_address)

        return { "success": true };
    }
    catch (err) {
        return { "success": false, "error": err.message };
    }
};
