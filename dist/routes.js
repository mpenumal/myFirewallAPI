"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
// get -> check in rules DB -> respond.
// get, create, update, delete (rules DB) -> rule & ruleList.
exports.router = express_1.Router();
exports.router.get('/', (req, res) => { res.send('Welcome to Firewall, Dude!'); });
// handle rule related operation(s)
exports.router.get('/rule/');
exports.router.post('/rule/');
exports.router.put('/rule/');
exports.router.delete('/rule/');
// handle ruleList related operation(s)
exports.router.get('/ruleList/');
exports.router.post('/ruleList/');
exports.router.put('/ruleList/');
exports.router.delete('/ruleList/');
// handle packet related operation(s)
exports.router.post('/packet/');
