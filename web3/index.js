'use strict';

/*----------  Requirements  ----------*/
const express = require('express');


/*----------  Express  ----------*/

// Routes
const routes = require('./routes');


// Constants
const PORT = 9090;
const HOST = 'localhost';

const app = express();
app.use(express.json());
app.use('/', routes)

env = require('minimist')(process.argv.slice(2))["env"];

/*=============================================
=                Express - API                =
=============================================*/

app.listen(PORT, HOST, () => {
  console.log(`Running on http://${HOST}:${PORT} in ${env} environment`);
});


