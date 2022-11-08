class Config {
    constructor(path) {
        // Read config file from json
        const fs = require('fs');
        let json = fs.readFileSync(path);
        let config = JSON.parse(json);

        // Parse json config
        this.rpcURL = config["rpcURL"];
        this.coinbaseAdress = config["coinbaseAdress"];

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
            from: this.coinbaseAdress,
        });

        return configStorageContract;
    }

    async parseSmartContractConfig() {
        const configStorageContract = await this.getConfigStorage()

        await this.getFreshFaucetGas()
        await this.getFreshFaucetBlockNoDifference()
    }

    get getRpcUrl() {
        return this.rpcURL;
    }

    get getCoinbaseAdress() {
        return this.coinbaseAdress;
    }

    set setCoinbaseAddress(coinbase_adress) {
        this.coinbaseAdress = coinbase_adress;
    }

    /**
     * Refresh faucet gas variable and return fresh value or return default
     * 
     * @param {int} val default value for faucet gas
     * @returns 
     */
    async getFreshFaucetGas(val = -1) {
        const configStorageContract = await this.getConfigStorage()

        this.faucetGas = await configStorageContract.methods.getIntValue("faucetGas").call({ from: this.coinbaseAdress });

        const _default = -1
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
     * Refresh faucet block difference variable and return fresh value or return default
     * 
     * @param {int} val default value for faucet block differen
     * @returns 
     */
    async getFreshFaucetBlockNoDifference(val = -1) {
        const configStorageContract = await this.getConfigStorage()

        this.faucetBlockNoDifference = await configStorageContract.methods.getIntValue("faucetBlockNoDifference").call({ from: this.coinbaseAdress });

        const _default = -1
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
}

// export config class
module.exports = { Config };