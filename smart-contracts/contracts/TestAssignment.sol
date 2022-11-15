// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

/**
 * Example assignment for testing
 */
contract TestAssignment {
    int256 testValue;

    address public owner;

    constructor() {
        owner = msg.sender;

        testValue = 1998;
    }

    function setTestValue(int256 _value) public {
        testValue = _value;
    }

    function getTestValue() public view returns (int256) {
        return testValue;
    }
}
