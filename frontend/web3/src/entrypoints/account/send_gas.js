/*----------  Account Helper ----------*/
// Get account Handler
const accountHandler = require("../../web3/account")

const account = new accountHandler.UniMaAccount()

// Send gas endpoint
exports.send_gas = async (address, to_address) => {
    try {
        await account.send_gas(config.getCoinbaseAddress, to_address)
        return { "success": true };
    }
    catch (err) {
        return { "success": false, "error": err.message };
    }
};
