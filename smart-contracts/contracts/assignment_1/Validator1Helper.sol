// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

// Import the IAssignment1.sol
import "./interface/IAssignment1.sol";

import "../../node_modules/@openzeppelin/contracts/utils/Strings.sol";

// This contract acts as player B
contract Validator1Helper {
    constructor() {}

    // Function to receive Ether. msg.data must be empty
    receive() external payable {}

    // Fallback function is called when msg.data is not empty
    fallback() external payable {}

    // This should fail, because not correct owner
    function burnTestD(IAssignment1 assingmentContract, uint256 tokenId)
        public
        payable
    {
        assingmentContract.burn{value: msg.value}(tokenId);
    }

    // This should fail, because not correct owner
    function withdrawTestF(IAssignment1 assingmentContract) public payable {
        assingmentContract.withdraw(address(assingmentContract).balance);
    }
}
