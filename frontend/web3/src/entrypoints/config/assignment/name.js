/*----------  Config Helper  ----------*/
// config
const configHandler = require("../../web3/config")

/*----------  Utils Helper  ----------*/
// utils
const utilsHelper = require("../../web3/utils")
// Create utils class
const utils = new utilsHelper.UniMaUtils()


// Set assignment name
exports.set_assignment_name = async (web3, semester_id, assignment_id, name) => {
    try {
        const config = new configHandler.Config(web3)

        await config.set_assignment_name(semester_id, assignment_id, name)
        return { "success": true };
    }
    catch (err) {
        return { "success": false, "error": err.message };
    }
};