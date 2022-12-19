// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "../contracts/BaseConfig.sol";

contract FaucetStorage is BaseConfig {
    // Keep struct to allow extending to more than one value
    struct faucetUser {
        // Block number when faucet last used
        uint256 blockNo;
    }

    // Mapping to store when user last used faucet
    mapping(address => faucetUser) Users;

    // Create event when faucet is used
    event faucetUsed(address _address, uint256 _blockNo);

    constructor(address _configContractAddress) {
        initAdmin(_configContractAddress, string("FaucetSorage"));
    }

    /*=============================================
    =               Faucet Methods                =
    =============================================*/

    function sendEth(address payable _address) public payable {
        uint256 currentBlockNumber = block.number;

        faucetUser memory obj = getFaucetUsage(_address);

        uint128 faucetBlockNoDifference = getConfigStorage().getIntValue(
            "faucetBlockNoDifference"
        );

        // Make sure the faucet has enough funds to send
        require(
            address(this).balance >= faucetBlockNoDifference,
            "Not enough funds in faucet!"
        );

        // Make sure the faucet has not been used recently by the address
        if (
            obj.blockNo > 0 &&
            currentBlockNumber - obj.blockNo < faucetBlockNoDifference
        ) {
            revert("Faucet used too recently!");
        }

        // Get the amount of gas to send
        uint128 faucetGas = getConfigStorage().getIntValue("faucetGas");

        // Send the gas

        (bool success, ) = _address.call{value: faucetGas * (10**18)}(
            "Ether sent successfully!"
        );

        if (success) {
            // Register the faucet usage
            addFaucetUsage(_address, currentBlockNumber);
        }

        // Make sure the transfer was successful
        require(success, "Transfer failed.");
    }

    function addFaucetUsage(address _address, uint256 _blockNo) public {
        faucetUser memory obj = faucetUser(_blockNo);

        Users[_address] = obj;

        emit faucetUsed(_address, _blockNo);
    }

    function getFaucetUsage(address _address)
        public
        view
        returns (faucetUser memory)
    {
        return Users[_address];
    }

    /**
     * Get the balance of the faucet
     */
    function getFaucetBalance() public view returns (uint256) {
        return address(this).balance;
    }

    /*=====     End of Faucet Methods      ======*/

    /*=============================================
    =            Ether (ETH) functions            =
    =============================================*/

    event Received(address, uint256);

    receive() external payable {
        emit Received(msg.sender, msg.value);
    }

    /*=====  End of Ethereum functions  ======*/
}
