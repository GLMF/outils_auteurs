"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setType = setType;
exports.getType = getType;
exports.default = void 0;
const types = new Map();

function setType(fullName, cons) {
  types.set(fullName, cons);
}

function getType(fullName) {
  return types.get(fullName);
}

var _default = {
  reflection: Symbol("reflection")
};
exports.default = _default;