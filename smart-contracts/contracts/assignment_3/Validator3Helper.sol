// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

// Import the Assignment1Interface.sol
import "../assignment_3/Validator3Interface.sol";

import "../../node_modules/@openzeppelin/contracts/utils/Strings.sol";

// This contract acts as player B
contract Validator3Helper {
    constructor() {}

    // Function to receive Ether. msg.data must be empty
    receive() external payable {}

    // Fallback function is called when msg.data is not empty
    fallback() external payable {}

    // Start function
    function callStart(Validator3Interface assignmentContract)
        public
        payable
        returns (uint256)
    {
        return assignmentContract.start{value: msg.value}();
    }

    function callPlay(
        Validator3Interface assignmentContract,
        string memory choice
    ) public payable {
        assignmentContract.play(choice);
    }

    function callPlayPrivate(
        Validator3Interface assignmentContract,
        bytes32 hashedChoice
    ) public payable {
        assignmentContract.playPrivate(hashedChoice);
    }

    function callReveal(
        Validator3Interface assignmentContract,
        string memory plainChoice,
        string memory seed
    ) public payable {
        assignmentContract.reveal(plainChoice, seed);
    }
}
