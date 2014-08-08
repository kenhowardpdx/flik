var express = require('express');
var app = express();
var logfmt = require('logfmt');
var gzippo = require('gzippo');

app.use(logfmt.requestLogger());

app.use(gzippo.staticGzip(__dirname + '/dist'));

// these need to go first:
// app.use("/scripts", express.static(__dirname + "/dist/scripts"));
// app.use("/images", express.static(__dirname + "/dist/images"));
// app.use("/styles", express.static(__dirname + "/dist/styles"));
// app.use("/views", express.static(__dirname + "/dist/views"));
// app.use("/fonts", express.static(__dirname + "/dist/fonts"));
// app.use("/auth.html", express.static(__dirname + "/dist/auth.html"));

app.use("/", function(req, res) {
  res.sendfile(__dirname + '/dist/index.html');
});

var port = Number(process.env.PORT || 5000);

app.listen(port, function() {
  console.log("Listening on port " + port);
});
