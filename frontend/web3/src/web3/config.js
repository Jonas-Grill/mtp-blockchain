class Config {
    constructor(web3) {
        // Parse json config
        this.rpcURL = process.env.RPC_URL;
        this.networkId = process.env.NETWORK_ID;

        // Connect to web3

        // Require web3 for talking to api
        this.web3 = web3

        // Require utils
        const utilsHandler = require('./utils')
        this.utils = new utilsHandler.UniMaUtils()
    }

    /**
     * Returns ConfigStorage obj
     *
     * @returns ConfigStorage obj
     */
    async getConfigStorage() {
        // faucet storage abi
        const abi = this.utils.get_contract_abi("ConfigStorage")
        // address from ConfigStorage contract
        const network_id = await this.web3.eth.net.getId();
        const config_storage_address = this.utils.get_contract_address("ConfigStorage", network_id)

        const fromAddress = await this.utils.getFromAccount(this.web3);

        // Get configStorageContract using logged in web3 address
        var configStorageContract = new this.web3.eth.Contract(abi, config_storage_address, {
            from: fromAddress,
        });

        configStorageContract.options.gas = 5000000

        return configStorageContract;
    }

    /**
     * Enforce refresh of the smart contracts variables
     */
    async refreshSmartContractConfig() {
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

        this.faucetGas = await configStorageContract.methods.getIntValue("faucetGas").call({ from: fromAddress });

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
     * @param {string} _address Address of the person who runs the function
     * @param {int} _faucetGas New faucet gas value
     */
    async setFaucetGas(_address, _faucetGas) {
        const configStorageContract = await this.getConfigStorage()
        await configStorageContract.methods.setIntValue("faucetGas", _faucetGas).send({ from: _address });
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
        this.faucetBlockNoDifference = await configStorageContract.methods.getIntValue("faucetBlockNoDifference").call({ from: fromAddress });

        if (val == _default) {
            return this.faucetBlockNoDifference;
        }
        else {
            return val;
        }
    }


    /*=============================================
    =                 Admin Config                =
    =============================================*/

    /**
    * Set a new admin address for all contracts
    *
    * @param {string} _newAdmin Address of the new admin
    */
    // todo
    async addUserAdmin(_newAdmin) {
        // Change Admin for ConfigStorage Contract
        const configStorageContract = await this.getConfigStorage()
        await configStorageContract.methods.addUserAdmin(_newAdmin).send({ from: _newAdmin });

        // Change Admin for FaucetStorage Contract
        const faucetStorageContract = await this.utils.get_contract(this.web3, "FaucetStorage", _newAdmin, await this.web3.eth.net.getId())
        await faucetStorageContract.methods.addUserAdmin(_newAdmin).send({ from: _newAdmin });
    }

    /**
    * Remove admin address for all contracts
    *
    * @param {string} _admin Address of the admin to remove
    */
    async remove_admin(_admin) {
        // Change Admin for ConfigStorage Contract
        const configStorageContract = await this.getConfigStorage()
        await configStorageContract.methods.removeAdmin(_admin).send({ from: _admin });

        // Change Admin for FaucetStorage Contract
        const faucetStorageContract = await this.utils.get_contract(this.web3, "FaucetStorage", _admin, await this.web3.eth.net.getId())
        await faucetStorageContract.methods.removeAdmin(_admin).send({ from: _admin });
    }

    /**
     * Return user admin address
     *
     * @returns current user admin address
     */
    async getUserAdmins() {
        // Change Admin for ConfigStorage Contract
        const configStorageContract = await this.getConfigStorage()
        return await configStorageContract.methods.getUserAdmins().call();
    }

    /**
     * Return contract admin address
     *
     * @returns current user admin address
     */
    async getContractAdmins() {
        // Change Admin for ConfigStorage Contract
        const configStorageContract = await this.getConfigStorage()
        return await configStorageContract.methods.getContractAdmins().call();
    }

    /**
     * Return if address is admin
     *
     * @returns if address is admin
     */
    async is_admin(_address) {
        // Change Admin for ConfigStorage Contract
        const configStorageContract = await this.getConfigStorage()
        return await configStorageContract.methods.isAdmin(_address).call();
    }

    /*=====      End of Admin Config       ======*/

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
    * @param {string} _address Address of the person who runs the function
    * @param {int} _faucetBlockNoDifference Newfaucet block no difference value
    */
    async setFaucetBlockNoDifference(_address, _faucetBlockNoDifference) {
        const configStorageContract = await this.getConfigStorage()
        await configStorageContract.methods.setIntValue("faucetBlockNoDifference", _faucetBlockNoDifference).send({ from: _address });
    }

    /*=====  End of Faucet Block Difference  ======*/


    /*=======================================================
    =                     Semester Config                   =
    =========================================================*/

    /**
     * Append new semester
     *
     * @param {string} _name Name of the semester (e.g. SS22)
     * @param {int} _start_block Start block of semester
     * @param {int} _end_block End block of semester
     * @param {int} _min_knowledge_coin_amount New amount of minimum knowledge coin amount for semester
     * @returns Returns id of the semester
     */
    async appendSemester(_name, _start_block, _end_block, _min_knowledge_coin_amount) {
        const configStorageContract = await this.getConfigStorage()
        const fromAddress = await this.utils.getFromAccount(web3);

        await configStorageContract.methods.appendSemester(_name, _start_block, _end_block, _min_knowledge_coin_amount).send({ from: fromAddress });

        return await configStorageContract.methods.getSemesterCounter().call();
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
     * @param {int} start_block New start block of semester
     */
    async setSemesterStartBlock(id, start_block) {
        const configStorageContract = await this.getConfigStorage()
        const fromAddress = await this.utils.getFromAccount(web3);
        await configStorageContract.methods.setSemesterStartBlock(id, start_block).send({ from: fromAddress });
    }

    /**
     * Set semester end block to new value
     *
     * @param {int} id Id of semester
     * @param {int} end_block New end block of semester
     */
    async setSemesterEndBlock(id, end_block) {
        const configStorageContract = await this.getConfigStorage()
        const fromAddress = await this.utils.getFromAccount(web3);
        await configStorageContract.methods.setSemesterEndBlock(id, end_block).send({ from: fromAddress });
    }

    /**
     * Set semester min amount of knowledge coin needed to take exam to new value
     *
     * @param {int} id Id of semester
     * @param {int} _min_knowledge_coin_amount New amount of minimum knowledge coin amount for semester
     */
    async setSemesterAmountKnowledgeCoins(id, _min_knowledge_coin_amount) {
        const configStorageContract = await this.getConfigStorage()
        const fromAddress = await this.utils.getFromAccount(web3);
        await configStorageContract.methods.setMinKnowledgeCoinAmount(id, _min_knowledge_coin_amount).send({ from: fromAddress });
    }

    /*============  End of Semester Config  =============*/



    /*=============================================
    =              Assignment Config              =
    =============================================*/

    /**
     * Append new assignment to semester
     *
     * @param {int} _semester_id Id of the semester the assignment should be appeneded
     * @param {string} _name Name of the semester
     * @param {string} _link Link to the assignment
     * @param {string} _validationContractAddress Address of the validation contract
     * @param {int} _start_block Start block of assignment
     * @param {int} _end_block End block of assignment
     * @returns Returns id of the assignment
     */
    async appendAssignment(_semester_id, _name, _link, _validationContractAddress, _start_block, _end_block) {
        const configStorageContract = await this.getConfigStorage()
        const fromAddress = await this.utils.getFromAccount(web3);
        await configStorageContract.methods.appendAssignment(_semester_id, _name, _link, _validationContractAddress, _start_block, _end_block).send({ from: fromAddress });

        return await configStorageContract.methods.getAssignmentCounter(_semester_id).call();
    }

    /**
     * Returns assignment config by id
     *
     * @param {int} _semester_id Id of the semester
     * @param {int} _assignment_id Id of the assignment
     * @returns Returns assignment
     */
    async getAssignment(_semester_id, _assignment_id) {
        const configStorageContract = await this.getConfigStorage()
        const fromAddress = await this.utils.getFromAccount(web3);
        return await configStorageContract.methods.getAssignment(_semester_id, _assignment_id).call({ from: fromAddress });
    }

    /**
     * Return all assignment ids
     * 
     * @param {id} _semester_id Id of the semester
     * @returns Returns all assignment ids
     */
    async getAssignmentIds(_semester_id) {
        const configStorageContract = await this.getConfigStorage()
        const fromAddress = await this.utils.getFromAccount(web3);
        return await configStorageContract.methods.getAssignmentIds(_semester_id).call({ from: fromAddress });
    }

    /**
     * Delete assignment config by id
     *
     * @param {int} _semester_id Id of the semester
     * @param {int} _assignment_id Id of the assignment
     */
    async deleteAssignment(_semester_id, _assignment_id) {
        const configStorageContract = await this.getConfigStorage()
        const fromAddress = await this.utils.getFromAccount(web3);
        await configStorageContract.methods.deleteAssignment(_semester_id, _assignment_id).send({ from: fromAddress });
    }


    /*----------  Setter  ----------*/

    /**
     * Set assignment name to new value
     *
     * @param {int} _semester_id Id of the semester
     * @param {int} _assignment_id Id of the assignment
     * @param {string} name New name of assignment
     */
    async setAssignmentName(_semester_id, _assignment_id, name) {
        const configStorageContract = await this.getConfigStorage()
        const fromAddress = await this.utils.getFromAccount(web3);
        await configStorageContract.methods.setAssignmentName(_semester_id, _assignment_id, name).send({ from: fromAddress });
    }

    /**
     * Set assignment link to new value
     *
     * @param {int} _semester_id Id of the semester
     * @param {int} _assignment_id Id of the assignment
     * @param {string} link New link of assignment
     */
    async setAssignmentLink(_semester_id, _assignment_id, link) {
        const configStorageContract = await this.getConfigStorage()
        const fromAddress = await this.utils.getFromAccount(web3);
        await configStorageContract.methods.setAssignmentLink(_semester_id, _assignment_id, link).send({ from: fromAddress });
    }

    /**
     * Set assignment address to new value
     *
     * @param {int} _semester_id Id of the semester
     * @param {int} _assignment_id Id of the assignment
     * @param {string} address New address of validation assignment smart contract
     */
    async setAssignmentAddress(_semester_id, _assignment_id, address) {
        const configStorageContract = await this.getConfigStorage()
        const fromAddress = await this.utils.getFromAccount(web3);
        await configStorageContract.methods.setAssignmentAddress(_semester_id, _assignment_id, address).send({ from: fromAddress });
    }

    /**
     * Set assignment start block to new value
     *
     * @param {int} _semester_id Id of the semester
     * @param {int} _assignment_id Id of the assignment
     * @param {int} _start_block New start block of assignment
     */
    async setAssignmentStartBlock(_semester_id, _assignment_id, _start_block) {
        const configStorageContract = await this.getConfigStorage()
        const fromAddress = await this.utils.getFromAccount(web3);
        await configStorageContract.methods.setAssignmentStartBlock(_semester_id, _assignment_id, _start_block).send({ from: fromAddress });
    }

    /**
     * Set assignment end block to new value
     *
     * @param {int} _semester_id Id of the semester
     * @param {int} _assignment_id Id of the assignment
     * @param {int} _end_block New end block of assignment
     */
    async setAssignmentEndBlock(_semester_id, _assignment_id, _end_block) {
        const configStorageContract = await this.getConfigStorage()
        const fromAddress = await this.utils.getFromAccount(web3);
        await configStorageContract.methods.setAssignmentEndBlock(_semester_id, _assignment_id, _end_block).send({ from: fromAddress });
    }

    /*=====  End of Assignment Config  ======*/
}

// export config class
module.exports = { Config };
