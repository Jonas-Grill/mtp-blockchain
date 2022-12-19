/*----------  NOWConfig Helper  ----------*/
// config
const configHandler = require("../../web3/config")
// Create config class with config path

/*----------  Utils Helper  ----------*/
// utils
const utilsHelper = require("../../web3/utils")
// Create utils class
const utils = new utilsHelper.NOWUtils()

/*=============================================
=            GETTER            =
=============================================*/

// Get assignment
exports.getAssignment = async (web3, semesterId, assignmentId) => {
    const config = new configHandler.NOWConfig(web3)

    var assignment = await config.getAssignment(semesterId, assignmentId)
    return { "name": assignment[0], "link": assignment[1], "validationContractAddress": assignment[2], "startBlock": assignment[3], "endBlock": assignment[4] };

};

// Get semester ids
exports.getAssignmentIds = async (web3, semesterId) => {
    const config = new configHandler.NOWConfig(web3)

    return await config.getAssignmentIds(semesterId)
};

/*=====  End of GETTER  ======*/



/*=============================================
=            SETTER            =
=============================================*/


/*----------  ADD  ----------*/


// Append new assignment to semester
exports.appendAssignment = async (web3, semesterId, name, link, validationContractAddress, startBlock, endBlock) => {
    const config = new configHandler.NOWConfig(web3)

    return await config.appendAssignment(semesterId, name, link, validationContractAddress, startBlock, endBlock)
};

/*----------  DELETE  ----------*/

// Delete assignment
exports.deleteAssignment = async (web3, semesterId, assignmentId) => {
    const config = new configHandler.NOWConfig(web3)

    await config.deleteAssignment(semesterId, assignmentId)
}

/*----------  EDIT  ----------*/

// Set assignment address
exports.setAssignmentAddress = async (web3, senesterId, assignmentId, address) => {
    const config = new configHandler.NOWConfig(web3)

    await config.setAssignmentAddress(senesterId, assignmentId, address)
};

// Set assignment link
exports.setAssignmentLink = async (web3, semesterId, assignmentId, link) => {
    const config = new configHandler.NOWConfig(web3)

    await config.setAssignmentLink(semesterId, assignmentId, link)
};

// Set assignment name
exports.setAssignmentName = async (web3, semesterId, assignmentId, name) => {
    const config = new configHandler.NOWConfig(web3)

    await config.setAssignmentName(semesterId, assignmentId, name)
};

// Set assignment start block
exports.setAssignmentStartBlock = async (web3, semesterId, assignmentId, startBlock) => {
    const config = new configHandler.NOWConfig(web3)

    await config.setAssignmentStartBlock(semesterId, assignmentId, startBlock)
};

// Set assignment end block
exports.setAssignmentEndBlock = async (web3, semesterId, assignmentId, endBlock) => {
    const config = new configHandler.NOWConfig(web3)

    await config.setAssignmentEndBlock(semesterId, assignmentId, endBlock)
};

/*=====  End of SETTER  ======*/

