// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

// Import the Assignment1Interface.sol
import "../assignment_1/Assignment1Interface.sol";

// Import the base assignment validator contract
import "../../contracts/BaseAssignmentValidator.sol";

import "../../node_modules/@openzeppelin/contracts/utils/Base64.sol";
import "../../node_modules/@openzeppelin/contracts/utils/Strings.sol";

// Give the contract a name and inherit from the base assignment validator
contract Assignment1Validator is BaseAssignmentValidator {
    using Strings for uint256;

    // Import empty constructor and pass the name of the contract to the config storage contract
    constructor(address _configContractAddress)
        BaseAssignmentValidator(_configContractAddress, "Assignment1Validator")
    {
        // The constructor is empty
    }

    // Test the assignment
    function test(address _contractAddress)
        public
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
        testExerciseA(historyIndex, assignment_contract);

        /*----------  EXERCISE B  ----------*/

        testExerciseB(historyIndex, assignment_contract);

        /*----------  EXERCISE C  ----------*/

        testExerciseC(historyIndex, assignment_contract);

        /*----------  EXERCISE D  ----------*/

        testExerciseD(historyIndex, assignment_contract);

        /*----------  EXERCISE E  ----------*/

        testExerciseE(historyIndex, assignment_contract);

        /*----------  EXERCISE F  ----------*/

        testExerciseF(historyIndex, assignment_contract);

        // Return the history index
        return historyIndex;
    }

    function testExerciseA(
        uint256 historyIndex,
        Assignment1Interface assignment_contract
    ) public {
        /*----------  EXERCISE A  ----------*/

        // Total supply before minting
        uint256 totalSupplyBefore = assignment_contract.getTotalSupply();

        // Total nft of msg.sender
        uint256 balanceBefore = assignment_contract.balanceOf(address(this));

        // mint a nft and send to _address and pay 0.01 ether
        uint256 id_a = assignment_contract.mint{value: 0.01 ether}(
            address(this)
        );

        uint256 exerciseAPassedCounter = 0;

        // Check if id is larger than 0
        if (id_a > 0) {
            exerciseAPassedCounter++;
        }

        // Check if the total supply is increased by 1
        if (assignment_contract.getTotalSupply() == totalSupplyBefore + 1) {
            exerciseAPassedCounter++;
        }

        // Make sure NFT of token id is owned by the current msg.sender
        if (assignment_contract.ownerOf(id_a) == address(this)) {
            exerciseAPassedCounter++;
        }

        // Make sure the balance of the current msg.sender is increased by 1
        if (assignment_contract.balanceOf(address(this)) == balanceBefore + 1) {
            exerciseAPassedCounter++;
        }

        // If exerciseAPassedCounter == 4 --> exercise A passed
        if (exerciseAPassedCounter == 4) {
            appendTestResult(historyIndex, "Exercise A", true, 5);
        } else {
            // If not all tests passed, mark test as failed
            appendTestResult(historyIndex, "Exercise A", false, 0);
        }
    }

    function testExerciseB(
        uint256 historyIndex,
        Assignment1Interface assignment_contract
    ) public {
        /*----------  EXERCISE B  ----------*/

        // mint a nft and send to _address and pay 0.01 ether
        uint256 id_b = assignment_contract.mint{value: 0.01 ether}(
            address(this)
        );

        string memory tokenURI = assignment_contract.tokenURI(id_b);
        string memory expectedTokenURI = getTokenURI(
            id_b,
            assignment_contract.getIPFSHash(),
            assignment_contract.getOwner(),
            address(this)
        );

        // Check if tokenURI equals to expectedTokenURI
        if (compare(tokenURI, expectedTokenURI) == true) {
            appendTestResult(historyIndex, "Exercise B", true, 1);
        } else {
            // If not all tests passed, mark test as failed
            appendTestResult(historyIndex, "Exercise B", false, 0);
        }
    }

    function testExerciseC(
        uint256 historyIndex,
        Assignment1Interface assignment_contract
    ) public {
        /*----------  EXERCISE C  ----------*/

        uint256 oldPriceC = assignment_contract.getPrice();

        // mint a nft and send to _address and pay 0.01 ether
        assignment_contract.mint{value: 0.01 ether}(address(this));

        uint256 newPriceC = assignment_contract.getPrice();

        if (newPriceC == oldPriceC + 0.0001 ether) {
            appendTestResult(historyIndex, "Exercise C", true, 1);
        } else {
            // If not all tests passed, mark test as failed
            appendTestResult(historyIndex, "Exercise C", false, 0);
        }
    }

    function testExerciseD(
        uint256 historyIndex,
        Assignment1Interface assignment_contract
    ) public {
        /*----------  EXERCISE D  ----------*/

        uint256 oldPriceD = assignment_contract.getPrice();

        // mint a nft and send to _address and pay 0.01 ether
        uint256 idD = assignment_contract.mint{value: 0.01 ether}(
            address(this)
        );

        // get balance of the address(this)
        uint256 balanceBeforeD = assignment_contract.balanceOf(address(this));

        // burn the nft
        assignment_contract.burn{value: 0.0001 ether}(idD);

        // get balance of the address(this)
        uint256 balanceAfterD = assignment_contract.balanceOf(address(this));

        uint256 exerciseDPassedCounter = 0;

        // check if balance of address(this) is decreased by 1
        if (balanceAfterD == balanceBeforeD - 1) {
            exerciseDPassedCounter++;
        }

        // get new price
        uint256 newPriceD = assignment_contract.getPrice();

        // check if price is decreased by 0.0001 ether
        if (newPriceD == oldPriceD - 0.0001 ether) {
            exerciseDPassedCounter++;
        }

        // if exerciseDPassedCounter == 2 --> exercise D passed
        if (exerciseDPassedCounter == 2) {
            appendTestResult(historyIndex, "Exercise D", true, 1);
        } else {
            // If not all tests passed, mark test as failed
            appendTestResult(historyIndex, "Exercise D", false, 0);
        }
    }

    function testExerciseE(
        uint256 historyIndex,
        Assignment1Interface assignment_contract
    ) public {
        /*----------  EXERCISE E  ----------*/

        // Set sale status to false
        if (assignment_contract.getSaleStatus() == true) {
            // flip the sale status
            assignment_contract.flipSaleStatus();
        }

        uint256 exerciseEPassedCounter = 0;

        try
            assignment_contract.mint{value: 0.01 ether}(address(this))
        {} catch {
            exerciseEPassedCounter++;
        }

        // if exerciseEPassedCounter == 1 --> exercise E passed
        if (exerciseEPassedCounter == 1) {
            appendTestResult(historyIndex, "Exercise E", true, 1);
        } else {
            // If not all tests passed, mark test as failed
            appendTestResult(historyIndex, "Exercise E", false, 0);
        }
    }

    function testExerciseF(
        uint256 historyIndex,
        Assignment1Interface assignment_contract
    ) public {
        /*----------  EXERCISE F  ----------*/

        // get ether balance of owner
        uint256 ownerBalanceBeforeF = address(this).balance;

        // withdraw funds to owner
        assignment_contract.withdraw(payable(assignment_contract.getOwner()));

        // get ether balance of owner
        uint256 ownerBalanceAfterF = address(this).balance;

        if (ownerBalanceAfterF > ownerBalanceBeforeF) {
            appendTestResult(historyIndex, "Exercise F", true, 1);
        } else {
            // If not all tests passed, mark test as failed
            appendTestResult(historyIndex, "Exercise F", false, 0);
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
