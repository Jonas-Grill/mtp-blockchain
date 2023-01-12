/*----------  Account Helper ----------*/
// Get account Handler
const accountHandler = require("../../web3/account")


// Send gas endpoint
exports.sendEth = async (web3, toAddress) => {
    const account = new accountHandler.NOWAccount(web3)

    await account.sendEth(toAddress)
};

// Get faucet balance
exports.getFaucetBalance = async (web3) => {
    const account = new accountHandler.NOWAccount(web3)

    return await account.getFaucetBalance()
};

// Get Knowledge Coin balance
exports.getKnowledgeCoinBalance = async (web3, address) => {
    const account = new accountHandler.NOWAccount(web3)

    return await account.getKnowledgeCoinBalance(address)
}