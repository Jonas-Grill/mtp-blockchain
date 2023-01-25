// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

/*=============================================
=                     Admin                   =
=============================================*/

contract BaseConfigAdmin {
    // Address of user admin (e.g., professor, lecturer, etc.)
    address[] private userAdmins;

    struct ContractAdmin {
        string contractName; // Name of contract
        address contractAddress; // Address of contract
        bool isContractAdmin; // Is contract admin
    }

    // Address of contract admins (e.g., validator contract, etc.)
    ContractAdmin[] private contractAdmins;

    constructor(string memory contractName) {
        // Add current msg.sender as admin
        userAdmins.push(msg.sender);

        // Add current contract address(this) as contract admin
        contractAdmins.push(ContractAdmin(contractName, address(this), true));
    }

    // Require that msg.sender is either contract or user admin
    function requireMsgSenderAdmin() public view returns (bool) {
        if (requireAdmin(msg.sender)) return true;
        else return false;
    }

    function requireOriginAdmin() public view returns (bool) {
        if (requireAdmin(tx.origin)) return true;
        if (requireMsgSenderAdmin()) return true;

        revert(
            "Origin or msg.sender is neither an user nor an contract admin!"
        );
    }

    // Require if address is either user or contract admin > with error handling
    function requireAdmin(address possibleAdmin) public view returns (bool) {
        if (isAdmin(possibleAdmin)) return true;
        else revert("Address is neither an user nor an contract admin!");
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
            if (contractAdmins[i].contractAddress == possibleContractAdmin) {
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
            if (contractAdmins[i].contractAddress == possibleContractAdmin) {
                return true;
            }
        }

        return false;
    }

    function isAdmin(address possibleAdmin) public view returns (bool) {
        if (isUserAdmin(possibleAdmin)) return true;
        if (isContractAdmin(possibleAdmin)) return true;

        return false;
    }

    // Add new admin to list
    function addUserAdmin(address userAdmin) public {
        requireOriginAdmin();
        // Only add user admin if not already in list
        if (isUserAdmin(userAdmin) == false) userAdmins.push(userAdmin);
    }

    // Add new admin to list
    function addContractAdmin(address contractAdmin, string memory contractName)
        public
    {
        requireOriginAdmin();
        // Only add user admin if not already in list
        if (isContractAdmin(contractAdmin) == false) {
            contractAdmins.push(
                ContractAdmin(contractName, contractAdmin, true)
            );
        }
    }

    // Remove admin from list
    function removeUserAdmin(address userAdmin) public {
        requireOriginAdmin();
        uint256 i;

        for (i = 0; i < userAdmins.length; i++) {
            if (userAdmins[i] == userAdmin) {
                delete userAdmins[i];
            }
        }
    }

    // Remove admin from list
    function removeContractAdmin(address contractAdmin) public {
        requireOriginAdmin();
        uint256 i;

        for (i = 0; i < contractAdmins.length; i++) {
            if (contractAdmins[i].contractAddress == contractAdmin) {
                delete contractAdmins[i];
                break;
            }
        }
    }

    // Get list of all userAdmins
    function getUserAdmins() public view returns (address[] memory) {
        return userAdmins;
    }

    // Get list of all contractAdmins
    function getContractAdminAddresses()
        public
        view
        returns (address[] memory)
    {
        address[] memory adminAdresses = new address[](contractAdmins.length);

        uint256 i = 0;

        for (i = 0; i < contractAdmins.length; i++) {
            adminAdresses[i] = contractAdmins[i].contractAddress;
        }

        return adminAdresses;
    }

    // Get list of all contractAdmins
    function getContractAdmins() public view returns (ContractAdmin[] memory) {
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
