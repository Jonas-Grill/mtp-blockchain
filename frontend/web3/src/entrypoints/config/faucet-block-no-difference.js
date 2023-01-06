/*----------  NOWConfig Helper  ----------*/
// config
const configHandler = require("../../web3/config")


/*----------  Utils Helper  ----------*/
// utils
const utilsHelper = require("../../web3/utils")
// Create utils class
const utils = new utilsHelper.NOWUtils()


/*=============================================
=                 GETTER                     =
=============================================*/

// Get faucet block number difference value endpoint
exports.getFaucetBlockNoDifference = async (web3) => {
    const config = new configHandler.NOWConfig(web3)

    return await config.getFreshFaucetBlockNoDifference()
};

/*=====         End of GETTER          ======*/


/*=============================================
=                   SETTER                  =
=============================================*/

// Set faucet block number difference value endpoint
exports.setFaucetBlockNoDifference = async (web3, faucetBlockNoDifference) => {
    const config = new configHandler.NOWConfig(web3)
    const fromAddress = await utils.getFromAccount(web3);

    await config.setFaucetBlockNoDifference(fromAddress, faucetBlockNoDifference)
};

/*=====          End of   SETTER        ======*/