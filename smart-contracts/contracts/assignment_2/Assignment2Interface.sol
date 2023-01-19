// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

// Import ERC721URIStorage.sol
import "../../node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol";

// Import IERC20.sol
import "../../node_modules/@openzeppelin/contracts/token/ERC20/IERC20.sol";

// Import BaseAssignment.sol
import "../../contracts/BaseAssignment.sol";

// Create contract > define Contract Name
abstract contract Assignment2Interface is ERC20, BaseAssignment {
    // Get token address
    function getTokenAddress() public view virtual returns (address) {}

    // Add Liquidity to the pool
    function addLiquidity(uint256 _tokenAmount)
        public
        payable
        virtual
        returns (uint256)
    {}

    // Remove Liquidity from the pool
    function removeLiquidity(uint256 _amount)
        public
        virtual
        returns (uint256, uint256)
    {}

    // Get the amount of tokens in the pool
    function getTokenAmount(uint256 _ethSold)
        public
        view
        virtual
        returns (uint256)
    {}

    // Get the amount of eth in the pool
    function getEthAmount(uint256 _tokenSold)
        public
        view
        virtual
        returns (uint256)
    {}

    // Exchange ETH for tokens
    function ethToToken(uint256 _minTokens) public payable virtual {}

    // Exchange tokens for ETH
    function tokenToEth(uint256 _tokensSold, uint256 _minEth) public virtual {}

    // Exchange tokens for tokens
    function tokenToTokenSwap(
        uint256 _tokensSold,
        uint256 _minTokensBought,
        address _tokenAddress
    ) public virtual {}
}
