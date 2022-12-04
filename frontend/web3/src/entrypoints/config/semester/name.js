

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



// Set semester name
exports.set_semester_name = async (address, semester_id, name) => {
    try {
        await config.set_semester_name(semester_id, name);
        return { "success": true };
    }
    catch (err) {
        return { "success": false, "error": err.message };
    }
};