// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

/*=============================================
=                 Base Config                 =
=============================================*/

import "../contracts/ConfigStorage.sol";

contract BaseConfig {
    address private configContractAddress;

    function initAdmin(
        address _configContractAddress,
        string memory _contractName
    ) public {
        configContractAddress = _configContractAddress;

        ConfigStorage configContact = getConfigStorage();
        configContact.requireUserAdmin(msg.sender);
        configContact.addContractAdmin(address(this), _contractName);
    }

    function getConfigStorage() public view returns (ConfigStorage) {
        return ConfigStorage(configContractAddress);
    }
}

/*=====            End of Admin        ======*/
