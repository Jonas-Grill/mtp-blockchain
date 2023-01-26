// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

// Import the IAssignment3.sol
import "./interface/IAssignment3.sol";

// Import Helper
import "../Helper.sol";

// Import the assignment validator extend contract
import "./Validator3Helper.sol";

// import "BaseConfig.sol";
import "../BaseConfig.sol";

contract Validator3TaskA is Helper, BaseConfig {
    // assignment contract interface
    IAssignment3 assignmentContract;
    Validator3Helper validator3Helper;

    constructor(address _configContractAddress) {
        initAdmin(
            _configContractAddress,
            "SS23 Assignment 3 Validator Contract - Task A"
        );
    }

    receive() external payable {}

    // Init contract
    function initContract(
        address _contractAddress,
        address _validator3HelperAddress
    ) public {
        // Call the contract interface which needs to be tested and store it in the variable assignmentContract
        assignmentContract = IAssignment3(_contractAddress);
        validator3Helper = Validator3Helper(payable(_validator3HelperAddress));
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
                    "Error (Exercise A)",
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
                return (
                    buildErrorMessageExtended(
                        "Error (Exercise A)",
                        "The player id is wrong",
                        "1",
                        Strings.toString(playerId)
                    ),
                    false
                );
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
        if (!compareStrings(assignmentContract.getState(), "starting"))
            return (
                buildErrorMessageExtended(
                    "Error (Exercise A)",
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
            // Check if the player id is 2
            if (playerId != 2)
                return (
                    buildErrorMessageExtended(
                        "Error (Exercise A)",
                        "The player id is wrong",
                        "2",
                        Strings.toString(playerId)
                    ),
                    false
                );
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
    =                  TASK A                   =
    =============================================*/

    function testExerciseA() public payable returns (string memory, bool) {
        // Prepare the game
        (string memory message, bool success) = prepareGame();

        // If the game is not successfully prepared return the error message
        if (!success) return (message, false);

        // GAME IS NOW COMPLETE TEST PLAY FUNCTION

        // player play "rock" --> Expected: to win
        try assignmentContract.play("rock") {} catch {
            return ("Error (Exercise A): Error with play() function.", false);
        }

        // Test getState function = playing
        if (!compareStrings(assignmentContract.getState(), "playing"))
            return ("Error (Exercise A): The state is not 'playing'.", false);

        // player play "scissors" --> to loose
        try
            validator3Helper.callPlay(assignmentContract, "scissors")
        {} catch Error(string memory errMsg) {
            return (
                buildErrorMessage(
                    "Error (Exercise A)",
                    "Error with play() function for player 2",
                    errMsg
                ),
                false
            );
        }

        // Test getState function = waiting
        if (!compareStrings(assignmentContract.getState(), "waiting"))
            return ("Error (Exercise A): The state is not 'waiting'.", false);

        // Test edge cases

        // TEST 1: send "brunnen" as choice for player 1 --> Expected: fail
        (string memory message1, bool success1) = testWrongChoice();
        if (!success1) return (message1, false);

        // TEST 2: send two choices from same address --> Expected: fail
        (string memory message2, bool success2) = testTwoChoices();
        if (!success2) return (message2, false);

        // TEST 3: send start 3 times --> Expected: fail
        (string memory message3, bool success3) = testThirdGame();
        if (!success3) return (message3, false);

        return ("Exercise A: All tests passed.", true);
    }

    // Test edge cases: send "brunnen" as choice for player 1 --> expected: fail
    function testWrongChoice() public payable returns (string memory, bool) {
        // Prepare the game
        (string memory message, bool success) = prepareGame();

        // If the game is not successfully prepared return the error message
        if (!success) return (message, false);

        // TEST 1: send "brunnen" as choice for player 1 --> Expected: fail
        try assignmentContract.play("brunnen") {
            return (
                "Error (Exercise A - Wrong Choice): The play function did not fail when sending 'brunnen' as choice.",
                false
            );
        } catch {}

        return ("Exercise A (Wrong Choice): All tests passed.", true);
    }

    // Test edge cases: send two choices for player 1: expected: fail
    function testTwoChoices() public payable returns (string memory, bool) {
        // Prepare the game
        (string memory message, bool success) = prepareGame();

        // If the game is not successfully prepared return the error message
        if (!success) return (message, false);

        // Send rock --> expected success
        try assignmentContract.play("rock") {} catch {
            return (
                "Error (Exercise A - Two Choices): The play function did not fail when sending 'rock' as choice.",
                false
            );
        }

        // Send scissors --> expected fail (because two submissions for same player)
        try assignmentContract.play("scissors") {
            return (
                "Error (Exercise A - Two Choices): The play function did not fail when sending 'scissors' as choice.",
                false
            );
        } catch {}

        return ("Exercise A (Two Choices): All tests passed.", true);
    }

    // Test edge cases: start a game a third time with player 1 address: expected: fail
    function testThirdGame() public payable returns (string memory, bool) {
        // Prepare the game
        (string memory message, bool success) = prepareGame();

        // If the game is not successfully prepared return the error message
        if (!success) return (message, false);

        // Start the game again
        try assignmentContract.start{value: 0.001 ether}() {
            return (
                "Error (Exercise A - Third game start call): The startGame function did not fail when starting the game a third time, twice as player 1 address.",
                false
            );
        } catch {}

        return ("Exercise A (Third game start call): All tests passed.", true);
    }
}
