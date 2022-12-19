
/*----------  NOWConfig Helper  ----------*/
// config#
const configHandler = require("../../web3/config")

/*----------  Utils Helper  ----------*/
// utils
const utilsHelper = require("../../web3/utils")
// Create utils class
const utils = new utilsHelper.NOWUtils()


/*=============================================
=            GETTER            =
=============================================*/

// Get semester
exports.getSemester = async (web3, semesterIds) => {
    const config = new configHandler.NOWConfig(web3)

    var semester = await config.getSemester(semesterIds)

    return { "name": semester[0], "startBlock": semester[1], "endBlock": semester[2], "minKnowledgeCoinAmount": semester[3] };
};

// Get semester ids
exports.getSemesterIds = async (web3) => {
    const config = new configHandler.NOWConfig(web3)

    return await config.getSemesterIds()
};

/*=====  End of GETTER  ======*/

/*=============================================
=            SETTER            =
=============================================*/


/*----------  ADD  ----------*/

// Append new semester
exports.appendSemester = async (web3, name, startBlock, endBlock, minKnowledgeCoinAmount) => {
    const config = new configHandler.NOWConfig(web3)

    return await config.appendSemester(name, startBlock, endBlock, minKnowledgeCoinAmount)
};

/*----------  DELETE  ----------*/

// Delete semester
exports.deleteSemester = async (web3, semesterIds) => {
    const config = new configHandler.NOWConfig(web3)

    await config.deleteSemester(semesterIds)
}

/*----------  CHANGE  ----------*/

// Set faucet gas value
exports.setSemesterAmountKnowledgeCoins = async (web3, semesterId, minKnowledgeCoinAmount) => {
    const config = new configHandler.NOWConfig(web3)

    await config.setSemesterAmountKnowledgeCoins(semesterId, minKnowledgeCoinAmount)
};

// Set semester name
exports.setSemesterName = async (web3, semesterId, name) => {
    const config = new configHandler.NOWConfig(web3)

    await config.setSemesterName(semesterId, name);
};

// Set semester start block
exports.setSemesterStartBlock = async (web3, semesterId, startBlock) => {
    const config = new configHandler.NOWConfig(web3)

    await config.setSemesterStartBlock(semesterId, startBlock)
};

// Set semester end block
exports.setSemesterEndBlock = async (web3, semesterId, endBlock) => {
    const config = new configHandler.NOWConfig(web3)

    await config.setSemesterEndBlock(semesterId, endBlock)
};


/*=====  End of SETTER  ======*/