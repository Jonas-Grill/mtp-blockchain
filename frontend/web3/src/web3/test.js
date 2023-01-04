// IGNORE THIS FILE
// THIS FILE IS ONLY FOR TESTING PURPOSES
// IGNORE THIS FILE

const Web3 = require("web3");
const web3 = new Web3("http://localhost:8545");


const config_handler = require("./config");
const config = new config_handler.NOWConfig(web3);

const account_handler = require("./account");
const account = new account_handler.NOWAccount(web3);

const assignment_handler = require("./assignment");
const assignment = new assignment_handler.NOWAssignments(web3);

const utilsHandler = require("./utils");
const utils = new utilsHandler.NOWUtils();


const networkId = 1337

const student_address = "0x917441412223Ac1104617Ca07ca9853504BEA5d0"

const example_contract_address = utils.getContractAddress("ExampleAssignment", networkId); // Address of the contract that is being tested
const example_validation_address = utils.getContractAddress("ExampleAssignmentValidator", networkId); // Address of the contract that is being tested

assignment.validateAssignment(student_address, example_contract_address, example_validation_address).then(async (result) => {
    const id = result;

    if (await assignment.hasSubmittedAssignment(student_address, example_validation_address)) {
        console.log("has submitted assignment");
        await assignment.removeSubmittedAssignment(student_address, example_validation_address);
    }
    const assignmentBeforeSubmit = await assignment.getSubmittedAssignment(student_address, example_validation_address);

    await assignment.submitAssignment(student_address, example_contract_address, example_validation_address);

    const assignmentAfterSubmit = await assignment.getSubmittedAssignment(student_address, example_validation_address);

    const testResults = await assignment.getTestResults(assignmentAfterSubmit.testIndex, example_validation_address);

    let correctTestCounter = 0
    for (var i = 0; i < testResults.length; i++) {
        if (testResults[i].testPassed == true)
            correctTestCounter++;
    }

    const coin = await account.getKnowledgeCoinBalance(student_address);

    console.log("Knowledge Coin Balance: " + coin);

    //const test_results2 = await assignment.submitAssignment(student_address, example_contract_address, example_validation_address);

    //console.log(test_results2);

    //var balance = await account.getKnowledgeCoinBalance(student_address)

    //console.log(balance);
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

