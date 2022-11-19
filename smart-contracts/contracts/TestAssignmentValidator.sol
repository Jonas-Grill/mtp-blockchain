// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "../contracts/TestAssignment.sol";
import "../contracts/AssignmentHelper.sol";

/**
 * Example assignment validator for testing
 */
contract TestAssignmentValidator is AssignmentHelper {
    function validateTestAssignment(
        address _studentAddress,
        address _contractAddress
    ) public override(AssignmentHelper) returns (uint256) {
        uint256 historyIndex = createTestHistory(
            _studentAddress,
            _contractAddress
        );

        TestAssignment assignment_contract = TestAssignment(_contractAddress);

        // "Is contract from the student"
        appendTestResult(
            historyIndex,
            "Is contract from the student",
            checkAssignmentOwner(_studentAddress, _contractAddress)
        );

        // Test 1 - test if default value is 1998
        if (int256(assignment_contract.getTestValue()) == int256(1998)) {
            appendTestResult(
                historyIndex,
                "test if default value is 1998",
                true
            );
        } else {
            appendTestResult(
                historyIndex,
                "test if default value is 1998",
                false
            );
        }

        // Test 2 - test if setTestValue works
        assignment_contract.setTestValue(int256(2022));

        if (int256(assignment_contract.getTestValue()) == int256(2022)) {
            appendTestResult(historyIndex, "test if setTestValue works", true);
        } else {
            appendTestResult(historyIndex, "test if setTestValue works", false);
        }

        return historyIndex;
    }
}
