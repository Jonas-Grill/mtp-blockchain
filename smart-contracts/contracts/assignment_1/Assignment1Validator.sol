// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

// Import the Assignment1Interface.sol
import "../assignment_1/Assignment1Interface.sol";

// Import the base assignment validator contract
import "../../contracts/BaseAssignmentValidator.sol";

import "../../node_modules/@openzeppelin/contracts/utils/Base64.sol";
import "../../node_modules/@openzeppelin/contracts/utils/Strings.sol";
import "../../node_modules/@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";

// Give the contract a name and inherit from the base assignment validator
contract Assignment1Validator is BaseAssignmentValidator, ERC721Holder {
    using Strings for uint256;

    // Import empty constructor and pass the name of the contract to the config storage contract
    constructor(address _configContractAddress)
        BaseAssignmentValidator(
            _configContractAddress,
            "SS23 Assignment 1 Validator Contract",
            0.05 ether
        )
    {
        // The constructor is empty
    }

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
        uint256 historyIndex = createTestHistory(_contractAddress);

        // Call the contract interface which needs to be tested and store it in the variable assignment_contract
        Assignment1Interface assignment_contract = Assignment1Interface(
            _contractAddress
        );

        /*----------  EXERCISE A  ----------*/
        (string memory messageA, bool resultA) = testExerciseA(
            assignment_contract
        );

        if (resultA) {
            // If the test passed, add the result to the history
            appendTestResult(historyIndex, messageA, true, 2);
        } else {
            // If the test failed, add the result to the history
            appendTestResult(historyIndex, messageA, false, 0);
        }

        /*----------  EXERCISE B  ----------*/

        (string memory messageB, bool resultB) = testExerciseB(
            assignment_contract
        );

        if (resultB) {
            // If the test passed, add the result to the history
            appendTestResult(historyIndex, messageB, true, 2);
        } else {
            // If the test failed, add the result to the history
            appendTestResult(historyIndex, messageB, false, 0);
        }

        /*----------  EXERCISE C  ----------*/

        (string memory messageC, bool resultC) = testExerciseC(
            assignment_contract
        );

        if (resultC) {
            // If the test passed, add the result to the history
            appendTestResult(historyIndex, messageC, true, 2);
        } else {
            // If the test failed, add the result to the history
            appendTestResult(historyIndex, messageC, false, 0);
        }

        /*----------  EXERCISE D  ----------*/

        (string memory messageD, bool resultD) = testExerciseD(
            assignment_contract
        );

        if (resultD) {
            // If the test passed, add the result to the history
            appendTestResult(historyIndex, messageD, true, 1);
        } else {
            // If the test failed, add the result to the history
            appendTestResult(historyIndex, messageD, false, 0);
        }

        /*----------  EXERCISE E  ----------*/

        (string memory messageE, bool resultE) = testExerciseE(
            assignment_contract
        );

        if (resultE) {
            // If the test passed, add the result to the history
            appendTestResult(historyIndex, messageE, true, 1);
        } else {
            // If the test failed, add the result to the history
            appendTestResult(historyIndex, messageE, false, 0);
        }

        /*----------  EXERCISE F  ----------*/

        (string memory messageF, bool resultF) = testExerciseF(
            assignment_contract
        );

        if (resultF) {
            // If the test passed, add the result to the history
            appendTestResult(historyIndex, messageF, true, 1);
        } else {
            // If the test failed, add the result to the history
            appendTestResult(historyIndex, messageF, false, 0);
        }

        // Return the history index
        return historyIndex;
    }

    function testExerciseA(Assignment1Interface assignment_contract)
        private
        returns (string memory, bool)
    {
        /*----------  EXERCISE A  ----------*/

        // Total supply before minting
        uint256 totalSupplyBefore = assignment_contract.getTotalSupply();

        // Total nft of msg.sender
        uint256 balanceBefore = assignment_contract.balanceOf(address(this));

        // mint a nft and send to _address and pay 0.01 ether

        try assignment_contract.mint{value: 0.01 ether}(address(this)) returns (
            uint256 id_a
        ) {
            uint256 exerciseAPassedCounter = 0;

            // Check if id is larger than 0
            if (id_a > 0) {
                exerciseAPassedCounter++;

                // Check if the total supply is increased by 1
                if (assignment_contract.getTotalSupply() > totalSupplyBefore) {
                    exerciseAPassedCounter++;
                } else {
                    return (
                        "Error (Exercise A): Total supply did not increase correctly!",
                        false
                    );
                }

                // Make sure NFT of token id is owned by the current msg.sender
                if (assignment_contract.ownerOf(id_a) == address(this)) {
                    exerciseAPassedCounter++;
                } else {
                    return (
                        "Error (Exercise A): NFT owner is not correctly set!",
                        false
                    );
                }

                // Make sure the balance of the current msg.sender is increased by 1
                if (
                    assignment_contract.balanceOf(address(this)) ==
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
                    "Error (Exercise A): Error with the mint function!",
                    false
                );
            }
        } catch {
            // If an error occurs, mark test as failed
            return ("Error (Exercise A): Error with the mint function!", false);
        }
    }

    function testExerciseB(Assignment1Interface assignment_contract)
        private
        returns (string memory, bool)
    {
        /*----------  EXERCISE B  ----------*/

        // mint a nft and send to _address and pay 0.01 ether
        try assignment_contract.mint{value: 0.01 ether}(address(this)) returns (
            uint256 id_b
        ) {
            if (id_b > 0) {
                string memory tokenURI = assignment_contract.tokenURI(id_b);
                string memory expectedTokenURI = getTokenURI(
                    id_b,
                    assignment_contract.getIPFSHash(),
                    assignment_contract.getOwner(),
                    address(this)
                );

                // Check if tokenURI equals to expectedTokenURI
                if (compare(tokenURI, expectedTokenURI) == true) {
                    return ("Passed (Exercise B): Exercise B passed!", true);
                } else {
                    return ("Error (Exercise B): TokenURI not correct!", false);
                }
            } else {
                return (
                    "Error (Exercise B): Error with the mint function!",
                    false
                );
            }
        } catch {
            // If an error occurs, mark test as failed
            return ("Error (Exercise B): Error with the mint function!", false);
        }
    }

    function testExerciseC(Assignment1Interface assignment_contract)
        private
        returns (string memory, bool)
    {
        /*----------  EXERCISE C  ----------*/

        try assignment_contract.getPrice() returns (uint256 oldPriceC) {
            if (oldPriceC > 0) {
                // mint a nft and send to _address and pay 0.01 ether
                try assignment_contract.mint{value: 0.01 ether}(address(this)) {
                    uint256 newPriceC = assignment_contract.getPrice();

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

    function testExerciseD(Assignment1Interface assignment_contract)
        private
        returns (string memory, bool)
    {
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

                    // if exerciseDPassedCounter == 3 --> exercise D passed
                    if (exerciseDPassedCounter == 3) {
                        return (
                            "Passed (Exercise D): Exercise D passed!",
                            true
                        );
                    }
                } catch {}
            }
        } catch {}

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

    function testExerciseF(Assignment1Interface assignment_contract)
        private
        returns (string memory, bool)
    {
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

            // check if ether balance of owner is increased
            if (ownerBalanceAfterF > ownerBalanceBeforeF) {
                return ("Passed (Exercise F): Exercise F passed!", true);
            } else {
                // If not all tests passed, mark test as failed
                return (
                    "Error (Exercise F): Ether balance of owner is not increased!",
                    false
                );
            }
        } catch {
            return (
                "Error (Exercise F): Error with the withdraw function!",
                false
            );
        }
    }

    /*=============================================
    =            HELPER            =
    =============================================*/

    function getTokenURI(
        uint256 tokenId,
        string memory IPFSHash,
        address by,
        address newOwner
    ) public pure returns (string memory) {
        // Build dataURI
        bytes memory dataURI = abi.encodePacked(
            "{",
            '"name": "My beautiful artwork #',
            tokenId.toString(),
            '"', // Name of NFT with id
            '"hash": "',
            IPFSHash,
            '",', // Define hash of your artwork from IPFS
            '"by": "',
            by,
            '",', // Address of creator
            '"new_owner": "',
            newOwner,
            '"', // Address of new owner
            "}"
        );

        // Encode dataURI using base64 and return
        return
            string(
                abi.encodePacked(
                    "data:application/json;base64,",
                    Base64.encode(dataURI)
                )
            );
    }

    function compare(string memory str1, string memory str2)
        public
        pure
        returns (bool)
    {
        return
            keccak256(abi.encodePacked(str1)) ==
            keccak256(abi.encodePacked(str2));
    }

    /*=====  End of HELPER  ======*/
}
