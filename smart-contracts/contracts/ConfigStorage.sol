// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract ConfigStorage {
    // Amount of gas the user can get using the faucet
    int128 faucetGas;

    // Amount of blocks difference between last faucet usage
    int128 faucetBlockNoDifference;

    // Address of admin
    address admin;

    // Struct Seminar
    struct uniMaSemester {
        // Name of the semester (e.g. SS22)
        string name;
        // First block which counts towards this semester
        uint256 startBlock;
        // Last block which counts towards this semester
        uint256 endBlock;
        // Amount of knowledge Coins needed to take exam
        uint256 minKnowledgeCoinAmount;
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
        // Amount of knowledge Coins needed to take exam
        uint256 minKnowledgeCoinAmount;
    }

    // Assignments
    struct uniMaAssignments {
        // Name of the assignment
        string name;
        // Link to the assignment
        string link;
        // Address to the validation contrac
        address validationContractAddress;
        // First block which counts towards this assignment
        uint256 startBlock;
        // Last block which counts towards this assignment
        uint256 endBlock;
    }

    uint256 semesterCounter = 0;
    mapping(uint256 => uniMaSemester) semesters;

    /**
     * Constructor to set default config values
     */
    constructor() {
        admin = msg.sender;

        faucetGas = 10;
        faucetBlockNoDifference = 10;

        // Set counters to 0
        semesterCounter = 0;
    }

    /*=============================================
    =                     Admin                   =
    =============================================*/

    // Change Admin account
    function setAdmin(address _newAdmin) public {
        require(
            msg.sender == admin,
            "Permission denied! The address is not allowed to executes this smart contract function!"
        );

        admin = _newAdmin;
    }

    // Get Admin address
    function getAdmin() public view returns (address) {
        return admin;
    }

    /*=====            End of Admin        ======*/

    /*=============================================
    =              Semester function              =
    =============================================*/

    function appendSemester(
        string memory _name,
        uint256 _startBlock,
        uint256 _endBlock,
        uint256 _minKnowledgeCoinAmount
    ) public returns (uint256) {
        require(
            msg.sender == admin,
            "Permission denied! The address is not allowed to executes this smart contract function!"
        );

        uint256 index = semesterCounter + 1;

        semesters[index].name = _name;
        semesters[index].startBlock = _startBlock;
        semesters[index].endBlock = _endBlock;
        semesters[index].minKnowledgeCoinAmount = _minKnowledgeCoinAmount;
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
                semesters[_id].endBlock,
                semesters[_id].minKnowledgeCoinAmount
            );
    }

    function deleteSemester(uint256 _id) public {
        require(
            msg.sender == admin,
            "Permission denied! The address is not allowed to executes this smart contract function!"
        );

        delete semesters[_id];
    }

    function getSemesterCounter() public view returns (uint256) {
        return semesterCounter;
    }

    /*----------  Setter  ----------*/

    function setSemesterName(uint256 _id, string memory name) public {
        require(
            msg.sender == admin,
            "Permission denied! The address is not allowed to executes this smart contract function!"
        );
        semesters[_id].name = name;
    }

    function setSemesterStartBlock(uint256 _id, uint256 _startBlock) public {
        require(
            msg.sender == admin,
            "Permission denied! The address is not allowed to executes this smart contract function!"
        );
        semesters[_id].startBlock = _startBlock;
    }

    function setSemesterEndBlock(uint256 _id, uint256 _endBlock) public {
        require(
            msg.sender == admin,
            "Permission denied! The address is not allowed to executes this smart contract function!"
        );
        semesters[_id].endBlock = _endBlock;
    }

    function setMinKnowledgeCoinAmount(
        uint256 _id,
        uint256 _minKnowledgeCoinAmount
    ) public {
        require(
            msg.sender == admin,
            "Permission denied! The address is not allowed to executes this smart contract function!"
        );
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
        require(
            msg.sender == admin,
            "Permission denied! The address is not allowed to executes this smart contract function!"
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
        require(
            msg.sender == admin,
            "Permission denied! The address is not allowed to executes this smart contract function!"
        );
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
        require(
            msg.sender == admin,
            "Permission denied! The address is not allowed to executes this smart contract function!"
        );
        semesters[_semesterId].assignments[_assignmentId].name = name;
    }

    function setAssignmentLink(
        uint256 _semesterId,
        uint256 _assignmentId,
        string memory link
    ) public {
        require(
            msg.sender == admin,
            "Permission denied! The address is not allowed to executes this smart contract function!"
        );
        semesters[_semesterId].assignments[_assignmentId].link = link;
    }

    function setAssignmentAddress(
        uint256 _semesterId,
        uint256 _assignmentId,
        address _address
    ) public {
        require(
            msg.sender == admin,
            "Permission denied! The address is not allowed to executes this smart contract function!"
        );
        semesters[_semesterId]
            .assignments[_assignmentId]
            .validationContractAddress = _address;
    }

    function setAssignmentStartBlock(
        uint256 _semesterId,
        uint256 _assignmentId,
        uint256 _startBlock
    ) public {
        require(
            msg.sender == admin,
            "Permission denied! The address is not allowed to executes this smart contract function!"
        );
        semesters[_semesterId]
            .assignments[_assignmentId]
            .startBlock = _startBlock;
    }

    function setAssignmentEndBlock(
        uint256 _semesterId,
        uint256 _assignmentId,
        uint256 _endBlock
    ) public {
        require(
            msg.sender == admin,
            "Permission denied! The address is not allowed to executes this smart contract function!"
        );
        semesters[_semesterId].assignments[_assignmentId].endBlock = _endBlock;
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
            msg.sender == admin,
            "Permission denied! The address is not allowed to executes this smart contract function!"
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
        internal
        view
        returns (bool)
    {
        return (keccak256(abi.encodePacked((a))) ==
            keccak256(abi.encodePacked((b))));
    }
    /*=====  End of Helper Functions  ======*/
}
