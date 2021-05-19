const express = require("express");
// const bodyParser = require("body-parser");
var cors =  require('cors');

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
const routes = require("./routes");

app.use("/", routes);



module.exports = app;
