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


// Append new assignment to semester
exports.append_assignment = async (address, semester_id, name, link, validation_contract_address, start_block, end_block) => {
    try {
        var id = await config.appendAssignment(semester_id, name, link, validation_contract_address, start_block, end_block)
        return { "success": true, "id": id };
    }
    catch (err) {
        return { "success": false, "error": err.message };
    }
};

// Get assignment
exports.get_assignment = async (addres, semester_id, assignment_id) => {
    try {
        var assignment = await config.getAssignment(semester_id, assignment_id)
        return { "success": true, "semester": { "name": assignment[0], "link": assignment[1], "validation_contract_address": assignment[2], "start_block": assignment[3], "end_block": assignment[4] } })
    }
    catch (err) {
        return { "success": false, "error": err.message };
    }
};

// Delete assignment
exports.delete_assignment = async (addres, semester_id, assignment_id) => {
    try {
        await config.deleteAssignment(semester_id, assignment_id)
        return { "success": true };
    }
    catch (err) {
        return { "success": false, "error": err.message };
    }
}
