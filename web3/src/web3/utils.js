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
    get_contract(contract_name) {
        const fs = require('fs');
        let json = fs.readFileSync("../smart-contracts/build/contracts/" + contract_name + ".json", 'utf8');
        return JSON.parse(json);
    }

    /**
     * Returns the abi given the json file name
     * 
     * @param {string} contract_name name of the json contract file without the json suffix 
     * @returns json abi object
     */
    get_contract_abi(contract_name) {
        return this.get_contract(contract_name).abi;
    }

    /**
     * Returns the address of the smart contract
     * 
     * @param {string} contract_name name of the json contract file without the json suffix 
     * @returns contract address
     */
    get_contract_address(contract_name, network_id) {
        const deployedNetwork = this.get_contract(contract_name).networks[network_id];

        return deployedNetwork.address;
    }
}

// export utils class
module.exports = { UniMaUtils };