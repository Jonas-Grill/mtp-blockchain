'use strict';


/*----------  Requirements  ----------*/
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');


/*----------  Config  ----------*/
// Prepare config path
var configPath = ""
if (process.env.NODE_ENV == "test") {
  configPath = __dirname + "/src/config/test-config.json"
}
else {
  configPath = __dirname + "/src/config/dev-config.json"
}


/*----------  Dot ENV  ----------*/
// Set up Global configuration access
dotenv.config();


/*----------  Account Helper ----------*/
// Get account Handler
const accountHandler = require(__dirname + '/src/web3/account')


/*----------  Config Helper  ----------*/
// config
const configHandler = require(__dirname + '/src/web3/config')
// Create config class with config path
const config = new configHandler.Config(configPath)



/*----------  Utils Helper  ----------*/
// utils
const utilsHelper = require(__dirname + '/src/web3/utils')
// Create utils class
const utils = new utilsHelper.UniMaUtils()


/*----------  Assignment Helper  ----------*/
// assignments
const assignmentsHandler = require(__dirname + '/src/web3/assignment')
// Create assignments
const assignments = new assignmentsHandler.UniMaAssignments(configPath);

/*----------  Express  ----------*/
// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

/*=============================================
=                Express - API                =
=============================================*/


/**
 * API v1
 */
var api_prefix = "/api/v1"

/*=============================================
=                      JWT                    =
=============================================*/

app.post(api_prefix + '/account/jwt/generate_token', (req, res) => {
  if (process.env.NODE_ENV == "dev" || process.env.NODE_ENV == "test") {

    const address = req.body["address"]

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
      res.status(500)
      res.send({ "success": false, "error": "Address value is needed!" });
    }
  }
  else {
    res.status(500)
    res.send({ "success": false, "error": "This function is only available in the development or test environment." });
  }
});

app.post(api_prefix + '/account/jwt/validate_token', (req, res) => {

  if (process.env.NODE_ENV == "dev" || process.env.NODE_ENV == "test") {
    if (utils.verify_jwt_token(jwt, req)) {
      res.status(200)
      res.send({ "success": true, "message": "Token valid!" })
    }
    else {
      res.status(401)
      res.send({ "success": false, "error": "Authentication failed! Token not valid!" });
    }
  }
  else {
    res.status(401)
    res.send({ "success": false, "error": "This function is only available in the development or test environment." });
  }
});

/*=====            End of JWT          ======*/


/*=============================================
=                 Admin Config                =
=============================================*/

// Get faucet gas value endpoint
app.get(api_prefix + '/config/admin', async (req, res) => {
  // Validate token from header
  if (utils.verify_jwt_token(jwt, req)) {
    try {
      const admin_address = await config.get_admin()
      res.status(200)
      res.send({ "success": true, "admin_address": admin_address })
    }
    catch (err) {
      res.status(500)
      res.send({ "success": false, "error": err.message });
    }
  }
  else {
    res.status(401)
    res.send({ "success": false, "error": "Authentication failed!" });
  }
});

// Set faucet gas value endpoint
app.post(api_prefix + '/config/admin', async (req, res) => {
  // Validate token from header
  if (utils.verify_jwt_token(jwt, req)) {
    const new_admin_address = req.body["new_admin_address"]

    try {
      const old_admin_address = await config.get_admin()

      await config.set_admin(old_admin_address, new_admin_address)
      res.status(200)
      res.send({ "success": true })
    }
    catch (err) {
      res.status(500)
      res.send({ "success": false, "error": err.message });
    }
  }
  else {
    res.status(401)
    res.send({ "success": false, "error": "Authentication failed!" });
  }
});

/*=====      End of Admin Config       ======*/


/*=============================================
=                Faucet Usage                 =
=============================================*/


// Send gas endpoint
app.post(api_prefix + '/account/send_gas', async (req, res) => {

  // Validate token from header
  if (utils.verify_jwt_token(jwt, req)) {
    var account = new accountHandler.UniMaAccount(configPath)

    var to = req.body["address"]

    try {
      await account.send_gas(config.getCoinbaseAddress, to)
      res.status(200)
      res.send({ "success": true })
    }
    catch (err) {
      res.status(500)
      res.send({ "success": false, "error": err.message });
    }
  }
  else {
    res.status(401)
    res.send({ "success": false, "error": "Authentication failed!" });
  }

});

