/*----------  Account Helper ----------*/
// Get account Handler
const accountHandler = require("../../web3/account")

/*----------  Config Helper  ----------*/
// config
const configHandler = require("../../web3/config")
// Create config class with config path


// Send gas endpoint
exports.sendEth = async (web3, to_address) => {
    try {
        const account = new accountHandler.UniMaAccount(web3)

        await account.sendEth(to_address)

        return { "success": true };
    }
    catch (err) {
        console.trace(err)
        return { "success": false, "error": err.message };
    }
};

// Get faucet balance
exports.getFaucetBalance = async (web3) => {
    try {
        const account = new accountHandler.UniMaAccount(web3)

        var balance = await account.getFaucetBalance()

        return { "success": true, "balance": balance };
    }
    catch (err) {
        console.trace(err)
        return { "success": false, "error": err.message };
    }
};