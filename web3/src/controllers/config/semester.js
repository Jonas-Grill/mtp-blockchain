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

// Append new semester
exports.post = async (req, res) => {
    // Validate token from header
    if (utils.verify_jwt_token(jwt, req)) {
        var name = req.body.name
        var start_block = req.body.start_block
        var end_block = req.body.end_block
        var min_knowledge_coin_amount = req.body.min_knowledge_coin_amount

        try {
            var id = await config.appendSemester(name, start_block, end_block, min_knowledge_coin_amount)
            res.status(StatusCodes.OK)
            res.send({ "success": true, "id": id })
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

// Get semester
exports.get = async (req, res) => {
    // Validate token from header
    if (utils.verify_jwt_token(jwt, req)) {
        var id = req.body.id

        try {
            var semester = await config.getSemester(id)
            res.status(StatusCodes.OK)
            res.send({ "success": true, "semester": { "name": semester[0], "start_block": semester[1], "end_block": semester[2], "min_knowledge_coin_amount": semester[3] } })
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

// Delete semester
exports.delete = async (req, res) => {
    // Validate token from header
    if (utils.verify_jwt_token(jwt, req)) {
        var id = req.body.id

        try {
            await config.deleteSemester(id)
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
}
