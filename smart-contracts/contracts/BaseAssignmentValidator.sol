// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

/*=============================================
=                Assignment Helper            =
=============================================*/

import "../contracts/BaseConfig.sol";
import "../contracts/BaseAssignment.sol";
import "../contracts/SBCoin.sol";

contract BaseAssignmentValidator is BaseConfig {
    // TEST STRUCT
    struct Test {
        // Name of test
        string testName;
        // Test result
        bool testPassed;
    }

    // TEST HISTORY STRUCT
    struct TestHistory {
        // studentAddress
        address studentAddress;
        // contractAddress
        address contractAddress;
        // test
        Test[] test;
    }

    // SUBMIT STRUCT
    struct AssignmentSubmitted {
        // index of the test which is used to calculate the amount of knowledge coins
        uint256 testIndex;
        // student address
        address studentAddress;
        // contract address
        address contractAddress;
        // knowledge coins
        uint256 knowledgeCoins;
        // blockno
        uint256 blockNo;
        // submitted
        bool submitted;
    }

    // Test history
    uint256 private _testHistoryCounter;
    mapping(uint256 => TestHistory) _testHistory;

    // Submitted assignments (student_address => true)
    mapping(address => AssignmentSubmitted) _assignmentSubmitted;

    constructor(address _configContractAddress, string memory _contractName) {
        initAdmin(_configContractAddress, _contractName);

        _testHistoryCounter = 0;
    }

    /*=============================================
    =            Validate and Submit            =
    =============================================*/

    // abstract validate test function
    function validateExampleAssignment(
        address _studentAddress,
        address _contractAddress
    ) public virtual returns (uint256) {}

    // Submit assignment
    function submitAssignment(address _studentAddress, address _contractAddress) public {
        require(
            _assignmentSubmitted[_studentAddress].submitted != true,
            "Assignment already submitted! Cannot submit the assignment again!"
        );

        require(
            BaseAssignment(_contractAddress).getOwner() == _studentAddress,
            "Only the owner of the contract can submit the assignment!"
        );

        // Validate assignment and return test history index
        uint256 historyIndex = validateExampleAssignment(
            _studentAddress,
            _contractAddress
        );

        // Get for each passed test a knowledge coin
        uint256 knowledgeCoins = 0;

        uint256 i;
        Test[] memory tests = _testHistory[historyIndex].test;

        for (i = 0; i < tests.length; i++) {
            if (tests[i].testPassed == true) {
                knowledgeCoins = knowledgeCoins + 1;
            }
        }

        // Get knowledge coin contract
        SBCoin knowledgeCoin = SBCoin(
            getConfigStorage().getKnowledgeCoinContractAddress()
        );

        // Exchange coin into knowledge coin
        uint256 sbCoinAmount = knowledgeCoin.exchangeToFullCoin(knowledgeCoins);

        // Mint knowledge coins
        knowledgeCoin.mint(_studentAddress, sbCoinAmount);

        // Mark assignment as submitted
        _assignmentSubmitted[_studentAddress] = AssignmentSubmitted(
            historyIndex,
            _studentAddress,
            _contractAddress,
            knowledgeCoins,
            block.number,
            true
        );
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

    // Return test result
    function getTestResults(uint256 _historyIndex)
        public
        view
        returns (Test[] memory result)
    {
        return _testHistory[_historyIndex].test;
    }

    /**
     * Get all test history indexes for a student
     *
     * MARK: The array has a fixed size, ignore all number besides 0
     *
     * @param _address Student address
     * @return testIndexes Array of test history indexes
     */
    function getTestHistoryIndexes(address _address)
        public
        view
        returns (uint256[] memory)
    {
        uint256[] memory testIndexes = new uint256[](_testHistoryCounter);

        uint256 i = 0;
        uint256 j = 0;
        for (i = 0; i < _testHistoryCounter; i++) {
            if (_testHistory[i].studentAddress == _address) {
                testIndexes[j] = i;
                j++;
            }
        }

        return testIndexes;
    }

    /**
     * Get submitted assignment for address
     *
     * @param _address Student address
     * @return AssignmentSubmitted
     */
    function getSubmittedAssignment(address _address)
        public
        view
        returns (AssignmentSubmitted memory)
    {
        return _assignmentSubmitted[_address];
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
