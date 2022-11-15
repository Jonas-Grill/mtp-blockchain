'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

// Get account Handler
const accountHandler = require(__dirname + '/src/web3/account')

// account
const configHandler = require(__dirname + '/src/web3/config')

// assignments
const assignmentsHandler = require(__dirname + '/src/web3/assignment')


// Prepare config path
var configPath = ""
if (process.env.ENV == "test") {
  configPath = __dirname + "/src/config/test-config.json"
}
else {
  configPath = __dirname + "/src/config/dev-config.json"
}

// Create config class with config path
const config = new configHandler.Config(configPath)

// Create assignments
const assignments = new assignmentsHandler.UniMaAssignments(configPath);

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

// App
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'html/test.html'));
});

/**
 * API v1
 */
var api_prefix = "/api/v1"

// Send gas endpoint
app.post(api_prefix + '/account/send_gas', async (req, res) => {
  var account = new accountHandler.UniMaAccount(configPath)

  var to = req.body["address"]

  try {
    await account.send_gas(config.getCoinbaseAddress, to)
    res.status(200)
    res.send({ "success": true })
  }
  catch (err) {
    res.status(500)
    res.send(res.send({ "success": false, "error": err.message }));
  }
});

// Set faucet gas value endpoint
app.post(api_prefix + '/config/faucet_gas', async (req, res) => {
  var address = req.body["address"]
  var faucet_gas = req.body["faucet_gas"]

  try {
    await config.setFaucetGas(address, faucet_gas)
    res.status(200)
    res.send({ "success": true })
  }
  catch (err) {
    res.status(500)
    res.send(res.send({ "success": false, "error": err.message }));
  }
});

// Get faucet gas value endpoint
app.get(api_prefix + '/config/faucet_gas', async (req, res) => {
  try {
    const faucet_gas = await config.getFreshFaucetGas()
    res.status(200)
    res.send({ "success": true, "faucet_gas": faucet_gas })
  }
  catch (err) {
    res.status(500)
    res.send(res.send({ "success": false, "error": err.message }));
  }
});

// Set faucet block number difference value endpoint
app.post(api_prefix + '/config/faucet_blockno_difference', async (req, res) => {
  var address = req.body["address"]
  var faucet_blockno_difference = req.body["faucet_blockno_difference"]

  try {
    await config.setFaucetBlockNoDifference(address, faucet_blockno_difference)
    res.status(200)
    res.send({ "success": true })
  }
  catch (err) {
    res.status(500)
    res.send(res.send({ "success": false, "error": err.message }));
  }
});

// Get faucet block number difference value endpoint
app.get(api_prefix + '/config/faucet_blockno_difference', async (req, res) => {
  try {
    const faucet_blockno_difference = await config.getFreshFaucetBlockNoDifference()
    res.status(200)
    res.send({ "success": true, "faucet_blockno_difference": faucet_blockno_difference })
  }
  catch (err) {
    res.status(500)
    res.send(res.send({ "success": false, "error": err.message }));
  }
});


/*=============================================
=               Semester Config               =
=============================================*/

// Append new semester
app.post(api_prefix + '/config/semester', async (req, res) => {
  var name = req.body["name"]
  var start_block = req.body["start_block"]
  var end_block = req.body["end_block"]

  try {
    var id = await config.appendSemester(name, start_block, end_block)
    res.status(200)
    res.send({ "success": true, "id": id })
  }
  catch (err) {
    res.status(500)
    res.send(res.send({ "success": false, "error": err.message }));
  }
});

// Get semester
app.get(api_prefix + '/config/semester', async (req, res) => {
  var id = req.body["id"]

  try {
    var semester = await config.getSemester(id)
    res.status(200)
    res.send({ "success": true, "semester": { "name": semester[0], "start_block": semester[1], "end_block": semester[2] } })
  }
  catch (err) {
    res.status(500)
    res.send(res.send({ "success": false, "error": err.message }));
  }
});

// Delete semester
app.delete(api_prefix + '/config/semester', async (req, res) => {
  var id = req.body["id"]

  try {
    var semester = await config.deleteSemester(id)
    res.status(200)
    res.send({ "success": true })
  }
  catch (err) {
    res.status(500)
    res.send(res.send({ "success": false, "error": err.message }));
  }
});


