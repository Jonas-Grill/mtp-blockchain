// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract ConfigStorage {
    // Amount of gas the user can get using the faucet
    int128 faucetGas;

    // Amount of blocks difference between last faucet usage
    int128 faucetBlockNoDifference;

    // Address of owner
    address owner;

    // Struct Seminar
    struct uniMaSemester {
        // Name of the semester (e.g. SS22)
        string name;
        // First block which counts towards this semester
        uint256 startBlock;
        // Last block which counts towards this semester
        uint256 endBlock;
        // Assignment counter
        uint256 assignmentCounter;
        // Assigned assignments
        mapping(uint256 => uniMaAssignments) assignments;
    }

    // Struct Seminar
    struct uniMaSemesterReturn {
        // Name of the semester (e.g. SS22)
        string name;
        // First block which counts towards this semester
        uint256 startBlock;
        // Last block which counts towards this semester
        uint256 endBlock;
    }

    // Assignments
    struct uniMaAssignments {
        // Name of the assignment
        string name;
        // Link to the assignment
        string link;
        // Address to the validation contrac
        address validationContractAddress;
    }

    uint256 semesterCounter = 0;
    mapping(uint256 => uniMaSemester) semesters;

    /**
     * Constructor to set default config values
     */
    constructor() {
        owner = msg.sender;

        faucetGas = 10;
        faucetBlockNoDifference = 10;

        // Set counters to 0
        semesterCounter = 0;
    }

    /*=============================================
    =            Semester function            =
    =============================================*/

    function appendSemester(
        string memory _name,
        uint256 _startBlock,
        uint256 _endBlock
    ) public returns (uint256) {
        require(
            msg.sender == owner,
            "Address that deploys this smart contract is not the coinbase address!"
        );

        uint256 index = semesterCounter + 1;

        semesters[index].name = _name;
        semesters[index].startBlock = _startBlock;
        semesters[index].endBlock = _endBlock;
        semesters[index].assignmentCounter = 0;

        semesterCounter = index;

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
                semesters[_id].endBlock
            );
    }

    function deleteSemester(uint256 _id) public {
        delete semesters[_id];
    }

    function getSemesterCounter() public view returns (uint256) {
        return semesterCounter;
    }

    /*----------  Setter  ----------*/

    function setSemesterName(uint256 _id, string memory name) public {
        semesters[_id].name = name;
    }

    function setSemesterStartBlock(uint256 _id, uint256 startBlock) public {
        semesters[_id].startBlock = startBlock;
    }

    function setSemesterEndBlock(uint256 _id, uint256 endBlock) public {
        semesters[_id].endBlock = endBlock;
    }

    /*=====  End of Semester function  ======*/

    /*=============================================
    =            Assignment functions            =
    =============================================*/

    function appendAssignment(
        uint256 _semesterId,
        string memory _name,
        string memory _link,
        address _validationContractAddress
    ) public returns (uint256) {
        require(
            msg.sender == owner,
            "Address that deploys this smart contract is not the coinbase address!"
        );

        uint256 index = semesters[_semesterId].assignmentCounter + 1;

        semesters[_semesterId].assignments[index].name = _name;
        semesters[_semesterId].assignments[index].link = _link;
        semesters[_semesterId]
            .assignments[index]
            .validationContractAddress = _validationContractAddress;

        semesters[_semesterId].assignmentCounter = index;

        return index;
    }

    function getAssignment(uint256 _semesterId, uint256 _assignmentId)
        public
        view
        returns (uniMaAssignments memory assignment)
    {
        return semesters[_semesterId].assignments[_assignmentId];
    }

    function deleteAssignment(uint256 _semesterId, uint256 _assignmentId)
        public
    {
        delete semesters[_semesterId].assignments[_assignmentId];
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
        semesters[_semesterId].assignments[_assignmentId].name = name;
    }

    function setAssignmentLink(
        uint256 _semesterId,
        uint256 _assignmentId,
        string memory link
    ) public {
        semesters[_semesterId].assignments[_assignmentId].link = link;
    }

    function setAssignmentAddress(
        uint256 _semesterId,
        uint256 _assignmentId,
        address _address
    ) public {
        semesters[_semesterId]
            .assignments[_assignmentId]
            .validationContractAddress = _address;
    }

    /*=====  End of Assignment functions  ======*/

    /*=============================================
    =            Other functions            =
    =============================================*/

    function getIntValue(string memory key) public view returns (int128) {
        if (compareStrings(key, "faucetGas") == true) {
            return faucetGas;
        } else if (compareStrings(key, "faucetBlockNoDifference") == true) {
            return faucetBlockNoDifference;
        }
        return 0;
    }

    function setIntValue(string memory key, int128 value) public {
        require(
            msg.sender == owner,
            "Address that deploys this smart contract is not the coinbase address!"
        );

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
        public
        view
        returns (bool)
    {
        return (keccak256(abi.encodePacked((a))) ==
            keccak256(abi.encodePacked((b))));
    }
    /*=====  End of Helper Functions  ======*/
}
