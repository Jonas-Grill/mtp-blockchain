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

app.post(api_prefix + '/account/send_gas', async (req, res) => {
  var account = new accountHandler.UniMaAccount(configPath)

  var to = req.body["adress"]

  try {
    await account.send_gas(config.getCoinbaseAdress, to)
    res.send('Success!');
  }
  catch (err) {
    res.send(err.message);
  }
});

app.listen(PORT, HOST, () => {
  console.log(`Running on http://${HOST}:${PORT}`);
});


