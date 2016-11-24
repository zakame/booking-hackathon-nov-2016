var express = require('express');
var path = require('path');

var app = express();

app.use(express.static(path.join(__dirname,'public'))); //to fetch the js

app.get('/', function (req, res) {
  res.sendFile('public/index.html');
  res.send();
});

var server = app.listen(8080);
