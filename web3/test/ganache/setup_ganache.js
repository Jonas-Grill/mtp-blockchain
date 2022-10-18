(async () => {
    var Web3 = require("web3");

    var web3 = new Web3('http://localhost:8545'); // your geth

    const accounts = await web3.eth.getAccounts();
    const newAccount = await web3.eth.personal.newAccount('test');

    console.log("newAccount", newAccount);

    await web3.eth.personal.unlockAccount(newAccount, 'test', 10000);
    await web3.eth.getBalance(accounts[0], (err, bal) => { console.log("Ganache balance", bal); });
    await web3.eth.sendTransaction({ to: newAccount, from: accounts[0], value: web3.utils.toWei("5", "ether") });
    await web3.eth.getBalance(newAccount, (err, bal) => { console.log("New Account balance", bal); });
})