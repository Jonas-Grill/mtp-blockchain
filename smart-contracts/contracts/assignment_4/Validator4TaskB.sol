// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

// Import the IAssignment4.sol
import "./interface/IAssignment4.sol";

// Import Helper
import "../Helper.sol";

// import "BaseConfig.sol";
import "../BaseConfig.sol";

contract Validator4TaskB is Helper, BaseConfig {
    // assignment contract interface
    IAssignment4 assignmentContract;

    constructor(address _configContractAddress) {
        initAdmin(
            _configContractAddress,
            "SS23 Assignment 4 Validator Contract - Task B"
        );
    }

    receive() external payable {}

    // Init contract
    function initContract(address _contractAddress) public {
        // Call the contract interface which needs to be tested and store it in the variable assignmentContract
        assignmentContract = IAssignment4(_contractAddress);
    }

    /*=============================================
    =                  TASK B                   =
    =============================================*/

    function testExerciseB() public payable returns (string memory, bool) {
        // TEST 1: Tried to open two channels (normal and timed)
        (string memory test1Message, bool test1Result) = testChannelOpen();
        if (!test1Result) {
            return (test1Message, false);
        }

        // TEST 2: Test timeout channel
        (string memory test2Message, bool test2Result) = testChannelTimeout();
        if (!test2Result) {
            return (test2Message, false);
        }

        return ("Exercise B: All tests passed.", true);
    }

    function testChannelOpen() public payable returns (string memory, bool) {
        // Student address
        address studentAddress = assignmentContract.getOwner();
        address validatorAddress = address(this);

        // Force reset
        try assignmentContract.forceReset() {} catch Error(
            string memory reason
        ) {
            return (
                buildErrorMessage(
                    "Error (Exercise B - two open channels)",
                    "Error with forceReset() function.",
                    reason
                ),
                false
            );
        }

        // Open "normal" untimed channel
        // ETHER DEPOSIT
        uint256 depositAmount = 1000 wei;

        // Open Channel and set validatorHelper as receiver
        try
            assignmentContract.openChannel{value: depositAmount}(
                studentAddress,
                validatorAddress
            )
        {} catch Error(string memory reason) {
            return (
                buildErrorMessage(
                    "Error (Exercise B - two open channels)",
                    "Error with openChannel() function.",
                    reason
                ),
                false
            );
        }

        // Open "timed" channel -> should fail

        try
            assignmentContract.openChannelTimeout{value: depositAmount}(
                studentAddress,
                validatorAddress,
                10
            )
        {
            return (
                "Error (Exercise B - two open channels): openChannelTimed() should fail, because a 'normal' channel is already opened.",
                false
            );
        } catch {}

        // return true
        return ("Exercise B (two open channels): All tests passed.", true);
    }

    function testChannelTimeout() public payable returns (string memory, bool) {
        // Student address
        address studentAddress = assignmentContract.getOwner();
        address validatorAddress = address(this);

        // Force reset
        try assignmentContract.forceReset() {} catch Error(
            string memory reason
        ) {
            return (
                buildErrorMessage(
                    "Error (Exercise B - timeout)",
                    "Error with forceReset() function.",
                    reason
                ),
                false
            );
        }

        // Set current block to 0
        assignmentContract.setBlockNumber(1000);

        // Open "timed" channel
        // ETHER DEPOSIT
        uint256 depositAmount = 1000 wei;

        // Open Channel and set validatorHelper as receiver
        try
            assignmentContract.openChannelTimeout{value: depositAmount}(
                studentAddress,
                validatorAddress,
                1
            )
        {} catch Error(string memory reason) {
            return (
                buildErrorMessage(
                    "Error (Exercise B - timeout)",
                    "Error with openChannelTimeout() function.",
                    reason
                ),
                false
            );
        }

        // Try to expire channel which is not expired yet
        try assignmentContract.expireChannel() {
            return (
                "Error (Exercise B - timeout): expireChannel() should fail, because the channel is not expired yet.",
                false
            );
        } catch {}

        // Set current block to 1005 --> force expire
        assignmentContract.setBlockNumber(1005);

        // Get balance of validator before expire
        uint256 validatorBalanceBefore = validatorAddress.balance;

        // Try to expire channel which is expired
        try assignmentContract.expireChannel() {} catch Error(
            string memory reason
        ) {
            return (
                buildErrorMessage(
                    "Error (Exercise B - timeout)",
                    "Error with expireChannel() function.",
                    reason
                ),
                false
            );
        }

        // Get balance of validator after expire
        uint256 validatorBalanceAfter = validatorAddress.balance;

        // Check if validator balance increased
        if (validatorBalanceBefore >= validatorBalanceAfter) {
            return (
                "Error (Exercise B - timeout): expireChannel() should increase the validator balance.",
                false
            );
        }

        // return true
        return ("Exercise B (timeout): All tests passed.", true);
    }
}
