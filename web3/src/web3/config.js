class Config {
    constructor(path) {

        const fs = require('fs');
        let json = fs.readFileSync(path);
        let config = JSON.parse(json);

        this.rpcURL = config["rpcURL"];
        this.coinbaseAdress = config["coinbaseAdress"];
        this.initialGasAmount = config["initialGasAmount"];
    }

    get getRpcUrl() {
        return this.rpcURL;
    }

    get getCoinbaseAdress() {
        return this.coinbaseAdress;
    }

    get getInitialGasAmount() {
        return parseFloat(this.initialGasAmount);
    }
}

// export config class
module.exports = { Config };


