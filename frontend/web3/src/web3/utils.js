/*
Store some utility functions
*/

class NOWUtils {
    /**
     * Returns the eth amount from wei
     *
     * @param {int} wei
     * @returns eth
     */
    weiToEth(wei) {
        return Number(wei) / Number(1000000000000000000);
    }

    /**
     * Returns the wei amount from eth
     *
     * @param {float} eth
     */
    ethToWei(eth) {
        return parseFloat(eth) * Number(1000000000000000000);
    }

    /**
     * Returns the object of the smart contract
     *
     * @param {string} contractName name of the json contract file without the json suffix
     * @return json object
     */
    getContractJson(contractName) {

        const ConfigStorage = require('../../../../smart-contracts/build/contracts/ConfigStorage.json')
        const FaucetStorage = require('../../../../smart-contracts/build/contracts/FaucetStorage.json')
        const ExampleAssignmentValidator = require('../../../../smart-contracts/build/contracts/ExampleAssignmentValidator.json')
        const BaseAssignmentValidator = require('../../../../smart-contracts/build/contracts/BaseAssignmentValidator.json')
        const SBCoin = require('../../../../smart-contracts/build/contracts/SBCoin.json')

        let json = null;
        if (contractName === "ConfigStorage") {
            json = ConfigStorage;
        }
        if (contractName === "FaucetStorage") {
            json = FaucetStorage;
        }
        if (contractName === "ExampleAssignmentValidator") {
            json = ExampleAssignmentValidator;
        }
        if (contractName === "BaseAssignmentValidator") {
            json = BaseAssignmentValidator;
        }
        if (contractName === "SBCoin") {
            json = SBCoin;
        }
        return JSON.parse(JSON.stringify(json))
    }

    /**
     * Returns the abi given the json file name
     *
     * @param {string} contractName name of the json contract file without the json suffix
     * @returns json abi object
     */
    getContractAbi(contractName) {
        return this.getContractJson(contractName).abi;
    }

    /**
     * Returns the address of the smart contract
     *
     * @param {string} contractName name of the json contract file without the json suffix
     * @param {int} networkId Id of the network the blockchain is running on
     * @returns contract address
     */
    getContractAddress(contractName, networkId) {
        const deployedNetwork = this.getContractJson(contractName).networks[networkId];

        return deployedNetwork.address;
    }

    /**
     * Return the interface from the smart contract
     *
     * @param {web3} web3 web3 instance to connect to blockchain
     * @param {string} contractName Name of the contract to return
     * @param {string} fromAddress Address the contract should be executed from
     * @param {int} networkId Id of the network the blockchain is running on
     * @returns Interface from the smart contract
     */
    getContract(web3, contractName, fromAddress, networkId) {
        // faucet storage abi
        const abi = this.getContractAbi(contractName)

        // address from FaucetStorage contract
        const contractAddress = this.getContractAddress(contractName, networkId)

        // Get faucetStorageContract using logged in web3 address
        return new web3.eth.Contract(abi, contractAddress, {
            from: fromAddress
        });
    }

    /**
     * Return the assignment validator contract from the smart contract
     *
     * @param {web3} web3
     * @param {string} fromAddress
     * @param {string} assignmentValidatorContractAddress
     * @returns
     */
    getAssignmentValidatorContract(web3, fromAddress, assignmentValidatorContractAddress) {
        // faucet storage abi
        const abi = this.getContractAbi("BaseAssignmentValidator")

        // Get faucetStorageContract using logged in web3 address
        return new web3.eth.Contract(abi, assignmentValidatorContractAddress, {
            from: fromAddress
        });
    }

    /**
     * Returns the from account
     *
     * @param {web3} web3 web3 instance to connect to blockchain
     * @returns the from account
     */
    async getFromAccount(web3) {
        try {
            const address = await web3.eth.requestAccounts();
            return address[0];
        }
        catch (error) {
            const address = await web3.eth.getAccounts();
            return address[0];
        }
    }
}

// export unima class
module.exports = { NOWUtils };
