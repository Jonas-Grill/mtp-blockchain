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

contract Validator3TaskC is Helper, BaseConfig {
    // assignment contract interface
    IAssignment3 assignmentContract;
    Validator3Helper validator3Helper;

    // Player addresses
    address player1 = address(0);
    address player2 = address(0);

    constructor(address _configContractAddress) {
        initAdmin(
            _configContractAddress,
            "SS23 Assignment 3 Validator Contract - Task C"
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
        assignmentContract = IAssignment3(_contractAddress);
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
                    "Error (Exercise C)",
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
                return ("Error (Exercise C): Expected 'waiting' state", false);
        } catch Error(string memory errMsg) {
            return (
                buildErrorMessage(
                    "Error (Exercise C)",
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
                return ("Error (Exercise C): The player id is wrong ", false);
        } catch Error(string memory errMsg) {
            return (
                buildErrorMessage(
                    "Error (Exercise C)",
                    "Error with start() function.",
                    errMsg
                ),
                false
            );
        }

        // Check if that the game counter increase by 1
        if (assignmentContract.getGameCounter() != gameCounter + 1)
            return (
                "Error (Exercise C): The game counter is not increased ",
                false
            );

        // Test getState function = starting
        if (!compareStrings(assignmentContract.getState(), "starting"))
            return (
                buildErrorMessageExtended(
                    "Error (Exercise C)",
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
                return ("Error (Exercise C): The player id is wrong", false);
        } catch Error(string memory errMsg) {
            return (
                buildErrorMessage(
                    "Error (Exercise C)",
                    "Error with start() function.",
                    errMsg
                ),
                false
            );
        }

        // Test getState function = playing
        if (!compareStrings(assignmentContract.getState(), "playing"))
            return ("Error (Exercise C): The state is not 'playing'", false);

        return ("Prepare Game: successful.", true);
    }

    /*=============================================
    =                   TASK C                    =
    =============================================*/

    function testExerciseC() public payable returns (string memory, bool) {
        // Test edge cases

        // TEST 1: test player 2 join time exceed --> Expected: reset of environment
        (string memory message1, bool success1) = testStartTimeExceed();
        if (!success1) return (message1, false);

        // TEST 2: test player 2 choice time exceed --> Expected: reset of environment
        (string memory message2, bool success2) = testPlayTimeExceed();
        if (!success2) return (message2, false);

        return ("Exercise C: All tests passed.", true);
    }

    // TEST: that player 2 join time exceed --> Expected: reset of environment
    function testStartTimeExceed()
        public
        payable
        returns (string memory, bool)
    {
        // Reset game
        try assignmentContract.forceReset() {} catch Error(
            string memory errMsg
        ) {
            return (
                buildErrorMessage(
                    "Error (Exercise C)",
                    "Error with forceReset() function.",
                    errMsg
                ),
                false
            );
        }

        // Set the max time to 1 block
        assignmentContract.setMaxTime("start", 1);

        // Set the "fake" block number to 1000
        assignmentContract.setBlockNumber(1000);

        // make sure that block number is 1000
        if (assignmentContract.getBlockNumber() != 1000)
            return (
                "Error (Exercise C - start time exceed): The block number is not 1000. Did you overwrite the inherited function?",
                false
            );

        // Get current game counter
        uint256 gameCounterBefore = assignmentContract.getGameCounter();

        // Test Start
        try assignmentContract.start{value: 0.001 ether}() returns (
            uint256 playerId
        ) {
            // Check if the game id is not 0
            if (playerId != 1)
                return (
                    "Error (Exercise C - start time exceed): The player id is wrong (expected 1 -> for join of player 1). Please make sure that the start function returns the correct player id.",
                    false
                );
        } catch Error(string memory errMsg) {
            return (
                buildErrorMessage(
                    "Error (Exercise C - start time exceed)",
                    "Error with start() function.",
                    errMsg
                ),
                false
            );
        }

        // Try to change the max time after game is already started
        try assignmentContract.setMaxTime("start", 1) {
            return (
                "Error (Exercise C - start time exceed): The setMaxTime function did not fail when trying to change the max time after the game is already started.",
                false
            );
        } catch {}

        // Set the "fake" block number to 1005 (5 blocks after the start) --> Enforce the time exceed
        // --> Expected: reset of the environment

        assignmentContract.setBlockNumber(1005);

        // Test join second player --> exepect that the game is reset and returns gameid = 1 for being the player 1
        try
            validator3Helper.callStart{value: 0.001 ether}(assignmentContract)
        returns (uint256 playerId) {
            // Check if the game id is not 0
            if (playerId != 1)
                return (
                    "Error (Exercise C - start time exceed): The player id is wrong. After time exceed of game in 'starting' phase expect that the game is reset and the player who wants to join is player 1.",
                    false
                );
        } catch Error(string memory errMsg) {
            return (
                buildErrorMessage(
                    "Error (Exercise C - start time exceed)",
                    "Error with start() function.",
                    errMsg
                ),
                false
            );
        }

        // Get current game counter
        uint256 gameCounterAfter = assignmentContract.getGameCounter();

        // Game conter should be 2 larger than before
        if (gameCounterAfter != gameCounterBefore + 2)
            return (
                "Error (Exercise C - start time exceed): The game counter is not larger than before. Please make sure that the game counter is increased by 1 when a new game is started.",
                false
            );

        // Set the max time back to default -> 10 blocks
        assignmentContract.forceReset();
        assignmentContract.setMaxTime("start", 10); // TODO change default value

        return ("Exercise C (start time exceed): All tests passed.", true);
    }

    // TEST: that player 2 choice time exceed --> Expected: reset of environment
    function testPlayTimeExceed() public payable returns (string memory, bool) {
        // Reset game
        try assignmentContract.forceReset() {} catch Error(
            string memory errMsg
        ) {
            return (
                buildErrorMessage(
                    "Error (Exercise C)",
                    "Error with forceReset() function.",
                    errMsg
                ),
                false
            );
        }

        // Set the max time to 1 block
        assignmentContract.setMaxTime("play", 1);

        // Set the "fake" block number to 1000
        assignmentContract.setBlockNumber(1000);

        // Prepare the game
        (string memory message, bool success) = prepareGame();

        // If the game is not successfully prepared return the error message
        if (!success) return (message, false);

        // Get player 1 balance
        uint256 player1BalanceBefore = player1.balance;

        // GAME IS NOW COMPLETE TEST PLAY FUNCTION

        // Play the game with player 1
        try assignmentContract.play("rock") {} catch Error(
            string memory errMsg
        ) {
            return (
                buildErrorMessage(
                    "Error (Exercise C - play time exceed)",
                    "Error with play() function for player 1.",
                    errMsg
                ),
                false
            );
        }

        // Change "fake" block number to 1005 (5 blocks after the start) --> Enforce the time exceed
        // --> Expected: reset of the environment
        assignmentContract.setBlockNumber(1005);

        // Play the game with player 2 -> expect that the game is reset and fails
        // -> because game is not started, therefore cannot use "play" function

        try validator3Helper.callPlay(assignmentContract, "paper") {
            return (
                "Error (Exercise C - play time exceed): The play function did not fail when trying to play the game after the time exceed. Expected that error is thrown, because game should not be started!",
                false
            );
        } catch {}

        // check that player 1 balance is <= then before (because of the refund + gas fee)
        if (player1.balance > player1BalanceBefore)
            return (
                "Error (Exercise C - play time exceed): The player 1 balance is not smaller than before. Please make sure that the player who paid the fee gets a refund when the game is reset because of time exceed.",
                false
            );

        // Reset the max time to default
        assignmentContract.forceReset();
        assignmentContract.setMaxTime("play", 10); // TODO change default value

        return ("Exercise C (play time exceed): All tests passed.", true);
    }
}
