// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

// Import the IAssignment3.sol
import "./interface/IAssignment3.sol";

// Import the base assignment validator contract
import "../BaseValidator.sol";

// Import Task A, B, C and E Conctract
import "./Validator3TaskA.sol";
import "./Validator3TaskB.sol";
import "./Validator3TaskC.sol";

// Give the contract a name and inherit from the base assignment validator
contract Validator3 is BaseValidator {
    // Contract to validate
    IAssignment3 assignmentContract;

    // Task A, B, C and E
    Validator3TaskA validatorTaskA;
    Validator3TaskB validatorTaskB;
    Validator3TaskC validatorTaskC;

    constructor(address _configContractAddress)
        BaseValidator(
            _configContractAddress,
            "SS23 Assignment 3 Validator Contract - Base",
            6 gwei
        )
    {
        // Task A, B, C and E
        validatorTaskA = new Validator3TaskA(_configContractAddress);
        validatorTaskB = new Validator3TaskB(_configContractAddress);
        validatorTaskC = new Validator3TaskC(_configContractAddress);

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
        assignmentContract = IAssignment3(_contractAddress);

        /*----------  EXERCISE A  ----------*/

        // Init Task A Contract
        validatorTaskA.initContract(_contractAddress);

        if (hasFunction(address(validatorTaskA), "testExerciseA()", 1 gwei)) {
            // Run tests
            try validatorTaskA.testExerciseA{value: 1 gwei}() returns (
                string memory messageA,
                bool resultA
            ) {
                if (resultA) {
                    // Add the result to the history
                    appendTestResult(messageA, resultA, 7);
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
        } else {
            appendTestResult(
                "Exercise A: Some of the required functions are not correctly implemented. Validation not possible!",
                false,
                0
            );
        }

        /*----------  EXERCISE B  ----------*/

        // Init Task A Contract
        validatorTaskB.initContract(_contractAddress);

        if (hasFunction(address(validatorTaskB), "testExerciseB()", 1 gwei)) {
            // Run tests
            try validatorTaskB.testExerciseB{value: 1 gwei}() returns (
                string memory messageB,
                bool resultB
            ) {
                if (resultB) {
                    // Add the result to the history
                    appendTestResult(messageB, resultB, 2);
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
        } else {
            appendTestResult(
                "Exercise B: Some of the required functions are not correctly implemented. Validation not possible!",
                false,
                0
            );
        }

        /*----------  EXERCISE C  ----------*/

        validatorTaskC.initContract(_contractAddress);

        if (hasFunction(address(validatorTaskC), "testExerciseC()", 1 gwei)) {
            try validatorTaskC.testExerciseC{value: 1 gwei}() returns (
                string memory messageC,
                bool resultC
            ) {
                if (resultC) {
                    // Add the result to the history
                    appendTestResult(messageC, resultC, 3);
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
        } else {
            appendTestResult(
                "Exercise C: Some of the required functions are not correctly implemented. Validation not possible!",
                false,
                0
            );
        }

        // Return the history index
        return testId;
    }
}
