const express = require('express');
const fs = require("fs");
const app = express();

let port = 8081;
app.use(express.static('.'));

app.listen(port);