'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

// Get account Handler
const accountHandler = require(__dirname + '/src/web3/account')

// account
const configHandler = require(__dirname + '/src/web3/config')

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
    await account.send_gas(config.getCoinbaseAdress, to)
    res.status(200)
    res.send('Successfully send ether!');
  }
  catch (err) {
    res.status(500)
    res.send(err.message);
  }
});

// Set faucet gas value endpoint
app.post(api_prefix + '/config/faucet_gas', async (req, res) => {
  var address = req.body["address"]
  var faucet_gas = req.body["faucet_gas"]

  try {
    await config.setFaucetGas(address, faucet_gas)
    res.status(200)
    res.send('Successfully set faucet gas value!');
  }
  catch (err) {
    res.status(500)
    res.send(err.message);
  }
});

// Get faucet gas value endpoint
app.get(api_prefix + '/config/faucet_gas', async (req, res) => {
  try {
    const faucet_gas = await config.getFreshFaucetGas()
    res.status(200)
    res.send({ 'faucet_gas': faucet_gas });
  }
  catch (err) {
    res.status(500)
    res.send(err.message);
  }
});

// Set faucet block number difference value endpoint
app.post(api_prefix + '/config/faucet_blockno_difference', async (req, res) => {
  var address = req.body["address"]
  var faucet_blockno_difference = req.body["faucet_blockno_difference"]

  try {
    await config.setFreshFaucetBlockNoDifference(address, faucet_blockno_difference)
    res.status(200)
    res.send('Successfully set faucet block number difference value!');
  }
  catch (err) {
    res.status(500)
    res.send(err.message);
  }
});

// Get faucet block number difference value endpoint
app.get(api_prefix + '/config/faucet_blockno_difference', async (req, res) => {
  try {
    const faucet_blockno_difference = await config.getFreshFaucetBlockNoDifference()
    res.status(200)
    res.send({ 'faucet_blockno_difference': faucet_blockno_difference });
  }
  catch (err) {
    res.status(500)
    res.send(err.message);
  }
});

app.listen(PORT, HOST, () => {
  console.log(`Running on http://${HOST}:${PORT}`);
});


