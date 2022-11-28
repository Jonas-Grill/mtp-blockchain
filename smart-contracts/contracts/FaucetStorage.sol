// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "../contracts/AdminHelper.sol";

contract FaucetStorage is AdminHelper {
    // Keep struct to allow extending to more than one value
    struct faucetUser {
        // Block number when faucet last used
        uint256 blockNo;
    }

    // Mapping to store when user last used faucet
    mapping(address => faucetUser) Users;

    // Create event when faucet is used
    event faucetUsed(address _address, uint256 _blockNo);

    constructor() {
        addAdmin(msg.sender);
    }

    /*=============================================
    =               Faucet Methods                =
    =============================================*/

    function addFaucetUsage(address _address, uint256 _blockNo) public {
        requireAdmin(msg.sender);

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