/*----------  Setter  ----------*/

// Set semester name
app.post(api_prefix + '/config/semester/name', async (req, res) => {
  var id = req.body["id"]

  var name = req.body["name"]

  try {
    await config.set_semester_name(id, name)
    res.status(200)
    res.send({ "success": true })
  }
  catch (err) {
    res.status(500)
    res.send(res.send({ "success": false, "error": err.message }));
  }
});

// Set semester start block
app.post(api_prefix + '/config/semester/start_block', async (req, res) => {
  var id = req.body["id"]

  var start_block = req.body["start_block"]

  try {
    await config.set_semester_start_block(id, start_block)
    res.status(200)
    res.send({ "success": true })
  }
  catch (err) {
    res.status(500)
    res.send(res.send({ "success": false, "error": err.message }));
  }
});

// Set semester end block
app.post(api_prefix + '/config/semester/end_block', async (req, res) => {
  var id = req.body["id"]

  var end_block = req.body["end_block"]

  try {
    await config.set_semester_end_block(id, end_block)
    res.status(200)
    res.send({ "success": true })
  }
  catch (err) {
    res.status(500)
    res.send(res.send({ "success": false, "error": err.message }));
  }
});

/*=====     End of Semester Config     ======*/




/*=============================================
=            Assignment Config                =
=============================================*/

// Append new assignment
app.post(api_prefix + '/config/assignment', async (req, res) => {
  var semester_id = req.body["semester_id"]
  var name = req.body["name"]
  var link = req.body["link"]
  var validation_contract_address = req.body["validation_contract_address"]

  try {
    var id = await config.appendAssignment(semester_id, name, link, validation_contract_address)
    res.status(200)
    res.send({ "success": true, "id": id })
  }
  catch (err) {
    res.status(500)
    res.send(res.send({ "success": false, "error": err.message }));
  }
});

// Get assignment
app.get(api_prefix + '/config/assignment', async (req, res) => {
  var semester_id = req.body["semester_id"]
  var assignment_id = req.body["assignment_id"]

  try {
    var assignment = await config.getAssignment(semester_id, assignment_id)
    res.status(200)
    res.send({ "success": true, "semester": { "name": assignment[0], "link": assignment[1], "validation_contract_address": assignment[2] } })
  }
  catch (err) {
    res.status(500)
    res.send(res.send({ "success": false, "error": err.message }));
  }
});

// Delete assignment
app.delete(api_prefix + '/config/assignment', async (req, res) => {
  var semester_id = req.body["semester_id"]
  var assignment_id = req.body["assignment_id"]

  try {
    await config.deleteAssignment(semester_id, assignment_id)
    res.status(200)
    res.send({ "success": true })
  }
  catch (err) {
    res.status(500)
    res.send(res.send({ "success": false, "error": err.message }));
  }
});


/*----------  Setter  ----------*/

// Set assignment name
app.post(api_prefix + '/config/assignment/name', async (req, res) => {
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
    res.send(res.send({ "success": false, "error": err.message }));
  }
});

// Set assignment link
app.post(api_prefix + '/config/assignment/link', async (req, res) => {
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
    res.send(res.send({ "success": false, "error": err.message }));
  }
});

// Set assignment address
app.post(api_prefix + '/config/assignment/address', async (req, res) => {
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
    res.send(res.send({ "success": false, "error": err.message }));
  }
});

/*=====    End of Assignment Config    ======*/

/*=============================================
=                Assignments                  =
=============================================*/

// Run validator for test assignment
app.post(api_prefix + '/assignments/assignment_test', async (req, res) => {
  try {
    var student_address = req.body["student_address"]
    var contract_address = req.body["contract_address"]

    const result = await assignments.run_test_assignment(student_address, contract_address)
    res.status(200)
    res.send({ "success": true, "result": result })
  }
  catch (err) {
    res.status(500)
    res.send(res.send({ "success": false, "error": err.message }));
  }
});

/*=====  End of Assignments  ======*/





app.listen(PORT, HOST, () => {
  console.log(`Running on http://${HOST}:${PORT}`);
});


