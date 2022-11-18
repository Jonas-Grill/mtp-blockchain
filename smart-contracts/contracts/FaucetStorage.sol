// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract FaucetStorage {
    // Keep struct to allow extending to more than one value
    struct faucetUser {
        // Block number when faucet last used
        uint256 blockNo;
    }

    // Mapping to store when user last used faucet
    mapping(address => faucetUser) Users;

    // Address of admin
    address admin;

    // Create event when faucet is used
    event faucetUsed(address _address, uint256 _blockNo);

    constructor() {
        admin = msg.sender;
    }

    /*=============================================
    =                     Admin                   =
    =============================================*/

    // Change Admin account
    function setAdmin(address _newAdmin) public {
        require(
            msg.sender == admin,
            "Permission denied! The address is not allowed to executes this smart contract function!"
        );

        admin = _newAdmin;
    }

    // Get Admin address
    function getAdmin() public view returns (address) {
        return admin;
    }

    /*=====            End of Admin        ======*/

    /*=============================================
    =               Faucet Methods                =
    =============================================*/

    function addFaucetUsage(address _address, uint256 _blockNo) public {
        require(
            msg.sender == admin,
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

    /*=====     End of Faucet Methods      ======*/
}
