"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isBlank = isBlank;
exports.contains = contains;
exports.startsWith = startsWith;
exports.tryMatch = tryMatch;
exports.leadingWhitespace = leadingWhitespace;
exports.containsText = containsText;
exports.split = split;
exports.tabsToSpaces = tabsToSpaces;

var _String2 = require("../fable-core/String");

var _RegExp = require("../fable-core/RegExp");

var _Prelude = require("./Prelude");

var _Option = require("../fable-core/Option");

var _List = _interopRequireWildcard(require("../fable-core/List"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function isBlank(l) {
  return (0, _String2.isNullOrWhiteSpace)(l);
}

function contains(regex, line) {
  return (0, _RegExp.isMatch)(regex, line);
}

function startsWith(marker, line) {
  return (0, _RegExp.isMatch)((0, _RegExp.create)("^\\s*" + marker), line);
}

function tryMatch(regex, line) {
  const m = (0, _RegExp.match)(regex, line);

  if (m != null) {
    return _Prelude.String.takeStart(m.index + m[0].length, line);
  } else {
    return null;
  }
}

function leadingWhitespace(line) {
  return (0, _RegExp.match)(leadingWhitespaceRegex, line)[0];
}

function containsText(line) {
  if (contains((0, _RegExp.create)("[A-Za-z0-9À-￿]"), line)) {
    return !contains((0, _RegExp.create)("^=(begin|end)\\s*$"), line);
  } else {
    return false;
  }
}

function split(regex, line) {
  const prefix = (0, _Option.defaultArg)(tryMatch(regex, line), "");
  return [prefix, _Prelude.String.dropStart(prefix.length, line)];
}

function tabsToSpaces(tabSize, str) {
  const matchValue = (0, _List.reverse)((0, _List.ofArray)((0, _String2.split)(str, "\t")));

  if (matchValue.tail != null) {
    return (0, _String2.join)("", (0, _List.reverse)(function (tail) {
      return new _List.default(matchValue.head, tail);
    }((0, _List.map)(function (s) {
      return (0, _String2.padRight)(s, (~~(s.length / tabSize) + 1) * tabSize);
    }, matchValue.tail))));
  } else {
    return str;
  }
}

const leadingWhitespaceRegex = (0, _RegExp.create)("^\\s*");