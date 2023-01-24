// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

// Import the Assignment1Interface.sol
import "../assignment_3/Assignment3Interface.sol";

// Import the base assignment validator contract
import "../../contracts/BaseAssignmentValidator.sol";

// Import the assignment validator extend contract
import "./Assignment3ValidatorExtend.sol";

// Give the contract a name and inherit from the base assignment validator
contract Assignment3Validator is BaseAssignmentValidator {
    Assignment3Interface assignmentContract;
    Assignment3ValidatorExtend validatorExtendAddress;

    address player1 = address(0);
    address player2 = address(0);

    // Import empty constructor and pass the name of the contract to the config storage contract
    constructor(address _configContractAddress, address _validatorExtendAddress)
        BaseAssignmentValidator(
            _configContractAddress,
            "SS23 Assignment 3 Validator Contract",
            50000 gwei
        )
    {
        // Set validator extend address
        validatorExtendAddress = Assignment3ValidatorExtend(
            payable(_validatorExtendAddress)
        );

        player1 = address(this);
        player2 = address(validatorExtendAddress);
    }

    // Fallback function to make sure the contract can receive ether
    receive() external payable {}

    // Test the assignment
    function test(address _contractAddress)
        public
        payable
        override(BaseAssignmentValidator)
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
        assignmentContract = Assignment3Interface(_contractAddress);

        /*----------  EXERCISE A  ----------*/
        (string memory messageA, bool resultA) = testExerciseA();
        if (resultA) {
            // Add the result to the history
            appendTestResult(messageA, resultA, 5);
        } else {
            // Add the result to the history
            appendTestResult(messageA, false, 0);
        }

        /*----------  EXERCISE B  ----------*/
        (string memory messageB, bool resultB) = testExerciseB();

        if (resultB) {
            // Add the result to the history
            appendTestResult(messageB, resultB, 2);
        } else {
            // Add the result to the history
            appendTestResult(messageB, false, 0);
        }

        /*----------  EXERCISE C  ----------*/
        (string memory messageC, bool resultC) = testExerciseC();

        if (resultC) {
            // Add the result to the history
            appendTestResult(messageC, resultC, 3);
        } else {
            // Add the result to the history
            appendTestResult(messageC, false, 0);
        }

        /*----------  EXERCISE E  ----------*/
        (string memory messageE, bool resultE) = testExerciseE();

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
        try validatorExtendAddress.callPlay("scissors") {} catch Error(
            string memory errMsg
        ) {
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

        // Get balance of player1 & player2 after the game
        uint256 player1BalanceAfter = player1.balance;
        uint256 player2BalanceAfter = player2.balance;

        // Check if the player 1 balance is higher than before
        if (player1BalanceAfter <= player1BalanceBefore)
            return (
                "Error (Exercise A): The player 1 balance is not higher than before. Please make sure that the player 1 wins all the fees.",
                false
            );

        // Check if the player 2 balance is same as before (already paid the fee > so neither win nor loose)
        if (player2BalanceAfter != player2BalanceBefore)
            return (
                "Error (Exercise A): The player 2 balance is not lower than before. Please make sure that the player 2 balance does not change.",
                false
            );
    }

    // Test edge cases: send 0.0001 ether to the contract --> Expected: fail
    function testNotEnoughFee() public payable returns (string memory, bool) {
        // Send only 0.0001 ether to the contract --> Expected: fail
        try assignmentContract.start{value: 0.0001 ether}() {
            return (
                "Error (Exercise B): The startGame function did not fail when sending 0.0001 ether to the contract.",
                false
            );
        } catch {}
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
                "Error (Exercise A - Game Draw): Error with play() function.",
                false
            );
        }

        // player play "rock" --> to loose
        try validatorExtendAddress.callPlay("rock") {} catch Error(
            string memory errMsg
        ) {
            return (
                buildErrorMessage(
                    "Error (Exercise A - Game Draw)",
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
                "Error (Exercise A - Game Draw): The player 1 balance is not the same as before. Please make sure that the player 1 balance does not change when the game is a draw.",
                false
            );

        // Check if the player 2 balance is same as before
        if (player2BalanceAfter != player2BalanceBefore)
            return (
                "Error (Exercise A - Game Draw): The player 2 balance is not the same as before. Please make sure that the player 2 balance does not change when the game is a draw.",
                false
            );

        return ("Exercise A (Game Draw): All tests passed.", true);
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
        // Set the max time to 1 block
        assignmentContract.setMaxTime("start", 1);

        // Set the "fake" block number to 1000
        assignmentContract.setBlockNumber(1000);

        // Get current game counter
        uint256 gameCounterBefore = assignmentContract.getGameCounter();

        // Test Start
        try assignmentContract.start{value: 0.001 ether}() returns (
            uint256 playerId
        ) {
            // Check if the game id is not 0
            if (playerId != 1)
                return (
                    "Error (Exercise A - start time exceed): The player id is wrong (expected 1 -> for join of player 1). Please make sure that the start function returns the correct player id.",
                    false
                );
        } catch Error(string memory errMsg) {
            return (
                buildErrorMessage(
                    "Error (Exercise A - start time exceed)",
                    "Error with start() function.",
                    errMsg
                ),
                false
            );
        }

        // Try to change the max time after game is already started
        try assignmentContract.setMaxTime("start", 100) {
            return (
                "Error (Exercise A - start time exceed): The setMaxTime function did not fail when trying to change the max time after the game is already started.",
                false
            );
        } catch {}

        // Set the "fake" block number to 1005 (5 blocks after the start) --> Enforce the time exceed
        // --> Expected: reset of the environment

        assignmentContract.setBlockNumber(1005);

        // Test join second player --> exepect that the game is reset and returns gameid = 1 for being the player 1
        try validatorExtendAddress.callStart{value: 0.001 ether}() returns (
            uint256 playerId
        ) {
            // Check if the game id is not 0
            if (playerId != 1)
                return (
                    "Error (Exercise A - start time exceed): The player id is wrong (expected 2 -> for join of player 2). Please make sure that the start function returns the correct player id.",
                    false
                );
        } catch Error(string memory errMsg) {
            return (
                buildErrorMessage(
                    "Error (Exercise A - start time exceed)",
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
                "Error (Exercise A - start time exceed): The game counter is not larger than before. Please make sure that the game counter is increased by 1 when a new game is started.",
                false
            );

        // Set the max time back to default -> 10 blocks
        assignmentContract.setMaxTime("start", 10); // TODO change default value

        return ("Exercise A (start time exceed): All tests passed.", true);
    }

    // TEST: that player 2 choice time exceed --> Expected: reset of environment
    function testPlayTimeExceed() public payable returns (string memory, bool) {
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

        // Get current game counter
        uint256 gameCounterBefore = assignmentContract.getGameCounter();

        // Play the game with player 1
        try assignmentContract.play("rock") {} catch Error(
            string memory errMsg
        ) {
            return (
                buildErrorMessage(
                    "Error (Exercise A - play time exceed)",
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

        try validatorExtendAddress.callPlay("paper") {
            return (
                "Error (Exercise A - play time exceed): The play function did not fail when trying to play the game after the time exceed. Expected that error is thrown, because game should not be started!",
                false
            );
        } catch {}

        // check that player 1 balance is <= then before (because of the refund + gas fee)
        if (player1.balance > player1BalanceBefore)
            return (
                "Error (Exercise A - play time exceed): The player 1 balance is not smaller than before. Please make sure that the player who paid the fee gets a refund when the game is reset because of time exceed.",
                false
            );

        // Reset the max time to default
        assignmentContract.setMaxTime("play", 10); // TODO change default value

        return ("Exercise A (play time exceed): All tests passed.", true);
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
        try
            validatorExtendAddress.callPlayPrivate(hashedChoiceP2)
        {} catch Error(string memory errMsg) {
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
        try validatorExtendAddress.callReveal("paper", seedP2) {} catch Error(
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

        // Get balance of player 1
        uint256 player1BalanceBefore = player1.balance;

        // Set "fake" block to 105
        assignmentContract.setBlockNumber(105);

        // Send playPrivate with choice "paper" for player 2
        try
            validatorExtendAddress.callPlayPrivate(hashedChoiceP2)
        {} catch Error(string memory errMsg) {
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

    /*=============================================
    =                    HELPER                   =
    =============================================*/

    function compareStrings(string memory a, string memory b)
        private
        pure
        returns (bool)
    {
        return (keccak256(abi.encodePacked((a))) ==
            keccak256(abi.encodePacked((b))));
    }

    /*=====  End of HELPER  ======*/
}
