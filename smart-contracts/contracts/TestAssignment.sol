// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

/**
 * Example assignment for testing
 */

import "../contracts/TestAssignmentInterface.sol";

contract TestAssignment is TestAssignmentInterface {
    int256 testValue;

    constructor() {
        testValue = 1998;
    }

    function setTestValue(int256 _value) public override {
        testValue = _value;
    }

    function getTestValue() public view override returns (int256) {
        return testValue;
    }
}
