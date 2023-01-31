// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

// Import the IAssignment1.sol
import "./interface/IAssignment1.sol";

// Import the base assignment validator contract
import "../../contracts/BaseValidator.sol";

import "../../node_modules/@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";

// Import Task A, B, C
import "./Validator1TaskA.sol";
import "./Validator1TaskB.sol";
import "./Validator1TaskC.sol";
import "./Validator1TaskD.sol";
import "./Validator1TaskE.sol";
import "./Validator1TaskF.sol";

// Give the contract a name and inherit from the base assignment validator
contract Validator1 is BaseValidator, ERC721Holder {
    // Contract to validate
    IAssignment1 assignmentContract;

    // Task A, B, C
    Validator1TaskA validatorTaskA;
    Validator1TaskB validatorTaskB;
    Validator1TaskC validatorTaskC;
    Validator1TaskD validatorTaskD;
    Validator1TaskE validatorTaskE;
    Validator1TaskF validatorTaskF;

    // Contract to help as not authorized user
    Validator1Helper validator1Helper;

    // Import empty constructor and pass the name of the contract to the config storage contract
    constructor(address _configContractAddress)
        BaseValidator(
            _configContractAddress,
            "SS23 Assignment 1 Validator Contract - Base",
            0.2 ether
        )
    {
        // Task A, B, C, D, E, F
        validatorTaskA = new Validator1TaskA(_configContractAddress);
        validatorTaskB = new Validator1TaskB(_configContractAddress);
        validatorTaskC = new Validator1TaskC(_configContractAddress);
        validatorTaskD = new Validator1TaskD(_configContractAddress);
        validatorTaskE = new Validator1TaskE(_configContractAddress);
        validatorTaskF = new Validator1TaskF(_configContractAddress);

        // Assign contracts to the list of helper contracts
        addHelperContracts(address(validatorTaskA));
        addHelperContracts(address(validatorTaskB));
        addHelperContracts(address(validatorTaskC));
        addHelperContracts(address(validatorTaskD));
        addHelperContracts(address(validatorTaskE));
        addHelperContracts(address(validatorTaskF));

        // Set validator extend address
        validator1Helper = new Validator1Helper();
        // Intentionally not added to the list of helper contracts --> to test "not authorized" function
    }

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
        assignmentContract = IAssignment1(_contractAddress);

        /*----------  EXERCISE A  ----------*/
        validatorTaskA.initContract(
            _contractAddress,
            address(validator1Helper)
        );

        if (
            hasFunction(address(validatorTaskA), "testExerciseA()", 0.01 ether)
        ) {
            (string memory messageA, bool resultA) = validatorTaskA
                .testExerciseA{value: 0.01 ether}();

            if (resultA) {
                // If the test passed, add the result to the history
                appendTestResult(messageA, true, 2);
            } else {
                // If the test failed, add the result to the history
                appendTestResult(messageA, false, 0);
            }
        } else {
            appendTestResult(
                "Exercise A: Some of the required functions are not correctly implemented. Validation not possible!",
                false,
                0
            );
        }

        /*----------  EXERCISE B  ----------*/
        validatorTaskB.initContract(
            _contractAddress,
            address(validator1Helper)
        );

        if (
            hasFunction(address(validatorTaskB), "testExerciseB()", 0.01 ether)
        ) {
            (string memory messageB, bool resultB) = validatorTaskB
                .testExerciseB{value: 0.01 ether}();

            if (resultB) {
                // If the test passed, add the result to the history
                appendTestResult(messageB, true, 2);
            } else {
                // If the test failed, add the result to the history
                appendTestResult(messageB, false, 0);
            }
        } else {
            appendTestResult(
                "Exercise B: Some of the required functions are not correctly implemented. Validation not possible!",
                false,
                0
            );
        }

        /*----------  EXERCISE C  ----------*/
        validatorTaskC.initContract(
            _contractAddress,
            address(validator1Helper)
        );

        if (
            hasFunction(address(validatorTaskC), "testExerciseC()", 0.01 ether)
        ) {
            (string memory messageC, bool resultC) = validatorTaskC
                .testExerciseC{value: 0.01 ether}();

            if (resultC) {
                // If the test passed, add the result to the history
                appendTestResult(messageC, true, 2);
            } else {
                // If the test failed, add the result to the history
                appendTestResult(messageC, false, 0);
            }
        } else {
            appendTestResult(
                "Exercise C: Some of the required functions are not correctly implemented. Validation not possible!",
                false,
                0
            );
        }

        /*----------  EXERCISE D  ----------*/
        validatorTaskD.initContract(
            _contractAddress,
            address(validator1Helper)
        );

        if (
            hasFunction(address(validatorTaskD), "testExerciseD()", 0.05 ether)
        ) {
            (string memory messageD, bool resultD) = validatorTaskD
                .testExerciseD{value: 0.05 ether}();

            if (resultD) {
                // If the test passed, add the result to the history
                appendTestResult(messageD, true, 1);
            } else {
                // If the test failed, add the result to the history
                appendTestResult(messageD, false, 0);
            }
        } else {
            appendTestResult(
                "Exercise D: Some of the required functions are not correctly implemented. Validation not possible!",
                false,
                0
            );
        }

        /*----------  EXERCISE E  ----------*/
        validatorTaskE.initContract(
            _contractAddress,
            address(validator1Helper)
        );

        if (
            hasFunction(address(validatorTaskE), "testExerciseE()", 0.01 ether)
        ) {
            (string memory messageE, bool resultE) = validatorTaskE
                .testExerciseE{value: 0.01 ether}();

            if (resultE) {
                // If the test passed, add the result to the history
                appendTestResult(messageE, true, 1);
            } else {
                // If the test failed, add the result to the history
                appendTestResult(messageE, false, 0);
            }
        } else {
            appendTestResult(
                "Exercise E: Some of the required functions are not correctly implemented. Validation not possible!",
                false,
                0
            );
        }

        /*----------  EXERCISE F  ----------*/
        validatorTaskF.initContract(
            _contractAddress,
            address(validator1Helper)
        );

        if (hasFunction(address(validatorTaskF), "testExerciseF()", 0 ether)) {
            (string memory messageF, bool resultF) = validatorTaskF
                .testExerciseF();

            if (resultF) {
                // If the test passed, add the result to the history
                appendTestResult(messageF, true, 1);
            } else {
                // If the test failed, add the result to the history
                appendTestResult(messageF, false, 0);
            }
        } else {
            appendTestResult(
                "Exercise F: Some of the required functions are not correctly implemented. Validation not possible!",
                false,
                0
            );
        }
        // Return the history index
        return testId;
    }
}
