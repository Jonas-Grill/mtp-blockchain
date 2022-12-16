// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

/**
 *  Import a sceleton version of the contract the students need to submit
 *  The imported base assignment needs to own the functions which are
 *  called by the validator
 */
import "../contracts/TestAssignmentInterface.sol";

// Import the base assignment validator contract
import "../contracts/BaseAssignmentValidator.sol";

// Give the contract a name and inherit from the base assignment validator
contract TestAssignmentValidator is BaseAssignmentValidator {
    /**
     * Import empty constructor and pass the config contract address to the
     * base assignment validator constructor
     */
    constructor(address _configContractAddress)
        BaseAssignmentValidator(_configContractAddress)
    {
        // The constructor is empty
    }

    /**
     * The validateTestAssignment function is inherited from the base assignment validator
     * and needs to be implemented in the child contract.
     *
     * In this function all the necessary tests are executed and the results are returned
     *
     * MARK THE override KEYWORD
     */
    function validateTestAssignment(
        address _studentAddress,
        address _contractAddress
    ) public override(BaseAssignmentValidator) returns (uint256) {
        /**
         *  Create a new history entry in the smart contract
         *
         *  The history entry is used to store the results of the tests.
         *  Always use this index in the further functions.
         */
        uint256 historyIndex = createTestHistory(
            _studentAddress,
            _contractAddress
        );

        // Call the contract which needs to be tested and store it in the variable assignment_contract
        TestAssignmentInterface assignment_contract = TestAssignmentInterface(
            _contractAddress
        );

        /*
         *  The following tests are just examples and can be replaced with your own tests
         *
         *  Every test is structured as follows:
         *    ```
         *    appendTestResult(
         *         historyIndex,
         *         "Is contract from the student",
         *         checkAssignmentOwner(_studentAddress, _contractAddress)
         *    );
         *    ```
         *    - The first parameter is the history index
         *    - The second parameter is the name of the test
         *    - The third parameter is the result of the test
         */

        // "Is contract from the student"
        appendTestResult(
            historyIndex,
            "Is contract from the student",
            checkAssignmentOwner(_studentAddress, _contractAddress)
        );

        // Test 1 - test if default value is 1998
        if (int256(assignment_contract.getTestValue()) == int256(1998)) {
            appendTestResult(
                historyIndex,
                "test if default value is 1998",
                true
            );
        } else {
            appendTestResult(
                historyIndex,
                "test if default value is 1998",
                false
            );
        }

        // Test 2 - test if setTestValue works
        assignment_contract.setTestValue(int256(2022));

        if (int256(assignment_contract.getTestValue()) == int256(2022)) {
            appendTestResult(historyIndex, "test if setTestValue works", true);
        } else {
            appendTestResult(historyIndex, "test if setTestValue works", false);
        }

        // Return the history index
        return historyIndex;
    }
}
