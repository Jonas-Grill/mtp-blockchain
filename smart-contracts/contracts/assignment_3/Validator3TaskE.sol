// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

// Import the Assignment1Interface.sol
import "../assignment_3/Validator3Interface.sol";

// Import Helper
import "../Helper.sol";

// Import the assignment validator extend contract
import "./Validator3Helper.sol";

// import "BaseConfig.sol";
import "../BaseConfig.sol";

contract Validator3TaskE is Helper, BaseConfig {
    // assignment contract interface
    Validator3Interface assignmentContract;
    Validator3Helper validator3Helper;

    // Player addresses
    address player1 = address(0);
    address player2 = address(0);

    constructor(address _configContractAddress) {
        initAdmin(
            _configContractAddress,
            "SS23 Assignment 3 Validator Contract - Task E"
        );
    }

    receive() external payable {}

    // Init contract
    function initContract(
        address _contractAddress,
        address _validator3HelperAddress
    ) public {
        // Call the contract interface which needs to be tested and store it in the variable assignmentContract
        assignmentContract = Validator3Interface(_contractAddress);
        validator3Helper = Validator3Helper(payable(_validator3HelperAddress));

        // Get player addresses
        player1 = address(this);
        player2 = address(_validator3HelperAddress);
    }

    /*=============================================
    =                   HELPER                  =
    =============================================*/

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
        try validator3Helper.callStart{value: 0.001 ether}() returns (
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

    /*=============================================
    =                   TASK E                   =
    =============================================*/

    function testExerciseE() public payable returns (string memory, bool) {
        // Edge Cases tests
        // TEST 1: test private game
        (string memory message1, bool success1) = testPrivateGame();
        if (!success1) return (message1, false);

        // TEST 2: test reveal exceed
        (string memory message2, bool success2) = testRevealTimeExceed();
        if (!success2) return (message2, false);

        return ("Exercise D: All tests passed.", true);
    }

    function testPrivateGame() public payable returns (string memory, bool) {
        // Prepare the game
        (string memory message, bool success) = prepareGame();

        // If the game is not successfully prepared return the error message
        if (!success) return (message, false);

        // Seed used to encode the choice
        string
            memory seedP1 = "1107d64539eb01397685f2c22ffa101ca0ad4ca5413b729508f2264cac7048d3";

        string
            memory seedP2 = "71953ea938bd47d86a3201f0a9c622d096f52dc54ad256919f95772904e22564";

        // Hashed choice for player 1 using SEED_ACTION > "rock" is the used action
        string
            memory hashedChoiceP1 = "2640ff70045801e2f6842c9e1dee152ef80f3ed8647064253e72d2aebb2b59c5";

        // Hashed choice for player 2 using SEED_ACTION > "paper" is the used action
        string
            memory hashedChoiceP2 = "98f5ea8b823eb0a40bd47589b81f8b98687edc6e7c22279088a5d8f58178e040";

        // Send playPrivate with choice "rock" for player 1
        try assignmentContract.playPrivate(hashedChoiceP1) {} catch Error(
            string memory errMsg
        ) {
            return (
                buildErrorMessage(
                    "Error (Exercise E - private game)",
                    "Error with playPrivate() function for player 1.",
                    errMsg
                ),
                false
            );
        }

        // Send playPrivate with choice "paper" for player 2
        try validator3Helper.callPlayPrivate(hashedChoiceP2) {} catch Error(
            string memory errMsg
        ) {
            return (
                buildErrorMessage(
                    "Error (Exercise E - private game)",
                    "Error with playPrivate() function for player 2.",
                    errMsg
                ),
                false
            );
        }

        // check that state is "revealing"
        if (compareStrings(assignmentContract.getState(), "revealing") == false)
            return (
                "Error (Exercise E - private game): The state is not 'revealing'. Please make sure that the state is set to 'revealing' when both players have played.",
                false
            );

        // Get balance of player1 & player2
        uint256 player1BalanceBefore = player1.balance;
        uint256 player2BalanceBefore = player2.balance;

        // Player 1 reveal his choice
        try assignmentContract.reveal("rock", seedP1) {} catch Error(
            string memory errMsg
        ) {
            return (
                buildErrorMessage(
                    "Error (Exercise E - private game)",
                    "Error with reveal() function for player 1.",
                    errMsg
                ),
                false
            );
        }

        // Player 2 reveal his choice
        try validator3Helper.callReveal("paper", seedP2) {} catch Error(
            string memory errMsg
        ) {
            return (
                buildErrorMessage(
                    "Error (Exercise E - private game)",
                    "Error with reveal() function for player 2.",
                    errMsg
                ),
                false
            );
        }

        // Get balance of player1 & player2
        uint256 player1BalanceAfter = player1.balance;
        uint256 player2BalanceAfter = player2.balance;

        // Check if player 1 balance is bigger than before
        if (player1BalanceAfter <= player1BalanceBefore)
            return (
                "Error (Exercise E - private game): The player 1 balance is not bigger than before. Please make sure that the player who won the game gets the reward.",
                false
            );

        // Check if player 2 balance is same as before (no reward)
        if (player2BalanceAfter != player2BalanceBefore)
            return (
                "Error (Exercise E - private game): The player 2 balance did change. But the balance should be the same.",
                false
            );

        return ("Exercise E (private game): All tests passed.", true);
    }

    function testRevealTimeExceed()
        public
        payable
        returns (string memory, bool)
    {
        // Set "fake" block to 100
        assignmentContract.setBlockNumber(100);

        // Set "reveal" max time to 1
        assignmentContract.setMaxTime("reveal", 1);

        // Prepare the game
        (string memory message, bool success) = prepareGame();

        // If the game is not successfully prepared return the error message
        if (!success) return (message, false);

        // Hashed choice for player 1 using SEED_ACTION > "rock" is the used action
        string
            memory hashedChoiceP1 = "2640ff70045801e2f6842c9e1dee152ef80f3ed8647064253e72d2aebb2b59c5";

        // Hashed choice for player 2 using SEED_ACTION > "paper" is the used action
        string
            memory hashedChoiceP2 = "98f5ea8b823eb0a40bd47589b81f8b98687edc6e7c22279088a5d8f58178e040";

        // Send playPrivate with choice "rock" for player 1
        try assignmentContract.playPrivate(hashedChoiceP1) {} catch Error(
            string memory errMsg
        ) {
            return (
                buildErrorMessage(
                    "Error (Exercise E - private game)",
                    "Error with playPrivate() function for player 1.",
                    errMsg
                ),
                false
            );
        }

        // Get balance of player 1
        uint256 player1BalanceBefore = player1.balance;

        // Set "fake" block to 105
        assignmentContract.setBlockNumber(105);

        // Send playPrivate with choice "paper" for player 2
        try validator3Helper.callPlayPrivate(hashedChoiceP2) {} catch Error(
            string memory errMsg
        ) {
            return (
                buildErrorMessage(
                    "Error (Exercise E - private game)",
                    "Error with playPrivate() function for player 2.",
                    errMsg
                ),
                false
            );
        }

        // Get balance of player 1
        uint256 player1BalanceAfter = player1.balance;

        // Check if player 1 balance increased
        if (player1BalanceAfter <= player1BalanceBefore)
            return (
                "Error (Exercise E - private game): The player 1 balance is not bigger than before. Please make sure that the player who won the game gets the reward.",
                false
            );

        return ("Exercise E (private game): All tests passed.", true);
    }
}
