// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

// Import the IAssignment3.sol
import "./interface/IAssignment3.sol";

// Import Helper
import "../Helper.sol";

// import "BaseConfig.sol";
import "../BaseConfig.sol";

contract Validator3TaskA is Helper, BaseConfig {
    // assignment contract interface
    IAssignment3 assignmentContract;

    constructor(address _configContractAddress) {
        initAdmin(
            _configContractAddress,
            "SS23 Assignment 3 Validator Contract - Task A"
        );
    }

    receive() external payable {}

    // Init contract
    function initContract(address _contractAddress) public {
        // Call the contract interface which needs to be tested and store it in the variable assignmentContract
        assignmentContract = IAssignment3(_contractAddress);
    }

    /*=============================================
    =                  TASK A                   =
    =============================================*/

    function testExerciseA() public payable returns (string memory, bool) {
        // TEST 1: full success run
        (string memory test1Message, bool test1Result) = testSuccessRun();
        if (!test1Result) {
            return (test1Message, false);
        }

        // TEST 3: Signatures are not same
        (string memory test3Message, bool test3Result) = testSignatures();
        if (!test3Result) {
            return (test3Message, false);
        }

        return ("Exercise A: All tests passed.", true);
    }

    function testSuccessRun() public payable returns (string memory, bool) {
        // Student address
        address studentAddress = assignmentContract.getOwner();
        address validatorAddress = address(this);

        // Force reset
        try assignmentContract.forceReset() {} catch Error(
            string memory reason
        ) {
            return (
                buildErrorMessage(
                    "Error (Exercise A)",
                    "Error with forceReset() function.",
                    reason
                ),
                false
            );
        }

        // get balance of channel contract before
        uint256 balanceBefore = address(assignmentContract).balance;

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
                    "Error (Exercise A)",
                    "Error with openChannel() function.",
                    reason
                ),
                false
            );
        }

        // get balance of channel contract after
        uint256 balanceAfter = address(assignmentContract).balance;

        // Check if balance of channel contract is correct
        if (balanceAfter != balanceBefore + depositAmount) {
            return (
                buildErrorMessage(
                    "Error (Exercise A)",
                    "Error with openChannel() function.",
                    "Balance of channel contract is not correct."
                ),
                false
            );
        }

        // Check if a second channel can be openend --> expected to fail
        try
            assignmentContract.openChannel{value: depositAmount}(
                studentAddress,
                validatorAddress
            )
        {
            return (
                buildErrorMessage(
                    "Error (Exercise A)",
                    "Error with openChannel() function.",
                    "Only one channel can be openend at a time."
                ),
                false
            );
        } catch {}

        // Validate signed message --> expected success
        bytes memory signature = assignmentContract.getSignature(0);
        uint256 ethAmount = assignmentContract.getSignatureEthAmount(0);

        if (ethAmount == 0) {
            return (
                buildErrorMessage(
                    "Error (Exercise A)",
                    "Error with getSignatureEth() function.",
                    "The stored signature with index: 0 is not valid. Expect to be valid."
                ),
                false
            );
        }

        if (signature.length == 0) {
            return (
                buildErrorMessage(
                    "Error (Exercise A)",
                    "Error with getSignature() function.",
                    "The stored signature with index: 0 is not valid. Expect to be valid."
                ),
                false
            );
        }

        // Check if eth Amount is below deposit threshold
        if (ethAmount > depositAmount) {
            return (
                "Error (Exercise A): The amount of ether signed with the signature is too high. Please override the index 0 with a lower amount.",
                false
            );
        }

        // Validate the signature and the amount

        try assignmentContract.verifyPaymentMsg(ethAmount, signature) returns (
            bool success
        ) {
            if (success == false) {
                return (
                    buildErrorMessage(
                        "Error (Exercise A)",
                        "Error with verifyPaymentMsg() function.",
                        "The stored signature with index: 0 is not valid. Expect to be valid."
                    ),
                    false
                );
            }
        } catch Error(string memory reason) {
            return (
                buildErrorMessage(
                    "Error (Exercise A)",
                    "Error with verifyPaymentMsg() function.",
                    reason
                ),
                false
            );
        }

        // Validate non-sense signed message --> expected to fail
        try
            assignmentContract.verifyPaymentMsg(912737912 ether, signature)
        returns (bool success) {
            if (success == true) {
                return (
                    buildErrorMessage(
                        "Error (Exercise A)",
                        "Error with verifyPaymentMsg() function.",
                        "The function returned true, but the signature in combination with the ethAmount is not valid."
                    ),
                    false
                );
            }
        } catch Error(string memory reason) {
            return (
                buildErrorMessage(
                    "Error (Exercise A)",
                    "Error with verifyPaymentMsg() function.",
                    reason
                ),
                false
            );
        }

        // Balance of sender before
        uint256 balanceSenderBefore = validatorAddress.balance;

        // Close channel
        try
            assignmentContract.closeChannel(ethAmount, signature)
        {} catch Error(string memory reason) {
            return (
                buildErrorMessage(
                    "Error (Exercise A)",
                    "Error with closeChannel() function.",
                    reason
                ),
                false
            );
        }

        // Balance of sender after
        uint256 balanceSenderAfter = validatorAddress.balance;

        // Check if balance of sender is correct
        if (balanceSenderAfter != balanceSenderBefore + ethAmount) {
            return (
                buildErrorMessage(
                    "Error (Exercise A)",
                    "Error with closeChannel() function.",
                    "Balance of sender is not correct."
                ),
                false
            );
        }

        // Try to close channel again --> expected to fail
        try assignmentContract.closeChannel(ethAmount, signature) {
            return (
                buildErrorMessage(
                    "Error (Exercise A)",
                    "Error with closeChannel() function.",
                    "Channel is already closed."
                ),
                false
            );
        } catch {}

        // Check that left over ether is still in channel contract
        if (address(assignmentContract).balance != balanceAfter - ethAmount) {
            return (
                buildErrorMessage(
                    "Error (Exercise A)",
                    "Error with closeChannel() function.",
                    "Left over ether is not in channel contract. Wrong ether transfer!"
                ),
                false
            );
        }

        // return success
        return ("Exercise A: All tests passed.", true);
    }

    function testSignatures() public payable returns (string memory, bool) {
        bytes memory signature0 = assignmentContract.getSignature(0);
        bytes memory signature1 = assignmentContract.getSignature(1);

        // Check if signatures are not the same
        if (keccak256(signature0) == keccak256(signature1)) {
            return (
                "Error (Exercise A - Signature): The signatures are the same. Please override the index 0 with a different signature.",
                false
            );
        }

        return ("Exercise A (Signature): All tests passed.", true);
    }
}
