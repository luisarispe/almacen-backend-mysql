const express = require("express");
require("dotenv").config();
const morgan = require("morgan");
const cors = require("cors");

//app express
const app = express();

//para ver las rutas
app.use(morgan("dev"));

app.use(cors());

app.set("port", process.env.PORT_SERVER || 4000);

module.exports = app;
