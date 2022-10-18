'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

// Get utils Handler
const utilsHandler = require(__dirname + '/src/js/utils')

// Utils
const configHandler = require(__dirname + '/src/js/config')

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

app.post('/send_gas', async (req, res) => {
  var utils = new utilsHandler.Utils(configPath)

  var to = req.body["adress"]

  try {
    await utils.send_gas(config.getCoinbaseAdress, to)
    res.send('Success!');
  }
  catch (err) {
    res.send(err.message);
  }
});

app.listen(PORT, HOST, () => {
  console.log(`Running on http://${HOST}:${PORT}`);
});


