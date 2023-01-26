// Require web3 for talking to api
const Web3 = require('web3')

// Require get_gas
const accountHandler = require('../src/web3/account')

//utils
const utilsHandler = require('../src/web3/utils')
const utils = new utilsHandler.NOWUtils()

// Parse and set rpc url
const rpcURL = "http://127.0.0.1:8545";
const web3 = new Web3(rpcURL);
web3.setProvider(new web3.providers.HttpProvider(rpcURL));

// Mocha
var assert = require('assert');

// ganache prepare
var prepare = require('./ganache/setup-ganache')

// Chai
var chai = require('chai');
const { expect } = require('chai');
var chaiAssert = chai.assert

const ganache = new prepare.GanacheHelper()

require('dotenv').config()

describe("test", function () {
    describe("send", function () {
        describe("gas", function () {
            it("should send gas from address to another address", async function () {
                const accounts = await ganache.getAccount()

                // PREPARE
                const configHandler = require("../src/web3/config")
                const config = new configHandler.NOWConfig(web3)
                await config.setFaucetBlockNoDifference(0) // Set block difference to 0 so that the faucet can be used

                // rest of test

                const account = new accountHandler.NOWAccount(web3)

                var to = accounts[0]

                var oldWeiTo = await web3.eth.getBalance(to);

                await account.sendEth(to)

                var newWeiTo = await web3.eth.getBalance(to);

                // Make sure that the to address has 1 eth more
                assert.equal(newWeiTo > oldWeiTo, true)
            });
            it("should not send gas, because faucet used too recent", async function () {
                // Skip test if CI is true, because it will fail ONLY CI --> local test will pass
                if (process.env.CI) {
                    this.skip()
                }
                // PREPARE
                const configHandler = require("../src/web3/config")
                const config = new configHandler.NOWConfig(web3)
                await config.setFaucetBlockNoDifference(1000) // Set block difference to 1000 so that the faucet can't be used

                const accounts = await ganache.getAccount()
                const account = new accountHandler.NOWAccount(web3)

                var from = accounts[0]
                var to = accounts[1]

                error_occured = false

                try {
                    // Repeately send eth to the to address and enforce an error
                    await account.sendEth(to)
                    await account.sendEth(to)
                    await account.sendEth(to)
                }
                catch (err) {
                    error_occured = true
                    assert.equal(err, "Error: Returned error: VM Exception while processing transaction: revert Faucet used too recently!")
                }

                assert.equal(error_occured, true)
            });
        });
    });
});