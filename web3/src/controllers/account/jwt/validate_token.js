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


/*----------  Utils Helper  ----------*/
// utils
const utilsHelper = require(root_path + '/src/web3/utils')
// Create utils class
const utils = new utilsHelper.UniMaUtils()

// Send gas endpoint
exports.post = async (req, res) => {
    if (utils.verify_jwt_token(jwt, req)) {
        res.status(StatusCodes.OK)
        res.send({ "success": true, "message": "Token valid!" })
    }
    else {
        res.status(StatusCodes.UNAUTHORIZED)
        res.send({ "success": false, "error": "Authentication failed! Token not valid!" });
    }
};