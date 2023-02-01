// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

// Import the IAssignment2.sol
import "./interface/IAssignment2.sol";

// Import the base assignment validator contract
import "../BaseValidator.sol";

// Import the assignment validator extend contract
import "./Validator2Helper.sol";

// Import Task A, B, C and E Conctract
import "./Validator2TaskA.sol";
import "./Validator2TaskB.sol";
import "./Validator2TaskC.sol";
import "./Validator2TaskE.sol";

// Give the contract a name and inherit from the base assignment validator
contract Validator2 is BaseValidator {
    // Contract to validate
    IAssignment2 assignmentContract;

    // Task A, B, C and E
    Validator2TaskA validatorTaskA;
    Validator2TaskB validatorTaskB;
    Validator2TaskC validatorTaskC;
    Validator2TaskE validatorTaskE;

    // Contract to Help act as second player
    Validator2Helper validator2Helper;

    // User Addresses
    address player1 = address(0);
    address player2 = address(0);

    constructor(address _configContractAddress)
        BaseValidator(
            _configContractAddress,
            "SS23 Assignment 2 Validator Contract - Base",
            0.12 ether
        )
    {
        // Task A, B, C and E
        validatorTaskA = new Validator2TaskA(_configContractAddress);
        validatorTaskB = new Validator2TaskB(_configContractAddress);
        validatorTaskC = new Validator2TaskC(_configContractAddress);
        validatorTaskE = new Validator2TaskE(_configContractAddress);

        // Assign contracts to the list of helper contracts
        addHelperContracts(address(validatorTaskA));
        addHelperContracts(address(validatorTaskB));
        addHelperContracts(address(validatorTaskC));
        addHelperContracts(address(validatorTaskE));

        // Set validator extend address
        validator2Helper = new Validator2Helper();
        addHelperContracts(address(validator2Helper));

        player1 = address(this);
        player2 = address(validator2Helper);
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
        assignmentContract = IAssignment2(_contractAddress);

        /*----------  EXERCISE A  ----------*/

        // Init Task A Contract
        validatorTaskA.initContract(
            _contractAddress,
            address(validator2Helper)
        );

        if (
            hasFunction(address(validatorTaskA), "testExerciseA()", 0.015 ether)
        ) {
            // Run tests
            (string memory messageA, bool resultA) = validatorTaskA
                .testExerciseA{value: 0.015 ether}();
            if (resultA) {
                // Add the result to the history
                appendTestResult(messageA, resultA, 5);
            } else {
                // Add the result to the history
                appendTestResult(messageA, false, 0);
            }
        } else {
            // Add the result to the history
            appendTestResult(
                "Exercise A: Some of the required functions are not correctly implemented. Validation not possible!",
                false,
                0
            );
        }
        /*----------  EXERCISE B  ----------*/

        // Init Task A Contract
        validatorTaskB.initContract(
            _contractAddress,
            address(validator2Helper)
        );

        if (
            hasFunction(address(validatorTaskB), "testExerciseB()", 0.01 ether)
        ) {
            // Run tests
            (string memory messageB, bool resultB) = validatorTaskB
                .testExerciseB{value: 0.01 ether}();

            if (resultB) {
                // Add the result to the history
                appendTestResult(messageB, resultB, 2);
            } else {
                // Add the result to the history
                appendTestResult(messageB, false, 0);
            }
        } else {
            // Add the result to the history
            appendTestResult(
                "Exercise B: Some of the required functions are not correctly implemented. Validation not possible!",
                false,
                0
            );
        }

        /*----------  EXERCISE C  ----------*/

        validatorTaskC.initContract(
            _contractAddress,
            address(validator2Helper)
        );

        if (
            hasFunction(address(validatorTaskC), "testExerciseC()", 0.01 ether)
        ) {
            (string memory messageC, bool resultC) = validatorTaskC
                .testExerciseC{value: 0.01 ether}();

            if (resultC) {
                // Add the result to the history
                appendTestResult(messageC, resultC, 2);
            } else {
                // Add the result to the history
                appendTestResult(messageC, false, 0);
            }
        } else {
            // Add the result to the history
            appendTestResult(
                "Exercise C: Some of the required functions are not correctly implemented. Validation not possible!",
                false,
                0
            );
        }

        /*----------  EXERCISE D  ----------*/

        appendTestResult("Exercise D: All tests passed.", true, 1);

        /*----------  EXERCISE E  ----------*/

        validatorTaskE.initContract(
            _contractAddress,
            address(validator2Helper)
        );

        if (
            hasFunction(address(validatorTaskE), "testExerciseE()", 0.01 ether)
        ) {
            (string memory messageE, bool resultE) = validatorTaskE
                .testExerciseE{value: 0.01 ether}();

            if (resultE) {
                // Add the result to the history
                appendTestResult(messageE, resultE, 5);
            } else {
                // Add the result to the history
                appendTestResult(messageE, false, 0);
            }
        } else {
            // Add the result to the history
            appendTestResult(
                "Exercise E: Some of the required functions are not correctly implemented. Validation not possible!",
                false,
                0
            );
        }

        // Return the history index
        return testId;
    }
}
