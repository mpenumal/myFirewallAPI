"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http = require("http");
const debug = require("debug");
const express = require("express");
const bodyParser = require("body-parser");
const packet_1 = require("./routes/packet");
const rule_1 = require("./routes/rule");
const ruleList_1 = require("./routes/ruleList");
debug('ts-express:server');
exports.app = express();
exports.app.use(bodyParser.json());
exports.app.use(bodyParser.urlencoded({ extended: false }));
exports.app.use('/', express.Router().get('/', (req, res) => { res.send('Welcome to Firewall, Dude!'); }));
exports.app.use('/packet/', packet_1.packetRouter);
exports.app.use('/rule/', rule_1.ruleRouter);
exports.app.use('/rulelist/', ruleList_1.ruleListRouter);
const port = normalizePort(process.env.port || 3000);
exports.app.set('port', port);
const server = http.createServer(exports.app);
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);
function normalizePort(val) {
    const tempPort = (typeof val === 'string') ? parseInt(val, 10) : val;
    if (isNaN(tempPort)) {
        return val;
    }
    else if (tempPort >= 0) {
        return tempPort;
    }
    else {
        return false;
    }
}
// Set up some basic error handling and a terminal log to show us when the app is ready and listening
function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }
    const bind = (typeof port === 'string') ? `Pipe ${port}` : `Port ${port}`;
    switch (error.code) {
        case 'EACCES':
            console.error(`${bind} requires elevated privileges`);
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(`${bind} is already in use`);
            process.exit(1);
            break;
        default:
            throw error;
    }
}
function onListening() {
    const addr = server.address();
    const bind = (typeof addr === 'string') ? `pipe ${addr}` : `port ${addr.port}`;
    debug(`Listening on ${bind}`);
}