// Set faucet gas value endpoint
app.post(api_prefix + '/config/faucet_gas', async (req, res) => {
  // Validate token from header
  if (utils.verify_jwt_token(jwt, req)) {
    var address = req.body["address"]
    var faucet_gas = req.body["faucet_gas"]

    try {
      await config.setFaucetGas(address, faucet_gas)
      res.status(200)
      res.send({ "success": true })
    }
    catch (err) {
      res.status(500)
      res.send({ "success": false, "error": err.message });
    }
  }
  else {
    res.status(401)
    res.send({ "success": false, "error": "Authentication failed!" });
  }
});

// Get faucet gas value endpoint
app.get(api_prefix + '/config/faucet_gas', async (req, res) => {
  // Validate token from header
  if (utils.verify_jwt_token(jwt, req)) {
    try {
      const faucet_gas = await config.getFreshFaucetGas()
      res.status(200)
      res.send({ "success": true, "faucet_gas": faucet_gas })
    }
    catch (err) {
      res.status(500)
      res.send({ "success": false, "error": err.message });
    }
  }
  else {
    res.status(401)
    res.send({ "success": false, "error": "Authentication failed!" });
  }
});

// Set faucet block number difference value endpoint
app.post(api_prefix + '/config/faucet_blockno_difference', async (req, res) => {
  // Validate token from header
  if (utils.verify_jwt_token(jwt, req)) {
    var address = req.body["address"]
    var faucet_blockno_difference = req.body["faucet_blockno_difference"]

    try {
      await config.setFaucetBlockNoDifference(address, faucet_blockno_difference)
      res.status(200)
      res.send({ "success": true })
    }
    catch (err) {
      res.status(500)
      res.send({ "success": false, "error": err.message });
    }
  }
  else {
    res.status(401)
    res.send({ "success": false, "error": "Authentication failed!" });
  }
});

// Get faucet block number difference value endpoint
app.get(api_prefix + '/config/faucet_blockno_difference', async (req, res) => {
  // Validate token from header
  if (utils.verify_jwt_token(jwt, req)) {
    try {
      const faucet_blockno_difference = await config.getFreshFaucetBlockNoDifference()
      res.status(200)
      res.send({ "success": true, "faucet_blockno_difference": faucet_blockno_difference })
    }
    catch (err) {
      res.status(500)
      res.send({ "success": false, "error": err.message });
    }
  }
  else {
    res.status(401)
    res.send({ "success": false, "error": "Authentication failed!" });
  }
});

/*=====     End of Faucet Usage       ======*/


/*=============================================
=               Semester Config               =
=============================================*/

// Append new semester
app.post(api_prefix + '/config/semester', async (req, res) => {
  // Validate token from header
  if (utils.verify_jwt_token(jwt, req)) {
    var name = req.body["name"]
    var start_block = req.body["start_block"]
    var end_block = req.body["end_block"]
    var min_knowledge_coin_amount = req.body["min_knowledge_coin_amount"]

    try {
      var id = await config.appendSemester(name, start_block, end_block, min_knowledge_coin_amount)
      res.status(200)
      res.send({ "success": true, "id": id })
    }
    catch (err) {
      res.status(500)
      res.send({ "success": false, "error": err.message });
    }
  }
  else {
    res.status(401)
    res.send({ "success": false, "error": "Authentication failed!" });
  }
});

// Get semester
app.get(api_prefix + '/config/semester', async (req, res) => {
  // Validate token from header
  if (utils.verify_jwt_token(jwt, req)) {
    var id = req.body["id"]

    try {
      var semester = await config.getSemester(id)
      res.status(200)
      res.send({ "success": true, "semester": { "name": semester[0], "start_block": semester[1], "end_block": semester[2], "min_knowledge_coin_amount": semester[3] } })
    }
    catch (err) {
      res.status(500)
      res.send({ "success": false, "error": err.message });
    }
  }
  else {
    res.status(401)
    res.send({ "success": false, "error": "Authentication failed!" });
  }
});

// Delete semester
app.delete(api_prefix + '/config/semester', async (req, res) => {
  // Validate token from header
  if (utils.verify_jwt_token(jwt, req)) {
    var id = req.body["id"]

    try {
      var semester = await config.deleteSemester(id)
      res.status(200)
      res.send({ "success": true })
    }
    catch (err) {
      res.status(500)
      res.send({ "success": false, "error": err.message });
    }
  }
  else {
    res.status(401)
    res.send({ "success": false, "error": "Authentication failed!" });
  }
});


/*----------  Setter  ----------*/

