/*----------  Utils Helper  ----------*/
// utils
const utilsHelper = require("../../web3/utils")
// Create utils class
const utils = new utilsHelper.NOWUtils()

/*----------  Assignment Helper  ----------*/
// assignments
const assignmentsHandler = require("../../web3/assignment")


// Run validate assignment
exports.validateAssignment = async (web3, studentAddress, contractAddress, validationContractAddress) => {
    const assignments = new assignmentsHandler.NOWAssignments(web3);

    return await assignments.validateAssignment(studentAddress, contractAddress, validationContractAddress)

};

// Submit assignment
exports.submitAssignment = async (web3, studentAddress, contractAddress, validationContractAddress) => {
    const assignments = new assignmentsHandler.NOWAssignments(web3);

    return await assignments.submitAssignment(studentAddress, contractAddress, validationContractAddress)
}

// Run validator for test assignment
exports.getTestResults = async (web3, contractAddress, testId) => {
    const assignments = new assignmentsHandler.NOWAssignments(web3);

    return await assignments.getTestResults(contractAddress, testId)
};

// Get test indexes for student address
exports.getTestIndexes = async (web3, studentAddress, contractAddress) => {
    const assignments = new assignmentsHandler.NOWAssignments(web3);

    return await assignments.getTestHistoryIndexes(studentAddress, contractAddress)
}

// Get submitted assignment for student address
exports.getSubmittedAssignment = async (web3, studentAddress, contractAddress) => {
    const assignments = new assignmentsHandler.NOWAssignments(web3);

    return await assignments.getSubmittedAssignment(studentAddress, contractAddress)
}