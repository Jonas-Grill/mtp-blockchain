// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

// Import IERC20.sol
import "../../node_modules/@openzeppelin/contracts/token/ERC20/IERC20.sol";

// Import the IAssignment4.sol
import "./interface/IAssignment4.sol";

// Import coin interface
import "./interface/IAssignment4Coin.sol";

// Import Helper
import "../Helper.sol";

// import "BaseConfig.sol";
import "../BaseConfig.sol";

contract Validator4TaskA is Helper, BaseConfig {
    // assignment contract interface
    IAssignment4 assignmentContract;

    // Address of the validator contract for task A
    address validatorAddress;

    constructor(address _configContractAddress) {
        initAdmin(
            _configContractAddress,
            "SS23 Assignment 4 Validator Contract - Task A"
        );
    }

    receive() external payable {}

    // Init contract
    function initContract(address _contractAddress) public {
        // Call the contract interface which needs to be tested and store it in the variable assignmentContract
        assignmentContract = IAssignment4(_contractAddress);

        validatorAddress = address(this);
    }

    /**
     * TEST EXERCISE A
     *
     * - test getTokenAddress function
     * - test mint function
     */
    function testExerciseA() public payable returns (string memory, bool) {
        /*----------  EXERCISE A  ----------*/

        uint256 testCounter = 0;

        address tokenAddress = address(0);

        try assignmentContract.getTokenAddress() returns (
            address _tokenAddress
        ) {
            tokenAddress = _tokenAddress;
        } catch {
            return (
                "Error (Exercise A): Error with the getTokenAddress function!",
                false
            );
        }

        if (tokenAddress == address(0)) {
            return (
                "Error (Exercise A): The token address is not correct!",
                false
            );
        }

        uint256 tokenBalanceBeforeTaskB = IERC20(tokenAddress).balanceOf(
            validatorAddress
        );

        uint256 amount = 10000 gwei;

        try IAssignment4Coin(tokenAddress).mint(validatorAddress, amount) {
            uint256 tokenBalanceAfterTaskB = IERC20(tokenAddress).balanceOf(
                validatorAddress
            );

            if (tokenBalanceAfterTaskB - tokenBalanceBeforeTaskB == amount) {
                testCounter++;
            } else {
                return (
                    "Error (Exercise A): The token balance for the validator contract is not correct!",
                    false
                );
            }
        } catch {
            return ("Error (Exercise A): Error with the mint function!", false);
        }

        return ("Exercise A: All tests passed!", true);
    }
}
