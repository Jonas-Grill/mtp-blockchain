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

    // Task A and Task B
    Validator3TaskA validatorTaskA;
    Validator3TaskB validatorTaskB;
    Validator3TaskC validatorTaskC;
    Validator3TaskE validatorTaskE;

    // Contract to Help act as second player
    Validator3Helper validatorExtendAddress;

    // User Addresses
    address player1 = address(0);
    address player2 = address(0);

    // Import empty constructor and pass the name of the contract to the config storage contract
    constructor(address _configContractAddress)
        BaseValidator(
            _configContractAddress,
            "SS23 Assignment 3 Validator Contract - Base",
            50000 gwei
        )
    {
        // Task A and Task B
        validatorTaskA = new Validator3TaskA(_configContractAddress);
        validatorTaskB = new Validator3TaskB(_configContractAddress);
        validatorTaskC = new Validator3TaskC(_configContractAddress);
        validatorTaskE = new Validator3TaskE(_configContractAddress);

        // Set validator extend address
        validatorExtendAddress = new Validator3Helper();

        player1 = address(this);
        player2 = address(validatorExtendAddress);
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
        createTestHistory(_contractAddress);

        // Call the contract interface which needs to be tested and store it in the variable assignmentContract
        assignmentContract = Validator3Interface(_contractAddress);

        /*----------  EXERCISE A  ----------*/

        // Init Task A Contract
        validatorTaskA.initContract(
            _contractAddress,
            address(validatorExtendAddress)
        );

        // Run tests
        (string memory messageA, bool resultA) = validatorTaskA.testExerciseA();
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
            address(validatorExtendAddress)
        );

        // Run tests
        (string memory messageB, bool resultB) = validatorTaskB.testExerciseB();

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
            address(validatorExtendAddress)
        );

        (string memory messageC, bool resultC) = validatorTaskC.testExerciseC();

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
            address(validatorExtendAddress)
        );

        (string memory messageE, bool resultE) = validatorTaskE.testExerciseE();

        if (resultE) {
            // Add the result to the history
            appendTestResult(messageE, resultE, 5);
        } else {
            // Add the result to the history
            appendTestResult(messageE, false, 0);
        }

        // Return the history index
        return _testHistoryCounter;
    }

    // This function sets the game in the state that it accepts choices from account 1 or 2
    function prepareGame() public payable returns (string memory, bool) {
        // Get game counter
        uint256 gameCounter = assignmentContract.getGameCounter();

        // Test getState function
        try assignmentContract.getState() returns (string memory state) {
            // Check if the state is not "waiting"
            if (!compareStrings(state, "waiting"))
                return ("Error (Exercise A): Expected 'waiting' state", false);
        } catch Error(string memory errMsg) {
            return (
                buildErrorMessage(
                    "Error (Exercise A)",
                    "Error with getState() function.",
                    errMsg
                ),
                false
            );
        }

        // Test Start
        try assignmentContract.start{value: 0.001 ether}() returns (
            uint256 playerId
        ) {
            // Check if the game id is not 0
            if (playerId != 1)
                return ("Error (Exercise A): The player id is wrong ", false);
        } catch Error(string memory errMsg) {
            return (
                buildErrorMessage(
                    "Error (Exercise A)",
                    "Error with start() function.",
                    errMsg
                ),
                false
            );
        }

        // Check if that the game counter increase by 1
        if (assignmentContract.getGameCounter() != gameCounter + 1)
            return (
                "Error (Exercise A): The game counter is not increased ",
                false
            );

        // Test getState function = starting
        if (!compareStrings(assignmentContract.getState(), "startig"))
            return ("Error (Exercise A): The state is not 'starting'", false);

        // Test join second player
        try validatorExtendAddress.callStart{value: 0.001 ether}() returns (
            uint256 playerId
        ) {
            // Check if the game id is not 0
            if (playerId != 2)
                return ("Error (Exercise A): The player id is wrong", false);
        } catch Error(string memory errMsg) {
            return (
                buildErrorMessage(
                    "Error (Exercise A)",
                    "Error with start() function.",
                    errMsg
                ),
                false
            );
        }

        // Test getState function = playing
        if (!compareStrings(assignmentContract.getState(), "playing"))
            return ("Error (Exercise A): The state is not 'playing'", false);

        return ("Prepare Game: successful.", true);
    }
}
