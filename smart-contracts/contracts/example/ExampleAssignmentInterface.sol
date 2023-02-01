// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

/**
 * Example assignment interface for testing
 */

import "../IBaseAssignment.sol";

abstract contract ExampleAssignmentInterface is IBaseAssignment {
    function setTestValue(int256 _value) public virtual {}

    function getTestValue() public view virtual returns (int256) {}
}
