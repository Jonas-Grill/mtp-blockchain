const TestAssignmentValidator = artifacts.require("TestAssignmentValidator");
const TestAssignment = artifacts.require("TestAssignment");

contract("TestAssignmentValidator", (accounts) => {
    it("should pass tests", async () => {
        const testAssignmentValidatorInstance = await TestAssignmentValidator.deployed();

        // Get address from the contract we want to test
        let testAssignmentInstance = await TestAssignment.deployed();

        // Run test
        var result = await testAssignmentValidatorInstance.validateTestAssignment(testAssignmentInstance.address);

        //console.log(result)
    });
});
