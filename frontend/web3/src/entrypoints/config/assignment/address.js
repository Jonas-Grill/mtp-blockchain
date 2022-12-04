

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

// Set assignment address
exports.set_assignment_address = async (address, semester_id, assignment_id, address) => {
    try {
        await config.set_assignment_address(semester_id, assignment_id, address)
        return { "success": true };
    }
    catch (err) {
        return { "success": false, "error": err.message };
    }
};