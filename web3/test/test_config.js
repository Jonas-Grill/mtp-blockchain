const configHandler = require('../src/web3/config')

var assert = require('assert');

const rpcUrl = "http://localhost:8545"
const coinbaseAdress = "0x917441412223Ac1104617Ca07ca9853504BEA5d0"
const faucetGas = "10"
const faucetBlockNoDifference = "10"

describe("test", async function () {
    describe("config", async function () {

        it("should get correct rpc url", async function () {
            // Create config class with config path
            const config = new configHandler.Config(__dirname + "/config/test-config.json")

            assert.equal(config.getRpcUrl, rpcUrl)
        })

        it("should get correct coinbase adress", async function () {
            // Create config class with config path
            const config = new configHandler.Config(__dirname + "/config/test-config.json")

            assert.equal(config.getCoinbaseAdress, coinbaseAdress)
        })

        it("should get correct faucet gas amount", async function () {
            // Create config class with config path
            const config = new configHandler.Config(__dirname + "/config/test-config.json")

            assert.equal(await config.getFreshFaucetGas(), faucetGas)
        })
        it("should overrite correct faucet gas amount", async function () {
            // Create config class with config path
            const config = new configHandler.Config(__dirname + "/config/test-config.json")

            assert.equal(await config.getFreshFaucetGas(99), 99)
        })

        it("should get correct faucet blockNo difference amount", async function () {
            // Create config class with config path
            const config = new configHandler.Config(__dirname + "/config/test-config.json")

            assert.equal(await config.getFreshFaucetBlockNoDifference(), faucetBlockNoDifference)
        })

        it("load non existing file", async function () {
            try {
                // Create config class with config path using non existing PATH
                new configHandler.Config("FAKE/PATH")
            } catch (error) {
                assert.equal(error.code, "ENOENT")
            }
        })
    })
})