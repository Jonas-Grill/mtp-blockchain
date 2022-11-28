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

// Send gas endpoint
exports.post = async (req, res) => {
    const address = req.body.address

    if ("address" in req.body) {
        let jwtSecretKey = process.env.JWT_SECRET_KEY;
        let data = {
            time: Date(),
            address: address,
        }

        const token = jwt.sign(data, jwtSecretKey);

        res.send(token);
    }
    else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR)
        res.send({ "success": false, "error": "Address value is needed!" });
    }
};