// Set semester name
app.post(api_prefix + '/config/semester/name', async (req, res) => {
  // Validate token from header
  if (utils.verify_jwt_token(jwt, req)) {
    var id = req.body["id"]

    var name = req.body["name"]

    try {
      await config.set_semester_name(id, name)
      res.status(200)
      res.send({ "success": true })
    }
    catch (err) {
      res.status(500)
      res.send({ "success": false, "error": err.message });
    }
  }
  else {
    res.status(401)
    res.send({ "success": false, "error": "Authentication failed!" });
  }
});

// Set semester start block
app.post(api_prefix + '/config/semester/start_block', async (req, res) => {
  // Validate token from header
  if (utils.verify_jwt_token(jwt, req)) {
    var id = req.body["id"]

    var start_block = req.body["start_block"]

    try {
      await config.set_semester_start_block(id, start_block)
      res.status(200)
      res.send({ "success": true })
    }
    catch (err) {
      res.status(500)
      res.send({ "success": false, "error": err.message });
    }
  }
  else {
    res.status(401)
    res.send({ "success": false, "error": "Authentication failed!" });
  }
});

// Set semester end block
app.post(api_prefix + '/config/semester/end_block', async (req, res) => {
  // Validate token from header
  if (utils.verify_jwt_token(jwt, req)) {
    var id = req.body["id"]

    var end_block = req.body["end_block"]

    try {
      await config.set_semester_end_block(id, end_block)
      res.status(200)
      res.send({ "success": true })
    }
    catch (err) {
      res.status(500)
      res.send({ "success": false, "error": err.message });
    }
  }
  else {
    res.status(401)
    res.send({ "success": false, "error": "Authentication failed!" });
  }
});

// Set semester min_knowledge_coin_amount
app.post(api_prefix + '/config/semester/min_knowledge_coin_amount', async (req, res) => {
  // Validate token from header
  if (utils.verify_jwt_token(jwt, req)) {
    var id = req.body["id"]

    var min_knowledge_coin_amount = req.body["min_knowledge_coin_amount"]

    try {
      await config.set_semester_amount_knowledge_coins(id, min_knowledge_coin_amount)
      res.status(200)
      res.send({ "success": true })
    }
    catch (err) {
      res.status(500)
      res.send({ "success": false, "error": err.message });
    }
  }
  else {
    res.status(401)
    res.send({ "success": false, "error": "Authentication failed!" });
  }
});

/*=====     End of Semester Config     ======*/




/*=============================================
=            Assignment Config                =
=============================================*/

// Append new assignment
app.post(api_prefix + '/config/assignment', async (req, res) => {
  // Validate token from header
  if (utils.verify_jwt_token(jwt, req)) {
    var semester_id = req.body["semester_id"]
    var name = req.body["name"]
    var link = req.body["link"]
    var validation_contract_address = req.body["validation_contract_address"]
    var start_block = req.body["start_block"]
    var end_block = req.body["end_block"]

    try {
      var id = await config.appendAssignment(semester_id, name, link, validation_contract_address, start_block, end_block)
      res.status(200)
      res.send({ "success": true, "id": id })
    }
    catch (err) {
      res.status(500)
      res.send({ "success": false, "error": err.message });
    }
  }
  else {
    res.status(401)
    res.send({ "success": false, "error": "Authentication failed!" });
  }
});

// Get assignment
app.get(api_prefix + '/config/assignment', async (req, res) => {
  // Validate token from header
  if (utils.verify_jwt_token(jwt, req)) {
    var semester_id = req.body["semester_id"]
    var assignment_id = req.body["assignment_id"]

    try {
      var assignment = await config.getAssignment(semester_id, assignment_id)
      res.status(200)
      res.send({ "success": true, "semester": { "name": assignment[0], "link": assignment[1], "validation_contract_address": assignment[2], "start_block": assignment[3], "end_block": assignment[4] } })
    }
    catch (err) {
      res.status(500)
      res.send({ "success": false, "error": err.message });
    }
  }
  else {
    res.status(401)
    res.send({ "success": false, "error": "Authentication failed!" });
  }
});

// Delete assignment
app.delete(api_prefix + '/config/assignment', async (req, res) => {
  // Validate token from header
  if (utils.verify_jwt_token(jwt, req)) {
    var semester_id = req.body["semester_id"]
    var assignment_id = req.body["assignment_id"]

    try {
      await config.deleteAssignment(semester_id, assignment_id)
      res.status(200)
      res.send({ "success": true })
    }
    catch (err) {
      res.status(500)
      res.send({ "success": false, "error": err.message });
    }
  }
  else {
    res.status(401)
    res.send({ "success": false, "error": "Authentication failed!" });
  }
});


