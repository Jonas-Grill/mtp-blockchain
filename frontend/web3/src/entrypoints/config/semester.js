
/*----------  Config Helper  ----------*/
// config#
const configHandler = require("../../web3/config")

/*----------  Utils Helper  ----------*/
// utils
const utilsHelper = require("../../web3/utils")
// Create utils class
const utils = new utilsHelper.UniMaUtils()

// Append new semester
exports.append_semester = async (web3, name, start_block, end_block, min_knowledge_coin_amount) => {
    try {
        const config = new configHandler.Config(web3)

        var id = await config.appendSemester(name, start_block, end_block, min_knowledge_coin_amount)
        return { "success": true, "id": id };
    }
    catch (err) {
        console.trace(err)
        return { "success": false, "error": err.message };
    }
};

// Get semester
exports.get_semester = async (web3, semester_id) => {
    try {
        const config = new configHandler.Config(web3)

        var semester = await config.getSemester(semester_id)

        return { "success": true, "semester": { "name": semester[0], "start_block": semester[1], "end_block": semester[2], "min_knowledge_coin_amount": semester[3] } };
    }
    catch (err) {
        return { "success": false, "error": err.message };
    }
};

// Delete semester
exports.delete_semester = async (web3, semester_id) => {
    try {
        const config = new configHandler.Config(web3)

        await config.deleteSemester(semester_id)
        return { "success": true };
    }
    catch (err) {
        return { "success": false, "error": err.message };
    }
}
