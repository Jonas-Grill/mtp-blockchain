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
if (process.env.ENV == "test") {
    path = __dirname + "/config/test-config.json"
}
else {
    path = __dirname + "/config/dev-config.json"
}

ganache = new prepare.Ganache_Helper()


describe("test", function () {
    describe("send", function () {
        describe("gas", function () {
            it("send gas", async function () {
                accounts = await ganache.get_account()

                account = new accountHandler.UniMaAccount(path)

                var from = accounts[0]
                var to = accounts[1]

                var oldWeiFrom = await web3.eth.getBalance(from);
                var oldWeiTo = await web3.eth.getBalance(to);

                await account.send_gas(from, to, 1).then(async function () {
                    var newWeiFrom = await web3.eth.getBalance(from);
                    var newWeiTo = await web3.eth.getBalance(to);

                    // Substract from old wei
                    var expectedNewWeiFrom = Number(oldWeiFrom) - Number(1 * 1000000000000000000)

                    // Add to old wei
                    var expectedNewWeiTo = Number(oldWeiTo) + Number(1 * 1000000000000000000)

                    // Make sure that neither the from and to balance is the same
                    assert.notEqual(Number(newWeiFrom), Number(oldWeiFrom))
                    assert.notEqual(Number(newWeiTo), Number(oldWeiTo))

                    // Make sure that the to adress has 1 eth more
                    assert.equal(Number(newWeiTo), expectedNewWeiTo)

                    // Because the from adress has to pay a fee we just check that their balance is lower than (old balance - 1 eth)
                    chaiAssert.isAtMost(Number(expectedNewWeiFrom), Number(oldWeiTo), "New wei ist at most the old wei - 1 eth")
                });
            });
            it("not enough gas", async function () {

                accounts = await ganache.get_account()

                account = new accountHandler.UniMaAccount(path)

                var from = accounts[0]
                var to = accounts[1]

                // Set gas really high so that the from account doesn't have enough eth/gas
                try {
                    await account.send_gas(from, to, 999)
                }
                catch (err) {
                    assert.equal(err, "Error: Coinbase adress do not has enough gas to send.")
                }
            });
            it("from adress is not valid", async function () {

                account = new accountHandler.UniMaAccount(path)

                var from = "wrong_adress"
                var to = accounts[1]

                // Set gas really high so that the from account doesn't have enough eth/gas
                try {
                    await account.send_gas(from, to, 999)
                }
                catch (err) {
                    assert.equal(err, "Error: Either the from or the to adress is not a valid adress.")
                }
            });
            it("to adress is not valid", async function () {

                account = new accountHandler.UniMaAccount(path)

                var from = accounts[0]
                var to = "wrong_adress"

                // Set gas really high so that the from account doesn't have enough eth/gas
                try {
                    await account.send_gas(from, to, 999)
                }
                catch (err) {
                    assert.equal(err, "Error: Either the from or the to adress is not a valid adress.")
                }
            });
        });
    });
});