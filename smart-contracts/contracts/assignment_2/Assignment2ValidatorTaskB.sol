// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

// Import the Assignment1Interface.sol
import "../assignment_2/Assignment2Interface.sol";

// Give the contract a name and inherit from the base assignment validator
contract Assignment2ValidatorTaskB {
    Assignment2Interface assignmentContract;

    address exchangeAddress;
    address tokenAddress;
    address validatorAddress;

    constructor() {}

    function initContract(address _exchangeAddress) public returns (bool) {
        Assignment2Interface _assignmentContract = Assignment2Interface(
            _exchangeAddress
        );

        (bool success, address _tokenAddres) = catchTokenAddress(
            _assignmentContract
        );

        if (success) {
            tokenAddress = _tokenAddres;
        } else {
            return false;
        }

        exchangeAddress = _exchangeAddress;
        validatorAddress = address(this);

        assignmentContract = _assignmentContract;

        return true;
    }

    /**
     * TEST EXERCISE B
     * - test addLiquidity function
     */
    function testExerciseBAddLiquidity()
        public
        payable
        returns (string memory, bool)
    {
        /*----------  EXERCISE B  ----------*/

        // Add some liquidity if reserve is empty
        if (getReserve() == 0) {
            try
                assignmentContract.addLiquidity{value: 0.001 ether}(2)
            {} catch Error(string memory _reason) {
                return (
                    string(
                        abi.encodePacked(
                            "Error (Exercise B): Error with the addLiquidity function! ",
                            _reason
                        )
                    ),
                    false
                );
            }
        }

        // ETH amount to send
        uint256 testMsgValue = 0.001 ether;

        // Calculate the amount of tokens to buy
        uint256 ethReserve = exchangeAddress.balance - testMsgValue;
        uint256 tokenReserve = getReserve();
        uint256 tokenAmount = (testMsgValue * tokenReserve) / ethReserve;

        // Token amount to buy
        uint256 testTokenAmount = tokenAmount + 1;

        uint256 liquidity = (assignmentContract.totalSupply() * msg.value) /
            ethReserve;

        // Token of validatorAddress before
        uint256 tokenBalanceBefore = IERC20(tokenAddress).balanceOf(
            validatorAddress
        );

        // Exchange token before
        uint256 exchangeTokenBalanceBefore = IERC20(exchangeAddress).balanceOf(
            validatorAddress
        );

        // addLiquidity function
        try
            assignmentContract.addLiquidity{value: testMsgValue}(
                testTokenAmount
            )
        returns (uint256 addLiquidity) {
            if (addLiquidity != liquidity) {
                return (
                    "Error (Exercise B - addLiquidity): The liquidity is not correct!",
                    false
                );
            }

            // Token of validatorAddress after
            uint256 tokenBalanceAfter = IERC20(tokenAddress).balanceOf(
                validatorAddress
            );

            if (tokenBalanceBefore - testTokenAmount != tokenBalanceAfter) {
                return (
                    "Error (Exercise B - addLiquidity): The token balance is not correct!",
                    false
                );
            }

            // Exchange token after
            uint256 exchangeTokenBalanceAfter = IERC20(exchangeAddress)
                .balanceOf(validatorAddress);

            if (
                exchangeTokenBalanceBefore + liquidity !=
                exchangeTokenBalanceAfter
            ) {
                return (
                    "Error (Exercise B - addLiquidity): The exchange token balance is not correct!",
                    false
                );
            }
        } catch Error(string memory _reason) {
            return (
                string(
                    abi.encodePacked(
                        "Error (Exercise B - addLiquidity): Error with the removeLiquidity function!",
                        _reason
                    )
                ),
                false
            );
        }

        return ("Exercise B (addLiquidity): Passed!", true);
    }

    /**
     * TEST EXERCISE B
     * - test removeLiquidity function
     */
    function testExerciseBRemoveLiquidity()
        public
        returns (string memory, bool)
    {
        uint256 testRemoveAmount = 1;

        uint256 exchangeBalanceBefore = assignmentContract.balanceOf(
            validatorAddress
        );
        if (exchangeBalanceBefore > 1) {
            testRemoveAmount = exchangeBalanceBefore - 1;
        }

        uint256 supply = assignmentContract.totalSupply();
        uint256 ethAmount = (exchangeAddress.balance * testRemoveAmount) /
            supply;
        uint256 tokenAmount = (getReserve() * testRemoveAmount) / supply;

        // Get eth balance of validator before
        uint256 ethBalanceBefore = validatorAddress.balance;
        uint256 tokenBalanceBefore = IERC20(tokenAddress).balanceOf(
            validatorAddress
        );
        try assignmentContract.removeLiquidity(testRemoveAmount) {
            // Get eth balance of validator after
            uint256 ethBalanceAfter = validatorAddress.balance;
            uint256 tokenBalanceAfter = IERC20(tokenAddress).balanceOf(
                validatorAddress
            );
            uint256 exchangeBalanceAfter = assignmentContract.balanceOf(
                validatorAddress
            );

            if (
                exchangeBalanceBefore - testRemoveAmount != exchangeBalanceAfter
            ) {
                return (
                    "Error (Exercise B - removeLiquidity): Burning of the exchange token did not work properly!",
                    false
                );
            }

            if (ethBalanceBefore + ethAmount != ethBalanceAfter) {
                return (
                    "Error (Exercise B - removeLiquidity): The ETH balance is not correct!",
                    false
                );
            }

            if (tokenBalanceBefore + tokenAmount != tokenBalanceAfter) {
                return (
                    "Error (Exercise B - removeLiquidity): The token balance is not correct!",
                    false
                );
            }
        } catch Error(string memory _reason) {
            return (
                string(
                    abi.encodePacked(
                        "Error (Exercise B - removeLiquidity): Error with the removeLiquidity function!",
                        _reason
                    )
                ),
                false
            );
        }

        return ("Exercise B (removeLiquidity): Passed!", true);
    }

    /**
     * TEST EXERCISE B
     * - test getTokenAmount function
     */
    function testExerciseBGetTokenAmount()
        public
        view
        returns (string memory, bool)
    {
        // ethSold
        uint256 ethSold = 0.001 ether;

        uint256 expectedTokenAmount = getAmount(
            ethSold,
            exchangeAddress.balance,
            getReserve()
        );

        try assignmentContract.getTokenAmount(ethSold) returns (
            uint256 realTokenAmount
        ) {
            if (expectedTokenAmount != realTokenAmount) {
                return (
                    "Error (Exercise B - getTokenAmount): The token amount is not correct!",
                    false
                );
            }
        } catch Error(string memory _reason) {
            return (
                string(
                    abi.encodePacked(
                        "Error (Exercise B - getTokenAmount): Error with the getTokenAmount function!",
                        _reason
                    )
                ),
                false
            );
        }

        return ("Exercise B (getTokenAmount): Passed!", true);
    }

    /**
     * TEST EXERCISE B
     * - test getEthAmount function
     */
    function testExerciseBGetEthAmount()
        public
        view
        returns (string memory, bool)
    {
        // tokenSold
        uint256 tokenSold = 1;

        uint256 expectedEthAmount = getAmount(
            tokenSold,
            getReserve(),
            exchangeAddress.balance
        );

        try assignmentContract.getEthAmount(tokenSold) returns (
            uint256 realEthAmount
        ) {
            if (expectedEthAmount != realEthAmount) {
                return (
                    "Error (Exercise B - getEthAmount): The ETH amount is not correct!",
                    false
                );
            }
        } catch Error(string memory _reason) {
            return (
                string(
                    abi.encodePacked(
                        "Error (Exercise B - getEthAmount): Error with the getEthAmount function!",
                        _reason
                    )
                ),
                false
            );
        }

        return ("Exercise B (getEthAmount): Passed!", true);
    }

    /**
     * TEST EXERCISE B
     * - test ethToToken function
     */
    function testExerciseBEthToToken()
        public
        payable
        returns (string memory, bool)
    {
        uint256 minToken = 1;

        uint256 msgValue = 0.001 ether;

        uint256 expectedTokenBought = getAmount(
            msgValue,
            exchangeAddress.balance - msgValue,
            getReserve()
        );

        uint256 tokenBalanceBefore = IERC20(tokenAddress).balanceOf(
            validatorAddress
        );

        try assignmentContract.ethToToken{value: msgValue}(minToken) {
            uint256 tokenBalanceAfter = IERC20(tokenAddress).balanceOf(
                validatorAddress
            );

            if (tokenBalanceBefore + expectedTokenBought != tokenBalanceAfter) {
                return (
                    "Error (Exercise B - ethToToken): The token balance is not correct!",
                    false
                );
            }
        } catch Error(string memory _reason) {
            return (
                string(
                    abi.encodePacked(
                        "Error (Exercise B - ethToToken): Error with the ethToToken function!",
                        _reason
                    )
                ),
                false
            );
        }

        return ("Exercise B (ethToToken): Passed!", true);
    }

    /**
     * TEST EXERCISE B
     * - test tokenToEth function
     */
    function testExerciseBTokenToEth() public returns (string memory, bool) {
        uint256 tokenSold = 1;
        uint256 minEth = 0.001 ether;

        uint256 expectedEthBought = getAmount(
            tokenSold,
            exchangeAddress.balance,
            getReserve()
        );

        uint256 ethBalanceBefore = validatorAddress.balance;
        uint256 tokenBalanceBefore = IERC20(tokenAddress).balanceOf(
            validatorAddress
        );

        try assignmentContract.tokenToEth(tokenSold, minEth) {
            uint256 ethBalanceAfter = validatorAddress.balance;
            uint256 tokenBalanceAfter = IERC20(tokenAddress).balanceOf(
                validatorAddress
            );

            if (tokenBalanceBefore - tokenSold != tokenBalanceAfter) {
                return (
                    "Error (Exercise B - tokenToEth): The token balance is not correct!",
                    false
                );
            }

            if (ethBalanceBefore + expectedEthBought != ethBalanceAfter) {
                return (
                    "Error (Exercise B - tokenToEth): The ETH balance is not correct!",
                    false
                );
            }
        } catch Error(string memory _reason) {
            return (
                string(
                    abi.encodePacked(
                        "Error (Exercise B - tokenToEth): Error with the tokenToEth function!",
                        _reason
                    )
                ),
                false
            );
        }

        return ("Exercise B (tokenToEth): Passed!", true);
    }

    /*=============================================
    =                    HELPER                  =
    =============================================*/

    // Catch the token address function getTokenAddress
    function catchTokenAddress(Assignment2Interface assignment_contract)
        public
        view
        returns (bool, address)
    {
        try assignment_contract.getTokenAddress() returns (
            address _tokenAddress
        ) {
            return (true, _tokenAddress);
        } catch {
            return (false, address(0));
        }
    }

    function getReserve() public view returns (uint256) {
        return IERC20(tokenAddress).balanceOf(exchangeAddress);
    }

    function getAmount(
        uint256 inputAmount,
        uint256 inputReserve,
        uint256 outputReserve
    ) private pure returns (uint256) {
        uint256 inputAmountWithFee = inputAmount * 99;
        uint256 numerator = inputAmountWithFee * outputReserve;
        uint256 denominator = (inputReserve * 100) + inputAmountWithFee;

        // return (inputAmount * outputReserve) / (inputReserve + inputAmount);
        return numerator / denominator;
    }

    /*=====          End of HELPER        ======*/
}
