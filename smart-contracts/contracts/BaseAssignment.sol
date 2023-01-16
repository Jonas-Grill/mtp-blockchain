// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

/*=============================================
=                 BaseAssignment                 =
=============================================*/

contract BaseAssignment {
    // METADATA STORAGE
    address public _owner; // Owner of the contract
    uint256 public _blockNumber; // Block number of the contract creation
    address public _validatorAddress; // Address of the validator

    constructor(address validatorAddress) {
        _owner = msg.sender;
        _blockNumber = block.number;
        _validatorAddress = validatorAddress;

        // Make sure that the validator address is not default
        require(
            _validatorAddress != address(0),
            "Address of Validator Contract is not set"
        );
    }

    // Get owner of the contract
    function getOwner() public view returns (address) {
        return _owner;
    }

    // Get block number of the contract
    function getBlockNumber() public view returns (uint256) {
        return _blockNumber;
    }

    // Get validator contract address
    function getValidatorAddress() public view returns (address) {
        return _validatorAddress;
    }
}

/*=====       End of BaseAssignment        ======*/
