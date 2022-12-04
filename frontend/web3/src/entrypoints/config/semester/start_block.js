

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

// Set semester end block
exports.set_semester_end_block = async (address, semester_id, end_block) => {
    try {
        await config.set_semester_end_block(semester_id, end_block)
        return { "success": true };
    }
    catch (err) {
        return { "success": false, "error": err.message };
    }
};