/*----------  Account Helper ----------*/
// Get account Handler
const accountHandler = require(root_path + '/web3/src/web3/account');

/*----------  Config Helper  ----------*/
// config
const configHandler = require("../../web3/config");


/*----------  Utils Helper  ----------*/
// utils
const utilsHelper = require("../../web3/utils")
// Create utils class
const utils = new utilsHelper.UniMaUtils();

// Add user admin
exports.addUserAdmin = async (web3, new_address) => {
    const config = new configHandler.Config(web3);

    await config.addUserAdmin(new_address);
};

// Add contract admin
exports.addContractAdmin = async (web3, new_address) => {
    const config = new configHandler.Config(web3);

    await config.addContractAdmin(new_address);
};

// Delete user admin
exports.removeUserAdmin = async (web3, address) => {
    const config = new configHandler.Config(web3);

    await config.removeUserAdmin(address);
};

// Delete contract admin
exports.removeContractAdmin = async (web3, address) => {
    const config = new configHandler.Config(web3);

    await config.removeContractAdmin(address);
};

// Get admin addresses
exports.getUserAdmins = async (web3, new_address) => {
    const config = new configHandler.Config(web3);

    return await config.getUserAdmins(new_address);
};

// Get contract admin addresses
exports.getContractAdminAddresses = async (web3, new_address) => {
    const config = new configHandler.Config(web3);

    return await config.getContractAdminAddresses(new_address);
};

// Get contract admins
exports.getContractAdmins = async (web3, new_address) => {
    const config = new configHandler.Config(web3);

    return await config.getContractAdmins(new_address);
};

// Is address admin
exports.isAdmin = async (web3, new_address) => {
    const config = new configHandler.Config(web3);

    return await config.isAdmin(new_address)
};

// Is user address admin
exports.isUserAdmin = async (web3, new_address) => {
    const config = new configHandler.Config(web3);

    return await config.isUserAdmin(new_address)
};

// Is contract address admin
exports.isAdmin = async (web3, new_address) => {
    const config = new configHandler.Config(web3);

    return await config.isContractAdmin(new_address)
};