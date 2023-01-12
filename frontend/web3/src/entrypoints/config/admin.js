/*----------  NOWConfig Helper  ----------*/
// config
const configHandler = require("../../web3/config");

// Add user admin
exports.addUserAdmin = async (web3, address) => {
    const config = new configHandler.NOWConfig(web3);

    await config.addUserAdmin(address);
};

// Add contract admin
exports.addContractAdmin = async (web3, address) => {
    const config = new configHandler.NOWConfig(web3);

    await config.addContractAdmin(address);
};

// Delete user admin
exports.removeUserAdmin = async (web3, address) => {
    const config = new configHandler.NOWConfig(web3);

    await config.removeUserAdmin(address);
};

// Delete contract admin
exports.removeContractAdmin = async (web3, address) => {
    const config = new configHandler.NOWConfig(web3);

    await config.removeContractAdmin(address);
};

// Get admin addresses
exports.getUserAdmins = async (web3, address) => {
    const config = new configHandler.NOWConfig(web3);

    return await config.getUserAdmins(address);
};

// Get contract admin addresses
exports.getContractAdminAddresses = async (web3, address) => {
    const config = new configHandler.NOWConfig(web3);

    return await config.getContractAdminAddresses(address);
};

// Get contract admins
exports.getContractAdmins = async (web3, address) => {
    const config = new configHandler.NOWConfig(web3);

    return await config.getContractAdmins(address);
};

// Is address admin
exports.isAdmin = async (web3, address) => {
    const config = new configHandler.NOWConfig(web3);

    return await config.isAdmin(address)
};

// Is user address admin
exports.isUserAdmin = async (web3, address) => {
    const config = new configHandler.NOWConfig(web3);

    return await config.isUserAdmin(address)
};

// Is contract address admin
exports.isContractAdmin = async (web3, address) => {
    const config = new configHandler.NOWConfig(web3);

    return await config.isContractAdmin(address)
};