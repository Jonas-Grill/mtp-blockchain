// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

/*=============================================
=                     Admin                   =
=============================================*/

contract BaseConfigAdmin {
    // Address of user admin (e.g., professor, lecturer, etc.)
    address[] private userAdmins;

    // Address of contract admins (e.g., validator contract, etc.)
    address[] private contractAdmins;

    function initAdmin() public {
        addUserAdmin(msg.sender);
        addContractAdmin(address(this));
    }

    // Require if address of user is admin > with error handling
    function requireUserAdmin(address possibleUserAdmin)
        public
        view
        returns (bool)
    {
        uint256 i;

        for (i = 0; i < userAdmins.length; i++) {
            if (userAdmins[i] == possibleUserAdmin) {
                return true;
            }
        }

        revert(
            "Address that calls this smart contract function is not an admin!"
        );
    }

    // Require if address of contract is admin > with error handling
    function requireContractAdmin(address possibleContractAdmin)
        public
        view
        returns (bool)
    {
        uint256 i;

        for (i = 0; i < contractAdmins.length; i++) {
            if (contractAdmins[i] == possibleContractAdmin) {
                return true;
            }
        }

        revert(
            "Address of the smart contract that calls this function is not an contract admin!"
        );
    }

    // Check if user is admin
    function isUserAdmin(address possibleUserAdmin) public view returns (bool) {
        uint256 i;

        for (i = 0; i < userAdmins.length; i++) {
            if (userAdmins[i] == possibleUserAdmin) {
                return true;
            }
        }

        return false;
    }

    // Check if contract is admin
    function isContractAdmin(address possibleContractAdmin)
        public
        view
        returns (bool)
    {
        uint256 i;

        for (i = 0; i < contractAdmins.length; i++) {
            if (contractAdmins[i] == possibleContractAdmin) {
                return true;
            }
        }

        return false;
    }

    // Add new admin to list
    function addUserAdmin(address userAdmin) public {
        // Only add user admin if not already in list
        if (isUserAdmin(userAdmin) == false) userAdmins.push(userAdmin);
    }

    // Add new admin to list
    function addContractAdmin(address contractAdmin) public {
        // Only add user admin if not already in list
        if (isContractAdmin(contractAdmin) == false)
            contractAdmins.push(contractAdmin);
    }

    // Remove admin from list
    function removeUserAdmin(address userAdmin) public {
        uint256 i;

        for (i = 0; i < userAdmins.length; i++) {
            if (userAdmins[i] == userAdmin) {
                delete userAdmins[i];
            }
        }
    }

    // Remove admin from list
    function removeContractAdmin(address conractAdmin) public {
        uint256 i;

        for (i = 0; i < contractAdmins.length; i++) {
            if (contractAdmins[i] == conractAdmin) {
                delete contractAdmins[i];
            }
        }
    }

    // Get list of all userAdmins
    function getUserAdmins() public view returns (address[] memory) {
        return userAdmins;
    }

    // Get list of all contractAdmins
    function getContractAdmins() public view returns (address[] memory) {
        return contractAdmins;
    }

    // Get length of userAdmins
    function getUserAdminsLength() public view returns (uint256) {
        return userAdmins.length;
    }

    // Get length of contractAdmins
    function getContractAdminsLength() public view returns (uint256) {
        return contractAdmins.length;
    }
}

/*=====            End of Admin        ======*/
