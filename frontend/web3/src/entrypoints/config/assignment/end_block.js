/*----------  Config Helper  ----------*/
// config
const configHandler = require("../../web3/config")


/*----------  Utils Helper  ----------*/
// utils
const utilsHelper = require("../../web3/utils")
// Create utils class
const utils = new utilsHelper.UniMaUtils()

// Set assignment end_block
exports.set_assignment_end_block = async (web3, semester_id, assignment_id, end_block) => {
    try {
        const config = new configHandler.Config(web3)

        await config.set_assignment_end_block(semester_id, assignment_id, end_block)
        return { "success": true };
    }
    catch (err) {
        return { "success": false, "error": err.message };
    }
};