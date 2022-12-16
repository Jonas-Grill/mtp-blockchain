const Web3 = require("web3");
const web3 = new Web3("http://localhost:8545");

const config_handler = require("./config");
const config = new config_handler.Config(web3);

config.setCoinbaseAddress = "0x917441412223Ac1104617Ca07ca9853504BEA5d0"

console.log("Coinbase: " + config.getCoinbaseAddress);

config.appendSemester("Test Semester", 0, 100, 100).then(async (semester_id) => {
    console.log(semester_id);

    const semester_ids = await config.getSemesterIds()

    console.log(semester_ids);

    await config.deleteSemester(semester_id)

    console.log(await config.getSemesterIds());
});


