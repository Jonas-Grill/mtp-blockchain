/*----------  Utils Helper  ----------*/
// utils
const utilsHelper = require("../../web3/utils")
// Create utils class
const utils = new utilsHelper.UniMaUtils()

/*----------  Assignment Helper  ----------*/
// assignments
const assignmentsHandler = require("../../web3/assignment")


// Run validator for test assignment
exports.get_test_results = async (web3, contract_name, test_id) => {
    try {
        const assignments = new assignmentsHandler.UniMaAssignments(web3);

        const result = await assignments.get_test_results(contract_name, test_id)
        return { "success": true, "result": result };
    }
    catch (err) {
        return { "success": false, "error": err.message };
    }
};

// Run validate assignment
exports.validate_assignment = async (web3, student_address, contract_address, validation_contract_address) => {
    try {
        const assignments = new assignmentsHandler.UniMaAssignments(web3);
        const result = await assignments.validate_assignment(student_address, contract_address, validation_contract_address)
        return { "success": true, "id": result };
    } catch (err) {
        return { "success": false, "error": err.message };
    }
};
