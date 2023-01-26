// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

// Import the IAssignment1.sol
import "./interface/IAssignment1.sol";

import "../../node_modules/@openzeppelin/contracts/utils/Base64.sol";
import "../../node_modules/@openzeppelin/contracts/utils/Strings.sol";

// Import Helper
import "../Helper.sol";

// Import the assignment validator extend contract
import "./Validator1Helper.sol";

// import "BaseConfig.sol";
import "../BaseConfig.sol";

// Give the contract a name and inherit from the base assignment validator
contract Validator1TaskF is Helper, BaseConfig {
    using Strings for uint256;

    // assignment contract interface
    IAssignment1 assignmentContract;
    Validator1Helper validator1Helper;

    constructor(address _configContractAddress) {
        initAdmin(
            _configContractAddress,
            "SS23 Assignment 1 Validator Contract - Task F"
        );
    }

    receive() external payable {}

    // Init contract
    function initContract(
        address _contractAddress,
        address _validator1HelperAddress
    ) public {
        // Call the contract interface which needs to be tested and store it in the variable assignmentContract
        assignmentContract = IAssignment1(_contractAddress);
        validator1Helper = Validator1Helper(payable(_validator1HelperAddress));
    }

    function testExerciseF() public payable returns (string memory, bool) {
        /*----------  EXERCISE F  ----------*/

        // get ether balance of owner
        uint256 ownerBalanceBeforeF = (assignmentContract.getOwner()).balance;

        // withdraw funds to owner
        try
            assignmentContract.withdraw(payable(assignmentContract.getOwner()))
        {
            // get ether balance of owner
            uint256 ownerBalanceAfterF = (assignmentContract.getOwner())
                .balance;

            uint256 exerciseFPassedCounter = 0;

            // check if ether balance of owner is increased
            if (ownerBalanceAfterF > ownerBalanceBeforeF) {
                exerciseFPassedCounter++;
            } else {
                // If not all tests passed, mark test as failed
                return (
                    "Error (Exercise F): Ether balance of owner is not increased!",
                    false
                );
            }

            // Try withdraw from not certified address
            try validator1Helper.withdrawTestF(assignmentContract) {
                return (
                    "Error (Exercise F): Withdraw function is not restricted to the owner!",
                    false
                );
            } catch {
                exerciseFPassedCounter++;
            }

            if (exerciseFPassedCounter == 2) {
                return ("Passed (Exercise F): Exercise F passed!", true);
            }
        } catch Error(string memory _reason) {
            return (
                string(
                    abi.encodePacked(
                        "Error (Exercise F): Error with the withdraw function! ",
                        _reason
                    )
                ),
                false
            );
        }
        return ("Passed (Exercise F): Error!", false);
    }
}
