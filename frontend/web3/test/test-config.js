const configHandler = require('../src/web3/config')

var assert = require('assert');

const rpcUrl = "http://127.0.0.1:8545"
const networkId = "1337"
const faucetGas = "2"
const faucetBlockNoDifference = "10"

process.env.RPC_URL = rpcUrl
process.env.NETWORK_ID = networkId

// ganache prepare
var prepare = require('./ganache/setup-ganache')
ganache = new prepare.GanacheHelper()

//utils
const utilsHandler = require('../src/web3/utils')
const utils = new utilsHandler.NOWUtils()

// Require web3 for talking to api
Web3 = require('web3')

// Parse and set rpc url
web3 = new Web3()
web3.setProvider(new web3.providers.HttpProvider(process.env.RPC_URL));

describe("test", async function () {
    describe("config", async function () {

        it("should get correct rpc url", async function () {
            // Create config class with config path
            const config = new configHandler.NOWConfig(web3)

            assert.equal(config.getRpcUrl, rpcUrl)
        })
        it("should get correct network id", async function () {
            // Create config class with config path
            const config = new configHandler.NOWConfig(web3)

            assert.equal(config.networkId, networkId)
        })

        it("should get fresh faucet gas amount", async function () {
            // Create config class with config path
            const config = new configHandler.NOWConfig(web3)

            // Set value to default
            accounts = await ganache.getAccount()
            await config.setFaucetGas(faucetGas)

            assert.equal(await config.getFreshFaucetGas(), faucetGas)
        })
        it("should overrite correct faucet gas amount", async function () {
            // Create config class with config path
            const config = new configHandler.NOWConfig(web3)

            assert.equal(await config.getFreshFaucetGas(99), 99)
        })
        it("should get fresh faucet blockNo difference amount", async function () {
            // Create config class with config path
            const config = new configHandler.NOWConfig(web3)

            // Set value to default
            accounts = await ganache.getAccount()
            await config.setFaucetBlockNoDifference(faucetBlockNoDifference)

            assert.equal(await config.getFreshFaucetBlockNoDifference(), faucetBlockNoDifference)
        })
        describe("set", async function () {
            it("should set fresh gas amount", async function () {
                // Create config class with config path
                const config = new configHandler.NOWConfig(web3)

                // Check initial value
                await config.setFaucetGas(faucetGas)

                assert.equal(await config.getFreshFaucetGas(), faucetGas)

                // Set value to 20
                accounts = await ganache.getAccount()
                await config.setFaucetGas(20)

                // Check if value is changed to 20
                assert.equal(await config.getFreshFaucetGas(), 20)
            })

            it("should set faucet blockNo difference amount", async function () {
                // Create config class with config path
                const config = new configHandler.NOWConfig(web3)

                // Check initial value
                await config.setFaucetBlockNoDifference(10)
                assert.equal(await config.getFreshFaucetBlockNoDifference(), 10)

                // Set value to 20
                accounts = await ganache.getAccount()
                await config.setFaucetBlockNoDifference(30)

                // Check if value is changed to 20
                assert.equal(await config.getFreshFaucetBlockNoDifference(), 30)
            })
        })

        describe("semester", async function () {
            it("should correctly append semester", async function () {
                // Create config class with config path
                const config = new configHandler.NOWConfig(web3)

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
                const config = new configHandler.NOWConfig(web3)

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
                const deletedObject = await config.getSemester(id);

                // Check if values are set back to placeholder
                assert.equal(deletedObject[0], "")
                assert.equal(deletedObject[1], 0)
                assert.equal(deletedObject[2], 0)
                assert.equal(deletedObject[3], 0)

            });

            it("should correctly change semester parameters", async function () {
                // Create config class with config path
                const config = new configHandler.NOWConfig(web3)


                // Create new semester
                var id = await config.appendSemester("test", 0, 1, 55);

                // Set name to test2
                await config.setSemesterName(id, "test2")
                const obj1 = await config.getSemester(id)
                assert.equal(obj1[0], "test2")

                // Set start_block to test2
                await config.setSemesterStartBlock(id, 999)
                const obj2 = await config.getSemester(id)
                assert.equal(obj2[1], 999)

                // Set end_block to test2
                await config.setSemesterEndBlock(id, 777)
                const obj3 = await config.getSemester(id)
                assert.equal(obj3[2], 777)

                // Set minKnowledgeCoinAmount to 99
                await config.setSemesterAmountKnowledgeCoins(id, 99)
                const obj4 = await config.getSemester(id)
                assert.equal(obj4[3], 99)
            });
        })
        describe("assignment", async function () {
            it("should correctly append assignment", async function () {
                // Create config class with config path
                const config = new configHandler.NOWConfig(web3)
                const exampleValidationAddress = utils.getContractAddress("ExampleAssignmentValidator", networkId);

                // CLEAR ASSIGNMENT INFOS
                const fromAddress = await utils.getFromAccount(web3);

                const assignmentValidatorContract = utils.getAssignmentValidatorContract(web3, fromAddress, exampleValidationAddress);

                await assignmentValidatorContract.methods.clearAssignmentInfos().send({
                    from: fromAddress,
                });

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
                var assignmentId = await config.appendAssignment(id, "test", "test_link", exampleValidationAddress, 101, 102);

                // Get new assignment
                const assignmentObject = await config.getAssignment(id, assignmentId);

                // Compare saved values with set values
                assert.equal(assignmentObject[0], "test")
                assert.equal(assignmentObject[1], "test_link")
                assert.equal(assignmentObject[2], exampleValidationAddress)
                assert.equal(assignmentObject[3], 101)
                assert.equal(assignmentObject[4], 102)

                // cleanup
                await config.deleteAssignment(id, assignmentId);
                await config.deleteSemester(id);
            });

            it("should correctly delete assignment", async function () {
                // Create config class with config path
                const config = new configHandler.NOWConfig(web3)
                const exampleValidationAddress = utils.getContractAddress("ExampleAssignmentValidator", networkId);

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
                var assignmentId = await config.appendAssignment(id, "test", "test_link", exampleValidationAddress, 101, 102);

                // Get new assignment
                const assignmentObject = await config.getAssignment(id, assignmentId);

                // Compare saved values with set values
                assert.equal(assignmentObject[0], "test")
                assert.equal(assignmentObject[1], "test_link")
                assert.equal(assignmentObject[2], exampleValidationAddress)
                assert.equal(assignmentObject[3], 101)
                assert.equal(assignmentObject[4], 102)

                // Delete created assignment
                await config.deleteAssignment(id, assignmentId);

                // Get new assignment
                const deletedObject = await config.getAssignment(id, assignmentId);

                // Compare saved values with set values
                assert.equal(deletedObject[0], "")
                assert.equal(deletedObject[1], "")
                assert.equal(deletedObject[2], "0x0000000000000000000000000000000000000000")
                assert.equal(deletedObject[3], 0)
                assert.equal(deletedObject[4], 0)

                // cleanup
                await config.deleteSemester(id);
            });

            it("should correctly change assignment parameters", async function () {
                // Create config class with config path
                const config = new configHandler.NOWConfig(web3)
                const exampleValidationAddress = utils.getContractAddress("ExampleAssignmentValidator", networkId);
                const exampleValidationAddress2 = utils.getContractAddress("ExampleAssignmentValidator2", networkId);

                // Create new semester
                var id = await config.appendSemester("test", 0, 1, 55);

                // Create new assignment
                var assignmentId = await config.appendAssignment(id, "test", "test_link", exampleValidationAddress, 44, 33);

                // Set name to test2
                await config.setAssignmentName(id, assignmentId, "test2")
                const obj1 = await config.getAssignment(id, assignmentId)
                console.log(obj1)
                assert.equal(obj1[0], "test2")

                // Set start_block to test2
                await config.setAssignmentLink(id, assignmentId, "testlink")
                const obj2 = await config.getAssignment(id, assignmentId)
                assert.equal(obj2[1], "testlink")

                // Set end_block to test2
                await config.setAssignmentAddress(id, assignmentId, exampleValidationAddress2)
                const obj3 = await config.getAssignment(id, assignmentId)
                assert.equal(obj3[2], exampleValidationAddress2)

                // Set end_block to test2
                await config.setAssignmentStartBlock(id, assignmentId, 5555)
                const obj4 = await config.getAssignment(id, assignmentId)
                assert.equal(obj4[3], 5555)

                // Set end_block to test2
                await config.setAssignmentEndBlock(id, assignmentId, 6666)
                const obj5 = await config.getAssignment(id, assignmentId)
                assert.equal(obj5[4], 6666)

                // cleanup
                await config.deleteAssignment(id, assignmentId);
                await config.deleteSemester(id);
            });
        })
    })
})