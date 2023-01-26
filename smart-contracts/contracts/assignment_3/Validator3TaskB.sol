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

contract Validator3TaskB is Helper, BaseConfig {
    // assignment contract interface
    Validator3Interface assignmentContract;
    Validator3Helper validator3Helper;

    // Player addresses
    address player1 = address(0);
    address player2 = address(0);

    constructor(address _configContractAddress) {
        initAdmin(
            _configContractAddress,
            "SS23 Assignment 3 Validator Contract - Task B"
        );
    }

    // Function to receive Ether. msg.data must be empty
    receive() external payable {}

    // Fallback function is called when msg.data is not empty
    fallback() external payable {}

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
        // Reset game
        try assignmentContract.forceReset() {} catch Error(
            string memory errMsg
        ) {
            return (
                buildErrorMessage(
                    "Error (Exercise B)",
                    "Error with forceReset() function.",
                    errMsg
                ),
                false
            );
        }

        // Get game counter
        uint256 gameCounter = assignmentContract.getGameCounter();

        // Test getState function
        try assignmentContract.getState() returns (string memory state) {
            // Check if the state is not "waiting"
            if (!compareStrings(state, "waiting"))
                return ("Error (Exercise B): Expected 'waiting' state", false);
        } catch Error(string memory errMsg) {
            return (
                buildErrorMessage(
                    "Error (Exercise B)",
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
                return ("Error (Exercise B): The player id is wrong ", false);
        } catch Error(string memory errMsg) {
            return (
                buildErrorMessage(
                    "Error (Exercise B)",
                    "Error with start() function.",
                    errMsg
                ),
                false
            );
        }

        // Check if that the game counter increase by 1
        if (assignmentContract.getGameCounter() != gameCounter + 1)
            return (
                "Error (Exercise B): The game counter is not increased ",
                false
            );

        // Test getState function = starting
        if (!compareStrings(assignmentContract.getState(), "starting"))
            return (
                buildErrorMessageExtended(
                    "Error (Exercise B)",
                    "The state is not 'starting'",
                    "starting",
                    assignmentContract.getState()
                ),
                false
            );

        // Test join second player
        try
            validator3Helper.callStart{value: 0.001 ether}(assignmentContract)
        returns (uint256 playerId) {
            // Check if the game id is not 0
            if (playerId != 2)
                return ("Error (Exercise B): The player id is wrong", false);
        } catch Error(string memory errMsg) {
            return (
                buildErrorMessage(
                    "Error (Exercise B)",
                    "Error with start() function.",
                    errMsg
                ),
                false
            );
        }

        // Test getState function = playing
        if (!compareStrings(assignmentContract.getState(), "playing"))
            return ("Error (Exercise B): The state is not 'playing'", false);

        return ("Prepare Game: successful.", true);
    }

    /*=============================================
    =                   TASK B                    =
    =============================================*/

    function testExerciseB() public payable returns (string memory, bool) {
        // Test edge cases

        // TEST 1: send 0.0001 ether to the contract --> Expected: fail
        (string memory message1, bool success1) = testNotEnoughFee();
        if (!success1) return (message1, false);

        // TEST 2: test game draw: expected no balance change after second guess
        (string memory message2, bool success2) = testGameDraw();
        if (!success2) return (message2, false);

        // TEST 3: test player 1 win: expected player 1 balance increase
        (string memory message3, bool success3) = testWin();
        if (!success3) return (message3, false);

        return ("Exercise B: All tests passed.", true);
    }

    // Test edge cases: play normal game and expect player 1 to win and get all the fees invested
    function testWin() public payable returns (string memory, bool) {
        // Prepare the game
        (string memory message, bool success) = prepareGame();

        // If the game is not successfully prepared return the error message
        if (!success) return (message, false);

        // Get balance of player1 & player2 before the game
        uint256 player1BalanceBefore = player1.balance;
        uint256 player2BalanceBefore = player2.balance;

        // Test play game -> player 1 wins using paper
        try assignmentContract.play("paper") {} catch Error(
            string memory errMsg
        ) {
            return (
                buildErrorMessage(
                    "Error (Exercise B)",
                    "Error with play() function.",
                    errMsg
                ),
                false
            );
        }

        // Test play game -> player 2 looses using rock
        try
            validator3Helper.callPlay(assignmentContract, "rock")
        {} catch Error(string memory errMsg) {
            return (
                buildErrorMessage(
                    "Error (Exercise B)",
                    "Error with play() function.",
                    errMsg
                ),
                false
            );
        }

        // State should be waiting
        if (!compareStrings(assignmentContract.getState(), "waiting"))
            return (
                buildErrorMessageExtended(
                    "Error (Exercise B)",
                    "The state is not 'waiting'",
                    "waiting",
                    assignmentContract.getState()
                ),
                false
            );

        // This should result in player 1 winning the game because "paper beats rock"

        // Get balance of player1 & player2 after the game
        uint256 player1BalanceAfter = player1.balance;
        uint256 player2BalanceAfter = player2.balance;

        // Check if the player 1 balance is higher than before
        if (player1BalanceAfter <= player1BalanceBefore)
            return (
                buildErrorMessage(
                    "Error (Exercise B)",
                    "The player 1 balance is not higher than before. ",
                    string.concat(
                        Strings.toString(player1BalanceAfter),
                        " should be higher than ",
                        Strings.toString(player1BalanceBefore)
                    )
                ),
                false
            );

        // Check if the player 2 balance is same as before (already paid the fee > so neither win nor loose)
        if (player2BalanceAfter != player2BalanceBefore)
            return (
                "Error (Exercise B): The player 2 balance is not lower than before. Please make sure that the player 2 balance does not change.",
                false
            );

        return ("Exercise B (Win Game): All tests passed.", true);
    }

    // Test edge cases: send 0.0001 ether to the contract --> Expected: fail
    function testNotEnoughFee() public payable returns (string memory, bool) {
        // Reset game
        try assignmentContract.forceReset() {} catch {}

        // Send only 0.0001 ether to the contract --> Expected: fail
        try assignmentContract.start{value: 0.0001 ether}() {
            return (
                "Error (Exercise B): The startGame function did not fail when sending 0.0001 ether to the contract.",
                false
            );
        } catch {}

        return ("Exercise B (Not Enough Fee): All tests passed.", true);
    }

    // Test edge cases: test game draw: expected no balance change after second guess
    function testGameDraw() public payable returns (string memory, bool) {
        // Prepare the game
        (string memory message, bool success) = prepareGame();

        // If the game is not successfully prepared return the error message
        if (!success) return (message, false);

        // Get balance of player1 & player2 before the game
        uint256 player1BalanceBefore = player1.balance;
        uint256 player2BalanceBefore = player2.balance;

        // player play "rock" --> Expected: to win
        try assignmentContract.play("rock") {} catch {
            return (
                "Error (Exercise B - Game Draw): Error with play() function.",
                false
            );
        }

        // player play "rock" --> to loose
        try
            validator3Helper.callPlay(assignmentContract, "rock")
        {} catch Error(string memory errMsg) {
            return (
                buildErrorMessage(
                    "Error (Exercise B - Game Draw)",
                    "Error with play() function for player 2",
                    errMsg
                ),
                false
            );
        }

        // Get balance of player1 & player2 after the game
        uint256 player1BalanceAfter = player1.balance;
        uint256 player2BalanceAfter = player2.balance;

        // Check if the player 1 balance is the same as before
        if (player1BalanceAfter != player1BalanceBefore)
            return (
                "Error (Exercise B - Game Draw): The player 1 balance is not the same as before. Please make sure that the player 1 balance does not change when the game is a draw.",
                false
            );

        // Check if the player 2 balance is same as before
        if (player2BalanceAfter != player2BalanceBefore)
            return (
                "Error (Exercise B - Game Draw): The player 2 balance is not the same as before. Please make sure that the player 2 balance does not change when the game is a draw.",
                false
            );

        return ("Exercise B (Game Draw): All tests passed.", true);
    }
}
