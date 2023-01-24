// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

/**
 * Example assignment interface for testing
 */

import "../../contracts/BaseAssignment.sol";

abstract contract ExampleAssignmentInterface is BaseAssignment {
    function setTestValue(int256 _value) public virtual {}

    function getTestValue() public view virtual returns (int256) {}
}
