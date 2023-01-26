// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

// Import ERC721URIStorage.sol
import "../../node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol";

// Import BaseConfig.sol
import "../../contracts/BaseConfig.sol";

contract Assignment2Coin is ERC20, BaseConfig {
    constructor(
        string memory name,
        string memory symbol,
        address _configContractAddress
    ) ERC20(name, symbol) {
        // Add smart contract to contract admin list with the name SBCoin_<coin_name>
        initAdmin(_configContractAddress, "Assignment2Coin");
    }

    function mint(address _recipient, uint256 _amount) public {
        require(
            getConfigStorage().isAdmin(msg.sender),
            "Assignment2Coin: only admin can burn!"
        );

        _mint(_recipient, _amount);
    }
}
