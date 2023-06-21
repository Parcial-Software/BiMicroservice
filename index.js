const express = require("express");
const http = require("http");
const cors = require("cors");
const morgan = require('morgan'); //Middleware de registro de solicitudes HTTP para node.js
const bodyparser = require("body-parser");
require("dotenv").config();

const { dbConnection } = require("./src/database/bisw");

const app = express();
const server = http.createServer(app);

// settings
app.set("port", process.env.PORT || 5000);
var corsOpt = {
  origin: "*",
};
app.use(cors(corsOpt));
app.use(morgan('dev'));

app.use(bodyparser.urlencoded({ limit: "15mb", extended: true }));
app.use(bodyparser.json({ limit: "15mb" }));

//init all web routes
/*
app.use("/api", require("./src/routes/usuariosroutes"));
app.use("/api", require("./src/routes/denunciasroutes"));
*/

app.use("/api", require("./src/routes/prueba"));

//Start Server
server.listen(app.get("port"), () => {
  console.log("Streaming Service on port ", app.get("port"));
});

// DB Config MONGODB
dbConnection();
