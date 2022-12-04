
/*----------  Config Helper  ----------*/
// config#
const configHandler = require("../../web3/config")
// Create config class with config path
const config = new configHandler.Config(configPath)



/*----------  Utils Helper  ----------*/
// utils
const utilsHelper = require("../../web3/utils")
// Create utils class
const utils = new utilsHelper.UniMaUtils()

// Append new semester
exports.append_semester = async (address, name, start_block, end_block, min_knowledge_coin_amount) => {
    try {
        var id = await config.appendSemester(name, start_block, end_block, min_knowledge_coin_amount)
        return { "success": true, "id": id };
    }
    catch (err) {
        return { "success": false, "error": err.message };
    }
};

// Get semester
exports.get_semester = async (address, semester_id) => {
    try {
        var semester = await config.getSemester(semester_id)

        return { "success": true, "semester": { "name": semester[0], "start_block": semester[1], "end_block": semester[2], "min_knowledge_coin_amount": semester[3] } };
    }
    catch (err) {
        return { "success": false, "error": err.message };
    }
};

// Delete semester
exports.delete_semester = async (address, semester_id) => {
    try {
        await config.deleteSemester(semester_id)
        return { "success": true };
    }
    catch (err) {
        return { "success": false, "error": err.message };
    }
}
