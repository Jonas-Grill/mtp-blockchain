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
exports.set_semester_amount_knowledge_coins = async (address, semester_id, min_knowledge_coin_amount) => {
    try {
        await config.set_semester_amount_knowledge_coins(semester_id, min_knowledge_coin_amount)
        return { "success": true };
    }
    catch (err) {
        return { "success": false, "error": err.message };
    }
};