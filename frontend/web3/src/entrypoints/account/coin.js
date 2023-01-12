/*----------  Account Helper ----------*/
// Get account Handler
const accountHandler = require("../../web3/account")


// Get Knowledge Coin balance
exports.getKnowledgeCoinBalance = async (web3, address) => {
    const account = new accountHandler.NOWAccount(web3)

    return await account.getKnowledgeCoinBalance(address)
}

// Get Knowledge Coin balance in range
exports.getKnowledgeCoinBalanceInRange = async (web3, address, fromBlock, toBlock) => {
    const account = new accountHandler.NOWAccount(web3)

    return await account.getKnowledgeCoinBalanceInRange(address, fromBlock, toBlock)
}