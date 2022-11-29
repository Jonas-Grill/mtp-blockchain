const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

const StatusCodes = require('http-status-codes').StatusCodes;

const root_path = require('path').resolve('./')

/*----------  Config  ----------*/
// Prepare config path
var configPath = ""
if (process.env.NODE_ENV == "test") {
    configPath = root_path + "/src/config/test-config.json"
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


/*----------  Assignment Helper  ----------*/
// assignments
const assignmentsHandler = require(root_path + '/src/web3/assignment')
// Create assignments
const assignments = new assignmentsHandler.UniMaAssignments(configPath);

// Run validator for test assignment
exports.get = async (req, res) => {
    // Validate token from header
    if (utils.verify_jwt_token(jwt, req)) {
        try {
            var contract_name = req.body.contract_name
            var id = req.body.id

            const result = await assignments.get_test_results(contract_name, id)
            res.status(StatusCodes.OK)
            res.send({ "success": true, "result": result })
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