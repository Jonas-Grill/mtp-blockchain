/*
Store some utility functions
*/

class NOWAssignments {

    /**
    * Create Account class
    *
    * @param {web3} _web3 web3 instance from metamask or other provider
    */
    constructor(_web3) {
        // Require config
        const configHandler = require('./config')

        // Create config class with config path
        this.config = new configHandler.NOWConfig(_web3)

        // Require utils
        const utilsHandler = require('./utils')

        this.utils = new utilsHandler.NOWUtils()

        this.web3 = _web3
    }


    /**
     * Validate assignment
     *
     * @param {string} studentAddress Student address
     * @param {string} contractAddress Contract address
     * @param {string} validationContractAddress Address of contract
     * @returns Id of assignment check
     */
    async validateAssignment(studentAddress, contractAddress, validationContractAddress) {
        const fromAddress = await this.utils.getFromAccount(this.web3);

        const assignmentValidatorContract = this.utils.getAssignmentValidatorContract(this.web3, fromAddress, validationContractAddress);
        assignmentValidatorContract.options.gas = 10000000000
        assignmentValidatorContract.options.gasLimit = 10000000000

        try {
            await assignmentValidatorContract.methods.validateExampleAssignment(studentAddress, contractAddress).send({
                from: fromAddress,
            });

            var id = await assignmentValidatorContract.methods.getHistoryCounter().call({
                from: fromAddress,
            });

            return id;
        }
        catch (e) {
            throw new Error("Assignment validation failed, because contract is not made for this assignment.");
        }
    }

    /**
     * Submit assignment
     * 
     * @param {string} studentAddress Student address
     * @param {string} contractAddress Contract address
     * @param {string} validationContractAddress Address of validation contract
     */
    async submitAssignment(studentAddress, contractAddress, validationContractAddress) {
        const fromAddress = await this.utils.getFromAccount(this.web3);

        const assignmentValidatorContract = this.utils.getAssignmentValidatorContract(this.web3, fromAddress, validationContractAddress);
        assignmentValidatorContract.options.gas = 10000000000
        assignmentValidatorContract.options.gasLimit = 10000000000

        await assignmentValidatorContract.methods.submitAssignment(studentAddress, contractAddress).send({
            from: fromAddress,
        });
    }

    /**
     * Get all test history indexes of student
     * 
     * @param {string} studentAddress Student address
     * @param {string} validationContractAddress Address of validation contract
     * @returns Return array of all test indexes
     */
    async getTestHistoryIndexes(studentAddress, validationContractAddress) {
        const fromAddress = await this.utils.getFromAccount(this.web3);

        const assignmentValidatorContract = this.utils.getAssignmentValidatorContract(this.web3, fromAddress, validationContractAddress);

        const testHistoryIndexes = await assignmentValidatorContract.methods.getTestHistoryIndexes(studentAddress).call({
            from: fromAddress,
        });

        return testHistoryIndexes.filter(val => val !== "0");
    }

    /**
     * Get test results by id 
     *
     * @param {int} id Id of the test
     * @param {string} validationContractAddress Address of validation contract
     * @returns Return test result
     */
    async getTestResults(id, validationContractAddress) {
        const fromAddress = await this.utils.getFromAccount(this.web3);

        const assignmentValidatorContract = this.utils.getAssignmentValidatorContract(this.web3, fromAddress, validationContractAddress);

        var results = await assignmentValidatorContract.methods.getTestResults(id).call({
            from: fromAddress,
        });

        return results;
    }

    /**
     * Get submitted assignment
     *
     * @param {string} studentAddress Address of student
     * @param {string} validationContractAddress Address of validation contract
     * @returns 
     */
    async getSubmittedAssignment(studentAddress, validationContractAddress) {
        const fromAddress = await this.utils.getFromAccount(this.web3);

        const assignmentValidatorContract = this.utils.getAssignmentValidatorContract(this.web3, fromAddress, validationContractAddress);

        var results = await assignmentValidatorContract.methods.getSubmittedAssignment(studentAddress).call({
            from: fromAddress,
        });

        return { "testIndex": results[0], "studentAddress": results[1], "contractAddress": results[2], "knowledgeCoins": results[3], "blockNo": results[4], "submitted": results[5] };
    }

    /**
     * Remove submitted assignment 
     *
     * @param {string} studentAddress Address of student
     * @param {string} validationContractAddress Address of validation contract
     */
    async removeSubmittedAssignment(studentAddress, validationContractAddress) {
        const fromAddress = await this.utils.getFromAccount(this.web3);

        const assignmentValidatorContract = this.utils.getAssignmentValidatorContract(this.web3, fromAddress, validationContractAddress);

        await assignmentValidatorContract.methods.removeSubmittedAssignment(studentAddress).send({
            from: fromAddress,
        });
    }
}

// export utils class
module.exports = { NOWAssignments };
