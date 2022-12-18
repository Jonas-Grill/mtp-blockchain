// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "../contracts/BaseConfigAdmin.sol";

contract ConfigStorage is BaseConfigAdmin {
    // Amount of gas the user can get using the faucet
    uint128 faucetGas;

    // Amount of blocks difference between last faucet usage
    uint128 faucetBlockNoDifference;

    // Struct Seminar
    struct uniMaSemester {
        string name; // Name of the semester (e.g. SS22)
        uint256 startBlock; // First block which counts towards this semester
        uint256 endBlock; // Last block which counts towards this semester
        uint256 minKnowledgeCoinAmount; // Amount of knowledge Coins needed to take exam
        uint256 assignmentCounter; // Assignment counter
        uint256[] assignmentIds; // Assignment Ids
        mapping(uint256 => uniMaAssignments) assignments; // Assigned assignments
    }

    // Struct Seminar
    struct uniMaSemesterReturn {
        string name; // Name of the semester (e.g. SS22)
        uint256 startBlock; // First block which counts towards this semester
        uint256 endBlock; // Last block which counts towards this semester
        uint256 minKnowledgeCoinAmount; // Amount of knowledge Coins needed to take exam
    }

    // Struct Assignments
    struct uniMaAssignments {
        string name; // Name of the assignment
        string link; // Link to the assignment
        address validationContractAddress; // Address to the validation contract
        uint256 startBlock; // First block which counts towards this assignment
        uint256 endBlock; // Last block which counts towards this assignment
    }

    // Semester variables
    uint256 semesterCounter = 0;
    uint256[] private semesterIds;
    mapping(uint256 => uniMaSemester) semesters;

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

    function appendSemester(
        string memory _name,
        uint256 _startBlock,
        uint256 _endBlock,
        uint256 _minKnowledgeCoinAmount
    ) public returns (uint256) {
        requireUserAdmin(msg.sender);

        uint256 index = semesterCounter + 1;

        semesters[index].name = _name;
        semesters[index].startBlock = _startBlock;
        semesters[index].endBlock = _endBlock;
        semesters[index].minKnowledgeCoinAmount = _minKnowledgeCoinAmount;
        semesters[index].assignmentCounter = 0;

        semesterCounter = index;

        semesterIds.push(index);

        return index;
    }

    function getSemester(uint256 _id)
        public
        view
        returns (uniMaSemesterReturn memory semester)
    {
        return
            uniMaSemesterReturn(
                semesters[_id].name,
                semesters[_id].startBlock,
                semesters[_id].endBlock,
                semesters[_id].minKnowledgeCoinAmount
            );
    }

    function getSemesterIds() public view returns (uint256[] memory) {
        return semesterIds;
    }

    function deleteSemester(uint256 _id) public {
        requireUserAdmin(msg.sender);

        delete semesters[_id];
        removeByValue(semesterIds, _id);
    }

    function getSemesterCounter() public view returns (uint256) {
        return semesterCounter;
    }

    /*----------  Setter  ----------*/

    function setSemesterName(uint256 _id, string memory name) public {
        requireUserAdmin(msg.sender);
        semesters[_id].name = name;
    }

    function setSemesterStartBlock(uint256 _id, uint256 _startBlock) public {
        requireUserAdmin(msg.sender);
        semesters[_id].startBlock = _startBlock;
    }

    function setSemesterEndBlock(uint256 _id, uint256 _endBlock) public {
        requireUserAdmin(msg.sender);
        semesters[_id].endBlock = _endBlock;
    }

    function setMinKnowledgeCoinAmount(
        uint256 _id,
        uint256 _minKnowledgeCoinAmount
    ) public {
        requireUserAdmin(msg.sender);
        semesters[_id].minKnowledgeCoinAmount = _minKnowledgeCoinAmount;
    }

    /*=====  End of Semester function  ======*/

    /*=============================================
    =            Assignment functions            =
    =============================================*/

    function appendAssignment(
        uint256 _semesterId,
        string memory _name,
        string memory _link,
        address _validationContractAddress,
        uint256 _startBlock,
        uint256 _endBlock
    ) public returns (uint256) {
        requireUserAdmin(msg.sender);

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

        return index;
    }

    function getAssignment(uint256 _semesterId, uint256 _assignmentId)
        public
        view
        returns (uniMaAssignments memory assignment)
    {
        return semesters[_semesterId].assignments[_assignmentId];
    }

    function getAssignmentIds(uint256 _semesterId)
        public
        view
        returns (uint256[] memory)
    {
        return semesters[_semesterId].assignmentIds;
    }

    function deleteAssignment(uint256 _semesterId, uint256 _assignmentId)
        public
    {
        requireUserAdmin(msg.sender);
        delete semesters[_semesterId].assignments[_assignmentId];
        removeByValue(semesters[_semesterId].assignmentIds, _assignmentId);
    }

    function getAssignmentCounter(uint256 semester_id)
        public
        view
        returns (uint256)
    {
        return semesters[semester_id].assignmentCounter;
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
        semesters[_semesterId].assignments[_assignmentId].endBlock = _endBlock;
    }

    /*=====  End of Assignment functions  ======*/

    /*=============================================
    =            Other functions            =
    =============================================*/

    function getIntValue(string memory key) public view returns (uint128) {
        if (compareStrings(key, "faucetGas") == true) {
            return faucetGas;
        } else if (compareStrings(key, "faucetBlockNoDifference") == true) {
            return faucetBlockNoDifference;
        }
        return 0;
    }

    function setIntValue(string memory key, uint128 value) public {
        requireUserAdmin(msg.sender);

        if (compareStrings(key, "faucetGas") == true) {
            faucetGas = value;
        } else if (compareStrings(key, "faucetBlockNoDifference") == true) {
            faucetBlockNoDifference = value;
        }
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
