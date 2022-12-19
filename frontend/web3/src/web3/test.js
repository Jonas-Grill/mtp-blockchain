// IGNORE THIS FILE
// THIS FILE IS ONLY FOR TESTING PURPOSES
// IGNORE THIS FILE

const Web3 = require("web3");
const web3 = new Web3("http://localhost:8545");


const config_handler = require("./config");
const config = new config_handler.Config(web3);

const account_handler = require("./account");
const account = new account_handler.NOWAccount(web3);

const assignment_handler = require("./assignment");
const assignment = new assignment_handler.NOWAssignments(web3);

const utilsHandler = require("./utils");
const utils = new utilsHandler.NOWUtils();

const example_contract_address = "0x5d7A85abc9edce70bb91b6DC2f729129BCAf297E"
const example_validation_address = "0x5Ef0206aEdc5B0065B9F46532f1aAc98C13bcDB9"

const student_address = "0x917441412223Ac1104617Ca07ca9853504BEA5d0"

config.getContractAdmins().then((admins) => {
    console.log(admins);
});

config.getContractAdminAddresses().then((admins) => {
    console.log(admins);
});

assignment.validateAssignment(student_address, example_contract_address, example_validation_address).then(async (result) => {
    const id = result;

    const test_results = await assignment.getTestResults(id, example_validation_address);

    console.log(test_results);

    const test_results2 = await assignment.submitAssignment(student_address, example_contract_address, example_validation_address);

    console.log(test_results2);

    var balance = await account.getKnowledgeCoinBalance(student_address)

    console.log(balance);

    var testIndexes = await assignment.getTestHistoryIndexes(student_address, example_validation_address);

    console.log(testIndexes);

    var submittedAssignment = await assignment.getSubmittedAssignment(student_address, example_validation_address);

    console.log(submittedAssignment);
});


/**
config.setFaucetGas(config.getCoinbaseAddress, 1).then((result) => {
    account.sendEth("0xaDD6e840C640C160C044543A02F7A4d56B29D32e").then((result) => {
        console.log(result);
    });
});
 */


/**
config.getContractAdmins().then((admins) => {
    console.log(admins);
});
 
*/

/**
config.appendSemester("Test Semester", 0, 100, 100).then(async (semester_id) => {
    console.log(semester_id);
 
    const semester_ids = await config.getSemesterIds()
 
    console.log(semester_ids);
 
    await config.deleteSemester(semester_id)
 
    console.log(await config.getSemesterIds());
});
*/

