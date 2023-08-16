const dotenv = require("dotenv");
// import ENVs from ".env.local" and append to process
dotenv.config({ path: ".env" });
const express = require("express");
const address = require("address");

// create express web server instance
const app = express();
// pull out ENVs from process
const { PORT } = process.env;
const LOCALIP = address.ip();

// tell express to serve up production assets from the out directory
app.use(express.static("dist"));

// tell express to listen for incoming connections on the specified PORT
app.listen(PORT, (err) => {
  if (!err) {
	console.log(`App is running ${LOCALIP}:${PORT}`)
  } else {
    console.err(`\nUnable to start server: ${err}`);
  }
});
