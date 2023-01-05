const ExampleAssignment = artifacts.require("ExampleAssignment");
const ExampleAssignmentValidator = artifacts.require("ExampleAssignmentValidator");

const ConfigStorage = artifacts.require("ConfigStorage");
const SBCoin = artifacts.require("SBCoin");

const name = "KnowledgeCoin";
const symbol = "NOW";

contract("Assignment", (accounts) => {
    it("validate assignment should create entry in test results", async () => {
        const ConfigStorageInstance = await ConfigStorage.deployed();
        const ExampleAssignmentInstance = await ExampleAssignment.deployed();
        const ExampleAssignmentValidatorInstance = await ExampleAssignmentValidator.deployed(ConfigStorageInstance.address);

        // Add semester
        await ConfigStorageInstance.appendSemester("SS 2023", 1, 10, 5);
        const semesterId = await ConfigStorageInstance.getSemesterCounter();

        // Add assignment
        await ConfigStorageInstance.appendAssignment(semesterId, "Assignment 1", "test-link", ExampleAssignmentValidatorInstance.address, 0, 10000);
        const assignmentId = await ConfigStorageInstance.getAssignmentCounter(semesterId);

        const account = accounts[0];

        // Mock the submit to get the id and then submit the assignment again without the call method to actually change the chain
        const id = (await ExampleAssignmentValidatorInstance.validateAssignment.call(ExampleAssignmentInstance.address, { from: account })).toNumber();
        await ExampleAssignmentValidatorInstance.validateAssignment(ExampleAssignmentInstance.address, { from: account });

        assert.equal(id, 1, "id should be 1");

        const test_results = await ExampleAssignmentValidatorInstance.getTestResults.call(id);

        assert.equal(test_results.length > 0, true, "test results should be greater than 0");

        // Clean up after if assignment is exists
        if (await ConfigStorageInstance.hasAssignmentId(semesterId, assignmentId)) {
            await ConfigStorageInstance.deleteAssignment(semesterId, assignmentId);
            assert.equal(await ExampleAssignmentValidatorInstance.isAssignmentLinked(), false, "Assignment is not linked anymore");
        }
    });

    it("validate assignment has 2 of 3 correct tests", async () => {
        const ConfigStorageInstance = await ConfigStorage.deployed();
        const ExampleAssignmentInstance = await ExampleAssignment.deployed();
        const ExampleAssignmentValidatorInstance = await ExampleAssignmentValidator.deployed(ConfigStorageInstance.address);

        // Add semester
        await ConfigStorageInstance.appendSemester("SS 2023", 1, 10, 5);
        const semesterId = await ConfigStorageInstance.getSemesterCounter();

        // Add assignment
        await ConfigStorageInstance.appendAssignment(semesterId, "Assignment 1", "test-link", ExampleAssignmentValidatorInstance.address, 0, 10000);
        const assignmentId = await ConfigStorageInstance.getAssignmentCounter(semesterId);

        const account = accounts[0];

        // Mock the submit to get the id and then submit the assignment again without the call method to actually change the chain
        const id = (await ExampleAssignmentValidatorInstance.validateAssignment.call(ExampleAssignmentInstance.address, { from: account })).toNumber();
        await ExampleAssignmentValidatorInstance.validateAssignment(ExampleAssignmentInstance.address, { from: account });

        assert.equal(id, 2, "id should be 1");

        const testResults = await ExampleAssignmentValidatorInstance.getTestResults.call(id);

        let correctTestCounter = 0
        for (var i = 0; i < testResults.length; i++) {
            if (testResults[i].testPassed == true)
                correctTestCounter++;
        }

        assert.equal(correctTestCounter, 2, "correct test counter should be 1");

        // Clean up after if assignment is exists
        if (await ConfigStorageInstance.hasAssignmentId(semesterId, assignmentId)) {
            await ConfigStorageInstance.deleteAssignment(semesterId, assignmentId);
            assert.equal(await ExampleAssignmentValidatorInstance.isAssignmentLinked(), false, "Assignment is not linked anymore");
        }
    });

    it("submit assignment was successful", async () => {

        const ConfigStorageInstance = await ConfigStorage.deployed({ from: accounts[0] });
        const ExampleAssignmentInstance = await ExampleAssignment.deployed({ from: accounts[0] });
        const ExampleAssignmentValidatorInstance = await ExampleAssignmentValidator.deployed(ConfigStorageInstance.address, { from: accounts[0] });
        const SBCoinInstance = await SBCoin.deployed(name, symbol, ConfigStorageInstance.address);

        // Add semester
        await ConfigStorageInstance.appendSemester("SS 2023", 1, 10, 5);
        const semesterId = await ConfigStorageInstance.getSemesterCounter();

        // Add assignment
        await ConfigStorageInstance.appendAssignment(semesterId, "Assignment 1", "test-link", ExampleAssignmentValidatorInstance.address, 0, 10000);
        const assignmentId = await ConfigStorageInstance.getAssignmentCounter(semesterId);

        const account = accounts[0];

        // Mock the submit to get the id and then submit the assignment again without the call method to actually change the chain
        const id = (await ExampleAssignmentValidatorInstance.submitAssignment.call(ExampleAssignmentInstance.address, { from: account })).toNumber();
        await ExampleAssignmentValidatorInstance.submitAssignment(ExampleAssignmentInstance.address, { from: account });

        assert.equal(id, 3, "id should be 1");

        const testResults = await ExampleAssignmentValidatorInstance.getTestResults.call(id);

        let correctTestCounter = 0
        for (var i = 0; i < testResults.length; i++) {
            if (testResults[i].testPassed == true)
                correctTestCounter++;
        }

        assert.equal(correctTestCounter, 2);

        const coins = await SBCoinInstance.scaledBalanceOf(account);

        assert.equal(coins, correctTestCounter, "balance should be 2");

        // Clean up after if assignment is exists
        if (await ConfigStorageInstance.hasAssignmentId(semesterId, assignmentId)) {
            await ConfigStorageInstance.deleteAssignment(semesterId, assignmentId);
            assert.equal(await ExampleAssignmentValidatorInstance.isAssignmentLinked(), false, "Assignment is not linked anymore");
        }
    });

    it
});
