// Require web3 for talking to api
const Web3 = require('web3')

// Require get_gas
const assignmentHandler = require('../src/web3/assignment')

//utils
const utilsHandler = require('../src/web3/utils')
const utils = new utilsHandler.NOWUtils()

// config
const networkId = "1337"

// Parse and set rpc url
const rpcURL = "http://localhost:8545";
const web3 = new Web3(rpcURL);
web3.setProvider(new web3.providers.HttpProvider(rpcURL));

// Mocha
var assert = require('assert');

// ganache prepare
var prepare = require('./ganache/setup-ganache')

const ganache = new prepare.GanacheHelper()



describe("test", function () {
    describe("assignment", function () {
        it("validate assignment should create entry in test results", async function () {
            const accounts = await ganache.getAccount()

            const assignment = new assignmentHandler.NOWAssignments(web3);

            const studentAddress = accounts[0]; // Address of the student who deployed the contract
            const exampleContractAddress = utils.getContractAddress("ExampleAssignment", networkId); // Address of the contract that is being tested
            const exampleValidationAddress = utils.getContractAddress("ExampleAssignmentValidator", networkId); // Address of the contract that is being tested

            const id = await assignment.validateAssignment(studentAddress, exampleContractAddress, exampleValidationAddress);

            const test_results = await assignment.getTestResults(id, exampleValidationAddress);

            assert.equal(test_results.length > 0, true);
        });

        it("validate assignment has 2 of 3 correct tests", async function () {
            const accounts = await ganache.getAccount()

            const assignment = new assignmentHandler.NOWAssignments(web3);

            const studentAddress = accounts[0]; // Address of the student who deployed the contract
            const exampleContractAddress = utils.getContractAddress("ExampleAssignment", networkId); // Address of the contract that is being tested
            const exampleValidationAddress = utils.getContractAddress("ExampleAssignmentValidator", networkId); // Address of the contract that is being tested

            const id = await assignment.validateAssignment(studentAddress, exampleContractAddress, exampleValidationAddress);

            const testResults = await assignment.getTestResults(id, exampleValidationAddress);

            let correctTestCounter = 0
            for (var i = 0; i < testResults.length; i++) {
                if (testResults[i].testPassed == true)
                    correctTestCounter++;
            }

            assert.equal(correctTestCounter, 2);
        });

        it("submit assignment was successful", async function () {
            /**
             * 1. Remove submitted assignment
             * 2. Submit assignment
             * 3. Check if assignment was submitted
             * 4. Check if test results are correct
             */
            const accounts = await ganache.getAccount()

            const assignment = new assignmentHandler.NOWAssignments(web3);

            const studentAddress = accounts[0]; // Address of the student who deployed the contract
            const exampleContractAddress = utils.getContractAddress("ExampleAssignment", networkId); // Address of the contract that is being tested
            const exampleValidationAddress = utils.getContractAddress("ExampleAssignmentValidator", networkId); // Address of the contract that is being tested

            await assignment.removeSubmittedAssignment(studentAddress, exampleValidationAddress);

            const assignmentBeforeSubmit = await assignment.getSubmittedAssignment(studentAddress, exampleValidationAddress);

            assert.equal(assignmentBeforeSubmit.submitted, false);

            await assignment.submitAssignment(studentAddress, exampleContractAddress, exampleValidationAddress);

            const assignmentAfterSubmit = await assignment.getSubmittedAssignment(studentAddress, exampleValidationAddress);

            assert.equal(assignmentAfterSubmit.submitted, true);

            const testResults = await assignment.getTestResults(assignmentAfterSubmit.testIndex, exampleValidationAddress);

            let correctTestCounter = 0
            for (var i = 0; i < testResults.length; i++) {
                if (testResults[i].testPassed == true)
                    correctTestCounter++;
            }

            assert.equal(correctTestCounter, 2);
        });

        it("submit assignment not successful because address from other user wants to submit not his own contract", async function () {
            /**
             * 1. Remove submitted assignment
             * 2. Submit assignment
             * 3. Check if assignment was NOT submitted and error message is correct
             */
            const accounts = await ganache.getAccount()

            const assignment = new assignmentHandler.NOWAssignments(web3);

            const studentAddress = accounts[1]; // Address of the student who deployed the contract
            const exampleContractAddress = utils.getContractAddress("ExampleAssignment", networkId); // Address of the contract that is being tested
            const exampleValidationAddress = utils.getContractAddress("ExampleAssignmentValidator", networkId); // Address of the contract that is being tested

            await assignment.removeSubmittedAssignment(studentAddress, exampleValidationAddress);

            const assignmentBeforeSubmit = await assignment.getSubmittedAssignment(studentAddress, exampleValidationAddress);

            assert.equal(assignmentBeforeSubmit.submitted, false);

            let error = false;
            try {
                await assignment.submitAssignment(studentAddress, exampleContractAddress, exampleValidationAddress);
            }
            catch (e) {
                error = true;
                assert.equal(e.message, "Returned error: VM Exception while processing transaction: revert Only the owner of the contract can submit the assignment!", "Error message is correct");
            }

            assert(error, true, "Error occured")
        });

        it("validate assignment that is not made for the validator", async function () {
            const accounts = await ganache.getAccount()

            const assignment = new assignmentHandler.NOWAssignments(web3);

            const studentAddress = accounts[0]; // Address of the student who deployed the contract
            const exampleContractAddress = utils.getContractAddress("ExampleAssignmentValidator", networkId); // Address of the contract that is being tested
            const exampleValidationAddress = utils.getContractAddress("ExampleAssignmentValidator", networkId); // Address of the contract that is being tested

            let error = false;
            try {
                await assignment.validateAssignment(studentAddress, exampleContractAddress, exampleValidationAddress);
            }
            catch (e) {
                error = true;
                assert(e.message, "Assignment validation failed, because contract is not made for this assignment.", "Error message is correct")
            }

            assert(error, true, "Error occured")
        });
    });
});