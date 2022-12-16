/*
Store some utility functions
*/

class UniMaAssignments {

    constructor(_web3) {
        // Require config
        const configHandler = require('./config')

        // Create config class with config path
        this.config = new configHandler.Config(_web3)

        // Require utils
        const utilsHandler = require('./utils')

        this.utils = new utilsHandler.UniMaUtils()

        this.web3 = _web3
    }


    /**
     * Validate assignment
     *
     * @param {string} student_address Student address
     * @param {string} contract_address Contract address
     * @param {string} validation_contract_address Address of contract
     * @returns Id of assignment check
     */
    async validate_assignment(student_address, contract_address, validation_contract_address) {
        const fromAddress = await this.utils.getFromAccount(this.web3);

        const assignmentValidatorContract = this.utils.get_assignment_validator_contract(this.web3, fromAddress, validation_contract_address);
        assignmentValidatorContract.options.gas = 5000000

        await assignmentValidatorContract.methods.validateTestAssignment(student_address, contract_address).send({
            from: fromAddress,
        });

        var id = await assignmentValidatorContract.methods.getHistoryCounter().call({
            from: fromAddress,
        });

        return id;
    }

    async submitAssignment(student_address, contract_address, validation_contract_address) {
        const fromAddress = await this.utils.getFromAccount(this.web3);

        const assignmentValidatorContract = this.utils.get_assignment_validator_contract(this.web3, fromAddress, validation_contract_address);
        assignmentValidatorContract.options.gas = 5000000

        await assignmentValidatorContract.methods.submitAssignment(student_address, contract_address).send({
            from: fromAddress,
        });

    }

    async get_test_results(id, validation_contract_address) {
        const fromAddress = await this.utils.getFromAccount(this.web3);

        const assignmentValidatorContract = this.utils.get_assignment_validator_contract(this.web3, fromAddress, validation_contract_address);

        var results = await assignmentValidatorContract.methods.getTestResults(id).call({
            from: fromAddress,
        });

        return results;
    }
}

// export utils class
module.exports = { UniMaAssignments };
