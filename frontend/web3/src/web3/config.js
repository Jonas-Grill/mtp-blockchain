class NOWConfig {
    constructor(web3) {
        // Parse json config
        this.rpcURL = process.env.RPC_URL;
        this.networkId = process.env.NETWORK_ID;

        // Connect to web3

        // Require web3 for talking to api
        this.web3 = web3

        // Require utils
        const utilsHandler = require('./utils')
        this.utils = new utilsHandler.NOWUtils()
    }

    /**
     * Returns NOWConfigStorage obj
     *
     * @returns NOWConfigStorage obj
     */
    async getConfigStorage() {
        // faucet storage abi
        const abi = this.utils.getContractAbi("ConfigStorage")
        // address from NOWConfigStorage contract
        const network_id = await this.web3.eth.net.getId();
        const configStorageAddress = this.utils.getContractAddress("ConfigStorage", network_id)

        const fromAddress = await this.utils.getFromAccount(this.web3);

        // Get configStorageContract using logged in web3 address
        var configStorageContract = new this.web3.eth.Contract(abi, configStorageAddress, {
            from: fromAddress,
        });

        configStorageContract.options.gas = 5000000

        return configStorageContract;
    }

    /**
     * Enforce refresh of the smart contracts variables
     */
    async refreshSmartContractNOWConfig() {
        await this.getFreshFaucetGas()
        await this.getFreshFaucetBlockNoDifference()
    }

    get getRpcUrl() {
        return this.rpcURL;
    }

    get getNetworkId() {
        return this.networkId;
    }

    set setNetworkId(_network_id) {
        this.networkId = _network_id;
    }

    /**
     * Refresh faucet gas variable and return fresh value or return default
     *
     * @param {int} val default value for faucet gas (default: -1)
     * @param {int} _default default value (default: -1)
     * @returns faucet gas
     */
    async getFreshFaucetGas(val = -1, _default = -1) {
        const configStorageContract = await this.getConfigStorage()

        const fromAddress = await this.utils.getFromAccount(web3);

        this.faucetGas = await configStorageContract.methods.getFaucetGas().call({ from: fromAddress });

        if (val == _default) {
            return this.faucetGas;
        }
        else {
            return val;
        }
    }

    /**
    * Getter for faucet gas
    */
    get getFaucetGas() {
        return parseFloat(this.faucetGas);
    }

    /**
     * Set a new faucet gas value
     *
     * @param {int} _faucetGas New faucet gas value
     */
    async setFaucetGas(_faucetGas) {
        const configStorageContract = await this.getConfigStorage()
        await configStorageContract.methods.setFaucetGas(_faucetGas).send({ from: await this.utils.getFromAccount(web3) });
    }

    /**
     * Refresh faucet block difference variable and return fresh value or return default
     *
     * @param {int} val default value for faucet block different (default: -1)
     * @param {int} _default default value (default: -1)
     * @returns faucet gas
     */
    async getFreshFaucetBlockNoDifference(val = -1, _default = -1) {
        const configStorageContract = await this.getConfigStorage()

        const fromAddress = await this.utils.getFromAccount(web3);
        this.faucetBlockNoDifference = await configStorageContract.methods.getFaucetBlockNoDifference().call({ from: fromAddress });

        if (val == _default) {
            return this.faucetBlockNoDifference;
        }
        else {
            return val;
        }
    }

    /**
     * Set a new block no difference value
     *
     * @param {int} blockNoDifference New faucet gas value
     */
    async setFaucetBlockNoDifference(blockNoDifference) {
        const configStorageContract = await this.getConfigStorage()
        await configStorageContract.methods.setFaucetBlockNoDifference(blockNoDifference).send({ from: await this.utils.getFromAccount(web3) });
    }


    /*=============================================
    =                 Admin NOWConfig                =
    =============================================*/

    /**
    * Set a new user admin address for all contracts
    *
    * @param {string} _newAdmin Address of the new admin
    */
    async addUserAdmin(_newAdmin) {
        // Change Admin for NOWConfigStorage Contract
        const configStorageContract = await this.getConfigStorage()
        await configStorageContract.methods.addUserAdmin(_newAdmin).send({ from: await this.utils.getFromAccount(web3) });
    }

    /**
    * Set a new contratc as admin
    *
    * @param {string} _newAdmin Address of the new admin
    */
    async addContractAdmin(_newAdmin) {
        // Change Admin for NOWConfigStorage Contract
        const configStorageContract = await this.getConfigStorage()
        await configStorageContract.methods.addContractAdmin(_newAdmin).send({ from: await this.utils.getFromAccount(web3) });
    }

    /**
    * Remove user admin
    *
    * @param {string} _admin Address of the admin to remove
    */
    async removeUserAdmin(_admin) {
        // Change Admin for NOWConfigStorage Contract
        const configStorageContract = await this.getConfigStorage()
        await configStorageContract.methods.removeUserAdmin(_admin).send({ from: await this.utils.getFromAccount(web3) });
    }

    /**
    * Remove contract admin
    *
    * @param {string} _admin Address of the admin to remove
    */
    async removeContractAdmin(_admin) {
        // Change Admin for NOWConfigStorage Contract
        const configStorageContract = await this.getConfigStorage()
        await configStorageContract.methods.removeContractAdmin(_admin).send({ from: await this.utils.getFromAccount(web3) });
    }

    /**
     * Return user admin address
     *
     * @returns current user admin address
     */
    async getUserAdmins() {
        // Change Admin for NOWConfigStorage Contract
        const configStorageContract = await this.getConfigStorage()
        return await configStorageContract.methods.getUserAdmins().call({ from: await this.utils.getFromAccount(web3) });
    }

    /**
     * Return contract admin address
     *
     * @returns current user admin address
     */
    async getContractAdminAddresses() {
        const configStorageContract = await this.getConfigStorage()
        return await configStorageContract.methods.getContractAdminAddresses().call({ from: await this.utils.getFromAccount(web3) });
    }

    /**
    * Return contract admin address
    *
    * @returns current user admin address
    */
    async getContractAdmins() {
        const configStorageContract = await this.getConfigStorage()
        return await configStorageContract.methods.getContractAdmins().call({ from: await this.utils.getFromAccount(web3) });
    }

    /**
     * Return if address is admin
     *
     * @returns if address is admin
     */
    async isAdmin(_address) {
        const configStorageContract = await this.getConfigStorage()
        return await configStorageContract.methods.isAdmin(_address).call({ from: await this.utils.getFromAccount(web3) });
    }

    /**
     * Return if user address is admin
     *
     * @returns if address is admin
     */
    async isUserAdmin(_address) {
        const configStorageContract = await this.getConfigStorage()
        return await configStorageContract.methods.isUserAdmin(_address).call({ from: await this.utils.getFromAccount(web3) });
    }

    /**
     * Return if contract address is admin
     *
     * @returns if address is admin
     */
    async isContractAdmin(_address) {
        const configStorageContract = await this.getConfigStorage()
        return await configStorageContract.methods.isContractAdmin(_address).call({ from: await this.utils.getFromAccount(web3) });
    }

    /*=====      End of Admin NOWConfig       ======*/

    /*=============================================
    =            Faucet Block Difference            =
    =============================================*/

    /**
    * Getter for faucet block no difference
    */
    get getFaucetBlockNoDifference() {
        return this.faucetBlockNoDifference;
    }

    /**
    * Set a new faucet block no difference value
    *
    * @param {int} _faucetBlockNoDifference Newfaucet block no difference value
    */
    async setFaucetBlockNoDifference(_faucetBlockNoDifference) {
        const configStorageContract = await this.getConfigStorage()
        await configStorageContract.methods.setIntValue("faucetBlockNoDifference", _faucetBlockNoDifference).send({ from: await this.utils.getFromAccount(web3) });
    }

    /*=====  End of Faucet Block Difference  ======*/


    /*=======================================================
    =                     Semester NOWConfig                   =
    =========================================================*/

    /**
     * Append new semester
     *
     * @param {string} _name Name of the semester (e.g. SS22)
     * @param {int} _startBlock Start block of semester
     * @param {int} _endBlock End block of semester
     * @param {int} _minKnowledgeCoinAmount New amount of minimum knowledge coin amount for semester
     * @returns Returns id of the semester
     */
    async appendSemester(_name, _startBlock, _endBlock, _minKnowledgeCoinAmount) {
        const configStorageContract = await this.getConfigStorage()
        const fromAddress = await this.utils.getFromAccount(web3);

        await configStorageContract.methods.appendSemester(_name, _startBlock, _endBlock, _minKnowledgeCoinAmount).send({ from: fromAddress });

        return await configStorageContract.methods.getSemesterCounter().call({ from: await this.utils.getFromAccount(web3) });
    }

    /**
     * Return semester config by id
     *
     * @param {int} _id Id of the semester
     * @returns Returns semester
     */
    async getSemester(_id) {
        const configStorageContract = await this.getConfigStorage()
        const fromAddress = await this.utils.getFromAccount(web3);
        return await configStorageContract.methods.getSemester(_id).call({ from: fromAddress });
    }

    /**
     * Return all semester ids 
     *
     * @returns Returns all semester ids
     */
    async getSemesterIds() {
        const configStorageContract = await this.getConfigStorage()
        const fromAddress = await this.utils.getFromAccount(web3);

        return await configStorageContract.methods.getSemesterIds().call({ from: fromAddress });
    }

    /**
     * Delete semester config by id
     *
     * @param {int} _id Id of the semester
     */
    async deleteSemester(_id) {
        const configStorageContract = await this.getConfigStorage()
        const fromAddress = await this.utils.getFromAccount(web3);
        return await configStorageContract.methods.deleteSemester(_id).send({ from: fromAddress });
    }

    /*----------  Setter  ----------*/

    /**
     * Set semester name to new value
     *
     * @param {int} id Id of semester
     * @param {string} name New name of semester
     */
    async setSemesterName(id, name) {
        const configStorageContract = await this.getConfigStorage()
        const fromAddress = await this.utils.getFromAccount(web3);
        await configStorageContract.methods.setSemesterName(id, name).send({ from: fromAddress });
    }

    /**
     * Set semester start block to new value
     *
     * @param {int} id Id of semester
     * @param {int} startBlock New start block of semester
     */
    async setSemesterStartBlock(id, startBlock) {
        const configStorageContract = await this.getConfigStorage()
        const fromAddress = await this.utils.getFromAccount(web3);
        await configStorageContract.methods.setSemesterStartBlock(id, startBlock).send({ from: fromAddress });
    }

    /**
     * Set semester end block to new value
     *
     * @param {int} id Id of semester
     * @param {int} endBlock New end block of semester
     */
    async setSemesterEndBlock(id, endBlock) {
        const configStorageContract = await this.getConfigStorage()
        const fromAddress = await this.utils.getFromAccount(web3);
        await configStorageContract.methods.setSemesterEndBlock(id, endBlock).send({ from: fromAddress });
    }

    /**
     * Set semester min amount of knowledge coin needed to take exam to new value
     *
     * @param {int} id Id of semester
     * @param {int} minKnowledgeCoinAmount New amount of minimum knowledge coin amount for semester
     */
    async setSemesterAmountKnowledgeCoins(id, minKnowledgeCoinAmount) {
        const configStorageContract = await this.getConfigStorage()
        const fromAddress = await this.utils.getFromAccount(web3);
        await configStorageContract.methods.setMinKnowledgeCoinAmount(id, minKnowledgeCoinAmount).send({ from: fromAddress });
    }

    /*============  End of Semester NOWConfig  =============*/



    /*=============================================
    =              Assignment NOWConfig              =
    =============================================*/

    /**
     * Append new assignment to semester
     *
     * @param {int} _semesterId Id of the semester the assignment should be appeneded
     * @param {string} _name Name of the semester
     * @param {string} _link Link to the assignment
     * @param {string} _validationContractAddress Address of the validation contract
     * @param {int} _startBlock Start block of assignment
     * @param {int} _endBlock End block of assignment
     * @returns Returns id of the assignment
     */
    async appendAssignment(_semesterId, _name, _link, _validationContractAddress, _startBlock, _endBlock) {
        const configStorageContract = await this.getConfigStorage()
        const fromAddress = await this.utils.getFromAccount(web3);
        await configStorageContract.methods.appendAssignment(_semesterId, _name, _link, _validationContractAddress, _startBlock, _endBlock).send({ from: fromAddress });

        return await configStorageContract.methods.getAssignmentCounter(_semesterId).call({ from: await this.utils.getFromAccount(web3) });
    }

    /**
     * Returns assignment config by id
     *
     * @param {int} _semesterId Id of the semester
     * @param {int} _assignmentId Id of the assignment
     * @returns Returns assignment
     */
    async getAssignment(_semesterId, _assignmentId) {
        const configStorageContract = await this.getConfigStorage()
        const fromAddress = await this.utils.getFromAccount(web3);
        return await configStorageContract.methods.getAssignment(_semesterId, _assignmentId).call({ from: fromAddress });
    }

    /**
     * Return all assignment ids
     * 
     * @param {id} _semesterId Id of the semester
     * @returns Returns all assignment ids
     */
    async getAssignmentIds(_semesterId) {
        const configStorageContract = await this.getConfigStorage()
        const fromAddress = await this.utils.getFromAccount(web3);
        return await configStorageContract.methods.getAssignmentIds(_semesterId).call({ from: fromAddress });
    }

    /**
     * Delete assignment config by id
     *
     * @param {int} _semesterId Id of the semester
     * @param {int} _assignmentId Id of the assignment
     */
    async deleteAssignment(_semesterId, _assignmentId) {
        const configStorageContract = await this.getConfigStorage()
        const fromAddress = await this.utils.getFromAccount(web3);
        await configStorageContract.methods.deleteAssignment(_semesterId, _assignmentId).send({ from: fromAddress });
    }


    /*----------  Setter  ----------*/

    /**
     * Set assignment name to new value
     *
     * @param {int} _semesterId Id of the semester
     * @param {int} _assignmentId Id of the assignment
     * @param {string} name New name of assignment
     */
    async setAssignmentName(_semesterId, _assignmentId, name) {
        const configStorageContract = await this.getConfigStorage()
        const fromAddress = await this.utils.getFromAccount(web3);
        await configStorageContract.methods.setAssignmentName(_semesterId, _assignmentId, name).send({ from: fromAddress });
    }

    /**
     * Set assignment link to new value
     *
     * @param {int} _semesterId Id of the semester
     * @param {int} _assignmentId Id of the assignment
     * @param {string} link New link of assignment
     */
    async setAssignmentLink(_semesterId, _assignmentId, link) {
        const configStorageContract = await this.getConfigStorage()
        const fromAddress = await this.utils.getFromAccount(web3);
        await configStorageContract.methods.setAssignmentLink(_semesterId, _assignmentId, link).send({ from: fromAddress });
    }

    /**
     * Set assignment address to new value
     *
     * @param {int} _semesterId Id of the semester
     * @param {int} _assignmentId Id of the assignment
     * @param {string} address New address of validation assignment smart contract
     */
    async setAssignmentAddress(_semesterId, _assignmentId, address) {
        const configStorageContract = await this.getConfigStorage()
        const fromAddress = await this.utils.getFromAccount(web3);
        await configStorageContract.methods.setAssignmentAddress(_semesterId, _assignmentId, address).send({ from: fromAddress });
    }

    /**
     * Set assignment start block to new value
     *
     * @param {int} _semesterId Id of the semester
     * @param {int} _assignmentId Id of the assignment
     * @param {int} _startBlock New start block of assignment
     */
    async setAssignmentStartBlock(_semesterId, _assignmentId, _startBlock) {
        const configStorageContract = await this.getConfigStorage()
        const fromAddress = await this.utils.getFromAccount(web3);
        await configStorageContract.methods.setAssignmentStartBlock(_semesterId, _assignmentId, _startBlock).send({ from: fromAddress });
    }

    /**
     * Set assignment end block to new value
     *
     * @param {int} _semesterId Id of the semester
     * @param {int} _assignmentId Id of the assignment
     * @param {int} _endBlock New end block of assignment
     */
    async setAssignmentEndBlock(_semesterId, _assignmentId, _endBlock) {
        const configStorageContract = await this.getConfigStorage()
        const fromAddress = await this.utils.getFromAccount(web3);
        await configStorageContract.methods.setAssignmentEndBlock(_semesterId, _assignmentId, _endBlock).send({ from: fromAddress });
    }

    /*=====  End of Assignment NOWConfig  ======*/
}

// export config class
module.exports = { NOWConfig };
