/*----------  Utils Helper  ----------*/
// utils
const utilsHelper = require("../../web3/utils")
// Create utils class
const utils = new utilsHelper.UniMaUtils()

/*----------  Assignment Helper  ----------*/
// assignments
const assignmentsHandler = require("../../web3/assignment")


// Run validate assignment
exports.validateAssignment = async (web3, student_address, contract_address, validation_contract_address) => {
    const assignments = new assignmentsHandler.UniMaAssignments(web3);

    return await assignments.validateAssignment(student_address, contract_address, validation_contract_address)

};

// Submit assignment
exports.submitAssignment = async (web3, student_address, contract_address, validation_contract_address) => {
    const assignments = new assignmentsHandler.UniMaAssignments(web3);

    return await assignments.submitAssignment(student_address, contract_address, validation_contract_address)
}

// Run validator for test assignment
exports.getTestResults = async (web3, contract_address, test_id) => {
    const assignments = new assignmentsHandler.UniMaAssignments(web3);

    return await assignments.getTestResults(contract_address, test_id)
};

// Get test indexes for student address
exports.getTestIndexes = async (web3, student_address, contract_address) => {
    const assignments = new assignmentsHandler.UniMaAssignments(web3);

    return await assignments.getTestHistoryIndexes(student_address, contract_address)
}

// Get submitted assignment for student address
exports.getSubmittedAssignment = async (web3, student_address, contract_address) => {
    const assignments = new assignmentsHandler.UniMaAssignments(web3);

    return await assignments.getSubmittedAssignment(student_address, contract_address)
}