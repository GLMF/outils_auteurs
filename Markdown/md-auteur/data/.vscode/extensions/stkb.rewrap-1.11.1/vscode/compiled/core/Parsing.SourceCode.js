"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sourceCode = sourceCode;
exports.html = exports.css = exports.java = exports.javadocMarkers = exports.cBlock = exports.cLine = exports.block = exports.customBlock = exports.line = exports.customLine = void 0;

var _List = require("../fable-core/List");

var _CurriedLambda = _interopRequireDefault(require("../fable-core/CurriedLambda"));

var _Parsing = require("./Parsing.Core");

var _Nonempty = require("./Nonempty");

var _Block = require("./Block");

var _Parsing2 = require("./Parsing.Comments");

var _Parsing3 = require("./Parsing.Markdown");

var _Parsing4 = require("./Parsing.DocComments");

var _Parsing5 = require("./Parsing.Html");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function sourceCode(commentParsers, settings) {
  let commentParsers_1;
  const parsers = (0, _List.map)((0, _CurriedLambda.default)(function (cp) {
    return (0, _CurriedLambda.default)(cp)(settings);
  }), commentParsers);

  commentParsers_1 = function (lines) {
    return (0, _Parsing.tryMany)(parsers, lines);
  };

  const codeParser = $var1 => {
    return (0, _Nonempty.singleton)((0, _Block.ignore)($var1));
  };

  return (0, _Parsing.repeatToEnd)((0, _Parsing.takeUntil)(commentParsers_1, codeParser));
}

const customLine = (0, _CurriedLambda.default)((0, _CurriedLambda.default)(_Parsing2.lineComment));
exports.customLine = customLine;
const line = (0, _CurriedLambda.default)((0, _CurriedLambda.default)(customLine)((0, _CurriedLambda.default)(_Parsing3.markdown)));
exports.line = line;
const customBlock = (0, _CurriedLambda.default)((0, _CurriedLambda.default)(function (contentParser, tupledArg, tupledArg_1, settings) {
  return (0, _Parsing2.blockComment)(contentParser, tupledArg[0], tupledArg[1], tupledArg_1[0], tupledArg_1[1], settings);
}));
exports.customBlock = customBlock;
const block = (0, _CurriedLambda.default)((0, _CurriedLambda.default)(customBlock)((0, _CurriedLambda.default)(_Parsing3.markdown), ["", ""]));
exports.block = block;
const cLine = (0, _CurriedLambda.default)((0, _CurriedLambda.default)(line)("//"));
exports.cLine = cLine;
const cBlock = (0, _CurriedLambda.default)((0, _CurriedLambda.default)(customBlock)((0, _CurriedLambda.default)(_Parsing3.markdown), ["\\*?", ""], ["/\\*", "\\*/"]));
exports.cBlock = cBlock;
const javadocMarkers = ["/\\*[*!]", "\\*/"];
exports.javadocMarkers = javadocMarkers;
const java = (0, _CurriedLambda.default)((() => {
  const commentParsers = (0, _List.ofArray)([(0, _CurriedLambda.default)(customBlock)(_Parsing4.javadoc, ["\\*?", " * "], javadocMarkers), cBlock, (0, _CurriedLambda.default)(customLine)(_Parsing4.javadoc, "//[/!]"), cLine]);
  return (0, _CurriedLambda.default)(function (settings) {
    return sourceCode(commentParsers, settings);
  });
})());
exports.java = java;
const css = (0, _CurriedLambda.default)((() => {
  const commentParsers = (0, _List.ofArray)([(0, _CurriedLambda.default)(customBlock)(_Parsing4.javadoc, ["\\*?", " * "], javadocMarkers), cBlock]);
  return (0, _CurriedLambda.default)(function (settings) {
    return sourceCode(commentParsers, settings);
  });
})());
exports.css = css;
const html = (0, _CurriedLambda.default)((0, _CurriedLambda.default)(function (settings) {
  return (0, _Parsing5.html)(java, css, settings);
}));
exports.html = html;