const ConfigStorage = artifacts.require("ConfigStorage");

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

        await ConfigStorageInstance.appendSemester("SS 2023", 1, 10, 5);

        const semesterId = await ConfigStorageInstance.getSemesterCounter();

        await ConfigStorageInstance.appendAssignment(semesterId, "Assignment 1", "test-link", "0x71C7656EC7ab88b098defB751B7401B5f6d8976F", 5, 10);

        const assignmentId = await ConfigStorageInstance.getAssignmentCounter(semesterId);

        const value = await ConfigStorageInstance.getAssignment(semesterId, assignmentId);

        assert.equal(value["name"], "Assignment 1", "Assignment is Assignment 1");
        assert.equal(value["link"], "test-link", "Link is test-link");
        assert.equal(value["validationContractAddress"], "0x71C7656EC7ab88b098defB751B7401B5f6d8976F", "ValidAddress is 0x71C7656EC7ab88b098defB751B7401B5f6d8976F");
        assert.equal(value["startBlock"], 5, "StartBlock is 5");
        assert.equal(value["endBlock"], 10, "EndBlock is 10");
    });

    it("should delete assignment", async () => {
        const ConfigStorageInstance = await ConfigStorage.deployed();

        await ConfigStorageInstance.appendSemester("SS 2023", 1, 10, 5);

        const semesterId = await ConfigStorageInstance.getSemesterCounter();

        await ConfigStorageInstance.appendAssignment(semesterId, "Assignment 1", "test-link", "0x71C7656EC7ab88b098defB751B7401B5f6d8976F", 5, 10);

        const assignmentId = await ConfigStorageInstance.getAssignmentCounter(semesterId);

        await ConfigStorageInstance.deleteAssignment(semesterId, assignmentId);

        const value = await ConfigStorageInstance.getAssignment(semesterId, assignmentId);

        assert.equal(value["name"], "", "Assignment is Assignment 1");
        assert.equal(value["link"], "", "Link is test-link");
        assert.equal(value["validationContractAddress"], "0x0000000000000000000000000000000000000000", "ValidAddress is 0x0000000000000000000000000000000000000000");
        assert.equal(value["startBlock"], 0, "StartBlock is 0");
        assert.equal(value["endBlock"], 0, "EndBlock is 0");
    });

    it("should set assignment name", async () => {
        const ConfigStorageInstance = await ConfigStorage.deployed();

        await ConfigStorageInstance.appendSemester("SS 2023", 1, 10, 5);

        const semesterId = await ConfigStorageInstance.getSemesterCounter();

        await ConfigStorageInstance.appendAssignment(semesterId, "Assignment 1", "test-link", "0x71C7656EC7ab88b098defB751B7401B5f6d8976F", 5, 10);

        const assignmentId = await ConfigStorageInstance.getAssignmentCounter(semesterId);

        await ConfigStorageInstance.setAssignmentName(semesterId, assignmentId, "Assignment 2");

        const value = await ConfigStorageInstance.getAssignment(semesterId, assignmentId);

        assert.equal(value["name"], "Assignment 2", "Assignment is Assignment 2");
    });

    it("should set assignment link", async () => {
        const ConfigStorageInstance = await ConfigStorage.deployed();

        await ConfigStorageInstance.appendSemester("SS 2023", 1, 10, 5);

        const semesterId = await ConfigStorageInstance.getSemesterCounter();

        await ConfigStorageInstance.appendAssignment(semesterId, "Assignment 1", "test-link", "0x71C7656EC7ab88b098defB751B7401B5f6d8976F", 5, 10);

        const assignmentId = await ConfigStorageInstance.getAssignmentCounter(semesterId);

        await ConfigStorageInstance.setAssignmentLink(semesterId, assignmentId, "test-link-2");

        const value = await ConfigStorageInstance.getAssignment(semesterId, assignmentId);

        assert.equal(value["link"], "test-link-2", "Link is test-link-2");
    });

    it("should set assignment valid address", async () => {
        const ConfigStorageInstance = await ConfigStorage.deployed();

        await ConfigStorageInstance.appendSemester("SS 2023", 1, 10, 5);

        const semesterId = await ConfigStorageInstance.getSemesterCounter();

        await ConfigStorageInstance.appendAssignment(semesterId, "Assignment 1", "test-link", "0x71C7656EC7ab88b098defB751B7401B5f6d8976F", 5, 10);

        const assignmentId = await ConfigStorageInstance.getAssignmentCounter(semesterId);

        await ConfigStorageInstance.setAssignmentAddress(semesterId, assignmentId, "0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7");

        const value = await ConfigStorageInstance.getAssignment(semesterId, assignmentId);

        assert.equal(value["validationContractAddress"], "0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7", "ValidAddress is 0x10f76bccd5f7d335111a898e6f6121e3391773ce5117d3446f7490ab01235b5b");
    });

    it("should set assignment start block", async () => {
        const ConfigStorageInstance = await ConfigStorage.deployed();

        await ConfigStorageInstance.appendSemester("SS 2023", 1, 10, 5);

        const semesterId = await ConfigStorageInstance.getSemesterCounter();

        await ConfigStorageInstance.appendAssignment(semesterId, "Assignment 1", "test-link", "0x71C7656EC7ab88b098defB751B7401B5f6d8976F", 5, 10);

        const assignmentId = await ConfigStorageInstance.getAssignmentCounter(semesterId);

        await ConfigStorageInstance.setAssignmentStartBlock(semesterId, assignmentId, 2);

        const value = await ConfigStorageInstance.getAssignment(semesterId, assignmentId);

        assert.equal(value["startBlock"], 2, "StartBlock is 2");
    });

    it("should set assignment end block", async () => {
        const ConfigStorageInstance = await ConfigStorage.deployed();

        await ConfigStorageInstance.appendSemester("SS 2023", 1, 10, 5);

        const semesterId = await ConfigStorageInstance.getSemesterCounter();

        await ConfigStorageInstance.appendAssignment(semesterId, "Assignment 1", "test-link", "0x71C7656EC7ab88b098defB751B7401B5f6d8976F", 5, 10);

        const assignmentId = await ConfigStorageInstance.getAssignmentCounter(semesterId);

        await ConfigStorageInstance.setAssignmentEndBlock(semesterId, assignmentId, 11);

        const value = await ConfigStorageInstance.getAssignment(semesterId, assignmentId);

        assert.equal(value["endBlock"], 11, "EndBlock is 11");
    });

    /*=====  End of ASSIGNMENT TEST  ======*/
});