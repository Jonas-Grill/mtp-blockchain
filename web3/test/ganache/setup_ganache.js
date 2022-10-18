(async () => {
    var Web3 = require("web3");

    var web3 = new Web3('HTTP://127.0.0.1:7545');

    // Create test accounts
    acc1 = await web3.eth.privateKeyToAccount("4e1904f05788517969a3c4c9a9ceee40722c0640878dd70dc315b43381c118c2")
    acc2 = await web3.eth.privateKeyToAccount("c895724bedf8d54edc40093b39918fd4168658b8fe7b2f56171af5d33047d4cb")
    acc3 = await web3.eth.privateKeyToAccount("c14bbd720bad4e2843417e8b8d1a7a9faa18dbe7816b5a99586cc222eeba9658")

    web3.eth.accounts.wallet.add(acc1);
    web3.eth.defaultAccount = acc1.address;

    console.log("acc1", acc1);
    console.log("acc2", acc2);
    console.log("acc3", acc3);

    //
    //await web3.eth.personal.unlockAccount(acc2, "c895724bedf8d54edc40093b39918fd4168658b8fe7b2f56171af5d33047d4cb", 10000);
    //await web3.eth.personal.unlockAccount(acc3, "c14bbd720bad4e2843417e8b8d1a7a9faa18dbe7816b5a99586cc222eeba9658", 10000);

})