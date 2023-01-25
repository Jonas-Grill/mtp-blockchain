// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

// Import the Assignment1Interface.sol
import "../assignment_2/Assignment2Interface.sol";

// Import the Assignment1ValidatorTaskB.sol
import "../assignment_2/Assignment2ValidatorTaskB.sol";

// Import the base assignment validator contract
import "../../contracts/BaseValidator.sol";

// Import the coin interface
import "../assignment_2/Assignment2CoinInterface.sol";

// Import the registry contract
import "../assignment_2/Assignment2Registry.sol";

// Give the contract a name and inherit from the base assignment validator
contract Assignment2Validator is BaseValidator {
    address validatorTaskBAddress;

    // Test Token address
    address tokenTestAddress;
    // Registry address
    address registryAddress;

    // Import empty constructor and pass the name of the contract to the config storage contract
    constructor(
        address _configContractAddress,
        address _validatorTaskBAddress,
        address _tokenTestAddress,
        address _registryAddress
    )
        BaseValidator(
            _configContractAddress,
            "SS23 Assignment 2 Validator Contract",
            50000 gwei
        )
    {
        // The constructor is empty
        validatorTaskBAddress = _validatorTaskBAddress;

        tokenTestAddress = _tokenTestAddress;
        registryAddress = _registryAddress;
    }

    receive() external payable {}

    // Test the assignment
    function test(address _contractAddress)
        public
        payable
        override(BaseValidator)
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

            // Send eth to contract if balance is 0
            if (_contractAddress.balance == 0) {
                assignmentContract.donateEther{value: 100 gwei}();
            }

            // Create Task B validator contract
            Assignment2ValidatorTaskB validatorB = Assignment2ValidatorTaskB(
                payable(validatorTaskBAddress)
            );

            bool initContractSuccess = validatorB.initContract(
                _contractAddress
            );
            if (initContractSuccess) {
                /*----------  EXERCISE B - ADD LIQUIDITY  ----------*/
                try
                    validatorB.testExerciseBAddLiquidity{value: 200 gwei}()
                returns (string memory message, bool success) {
                    if (success) {
                        appendTestResult(message, true, 1);
                    } else {
                        appendTestResult(message, false, 0);
                    }
                } catch Error(string memory _reason) {
                    appendTestResult(
                        string(
                            abi.encodePacked(
                                "Error (Exercise B): ADD LIQUIDITY - ",
                                _reason
                            )
                        ),
                        false,
                        0
                    );
                }

                /*----------  EXERCISE B - REMOVE LIQUIDITY  ----------*/

                try
                    validatorB.testExerciseBRemoveLiquidity{value: 100 gwei}()
                returns (string memory message, bool success) {
                    if (success) {
                        appendTestResult(message, true, 1);
                    } else {
                        appendTestResult(message, false, 0);
                    }
                } catch Error(string memory _reason) {
                    appendTestResult(
                        string(
                            abi.encodePacked(
                                "Error (Exercise B): REMOVE LIQUIDITY - ",
                                _reason
                            )
                        ),
                        false,
                        0
                    );
                }

                /*----------  EXERCISE B - GET TOKEN AMOUNT  ----------*/

                try validatorB.testExerciseBGetTokenAmount() returns (
                    string memory message,
                    bool success
                ) {
                    if (success) {
                        appendTestResult(message, true, 1);
                    } else {
                        appendTestResult(message, false, 0);
                    }
                } catch Error(string memory _reason) {
                    appendTestResult(
                        string(
                            abi.encodePacked(
                                "Error (Exercise B): GET TOKEN AMOUNT - ",
                                _reason
                            )
                        ),
                        false,
                        0
                    );
                }

                /*----------  EXERCISE B - GET ETH AMOUNT  ----------*/
                try validatorB.testExerciseBGetEthAmount() returns (
                    string memory message,
                    bool success
                ) {
                    if (success) {
                        appendTestResult(message, true, 1);
                    } else {
                        appendTestResult(message, false, 0);
                    }
                } catch Error(string memory _reason) {
                    appendTestResult(
                        string(
                            abi.encodePacked(
                                "Error (Exercise B): GET ETH AMOUNT - ",
                                _reason
                            )
                        ),
                        false,
                        0
                    );
                }

                /*----------  EXERCISE B - ETH TO TOKEN  ----------*/
                try
                    validatorB.testExerciseBEthToToken{value: 100 gwei}()
                returns (string memory message, bool success) {
                    if (success) {
                        appendTestResult(message, true, 1);
                    } else {
                        appendTestResult(message, false, 0);
                    }
                } catch Error(string memory _reason) {
                    appendTestResult(
                        string(
                            abi.encodePacked(
                                "Error (Exercise B): ETH TO TOKEN - ",
                                _reason
                            )
                        ),
                        false,
                        0
                    );
                }

                /*----------  EXERCISE B - TOKEN TO ETH  ----------*/
                try
                    validatorB.testExerciseBTokenToEth{value: 100 gwei}()
                returns (string memory message, bool success) {
                    if (success) {
                        appendTestResult(message, true, 1);
                    } else {
                        appendTestResult(message, false, 0);
                    }
                } catch Error(string memory _reason) {
                    appendTestResult(
                        string(
                            abi.encodePacked(
                                "Error (Exercise B): TOKEN TO ETH - ",
                                _reason
                            )
                        ),
                        false,
                        0
                    );
                }

                /*---------- EXERCISE D - TOKEN TO TOKEN ----------*/
                (string memory messageD, bool resultD) = testExerciseD(
                    assignmentContract
                );

                if (resultD) {
                    appendTestResult(messageD, true, 1);
                } else {
                    appendTestResult(messageD, false, 0);
                }
            } else {
                appendTestResult(
                    "Error: Could not create the validator contract",
                    false,
                    0
                );
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

        uint256 testCounter = 0;

        (bool success, address tokenAddress) = catchTokenAddress(
            assignmentContract
        );

        if (success == false) {
            return (
                "Error (Exercise A): Error with the getTokenAddress function!",
                false
            );
        } else {
            uint256 tokenBalanceBeforeTaskB = IERC20(tokenAddress).balanceOf(
                validatorTaskBAddress
            );

            uint256 amount = 10000 gwei;

            try
                Assignment2CoinInterface(tokenAddress).mint(
                    validatorTaskBAddress,
                    amount
                )
            {
                uint256 tokenBalanceAfterTaskB = IERC20(tokenAddress).balanceOf(
                    validatorTaskBAddress
                );

                if (
                    tokenBalanceAfterTaskB - tokenBalanceBeforeTaskB == amount
                ) {
                    testCounter++;
                } else {
                    return (
                        "Error (Exercise A): The token balance for the validator contract is not correct!",
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

        if (testCounter == 1) {
            return ("Exercise A: All tests passed!", true);
        } else {
            return ("Exercise A: Not all tests passed!", false);
        }
    }

    /**
     * TEST EXERCISE D
     *
     * - test tokenToTokenSwap function
     */
    function testExerciseD(Assignment2Interface assignmentContract)
        private
        returns (string memory, bool)
    {
        /*----------  EXERCISE D  ----------*/

        address validatorAddress = address(this);
        address exchange2Address = Assignment2Registry(registryAddress)
            .getExchange(tokenTestAddress);

        Assignment2CoinInterface tokenStudent = Assignment2CoinInterface(
            assignmentContract.getTokenAddress()
        );

        Assignment2CoinInterface tokenTest = Assignment2CoinInterface(
            tokenTestAddress
        );

        Assignment2Interface exchangeTest = Assignment2Interface(
            exchange2Address
        );

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

    /*=============================================
    =                    HELPER                  =
    =============================================*/

    function getAmount(
        uint256 inputAmount,
        uint256 inputReserve,
        uint256 outputReserve
    ) private pure returns (uint256) {
        uint256 inputAmountWithFee = inputAmount * 99;
        uint256 numerator = inputAmountWithFee * outputReserve;
        uint256 denominator = (inputReserve * 100) + inputAmountWithFee;

        require(denominator > 0, "ERR_ZERO_DENOMINATOR");
        return numerator / denominator;
    }

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
