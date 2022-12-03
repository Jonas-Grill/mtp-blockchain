const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

const StatusCodes = require('http-status-codes').StatusCodes;

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

/*----------  Dot ENV  ----------*/
// Set up Global configuration access
dotenv.config();

/*----------  Utils Helper  ----------*/
// utils
const utilsHelper = require(root_path + '/src/web3/utils')
// Create utils class
const utils = new utilsHelper.UniMaUtils()


/*----------  Assignment Helper  ----------*/
// assignments
const assignmentsHandler = require(root_path + '/src/web3/assignment')
// Create assignments
const assignments = new assignmentsHandler.UniMaAssignments(configPath);

// Run validator for test assignment
exports.get_test_results = async (address, contract_name, test_id) => {
    try {
        const result = await assignments.get_test_results(contract_name, test_id)
        return { "success": true, "result": result };
    }
    catch (err) {
        return { "success": false, "error": err.message };
    }
};

// Run validate assignment
exports.validate_assignment = async (address, student_address, contract_address, contract_name) => {
    try {
        const result = await assignments.validate_assignment(student_address, contract_address, contract_name)
        return { "success": true, "id": result };
    }
    catch (err) {
        return { "success": false, "error": err.message };
    }
};