/*----------  Account Helper ----------*/
// Get account Handler
const utilsHandler = require("../../web3/utils")


// Get current block number
exports.getCurrentBlockNumer = async (web3) => {
    const utils = new utilsHandler.NOWUtils();

    return await utils.getCurrentBlockNumber(web3);
}

// Block number to timestamp
exports.getTimestampFromBlockNumber = async (web3, estimateBlockNumber) => {
    const utils = new utilsHandler.NOWUtils();

    return await utils.getTimestampFromBlockNumber(web3, estimateBlockNumber);
}