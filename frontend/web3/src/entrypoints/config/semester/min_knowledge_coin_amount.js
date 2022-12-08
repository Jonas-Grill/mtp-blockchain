/*----------  Config Helper  ----------*/
// config
const configHandler = require("../../web3/config")

/*----------  Utils Helper  ----------*/
// utils
const utilsHelper = require("../../web3/utils")
// Create utils class
const utils = new utilsHelper.UniMaUtils()


// Set faucet gas value endpoint
exports.set_semester_amount_knowledge_coins = async (web3, semester_id, min_knowledge_coin_amount) => {
    try {
        const config = new configHandler.Config(web3)

        await config.set_semester_amount_knowledge_coins(semester_id, min_knowledge_coin_amount)
        return { "success": true };
    }
    catch (err) {
        return { "success": false, "error": err.message };
    }
};