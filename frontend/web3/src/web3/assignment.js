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
    async validateAssignment(student_address, contract_address, validation_contract_address) {
        const fromAddress = await this.utils.getFromAccount(this.web3);

        const assignmentValidatorContract = this.utils.get_assignment_validator_contract(this.web3, fromAddress, validation_contract_address);
        assignmentValidatorContract.options.gas = 5000000

        await assignmentValidatorContract.methods.validateExampleAssignment(student_address, contract_address).send({
            from: fromAddress,
        });

        var id = await assignmentValidatorContract.methods.getHistoryCounter().call({
            from: fromAddress,
        });

        return id;
    }

    /**
     * Submit assignment
     * 
     * @param {string} student_address Student address
     * @param {string} contract_address Contract address
     * @param {string} validation_contract_address Address of validation contract
     */
    async submitAssignment(student_address, contract_address, validation_contract_address) {
        const fromAddress = await this.utils.getFromAccount(this.web3);

        const assignmentValidatorContract = this.utils.get_assignment_validator_contract(this.web3, fromAddress, validation_contract_address);
        assignmentValidatorContract.options.gas = 5000000

        await assignmentValidatorContract.methods.submitAssignment(student_address, contract_address).send({
            from: fromAddress,
        });
    }

    /**
     * Get all test history indexes of student
     * 
     * @param {string} student_address Student address
     * @param {string} validation_contract_address Address of validation contract
     * @returns Return array of all test indexes
     */
    async getTestHistoryIndexes(student_address, validation_contract_address) {
        const fromAddress = await this.utils.getFromAccount(this.web3);

        const assignmentValidatorContract = this.utils.get_assignment_validator_contract(this.web3, fromAddress, validation_contract_address);

        const testHistoryIndexes = await assignmentValidatorContract.methods.getTestHistoryIndexes(student_address).call({
            from: fromAddress,
        });

        return testHistoryIndexes.filter(val => val !== "0");
    }

    /**
     * Get test results by id 
     *
     * @param {int} id Id of the test
     * @param {string} validation_contract_address Address of validation contract
     * @returns Return test result
     */
    async getTestResults(id, validation_contract_address) {
        const fromAddress = await this.utils.getFromAccount(this.web3);

        const assignmentValidatorContract = this.utils.get_assignment_validator_contract(this.web3, fromAddress, validation_contract_address);

        var results = await assignmentValidatorContract.methods.getTestResults(id).call({
            from: fromAddress,
        });

        return results;
    }

    async getSubmittedAssignment(student_address, validation_contract_address) {
        const fromAddress = await this.utils.getFromAccount(this.web3);

        const assignmentValidatorContract = this.utils.get_assignment_validator_contract(this.web3, fromAddress, validation_contract_address);

        var results = await assignmentValidatorContract.methods.getSubmittedAssignment(student_address).call({
            from: fromAddress,
        });

        return { "testIndex": results[0], "studentAddress": results[1], "contractAddress": results[2], "knowledgeCoins": results[3], "blockNo": results[4], "submitted": results[5] };
    }
}

// export utils class
module.exports = { UniMaAssignments };
