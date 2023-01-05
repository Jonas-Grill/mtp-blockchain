// Require web3 for talking to api
const Web3 = require('web3')

// Require assignment
const assignmentHandler = require('../src/web3/assignment')

// Require account
const accountHandler = require('../src/web3/account')

//utils
const utilsHandler = require('../src/web3/utils')
const utils = new utilsHandler.NOWUtils()

// config
const configHandler = require('../src/web3/config')


// Parse and set rpc url
const rpcURL = "http://localhost:8545";
const web3 = new Web3(rpcURL);
web3.setProvider(new web3.providers.HttpProvider(rpcURL));

// Mocha
var assert = require('assert');

// ganache prepare
var prepare = require('./ganache/setup-ganache')

const ganache = new prepare.GanacheHelper()

require('dotenv').config()

describe("test", function () {
    describe("assignment", function () {
        it("validate assignment should create entry in test results", async function () {
            const accounts = await ganache.getAccount()

            // config
            const networkId = await web3.eth.net.getId()

            const assignment = new assignmentHandler.NOWAssignments(web3);

            const exampleContractAddress = utils.getContractAddress("ExampleAssignment", networkId); // Address of the contract that is being tested
            const exampleValidationAddress = utils.getContractAddress("ExampleAssignmentValidator", networkId); // Address of the contract that is being tested

            const infos = await assignment.getAssignmentInfos(exampleValidationAddress);

            // Create config class with config path
            const config = new configHandler.NOWConfig(web3)

            if (infos["2"] == true) {
                config.deleteAssignment(infos["0"], infos["1"]);
            }

            // Create new semester
            const semesterId = await config.appendSemester("test", 1, 20000, 5);

            // Create new assignment
            const assignmentId = await config.appendAssignment(semesterId, "test", "test-link", exampleValidationAddress, 1, 19999)

            const id = await assignment.validateAssignment(exampleContractAddress, exampleValidationAddress);

            const test_results = await assignment.getTestResults(id, exampleValidationAddress);

            assert.equal(test_results.length > 0, true);

            if (await config.hasAssignment(semesterId, assignmentId)) {
                await config.deleteAssignment(semesterId, assignmentId);
            }
        });

        it("validate assignment has 2 of 3 correct tests", async function () {
            const accounts = await ganache.getAccount()
            const networkId = await web3.eth.net.getId()

            const assignment = new assignmentHandler.NOWAssignments(web3);

            const studentAddress = accounts[0]; // Address of the student who deployed the contract
            const exampleContractAddress = utils.getContractAddress("ExampleAssignment", networkId); // Address of the contract that is being tested
            const exampleValidationAddress = utils.getContractAddress("ExampleAssignmentValidator", networkId); // Address of the contract that is being tested

            // Create config class with config path
            const config = new configHandler.NOWConfig(web3)

            // Create new semester
            const semesterId = await config.appendSemester("test", 1, 20000, 5);

            // Create new assignment
            const assignmentId = await config.appendAssignment(semesterId, "test", "test-link", exampleValidationAddress, 2, 19999)

            const id = await assignment.validateAssignment(exampleContractAddress, exampleValidationAddress);

            const testResults = await assignment.getTestResults(id, exampleValidationAddress);

            let correctTestCounter = 0
            for (var i = 0; i < testResults.length; i++) {
                if (testResults[i].testPassed == true)
                    correctTestCounter++;
            }

            assert.equal(correctTestCounter, 2);

            if (await config.hasAssignment(semesterId, assignmentId)) {
                await config.deleteAssignment(semesterId, assignmentId);
            }
        });

        it("submit assignment was successful", async function () {
            /**
             * 1. Remove submitted assignment
             * 2. Submit assignment
             * 3. Check if assignment was submitted
             * 4. Check if test results are correct
             */
            const accounts = await ganache.getAccount()
            const networkId = await web3.eth.net.getId()

            const assignment = new assignmentHandler.NOWAssignments(web3);

            const studentAddress = accounts[0]; // Address of the student who deployed the contract
            const exampleContractAddress = utils.getContractAddress("ExampleAssignment", networkId); // Address of the contract that is being tested
            const exampleValidationAddress = utils.getContractAddress("ExampleAssignmentValidator", networkId); // Address of the contract that is being tested

            // Create config class with config path
            const config = new configHandler.NOWConfig(web3)

            // Create new semester
            const semesterId = await config.appendSemester("test", 1, 20000, 5);

            // Create new assignment
            const assignmentId = await config.appendAssignment(semesterId, "test", "test-link", exampleValidationAddress, 2, 19999)

            if (await assignment.hasSubmittedAssignment(studentAddress, exampleValidationAddress))
                await assignment.removeSubmittedAssignment(studentAddress, exampleValidationAddress);

            const assignmentBeforeSubmit = await assignment.getSubmittedAssignment(studentAddress, exampleValidationAddress);

            assert.equal(assignmentBeforeSubmit.submitted, false);

            await assignment.submitAssignment(exampleContractAddress, exampleValidationAddress);

            const assignmentAfterSubmit = await assignment.getSubmittedAssignment(studentAddress, exampleValidationAddress);

            assert.equal(assignmentAfterSubmit.submitted, true);

            const testResults = await assignment.getTestResults(assignmentAfterSubmit.testIndex, exampleValidationAddress);

            let correctTestCounter = 0
            for (var i = 0; i < testResults.length; i++) {
                if (testResults[i].testPassed == true)
                    correctTestCounter++;
            }

            assert.equal(correctTestCounter, 2);

            const account = new accountHandler.NOWAccount(web3);

            const coin = await account.getKnowledgeCoinBalance(studentAddress);

            console.log("Knowledge coin balance: " + coin)
            assert.equal(coin, 2, "Knowledge coin balance should be 2");

            if (await config.hasAssignment(semesterId, assignmentId)) {
                await config.deleteAssignment(semesterId, assignmentId);
            }
        });

        it("validate assignment that is not made for the validator", async function () {
            const accounts = await ganache.getAccount()
            const networkId = await web3.eth.net.getId()

            const assignment = new assignmentHandler.NOWAssignments(web3);

            const studentAddress = accounts[0]; // Address of the student who deployed the contract
            const exampleContractAddress = utils.getContractAddress("ExampleAssignmentValidator", networkId); // Address of the contract that is being tested
            const exampleValidationAddress = utils.getContractAddress("ExampleAssignmentValidator", networkId); // Address of the contract that is being tested

            // Create config class with config path
            const config = new configHandler.NOWConfig(web3)

            // Create new semester
            const semesterId = await config.appendSemester("test", 1, 20000, 5);

            // Create new assignment
            const assignmentId = await config.appendAssignment(semesterId, "test", "test-link", exampleValidationAddress, 2, 19999)

            let error = false;
            try {
                await assignment.validateAssignment(exampleContractAddress, exampleValidationAddress);
            }
            catch (e) {
                error = true;
                assert(e.message, "Assignment validation failed, because contract is not made for this assignment.", "Error message is correct")
            }

            assert(error, true, "Error occured")

            if (await config.hasAssignment(semesterId, assignmentId)) {
                await config.deleteAssignment(semesterId, assignmentId);
            }
        });
    });
});