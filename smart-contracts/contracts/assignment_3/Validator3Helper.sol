// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

// Import the IAssignment3.sol
import "./interface/IAssignment3.sol";

import "../../node_modules/@openzeppelin/contracts/utils/Strings.sol";

// This contract acts as player B
contract Validator3Helper {
    constructor() {}

    // Function to receive Ether. msg.data must be empty
    receive() external payable {}

    // Fallback function is called when msg.data is not empty
    fallback() external payable {}

    // Start function
    function callStart(IAssignment3 assignmentContract)
        public
        payable
        returns (uint256)
    {
        return assignmentContract.start{value: msg.value}();
    }

    function callPlay(IAssignment3 assignmentContract, string memory choice)
        public
        payable
    {
        assignmentContract.play(choice);
    }

    function callPlayPrivate(
        IAssignment3 assignmentContract,
        bytes32 hashedChoice
    ) public payable {
        assignmentContract.playPrivate(hashedChoice);
    }

    function callReveal(
        IAssignment3 assignmentContract,
        string memory plainChoice,
        string memory seed
    ) public payable {
        assignmentContract.reveal(plainChoice, seed);
    }
}
