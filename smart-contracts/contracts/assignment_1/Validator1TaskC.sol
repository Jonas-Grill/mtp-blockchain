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
contract Validator1TaskC is Helper, BaseConfig {
    using Strings for uint256;

    // assignment contract interface
    IAssignment1 assignmentContract;
    Validator1Helper validator1Helper;

    constructor(address _configContractAddress) {
        initAdmin(
            _configContractAddress,
            "SS23 Assignment 1 Validator Contract - Task C"
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

    function testExerciseC() public payable returns (string memory, bool) {
        /*----------  EXERCISE C  ----------*/

        try assignmentContract.getPrice() returns (uint256 oldPriceC) {
            if (oldPriceC > 0) {
                // mint a nft and send to _address and pay 0.01 ether
                try assignmentContract.mint{value: 0.01 ether}(msg.sender) {
                    uint256 newPriceC = assignmentContract.getPrice();

                    if (newPriceC == oldPriceC + 0.0001 ether) {
                        return (
                            "Passed (Exercise C): Exercise C passed!",
                            true
                        );
                    }
                } catch {}
            } else {}
        } catch {}

        return ("Error (Exercise C): Error with methods in Exercise C!", false);
    }
}
