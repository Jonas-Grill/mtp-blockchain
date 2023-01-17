// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

/**
 * Example assignment for testing
 */

import "../contracts/BaseAssignment.sol";

contract ExampleAssignment2 is BaseAssignment {
    int256 testValue;

    constructor(address validatorAddress) BaseAssignment(validatorAddress) {
        testValue = 1998;
    }

    function setTestValue(int256 _value) public {
        testValue = _value;
    }

    function getTestValue() public view returns (int256) {
        return testValue;
    }
}
