const PORT = process.env.PORT;
//const PORT = 12345;

//const _ = require('lodash');
const HTTP = require('http');
const CACHES = [];

const SERVER = HTTP.createServer(function (req, res) {
    let time = new Date().toString();

    res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
    res.write(time, "utf-8");
    res.end();
});

SERVER.listen(PORT, function () {
    console.log(PORT);
});