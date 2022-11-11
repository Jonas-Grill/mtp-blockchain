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
}

// export config class
module.exports = { Config };