"use strict";
var Action;
(function (Action) {
    Action[Action["deny"] = 0] = "deny";
    Action[Action["allow"] = 1] = "allow";
    Action[Action["checkRate"] = 2] = "checkRate";
})(Action || (Action = {}));
