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

    async run_test_assignment(student_address, contract_address) {
        const deploy_address = this.config.getCoinbaseAddress;

        const test_assignment_validator = this.utils.get_contract(this.web3, "TestAssignmentValidator", deploy_address, this.config.getNetworkId);

        var bool_array = await test_assignment_validator.methods.validateTestAssignment(student_address, contract_address).call({
            from: deploy_address,
        });

        console.log(bool_array);

        return bool_array;
    }
}

// export utils class
module.exports = { UniMaAssignments };