const configHandler = require('../src/js/config')

var assert = require('assert');

const rpcUrl = "http://127.0.0.1:7545"
const coinbaseAdress = "0xF5F07Df523774d6d4a7dBBb3C41e35de93d3B0C0"
const initialGasAmount = "10"

describe("test", function () {
    describe("config", function () {

        it("get rpc url", function () {
            // Create config class with config path
            const config = new configHandler.Config(__dirname + "/config/test-config.json")

            assert.equal(config.getRpcUrl, rpcUrl)
        })

        it("get coinbase adress", function () {
            // Create config class with config path
            const config = new configHandler.Config(__dirname + "/config/test-config.json")

            assert.equal(config.getCoinbaseAdress, coinbaseAdress)
        })

        it("get initial gas amount", function () {
            // Create config class with config path
            const config = new configHandler.Config(__dirname + "/config/test-config.json")

            assert.equal(config.getInitialGasAmount, initialGasAmount)
        })

        it("load non existing file", function () {
            try {
                // Create config class with config path using non existing PATH
                new configHandler.Config("FAKE/PATH")
            } catch (error) {
                assert.equal(error.code, "ENOENT")
            }
        })
    })
})