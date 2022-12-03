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