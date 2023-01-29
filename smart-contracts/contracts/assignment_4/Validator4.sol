// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

// Import the IAssignment3.sol
import "./interface/IAssignment4.sol";

// Import the base assignment validator contract
import "../BaseValidator.sol";

// Import Task A, B, C and E Conctract
import "./Validator4TaskA.sol";
import "./Validator4TaskB.sol";
import "./Validator4TaskC.sol";

// Give the contract a name and inherit from the base assignment validator
contract Validator4 is BaseValidator {
    // Contract to validate
    IAssignment4 assignmentContract;

    // Task A, B, C and E
    Validator4TaskA validatorTaskA;
    Validator4TaskB validatorTaskB;
    Validator4TaskC validatorTaskC;

    constructor(address _configContractAddress)
        BaseValidator(
            _configContractAddress,
            "SS23 Assignment 4 Validator Contract - Base",
            5 gwei
        )
    {
        // Task A, B, C and E
        validatorTaskA = new Validator4TaskA(_configContractAddress);
        validatorTaskB = new Validator4TaskB(_configContractAddress);
        validatorTaskC = new Validator4TaskC(_configContractAddress);

        // Assign contracts to the list of helper contracts
        addHelperContracts(address(validatorTaskA));
        addHelperContracts(address(validatorTaskB));
        addHelperContracts(address(validatorTaskC));
    }

    // Fallback function to make sure the contract can receive ether
    receive() external payable {}

    // Test the assignment
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
        uint256 testId = createTestHistory(_contractAddress);

        // Call the contract interface which needs to be tested and store it in the variable assignmentContract
        assignmentContract = IAssignment4(_contractAddress);

        /*----------  EXERCISE A  ----------*/

        // Init Task A Contract
        validatorTaskA.initContract(_contractAddress);

        // Run tests
        try validatorTaskA.testExerciseA{value: 1 gwei}() returns (
            string memory messageA,
            bool resultA
        ) {
            if (resultA) {
                // Add the result to the history
                appendTestResult(messageA, resultA, 5);
            } else {
                // Add the result to the history
                appendTestResult(messageA, false, 0);
            }
        } catch Error(string memory reason) {
            appendTestResult(
                buildErrorMessage(
                    "Error (Exercise A)",
                    "Error with tests in Exercise A.",
                    reason
                ),
                false,
                0
            );
        }

        /*----------  EXERCISE B  ----------*/

        // Init Task A Contract
        validatorTaskB.initContract(_contractAddress);

        // Run tests
        try validatorTaskB.testExerciseB{value: 1 gwei}() returns (
            string memory messageB,
            bool resultB
        ) {
            if (resultB) {
                // Add the result to the history
                appendTestResult(messageB, resultB, 5);
            } else {
                // Add the result to the history
                appendTestResult(messageB, false, 0);
            }
        } catch Error(string memory reason) {
            appendTestResult(
                buildErrorMessage(
                    "Error (Exercise B)",
                    "Error with tests in Exercise B.",
                    reason
                ),
                false,
                0
            );
        }

        /*----------  EXERCISE C  ----------*/

        validatorTaskC.initContract(_contractAddress);

        try validatorTaskC.testExerciseC{value: 1 gwei}() returns (
            string memory messageC,
            bool resultC
        ) {
            if (resultC) {
                // Add the result to the history
                appendTestResult(messageC, resultC, 5);
            } else {
                // Add the result to the history
                appendTestResult(messageC, false, 0);
            }
        } catch Error(string memory reason) {
            appendTestResult(
                buildErrorMessage(
                    "Error (Exercise C)",
                    "Error with tests in Exercise C.",
                    reason
                ),
                false,
                0
            );
        }

        // Return the history index
        return testId;
    }
}
