const root_path = require('path').resolve('./')

/*----------  Config  ----------*/
// Prepare config path
var configPath = ""
env = require('minimist')(process.argv.slice(2))["env"];
if (env == "prd") {
    configPath = root_path + "/config/prd-config.json"
}
else if (env == "tst") {
    configPath = root_path + "/config/tst-config.json"
}
else {
    configPath = root_path + "/config/dev-config.json"
}

/*----------  Config Helper  ----------*/
// config
const configHandler = require(root_path + '/src/web3/config')
// Create config class with config path
const config = new configHandler.Config(configPath)



/*----------  Utils Helper  ----------*/
// utils
const utilsHelper = require(root_path + '/src/web3/utils')
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
