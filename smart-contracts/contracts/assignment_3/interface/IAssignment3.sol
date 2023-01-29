// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

// Import BaseAssignment.sol
import "../../IBaseAssignment.sol";

// Create contract > define Contract Name
abstract contract IAssignment3 is IBaseAssignment {
    // Get current state
    function getState() public view virtual returns (string memory) {}

    // Get game counter
    function getGameCounter() public view virtual returns (uint256) {}

    // Start game
    function start() public payable virtual returns (uint256) {}

    // Play game
    function play(string memory choice) public virtual {}

    // Play private
    function playPrivate(bytes32 hashedChoice) public virtual {}

    // Reveal private play
    function reveal(string memory plainChoice, string memory seed)
        public
        virtual
    {}

    // Set max time
    function setMaxTime(string memory action, uint256 maxTime) public virtual {}

    // Check max time
    function checkMaxTime() public virtual returns (bool) {}

    // Force reset the game
    function forceReset() public virtual {}
}
