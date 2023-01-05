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

    // Info about the assignment is has in the ConfigStorage
    uint256 _semesterId;
    uint256 _assignmentId;
    bool _assignmentLinked;

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
    function test(address _contractAddress) public virtual returns (uint256) {}

    // validate function
    function validateAssignment(address _contractAddress)
        public
        returns (uint256)
    {
        // Make sure the assignment is linked to a semester
        require(
            isAssignmentLinked() == true,
            "Assignment Error: Assignment is not linked to a semester! Please contract the Admin asap!"
        );

        // Make sure the person who is checking the assignment is the owner of the contract or an admin
        require(
            BaseAssignment(_contractAddress).getOwner() == msg.sender ||
                getConfigStorage().isAdmin(
                    BaseAssignment(_contractAddress).getOwner()
                ) ==
                true,
            "Assignment Error: Only the owner of the contract or an admin can validate this assignment!"
        );

        // Make sure the assignment is deploy in the required block range
        require(
            hasAssignmentDeployedInBlockRange(_contractAddress) == true,
            "Assignment Error: Assignment not deployed in the required assignment block range!"
        );

        uint256 historyCounter = test(_contractAddress);

        return historyCounter;
    }

    // Submit assignment
    function submitAssignment(address _contractAddress)
        public
        returns (uint256)
    {
        // Make sure the assignment is linked to a semester
        require(
            isAssignmentLinked() == true,
            "Assignment Error: Assignment is not linked to a semester! Please contract the Admin asap!"
        );

        // Make sure the assignment is not already submitted
        require(
            _assignmentSubmitted[msg.sender].submitted != true,
            "Assignment Error: Assignment already submitted! Cannot submit the assignment again!"
        );

        // Make sure the student is the owner of the contract
        require(
            BaseAssignment(_contractAddress).getOwner() == msg.sender,
            "Assignment Error: Only the owner of the contract can submit this assignment!"
        );

        // Make sure the assignment is deployed in the required block range
        require(
            hasAssignmentDeployedInBlockRange(_contractAddress) == true,
            "Assignment Error: Assignment not deployed in the required assignment block range!"
        );

        // Validate assignment and return test history index
        uint256 historyIndex = validateAssignment(_contractAddress);

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
        knowledgeCoin.mint(msg.sender, sbCoinAmount);

        // Mark assignment as submitted
        _assignmentSubmitted[msg.sender] = AssignmentSubmitted(
            historyIndex,
            msg.sender,
            _contractAddress,
            knowledgeCoins,
            block.number,
            true
        );

        return historyIndex;
    }

    /*=====  End of Validate and Submit  ======*/

    /*=============================================
    =                 Test Helper                 =
    =============================================*/

    // Create test history
    function createTestHistory(address _contractAddress)
        public
        returns (uint256)
    {
        uint256 index = _testHistoryCounter + 1;

        _testHistory[index].studentAddress = msg.sender;
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
    function checkAssignmentOwner(address _contractAddress)
        public
        view
        returns (bool)
    {
        BaseAssignment assignment = BaseAssignment(_contractAddress);

        if (assignment.getOwner() == msg.sender) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Get test history counter
     */
    function getHistoryCounter() public view returns (uint256) {
        return _testHistoryCounter;
    }

    /**
     * Remove submitted assignment
     *
     * @param _address Student address
     */
    function removeSubmittedAssignment(address _address) public {
        getConfigStorage().requireAdmin(_address);

        require(
            hasAssignmentSubmitted(_address) == true,
            "Assignment need to be first submitted, to be removed!"
        );

        uint256 knowledgeCoins = _assignmentSubmitted[_address].knowledgeCoins;

        // Get knowledge coin contract
        SBCoin knowledgeCoinInstance = SBCoin(
            getConfigStorage().getKnowledgeCoinContractAddress()
        );

        knowledgeCoinInstance.burn(_address, knowledgeCoins);

        delete _assignmentSubmitted[_address];
    }

    /**
     * Check if assignment is submitted
     *
     * @param _address Student address
     * @return bool
     */
    function hasAssignmentSubmitted(address _address)
        public
        view
        returns (bool)
    {
        return _assignmentSubmitted[_address].submitted;
    }

    /**
     * Check if assignment is deployed in block range
     *
     * @param _contractAddress Assignment contract address
     * @return bool
     */
    function hasAssignmentDeployedInBlockRange(address _contractAddress)
        private
        view
        returns (bool)
    {
        BaseAssignment assignment = BaseAssignment(_contractAddress);

        // Get block number of assignment
        uint256 blockNumber = assignment.getBlockNumber();

        // Get allowed start and end block of assignment
        uint256 startBlock = getConfigStorage()
            .getAssignment(_semesterId, _assignmentId)
            .startBlock;
        uint256 endBlock = getConfigStorage()
            .getAssignment(_semesterId, _assignmentId)
            .endBlock;

        // Check if block number is in range
        if (blockNumber >= startBlock && blockNumber <= endBlock) {
            return true;
        } else {
            return false;
        }
    }

    /*=====        End of Test Helper      ======*/

    /*=============================================
    =               Config Helper               =
    =============================================*/

    /**
     * Set assignment infos
     *
     * @param semesterId Semester id
     * @param assignmentId Assignment id
     */
    function setAssignmentInfos(uint256 semesterId, uint256 assignmentId)
        public
    {
        getConfigStorage().requireAdmin(msg.sender);

        // Make sure that the semester exists
        require(
            getConfigStorage().hasSemesterId(semesterId) == true,
            "Semester id does not exist!"
        );

        // Make sure that the assignment exists in the semester
        require(
            getConfigStorage().hasAssignmentId(semesterId, assignmentId) ==
                true,
            "Assignment id for the semester does not exist!"
        );

        _semesterId = semesterId;
        _assignmentId = assignmentId;

        // set linked to true
        _assignmentLinked = true;
    }

    /**
     * Clear assignment infos
     */
    function clearAssignmentInfos() public {
        getConfigStorage().requireAdmin(msg.sender);

        _semesterId = 0;
        _assignmentId = 0;
        _assignmentLinked = false;
    }

    /**
     * Check if assignment is linked to config storage
     */
    function isAssignmentLinked() public view returns (bool) {
        return _assignmentLinked;
    }

    /**
     * Get assignment infos
     */
    function getAssignmentInfos()
        public
        view
        returns (
            uint256,
            uint256,
            bool
        )
    {
        return (_semesterId, _assignmentId, _assignmentLinked);
    }

    /*=====     End of Config Helper     ======*/
}

/*=====   End of Assignment Helper    ======*/
