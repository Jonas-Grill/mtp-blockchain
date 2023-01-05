const ConfigStorage = artifacts.require("ConfigStorage");
const ExampleAssignment = artifacts.require("ExampleAssignment");
const ExampleAssignmentValidator = artifacts.require("ExampleAssignmentValidator");
const ExampleAssignmentValidator2 = artifacts.require("ExampleAssignmentValidator2");

contract("ConfigStorage", (accounts) => {

    /*=============================================
    =            Other            =
    =============================================*/


    it("should get faucetGas", async () => {
        const ConfigStorageInstance = await ConfigStorage.deployed();

        const value = await ConfigStorageInstance.getFaucetGas();

        assert.equal(value, 2, "FaucetGas is 2");
    });

    it("should get faucetBlockNoDifference", async () => {
        const ConfigStorageInstance = await ConfigStorage.deployed();

        const value = await ConfigStorageInstance.getFaucetBlockNoDifference();

        assert.equal(value, 10, "FaucetBlockNoDifference is 10");
    });

    it("should add faucetGas", async () => {
        const ConfigStorageInstance = await ConfigStorage.deployed();

        await ConfigStorageInstance.setFaucetGas(20);

        const value = await ConfigStorageInstance.getFaucetGas();

        assert.equal(value, 20, "faucetGas is 20");
    });

    it("should add faucetBlockNoDifference", async () => {
        const ConfigStorageInstance = await ConfigStorage.deployed();

        await ConfigStorageInstance.setFaucetBlockNoDifference(30);

        const value = await ConfigStorageInstance.getFaucetBlockNoDifference();

        assert.equal(value, 30, "FaucetBlockNoDifference is 30");
    });

    /*=====  End of Other  ======*/


    /*=============================================
    =            SEMESTER TEST            =
    =============================================*/


    it("should add semester", async () => {
        const ConfigStorageInstance = await ConfigStorage.deployed();

        await ConfigStorageInstance.appendSemester("SS 2023", 1, 10, 5);

        const semesterId = await ConfigStorageInstance.getSemesterCounter();

        const value = await ConfigStorageInstance.getSemester(semesterId);

        assert.equal(value["name"], "SS 2023", "Semester is SS 2023");
        assert.equal(value["startBlock"], 1, "StartBlock is 1");
        assert.equal(value["endBlock"], 10, "EndBlock is 10");
        assert.equal(value["minKnowledgeCoinAmount"], 5, "MinKnowledgeCoinAmount is 5");
    });

    it("should delete semester", async () => {
        const ConfigStorageInstance = await ConfigStorage.deployed();

        const semesterId = await ConfigStorageInstance.getSemesterCounter();

        await ConfigStorageInstance.deleteSemester(semesterId);

        const value = await ConfigStorageInstance.getSemester(semesterId);

        assert.equal(value["startBlock"], 0, "StartBlock is 0");
        assert.equal(value["endBlock"], 0, "EndBlock is 0");
        assert.equal(value["minKnowledgeCoinAmount"], 0, "MinKnowledgeCoinAmount is 0");
    });

    it("should set semester amount knowledge coins", async () => {
        const ConfigStorageInstance = await ConfigStorage.deployed();

        await ConfigStorageInstance.appendSemester("SS 2023", 1, 10, 5);

        const semesterId = await ConfigStorageInstance.getSemesterCounter();

        await ConfigStorageInstance.setSemesterMinKnowledgeCoinAmount(semesterId, 10);

        const value = await ConfigStorageInstance.getSemester(semesterId);

        assert.equal(value["minKnowledgeCoinAmount"], 10, "MinKnowledgeCoinAmount is 10");
    });

    it("should set semester start block", async () => {
        const ConfigStorageInstance = await ConfigStorage.deployed();

        await ConfigStorageInstance.appendSemester("SS 2023", 1, 10, 5);

        const semesterId = await ConfigStorageInstance.getSemesterCounter();

        await ConfigStorageInstance.setSemesterStartBlock(semesterId, 2);

        const value = await ConfigStorageInstance.getSemester(semesterId);

        assert.equal(value["startBlock"], 2, "StartBlock is 2");
    });

    it("should set semester end block", async () => {
        const ConfigStorageInstance = await ConfigStorage.deployed();

        await ConfigStorageInstance.appendSemester("SS 2023", 1, 10, 5);

        const semesterId = await ConfigStorageInstance.getSemesterCounter();

        await ConfigStorageInstance.setSemesterEndBlock(semesterId, 11);

        const value = await ConfigStorageInstance.getSemester(semesterId);

        assert.equal(value["endBlock"], 11, "EndBlock is 11");
    });

    it("should set semester name", async () => {
        const ConfigStorageInstance = await ConfigStorage.deployed();

        await ConfigStorageInstance.appendSemester("SS 2023", 1, 10, 5);

        const semesterId = await ConfigStorageInstance.getSemesterCounter();

        await ConfigStorageInstance.setSemesterName(semesterId, "SS 2024");

        const value = await ConfigStorageInstance.getSemester(semesterId);

        assert.equal(value["name"], "SS 2024", "Semester is SS 2024");
    });

    /*=====  End of SEMESTER  ======*/


    /*=============================================
    =            ASSIGNMENT TEST            =
    =============================================*/

    it("should add assignment", async () => {
        const ConfigStorageInstance = await ConfigStorage.deployed();
        const ExampleAssignmentValidatorInstance = await ExampleAssignmentValidator.deployed(ConfigStorageInstance.address);

        // Add semester
        await ConfigStorageInstance.appendSemester("SS 2023", 1, 10, 5);
        const semesterId = await ConfigStorageInstance.getSemesterCounter();

        // Add assignment
        await ConfigStorageInstance.appendAssignment(semesterId, "Assignment 1", "test-link", ExampleAssignmentValidatorInstance.address, 0, 10000);
        const assignmentId = await ConfigStorageInstance.getAssignmentCounter(semesterId);

        // Get assignment
        const value = await ConfigStorageInstance.getAssignment(semesterId, assignmentId);

        assert.equal(value["name"], "Assignment 1", "Assignment is Assignment 1");
        assert.equal(value["link"], "test-link", "Link is test-link");
        assert.equal(value["validationContractAddress"], ExampleAssignmentValidatorInstance.address, "Validator contract address is correct");
        assert.equal(value["startBlock"], 0, "StartBlock is 0");
        assert.equal(value["endBlock"], 10000, "EndBlock is 10000");

        // Get assignment validator
        assert.equal(await ExampleAssignmentValidatorInstance.isAssignmentLinked(), true, "Assignment is linked");

        // Clean up after
        await ConfigStorageInstance.deleteAssignment(semesterId, assignmentId);
        assert.equal(await ExampleAssignmentValidatorInstance.isAssignmentLinked(), false, "Assignment is not linked anymore");
    });

    it("should delete assignment", async () => {
        const ConfigStorageInstance = await ConfigStorage.deployed();
        const ExampleAssignmentValidatorInstance = await ExampleAssignmentValidator.deployed(ConfigStorageInstance.address);

        // Add semester
        await ConfigStorageInstance.appendSemester("SS 2023", 1, 10, 5);
        const semesterId = await ConfigStorageInstance.getSemesterCounter();

        // Add assignment
        await ConfigStorageInstance.appendAssignment(semesterId, "Assignment 1", "test-link", ExampleAssignmentValidatorInstance.address, 0, 10000);
        const assignmentId = await ConfigStorageInstance.getAssignmentCounter(semesterId);

        // Get assignment validator
        assert.equal(await ExampleAssignmentValidatorInstance.isAssignmentLinked(), true, "Assignment is linked");

        await ConfigStorageInstance.deleteAssignment(semesterId, assignmentId);

        const value = await ConfigStorageInstance.getAssignment(semesterId, assignmentId);

        assert.equal(value["name"], "", "Assignment is Assignment 1");
        assert.equal(value["link"], "", "Link is test-link");
        assert.equal(value["validationContractAddress"], "0x0000000000000000000000000000000000000000", "ValidAddress is 0x0000000000000000000000000000000000000000");
        assert.equal(value["startBlock"], 0, "StartBlock is 0");
        assert.equal(value["endBlock"], 0, "EndBlock is 0");

        // Get assignment validator
        assert.equal(await ExampleAssignmentValidatorInstance.isAssignmentLinked(), false, "Assignment is not linked anymore");

        // Clean up after if assignment is exists
        if (await ConfigStorageInstance.hasAssignmentId(semesterId, assignmentId)) {
            await ConfigStorageInstance.deleteAssignment(semesterId, assignmentId);
            assert.equal(await ExampleAssignmentValidatorInstance.isAssignmentLinked(), false, "Assignment is not linked anymore");
        }
    });

    it("should set assignment name", async () => {
        const ConfigStorageInstance = await ConfigStorage.deployed();
        const ExampleAssignmentValidatorInstance = await ExampleAssignmentValidator.deployed(ConfigStorageInstance.address);

        // Add semester
        await ConfigStorageInstance.appendSemester("SS 2023", 1, 10, 5);
        const semesterId = await ConfigStorageInstance.getSemesterCounter();

        // Add assignment
        await ConfigStorageInstance.appendAssignment(semesterId, "Assignment 1", "test-link", ExampleAssignmentValidatorInstance.address, 0, 10000);
        const assignmentId = await ConfigStorageInstance.getAssignmentCounter(semesterId);

        // Get assignment validator
        assert.equal(await ExampleAssignmentValidatorInstance.isAssignmentLinked(), true, "Assignment is linked");

        await ConfigStorageInstance.setAssignmentName(semesterId, assignmentId, "Assignment 2");

        const value = await ConfigStorageInstance.getAssignment(semesterId, assignmentId);

        assert.equal(value["name"], "Assignment 2", "Assignment is Assignment 2");

        // Clean up after if assignment is exists
        if (await ConfigStorageInstance.hasAssignmentId(semesterId, assignmentId)) {
            await ConfigStorageInstance.deleteAssignment(semesterId, assignmentId);
            assert.equal(await ExampleAssignmentValidatorInstance.isAssignmentLinked(), false, "Assignment is not linked anymore");
        }
    });

    it("should set assignment link", async () => {
        const ConfigStorageInstance = await ConfigStorage.deployed();
        const ExampleAssignmentValidatorInstance = await ExampleAssignmentValidator.deployed(ConfigStorageInstance.address);

        // Add semester
        await ConfigStorageInstance.appendSemester("SS 2023", 1, 10, 5);
        const semesterId = await ConfigStorageInstance.getSemesterCounter();

        // Add assignment
        await ConfigStorageInstance.appendAssignment(semesterId, "Assignment 1", "test-link", ExampleAssignmentValidatorInstance.address, 0, 10000);
        const assignmentId = await ConfigStorageInstance.getAssignmentCounter(semesterId);

        // Get assignment validator
        assert.equal(await ExampleAssignmentValidatorInstance.isAssignmentLinked(), true, "Assignment is linked");

        await ConfigStorageInstance.setAssignmentLink(semesterId, assignmentId, "test-link-2");

        const value = await ConfigStorageInstance.getAssignment(semesterId, assignmentId);

        assert.equal(value["link"], "test-link-2", "Link is test-link-2");

        // Clean up after if assignment is exists
        if (await ConfigStorageInstance.hasAssignmentId(semesterId, assignmentId)) {
            await ConfigStorageInstance.deleteAssignment(semesterId, assignmentId);
            assert.equal(await ExampleAssignmentValidatorInstance.isAssignmentLinked(), false, "Assignment is not linked anymore");
        }
    });

    it("should set assignment valid address", async () => {
        const ConfigStorageInstance = await ConfigStorage.deployed();
        const ExampleAssignmentValidatorInstance = await ExampleAssignmentValidator.deployed(ConfigStorageInstance.address);
        const ExampleAssignmentValidator2Instance = await ExampleAssignmentValidator2.deployed(ConfigStorageInstance.address);

        // Add semester
        await ConfigStorageInstance.appendSemester("SS 2023", 1, 10, 5);
        const semesterId = await ConfigStorageInstance.getSemesterCounter();

        // Add assignment
        await ConfigStorageInstance.appendAssignment(semesterId, "Assignment 1", "test-link", ExampleAssignmentValidatorInstance.address, 0, 10000);
        const assignmentId = await ConfigStorageInstance.getAssignmentCounter(semesterId);

        // Get assignment validator
        assert.equal(await ExampleAssignmentValidatorInstance.isAssignmentLinked(), true, "Assignment is linked");

        await ConfigStorageInstance.setAssignmentAddress(semesterId, assignmentId, ExampleAssignmentValidator2Instance.address);

        const value = await ConfigStorageInstance.getAssignment(semesterId, assignmentId);

        assert.equal(value["validationContractAddress"], ExampleAssignmentValidator2Instance.address, "ValidAddress is 0x10f76bccd5f7d335111a898e6f6121e3391773ce5117d3446f7490ab01235b5b");

        // Clean up after if assignment is exists
        if (await ConfigStorageInstance.hasAssignmentId(semesterId, assignmentId)) {
            await ConfigStorageInstance.deleteAssignment(semesterId, assignmentId);
            assert.equal(await ExampleAssignmentValidatorInstance.isAssignmentLinked(), false, "Assignment is not linked anymore");
        }
    });

    it("should set assignment start block", async () => {
        const ConfigStorageInstance = await ConfigStorage.deployed();
        const ExampleAssignmentValidatorInstance = await ExampleAssignmentValidator.deployed(ConfigStorageInstance.address);

        // Add semester
        await ConfigStorageInstance.appendSemester("SS 2023", 1, 10, 5);
        const semesterId = await ConfigStorageInstance.getSemesterCounter();

        // Add assignment
        await ConfigStorageInstance.appendAssignment(semesterId, "Assignment 1", "test-link", ExampleAssignmentValidatorInstance.address, 0, 10000);
        const assignmentId = await ConfigStorageInstance.getAssignmentCounter(semesterId);

        // Get assignment validator
        assert.equal(await ExampleAssignmentValidatorInstance.isAssignmentLinked(), true, "Assignment is linked");

        await ConfigStorageInstance.setAssignmentStartBlock(semesterId, assignmentId, 2);

        const value = await ConfigStorageInstance.getAssignment(semesterId, assignmentId);

        assert.equal(value["startBlock"], 2, "StartBlock is 2");

        // Clean up after if assignment is exists
        if (await ConfigStorageInstance.hasAssignmentId(semesterId, assignmentId)) {
            await ConfigStorageInstance.deleteAssignment(semesterId, assignmentId);
            assert.equal(await ExampleAssignmentValidatorInstance.isAssignmentLinked(), false, "Assignment is not linked anymore");
        }
    });

    it("should set assignment end block", async () => {
        const ConfigStorageInstance = await ConfigStorage.deployed();
        const ExampleAssignmentValidatorInstance = await ExampleAssignmentValidator.deployed(ConfigStorageInstance.address);

        // Add semester
        await ConfigStorageInstance.appendSemester("SS 2023", 1, 10, 5);
        const semesterId = await ConfigStorageInstance.getSemesterCounter();

        // Add assignment
        await ConfigStorageInstance.appendAssignment(semesterId, "Assignment 1", "test-link", ExampleAssignmentValidatorInstance.address, 0, 10000);
        const assignmentId = await ConfigStorageInstance.getAssignmentCounter(semesterId);

        // Get assignment validator
        assert.equal(await ExampleAssignmentValidatorInstance.isAssignmentLinked(), true, "Assignment is linked");

        await ConfigStorageInstance.setAssignmentEndBlock(semesterId, assignmentId, 11);

        const value = await ConfigStorageInstance.getAssignment(semesterId, assignmentId);

        assert.equal(value["endBlock"], 11, "EndBlock is 11");

        // Clean up after if assignment is exists
        if (await ConfigStorageInstance.hasAssignmentId(semesterId, assignmentId)) {
            await ConfigStorageInstance.deleteAssignment(semesterId, assignmentId);
            assert.equal(await ExampleAssignmentValidatorInstance.isAssignmentLinked(), false, "Assignment is not linked anymore");
        }
    });

    /*=====  End of ASSIGNMENT TEST  ======*/
});