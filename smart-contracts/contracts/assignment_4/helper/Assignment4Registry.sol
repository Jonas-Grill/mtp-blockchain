// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Import IAssignment4.sol
import "../interface/IAssignment4.sol";

// Import BaseConfig.sol
import "../../BaseConfig.sol";

contract Assignment4Registry is BaseConfig {
    // mapping(tokenAddress => exchangeAddress) -> get exchange address by token address
    mapping(address => address) public tokenToExchange;

    event NewExchange(address indexed token, address indexed exchange);

    constructor(address _configContractAddress, address testExchangeAddress) {
        // Add smart contract to contract admin list with the name SBCoin_<coin_name>
        initAdmin(
            _configContractAddress,
            "SS23 Assignment 4 Validator Contract - Registry"
        );

        registerAMM(testExchangeAddress);
    }

    function registerAMM(address _exchangeAddress) public {
        require(_exchangeAddress != address(0), "invalid exchange address");
        require(
            tokenToExchange[_exchangeAddress] == address(0),
            "exchange already registered"
        );

        IAssignment4 exchange = IAssignment4(_exchangeAddress);
        address tokenAddress = exchange.getTokenAddress();

        require(tokenAddress != address(0), "invalid token address");

        tokenToExchange[tokenAddress] = _exchangeAddress;

        emit NewExchange(tokenAddress, _exchangeAddress);
    }

    function getExchange(address _tokenAddress) public view returns (address) {
        return tokenToExchange[_tokenAddress];
    }
}
