// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "../contracts/BaseConfigAdmin.sol";
import "../contracts/BaseAssignmentValidator.sol";

contract ConfigStorage is BaseConfigAdmin {
    // Amount of gas the user can get using the faucet
    uint128 faucetGas;

    // Amount of blocks difference between last faucet usage
    uint128 faucetBlockNoDifference;

    // Struct Seminar
    struct NOWSemester {
        string name; // Name of the semester (e.g. SS22)
        uint256 startBlock; // First block which counts towards this semester
        uint256 endBlock; // Last block which counts towards this semester
        uint256 minKnowledgeCoinAmount; // Amount of knowledge Coins needed to take exam
        uint256 assignmentCounter; // Assignment counter
        uint256[] assignmentIds; // Assignment Ids
        mapping(uint256 => NOWAssignments) assignments; // Assigned assignments
        // TEMP VARIABLES
        uint256 assignmentStartBlock; // Temp var to keep track of lowest start block of all assignments
        uint256 assignmentEndBlock; // Temp var to keep track of highest end block of all assignments
    }

    // Struct Seminar
    struct NOWSemesterReturn {
        string name; // Name of the semester (e.g. SS22)
        uint256 startBlock; // First block which counts towards this semester
        uint256 endBlock; // Last block which counts towards this semester
        uint256 minKnowledgeCoinAmount; // Amount of knowledge Coins needed to take exam
    }

    // Struct Assignments
    struct NOWAssignments {
        string name; // Name of the assignment
        string link; // Link to the assignment
        address validationContractAddress; // Address to the validation contract
        uint256 startBlock; // First block which counts towards this assignment
        uint256 endBlock; // Last block which counts towards this assignment
    }

    // Semester variables
    uint256 semesterCounter = 0;
    uint256[] private semesterIds;
    mapping(uint256 => NOWSemester) semesters;

    // SMART CONTRACT ADDRESS
    address public knowledgeCoinContractAddress;

    /**
     * Constructor to set default config values
     */
    constructor() {
        initAdmin("ConfigStorage");

        faucetGas = 2;
        faucetBlockNoDifference = 10;

        // Set counters to 0
        semesterCounter = 0;
    }

    /*=============================================
    =            Contract Adresses            =
    =============================================*/

    function setKnowledgeCoinContractAdress(address _address) public {
        knowledgeCoinContractAddress = _address;
    }

    function getKnowledgeCoinContractAddress() public view returns (address) {
        return knowledgeCoinContractAddress;
    }

    /*=====  End of Contract Adresses  ======*/

    /*=============================================
    =              Semester function              =
    =============================================*/

    // Append a new semester
    function appendSemester(
        string memory _name,
        uint256 _startBlock,
        uint256 _endBlock,
        uint256 _minKnowledgeCoinAmount
    ) public returns (uint256) {
        requireUserAdmin(msg.sender);

        // Require start block to be smaller than end block
        require(
            _startBlock < _endBlock,
            "Start block must be smaller than end block"
        );

        // Require min knowledge coin amount to be larger than 0
        require(
            _minKnowledgeCoinAmount > 0,
            "Min knowledge coin amount must be larger than 0"
        );

        // Require start and end block to be larger than 0
        require(
            _startBlock > 0 && _endBlock > 0,
            "Start and end block must be larger than 0"
        );

        uint256 index = semesterCounter + 1;

        semesters[index].name = _name;
        semesters[index].startBlock = _startBlock;
        semesters[index].endBlock = _endBlock;
        semesters[index].minKnowledgeCoinAmount = _minKnowledgeCoinAmount;
        semesters[index].assignmentCounter = 0;

        // TEMP VARIABLES
        semesters[index].assignmentStartBlock = 0;
        semesters[index].assignmentEndBlock = 0;

        semesterCounter = index;

        semesterIds.push(index);

        return index;
    }

    // Get the semester by id
    function getSemester(uint256 _id)
        public
        view
        returns (NOWSemesterReturn memory semester)
    {
        return
            NOWSemesterReturn(
                semesters[_id].name,
                semesters[_id].startBlock,
                semesters[_id].endBlock,
                semesters[_id].minKnowledgeCoinAmount
            );
    }

    // Get all semester ids
    function getSemesterIds() public view returns (uint256[] memory) {
        return semesterIds;
    }

    // Delete the semester by id
    function deleteSemester(uint256 _id) public {
        requireUserAdmin(msg.sender);

        // Require no linked assignments
        require(
            semesters[_id].assignmentIds.length == 0,
            "Semester has linked assignments"
        );

        delete semesters[_id];
        removeByValue(semesterIds, _id);
    }

    // Get the latest semester counter id
    function getSemesterCounter() public view returns (uint256) {
        return semesterCounter;
    }

    // Check if semester id exists
    function hasSemesterId(uint256 _semesterId) public view returns (bool) {
        for (uint256 i = 0; i < semesterIds.length; i++) {
            if (semesterIds[i] == _semesterId) {
                return true;
            }
        }
        return false;
    }

    /*----------  Setter  ----------*/

    // Set the semester name
    function setSemesterName(uint256 _id, string memory name) public {
        requireUserAdmin(msg.sender);
        semesters[_id].name = name;
    }

    // Set the semester start block
    function setSemesterStartBlock(uint256 _id, uint256 _startBlock) public {
        requireUserAdmin(msg.sender);

        // Require start block to be smaller than end block
        require(
            _startBlock < semesters[_id].endBlock,
            "Start block must be smaller than end block"
        );

        // Require start block to be larger than 0
        require(_startBlock > 0, "Start block must be larger than 0");

        // Require new start block to be smaller than the assignment start block
        if (semesters[_id].assignmentStartBlock > 0) {
            require(
                _startBlock < semesters[_id].assignmentStartBlock,
                "Start block must be smaller than the smallest assignment start block"
            );
        }

        semesters[_id].startBlock = _startBlock;
    }

    // Set the semester end block
    function setSemesterEndBlock(uint256 _id, uint256 _endBlock) public {
        requireUserAdmin(msg.sender);

        // Require end block to be larger than start block
        require(
            _endBlock > semesters[_id].startBlock,
            "End block must be larger than start block"
        );

        // Require end block to be larger than 0
        require(_endBlock > 0, "End block must be larger than 0");

        // Require new start block to be smaller than the assignment start block
        if (semesters[_id].assignmentStartBlock > 0) {
            require(
                _endBlock > semesters[_id].assignmentEndBlock,
                "Start block must be smaller than the largest assignment endblock block"
            );
        }

        semesters[_id].endBlock = _endBlock;
    }

    // Set the semester min knowledge coin amount
    function setSemesterMinKnowledgeCoinAmount(
        uint256 _id,
        uint256 _minKnowledgeCoinAmount
    ) public {
        requireUserAdmin(msg.sender);

        // Require min knowledge coin amount to be larger than 0
        require(
            _minKnowledgeCoinAmount > 0,
            "Min knowledge coin amount must be larger than 0"
        );

        semesters[_id].minKnowledgeCoinAmount = _minKnowledgeCoinAmount;
    }

    /*=====  End of Semester function  ======*/

    /*=============================================
    =            Assignment functions            =
    =============================================*/

    // Append a new assignment to a semester
    function appendAssignment(
        uint256 _semesterId,
        string memory _name,
        string memory _link,
        address _validationContractAddress,
        uint256 _startBlock,
        uint256 _endBlock
    ) public returns (uint256) {
        requireUserAdmin(msg.sender);

        // Require that assignment is in block range of semester
        require(
            _startBlock >= semesters[_semesterId].startBlock &&
                _endBlock <= semesters[_semesterId].endBlock,
            "Defined Assignment range is not in semester range"
        );

        // Require that start block is smaller than end block
        require(
            _startBlock < _endBlock,
            "Start block must be smaller than end block"
        );

        // Require start and end block to be larger than 0
        require(
            _startBlock > 0 && _endBlock > 0,
            "Start and end block must be larger than 0"
        );

        uint256 index = semesters[_semesterId].assignmentCounter + 1;

        semesters[_semesterId].assignments[index].name = _name;
        semesters[_semesterId].assignments[index].link = _link;
        semesters[_semesterId]
            .assignments[index]
            .validationContractAddress = _validationContractAddress;
        semesters[_semesterId].assignments[index].startBlock = _startBlock;
        semesters[_semesterId].assignments[index].endBlock = _endBlock;

        semesters[_semesterId].assignmentCounter = index;

        semesters[_semesterId].assignmentIds.push(index);

        if (semesters[_semesterId].assignmentStartBlock > 0) {
            // if start block is lower then assignment start block set to value
            if (_startBlock < semesters[_semesterId].assignmentStartBlock) {
                semesters[_semesterId].assignmentStartBlock = _startBlock;
            }
        } else {
            semesters[_semesterId].assignmentStartBlock = _startBlock;
        }

        if (semesters[_semesterId].assignmentEndBlock > 0) {
            // if end block is higher then assignment end block set to value
            if (_endBlock > semesters[_semesterId].assignmentEndBlock) {
                semesters[_semesterId].assignmentEndBlock = _endBlock;
            }
        } else {
            semesters[_semesterId].assignmentEndBlock = _endBlock;
        }
        // Set the assignment infos to the validator contract
        BaseAssignmentValidator validator = BaseAssignmentValidator(
            _validationContractAddress
        );

        require(
            validator.isAssignmentLinked() == false,
            "Assignment is already linked to a semester"
        );

        validator.setAssignmentInfos(_semesterId, index);

        require(
            validator.isAssignmentLinked() == true,
            "Assignment needs to be linked to a semester, now!"
        );

        return index;
    }

    // Get the assignment by id and semester id
    function getAssignment(uint256 _semesterId, uint256 _assignmentId)
        public
        view
        returns (NOWAssignments memory assignment)
    {
        return semesters[_semesterId].assignments[_assignmentId];
    }

    // Get all assignment ids from the semester
    function getAssignmentIds(uint256 _semesterId)
        public
        view
        returns (uint256[] memory)
    {
        return semesters[_semesterId].assignmentIds;
    }

    // Delete the assignment by id and semester id
    function deleteAssignment(uint256 _semesterId, uint256 _assignmentId)
        public
    {
        requireUserAdmin(msg.sender);

        // First get the validation contract address
        address validationContractAddress = semesters[_semesterId]
            .assignments[_assignmentId]
            .validationContractAddress;

        // Remove the assignment from the mapping and address
        delete semesters[_semesterId].assignments[_assignmentId];
        removeByValue(semesters[_semesterId].assignmentIds, _assignmentId);

        // Remove the infos from the assignment contract
        BaseAssignmentValidator validator = BaseAssignmentValidator(
            validationContractAddress
        );

        validator.clearAssignmentInfos();

        require(
            validator.isAssignmentLinked() == false,
            "Assignment is still linked to a semester!"
        );
    }

    // Get the latest assignment counter id
    function getAssignmentCounter(uint256 semester_id)
        public
        view
        returns (uint256)
    {
        return semesters[semester_id].assignmentCounter;
    }

    // Check if semester id exists
    function hasAssignmentId(uint256 _semesterId, uint256 _assignmentId)
        public
        view
        returns (bool)
    {
        // Loop over all semesters
        for (uint256 i = 0; i < semesterIds.length; i++) {
            // Check if the semester id exists
            if (semesterIds[i] == _semesterId) {
                // Loop over all assignments of the matching semester
                for (
                    uint256 j = 0;
                    j < semesters[_semesterId].assignmentIds.length;
                    j++
                ) {
                    // if the assignment id matches return true
                    if (
                        semesters[_semesterId].assignmentIds[j] == _assignmentId
                    ) {
                        return true;
                    }
                }

                // If no assignment id matches of the matching semester return false
                return false;
            }
        }

        // Semester id does not exist
        return false;
    }

    /*----------  Setter  ----------*/

    function setAssignmentName(
        uint256 _semesterId,
        uint256 _assignmentId,
        string memory name
    ) public {
        requireUserAdmin(msg.sender);
        semesters[_semesterId].assignments[_assignmentId].name = name;
    }

    function setAssignmentLink(
        uint256 _semesterId,
        uint256 _assignmentId,
        string memory link
    ) public {
        requireUserAdmin(msg.sender);
        semesters[_semesterId].assignments[_assignmentId].link = link;
    }

    function setAssignmentAddress(
        uint256 _semesterId,
        uint256 _assignmentId,
        address _address
    ) public {
        requireUserAdmin(msg.sender);

        // 1. DELETE LINKAGE TO OLD VALIDATOR CONTRACT
        address validationContractAddress = semesters[_semesterId]
            .assignments[_assignmentId]
            .validationContractAddress;

        // Remove the infos from the assignment contract
        BaseAssignmentValidator oldValidator = BaseAssignmentValidator(
            validationContractAddress
        );
        oldValidator.clearAssignmentInfos();

        require(
            oldValidator.isAssignmentLinked() == false,
            "OLD Assignment is still linked to a semester!"
        );

        // 2. SET NEW VALIDATOR CONTRACT
        BaseAssignmentValidator newValidator = BaseAssignmentValidator(
            _address
        );

        newValidator.setAssignmentInfos(_semesterId, _assignmentId);

        require(
            newValidator.isAssignmentLinked() == true,
            "NEW Assignment is not linked to a semester!"
        );

        // 3. SET NEW VALIDATOR CONTRACT ADDRESS
        semesters[_semesterId]
            .assignments[_assignmentId]
            .validationContractAddress = _address;
    }

    function setAssignmentStartBlock(
        uint256 _semesterId,
        uint256 _assignmentId,
        uint256 _startBlock
    ) public {
        requireUserAdmin(msg.sender);

        // Require that the start block is smaller than the end block
        require(
            _startBlock <
                semesters[_semesterId].assignments[_assignmentId].endBlock,
            "Start block needs to be smaller than end block"
        );

        // Require start block to be in range of the semester
        require(
            _startBlock >= semesters[_semesterId].startBlock &&
                _startBlock <= semesters[_semesterId].endBlock,
            "Start block needs to be in range of the semester"
        );

        // Require start block to be larger than 0
        require(_startBlock > 0, "Start block needs to be larger than 0");

        if (semesters[_semesterId].assignmentStartBlock > 0) {
            // if start block is lower then assignment start block set to value
            if (_startBlock < semesters[_semesterId].assignmentStartBlock) {
                semesters[_semesterId].assignmentStartBlock = _startBlock;
            }
        }

        semesters[_semesterId]
            .assignments[_assignmentId]
            .startBlock = _startBlock;
    }

    function setAssignmentEndBlock(
        uint256 _semesterId,
        uint256 _assignmentId,
        uint256 _endBlock
    ) public {
        requireUserAdmin(msg.sender);

        // Require that the end block is bigger than the start block
        require(
            _endBlock >
                semesters[_semesterId].assignments[_assignmentId].startBlock,
            "End block needs to be bigger than start block"
        );

        // Require end block to be in range of the semester
        require(
            _endBlock >= semesters[_semesterId].startBlock &&
                _endBlock <= semesters[_semesterId].endBlock,
            "End block needs to be in range of the semester"
        );

        // Require end block to be larger than 0
        require(_endBlock > 0, "End block needs to be larger than 0");

        if (semesters[_semesterId].assignmentEndBlock > 0) {
            // if end block is higher then assignment end block set to value
            if (_endBlock > semesters[_semesterId].assignmentEndBlock) {
                semesters[_semesterId].assignmentEndBlock = _endBlock;
            }
        }

        semesters[_semesterId].assignments[_assignmentId].endBlock = _endBlock;
    }

    /*=====  End of Assignment functions  ======*/

    /*=============================================
    =            Other functions            =
    =============================================*/

    function getFaucetGas() public view returns (uint128) {
        return faucetGas;
    }

    function getFaucetBlockNoDifference() public view returns (uint128) {
        return faucetBlockNoDifference;
    }

    function setFaucetGas(uint128 _faucetGas) public {
        requireUserAdmin(msg.sender);
        faucetGas = _faucetGas;
    }

    function setFaucetBlockNoDifference(uint128 _faucetBlockNoDifference)
        public
    {
        requireUserAdmin(msg.sender);
        faucetBlockNoDifference = _faucetBlockNoDifference;
    }

    /*=====  End of Other functions  ======*/

    /*=============================================
    =            Helper Functions            =
    =============================================*/

    function compareStrings(string memory a, string memory b)
        internal
        pure
        returns (bool)
    {
        return (keccak256(abi.encodePacked((a))) ==
            keccak256(abi.encodePacked((b))));
    }

    function find(uint256[] storage arr, uint256 value)
        internal
        view
        returns (uint256)
    {
        uint256 i = 0;
        while (arr[i] != value) {
            i++;
        }
        return i;
    }

    function removeByValue(uint256[] storage arr, uint256 value) internal {
        uint256 i = find(arr, value);
        removeByIndex(arr, i);
    }

    function removeByIndex(uint256[] storage arr, uint256 i) internal {
        while (i < arr.length - 1) {
            arr[i] = arr[i + 1];
            i++;
        }
        arr.pop();
    }

    /*=====  End of Helper Functions  ======*/
}
