// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Import Assignment2Interface.sol
import "../assignment_2/Assignment2Interface.sol";

// Import BaseConfig.sol
import "../../contracts/BaseConfig.sol";

contract Assignment2Registry is BaseConfig {
    // mapping(tokenAddress => exchangeAddress) -> get exchange address by token address
    mapping(address => address) public tokenToExchange;

    event NewExchange(address indexed token, address indexed exchange);

    constructor(address _configContractAddress, address testExchangeAddress) {
        // Add smart contract to contract admin list with the name SBCoin_<coin_name>
        initAdmin(_configContractAddress, "Assignment2Registry");

        registerAMM(testExchangeAddress);
    }

    function registerAMM(address _exchangeAddress) public {
        require(_exchangeAddress != address(0), "invalid exchange address");
        require(
            tokenToExchange[_exchangeAddress] == address(0),
            "exchange already registered"
        );

        Assignment2Interface exchange = Assignment2Interface(_exchangeAddress);
        address tokenAddress = exchange.getTokenAddress();

        require(tokenAddress != address(0), "invalid token address");

        tokenToExchange[tokenAddress] = _exchangeAddress;

        emit NewExchange(tokenAddress, _exchangeAddress);
    }

    function getExchange(address _tokenAddress) public view returns (address) {
        return tokenToExchange[_tokenAddress];
    }
}
