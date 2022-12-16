// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

/*=============================================
=                Assignment Helper            =
=============================================*/

import "../contracts/BaseConfig.sol";
import "../contracts/BaseAssignment.sol";

contract BaseAssignmentValidator is BaseConfig {
    struct Test {
        // Name of test
        string testName;
        // Test result
        bool testPassed;
    }

    struct TestHistory {
        // studentAddress
        address studentAddress;
        // contractAddress
        address contractAddress;
        // test
        Test[] test;
    }

    // Test history
    uint256 private _testHistoryCounter;
    mapping(uint256 => TestHistory) _testHistory;

    // Submitted assignments (student_address => true)
    mapping(address => bool) _assignmentSubmitted;

    constructor(address _configContractAddress) {
        initAdmin(_configContractAddress);

        _testHistoryCounter = 0;
    }

    /*=============================================
    =            Validate and Submit            =
    =============================================*/

    // abstract validate test function
    function validateTestAssignment(
        address _studentAddress,
        address _contractAddress
    ) public virtual returns (uint256) {}

    // Submit assignment
    function submitAssignment(address _studentAddress, address _contractAddress)
        public
    {
        require(
            _assignmentSubmitted[_studentAddress] != true,
            "Assignment already submitted! Cannot submit the assignment again!"
        );

        uint256 historyIndex = validateTestAssignment(
            _studentAddress,
            _contractAddress
        );

        uint256 knowledgeCoins = 0;

        uint256 i;

        Test[] memory tests = _testHistory[historyIndex].test;

        for (i = 0; i < tests.length; i++) {
            if (tests[i].testPassed == true) {
                knowledgeCoins = knowledgeCoins + 1;
            }
        }

        // TODO send knoweldge coins to _studentAddress
    }

    /*=====  End of Validate and Submit  ======*/

    /*=============================================
    =                 Test Helper                 =
    =============================================*/

    // Create test history
    function createTestHistory(
        address _studentAddress,
        address _contractAddress
    ) public returns (uint256) {
        uint256 index = _testHistoryCounter + 1;

        _testHistory[index].studentAddress = _studentAddress;
        _testHistory[index].contractAddress = _contractAddress;

        _testHistoryCounter = index;

        return index;
    }

    // Append test result to array
    function appendTestResult(
        uint256 _index,
        string memory _name,
        bool _result
    ) public {
        Test memory a = Test(_name, _result);
        a.testName = _name;
        a.testPassed = _result;

        _testHistory[_index].test.push(a);
    }

    // Return test result by id
    function getTestResultByIndex(uint256 _historyIndex, uint256 _testIndex)
        public
        view
        returns (Test memory result)
    {
        return _testHistory[_historyIndex].test[_testIndex];
    }

    // Return test reszlts
    function getTestResults(uint256 _historyIndex)
        public
        view
        returns (Test[] memory result)
    {
        return _testHistory[_historyIndex].test;
    }

    // Check assignment owner
    function checkAssignmentOwner(
        address _studentAddress,
        address _contractAddress
    ) public view returns (bool) {
        BaseAssignment assignment = BaseAssignment(_contractAddress);

        if (assignment.owner() == _studentAddress) {
            return true;
        } else {
            return false;
        }
    }

    // Get history counter
    function getHistoryCounter() public view returns (uint256) {
        return _testHistoryCounter;
    }

    /*=====        End of Test Helper      ======*/
}

/*=====   End of Assignment Helper    ======*/
