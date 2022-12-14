/*
Store some utility functions
*/

class UniMaUtils {
    /**
     * Returns the eth amount from wei
     * 
     * @param {int} wei
     * @returns eth
     */
    wei_to_eth(wei) {
        return Number(wei) / Number(1000000000000000000);
    }

    /**
     * Returns the wei amount from eth
     * 
     * @param {float} eth 
     */
    eth_to_wei(eth) {
        return parseFloat(eth) * Number(1000000000000000000);
    }

    /**
     * Returns the object of the smart contract 
     *
     * @param {string} contract_name name of the json contract file without the json suffix
     * @return json object 
     */
    get_contract_json(contract_name) {

        const ConfigStorage = require('../../../../smart-contracts/build/contracts/ConfigStorage.json')
        const FaucetStorage = require('../../../../smart-contracts/build/contracts/FaucetStorage.json')
        const TestAssignmentValidator = require('../../../../smart-contracts/build/contracts/TestAssignmentValidator.json')
        const BaseAssignmentValidator = require('../../../../smart-contracts/build/contracts/BaseAssignmentValidator.json')

        let json = null;
        if (contract_name === "ConfigStorage") {
            json = ConfigStorage;
        }
        if (contract_name === "FaucetStorage") {
            json = FaucetStorage;
        }
        if (contract_name === "TestAssignmentValidator") {
            json = TestAssignmentValidator;
        }
        if (contract_name === "BaseAssignmentValidator") {
            json = BaseAssignmentValidator;
        }
        return JSON.parse(JSON.stringify(json))
    }

    /**
     * Returns the abi given the json file name
     * 
     * @param {string} contract_name name of the json contract file without the json suffix 
     * @returns json abi object
     */
    get_contract_abi(contract_name) {
        return this.get_contract_json(contract_name).abi;
    }

    /**
     * Returns the address of the smart contract
     * 
     * @param {string} contract_name name of the json contract file without the json suffix     
     * @param {int} network_id Id of the network the blockchain is running on
     * @returns contract address
     */
    get_contract_address(contract_name, network_id) {
        const deployedNetwork = this.get_contract_json(contract_name).networks[network_id];

        return deployedNetwork.address;
    }

    /**
     * Return the interface from the smart contract 
     *
     * @param {web3} web3 web3 instance to connect to blockchain
     * @param {string} contract_name Name of the contract to return
     * @param {string} from_address Address the contract should be executed from
     * @param {int} network_id Id of the network the blockchain is running on
     * @returns Interface from the smart contract 
     */
    get_contract(web3, contract_name, from_address, network_id) {
        // faucet storage abi
        const abi = this.get_contract_abi(contract_name)

        // address from FaucetStorage contract
        const faucet_storage_address = this.get_contract_address(contract_name, network_id)

        // Get faucetStorageContract using coinbase address
        return new web3.eth.Contract(abi, faucet_storage_address, {
            from: from_address
        });
    }

    /**
     * Return the assignment validator contract from the smart contract 
     *
     * @param {web3} web3 
     * @param {string} from_address 
     * @param {string} assignment_validator_address 
     * @returns 
     */
    get_assignment_validator_contract(web3, from_address, assignment_validator_address) {
        // faucet storage abi
        const abi = this.get_contract_abi("BaseAssignmentValidator")

        // Get faucetStorageContract using coinbase address
        return new web3.eth.Contract(abi, assignment_validator_address, {
            from: from_address
        });
    }
}

// export unima class
module.exports = { UniMaUtils };