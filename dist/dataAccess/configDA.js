"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ruleListConfig = {
    index: 'rulelist',
    type: 'doc'
};
exports.ruleConfig = {
    index: 'rule',
    type: 'doc'
};
// add more logic to apply ruleLists as per necessity
exports.applicableRulesConfig = [
    {
        time: 'day',
        ruleListID: 1
    },
    {
        time: 'night',
        ruleListID: 2
    }
];
