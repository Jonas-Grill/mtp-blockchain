const ConfigStorage = artifacts.require("ConfigStorage");
const ExampleAssignment = artifacts.require("ExampleAssignment");
const ExampleAssignmentValidator = artifacts.require("ExampleAssignmentValidator");
const ExampleAssignmentValidator2 = artifacts.require("ExampleAssignmentValidator2");

const cleanUp = async (ConfigStorageInstance, ExampleAssignmentValidatorInstance, semesterId) => {
    // Get all assignments
    const assignmentIds = await ConfigStorageInstance.getAssignmentIds(semesterId);

    // Loop through all assignments
    for (let i = 0; i < assignmentIds.length; i++) {
        const assignmentId = assignmentIds[i];

        // Delete assignment
        await ConfigStorageInstance.deleteAssignment(semesterId, assignmentId);
    }

    await ConfigStorageInstance.deleteSemester(semesterId);
}

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

        await ConfigStorageInstance.appendSemester("SS 2023", 1, 10000, 5);

        const semesterId = await ConfigStorageInstance.getSemesterCounter();

        const value = await ConfigStorageInstance.getSemester(semesterId);

        assert.equal(value["name"], "SS 2023", "Semester is SS 2023");
        assert.equal(value["startBlock"], 1, "StartBlock is 1");
        assert.equal(value["endBlock"], 10000, "EndBlock is 10000");
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

        await ConfigStorageInstance.appendSemester("SS 2023", 1, 10000, 5);

        const semesterId = await ConfigStorageInstance.getSemesterCounter();

        await ConfigStorageInstance.setSemesterMinKnowledgeCoinAmount(semesterId, 10);

        const value = await ConfigStorageInstance.getSemester(semesterId);

        assert.equal(value["minKnowledgeCoinAmount"], 10, "MinKnowledgeCoinAmount is 10");
    });

    it("should set semester start block", async () => {
        const ConfigStorageInstance = await ConfigStorage.deployed();

        await ConfigStorageInstance.appendSemester("SS 2023", 1, 10000, 5);

        const semesterId = await ConfigStorageInstance.getSemesterCounter();

        await ConfigStorageInstance.setSemesterStartBlock(semesterId, 2);

        const value = await ConfigStorageInstance.getSemester(semesterId);

        assert.equal(value["startBlock"], 2, "StartBlock is 2");
    });

    it("should set semester end block", async () => {
        const ConfigStorageInstance = await ConfigStorage.deployed();

        await ConfigStorageInstance.appendSemester("SS 2023", 1, 10000, 5);

        const semesterId = await ConfigStorageInstance.getSemesterCounter();

        await ConfigStorageInstance.setSemesterEndBlock(semesterId, 11);

        const value = await ConfigStorageInstance.getSemester(semesterId);

        assert.equal(value["endBlock"], 11, "EndBlock is 11");
    });

    it("should set semester name", async () => {
        const ConfigStorageInstance = await ConfigStorage.deployed();

        await ConfigStorageInstance.appendSemester("SS 2023", 1, 10000, 5);

        const semesterId = await ConfigStorageInstance.getSemesterCounter();

        await ConfigStorageInstance.setSemesterName(semesterId, "SS 2024");

        const value = await ConfigStorageInstance.getSemester(semesterId);

        assert.equal(value["name"], "SS 2024", "Semester is SS 2024");
    });

    it("should fail to add semester, because end block larger than start block", async () => {
        const ConfigStorageInstance = await ConfigStorage.deployed();

        try {
            await ConfigStorageInstance.appendSemester("SS 2023", 10000, 1, 5);
            assert.fail("Should have thrown an error");
        } catch (error) {
            assert.include(error.message, "Start block must be smaller than end block");
        }
    });
    it("should fail to add semester, because min knowledge coin amount is 0", async () => {
        const ConfigStorageInstance = await ConfigStorage.deployed();

        try {
            await ConfigStorageInstance.appendSemester("SS 2023", 10000, 11000, 0);
            assert.fail("Should have thrown an error");
        } catch (error) {
            assert.include(error.message, "Min knowledge coin amount must be larger than 0");
        }
    });

    /*=====  End of SEMESTER  ======*/


    /*=============================================
    =            ASSIGNMENT TEST            =
    =============================================*/

    it("should add assignment", async () => {
        const ConfigStorageInstance = await ConfigStorage.deployed();
        const ExampleAssignmentValidatorInstance = await ExampleAssignmentValidator.deployed(ConfigStorageInstance.address);

        // Add semester
        await ConfigStorageInstance.appendSemester("SS 2023", 1, 10000, 5);
        const semesterId = await ConfigStorageInstance.getSemesterCounter();

        // Add assignment
        await ConfigStorageInstance.appendAssignment(semesterId, "Assignment 1", "test-link", ExampleAssignmentValidatorInstance.address, 100, 9000);
        const assignmentId = await ConfigStorageInstance.getAssignmentCounter(semesterId);

        // Get assignment
        const value = await ConfigStorageInstance.getAssignment(semesterId, assignmentId);

        assert.equal(value["name"], "Assignment 1", "Assignment is Assignment 1");
        assert.equal(value["link"], "test-link", "Link is test-link");
        assert.equal(value["validationContractAddress"], ExampleAssignmentValidatorInstance.address, "Validator contract address is correct");
        assert.equal(value["startBlock"], 100, "StartBlock is 100");
        assert.equal(value["endBlock"], 9000, "EndBlock is 9000");

        // Get assignment validator
        assert.equal(await ExampleAssignmentValidatorInstance.isAssignmentLinked(), true, "Assignment is linked");

        // Clean up
        await cleanUp(ConfigStorageInstance, ExampleAssignmentValidatorInstance, semesterId);
    });

    it("should fail because assignment is not in semester range", async () => {
        const ConfigStorageInstance = await ConfigStorage.deployed();
        const ExampleAssignmentValidatorInstance = await ExampleAssignmentValidator.deployed(ConfigStorageInstance.address);

        // Add semester
        await ConfigStorageInstance.appendSemester("SS 2023", 1, 10000, 5);
        const semesterId = await ConfigStorageInstance.getSemesterCounter();

        try {
            // Add assignment > define assignment out of semester range
            await ConfigStorageInstance.appendAssignment(semesterId, "Assignment 1", "test-link", ExampleAssignmentValidatorInstance.address, 10001, 10002);
            assert.fail("Assignment should not be added");
        }
        catch (error) {
            assert.include(error.message, "Defined Assignment range is not in semester range");
        }

        // Clean up
        await cleanUp(ConfigStorageInstance, ExampleAssignmentValidatorInstance, semesterId);
    });
    it("should fail because assignment has a lower start block", async () => {
        const ConfigStorageInstance = await ConfigStorage.deployed();
        const ExampleAssignmentValidatorInstance = await ExampleAssignmentValidator.deployed(ConfigStorageInstance.address);

        // Add semester
        await ConfigStorageInstance.appendSemester("SS 2023", 1, 10000, 5);
        const semesterId = await ConfigStorageInstance.getSemesterCounter();

        await ConfigStorageInstance.appendAssignment(semesterId, "Assignment 1", "test-link", ExampleAssignmentValidatorInstance.address, 500, 6000);

        try {
            // Add assignment > define assignment out of semester range
            await ConfigStorageInstance.setSemesterStartBlock(semesterId, 1000);
            assert.fail("Assignment should not be added");
        }
        catch (error) {
            assert.include(error.message, "Start block must be smaller than the smallest assignment start block");
        }

        // Clean up
        await cleanUp(ConfigStorageInstance, ExampleAssignmentValidatorInstance, semesterId);
    });
    it("should fail because assignment has a larger end block", async () => {
        const ConfigStorageInstance = await ConfigStorage.deployed();
        const ExampleAssignmentValidatorInstance = await ExampleAssignmentValidator.deployed(ConfigStorageInstance.address);

        // Add semester
        await ConfigStorageInstance.appendSemester("SS 2023", 1, 10000, 5);
        const semesterId = await ConfigStorageInstance.getSemesterCounter();

        await ConfigStorageInstance.appendAssignment(semesterId, "Assignment 1", "test-link", ExampleAssignmentValidatorInstance.address, 500, 6000);

        try {
            // Add assignment > define assignment out of semester range
            await ConfigStorageInstance.setSemesterEndBlock(semesterId, 5000);
            assert.fail("Assignment should not be added");
        }
        catch (error) {
            assert.include(error.message, "Start block must be smaller than the largest assignment endblock block");
        }

        // Clean up
        await cleanUp(ConfigStorageInstance, ExampleAssignmentValidatorInstance, semesterId);
    });
    it("should fail because assignment start block is larger than end block", async () => {
        const ConfigStorageInstance = await ConfigStorage.deployed();
        const ExampleAssignmentValidatorInstance = await ExampleAssignmentValidator.deployed(ConfigStorageInstance.address);

        // Add semester
        await ConfigStorageInstance.appendSemester("SS 2023", 1, 10000, 5);
        const semesterId = await ConfigStorageInstance.getSemesterCounter();

        try {
            // Add assignment > define assignment start block larger than end block
            await ConfigStorageInstance.appendAssignment(semesterId, "Assignment 1", "test-link", ExampleAssignmentValidatorInstance.address, 5000, 4000);
            assert.fail("Assignment should not be added");
        }
        catch (error) {
            assert.include(error.message, "Start block must be smaller than end block");
        }

        // Clean up
        await cleanUp(ConfigStorageInstance, ExampleAssignmentValidatorInstance, semesterId);
    });
    it("should fail changing of start block because not in range", async () => {
        const ConfigStorageInstance = await ConfigStorage.deployed();
        const ExampleAssignmentValidatorInstance = await ExampleAssignmentValidator.deployed(ConfigStorageInstance.address);

        // Add semester
        await ConfigStorageInstance.appendSemester("SS 2023", 1000, 10000, 5);
        const semesterId = await ConfigStorageInstance.getSemesterCounter();

        await ConfigStorageInstance.appendAssignment(semesterId, "Assignment 1", "test-link", ExampleAssignmentValidatorInstance.address, 4000, 5000);
        const assignmentId = await ConfigStorageInstance.getAssignmentCounter(semesterId);

        try {
            await ConfigStorageInstance.setAssignmentStartBlock(semesterId, assignmentId, 500);
            assert.fail("Assignment should not be added");
        }
        catch (error) {
            assert.include(error.message, "Start block needs to be in range of the semester");
        }

        // Clean up
        await cleanUp(ConfigStorageInstance, ExampleAssignmentValidatorInstance, semesterId);
    });
    it("should fail changing of start block because larger than end block", async () => {
        const ConfigStorageInstance = await ConfigStorage.deployed();
        const ExampleAssignmentValidatorInstance = await ExampleAssignmentValidator.deployed(ConfigStorageInstance.address);

        // Add semester
        await ConfigStorageInstance.appendSemester("SS 2023", 1000, 10000, 5);
        const semesterId = await ConfigStorageInstance.getSemesterCounter();

        await ConfigStorageInstance.appendAssignment(semesterId, "Assignment 1", "test-link", ExampleAssignmentValidatorInstance.address, 4000, 5000);
        const assignmentId = await ConfigStorageInstance.getAssignmentCounter(semesterId);

        try {
            await ConfigStorageInstance.setAssignmentStartBlock(semesterId, assignmentId, 6000);
            assert.fail("Assignment should not be added");
        }
        catch (error) {
            assert.include(error.message, "Start block needs to be smaller than end block");
        }

        // Clean up
        await cleanUp(ConfigStorageInstance, ExampleAssignmentValidatorInstance, semesterId);
    });
    it("should fail changing of end block because smaller than end block", async () => {
        const ConfigStorageInstance = await ConfigStorage.deployed();
        const ExampleAssignmentValidatorInstance = await ExampleAssignmentValidator.deployed(ConfigStorageInstance.address);

        // Add semester
        await ConfigStorageInstance.appendSemester("SS 2023", 1000, 10000, 5);
        const semesterId = await ConfigStorageInstance.getSemesterCounter();

        await ConfigStorageInstance.appendAssignment(semesterId, "Assignment 1", "test-link", ExampleAssignmentValidatorInstance.address, 4000, 5000);
        const assignmentId = await ConfigStorageInstance.getAssignmentCounter(semesterId);

        try {
            await ConfigStorageInstance.setAssignmentEndBlock(semesterId, assignmentId, 3000);
            assert.fail("Assignment should not be added");
        }
        catch (error) {
            assert.include(error.message, "End block needs to be bigger than start block");
        }

        // Clean up
        await cleanUp(ConfigStorageInstance, ExampleAssignmentValidatorInstance, semesterId);
    });
    it("should fail changing of end block because not in semester range", async () => {
        const ConfigStorageInstance = await ConfigStorage.deployed();
        const ExampleAssignmentValidatorInstance = await ExampleAssignmentValidator.deployed(ConfigStorageInstance.address);

        // Add semester
        await ConfigStorageInstance.appendSemester("SS 2023", 1000, 10000, 5);
        const semesterId = await ConfigStorageInstance.getSemesterCounter();

        await ConfigStorageInstance.appendAssignment(semesterId, "Assignment 1", "test-link", ExampleAssignmentValidatorInstance.address, 6000, 7000);
        const assignmentId = await ConfigStorageInstance.getAssignmentCounter(semesterId);

        try {
            await ConfigStorageInstance.setAssignmentEndBlock(semesterId, assignmentId, 11000);
            assert.fail("Assignment should not be added");
        }
        catch (error) {
            assert.include(error.message, "End block needs to be in range of the semester");
        }

        // Clean up
        await cleanUp(ConfigStorageInstance, ExampleAssignmentValidatorInstance, semesterId);
    });
    it("should delete assignment", async () => {
        const ConfigStorageInstance = await ConfigStorage.deployed();
        const ExampleAssignmentValidatorInstance = await ExampleAssignmentValidator.deployed(ConfigStorageInstance.address);

        // Add semester
        await ConfigStorageInstance.appendSemester("SS 2023", 1, 10000, 5);
        const semesterId = await ConfigStorageInstance.getSemesterCounter();

        // Add assignment
        await ConfigStorageInstance.appendAssignment(semesterId, "Assignment 1", "test-link", ExampleAssignmentValidatorInstance.address, 100, 9000);
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

        // Clean up
        await cleanUp(ConfigStorageInstance, ExampleAssignmentValidatorInstance, semesterId);
    });

    it("should set assignment name", async () => {
        const ConfigStorageInstance = await ConfigStorage.deployed();
        const ExampleAssignmentValidatorInstance = await ExampleAssignmentValidator.deployed(ConfigStorageInstance.address);

        // Add semester
        await ConfigStorageInstance.appendSemester("SS 2023", 1, 10000, 5);
        const semesterId = await ConfigStorageInstance.getSemesterCounter();

        // Add assignment
        await ConfigStorageInstance.appendAssignment(semesterId, "Assignment 1", "test-link", ExampleAssignmentValidatorInstance.address, 100, 9000);
        const assignmentId = await ConfigStorageInstance.getAssignmentCounter(semesterId);

        // Get assignment validator
        assert.equal(await ExampleAssignmentValidatorInstance.isAssignmentLinked(), true, "Assignment is linked");

        await ConfigStorageInstance.setAssignmentName(semesterId, assignmentId, "Assignment 2");

        const value = await ConfigStorageInstance.getAssignment(semesterId, assignmentId);

        assert.equal(value["name"], "Assignment 2", "Assignment is Assignment 2");

        // Clean up
        await cleanUp(ConfigStorageInstance, ExampleAssignmentValidatorInstance, semesterId);
    });

    it("should set assignment link", async () => {
        const ConfigStorageInstance = await ConfigStorage.deployed();
        const ExampleAssignmentValidatorInstance = await ExampleAssignmentValidator.deployed(ConfigStorageInstance.address);

        // Add semester
        await ConfigStorageInstance.appendSemester("SS 2023", 1, 10000, 5);
        const semesterId = await ConfigStorageInstance.getSemesterCounter();

        // Add assignment
        await ConfigStorageInstance.appendAssignment(semesterId, "Assignment 1", "test-link", ExampleAssignmentValidatorInstance.address, 100, 9000);
        const assignmentId = await ConfigStorageInstance.getAssignmentCounter(semesterId);

        // Get assignment validator
        assert.equal(await ExampleAssignmentValidatorInstance.isAssignmentLinked(), true, "Assignment is linked");

        await ConfigStorageInstance.setAssignmentLink(semesterId, assignmentId, "test-link-2");

        const value = await ConfigStorageInstance.getAssignment(semesterId, assignmentId);

        assert.equal(value["link"], "test-link-2", "Link is test-link-2");

        // Clean up
        await cleanUp(ConfigStorageInstance, ExampleAssignmentValidatorInstance, semesterId);
    });

    it("should set assignment valid address", async () => {
        const ConfigStorageInstance = await ConfigStorage.deployed();
        const ExampleAssignmentValidatorInstance = await ExampleAssignmentValidator.deployed(ConfigStorageInstance.address);
        const ExampleAssignmentValidator2Instance = await ExampleAssignmentValidator2.deployed(ConfigStorageInstance.address);

        // Add semester
        await ConfigStorageInstance.appendSemester("SS 2023", 1, 10000, 5);
        const semesterId = await ConfigStorageInstance.getSemesterCounter();

        // Add assignment
        await ConfigStorageInstance.appendAssignment(semesterId, "Assignment 1", "test-link", ExampleAssignmentValidatorInstance.address, 100, 9000);
        const assignmentId = await ConfigStorageInstance.getAssignmentCounter(semesterId);

        // Get assignment validator
        assert.equal(await ExampleAssignmentValidatorInstance.isAssignmentLinked(), true, "Assignment is linked");

        await ConfigStorageInstance.setAssignmentAddress(semesterId, assignmentId, ExampleAssignmentValidator2Instance.address);

        const value = await ConfigStorageInstance.getAssignment(semesterId, assignmentId);

        assert.equal(value["validationContractAddress"], ExampleAssignmentValidator2Instance.address, "ValidAddress is 0x10f76bccd5f7d335111a898e6f6121e3391773ce5117d3446f7490ab01235b5b");

        // Clean up
        await cleanUp(ConfigStorageInstance, ExampleAssignmentValidatorInstance, semesterId);
    });

    it("should set assignment start block", async () => {
        const ConfigStorageInstance = await ConfigStorage.deployed();
        const ExampleAssignmentValidatorInstance = await ExampleAssignmentValidator.deployed(ConfigStorageInstance.address);

        // Add semester
        await ConfigStorageInstance.appendSemester("SS 2023", 1, 10000, 5);
        const semesterId = await ConfigStorageInstance.getSemesterCounter();

        // Add assignment
        await ConfigStorageInstance.appendAssignment(semesterId, "Assignment 1", "test-link", ExampleAssignmentValidatorInstance.address, 100, 9000);
        const assignmentId = await ConfigStorageInstance.getAssignmentCounter(semesterId);

        // Get assignment validator
        assert.equal(await ExampleAssignmentValidatorInstance.isAssignmentLinked(), true, "Assignment is linked");

        await ConfigStorageInstance.setAssignmentStartBlock(semesterId, assignmentId, 2);

        const value = await ConfigStorageInstance.getAssignment(semesterId, assignmentId);

        assert.equal(value["startBlock"], 2, "StartBlock is 2");

        // Clean up
        await cleanUp(ConfigStorageInstance, ExampleAssignmentValidatorInstance, semesterId);
    });

    it("should set assignment end block", async () => {
        const ConfigStorageInstance = await ConfigStorage.deployed();
        const ExampleAssignmentValidatorInstance = await ExampleAssignmentValidator.deployed(ConfigStorageInstance.address);

        // Add semester
        await ConfigStorageInstance.appendSemester("SS 2023", 1, 10000, 5);
        const semesterId = await ConfigStorageInstance.getSemesterCounter();

        // Add assignment
        await ConfigStorageInstance.appendAssignment(semesterId, "Assignment 1", "test-link", ExampleAssignmentValidatorInstance.address, 100, 9000);
        const assignmentId = await ConfigStorageInstance.getAssignmentCounter(semesterId);

        // Get assignment validator
        assert.equal(await ExampleAssignmentValidatorInstance.isAssignmentLinked(), true, "Assignment is linked");

        await ConfigStorageInstance.setAssignmentEndBlock(semesterId, assignmentId, 111);

        const value = await ConfigStorageInstance.getAssignment(semesterId, assignmentId);

        assert.equal(value["endBlock"], 111, "EndBlock is 111");

        // Clean up
        await cleanUp(ConfigStorageInstance, ExampleAssignmentValidatorInstance, semesterId);
    });

    /*=====  End of ASSIGNMENT TEST  ======*/
});