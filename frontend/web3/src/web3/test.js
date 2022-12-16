// IGNORE THIS FILE
// THIS FILE IS ONLY FOR TESTING PURPOSES
// IGNORE THIS FILE

const Web3 = require("web3");
const web3 = new Web3("http://localhost:8545");

const config_handler = require("./config");
const config = new config_handler.Config(web3);

const account_handler = require("./account");
const account = new account_handler.UniMaAccount(web3);

config.setCoinbaseAddress = "0x917441412223Ac1104617Ca07ca9853504BEA5d0"

console.log("Coinbase: " + config.getCoinbaseAddress);

config.setFaucetGas(config.getCoinbaseAddress, 1).then((result) => {
    account.sendEth("0xaDD6e840C640C160C044543A02F7A4d56B29D32e").then((result) => {
        console.log(result);
    });
});



/**
config.getContractAdmins().then((admins) => {
    console.log(admins);
});

*/

/** 
config.appendSemester("Test Semester", 0, 100, 100).then(async (semester_id) => {
    console.log(semester_id);

    const semester_ids = await config.getSemesterIds()

    console.log(semester_ids);

    await config.deleteSemester(semester_id)

    console.log(await config.getSemesterIds());
});
*/

