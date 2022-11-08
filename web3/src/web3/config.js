class Config {
    constructor(path) {

        const fs = require('fs');
        let json = fs.readFileSync(path);
        let config = JSON.parse(json);

        this.rpcURL = config["rpcURL"];
        this.coinbaseAdress = config["coinbaseAdress"];
        this.initialGasAmount = config["initialGasAmount"];
        this.faucetBlocknumberDifference = config["faucetBlocknumberDifference"]
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

    get getInitialGasAmount() {
        return parseFloat(this.initialGasAmount);
    }

    get getFaucetBlocknumberDifference() {
        return this.faucetBlocknumberDifference;
    }


}

// export config class
module.exports = { Config };


