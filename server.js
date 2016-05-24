/*
    Creates a server, that serves up local static files.
    Created by: Dakota Kronberger
*/
var express = require("express");
var app = express();

app.use(express.static('www'));

app.listen(process.env.PORT || 5000, function () {
  console.log('Server started! ' + new Date().toTimeString());
});

app.use(function(req, res, next) {
  res.status(404).send('404: Sorry! I cannot be found...');
});