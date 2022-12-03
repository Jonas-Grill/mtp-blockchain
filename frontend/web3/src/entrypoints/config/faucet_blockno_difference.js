
const root_path = require('path').resolve('./')

/*----------  Config  ----------*/
// Prepare config path
var configPath = ""
env = require('minimist')(process.argv.slice(2))["env"];
if (env == "prd") {
    configPath = root_path + "/src/config/prd-config.json"
}
else if (env == "tst") {
    configPath = root_path + "/src/config/tst-config.json"
}
else {
    configPath = root_path + "/src/config/dev-config.json"
}

/*----------  Config Helper  ----------*/
// config
const configHandler = require(root_path + '/src/web3/config')
// Create config class with config path
const config = new configHandler.Config(configPath)



/*----------  Utils Helper  ----------*/
// utils
const utilsHelper = require(root_path + '/src/web3/utils')
// Create utils class
const utils = new utilsHelper.UniMaUtils()


// Set faucet block number difference value endpoint
exports.set_faucet_block_no_difference = async (address, faucet_blockno_difference) => {
    try {
        await config.setFaucetBlockNoDifference(address, faucet_blockno_difference)
        return { "success": true };
    }
    catch (err) {
        return { "success": false, "error": err.message };
    }
};

// Get faucet block number difference value endpoint
exports.get_faucet_block_no_difference = async (address) => {
    try {
        const faucet_blockno_difference = await config.getFreshFaucetBlockNoDifference()
        return { "success": true, "faucet_blockno_difference": faucet_blockno_difference };
    }
    catch (err) {
        return { "success": false, "error": err.message };
    }
};