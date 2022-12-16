/*----------  Config Helper  ----------*/
// config
const configHandler = require("../../web3/config")


/*----------  Utils Helper  ----------*/
// utils
const utilsHelper = require("../../web3/utils")
// Create utils class
const utils = new utilsHelper.UniMaUtils()

// Set faucet gas value endpoint
exports.setSemesterEndBlock = async (web3, semester_id, end_block) => {
    try {
        const config = new configHandler.Config(web3)

        await config.setSemesterEndBlock(semester_id, end_block)
        return { "success": true };
    }
    catch (err) {
        return { "success": false, "error": err.message };
    }
};