

/*----------  Config Helper  ----------*/
// config
const configHandler = require("../../web3/config")
// Create config class with config path
const config = new configHandler.Config(configPath)



/*----------  Utils Helper  ----------*/
// utils
const utilsHelper = require("../../web3/utils")
// Create utils class
const utils = new utilsHelper.UniMaUtils()

// Set assignment link
exports.set_assignment_link = async (address, semester_id, assignment, link) => {
    try {
        await config.set_assignment_link(semester_id, assignment_id, link)
        return { "success": true };
    }
    catch (err) {
        return { "success": false, "error": err.message };
    }
};