const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

const StatusCodes = require('http-status-codes').StatusCodes;

const root_path = require('path').resolve('./')

/*----------  Config  ----------*/
// Prepare config path
var configPath = ""
env = require('minimist')(process.argv.slice(2))["env"];
if (env == "prd") {
    configPath = root_path + "/src/config/prd-config.json"
}
else if (env == "tst") {
    configPath = root_path + "/src/config/tst-config.json"
}
else {
    configPath = root_path + "/src/config/dev-config.json"
}


/*----------  Dot ENV  ----------*/
// Set up Global configuration access
dotenv.config();


/*----------  Account Helper ----------*/
// Get account Handler
const accountHandler = require(root_path + '/src/web3/account')


/*----------  Config Helper  ----------*/
// config
const configHandler = require(root_path + '/src/web3/config')
// Create config class with config path
const config = new configHandler.Config(configPath)



/*----------  Utils Helper  ----------*/
// utils
const utilsHelper = require(root_path + '/src/web3/utils')
// Create utils class
const utils = new utilsHelper.UniMaUtils()


// Add admin endpoint
exports.post = async (req, res) => {
    // Validate token from header
    if (utils.verify_jwt_token(jwt, req)) {

        var address = req.body.address

        try {
            await config.add_admin(address)
            res.status(StatusCodes.OK)
            res.send({ "success": true })
        }
        catch (err) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR)
            res.send({ "success": false, "error": err.message });
        }
    }
    else {
        res.status(StatusCodes.UNAUTHORIZED)
        res.send({ "success": false, "error": "Authentication failed!" });
    }
};

// Delete admin endpoint
exports.delete = async (req, res) => {
    // Validate token from header
    if (utils.verify_jwt_token(jwt, req)) {

        var address = req.body.address

        try {
            await config.remove_admin(address)
            res.status(StatusCodes.OK)
            res.send({ "success": true })
        }
        catch (err) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR)
            res.send({ "success": false, "error": err.message });
        }
    }
    else {
        res.status(StatusCodes.UNAUTHORIZED)
        res.send({ "success": false, "error": "Authentication failed!" });
    }
};

// Get admin endpoint
exports.get = async (req, res) => {
    // Validate token from header
    if (utils.verify_jwt_token(jwt, req)) {

        var address = req.body.address

        try {
            var admins = await config.get_admins(address)
            res.status(StatusCodes.OK)
            res.send({ "success": true, "admins": admins })
        }
        catch (err) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR)
            res.send({ "success": false, "error": err.message });
        }
    }
    else {
        res.status(StatusCodes.UNAUTHORIZED)
        res.send({ "success": false, "error": "Authentication failed!" });
    }
};

// Is admin endpoint
exports.check = async (req, res) => {
    // Validate token from header
    if (utils.verify_jwt_token(jwt, req)) {

        var address = req.body.address

        try {
            var is_admin = await config.is_admin(address)
            res.status(StatusCodes.OK)
            res.send({ "success": true, "is_admin": is_admin })
        }
        catch (err) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR)
            res.send({ "success": false, "error": err.message });
        }
    }
    else {
        res.status(StatusCodes.UNAUTHORIZED)
        res.send({ "success": false, "error": "Authentication failed!" });
    }
};