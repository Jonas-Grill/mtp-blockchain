// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

// Import the Assignment1Interface.sol
import "../assignment_1/Assignment1Interface.sol";
import "../assignment_1/Assignment1Tests.sol";

// Import the base assignment validator contract
import "../../contracts/BaseValidator.sol";

import "../../node_modules/@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";

// Give the contract a name and inherit from the base assignment validator
contract Assignment1Validator is BaseValidator, ERC721Holder {
    address validatorTestsAddress;

    // Import empty constructor and pass the name of the contract to the config storage contract
    constructor(address _configContractAddress, address _validatorTestsAddress)
        BaseValidator(
            _configContractAddress,
            "SS23 Assignment 1 Validator Contract",
            0.8 ether
        )
    {
        // The constructor is empty
        validatorTestsAddress = _validatorTestsAddress;
    }

    // Test the assignment
    function test(address _contractAddress)
        public
        payable
        override(BaseValidator)
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
        Assignment1Interface assignmentContract = Assignment1Interface(
            _contractAddress
        );

        // Get Assignment1Tests contract
        Assignment1Tests validatorTests = Assignment1Tests(
            validatorTestsAddress
        );

        /*----------  EXERCISE A  ----------*/
        (string memory messageA, bool resultA) = validatorTests.testExerciseA{
            value: 0.01 ether
        }(assignmentContract);

        if (resultA) {
            // If the test passed, add the result to the history
            appendTestResult(messageA, true, 2);
        } else {
            // If the test failed, add the result to the history
            appendTestResult(messageA, false, 0);
        }

        /*----------  EXERCISE B  ----------*/

        (string memory messageB, bool resultB) = validatorTests.testExerciseB{
            value: 0.01 ether
        }(assignmentContract);

        if (resultB) {
            // If the test passed, add the result to the history
            appendTestResult(messageB, true, 2);
        } else {
            // If the test failed, add the result to the history
            appendTestResult(messageB, false, 0);
        }

        /*----------  EXERCISE C  ----------*/

        (string memory messageC, bool resultC) = validatorTests.testExerciseC{
            value: 0.01 ether
        }(assignmentContract);

        if (resultC) {
            // If the test passed, add the result to the history
            appendTestResult(messageC, true, 2);
        } else {
            // If the test failed, add the result to the history
            appendTestResult(messageC, false, 0);
        }

        /*----------  EXERCISE D  ----------*/

        (string memory messageD, bool resultD) = testExerciseD(
            assignmentContract,
            validatorTests
        );

        if (resultD) {
            // If the test passed, add the result to the history
            appendTestResult(messageD, true, 1);
        } else {
            // If the test failed, add the result to the history
            appendTestResult(messageD, false, 0);
        }

        /*----------  EXERCISE E  ----------*/

        (string memory messageE, bool resultE) = testExerciseE(
            assignmentContract
        );

        if (resultE) {
            // If the test passed, add the result to the history
            appendTestResult(messageE, true, 1);
        } else {
            // If the test failed, add the result to the history
            appendTestResult(messageE, false, 0);
        }

        /*----------  EXERCISE F  ----------*/

        (string memory messageF, bool resultF) = testExerciseF(
            assignmentContract,
            validatorTests
        );

        if (resultF) {
            // If the test passed, add the result to the history
            appendTestResult(messageF, true, 1);
        } else {
            // If the test failed, add the result to the history
            appendTestResult(messageF, false, 0);
        }

        // Return the history index
        return _testHistoryCounter;
    }

    function testExerciseD(
        Assignment1Interface assignment_contract,
        Assignment1Tests validatorTests
    ) private returns (string memory, bool) {
        /*----------  EXERCISE D  ----------*/

        // mint a nft and send to _address and pay 0.01 ether
        try assignment_contract.mint{value: 0.01 ether}(address(this)) returns (
            uint256 idD
        ) {
            if (idD > 0) {
                uint256 oldPriceD = assignment_contract.getPrice();

                // get balance of the address(this)
                uint256 balanceBeforeD = assignment_contract.balanceOf(
                    address(this)
                );

                uint256 totalSupplyBeforeD = 0;
                // get total supply
                try assignment_contract.getTotalSupply() returns (
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
                try assignment_contract.burn{value: 0.0001 ether}(idD) {
                    // get balance of the address(this)
                    uint256 balanceAfterD = assignment_contract.balanceOf(
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
                    uint256 newPriceD = assignment_contract.getPrice();

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
                    uint256 totalSupplyAfterD = assignment_contract
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
                    uint256 newTokenId = assignment_contract.mint{
                        value: 0.01 ether
                    }(address(this));
                    try
                        validatorTests.burnTestD{value: 0.001 ether}(
                            assignment_contract,
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

    function testExerciseE(Assignment1Interface assignment_contract)
        private
        returns (string memory, bool)
    {
        /*----------  EXERCISE E  ----------*/

        uint256 exerciseEPassedCounter = 0;

        // get sale status
        bool saleStatusBeforeE = assignment_contract.getSaleStatus();

        // flip the sale status
        try assignment_contract.flipSaleStatus() {} catch {
            return (
                "Error (Exercise E): Error with the flipSaleStatus function!",
                false
            );
        }

        // get sale status
        bool saleStatusAfterE = assignment_contract.getSaleStatus();

        // check if sale status flipped
        if (saleStatusAfterE == saleStatusBeforeE) {
            return ("Error (Exercise E): Sale status is not flipped!", false);
        } else {
            exerciseEPassedCounter++;
        }

        // Set sale status to false
        if (saleStatusAfterE) {
            // flip the sale status
            try assignment_contract.flipSaleStatus() {} catch {
                return (
                    "Error (Exercise E): Error with the flipSaleStatus function!",
                    false
                );
            }
        }

        try
            assignment_contract.mint{value: 0.01 ether}(address(this))
        {} catch {
            exerciseEPassedCounter++;
        }

        // Set sale status to true again
        if (assignment_contract.getSaleStatus() == false) {
            // flip the sale status
            assignment_contract.flipSaleStatus();
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

    function testExerciseF(
        Assignment1Interface assignment_contract,
        Assignment1Tests validatorTests
    ) private returns (string memory, bool) {
        /*----------  EXERCISE F  ----------*/

        // get ether balance of owner
        uint256 ownerBalanceBeforeF = msg.sender.balance;

        // withdraw funds to owner
        try
            assignment_contract.withdraw(
                payable(assignment_contract.getOwner())
            )
        {
            // get ether balance of owner
            uint256 ownerBalanceAfterF = msg.sender.balance;

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
            try validatorTests.withdrawTestF(assignment_contract) {
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
