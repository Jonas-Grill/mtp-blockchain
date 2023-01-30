// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

// Import the IAssignment3.sol
import "./interface/IAssignment3.sol";

// Import Helper
import "../Helper.sol";

// import "BaseConfig.sol";
import "../BaseConfig.sol";

contract Validator3TaskC is Helper, BaseConfig {
    // assignment contract interface
    IAssignment3 assignmentContract;

    constructor(address _configContractAddress) {
        initAdmin(
            _configContractAddress,
            "SS23 Assignment 3 Validator Contract - Task C"
        );
    }

    fallback() external payable {
        if (address(assignmentContract).balance >= 100 wei) {
            bytes memory signature = assignmentContract.getSignature(1);
            uint256 ethAmount = assignmentContract.getSignatureEthAmount(1);

            try
                assignmentContract.closeChannelNoReentrancy(
                    ethAmount,
                    signature
                )
            {} catch {}
        }
    }

    receive() external payable {
        if (address(assignmentContract).balance >= 100 wei) {
            bytes memory signature = assignmentContract.getSignature(1);
            uint256 ethAmount = assignmentContract.getSignatureEthAmount(1);

            try
                assignmentContract.closeChannelNoReentrancy(
                    ethAmount,
                    signature
                )
            {} catch {}
        }
    }

    // Init contract
    function initContract(address _contractAddress) public {
        // Call the contract interface which needs to be tested and store it in the variable assignmentContract
        assignmentContract = IAssignment3(_contractAddress);
    }

    /*=============================================
    =                  TASK B                   =
    =============================================*/

    function testExerciseC() public payable returns (string memory, bool) {
        // TEST 1: test attack
        (string memory test1Message, bool test1Result) = testAttack();
        if (!test1Result) {
            return (test1Message, false);
        }

        return ("Exercise C: All tests passed.", true);
    }

    function testAttack() public payable returns (string memory, bool) {
        // Student address
        address studentAddress = assignmentContract.getOwner();
        address validatorAddress = address(this);

        // Force reset
        try assignmentContract.forceReset() {} catch Error(
            string memory reason
        ) {
            return (
                buildErrorMessage(
                    "Error (Exercise C - reentrancy attack)",
                    "Error with forceReset() function.",
                    reason
                ),
                false
            );
        }

        // Deposit amount
        uint256 depositAmount = 1000 wei;

        // Open channel
        try
            assignmentContract.openChannel{value: depositAmount}(
                studentAddress,
                validatorAddress
            )
        {} catch Error(string memory reason) {
            return (
                buildErrorMessage(
                    "Error (Exercise C - reentrancy attack)",
                    "Error with openChannelTimeout() function.",
                    reason
                ),
                false
            );
        }

        // Get validat signature
        bytes memory signature = assignmentContract.getSignature(1);
        uint256 ethAmount = assignmentContract.getSignatureEthAmount(1);

        if (ethAmount == 0) {
            return (
                buildErrorMessage(
                    "Error (Exercise A)",
                    "Error with getSignatureEthAmount() function.",
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

        // eth amount should be 100 wei
        if (ethAmount != 100 wei) {
            return (
                buildErrorMessage(
                    "Error (Exercise C - reentrancy attack)",
                    "Error with saved signature with id 1",
                    "The eth amount should be 100 wei."
                ),
                false
            );
        }

        // Signature with index 2 should be valid and have 100 wei
        try assignmentContract.verifyPaymentMsg(ethAmount, signature) returns (
            bool success
        ) {
            if (!success) {
                return (
                    buildErrorMessage(
                        "Error (Exercise C - reentrancy attack)",
                        "Error with saved signature with id 1",
                        "The signature should be valid."
                    ),
                    false
                );
            }
        } catch Error(string memory reason) {
            return (
                buildErrorMessage(
                    "Error (Exercise C - reentrancy attack)",
                    "Error with verifyPaymentMsg() function.",
                    reason
                ),
                false
            );
        }

        // Get the balance of the receiver before the attack
        uint256 balanceBeforeAttack = address(this).balance;

        // Close Channel with reentrancy
        try
            assignmentContract.closeChannelNoReentrancy(ethAmount, signature)
        {} catch Error(string memory reason) {
            return (
                buildErrorMessage(
                    "Error (Exercise C - reentrancy attack)",
                    "Error with closeChannelNoReentrancy() function.",
                    reason
                ),
                false
            );
        }

        // Get the balance of the receiver after the attack
        uint256 balanceAfterAttack = address(this).balance;

        // Check that new balance is only increased by 100 wei
        if (balanceAfterAttack > balanceBeforeAttack + 100 wei) {
            return (
                buildErrorMessage(
                    "Error (Exercise C - reentrancy attack)",
                    "Error with closeChannelNoReentrancy() function.",
                    "The balance should be increased by 100 wei. If increased more, the attack was successful. Task failed!"
                ),
                false
            );
        }

        return ("Exercise C (reentrancy attack): All tests passed.", true);
    }
}
