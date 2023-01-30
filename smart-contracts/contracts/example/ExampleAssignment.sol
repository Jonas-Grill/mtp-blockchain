// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

/**
 * Example assignment for testing
 */

import "./BaseAssignment.sol";

contract ExampleAssignment is BaseAssignment {
    int256 testValue;

    constructor(address validator) BaseAssignment(validator) {
        testValue = 1998;
    }

    function setTestValue(int256 _value) public {
        testValue = _value;
    }

    function getTestValue() public view returns (int256) {
        return testValue;
    }
}
