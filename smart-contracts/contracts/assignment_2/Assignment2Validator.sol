// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

// Import the Assignment1Interface.sol
import "../assignment_2/Assignment2Interface.sol";

// Import the Assignment1ValidatorTaskB.sol
import "../assignment_2/Assignment2ValidatorTaskB.sol";

// Import the base assignment validator contract
import "../../contracts/BaseAssignmentValidator.sol";

// Import the coin interface
import "../assignment_2/Assignment2CoinInterface.sol";

// Give the contract a name and inherit from the base assignment validator
contract Assignment2Validator is BaseAssignmentValidator {
    address validatorTaskBAddress;

    // Import empty constructor and pass the name of the contract to the config storage contract
    constructor(address _configContractAddress, address _validatorTaskBAddress)
        BaseAssignmentValidator(
            _configContractAddress,
            "SS23 Assignment 2 Validator Contract",
            0.03 ether
        )
    {
        // The constructor is empty
        validatorTaskBAddress = _validatorTaskBAddress;
    }

    // Test the assignment
    function test(address _contractAddress)
        public
        payable
        override(BaseAssignmentValidator)
        returns (uint256)
    {
        /**
         *  Create a new history entry in the smart contract
         *
         *  The history entry is used to store the results of the tests.
         *  Always use this index in the further functions.
         */
        createTestHistory(_contractAddress);

        // Call the contract interface which needs to be tested and store it in the variable assignmentContract
        Assignment2Interface assignmentContract = Assignment2Interface(
            _contractAddress
        );

        /*----------  EXERCISE A  ----------*/
        (string memory messageA, bool resultA) = testExerciseA(
            assignmentContract
        );

        if (resultA) {
            // If the test passed, add the result to the history
            appendTestResult(messageA, true, 1);

            // Create Task B validator contract
            Assignment2ValidatorTaskB validatorB = Assignment2ValidatorTaskB(
                validatorTaskBAddress
            );

            bool success = validatorB.initContract(_contractAddress);
            if (success) {
                /*----------  EXERCISE B - ADD LIQUIDITY  ----------*/
                try
                    validatorB.testExerciseBAddLiquidity{value: 0.01 ether}()
                returns (string memory messageB, bool resultB) {
                    if (resultB) {
                        appendTestResult(messageB, true, 1);
                    } else {
                        appendTestResult(messageB, false, 0);
                    }
                } catch {
                    appendTestResult(
                        "EXERCISE B - ADD LIQUIDITY: Transaction failed",
                        false,
                        0
                    );
                }

                /*----------  EXERCISE B - REMOVE LIQUIDITY  ----------*/

                try validatorB.testExerciseBRemoveLiquidity() returns (
                    string memory messageC,
                    bool resultC
                ) {
                    if (resultC) {
                        appendTestResult(messageC, true, 1);
                    } else {
                        appendTestResult(messageC, false, 0);
                    }
                } catch {
                    appendTestResult(
                        "EXERCISE B - REMOVE LIQUIDITY: Transaction failed",
                        false,
                        0
                    );
                }

                /*----------  EXERCISE B - GET TOKEN AMOUNT  ----------*/

                try validatorB.testExerciseBGetTokenAmount() returns (
                    string memory messageF,
                    bool resultF
                ) {
                    if (resultF) {
                        appendTestResult(messageF, true, 1);
                    } else {
                        appendTestResult(messageF, false, 0);
                    }
                } catch {
                    appendTestResult(
                        "EXERCISE B - GET TOKEN AMOUNT: Transaction failed",
                        false,
                        0
                    );
                }

                /*----------  EXERCISE B - GET ETH AMOUNT  ----------*/
                try validatorB.testExerciseBGetEthAmount() returns (
                    string memory messageG,
                    bool resultG
                ) {
                    if (resultG) {
                        appendTestResult(messageG, true, 1);
                    } else {
                        appendTestResult(messageG, false, 0);
                    }
                } catch {
                    appendTestResult(
                        "EXERCISE B - GET ETH AMOUNT: Transaction failed",
                        false,
                        0
                    );
                }

                /*----------  EXERCISE B - ETH TO TOKEN  ----------*/
                try
                    validatorB.testExerciseBEthToToken{value: 0.01 ether}()
                returns (string memory messageD, bool resultD) {
                    if (resultD) {
                        appendTestResult(messageD, true, 1);
                    } else {
                        appendTestResult(messageD, false, 0);
                    }
                } catch {
                    appendTestResult(
                        "EXERCISE B - ETH TO TOKEN: Transaction failed",
                        false,
                        0
                    );
                }

                /*----------  EXERCISE B - TOKEN TO ETH  ----------*/
                try validatorB.testExerciseBTokenToEth() returns (
                    string memory messageE,
                    bool resultE
                ) {
                    if (resultE) {
                        appendTestResult(messageE, true, 1);
                    } else {
                        appendTestResult(messageE, false, 0);
                    }
                } catch {
                    appendTestResult(
                        "EXERCISE B - TOKEN TO ETH: Transaction failed",
                        false,
                        0
                    );
                }
            }
        } else {
            // If the test failed, add the result to the history
            appendTestResult(messageA, false, 0);
        }

        // Return the history index
        return _testHistoryCounter;
    }

    /**
     * TEST EXERCISE A
     *
     * - test getTokenAddress function
     * - test mint function
     */
    function testExerciseA(Assignment2Interface assignmentContract)
        private
        returns (string memory, bool)
    {
        /*----------  EXERCISE A  ----------*/

        (bool success, address tokenAddress) = catchTokenAddress(
            assignmentContract
        );

        if (success == false) {
            return (
                "Error (Exercise A): Error with the getTokenAddress function!",
                false
            );
        } else {
            uint256 tokenBalanceBefore = IERC20(tokenAddress).balanceOf(
                address(this)
            );

            try
                Assignment2CoinInterface(tokenAddress).mint(
                    address(this),
                    10 ether
                )
            {
                uint256 tokenBalanceAfter = IERC20(tokenAddress).balanceOf(
                    address(this)
                );

                if (tokenBalanceAfter - tokenBalanceBefore == 10 ether) {
                    return ("Exercise A: Passed!", true);
                } else {
                    return (
                        "Error (Exercise A): The token balance is not correct!",
                        false
                    );
                }
            } catch {
                return (
                    "Error (Exercise A): Error with the mint function!",
                    false
                );
            }
        }
    }

    /*=============================================
    =                    HELPER                  =
    =============================================*/

    // Catch the token address function getTokenAddress
    function catchTokenAddress(Assignment2Interface assignmentContract)
        public
        view
        returns (bool, address)
    {
        try assignmentContract.getTokenAddress() returns (
            address _tokenAddress
        ) {
            return (true, _tokenAddress);
        } catch {
            return (false, address(0));
        }
    }

    /*=====          End of HELPER        ======*/
}
