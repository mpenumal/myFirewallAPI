"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
function isPacketAllowed(req, res) {
}
exports.packetRouter = express_1.Router();
exports.packetRouter.post('/', isPacketAllowed);
