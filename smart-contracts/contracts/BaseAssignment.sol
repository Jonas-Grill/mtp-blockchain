// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

/*=============================================
=                 BaseAssignment                 =
=============================================*/

contract BaseAssignment {
    // METADATA STORAGE
    address public _owner; // Owner of the contract
    uint256 public _blockNumber; // Block number of the contract creation

    constructor() {
        _owner = msg.sender;
        _blockNumber = block.number;
    }

    // Get owner of the contract
    function getOwner() public view returns (address) {
        return _owner;
    }

    // Get block number of the contract
    function getBlockNumber() public view returns (uint256) {
        return _blockNumber;
    }
}

/*=====       End of BaseAssignment        ======*/
