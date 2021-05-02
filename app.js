const express = require("express");
const bodyParser = require("body-parser");
var cors =  require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const routes = require("./routes");

app.use("/", routes);



module.exports = app;
