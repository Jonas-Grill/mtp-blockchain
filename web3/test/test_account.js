// Require web3 for talking to api
const Web3 = require('web3')

// Require get_gas
const accountHandler = require('../src/web3/account')

// Parse and set rpc url
const rpcURL = "http://localhost:8545";
const web3 = new Web3(rpcURL);
web3.setProvider(new web3.providers.HttpProvider(rpcURL));

// Mocha
var assert = require('assert');

// ganache prepare
var prepare = require('./ganache/setup_ganache')

// Chai
var chai = require('chai');
const { expect } = require('chai');
var chaiAssert = chai.assert

var path = ""
if (process.env.NODE_ENV == "test") {
    path = __dirname + "/config/test-config.json"
}
else {
    path = __dirname + "/config/dev-config.json"
}

ganache = new prepare.Ganache_Helper()

describe("test", function () {
    describe("send", function () {
        describe("gas", function () {
            it("should send gas from address to another address", async function () {
                accounts = await ganache.get_account()

                account = new accountHandler.UniMaAccount(config_path = path)
                account.config.setCoinbaseAddress = accounts[0];
                account.config.setNetworkId = await web3.eth.net.getId()

                var from = accounts[0]
                var to = accounts[1]

                var oldWeiFrom = await web3.eth.getBalance(from);
                var oldWeiTo = await web3.eth.getBalance(to);

                await account.send_gas(from, to, gas = 1, blockNumberDifference = 0).then(async function () {
                    var newWeiFrom = await web3.eth.getBalance(from);
                    var newWeiTo = await web3.eth.getBalance(to);

                    // Substract from old wei
                    var expectedNewWeiFrom = Number(oldWeiFrom) - Number(1 * 1000000000000000000)

                    // Add to old wei
                    var expectedNewWeiTo = Number(oldWeiTo) + Number(1 * 1000000000000000000)

                    // Make sure that neither the from and to balance is the same
                    assert.notEqual(Number(newWeiFrom), Number(oldWeiFrom))
                    assert.notEqual(Number(newWeiTo), Number(oldWeiTo))

                    // Make sure that the to address has 1 eth more
                    assert.equal(Number(newWeiTo), expectedNewWeiTo)

                    // Because the from address has to pay a fee we just check that their balance is lower than (old balance - 1 eth)
                    chaiAssert.isAtMost(Number(expectedNewWeiFrom), Number(oldWeiFrom), "New wei ist at most the old wei - 1 eth")
                });
            });
            it("should not send gas, because coinbase has not enough gas", async function () {

                accounts = await ganache.get_account()

                account = new accountHandler.UniMaAccount(config_path = path)
                account.config.setCoinbaseAddress = accounts[0];
                account.config.setNetworkId = await web3.eth.net.getId()

                var from = accounts[0]
                var to = accounts[1]

                error_occured = false
                // Set gas really high so that the from account doesn't have enough eth/gas
                try {
                    await account.send_gas(from, to, 999, 0)
                }
                catch (err) {
                    error_occured = true
                    assert.equal(err, "Error: Coinbase address do not has enough gas to send.")
                }
                assert.equal(error_occured, true)
            });
            it("should not send gas, because _from address is not valid", async function () {

                account = new accountHandler.UniMaAccount(config_path = path)
                account.config.setNetworkId = await web3.eth.net.getId()

                var from = "wrong_address"
                var to = accounts[1]

                error_occured = false
                // Set gas really high so that the from account doesn't have enough eth/gas
                try {
                    await account.send_gas(from, to, 999, 0)
                }
                catch (err) {
                    error_occured = true
                    assert.equal(err, "Error: Either the from or the to address is not a valid address.")
                }
                assert.equal(error_occured, true)
            });
            it("should not send gas, because _to address is not valid", async function () {

                account = new accountHandler.UniMaAccount(config_path = path)
                account.config.setCoinbaseAddress = accounts[0];
                account.config.setNetworkId = await web3.eth.net.getId()

                var from = accounts[0]
                var to = "wrong_address"

                error_occured = false
                // Set gas really high so that the from account doesn't have enough eth/gas
                try {
                    await account.send_gas(from, to, 999, 0)
                }
                catch (err) {
                    error_occured = true
                    assert.equal(err, "Error: Either the from or the to address is not a valid address.")
                }

                assert.equal(error_occured, true)
            });
            it("should not send gas, because faucet used too recent", async function () {

                account = new accountHandler.UniMaAccount(config_path = path)
                account.config.setCoinbaseAddress = accounts[0];
                account.config.setNetworkId = await web3.eth.net.getId()

                var from = accounts[0]
                var to = accounts[1]

                error_occured = false
                // Set gas really high so that the from account doesn't have enough eth/gas
                try {
                    // Set blockNo difference to 10 to make sure error occures
                    await account.send_gas(from, to, blockNumberDifference = 10)
                    await account.send_gas(from, to, blockNumberDifference = 10)
                    await account.send_gas(from, to, blockNumberDifference = 10)
                }
                catch (err) {
                    error_occured = true
                    assert.equal(err, "Error: Faucet used too recent.")
                }

                assert.equal(error_occured, true)
            });
        });
    });

    describe("get", function () {
        describe.skip("first transaction", function () {
            // Get first trx from account with trxs
            it("should get first transaction from account with transactions", async function () {
                accounts = await ganache.get_account()

                account = new accountHandler.UniMaAccount(config_path = path)
                account.config.setCoinbaseAddress = accounts[0];

                var from = accounts[0]
                var to = accounts[1]

                await account.send_gas(from, to, 1, 0).then(async function () {
                    trx = await account.get_first_transaction(from)
                    chaiAssert.isAbove(Number(trx.blockNumber), Number(0), "Block number of first block has to be higher than 1")
                });
            });

            // Get first trx from account without trxs -> expect error
            it("should get no first transaction from account without transactions", async function () {
                // Generate fresh account
                address = await web3.eth.personal.newAccount('test')
                console.log(address)

                trx = await account.get_first_transaction(address)

                // make sure that the trx is empty, therefore no transactions for this account
                assert.equal(Object.keys(trx).length === 0, true)
            });
        });
    });
});