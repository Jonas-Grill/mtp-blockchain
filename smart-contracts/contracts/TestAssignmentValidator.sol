// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "../contracts/TestAssignment.sol";

/**
 * Example assignment validator for testing
 */
contract TestAssignmentValidator {
    function validateTestAssignment(
        address _student_address,
        address _contract_address
    ) public returns (bool[] memory) {
        TestAssignment assignment_contract = TestAssignment(_contract_address);

        bool[] memory tests = new bool[](3);

        // Validate Owner
        tests[0] = validateOwner(_student_address, _contract_address);

        // Test 1 - test if default value is 1998
        if (int256(assignment_contract.getTestValue()) == int256(1998)) {
            tests[1] = true;
        } else {
            tests[1] = false;
        }

        // Test 2 - test if setTestValue works
        assignment_contract.setTestValue(int256(2022));

        if (int256(assignment_contract.getTestValue()) == int256(2022)) {
            tests[2] = true;
        } else {
            tests[2] = false;
        }

        return tests;
    }

    function validateOwner(address _student_address, address _contract_address)
        public
        view
        returns (bool)
    {
        TestAssignment assignment_contract = TestAssignment(_contract_address);

        if (assignment_contract.admin() == _student_address) {
            return true;
        } else {
            return false;
        }
    }
}
