// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

// Import ERC721URIStorage.sol
import "https://github.com/OpenZeppelin/openzeppelin-contracts/tree/v4.8.1/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

// Import BaseAssignment.sol
import "../../contracts/BaseAssignment.sol";

// Create contract > define Contract Name
abstract contract Assignment1Interface is ERC721URIStorage, BaseAssignment {
    // mint a nft and send to _address
    function mint(address _address) public payable virtual returns (uint256) {}

    // burn a nft
    function burn(uint256 tokenId) public payable virtual {}

    // flip sale status
    function flipSaleStatus() public virtual {}

    // get sale status
    function getSaleStatus() public view virtual returns (bool) {}

    // withdraw all funds to owner
    function withdraw(address payable recipient) public virtual {}

    // get current price
    function getPrice() public view virtual returns (uint256) {}

    // get total supply
    function getTotalSupply() public view virtual returns (uint256) {}

    // get IPFS hash
    function getIPFSHash() public view virtual returns (string memory) {}
}
