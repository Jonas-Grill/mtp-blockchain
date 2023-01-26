// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

// Import the Interfaces
import "./interface/IAssignment2.sol";
import "./interface/IAssignment2Coin.sol";

// Import the registry contract to use as Interface
import "./helper/Assignment2Registry.sol";

// Import the exchange
import "./helper/Assignment2Exchange.sol";

// Import the Coin
import "./helper/Assignment2Coin.sol";

// Import the base assignment validator contract
import "../BaseValidator.sol";

// Import Task A, B, C, D
import "./Validator2TaskA.sol";
import "./Validator2TaskB.sol";
import "./Validator2TaskD.sol";

// Give the contract a name and inherit from the base assignment validator
contract Validator2 is BaseValidator {
    // Contract to validate
    IAssignment2 assignmentContract;

    // Task A, B, C and D
    Validator2TaskA validatorTaskA;
    Validator2TaskB validatorTaskB;
    Validator2TaskD validatorTaskD;

    // Registry contract
    Assignment2Registry registryContract;

    // Coin contract
    Assignment2Coin coinContract;

    // Exchange contract
    Assignment2Exchange exchangeContract;

    constructor(address _configContractAddress)
        payable
        BaseValidator(
            _configContractAddress,
            "SS23 Assignment 2 Validator Contract - Base",
            20000 gwei
        )
    {
        // Task A, B, C and D
        validatorTaskA = new Validator2TaskA(_configContractAddress);
        validatorTaskB = new Validator2TaskB(_configContractAddress);
        validatorTaskD = new Validator2TaskD(_configContractAddress);

        // Assign contracts to the list of helper contracts
        addHelperContracts(address(validatorTaskA));
        addHelperContracts(address(validatorTaskB));
        addHelperContracts(address(validatorTaskD));

        // Create a new coin contract
        coinContract = new Assignment2Coin(
            "SS23 Coin - Assignment 2",
            "SS23",
            _configContractAddress
        );
        addHelperContracts(address(coinContract));

        // Create a new exchange contract
        exchangeContract = new Assignment2Exchange{value: 2000 gwei}(
            address(coinContract),
            _configContractAddress
        );
        addHelperContracts(address(exchangeContract));

        // Create a new registry contract
        registryContract = new Assignment2Registry(
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
        assignmentContract = IAssignment2(_contractAddress);

        // Prepare and donate ether
        if (!donateEther()) {
            // Add the result to the history
            appendTestResult("Error with donate ether function", false, 0);
            return testId;
        }

        /*----------  EXERCISE A  ----------*/

        // Init the task A contract
        validatorTaskA.initContract(_contractAddress);

        // Run tests
        (string memory messageA, bool successA) = validatorTaskA.testExerciseA{
            value: 0 ether
        }();
        if (successA) {
            // Add the result to the history
            appendTestResult(messageA, true, 5);
        } else {
            // Add the result to the history
            appendTestResult(messageA, false, 0);
        }

        /*----------  EXERCISE B  ----------*/

        // Init the task B contract
        validatorTaskB.initContract(_contractAddress);

        // Run tests
        (string memory messageB, bool successB) = validatorTaskB.testExerciseB{
            value: 1000 gwei
        }();
        if (successB) {
            // Add the result to the history
            appendTestResult(messageB, true, 5);
        } else {
            // Add the result to the history
            appendTestResult(messageB, false, 0);
        }

        /*----------  EXERCISE D  ----------*/

        // Init the task D contract
        validatorTaskD.initContract(
            _contractAddress,
            address(registryContract),
            address(coinContract)
        );

        // Run tests
        (string memory messageD, bool successD) = validatorTaskD.testExerciseD{
            value: 200 gwei
        }();

        if (successD) {
            // Add the result to the history
            appendTestResult(messageD, true, 5);
        } else {
            // Add the result to the history
            appendTestResult(messageD, false, 0);
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
