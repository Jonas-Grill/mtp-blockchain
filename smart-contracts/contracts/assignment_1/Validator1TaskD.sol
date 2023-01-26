// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

// Import the Validator1Interface.sol
import "../assignment_1/Validator1Interface.sol";

import "../../node_modules/@openzeppelin/contracts/utils/Base64.sol";
import "../../node_modules/@openzeppelin/contracts/utils/Strings.sol";
import "../../node_modules/@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";

// Import Helper
import "../Helper.sol";

// Import the assignment validator extend contract
import "./Validator1Helper.sol";

// import "BaseConfig.sol";
import "../BaseConfig.sol";

// Give the contract a name and inherit from the base assignment validator
contract Validator1TaskD is Helper, BaseConfig, ERC721Holder {
    using Strings for uint256;

    // assignment contract interface
    Validator1Interface assignmentContract;
    Validator1Helper validator1Helper;

    constructor(address _configContractAddress) {
        initAdmin(
            _configContractAddress,
            "SS23 Assignment 1 Validator Contract - Task D"
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

    function testExerciseD() public payable returns (string memory, bool) {
        /*----------  EXERCISE D  ----------*/

        // mint a nft and send to _address and pay 0.01 ether
        try assignmentContract.mint{value: 0.01 ether}(address(this)) returns (
            uint256 idD
        ) {
            if (idD > 0) {
                uint256 oldPriceD = assignmentContract.getPrice();

                // get balance of the address(this)
                uint256 balanceBeforeD = assignmentContract.balanceOf(
                    address(this)
                );

                uint256 totalSupplyBeforeD = 0;
                // get total supply
                try assignmentContract.getTotalSupply() returns (
                    uint256 _totalSupplyBeforeD
                ) {
                    totalSupplyBeforeD = _totalSupplyBeforeD;
                } catch {
                    return (
                        "Error (Exercise D): Error with the getTotalSupply method!",
                        false
                    );
                }

                // burn the nft
                try assignmentContract.burn{value: 0.0001 ether}(idD) {
                    // get balance of the address(this)
                    uint256 balanceAfterD = assignmentContract.balanceOf(
                        address(this)
                    );

                    uint256 exerciseDPassedCounter = 0;

                    // check if balance of address(this) is decreased by 1
                    if (balanceAfterD == balanceBeforeD - 1) {
                        exerciseDPassedCounter++;
                    } else {
                        return (
                            "Error (Exercise D): Balance of address(this) is not decreased by 1!",
                            false
                        );
                    }

                    // get new price
                    uint256 newPriceD = assignmentContract.getPrice();

                    // check if price is decreased by 0.0001 ether
                    if (newPriceD == oldPriceD - 0.0001 ether) {
                        exerciseDPassedCounter++;
                    } else {
                        return (
                            "Error (Exercise D): Price is not decreased by 0.0001 ether!",
                            false
                        );
                    }

                    // get total supply
                    uint256 totalSupplyAfterD = assignmentContract
                        .getTotalSupply();

                    if (totalSupplyAfterD == totalSupplyBeforeD - 1) {
                        exerciseDPassedCounter++;
                    } else {
                        return (
                            "Error (Exercise D): Total supply is not decreased by 1!",
                            false
                        );
                    }

                    // Create new NFT
                    uint256 newTokenId = assignmentContract.mint{
                        value: 0.01 ether
                    }(address(this));

                    try
                        validator1Helper.burnTestD{value: 0.001 ether}(
                            assignmentContract,
                            newTokenId
                        )
                    {
                        return (
                            "Error (Exercise D): Burn function is not restricted to the owner of the NFT!",
                            true
                        );
                    } catch {
                        exerciseDPassedCounter++;
                    }

                    // if exerciseDPassedCounter == 4 --> exercise D passed
                    if (exerciseDPassedCounter == 4) {
                        return (
                            "Passed (Exercise D): Exercise D passed!",
                            true
                        );
                    }
                } catch Error(string memory _reason) {
                    return (
                        string(
                            abi.encodePacked(
                                "Error (Exercise D): Error with the burn function! - ",
                                _reason
                            )
                        ),
                        false
                    );
                }
            }
        } catch Error(string memory _reason) {
            return (
                string(
                    abi.encodePacked(
                        "Error (Exercise D): Error with the mint function! - ",
                        _reason
                    )
                ),
                false
            );
        }

        return ("Error (Exercise D): Error in Exercise D function!", false);
    }
}
