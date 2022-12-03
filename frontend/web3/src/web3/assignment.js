/*
Store some utility functions
*/

class UniMaAssignments {

    constructor(config_path = "config/dev-config.json") {
        // Require config
        const configHandler = require('./config')

        // Create config class with config path
        this.config = new configHandler.Config(config_path)

        // Require utils
        const utilsHandler = require('./utils')

        this.utils = new utilsHandler.UniMaUtils()

        // Require web3 for talking to api
        this.Web3 = require('web3')

        // Parse and set rpc url
        this.web3 = new this.Web3()
        this.web3.setProvider(new this.web3.providers.HttpProvider(this.config.getRpcUrl));
    }


    /**
     * Validate assignment
     * 
     * @param {string} student_address Student address
     * @param {string} contract_address Contract address
     * @param {string} contract_name Name of contract
     * @returns Id of assignment check
     */
    async validate_assignment(student_address, contract_address, contract_name) {
        const deploy_address = this.config.getCoinbaseAddress;

        const test_assignment_validator = this.utils.get_contract(this.web3, contract_name, deploy_address, this.config.getNetworkId);
        test_assignment_validator.options.gas = 5000000

        await test_assignment_validator.methods.validateTestAssignment(student_address, contract_address).send({
            from: deploy_address,
        });

        var id = await test_assignment_validator.methods.getHistoryCounter().call({
            from: deploy_address,
        });

        return id;
    }

    async get_test_results(contract_name, id) {
        const deploy_address = this.config.getCoinbaseAddress;

        const test_assignment_validator = this.utils.get_contract(this.web3, contract_name, deploy_address, this.config.getNetworkId);

        var results = await test_assignment_validator.methods.getTestResults(id).call({
            from: deploy_address,
        });

        return results;
    }
}

// export utils class
module.exports = { UniMaAssignments };