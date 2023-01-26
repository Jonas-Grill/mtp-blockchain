// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

// Import the Validator1Interface.sol
import "../assignment_1/Validator1Interface.sol";

import "../../node_modules/@openzeppelin/contracts/utils/Strings.sol";

// This contract acts as player B
contract Validator1Helper {
    constructor() {}

    // Function to receive Ether. msg.data must be empty
    receive() external payable {}

    // Fallback function is called when msg.data is not empty
    fallback() external payable {}

    // This should fail, because not correct owner
    function burnTestD(Validator1Interface assingmentContract, uint256 tokenId)
        public
        payable
    {
        assingmentContract.burn{value: msg.value}(tokenId);
    }

    // This should fail, because not correct owner
    function withdrawTestF(Validator1Interface assingmentContract)
        public
        payable
    {
        assingmentContract.withdraw(payable(address(this)));
    }
}
