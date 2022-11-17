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
        const path = require('path');
        const fs = require('fs');
        var process = require('process');

        const directoryPath = path.join(process.cwd().replace("web3", ""), 'smart-contracts', 'build', 'contracts');

        const filePath = path.join(directoryPath, contract_name + ".json")

        let json = fs.readFileSync(filePath, 'utf8');

        console.log(json)

        return JSON.parse(json);
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
     * Validate if token is valid or not valid 
     *
     * @param {jwt} jwt JWT instance
     * @param {object} req header object
     * @returns returns if token is valide or not
     */
    verify_jwt_token(jwt, req) {
        const token = req.header("jwt_token");

        try {
            const verified = jwt.verify(token, process.env.JWT_SECRET_KEY);
            if (verified) {
                // Access Allowed
                return true;
            } else {
                // Access Denied
                return false;
            }
        } catch (error) {
            // Access Denied
            return false;
        }
    }
}

// export unima class
module.exports = { UniMaUtils };