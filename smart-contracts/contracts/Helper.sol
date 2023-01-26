// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity >=0.8.17;

import "../node_modules/@openzeppelin/contracts/utils/Strings.sol";

contract Helper {
    constructor() {}

    /*=============================================
    =                    HELPER                   =
    =============================================*/

    // Compare strings -> return true if equal (on keccak encoded byte level)
    function compareStrings(string memory a, string memory b)
        public
        pure
        returns (bool)
    {
        return (keccak256(abi.encodePacked((a))) ==
            keccak256(abi.encodePacked((b))));
    }

    // Build error message -> simple
    function buildErrorMessage(
        string memory _prefix,
        string memory _message,
        string memory _errorMsg
    ) public pure returns (string memory) {
        return
            string(abi.encodePacked(_prefix, ": ", _message, " > ", _errorMsg));
    }

    // Build error message -> extended
    function buildErrorMessageExtended(
        string memory _prefix,
        string memory _message,
        string memory _expected,
        string memory _actual
    ) public pure returns (string memory) {
        return
            string(
                abi.encodePacked(
                    _prefix,
                    ": ",
                    _message,
                    " Expected: ",
                    _expected,
                    " Actual: ",
                    _actual
                )
            );
    }

    /*=====  End of HELPER  ======*/
}
