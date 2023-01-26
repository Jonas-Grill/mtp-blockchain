// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

// Import the Assignment1Interface.sol
import "./Validator3Interface.sol";

// Import the base assignment validator contract
import "../BaseValidator.sol";

// Import the assignment validator extend contract
import "./Validator3Helper.sol";

// Import Task A and B Conctract
import "./Validator3TaskA.sol";
import "./Validator3TaskB.sol";
import "./Validator3TaskC.sol";
import "./validator3TaskE.sol";

// Give the contract a name and inherit from the base assignment validator
contract Validator3 is BaseValidator {
    // Contract to validate
    Validator3Interface assignmentContract;

    // Task A, B, C and E
    Validator3TaskA validatorTaskA;
    Validator3TaskB validatorTaskB;
    Validator3TaskC validatorTaskC;
    Validator3TaskE validatorTaskE;

    // Contract to Help act as second player
    Validator3Helper validator3Helper;

    // User Addresses
    address player1 = address(0);
    address player2 = address(0);

    // Import empty constructor and pass the name of the contract to the config storage contract
    constructor(address _configContractAddress)
        BaseValidator(
            _configContractAddress,
            "SS23 Assignment 3 Validator Contract - Base",
            0.05 ether
        )
    {
        // Task A, B, C and E
        validatorTaskA = new Validator3TaskA(_configContractAddress);
        validatorTaskB = new Validator3TaskB(_configContractAddress);
        validatorTaskC = new Validator3TaskC(_configContractAddress);
        validatorTaskE = new Validator3TaskE(_configContractAddress);

        // Assign contracts to the list of helper contracts
        addHelperContracts(address(validatorTaskA));
        addHelperContracts(address(validatorTaskB));
        addHelperContracts(address(validatorTaskC));
        addHelperContracts(address(validatorTaskE));

        // Set validator extend address
        validator3Helper = new Validator3Helper();
        addHelperContracts(address(validator3Helper));

        player1 = address(this);
        player2 = address(validator3Helper);
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
        assignmentContract = Validator3Interface(_contractAddress);

        /*----------  EXERCISE A  ----------*/

        // Init Task A Contract
        validatorTaskA.initContract(
            _contractAddress,
            address(validator3Helper)
        );

        // Run tests
        (string memory messageA, bool resultA) = validatorTaskA.testExerciseA{
            value: 0.015 ether
        }();
        if (resultA) {
            // Add the result to the history
            appendTestResult(messageA, resultA, 5);
        } else {
            // Add the result to the history
            appendTestResult(messageA, false, 0);
        }

        /*----------  EXERCISE B  ----------*/

        // Init Task A Contract
        validatorTaskB.initContract(
            _contractAddress,
            address(validator3Helper)
        );

        // Run tests
        (string memory messageB, bool resultB) = validatorTaskB.testExerciseB{
            value: 0.01 ether
        }();

        if (resultB) {
            // Add the result to the history
            appendTestResult(messageB, resultB, 2);
        } else {
            // Add the result to the history
            appendTestResult(messageB, false, 0);
        }

        /*----------  EXERCISE C  ----------*/

        validatorTaskC.initContract(
            _contractAddress,
            address(validator3Helper)
        );

        (string memory messageC, bool resultC) = validatorTaskC.testExerciseC{
            value: 0.01 ether
        }();

        if (resultC) {
            // Add the result to the history
            appendTestResult(messageC, resultC, 3);
        } else {
            // Add the result to the history
            appendTestResult(messageC, false, 0);
        }

        /*----------  EXERCISE E  ----------*/

        validatorTaskE.initContract(
            _contractAddress,
            address(validator3Helper)
        );

        (string memory messageE, bool resultE) = validatorTaskE.testExerciseE{
            value: 0.01 ether
        }();

        if (resultE) {
            // Add the result to the history
            appendTestResult(messageE, resultE, 5);
        } else {
            // Add the result to the history
            appendTestResult(messageE, false, 0);
        }

        // Return the history index
        return testId;
    }
}
