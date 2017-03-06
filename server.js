var ws = require("nodejs-websocket");
var port = 8001;
var server = ws.createServer(function (conn) {
  console.log("New connection");
  conn.on("text", function (str) {
    console.log(str);
  });
  conn.on("binary", function (str) {
    console.log(str);
  });
  conn.on("close", function () {
    console.log("Connection closed");
  })
}).listen(port);
console.log('localhost:' + port);
