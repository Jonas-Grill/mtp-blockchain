/*----------  Config Helper  ----------*/
// config
const configHandler = require("../../web3/config")

/*----------  Utils Helper  ----------*/
// utils
const utilsHelper = require("../../web3/utils")
// Create utils class
const utils = new utilsHelper.UniMaUtils()

// Set assignment address
exports.set_assignment_address = async (web3, semester_id, assignment_id, address) => {
    try {
        const config = new configHandler.Config(web3)

        await config.set_assignment_address(semester_id, assignment_id, address)
        return { "success": true };
    }
    catch (err) {
        return { "success": false, "error": err.message };
    }
};