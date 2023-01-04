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

        const account = accounts[0];

        // Mock the submit to get the id and then submit the assignment again without the call method to actually change the chain
        const id = (await ExampleAssignmentValidatorInstance.validateAssignment.call(account, ExampleAssignmentInstance.address)).toNumber();
        await ExampleAssignmentValidatorInstance.validateAssignment(account, ExampleAssignmentInstance.address);

        assert.equal(id, 1, "id should be 1");

        const test_results = await ExampleAssignmentValidatorInstance.getTestResults.call(id);

        assert.equal(test_results.length > 0, true, "test results should be greater than 0");
    });

    it("validate assignment has 2 of 3 correct tests", async () => {
        const ConfigStorageInstance = await ConfigStorage.deployed();
        const ExampleAssignmentInstance = await ExampleAssignment.deployed();
        const ExampleAssignmentValidatorInstance = await ExampleAssignmentValidator.deployed(ConfigStorageInstance.address);

        const account = accounts[0];

        // Mock the submit to get the id and then submit the assignment again without the call method to actually change the chain
        const id = (await ExampleAssignmentValidatorInstance.validateAssignment.call(account, ExampleAssignmentInstance.address)).toNumber();
        await ExampleAssignmentValidatorInstance.validateAssignment(account, ExampleAssignmentInstance.address);

        assert.equal(id, 2, "id should be 1");

        const testResults = await ExampleAssignmentValidatorInstance.getTestResults.call(id);

        let correctTestCounter = 0
        for (var i = 0; i < testResults.length; i++) {
            if (testResults[i].testPassed == true)
                correctTestCounter++;
        }

        assert.equal(correctTestCounter, 2, "correct test counter should be 1");
    });

    it("submit assignment was successful", async () => {

        const ConfigStorageInstance = await ConfigStorage.deployed({ from: accounts[0] });
        const ExampleAssignmentInstance = await ExampleAssignment.deployed({ from: accounts[0] });
        const ExampleAssignmentValidatorInstance = await ExampleAssignmentValidator.deployed(ConfigStorageInstance.address, { from: accounts[0] });
        const SBCoinInstance = await SBCoin.deployed(name, symbol, ConfigStorageInstance.address);

        const account = accounts[0];

        // Mock the submit to get the id and then submit the assignment again without the call method to actually change the chain
        const id = (await ExampleAssignmentValidatorInstance.submitAssignment.call(account, ExampleAssignmentInstance.address)).toNumber();
        await ExampleAssignmentValidatorInstance.submitAssignment(account, ExampleAssignmentInstance.address);

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
    });

    it
});
