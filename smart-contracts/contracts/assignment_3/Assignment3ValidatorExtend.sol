// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

// Import the Assignment1Interface.sol
import "../assignment_3/Assignment3Interface.sol";

import "../../node_modules/@openzeppelin/contracts/utils/Strings.sol";

// This contract acts as player B
contract Assignment3ValidatorExtend {
    // assignment contract interface
    Assignment3Interface assignmentContract;

    constructor() {}

    receive() external payable {}

    // Init contract
    function initContract(address _contractAddress) public {
        // Call the contract interface which needs to be tested and store it in the variable assignmentContract
        assignmentContract = Assignment3Interface(_contractAddress);
    }

    // Start function
    function callStart() public payable returns (uint256) {
        return assignmentContract.start{value: msg.value}();
    }

    function callPlay(string memory choice) public {
        assignmentContract.play(choice);
    }

    function callPlayPrivate(string memory hashedChoice) public {
        assignmentContract.playPrivate(hashedChoice);
    }

    function callReveal(string memory plainChoice, string memory seed) public {
        assignmentContract.reveal(plainChoice, seed);
    }
}
