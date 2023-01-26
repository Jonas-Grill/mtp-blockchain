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
contract Validator1TaskA is Helper, BaseConfig {
    using Strings for uint256;

    // assignment contract interface
    Validator1Interface assignmentContract;
    Validator1Helper validator1Helper;

    constructor(address _configContractAddress) {
        initAdmin(
            _configContractAddress,
            "SS23 Assignment 1 Validator Contract - Task A"
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

    function testExerciseA() public payable returns (string memory, bool) {
        /*----------  EXERCISE A  ----------*/

        // Total supply before minting
        uint256 totalSupplyBefore = assignmentContract.getTotalSupply();

        // Total nft of msg.sender
        uint256 balanceBefore = assignmentContract.balanceOf(msg.sender);

        // mint a nft and send to _address and pay 0.01 ether
        try assignmentContract.mint{value: 0.01 ether}(msg.sender) returns (
            uint256 id_a
        ) {
            uint256 exerciseAPassedCounter = 0;

            // Check if id is larger than 0
            if (id_a > 0) {
                exerciseAPassedCounter++;

                // Check if the total supply is increased by 1
                if (assignmentContract.getTotalSupply() > totalSupplyBefore) {
                    exerciseAPassedCounter++;
                } else {
                    return (
                        "Error (Exercise A): Total supply did not increase correctly!",
                        false
                    );
                }

                // Make sure NFT of token id is owned by the current msg.sender
                if (assignmentContract.ownerOf(id_a) == msg.sender) {
                    exerciseAPassedCounter++;
                } else {
                    return (
                        "Error (Exercise A): NFT owner is not correctly set!",
                        false
                    );
                }

                // Make sure the balance of the current msg.sender is increased by 1
                if (
                    assignmentContract.balanceOf(msg.sender) ==
                    balanceBefore + 1
                ) {
                    exerciseAPassedCounter++;
                } else {
                    return (
                        "Error (Exercise A): Balance of msg.sender did not increase!",
                        false
                    );
                }

                // If exerciseAPassedCounter == 4 --> exercise A passed
                if (exerciseAPassedCounter == 4) {
                    return ("Passed (Exercise A): Exercise A passed!", true);
                } else {
                    // If not all tests passed, mark test as failed
                    return (
                        "Error (Exercise A): Some tests in Exercise A failed!",
                        false
                    );
                }
            } else {
                return (
                    "Error (Exercise A): Error with the mint function id is 0!",
                    false
                );
            }
        } catch {
            // If an error occurs, mark test as failed
            return ("Error (Exercise A): Error with the mint function!", false);
        }
    }
}
