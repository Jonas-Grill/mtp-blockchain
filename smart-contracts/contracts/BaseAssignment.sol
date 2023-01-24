// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

/*=============================================
=                 BaseAssignment                 =
=============================================*/

contract BaseAssignment {
    // METADATA STORAGE
    address public _owner; // Owner of the contract
    uint256 public _blockNumber; // Block number of the contract creation
    address public _validator; // Address of the validator

    // IGNORE
    uint256 private _testBlockNumber; // For test purposes

    constructor(address validator) {
        _owner = msg.sender;
        _blockNumber = block.number;
        _validator = validator;

        // Make sure that the validator address is not default
        require(
            _validator != address(0),
            "Address of Validator Contract is not set"
        );
    }

    // Get owner of the contract
    function getOwner() public view returns (address) {
        return _owner;
    }

    // Get block number of the contract
    function getCreationBlockNumber() public view returns (uint256) {
        return _blockNumber;
    }

    // Get validator contract address
    function getValidator() public view returns (address) {
        return _validator;
    }

    // Get the current block number (for test purposes)
    function getBlockNumber() public view returns (uint256) {
        if (msg.sender == _validator) return _testBlockNumber;
        else return block.number;
    }

    // Set the "current" block number (for test purposes)
    function setBlockNumber(uint256 blockNumber) public {
        require(
            msg.sender == _validator,
            "BaseAssignment: setBlockNumber: Only validator can call this function"
        );

        _blockNumber = blockNumber;
    }
}

/*=====       End of BaseAssignment        ======*/
