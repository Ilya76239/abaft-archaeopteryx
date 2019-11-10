"use strict";

const express = require("express");
const mongo = require("mongodb");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const parser = bodyParser.urlencoded({ extended: false });
const cors = require("cors");
const uriHandler = require("./controllers/uriHandler.js");
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

//Mount parser to process POST bodies
app.use(parser);
//mount static assets
app.use("/public", express.static(process.cwd() + "/public"));

app.get("/", function(req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});
//handle shortening requests
app.post("/api/shorturl/new", uriHandler.newURI);

//handle shortURIs
app.get("/api/shorturl/:shUri", uriHandler.handleShortUri);


app.listen(port, function() {
  console.log("Node.js listening ...");
});
