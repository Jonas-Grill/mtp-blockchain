// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

// Import the Interfaces
import "./interface/IAssignment4.sol";
import "./interface/IAssignment4Coin.sol";

// Import the registry contract to use as Interface
import "./helper/Assignment4Registry.sol";

// Import the exchange
import "./helper/Assignment4Exchange.sol";

// Import the Coin
import "./helper/Assignment4Coin.sol";

// Import the base assignment validator contract
import "../BaseValidator.sol";

// Import Task A, B, C, D
import "./Validator4TaskA.sol";
import "./Validator4TaskB.sol";
import "./Validator4TaskD.sol";

// Give the contract a name and inherit from the base assignment validator
contract Validator4 is BaseValidator {
    // Contract to validate
    IAssignment4 assignmentContract;

    // Task A, B, C and D
    Validator4TaskA validatorTaskA;
    Validator4TaskB validatorTaskB;
    Validator4TaskD validatorTaskD;

    // Registry contract
    Assignment4Registry registryContract;

    // Coin contract
    Assignment4Coin coinContract;

    // Exchange contract
    Assignment4Exchange exchangeContract;

    constructor(address _configContractAddress)
        payable
        BaseValidator(
            _configContractAddress,
            "SS23 Assignment 4 Validator Contract - Base",
            20000 gwei
        )
    {
        // Task A, B, C and D
        validatorTaskA = new Validator4TaskA(_configContractAddress);
        validatorTaskB = new Validator4TaskB(_configContractAddress);
        validatorTaskD = new Validator4TaskD(_configContractAddress);

        // Assign contracts to the list of helper contracts
        addHelperContracts(address(validatorTaskA));
        addHelperContracts(address(validatorTaskB));
        addHelperContracts(address(validatorTaskD));

        // Create a new coin contract
        coinContract = new Assignment4Coin(
            "SS23 Coin - Assignment 2",
            "SS23",
            _configContractAddress
        );
        addHelperContracts(address(coinContract));

        // Create a new exchange contract
        exchangeContract = new Assignment4Exchange{value: 2000 gwei}(
            address(coinContract),
            _configContractAddress
        );
        addHelperContracts(address(exchangeContract));

        // Create a new registry contract
        registryContract = new Assignment4Registry(
            _configContractAddress,
            address(exchangeContract)
        );
        addHelperContracts(address(registryContract));
    }

    // Fallback function to make sure the contract can receive ether
    receive() external payable {}

    // Test the assignment
    function test(address _contractAddress)
        public
        payable
        override(BaseValidator)
        returns (uint256)
    {
        uint256 testId = createTestHistory(_contractAddress);

        // Call the contract interface which needs to be tested and store it in the variable assignmentContract
        assignmentContract = IAssignment4(_contractAddress);

        // Prepare and donate ether
        if (!donateEther()) {
            // Add the result to the history
            appendTestResult("Error with donate ether function", false, 0);
            return testId;
        }

        /*----------  EXERCISE A  ----------*/

        // Init the task A contract
        validatorTaskA.initContract(_contractAddress);

        if (hasFunction(address(validatorTaskA), "testExerciseA()", 0 ether)) {
            // Run tests
            (string memory messageA, bool successA) = validatorTaskA
                .testExerciseA{value: 0 ether}();
            if (successA) {
                // Add the result to the history
                appendTestResult(messageA, true, 5);
            } else {
                // Add the result to the history
                appendTestResult(messageA, false, 0);
            }
        } else {
            appendTestResult(
                "Exercise A: Some of the required functions are not correctly implemented. Validation not possible!",
                false,
                0
            );
        }

        /*----------  EXERCISE B  ----------*/

        // Init the task B contract
        validatorTaskB.initContract(_contractAddress);

        if (
            hasFunction(address(validatorTaskB), "testExerciseB()", 1000 gwei)
        ) {
            // Run tests
            (string memory messageB, bool successB) = validatorTaskB
                .testExerciseB{value: 1000 gwei}();
            if (successB) {
                // Add the result to the history
                appendTestResult(messageB, true, 5);
            } else {
                // Add the result to the history
                appendTestResult(messageB, false, 0);
            }
        } else {
            appendTestResult(
                "Exercise B: Some of the required functions are not correctly implemented. Validation not possible!",
                false,
                0
            );
        }

        /*----------  EXERCISE D  ----------*/

        // Init the task D contract
        validatorTaskD.initContract(
            _contractAddress,
            address(registryContract),
            address(coinContract)
        );

        if (hasFunction(address(validatorTaskD), "testExerciseD()", 200 gwei)) {
            // Run tests
            (string memory messageD, bool successD) = validatorTaskD
                .testExerciseD{value: 200 gwei}();

            if (successD) {
                // Add the result to the history
                appendTestResult(messageD, true, 5);
            } else {
                // Add the result to the history
                appendTestResult(messageD, false, 0);
            }
        } else {
            appendTestResult(
                "Exercise D: Some of the required functions are not correctly implemented. Validation not possible!",
                false,
                0
            );
        }

        return testId;
    }

    /*=============================================
    =                    HELPER                  =
    =============================================*/

    // Donate ether to the contract if the balance is 0
    function donateEther() public payable returns (bool) {
        if (address(assignmentContract).balance == 0) {
            try assignmentContract.donateEther{value: 100 gwei}() {
                return true;
            } catch {
                return false;
            }
        }
        return true;
    }

    /*=====          End of HELPER        ======*/
}
