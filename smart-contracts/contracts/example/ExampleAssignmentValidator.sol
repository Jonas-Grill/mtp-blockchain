// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

/**
 *  Import a sceleton version of the contract the students need to submit
 *  The imported base assignment needs to own the functions which are
 *  called by the validator
 */
import "./ExampleAssignmentInterface.sol";

// Import the base assignment validator contract
import "../../contracts/BaseValidator.sol";

// Give the contract a name and inherit from the base assignment validator
contract ExampleAssignmentValidator is BaseValidator {
    /**
     * Import empty constructor and pass the config contract address to the
     * base assignment validator constructor
     */
    constructor(address _configContractAddress)
        BaseValidator(
            _configContractAddress,
            "ExampleAssignmentValidator", // Define the name of the contract
            0
        )
    {
        // The constructor is empty
    }

    /**
     * The ´test´ function is inherited from the base assignment validator
     * and needs to be implemented in the child contract.
     *
     * In this function all the necessary tests are executed and the results are returned
     *
     * MARK THE override KEYWORD
     */
    function test(address _contractAddress)
        public
        payable
        override(BaseValidator)
        returns (uint256)
    {
        /**
         *  Create a new history entry in the smart contract
         *
         *  The history entry is used to store the results of the tests.
         *  Always use this index in the further functions.
         */
        createTestHistory(_contractAddress);

        // Call the contract which needs to be tested and store it in the variable assignment_contract
        ExampleAssignmentInterface assignment_contract = ExampleAssignmentInterface(
                _contractAddress
            );

        /*
         *  The following tests are just examples and can be replaced with your own tests
         *
         *  Every test is structured as follows:
         *    ```
         *    appendTestResult(
         *         *         "Is contract from the student",
         *         checkAssignmentOwner(_studentAddress, _contractAddress)
         *    );
         *    ```
         *    - The first parameter is the history index
         *    - The second parameter is the name of the test
         *    - The third parameter is the result of the test
         */

        // "Is contract from the student"
        appendTestResult(
            "Is contract from the student",
            checkAssignmentOwner(_contractAddress),
            1
        );

        // Test 1 - test if default value is 1998 --> will fail intentional
        if (int256(assignment_contract.getTestValue()) == int256(1000)) {
            appendTestResult("test if default value is 1000", true, 1);
        } else {
            appendTestResult("test if default value is 1998", false, 0);
        }

        // Test 2 - test if setTestValue works
        assignment_contract.setTestValue(int256(2022));

        if (int256(assignment_contract.getTestValue()) == int256(2022)) {
            appendTestResult("test if setTestValue works", true, 1);
        } else {
            appendTestResult("test if setTestValue works", false, 0);
        }

        // Return the history index
        return _testHistoryCounter;
    }
}
