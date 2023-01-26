// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

// Import the IAssignment2.sol
import "./interface/IAssignment2.sol";

// Import the coin interface
import "./interface/IAssignment2Coin.sol";

// Import the registry to use as interface
import "./helper/Assignment2Registry.sol";

// Import Helper
import "../Helper.sol";

// import "BaseConfig.sol";
import "../BaseConfig.sol";

contract Validator2TaskD is Helper, BaseConfig {
    // assignment contract interface
    IAssignment2 assignmentContract;

    // Address of registry contract
    address registryAddress;

    // Address of test token contract
    address tokenTestAddress;

    constructor(address _configContractAddress) {
        initAdmin(
            _configContractAddress,
            "SS23 Assignment 2 Validator Contract - Task D"
        );
    }

    receive() external payable {}

    // Init contract
    function initContract(
        address _contractAddress,
        address _registryAddress,
        address _testToken
    ) public {
        // Call the contract interface which needs to be tested and store it in the variable assignmentContract
        assignmentContract = IAssignment2(_contractAddress);

        // Set registry address
        registryAddress = _registryAddress;

        // Set test token address
        tokenTestAddress = _testToken;
    }

    /**
     * TEST EXERCISE D
     *
     * - test tokenToTokenSwap function
     */
    function testExerciseD() public payable returns (string memory, bool) {
        /*----------  EXERCISE D  ----------*/

        address validatorAddress = address(this);
        address exchange2Address = Assignment2Registry(registryAddress)
            .getExchange(tokenTestAddress);

        IAssignment2Coin tokenStudent = IAssignment2Coin(
            assignmentContract.getTokenAddress()
        );

        IAssignment2Coin tokenTest = IAssignment2Coin(tokenTestAddress);

        IAssignment2 exchangeTest = IAssignment2(exchange2Address);

        // SWAP TOKENS

        // Collect balance before

        // Get student token before
        uint256 tokenStudentBalanceBefore = tokenStudent.balanceOf(
            validatorAddress
        );

        // Get test token before
        uint256 tokenTestBalanceBefore = tokenTest.balanceOf(validatorAddress);

        // SWAP

        uint256 tokensSold = 100 gwei;

        // Mint tokens for the validator
        tokenStudent.mint(validatorAddress, 1000 gwei);
        tokenTest.mint(validatorAddress, 1000 gwei);

        // Calculate eth amount
        uint256 tokenBought = 10 gwei;

        // Set Allowance
        tokenStudent.approve(address(assignmentContract), 1000 gwei);
        tokenTest.approve(address(assignmentContract), 1000 gwei);
        tokenTest.approve(address(exchangeTest), 1000 gwei);

        try exchangeTest.addLiquidity{value: 10 gwei}(200 gwei) {} catch Error(
            string memory _reason
        ) {
            return (
                string(
                    abi.encodePacked(
                        "Error (Exercise D): addLiquidity problem - ",
                        _reason
                    )
                ),
                false
            );
        }

        try
            assignmentContract.tokenToTokenSwap{value: 100 gwei}(
                tokensSold,
                tokenBought,
                tokenTestAddress
            )
        {
            // Get student token after
            uint256 tokenStudentBalanceAfter = tokenStudent.balanceOf(
                validatorAddress
            );

            // Get test token after
            uint256 tokenTestBalanceAfter = tokenTest.balanceOf(
                validatorAddress
            );

            if (tokenStudentBalanceAfter <= tokenStudentBalanceBefore) {
                return (
                    "Error (Exercise D): The exchange token balance is not correct!",
                    false
                );
            }

            if (tokenTestBalanceAfter <= tokenTestBalanceBefore) {
                return (
                    "Error (Exercise D): The test token balance is not correct!",
                    false
                );
            }
        } catch Error(string memory _reason) {
            return (
                string(
                    abi.encodePacked(
                        "Error (Exercise D): TOKEN TO TOKEN - ",
                        _reason
                    )
                ),
                false
            );
        }

        return ("Exercise D: All tests passed!", true);
    }
}