/*----------  Setter  ----------*/

// Set assignment name
app.post(api_prefix + '/config/assignment/name', async (req, res) => {
  // Validate token from header
  if (utils.verify_jwt_token(jwt, req)) {
    var semester_id = req.body["semester_id"]
    var assignment_id = req.body["assignment_id"]

    var name = req.body["name"]

    try {
      await config.set_assignment_name(semester_id, assignment_id, name)
      res.status(200)
      res.send({ "success": true })
    }
    catch (err) {
      res.status(500)
      res.send({ "success": false, "error": err.message });
    }
  }
  else {
    res.status(401)
    res.send({ "success": false, "error": "Authentication failed!" });
  }
});

// Set assignment link
app.post(api_prefix + '/config/assignment/link', async (req, res) => {
  // Validate token from header
  if (utils.verify_jwt_token(jwt, req)) {
    var semester_id = req.body["semester_id"]
    var assignment_id = req.body["assignment_id"]

    var link = req.body["link"]

    try {
      await config.set_assignment_link(semester_id, assignment_id, link)
      res.status(200)
      res.send({ "success": true })
    }
    catch (err) {
      res.status(500)
      res.send({ "success": false, "error": err.message });
    }
  }
  else {
    res.status(401)
    res.send({ "success": false, "error": "Authentication failed!" });
  }
});

// Set assignment address
app.post(api_prefix + '/config/assignment/address', async (req, res) => {
  // Validate token from header
  if (utils.verify_jwt_token(jwt, req)) {
    var semester_id = req.body["semester_id"]
    var assignment_id = req.body["assignment_id"]

    var address = req.body["address"]

    try {
      await config.set_assignment_address(semester_id, assignment_id, address)
      res.status(200)
      res.send({ "success": true })
    }
    catch (err) {
      res.status(500)
      res.send({ "success": false, "error": err.message });
    }
  }
  else {
    res.status(401)
    res.send({ "success": false, "error": "Authentication failed!" });
  }
});

// Set assignment start_block
app.post(api_prefix + '/config/assignment/start_block', async (req, res) => {
  // Validate token from header
  if (utils.verify_jwt_token(jwt, req)) {
    var semester_id = req.body["semester_id"]
    var assignment_id = req.body["assignment_id"]

    var start_block = req.body["start_block"]

    try {
      await config.set_assignment_start_block(semester_id, assignment_id, start_block)
      res.status(200)
      res.send({ "success": true })
    }
    catch (err) {
      res.status(500)
      res.send({ "success": false, "error": err.message });
    }
  }
  else {
    res.status(401)
    res.send({ "success": false, "error": "Authentication failed!" });
  }
});
// Set assignment address
app.post(api_prefix + '/config/assignment/end_block', async (req, res) => {
  // Validate token from header
  if (utils.verify_jwt_token(jwt, req)) {
    var semester_id = req.body["semester_id"]
    var assignment_id = req.body["assignment_id"]

    var end_block = req.body["end_block"]

    try {
      await config.set_assignment_end_block(semester_id, assignment_id, end_block)
      res.status(200)
      res.send({ "success": true })
    }
    catch (err) {
      res.status(500)
      res.send({ "success": false, "error": err.message });
    }
  }
  else {
    res.status(401)
    res.send({ "success": false, "error": "Authentication failed!" });
  }
});

/*=====    End of Assignment Config    ======*/

/*=============================================
=                Assignments                  =
=============================================*/

// Run validator for test assignment
app.post(api_prefix + '/assignments/assignment_test', async (req, res) => {
  // Validate token from header
  if (utils.verify_jwt_token(jwt, req)) {
    try {
      var student_address = req.body["student_address"]
      var contract_address = req.body["contract_address"]

      const result = await assignments.run_test_assignment(student_address, contract_address)
      res.status(200)
      res.send({ "success": true, "result": result })
    }
    catch (err) {
      res.status(500)
      res.send({ "success": false, "error": err.message });
    }
  }
  else {
    res.status(401)
    res.send({ "success": false, "error": "Authentication failed!" });
  }
});

/*=====  End of Assignments  ======*/

app.listen(PORT, HOST, () => {
  console.log(`Running on http://${HOST}:${PORT} in ${process.env.NODE_ENV} environment`);
});


