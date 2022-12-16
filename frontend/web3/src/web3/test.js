// IGNORE THIS FILE
// THIS FILE IS ONLY FOR TESTING PURPOSES
// IGNORE THIS FILE

const Web3 = require("web3");
const web3 = new Web3("http://localhost:8545");


const config_handler = require("./config");
const config = new config_handler.Config(web3);

const account_handler = require("./account");
const account = new account_handler.UniMaAccount(web3);

const assignment_handler = require("./assignment");
const assignment = new assignment_handler.UniMaAssignments(web3);

const utilsHandler = require("./utils");
const utils = new utilsHandler.UniMaUtils();

const example_contract_address = "0x0342C05F1E8b2a88554339a43BA8119F9dBE498C"
const example_validation_address = "0xf11Fcb601841ce60bC556d3744427A4C6cf5Ab5b"

const student_address = "0x917441412223Ac1104617Ca07ca9853504BEA5d0"

config.getContractAdmins().then((admins) => {
    console.log(admins);
});

assignment.validate_assignment(student_address, example_contract_address, example_validation_address).then(async (result) => {
    const id = result;

    const test_results = await assignment.get_test_results(id, example_validation_address);

    console.log(test_results);

    const test_results2 = await assignment.submitAssignment(student_address, example_contract_address, example_validation_address);

    console.log(test_results2);
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

