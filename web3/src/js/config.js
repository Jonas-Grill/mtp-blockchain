class Config {
    constructor(path) {
        const fs = require('fs');
        let json = fs.readFileSync(path);
        let config = JSON.parse(json);

        this.rpcURL = config["rpcURL"];
        this.coinbaseAdress = config["coinbaseAdress"];
        this.gasAmount = config["gasAmount"];
    }

    get getRpcUrl() {
        return this.rpcURL;
    }

    get getCoinbaseAdress() {
        return this.coinbaseAdress;
    }

    get getGasAmount() {
        return parseFloat(this.gasAmount);
    }
}

// export config class
module.exports = { Config };


