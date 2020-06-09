"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.splitBeforeTags = splitBeforeTags;
exports.godoc = godoc;
exports.ddoc = exports.psdoc = exports.dartdoc = exports.javadoc = void 0;

var _Nonempty = require("./Nonempty");

var _Option = require("../fable-core/Option");

var _CurriedLambda = _interopRequireDefault(require("../fable-core/CurriedLambda"));

var _Parsing = require("./Parsing.Markdown");

var _RegExp = require("../fable-core/RegExp");

var _Line = require("./Line");

var _Block = require("./Block");

var _Parsing2 = require("./Parsing.Core");

var _Parsing3 = require("./Parsing.Comments");

var _List = require("../fable-core/List");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function splitBeforeTags(regex, sectionParser, settings, _arg1) {
  const prependRev = function (_arg2, maybeRest) {
    prependRev: while (true) {
      const nextRest = maybeRest == null ? (0, _Nonempty.singleton)(_arg2.data[0]) : (0, _Nonempty.cons)(_arg2.data[0], (0, _Option.getValue)(maybeRest));
      const matchValue = (0, _Nonempty.fromList)(_arg2.data[1]);

      if (matchValue == null) {
        return nextRest;
      } else {
        _arg2 = (0, _Option.getValue)(matchValue);
        maybeRest = nextRest;
        continue prependRev;
      }
    }
  };

  const loop = function (tagMatch, buffer, maybeOutput, lines) {
    loop: while (true) {
      const parser = tagMatch != null ? (0, _CurriedLambda.default)(sectionParser)(tagMatch) : (0, _CurriedLambda.default)(_Parsing.markdown);

      const addBufferToOutput = function () {
        return prependRev(parser(settings, (0, _Nonempty.rev)()(buffer)), maybeOutput);
      };

      if (lines.tail == null) {
        return (0, _Nonempty.rev)()(addBufferToOutput());
      } else {
        const m = (0, _RegExp.match)(regex, lines.head);
        const patternInput = m != null ? [m, (0, _Nonempty.singleton)(lines.head), addBufferToOutput()] : [tagMatch, (0, _Nonempty.cons)(lines.head, buffer), maybeOutput];
        tagMatch = patternInput[0];
        buffer = patternInput[1];
        maybeOutput = patternInput[2];
        lines = lines.tail;
        continue loop;
      }
    }
  };

  return loop((0, _RegExp.match)(regex, _arg1.data[0]), (0, _Nonempty.singleton)(_arg1.data[0]), null, _arg1.data[1]);
}

const javadoc = (0, _CurriedLambda.default)((() => {
  const tagRegex = (0, _RegExp.create)("^\\s*@(\\w+)(.*)$");
  const sectionParser = (0, _CurriedLambda.default)(function (m) {
    return (0, _Line.isBlank)(m[2] || "") ? (m[1] || "").toLocaleLowerCase() === "example" ? function (_arg1) {
      return $var1 => (0, _Nonempty.singleton)((0, _Block.ignore)($var1));
    } : function (settings, arg20_) {
      return (0, _Parsing2.ignoreFirstLine)(($var2, $var3) => (0, _Parsing.markdown)($var2)($var3), settings, arg20_);
    } : _Parsing.markdown;
  });
  return function (settings_3, arg30_) {
    return splitBeforeTags(tagRegex, sectionParser, settings_3, arg30_);
  };
})());
exports.javadoc = javadoc;
const dartdoc = (0, _CurriedLambda.default)((() => {
  const tagRegex = (0, _RegExp.create)("^\\s*(@nodoc|{@template|{@endtemplate|{@macro)");

  const sectionParser = function (_arg1, settings, arg20_) {
    return (0, _Parsing2.ignoreFirstLine)((0, _CurriedLambda.default)(_Parsing.markdown), settings, arg20_);
  };

  return function (settings_2, arg30_) {
    return splitBeforeTags(tagRegex, sectionParser, settings_2, arg30_);
  };
})());
exports.dartdoc = dartdoc;
const psdoc = (0, _CurriedLambda.default)((() => {
  const tagRegex = (0, _RegExp.create)("^\\s*\\.([A-Z]+)");
  const codeLineRegex = (0, _RegExp.create)("^\\s*PS C:\\\\>");

  const exampleSection = function (settings, lines) {
    let trimmedExampleSection;
    let otherParser;

    const sectionParser = function (_arg1, settings_1, arg20_) {
      return (0, _Parsing2.ignoreFirstLine)((0, _CurriedLambda.default)(_Parsing.markdown), settings_1, arg20_);
    };

    otherParser = function (settings_3, arg30_) {
      return splitBeforeTags(codeLineRegex, sectionParser, settings_3, arg30_);
    };

    trimmedExampleSection = function (settings_4, arg20__1) {
      return (0, _Parsing2.ignoreFirstLine)(otherParser, settings_4, arg20__1);
    };

    const matchValue = (0, _Nonempty.span)(_Line.isBlank)(lines);

    if (matchValue == null) {
      return trimmedExampleSection(settings, lines);
    } else if ((0, _Option.getValue)(matchValue)[1] != null) {
      return (0, _Nonempty.cons)((0, _Block.ignore)((0, _Option.getValue)(matchValue)[0]), trimmedExampleSection(settings, (0, _Option.getValue)((0, _Option.getValue)(matchValue)[1])));
    } else {
      return (0, _Nonempty.singleton)((0, _Block.ignore)((0, _Option.getValue)(matchValue)[0]));
    }
  };

  const sectionParser_1 = (0, _CurriedLambda.default)(function (m) {
    if ((m[1] || "") === "EXAMPLE") {
      return function (settings_5, arg20__2) {
        return (0, _Parsing2.ignoreFirstLine)(exampleSection, settings_5, arg20__2);
      };
    } else {
      const otherParser_1 = function (settings_6) {
        return $var4 => {
          var parser;
          var reformatPrefix;
          return (parser = (0, _Parsing.markdown)(settings_6), function (tupledArg) {
            return (0, _Block.splitUp)(parser, tupledArg[0], tupledArg[1]);
          })((reformatPrefix = function (_arg2) {
            return "  ";
          }, function (lines_1) {
            return (0, _Parsing3.extractWrappable)("", false, reformatPrefix, settings_6, lines_1);
          })($var4));
        };
      };

      return function (settings_7, arg20__3) {
        return (0, _Parsing2.ignoreFirstLine)(($var5, $var6) => otherParser_1($var5)($var6), settings_7, arg20__3);
      };
    }
  });
  return function (settings_8, arg30__1) {
    return splitBeforeTags(tagRegex, sectionParser_1, settings_8, arg30__1);
  };
})());
exports.psdoc = psdoc;
const ddoc = (0, _CurriedLambda.default)((0, _CurriedLambda.default)(_Parsing.markdown));
exports.ddoc = ddoc;

function godoc(settings) {
  var parsers;
  const indentedLines = (0, _Parsing2.ignoreParser)((0, _Nonempty.span)(function (line) {
    return line[0] === " " ? true : line[0] === "\t";
  }));

  const textLines = $var8 => {
    var prefixes;
    return ($var7 => (0, _Nonempty.singleton)(new _Block.Block(1, $var7)))((prefixes = ["", ""], function (lines) {
      return _Block.WrappableModule.fromLines(prefixes, lines);
    })($var8));
  };

  return (0, _Parsing2.repeatToEnd)((0, _Parsing2.takeUntil)((parsers = (0, _List.ofArray)([_Parsing2.blankLines, indentedLines]), function (lines_1) {
    return (0, _Parsing2.tryMany)(parsers, lines_1);
  }), textLines));
}