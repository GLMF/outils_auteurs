"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.regex = regex;
exports.html = html;
exports.cssMarkers = exports.scriptMarkers = void 0;

var _RegExp = require("../fable-core/RegExp");

var _CurriedLambda = _interopRequireDefault(require("../fable-core/CurriedLambda"));

var _Nonempty = require("./Nonempty");

var _List = require("../fable-core/List");

var _Block = require("./Block");

var _Option = require("../fable-core/Option");

var _Parsing = require("./Parsing.Core");

var _Parsing2 = require("./Parsing.Comments");

var _Parsing3 = require("./Parsing.Markdown");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function regex(str) {
  return (0, _RegExp.create)(str, 1);
}

const scriptMarkers = [regex("<script"), regex("</script>")];
exports.scriptMarkers = scriptMarkers;
const cssMarkers = [regex("<style"), regex("</style>")];
exports.cssMarkers = cssMarkers;

function html(scriptParser, cssParser, settings) {
  const embeddedScript = (0, _CurriedLambda.default)(function (markers, contentParser) {
    const afterFirstLine = function (_arg1, lines) {
      const patternInput = (0, _Nonempty.rev)()(lines);

      if ((0, _RegExp.isMatch)(markers[1], patternInput.data[0])) {
        const matchValue = (0, _Nonempty.fromList)((0, _List.reverse)(patternInput.data[1]));

        if (matchValue == null) {
          return (0, _Nonempty.singleton)((0, _Block.ignore)((0, _Nonempty.singleton)((0, _Nonempty.last)(lines))));
        } else {
          return (0, _Nonempty.snoc)((0, _Block.ignore)((0, _Nonempty.singleton)((0, _Nonempty.last)(lines))), contentParser(settings, (0, _Option.getValue)(matchValue)));
        }
      } else {
        return contentParser(settings, lines);
      }
    };

    return (0, _Parsing.optionParser)(function (arg10_) {
      return (0, _Parsing.takeLinesBetweenMarkers)(markers[0], markers[1], arg10_);
    }, function (arg20_) {
      return (0, _Parsing.ignoreFirstLine)(afterFirstLine, settings, arg20_);
    });
  });
  let otherParsers;
  const parsers = (0, _List.ofArray)([_Parsing.blankLines, (0, _Parsing2.blockComment)((0, _CurriedLambda.default)(_Parsing3.markdown), "", "", "<!--", "-->", settings), (0, _CurriedLambda.default)(embeddedScript)(scriptMarkers, scriptParser), (0, _CurriedLambda.default)(embeddedScript)(cssMarkers, cssParser)]);

  otherParsers = function (lines_1) {
    return (0, _Parsing.tryMany)(parsers, lines_1);
  };

  const paragraphBlocks = $var2 => {
    var fn_1;
    return (fn_1 = function (lines_2) {
      return (0, _Parsing.indentSeparatedParagraphBlock)(function (tupledArg) {
        return (0, _Block.text)(tupledArg[0], tupledArg[1]);
      }, lines_2);
    }, function (arg10__2) {
      return (0, _Nonempty.map)(fn_1, arg10__2);
    })(($var1 => {
      var fn;
      var regex_1;
      return (fn = (0, _Parsing.splitIntoChunks)((0, _Parsing.afterRegex)(regex("\\>\\s*$"))), function (neList) {
        return (0, _Nonempty.collect)(fn, neList);
      })((0, _Parsing.splitIntoChunks)((regex_1 = regex("^\\s*<"), function (arg10__1) {
        return (0, _Parsing.beforeRegex)(regex_1, arg10__1);
      }))($var1));
    })($var2));
  };

  return (0, _Parsing.repeatToEnd)((0, _Parsing.takeUntil)(otherParsers, paragraphBlocks));
}