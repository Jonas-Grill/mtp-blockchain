const configHandler = require('../src/web3/config')

var assert = require('assert');

const rpcUrl = "http://127.0.0.1:8545"
const coinbaseAddress = "0x917441412223Ac1104617Ca07ca9853504BEA5d0"
const networkId = "1337"
const faucetGas = "10"
const faucetBlockNoDifference = "10"

process.env.RPC_URL = rpcUrl
process.env.COINBASE_ADDRESS = coinbaseAddress
process.env.NETWORK_ID = networkId

// ganache prepare
var prepare = require('./ganache/setup_ganache')
ganache = new prepare.Ganache_Helper()

// Require web3 for talking to api
Web3 = require('web3')

// Parse and set rpc url
web3 = new Web3()
web3.setProvider(new web3.providers.HttpProvider(process.env.RPC_URL));

describe("test", async function () {
    describe("config", async function () {

        it("should get correct rpc url", async function () {
            // Create config class with config path
            const config = new configHandler.Config(web3)

            assert.equal(config.getRpcUrl, rpcUrl)
        })

        it("should get correct coinbase address", async function () {
            // Create config class with config path
            const config = new configHandler.Config(web3)

            assert.equal(config.getCoinbaseAddress, coinbaseAddress)
        })
        it("should get correct network id", async function () {
            // Create config class with config path
            const config = new configHandler.Config(web3)

            assert.equal(config.networkId, networkId)
        })

        it("should get fresh faucet gas amount", async function () {
            // Create config class with config path
            const config = new configHandler.Config(web3)

            // Set value to default
            accounts = await ganache.get_account()
            await config.setFaucetGas(accounts[0], faucetGas)

            assert.equal(await config.getFreshFaucetGas(), faucetGas)
        })
        it("should overrite correct faucet gas amount", async function () {
            // Create config class with config path
            const config = new configHandler.Config(web3)

            assert.equal(await config.getFreshFaucetGas(99), 99)
        })
        it("should get fresh faucet blockNo difference amount", async function () {
            // Create config class with config path
            const config = new configHandler.Config(web3)

            // Set value to default
            accounts = await ganache.get_account()
            await config.setFaucetBlockNoDifference(accounts[0], faucetGas)

            assert.equal(await config.getFreshFaucetBlockNoDifference(), faucetBlockNoDifference)
        })
        describe("set", async function () {
            it("should set fresh gas amount", async function () {
                // Create config class with config path
                const config = new configHandler.Config(web3)

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
                const config = new configHandler.Config(web3)

                // Check initial value
                assert.equal(await config.getFreshFaucetBlockNoDifference(), 10)

                // Set value to 20
                accounts = await ganache.get_account()
                await config.setFaucetBlockNoDifference(accounts[0], 30)

                // Check if value is changed to 20
                assert.equal(await config.getFreshFaucetBlockNoDifference(), 30)
            })
        })

        describe("semester", async function () {
            it("should correctly append semester", async function () {
                // Create config class with config path
                const config = new configHandler.Config(web3)

                // Set coinbase address
                accounts = await ganache.get_account()
                config.setCoinbaseAddress = accounts[0]

                // Create new semester
                var id = await config.appendSemester("test", 0, 1, 5);

                // Get semester from blockchain
                const obj = await config.getSemester(id);

                // Compare set values with saved values
                assert.equal(obj[0], "test")
                assert.equal(obj[1], 0)
                assert.equal(obj[2], 1)
                assert.equal(obj[3], 5)
            });

            it("should correctly delete semester", async function () {
                // Create config class with config path
                const config = new configHandler.Config(web3)

                // Set coinbase address
                accounts = await ganache.get_account()
                config.setCoinbaseAddress = accounts[0]

                // Create new semester
                var id = await config.appendSemester("test", 0, 1, 5);

                // Get semester from blockchain
                const obj = await config.getSemester(id);

                // Compare set values with saved values
                assert.equal(obj[0], "test")
                assert.equal(obj[1], 0)
                assert.equal(obj[2], 1)
                assert.equal(obj[3], 5)

                // Delete Semester
                await config.deleteSemester(id);

                // Get deleted semester (values should be default)
                const deleted_obj = await config.getSemester(id);

                // Check if values are set back to placeholder
                assert.equal(deleted_obj[0], "")
                assert.equal(deleted_obj[1], 0)
                assert.equal(deleted_obj[2], 0)
                assert.equal(deleted_obj[3], 0)

            });

            it("should correctly change semester paramaters", async function () {
                // Create config class with config path
                const config = new configHandler.Config(web3)

                // Set coinbase address
                accounts = await ganache.get_account()
                config.setCoinbaseAddress = accounts[0]

                // Create new semester
                var id = await config.appendSemester("test", 0, 1, 55);

                // Set name to test2
                await config.set_semester_name(id, "test2")
                const obj1 = await config.getSemester(id)
                assert.equal(obj1[0], "test2")

                // Set start_block to test2
                await config.set_semester_start_block(id, 999)
                const obj2 = await config.getSemester(id)
                assert.equal(obj2[1], 999)

                // Set end_block to test2
                await config.set_semester_end_block(id, 777)
                const obj3 = await config.getSemester(id)
                assert.equal(obj3[2], 777)

                // Set minKnowledgeCoinAmount to 99
                await config.set_semester_amount_knowledge_coins(id, 99)
                const obj4 = await config.getSemester(id)
                assert.equal(obj4[3], 99)
            });
        })
        describe("assignment", async function () {
            it("should correctly append assignment", async function () {
                // Create config class with config path
                const config = new configHandler.Config(web3)

                // Set coinbase address
                accounts = await ganache.get_account()
                config.setCoinbaseAddress = accounts[0]

                // Create new semester
                var id = await config.appendSemester("test", 0, 1, 55);

                // Get semester from blockchain
                const obj = await config.getSemester(id);

                // Compare set values with saved values
                assert.equal(obj[0], "test")
                assert.equal(obj[1], 0)
                assert.equal(obj[2], 1)
                assert.equal(obj[3], 55)

                // Create new assignment
                var assignment_id = await config.appendAssignment(id, "test", "test_link", "0x720888250810885B45E5C6407EB5A9fBD5CdD38F", 101, 102);

                // Get new assignment
                const assignment_obj = await config.getAssignment(id, assignment_id);

                // Compare saved values with set values
                assert.equal(assignment_obj[0], "test")
                assert.equal(assignment_obj[1], "test_link")
                assert.equal(assignment_obj[2], "0x720888250810885B45E5C6407EB5A9fBD5CdD38F")
                assert.equal(assignment_obj[3], 101)
                assert.equal(assignment_obj[4], 102)
            });

            it("should correctly delete assignment", async function () {
                // Create config class with config path
                const config = new configHandler.Config(web3)

                // Set coinbase address
                accounts = await ganache.get_account()
                config.setCoinbaseAddress = accounts[0]

                // Create new semester
                var id = await config.appendSemester("test", 0, 1, 55);

                // Get semester from blockchain
                const obj = await config.getSemester(id);

                // Compare set values with saved values
                assert.equal(obj[0], "test")
                assert.equal(obj[1], 0)
                assert.equal(obj[2], 1)
                assert.equal(obj[3], 55)

                // Create new assignment
                var assignment_id = await config.appendAssignment(id, "test", "test_link", "0x720888250810885B45E5C6407EB5A9fBD5CdD38F", 101, 102);

                // Get new assignment
                const assignment_obj = await config.getAssignment(id, assignment_id);

                // Compare saved values with set values
                assert.equal(assignment_obj[0], "test")
                assert.equal(assignment_obj[1], "test_link")
                assert.equal(assignment_obj[2], "0x720888250810885B45E5C6407EB5A9fBD5CdD38F")
                assert.equal(assignment_obj[3], 101)
                assert.equal(assignment_obj[4], 102)

                // Delete created assignment
                await config.deleteAssignment(id, assignment_id);

                // Get new assignment
                const deleted_obj = await config.getAssignment(id, assignment_id);

                // Compare saved values with set values
                assert.equal(deleted_obj[0], "")
                assert.equal(deleted_obj[1], "")
                assert.equal(deleted_obj[2], "0x0000000000000000000000000000000000000000")
                assert.equal(deleted_obj[3], 0)
                assert.equal(deleted_obj[4], 0)
            });

            it("should correctly change assignment paramaters", async function () {
                // Create config class with config path
                const config = new configHandler.Config(web3)

                // Set coinbase address
                accounts = await ganache.get_account()
                config.setCoinbaseAddress = accounts[0]

                // Create new semester
                var id = await config.appendSemester("test", 0, 1, 55);

                // Create new assignment
                var assignment_id = await config.appendAssignment(id, "test", "test_link", "0x720888250810885B45E5C6407EB5A9fBD5CdD38F", 44, 33);

                // Set name to test2
                await config.set_assignment_name(id, assignment_id, "test2")
                const obj1 = await config.getAssignment(id, assignment_id)
                console.log(obj1)
                assert.equal(obj1[0], "test2")

                // Set start_block to test2
                await config.set_assignment_link(id, assignment_id, "testlink")
                const obj2 = await config.getAssignment(id, assignment_id)
                assert.equal(obj2[1], "testlink")

                // Set end_block to test2
                await config.set_assignment_address(id, assignment_id, "0xb0a484f3e70b3cdF2CBa764808A9E147D4bCC1f2")
                const obj3 = await config.getAssignment(id, assignment_id)
                assert.equal(obj3[2], "0xb0a484f3e70b3cdF2CBa764808A9E147D4bCC1f2")

                // Set end_block to test2
                await config.set_assignment_start_block(id, assignment_id, 5555)
                const obj4 = await config.getAssignment(id, assignment_id)
                assert.equal(obj4[3], 5555)

                // Set end_block to test2
                await config.set_assignment_end_block(id, assignment_id, 6666)
                const obj5 = await config.getAssignment(id, assignment_id)
                assert.equal(obj5[4], 6666)
            });
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