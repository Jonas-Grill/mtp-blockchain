// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

// Import the Assignment1Interface.sol
import "../assignment_1/Validator1Interface.sol";

import "../../node_modules/@openzeppelin/contracts/utils/Base64.sol";
import "../../node_modules/@openzeppelin/contracts/utils/Strings.sol";

// Import Helper
import "../Helper.sol";

// Import the assignment validator extend contract
import "./Validator1Helper.sol";

// import "BaseConfig.sol";
import "../BaseConfig.sol";

// Give the contract a name and inherit from the base assignment validator
contract Validator1TaskE is Helper, BaseConfig {
    using Strings for uint256;

    // assignment contract interface
    Validator1Interface assignmentContract;
    Validator1Helper validator1Helper;

    constructor(address _configContractAddress) {
        initAdmin(
            _configContractAddress,
            "SS23 Assignment 1 Validator Contract - Task E"
        );
    }

    receive() external payable {}

    // Init contract
    function initContract(
        address _contractAddress,
        address _validator1HelperAddress
    ) public {
        // Call the contract interface which needs to be tested and store it in the variable assignmentContract
        assignmentContract = Validator1Interface(_contractAddress);
        validator1Helper = Validator1Helper(payable(_validator1HelperAddress));
    }

    function testExerciseE() public payable returns (string memory, bool) {
        /*----------  EXERCISE E  ----------*/

        uint256 exerciseEPassedCounter = 0;

        // get sale status
        bool saleStatusBeforeE = assignmentContract.getSaleStatus();

        // flip the sale status
        try assignmentContract.flipSaleStatus() {} catch {
            return (
                "Error (Exercise E): Error with the flipSaleStatus function!",
                false
            );
        }

        // get sale status
        bool saleStatusAfterE = assignmentContract.getSaleStatus();

        // check if sale status flipped
        if (saleStatusAfterE == saleStatusBeforeE) {
            return ("Error (Exercise E): Sale status is not flipped!", false);
        } else {
            exerciseEPassedCounter++;
        }

        // Set sale status to false
        if (saleStatusAfterE) {
            // flip the sale status
            try assignmentContract.flipSaleStatus() {} catch {
                return (
                    "Error (Exercise E): Error with the flipSaleStatus function!",
                    false
                );
            }
        }

        try assignmentContract.mint{value: 0.01 ether}(address(this)) {} catch {
            exerciseEPassedCounter++;
        }

        // Set sale status to true again
        if (assignmentContract.getSaleStatus() == false) {
            // flip the sale status
            assignmentContract.flipSaleStatus();
        }

        // if exerciseEPassedCounter == 2 --> exercise E passed
        if (exerciseEPassedCounter == 2) {
            return ("Passed (Exercise E): Exercise E passed!", true);
        } else {
            return (
                "Error (Exercise E): Some tests in Exercise E failed!",
                false
            );
        }
    }
}
