// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

/*=============================================
=                Assignment Helper            =
=============================================*/

import "../contracts/BaseConfig.sol";
import "../contracts/BaseAssignment.sol";
import "../contracts/SBCoin.sol";
import "../contracts/Helper.sol";

contract BaseValidator is BaseConfig, Helper {
    // TEST STRUCT
    struct Test {
        // Name of test
        string testName;
        // Test result
        bool testPassed;
        // Points
        uint256 points;
    }

    // TEST HISTORY STRUCT
    struct TestHistory {
        // studentAddress
        address studentAddress;
        // contractAddress
        address contractAddress;
        // test
        //Test[] test;
        uint256 testCounter;
        mapping(uint256 => Test) test;
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

    // Contract creation block number tracker
    mapping(address => uint256) _assignmentCreationBlockNumber;
    // This tracks the block number if a conract references the Validator contract address

    // Contract msg sender tracker
    mapping(address => address) _assignmentOwner;
    // Left is the contract address (msg.sender), right is the tx.origin address

    // Info about the assignment is has in the ConfigStorage
    uint256 _semesterId;
    uint256 _assignmentId;
    bool _assignmentLinked;

    // Required ether which is required to properly submit or validate the assignment
    uint256 private requiredEther = 0 ether;

    // Test history
    uint256 public _testHistoryCounter;
    mapping(uint256 => TestHistory) _testHistory;

    // Submitted assignments (student_address => true)
    mapping(address => AssignmentSubmitted) _assignmentSubmitted;

    // assigned helper contracts
    mapping(address => bool) _assignedHelperContracts;

    constructor(
        address _configContractAddress,
        string memory _contractName,
        uint256 _requiredEther
    ) {
        initAdmin(_configContractAddress, _contractName);

        addHelperContracts(address(this));

        requiredEther = _requiredEther;

        _testHistoryCounter = 0;
    }

    /*=============================================
    =            Validate and Submit            =
    =============================================*/

    // abstract validate test function
    function test(address _contractAddress)
        public
        payable
        virtual
        returns (uint256)
    {}

    // validate function
    function validateAssignment(address _contractAddress)
        public
        payable
        returns (uint256)
    {
        // Make sure the assignment is linked to a semester
        require(
            isAssignmentLinked() == true,
            "Assignment Error: Assignment is not linked to a semester! Please contract an Admin asap!"
        );

        // Make sure the person who is checking the assignment is the owner of the contract or an admin
        require(
            getAssignmentOwner(_contractAddress) == tx.origin ||
                getConfigStorage().isAdmin(msg.sender) == true,
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
        payable
        returns (uint256)
    {
        // Make sure the assignment is linked to a semester
        require(
            isAssignmentLinked() == true,
            "Assignment Error: Assignment is not linked to a semester! Please contact the Admin asap!"
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

        // Make sure current block is still in assignment block range
        require(
            hasSubmittedInBlockRange() == true,
            "Assignment Error: Assignment not submitted in the required assignment block range!"
        );

        // Validate assignment and return test history index
        uint256 historyIndex = validateAssignment(_contractAddress);

        // Get for each passed test a knowledge coin
        uint256 knowledgeCoins = 0;

        uint256 i;
        for (i = 1; i <= _testHistory[historyIndex].testCounter; i++) {
            if (_testHistory[historyIndex].test[i].testPassed == true) {
                knowledgeCoins =
                    knowledgeCoins +
                    _testHistory[historyIndex].test[i].points;
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
        // Only admins can create test history > security
        getConfigStorage().requireAdmin(address(this));

        uint256 index = _testHistoryCounter + 1;

        _testHistory[index].studentAddress = msg.sender;
        _testHistory[index].contractAddress = _contractAddress;
        _testHistory[index].testCounter = 0;

        _testHistoryCounter = index;

        return index;
    }

    // Append test result to array
    function appendTestResult(
        string memory _name,
        bool _result,
        uint256 _points
    ) public {
        // Only admins can append test result > security
        getConfigStorage().requireAdmin(address(this));

        uint256 index = _testHistory[_testHistoryCounter].testCounter + 1;

        Test memory a = Test(_name, _result, _points);
        a.testName = _name;
        a.testPassed = _result;
        a.points = _points;

        _testHistory[_testHistoryCounter].test[index] = a;

        _testHistory[_testHistoryCounter].testCounter = index;
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
        Test[] memory testArray = new Test[](
            _testHistory[_historyIndex].testCounter
        );

        uint256 i;
        for (i = 1; i <= _testHistory[_historyIndex].testCounter; i++) {
            testArray[i - 1] = _testHistory[_historyIndex].test[i];
        }

        return testArray;
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
        for (i = 0; i <= _testHistoryCounter; i++) {
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
        if (getAssignmentOwner(_contractAddress) == msg.sender) {
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
        // Get block number of assignment
        uint256 blockNumber = getAssignmentCreationBlockNumber(
            _contractAddress
        );

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

    /**
     * Check if assignment is submitted in block range
     *
     * @return bool
     */
    function hasSubmittedInBlockRange() private view returns (bool) {
        // get current block number
        uint256 blockNumber = block.number;

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

    /**
     * Set block number of contract creation
     */
    function setAssignmentCreationBlockNumber() public {
        if (_assignmentCreationBlockNumber[msg.sender] == 0) {
            _assignmentCreationBlockNumber[msg.sender] = block.number;
        }
    }

    function getAssignmentCreationBlockNumber(address _address)
        public
        view
        returns (uint256)
    {
        return _assignmentCreationBlockNumber[_address];
    }

    /**
     * Set admin address
     */
    function setAssignmentOwner() public {
        if (_assignmentOwner[msg.sender] == address(0)) {
            _assignmentOwner[msg.sender] = tx.origin;
        }
    }

    function getAssignmentOwner(address _address)
        public
        view
        returns (address)
    {
        return _assignmentOwner[_address];
    }

    /*=====        End of Test Helper      ======*/

    /*=============================================
    =               Config Helper               =
    =============================================*/

    // Assign helper address to _assignedHelperContracts
    function addHelperContracts(address _helperAddress) public {
        getConfigStorage().requireAdmin(msg.sender);

        _assignedHelperContracts[_helperAddress] = true;
    }

    // check if address is assigned to _assignedHelperContracts
    function isValidator(address _helperAddress) public view returns (bool) {
        return _assignedHelperContracts[_helperAddress];
    }

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

    /**
     * Get required ether
     * This amount of ether is required to submit or test an assignment
     */
    function getRequiredEther() public view returns (uint256) {
        return requiredEther;
    }

    /*=====     End of Config Helper     ======*/
}

/*=====   End of Assignment Helper    ======*/
