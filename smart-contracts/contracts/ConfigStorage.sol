// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract ConfigStorage {
    // Amount of gas the user can get using the faucet
    int128 faucetGas;

    // Amount of blocks difference between last faucet usage
    int128 faucetBlockNoDifference;

    // Address of owner
    address owner;

    /**
     * Constructor to set default config values
     */
    constructor() {
        owner = msg.sender;

        faucetGas = 10;
        faucetBlockNoDifference = 10;
    }

    function getIntValue(string memory key) public view returns (int128) {
        if (compareStrings(key, "faucetGas") == true) {
            return faucetGas;
        } else if (compareStrings(key, "faucetBlockNoDifference") == true) {
            return faucetBlockNoDifference;
        }
        return 0;
    }

    function setIntValue(string memory key, int128 value) public {
        if (compareStrings(key, "faucetGas") == true) {
            faucetGas = value;
        } else if (compareStrings(key, "faucetBlockNoDifference") == true) {
            faucetBlockNoDifference = value;
        }
    }

    function compareStrings(string memory a, string memory b)
        public
        view
        returns (bool)
    {
        return (keccak256(abi.encodePacked((a))) ==
            keccak256(abi.encodePacked((b))));
    }
}
