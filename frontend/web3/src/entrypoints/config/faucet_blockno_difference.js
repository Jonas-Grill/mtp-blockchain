/*----------  Config Helper  ----------*/
// config
const configHandler = require("../../web3/config")


/*----------  Utils Helper  ----------*/
// utils
const utilsHelper = require("../../web3/utils")
// Create utils class
const utils = new utilsHelper.UniMaUtils()

// Set faucet block number difference value endpoint
exports.set_faucet_block_no_difference = async (web3, faucet_blockno_difference) => {
    try {
        const config = new configHandler.Config(web3)
        const from_address = await utils.getFromAccount(web3);

        await config.setFaucetBlockNoDifference(from_address, faucet_blockno_difference)
        return { "success": true };
    }
    catch (err) {
        return { "success": false, "error": err.message };
    }
};

// Get faucet block number difference value endpoint
exports.get_faucet_block_no_difference = async (web3) => {
    try {
        const config = new configHandler.Config(web3)

        const faucet_blockno_difference = await config.getFreshFaucetBlockNoDifference()
        return { "success": true, "faucet_blockno_difference": faucet_blockno_difference };
    }
    catch (err) {
        return { "success": false, "error": err.message };
    }
};