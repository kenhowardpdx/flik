var express = require('express');
var app = express();
var logfmt = require('logfmt');
var gzippo = require('gzippo');

app.use(logfmt.requestLogger());

app.use(gzippo.staticGzip(__dirname + '/dist'));

var port = Number(process.env.PORT || 5000);

app.listen(port, function() {
  console.log("Listening on port " + port);
});
