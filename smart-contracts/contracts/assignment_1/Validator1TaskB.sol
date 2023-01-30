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
contract Validator1TaskB is Helper, BaseConfig {
    using Strings for uint256;

    // assignment contract interface
    IAssignment1 assignmentContract;
    Validator1Helper validator1Helper;

    constructor(address _configContractAddress) {
        initAdmin(
            _configContractAddress,
            "SS23 Assignment 1 Validator Contract - Task B"
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

    function testExerciseB() public payable returns (string memory, bool) {
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
