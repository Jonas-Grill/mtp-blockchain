// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

/*=============================================
=                     Admin                   =
=============================================*/

contract BaseAdmin {
    // Address of admin
    address[] private admins;

    constructor() {
        addAdmin(msg.sender);
    }

    // Require if admin with error handling
    function requireAdmin(address possibleAdmin) public view returns (bool) {
        uint256 i;

        for (i = 0; i < admins.length; i++) {
            if (admins[i] == possibleAdmin) {
                return true;
            }
        }

        revert(
            "Address that deploys this smart contract is not the coinbase address!"
        );
    }

    // Check if admin
    function isAdmin(address possibleAdmin) public view returns (bool) {
        uint256 i;

        for (i = 0; i < admins.length; i++) {
            if (admins[i] == possibleAdmin) {
                return true;
            }
        }

        return false;
    }

    // Add new admin to list
    function addAdmin(address admin) public {
        // Only add admin if not already in list
        if (isAdmin(admin) == false) admins.push(admin);
    }

    // Remove admin from list
    function removeAdmin(address admin) public {
        uint256 i;

        for (i = 0; i < admins.length; i++) {
            if (admins[i] == admin) {
                delete admins[i];
            }
        }
    }

    // Get list of all admins
    function getAdmins() public view returns (address[] memory) {
        return admins;
    }

    // Get list of admins
    function getLength() public view returns (uint256) {
        return admins.length;
    }
}

/*=====            End of Admin        ======*/
