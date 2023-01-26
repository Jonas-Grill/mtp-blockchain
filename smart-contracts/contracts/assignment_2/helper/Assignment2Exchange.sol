// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../../../node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "../../../node_modules/@openzeppelin/contracts/token/ERC20/IERC20.sol";

// Import BaseConfig.sol
import "../../BaseConfig.sol";

// Import the registry contract
import "./Assignment2Registry.sol";

contract Assignment2Exchange is ERC20, BaseConfig {
    address public tokenAddress;
    address public registryAddress;

    event TokenBought(
        address indexed buyer,
        uint256 indexed ethSold,
        uint256 indexed tokensBought
    );
    event EthBought(
        address indexed buyer,
        uint256 indexed ethBought,
        uint256 indexed tokensSold
    );
    event LiquidityAdded(
        address indexed provider,
        uint256 indexed ethAmount,
        uint256 indexed tokenAmount
    );
    event LiquidityRemoved(
        address indexed provider,
        uint256 indexed ethAmount,
        uint256 indexed tokenAmount
    );

    constructor(address _token, address _configContractAddress)
        payable
        ERC20("Assignment 2 Exchange", "A2E")
    {
        initAdmin(
            _configContractAddress,
            "SS23 Assignment 2 Validator Contract - Exchange"
        );

        require(
            _token != address(0),
            "Assignment 2 Registry: invalid token address"
        );
        tokenAddress = _token;
        registryAddress = msg.sender;
    }

    function getTokenAddress() public view returns (address) {
        return tokenAddress;
    }

    function addLiquidity(uint256 _tokenAmount)
        public
        payable
        returns (uint256)
    {
        uint256 liquidity;
        uint256 ethBalance = address(this).balance;
        uint256 tokenReserve = getReserve();

        IERC20 token = IERC20(tokenAddress);

        if (tokenReserve == 0) {
            liquidity = ethBalance;
            token.transferFrom(msg.sender, address(this), _tokenAmount);
            _mint(msg.sender, liquidity);
        } else {
            uint256 ethReserve = ethBalance - msg.value;
            uint256 tokenAmount = (msg.value * tokenReserve) / ethReserve;
            require(
                _tokenAmount >= tokenAmount,
                "Assignment 2 Registry: insufficient token amount"
            );

            // Calculate the liquidity
            liquidity = (totalSupply() * msg.value) / ethReserve;

            // Transfer the tokens to the exchange
            token.transferFrom(msg.sender, address(this), tokenAmount);
            _mint(msg.sender, liquidity);
        }

        emit LiquidityAdded(msg.sender, msg.value, _tokenAmount);

        return liquidity;
    }

    function removeLiquidity(uint256 _amount)
        public
        payable
        returns (uint256, uint256)
    {
        require(_amount > 0, "Assignment 2 Registry: invalid amount");

        uint256 ethReserve = address(this).balance;

        require(ethReserve > 0, "Assignment 2 Registry: Eth amount is 0");

        uint256 supply = totalSupply();
        uint256 ethAmount = (ethReserve * _amount) / supply;
        uint256 tokenAmount = (getReserve() * _amount) / supply;

        // Burn the liquidity tokens
        _burn(msg.sender, _amount);

        // Transfer the ETH and tokens to the user
        payable(msg.sender).transfer(ethAmount);

        // Transfer the tokens to the user
        IERC20(tokenAddress).approve(msg.sender, tokenAmount);
        IERC20(tokenAddress).transfer(msg.sender, tokenAmount);

        emit LiquidityRemoved(msg.sender, ethAmount, tokenAmount);

        return (ethAmount, tokenAmount);
    }

    function getReserve() public view returns (uint256) {
        return IERC20(tokenAddress).balanceOf(address(this));
    }

    function getAmount(
        uint256 inputAmount,
        uint256 inputReserve,
        uint256 outputReserve
    ) private pure returns (uint256) {
        require(
            inputReserve > 0 && outputReserve > 0,
            "Assignment 2 Registry: invalid reserves"
        );

        uint256 inputAmountWithFee = inputAmount * 99;
        uint256 numerator = inputAmountWithFee * outputReserve;
        uint256 denominator = (inputReserve * 100) + inputAmountWithFee;

        return numerator / denominator;
    }

    function getTokenAmount(uint256 _ethSold) public view returns (uint256) {
        require(_ethSold > 0, "Assignment 2 Registry: ethSold cannot be zero");
        uint256 tokenReserve = getReserve();
        return getAmount(_ethSold, address(this).balance, tokenReserve);
    }

    function getEthAmount(uint256 _tokenSold) public view returns (uint256) {
        require(
            _tokenSold > 0,
            "Assignment 2 Registry: tokenSold cannot be zero"
        );
        uint256 tokenReserve = getReserve();
        return getAmount(_tokenSold, tokenReserve, address(this).balance);
    }

    function ethToTokenTransfer(uint256 _minTokens, address recipient)
        public
        payable
    {
        uint256 tokenReserve = getReserve();
        uint256 tokensBought = getAmount(
            msg.value,
            address(this).balance - msg.value,
            tokenReserve
        );

        require(
            tokensBought >= _minTokens,
            "Assignment 2 Registry: insufficient output amount"
        );
        IERC20(tokenAddress).approve(recipient, tokensBought);
        IERC20(tokenAddress).transfer(recipient, tokensBought);

        emit TokenBought(msg.sender, msg.value, tokensBought);
    }

    function ethToToken(uint256 _minTokens) public payable {
        ethToTokenTransfer(_minTokens, msg.sender);
    }

    function tokenToEth(uint256 _tokensSold, uint256 _minEth) public {
        uint256 tokenReserve = getReserve();
        uint256 ethBought = getAmount(
            _tokensSold,
            address(this).balance,
            tokenReserve
        );

        require(
            ethBought >= _minEth,
            "Assignment 2 Registry: insufficient output amount"
        );

        IERC20(tokenAddress).transferFrom(
            msg.sender,
            address(this),
            _tokensSold
        );
        payable(msg.sender).transfer(ethBought);

        emit EthBought(msg.sender, ethBought, _tokensSold);
    }

    function tokenToTokenSwap(
        uint256 _tokensSold,
        uint256 _minTokensBought,
        address _tokenAddress
    ) public {
        address exchangeAddress = Assignment2Registry(registryAddress)
            .getExchange(_tokenAddress);

        require(
            exchangeAddress != address(this) && exchangeAddress != address(0),
            "Assignment 2 Registry: invalid exchange address"
        );

        uint256 tokenReserve = getReserve();
        uint256 ethBought = getAmount(
            _tokensSold,
            tokenReserve,
            address(this).balance
        );

        IERC20(tokenAddress).transferFrom(
            msg.sender,
            address(this),
            _tokensSold
        );

        Assignment2Exchange(exchangeAddress).ethToTokenTransfer{
            value: ethBought
        }(_minTokensBought, msg.sender);
    }

    // Donate Ether to the contract
    function donateEther() public payable {
        require(msg.value > 0, "Assignment 2 Registry: invalid amount");
    }
}
