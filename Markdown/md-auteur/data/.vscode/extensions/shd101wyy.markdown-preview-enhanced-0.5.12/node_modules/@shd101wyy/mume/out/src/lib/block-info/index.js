"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractCommandFromBlockInfo = void 0;
var normalize_1 = require("./normalize");
Object.defineProperty(exports, "normalizeBlockInfo", { enumerable: true, get: function () { return normalize_1.default; } });
var parse_1 = require("./parse");
Object.defineProperty(exports, "parseBlockInfo", { enumerable: true, get: function () { return parse_1.default; } });
exports.extractCommandFromBlockInfo = (info) => info.attributes["cmd"] === true ? info.language : info.attributes["cmd"];
//# sourceMappingURL=index.js.map