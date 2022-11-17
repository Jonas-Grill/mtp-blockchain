class Config {
    constructor(path) {
        // Read config file from json
        const fs = require('fs');
        let json = fs.readFileSync(path);
        let config = JSON.parse(json);

        // Parse json config
        this.rpcURL = config["rpcURL"];
        this.coinbaseAddress = config["coinbaseAddress"];
        this.networkId = config["networkId"];

        // Connect to web3

        // Require web3 for talking to api
        this.Web3 = require('web3')

        // Parse and set rpc url
        this.web3 = new this.Web3()
        this.web3.setProvider(new this.web3.providers.HttpProvider(this.getRpcUrl));

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

        // Get configStorageContract using coinbase address
        var configStorageContract = new this.web3.eth.Contract(abi, config_storage_address, {
            from: this.coinbaseAddress,
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

    get getCoinbaseAddress() {
        return this.coinbaseAddress;
    }

    get getNetworkId() {
        return this.networkId;
    }

    set setCoinbaseAddress(coinbase_address) {
        this.coinbaseAddress = coinbase_address;
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

        this.faucetGas = await configStorageContract.methods.getIntValue("faucetGas").call({ from: this.coinbaseAddress });

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

        this.faucetBlockNoDifference = await configStorageContract.methods.getIntValue("faucetBlockNoDifference").call({ from: this.coinbaseAddress });

        if (val == _default) {
            return this.faucetBlockNoDifference;
        }
        else {
            return val;
        }
    }


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
        await configStorageContract.methods.appendSemester(_name, _start_block, _end_block, _min_knowledge_coin_amount).send({ from: this.coinbaseAddress });

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
        return await configStorageContract.methods.getSemester(_id).call({ from: this.coinbaseAddress });
    }

    /**
     * Delete semester config by id 
     *
     * @param {int} _id Id of the semester
     */
    async deleteSemester(_id) {
        const configStorageContract = await this.getConfigStorage()
        return await configStorageContract.methods.deleteSemester(_id).send({ from: this.coinbaseAddress });
    }


    /*----------  Setter  ----------*/

    /**
     * Set semester name to new value 
     *
     * @param {int} id Id of semester
     * @param {string} name New name of semester
     */
    async set_semester_name(id, name) {
        const configStorageContract = await this.getConfigStorage()
        await configStorageContract.methods.setSemesterName(id, name).send({ from: this.coinbaseAddress });
    }

    /**
     * Set semester start block to new value 
     * 
     * @param {int} id Id of semester
     * @param {int} start_block New start block of semester
     */
    async set_semester_start_block(id, start_block) {
        const configStorageContract = await this.getConfigStorage()
        await configStorageContract.methods.setSemesterStartBlock(id, start_block).send({ from: this.coinbaseAddress });
    }

    /**
     * Set semester end block to new value
     * 
     * @param {int} id Id of semester
     * @param {int} end_block New end block of semester
     */
    async set_semester_end_block(id, end_block) {
        const configStorageContract = await this.getConfigStorage()
        await configStorageContract.methods.setSemesterEndBlock(id, end_block).send({ from: this.coinbaseAddress });
    }

    /**
     * Set semester min amount of knowledge coin needed to take exam to new value
     * 
     * @param {int} id Id of semester
     * @param {int} _min_knowledge_coin_amount New amount of minimum knowledge coin amount for semester
     */
    async set_semester_amount_knowledge_coins(id, _min_knowledge_coin_amount) {
        const configStorageContract = await this.getConfigStorage()
        await configStorageContract.methods.setMinKnowledgeCoinAmount(id, _min_knowledge_coin_amount).send({ from: this.coinbaseAddress });
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
        await configStorageContract.methods.appendAssignment(_semester_id, _name, _link, _validationContractAddress, _start_block, _end_block).send({ from: this.coinbaseAddress });

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
        return await configStorageContract.methods.getAssignment(_semester_id, _assignment_id).call({ from: this.coinbaseAddress });
    }

    /**
     * Delete assignment config by id
     * 
     * @param {int} _semester_id Id of the semester
     * @param {int} _assignment_id Id of the assignment
     */
    async deleteAssignment(_semester_id, _assignment_id) {
        const configStorageContract = await this.getConfigStorage()
        await configStorageContract.methods.deleteAssignment(_semester_id, _assignment_id).send({ from: this.coinbaseAddress });
    }


    /*----------  Setter  ----------*/

    /**
     * Set assignment name to new value 
     *
     * @param {int} _semester_id Id of the semester
     * @param {int} _assignment_id Id of the assignment
     * @param {string} name New name of assignment
     */
    async set_assignment_name(_semester_id, _assignment_id, name) {
        const configStorageContract = await this.getConfigStorage()
        await configStorageContract.methods.setAssignmentName(_semester_id, _assignment_id, name).send({ from: this.coinbaseAddress });
    }

    /**
     * Set assignment link to new value 
     * 
     * @param {int} _semester_id Id of the semester
     * @param {int} _assignment_id Id of the assignment
     * @param {string} link New link of assignment
     */
    async set_assignment_link(_semester_id, _assignment_id, link) {
        const configStorageContract = await this.getConfigStorage()
        await configStorageContract.methods.setAssignmentLink(_semester_id, _assignment_id, link).send({ from: this.coinbaseAddress });
    }

    /**
     * Set assignment address to new value
     *  
     * @param {int} _semester_id Id of the semester
     * @param {int} _assignment_id Id of the assignment
     * @param {string} address New address of validation assignment smart contract
     */
    async set_assignment_address(_semester_id, _assignment_id, address) {
        const configStorageContract = await this.getConfigStorage()
        await configStorageContract.methods.setAssignmentAddress(_semester_id, _assignment_id, address).send({ from: this.coinbaseAddress });
    }

    /**
     * Set assignment start block to new value
     *  
     * @param {int} _semester_id Id of the semester
     * @param {int} _assignment_id Id of the assignment
     * @param {int} _start_block New start block of assignment
     */
    async set_assignment_start_block(_semester_id, _assignment_id, _start_block) {
        const configStorageContract = await this.getConfigStorage()
        await configStorageContract.methods.setAssignmentStartBlock(_semester_id, _assignment_id, _start_block).send({ from: this.coinbaseAddress });
    }

    /**
     * Set assignment end block to new value
     *  
     * @param {int} _semester_id Id of the semester
     * @param {int} _assignment_id Id of the assignment
     * @param {int} _end_block New end block of assignment
     */
    async set_assignment_end_block(_semester_id, _assignment_id, _end_block) {
        const configStorageContract = await this.getConfigStorage()
        await configStorageContract.methods.setAssignmentEndBlock(_semester_id, _assignment_id, _end_block).send({ from: this.coinbaseAddress });
    }

    /*=====  End of Assignment Config  ======*/
}

// export config class
module.exports = { Config };