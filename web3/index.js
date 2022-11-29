'use strict';

/*----------  Requirements  ----------*/
const express = require('express');


/*----------  Express  ----------*/

// Routes
const routes = require('./routes');


// Constants
const PORT = 9090;
const HOST = '0.0.0.0';

const app = express();
app.use(express.json());
app.use('/', routes)

/*=============================================
=                Express - API                =
=============================================*/

app.listen(PORT, HOST, () => {
  console.log(`Running on http://${HOST}:${PORT} in ${process.env.NODE_ENV} environment`);
});


