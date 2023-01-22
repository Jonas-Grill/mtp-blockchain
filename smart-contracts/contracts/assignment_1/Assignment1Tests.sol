// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

// Import the Assignment1Interface.sol
import "../assignment_1/Assignment1Interface.sol";

import "../../node_modules/@openzeppelin/contracts/utils/Base64.sol";
import "../../node_modules/@openzeppelin/contracts/utils/Strings.sol";

// Give the contract a name and inherit from the base assignment validator
contract Assignment1Tests {
    using Strings for uint256;

    constructor() {}

    function testExerciseA(Assignment1Interface assignmentContract)
        public
        payable
        returns (string memory, bool)
    {
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

    function testExerciseB(Assignment1Interface assignmentContract)
        public
        payable
        returns (string memory, bool)
    {
        /*----------  EXERCISE B  ----------*/

        // mint a nft and send to _address and pay 0.01 ether
        try assignmentContract.mint{value: 0.01 ether}(msg.sender) returns (
            uint256 id_b
        ) {
            if (id_b > 0) {
                string memory tokenURI = assignmentContract.tokenURI(id_b);
                string memory expectedTokenURI = getTokenURI(
                    id_b,
                    assignmentContract.getIPFSHash(),
                    assignmentContract.getOwner(),
                    msg.sender
                );

                // Check if tokenURI equals to expectedTokenURI
                if (compare(tokenURI, expectedTokenURI) == true) {
                    return ("Passed (Exercise B): Exercise B passed!", true);
                } else {
                    return (
                        string(
                            abi.encodePacked(
                                "Error (Exercise B): TokenURI not correct got: ",
                                tokenURI,
                                " expected: ",
                                expectedTokenURI
                            )
                        ),
                        false
                    );
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

    function testExerciseC(Assignment1Interface assignmentContract)
        public
        payable
        returns (string memory, bool)
    {
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

    // This should fail, because not correct owner
    function burnTestD(Assignment1Interface assingmentContract, uint256 tokenId)
        public
        payable
    {
        assingmentContract.burn(tokenId);
    }

    // This should fail, because not correct owner
    function withdrawTestF(Assignment1Interface assingmentContract)
        public
        payable
    {
        assingmentContract.withdraw(payable(address(this)));
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
