const configHandler = require('../src/web3/config')

var assert = require('assert');

const rpcUrl = "http://localhost:8545"
const coinbaseAddress = "0x917441412223Ac1104617Ca07ca9853504BEA5d0"
const networkId = "1337"
const faucetGas = "10"
const faucetBlockNoDifference = "10"

// ganache prepare
var prepare = require('./ganache/setup_ganache')
ganache = new prepare.Ganache_Helper()

describe("test", async function () {
    describe("config", async function () {

        it("should get correct rpc url", async function () {
            // Create config class with config path
            const config = new configHandler.Config(__dirname + "/config/test-config.json")

            assert.equal(config.getRpcUrl, rpcUrl)
        })

        it("should get correct coinbase address", async function () {
            // Create config class with config path
            const config = new configHandler.Config(__dirname + "/config/test-config.json")

            assert.equal(config.getCoinbaseAddress, coinbaseAddress)
        })
        it("should get correct network id", async function () {
            // Create config class with config path
            const config = new configHandler.Config(__dirname + "/config/test-config.json")

            assert.equal(config.networkId, networkId)
        })

        it("should get fresh faucet gas amount", async function () {
            // Create config class with config path
            const config = new configHandler.Config(__dirname + "/config/test-config.json")

            // Set value to default
            accounts = await ganache.get_account()
            await config.setFaucetGas(accounts[0], faucetGas)

            assert.equal(await config.getFreshFaucetGas(), faucetGas)
        })
        it("should overrite correct faucet gas amount", async function () {
            // Create config class with config path
            const config = new configHandler.Config(__dirname + "/config/test-config.json")

            assert.equal(await config.getFreshFaucetGas(99), 99)
        })
        it("should get fresh faucet blockNo difference amount", async function () {
            // Create config class with config path
            const config = new configHandler.Config(__dirname + "/config/test-config.json")

            // Set value to default
            accounts = await ganache.get_account()
            await config.setFaucetBlockNoDifference(accounts[0], faucetGas)

            assert.equal(await config.getFreshFaucetBlockNoDifference(), faucetBlockNoDifference)
        })
        describe("set", async function () {
            it("should set fresh gas amount", async function () {
                // Create config class with config path
                const config = new configHandler.Config(__dirname + "/config/test-config.json")

                // Check initial value
                assert.equal(await config.getFreshFaucetGas(), 10)

                // Set value to 20
                accounts = await ganache.get_account()
                await config.setFaucetGas(accounts[0], 20)

                // Check if value is changed to 20
                assert.equal(await config.getFreshFaucetGas(), 20)
            })

            it("should set faucet blockNo difference amount", async function () {
                // Create config class with config path
                const config = new configHandler.Config(__dirname + "/config/test-config.json")

                // Check initial value
                assert.equal(await config.getFreshFaucetBlockNoDifference(), 10)

                // Set value to 20
                accounts = await ganache.get_account()
                await config.setFaucetBlockNoDifference(accounts[0], 30)

                // Check if value is changed to 20
                assert.equal(await config.getFreshFaucetBlockNoDifference(), 30)
            })
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