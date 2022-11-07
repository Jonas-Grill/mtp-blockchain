// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract FaucetStorage {
    // Keep struct to allow extending to more than one value
    struct faucetUser {
        // Block number when faucet last used
        uint256 blockNo;
    }

    mapping(address => faucetUser) Users;

    address owner;

    event faucetUsed(address _address, uint256 _blockNo);

    /**
     * constructor method setting an initial value
     */
    constructor() {
        owner = msg.sender;
    }

    /**
        Add usage of faucet
        todo: restrict so that only the coinbase holder can call this function
     */
    function addFaucetUsage(address _address, uint256 _blockNo) public {
        require(
            msg.sender == owner,
            "Address that deploys this smart contract is not the coinbase address!"
        );

        faucetUser memory obj = faucetUser(_blockNo);

        Users[_address] = obj;

        emit faucetUsed(_address, _blockNo);
    }

    function getFaucetUsage(address _address)
        public
        view
        returns (faucetUser memory)
    {
        return Users[_address];
    }
}
