"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.markdown = markdown;
exports.mdMarker = mdMarker;
exports.findListItemEnd = findListItemEnd;
exports.lineStartsWith = exports.fencedCodeBlockRegex = exports.blockQuoteRegex = exports.listItemRegex = void 0;

var _Symbol2 = _interopRequireWildcard(require("../fable-core/Symbol"));

var _Util = require("../fable-core/Util");

var _CurriedLambda = _interopRequireDefault(require("../fable-core/CurriedLambda"));

var _Seq = require("../fable-core/Seq");

var _List = _interopRequireWildcard(require("../fable-core/List"));

var _String2 = require("../fable-core/String");

var _Nonempty = require("./Nonempty");

var _Prelude = require("./Prelude");

var _Line = require("./Line");

var _Block = require("./Block");

var _Parsing = require("./Parsing.Core");

var _RegExp = require("../fable-core/RegExp");

var _Option = require("../fable-core/Option");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

class MarkdownState {
  constructor(tag) {
    this.tag = tag | 0;
  }

  [_Symbol2.default.reflection]() {
    return {
      type: "Parsing.Markdown.MarkdownState",
      interfaces: ["FSharpUnion", "System.IEquatable", "System.IComparable"],
      cases: [["FencedCodeBlock"], ["Paragraph"], ["NonParagraph"]]
    };
  }

  Equals(other) {
    return this.tag === other.tag;
  }

  CompareTo(other) {
    return (0, _Util.comparePrimitives)(this.tag, other.tag);
  }

}

(0, _Symbol2.setType)("Parsing.Markdown.MarkdownState", MarkdownState);

function markdown(settings) {
  var shrinkIndentTo;
  var fencedCodeBlock;
  var htmlType1to6;
  var table;
  var nonText;
  var atxHeading;
  var blockQuote;
  var indentedCodeBlock;
  var listItem;
  var paragraph;
  var paragraphTerminator;
  var allParsers;
  var startRegex;
  var endRegex;
  var startRegex_1;
  var endRegex_1;
  var startRegex_2;
  var endRegex_2;
  var startRegex_3;
  var endRegex_3;
  var startRegex_4;
  var endRegex_4;
  var startRegex_5;
  var endRegex_5;
  var cellsRowRegex;
  var dividerRowRegex;
  var splitter_1;
  var splitter_2;
  var mapper;
  var takeLines;
  var toBlocks;
  var regex_1;
  var parsers_1;
  return (0, _CurriedLambda.default)((shrinkIndentTo = function (n, lines) {
    var n_1;
    const minIndent = (0, _Seq.reduce)((x, y) => Math.min(x, y), (0, _List.map)(function (s) {
      return s.length - (0, _String2.trim)(s, "start").length;
    }, (0, _Nonempty.toList)(lines))) | 0;
    return (0, _Nonempty.map)((n_1 = minIndent - n | 0, function (str) {
      return _Prelude.String.dropStart(n_1, str);
    }), lines);
  }, fencedCodeBlock = function (_arg1) {
    var f;

    const takeLinesTillEndMarker = function (marker, startLineIndent) {
      const patternInput = _Prelude.List.span($var1 => function (value) {
        return !value;
      }(lineStartsWith(marker)($var1)))(_arg1.data[1]);

      const patternInput_1 = patternInput[1].tail != null ? [(0, _List.ofArray)([patternInput[1].head]), (0, _Nonempty.fromList)(patternInput[1].tail)] : [new _List.default(), null];
      let outputLines;

      if (settings.reformat) {
        const contentIndentShift = function (e2) {
          return startLineIndent < e2 ? startLineIndent : e2;
        }((0, _Seq.reduce)((x, y) => Math.min(x, y), (0, _List.map)(function (l) {
          return l.length;
        }, patternInput[0]))) | 0;

        outputLines = new _Prelude.Nonempty(0, [_Prelude.String.trimStart(_arg1.data[0]), (0, _List.append)((0, _List.map)(function (str_1) {
          return _Prelude.String.dropStart(contentIndentShift, str_1);
        }, patternInput[0]), (0, _List.map)(_Prelude.String.trimStart.bind(_Prelude.String), patternInput_1[0]))]);
      } else {
        outputLines = new _Prelude.Nonempty(0, [_arg1.data[0], (0, _List.append)(patternInput[0], patternInput_1[0])]);
      }

      return [outputLines, patternInput_1[1]];
    };

    const patternInput_2 = (0, _Line.split)(fencedCodeBlockRegex, _arg1.data[0]);
    const hasStartMarker = patternInput_2[0].length > 0;

    if (hasStartMarker) {
      const marker_1 = _Prelude.String.trimStart(patternInput_2[0]);

      const markerChar = (0, _String2.getCharAtIndex)(marker_1, 0);

      if (patternInput_2[1].indexOf(markerChar) >= 0) {
        return null;
      } else {
        return (f = $var2 => (0, _Nonempty.singleton)(new _Block.Block(2, $var2)), function (tupledArg) {
          return _Prelude.Tuple.mapFirst(f, tupledArg[0], tupledArg[1]);
        })(takeLinesTillEndMarker(marker_1, patternInput_2[0].length - marker_1.length));
      }
    } else {
      return null;
    }
  }, htmlType1to6 = (0, _CurriedLambda.default)(_Parsing.tryMany)(function (list) {
    return (0, _List.map)((0, _CurriedLambda.default)(_Parsing.ignoreParser), list);
  }((0, _List.ofArray)([(startRegex = mdMarker("<(script|pre|style)( |>|$)"), endRegex = (0, _RegExp.create)("</(script|pre|style)>", 1), function (arg10_) {
    return (0, _Parsing.takeLinesBetweenMarkers)(startRegex, endRegex, arg10_);
  }), (startRegex_1 = mdMarker("<!--"), endRegex_1 = (0, _RegExp.create)("-->"), function (arg10__1) {
    return (0, _Parsing.takeLinesBetweenMarkers)(startRegex_1, endRegex_1, arg10__1);
  }), (startRegex_2 = mdMarker("<\\?"), endRegex_2 = (0, _RegExp.create)("\\?>"), function (arg10__2) {
    return (0, _Parsing.takeLinesBetweenMarkers)(startRegex_2, endRegex_2, arg10__2);
  }), (startRegex_3 = mdMarker("<![A-Z]"), endRegex_3 = (0, _RegExp.create)(">"), function (arg10__3) {
    return (0, _Parsing.takeLinesBetweenMarkers)(startRegex_3, endRegex_3, arg10__3);
  }), (startRegex_4 = mdMarker("<!\\[CDATA\\["), endRegex_4 = (0, _RegExp.create)("]]>"), function (arg10__4) {
    return (0, _Parsing.takeLinesBetweenMarkers)(startRegex_4, endRegex_4, arg10__4);
  }), (startRegex_5 = mdMarker("</?(address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h1|h2|h3|h4|h5|h6|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|section|source|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul)(\\s|/?>|$)"), endRegex_5 = (0, _RegExp.create)("^\\s*$"), function (arg10__5) {
    return (0, _Parsing.takeLinesBetweenMarkers)(startRegex_5, endRegex_5, arg10__5);
  })]))), table = (cellsRowRegex = (0, _RegExp.create)("\\S\\s*\\|\\s*\\S"), dividerRowRegex = (0, _RegExp.create)(":?-+:?\\s*\\|\\s*:?-+:?"), splitter_1 = function (lines_2) {
    var f_1;
    var f_2;
    const matchValue = (0, _Nonempty.toList)(lines_2);
    const $var3 = matchValue.tail != null ? matchValue.tail.tail != null ? [0, matchValue.head, matchValue.tail.tail, matchValue.tail.head] : [1] : [1];

    switch ($var3[0]) {
      case 0:
        if ((0, _Line.contains)(cellsRowRegex, $var3[1]) ? (0, _Line.contains)(dividerRowRegex, $var3[3]) : false) {
          return (f_1 = _Nonempty.fromList, function (tupledArg_1) {
            return _Prelude.Tuple.mapSecond(f_1, tupledArg_1[0], tupledArg_1[1]);
          })((f_2 = function (rows) {
            return new _Prelude.Nonempty(0, [$var3[1], new _List.default($var3[3], rows)]);
          }, function (tupledArg_2) {
            return _Prelude.Tuple.mapFirst(f_2, tupledArg_2[0], tupledArg_2[1]);
          })(_Prelude.List.span(function (line) {
            return (0, _Line.contains)(cellsRowRegex, line);
          })($var3[2])));
        } else {
          return null;
        }

      case 1:
        return null;
    }
  }, (0, _Parsing.ignoreParser)(splitter_1)), nonText = (0, _Parsing.ignoreParser)((0, _Nonempty.span)(function (s_1) {
    return !((0, _Line.containsText)(s_1) ? true : (0, _Line.isBlank)(s_1));
  })), atxHeading = (0, _Parsing.ignoreParser)((0, _Nonempty.span)(lineStartsWith("#{1,6} "))), blockQuote = (splitter_2 = function (lines_3) {
    return (0, _Option.defaultArg)((0, _Option.filter)($var4 => lineStartsWith(">")((0, _Nonempty.head)($var4)), lines_3), null, (0, _Nonempty.span)(function (s_2) {
      return !(0, _Line.isBlank)(s_2);
    }));
  }, mapper = function (lines_4) {
    var regex;
    var parser;
    const tuples = (0, _Nonempty.map)((regex = (0, _RegExp.create)(" {0,3}>? ?"), function (line_1) {
      return (0, _Line.split)(regex, line_1);
    }), lines_4);
    const prefixes = settings.reformat ? ["> ", "> "] : [tuples.data[0][0], function (option) {
      return (0, _Option.defaultArg)(option, tuples.data[0]);
    }((0, _Seq.tryHead)(tuples.data[1]))[0]];
    return (parser = markdown(settings), function (tupledArg_3) {
      return (0, _Block.splitUp)(parser, tupledArg_3[0], tupledArg_3[1]);
    })([prefixes, (0, _Nonempty.map)(function (tuple) {
      return tuple[1];
    }, tuples)]);
  }, (0, _Parsing.optionParser)(splitter_2, mapper)), indentedCodeBlock = (takeLines = (0, _Nonempty.span)((regex_1 = (0, _RegExp.create)("^(\\s{4}|\\t)"), function (line_2) {
    return (0, _Line.contains)(regex_1, line_2);
  })), toBlocks = $var6 => (0, _Nonempty.singleton)(($var5 => function (arg0) {
    return new _Block.Block(2, arg0);
  }((settings.reformat ? (0, _CurriedLambda.default)(shrinkIndentTo)(4) : function (x) {
    return x;
  })($var5)))($var6)), (0, _Parsing.optionParser)(takeLines, toBlocks)), listItem = function (_arg2) {
    const doStuff = function (listItemPrefix) {
      var parser_1;

      const strippedFirstLine = _Prelude.String.dropStart(listItemPrefix.length, _arg2.data[0]);

      const prefixWithSpace = (0, _String2.endsWith)(listItemPrefix, " ") ? listItemPrefix : listItemPrefix + " ";
      const indent = prefixWithSpace.length | 0;
      const patternInput_3 = strippedFirstLine === "" ? findListItemEnd(indent)(new MarkdownState(2), _arg2.data[1]) : findListItemEnd(indent)(new MarkdownState(1), _arg2.data[1]);
      const tailRegex = (0, _RegExp.create)("^ {0," + (0, _Util.toString)(indent) + "}");
      const headPrefix = settings.reformat ? _Prelude.String.trim(prefixWithSpace) + " " : prefixWithSpace;
      return [(parser_1 = markdown(settings), function (tupledArg_4) {
        return (0, _Block.splitUp)(parser_1, tupledArg_4[0], tupledArg_4[1]);
      })([[headPrefix, (0, _String2.replicate)(headPrefix.length, " ")], new _Prelude.Nonempty(0, [strippedFirstLine, (0, _List.map)($var7 => function (tuple_1) {
        return tuple_1[1];
      }(function (line_3) {
        return (0, _Line.split)(tailRegex, line_3);
      }($var7)), patternInput_3[0])])]), patternInput_3[1]];
    };

    return function (option_1) {
      return (0, _Option.defaultArg)(option_1, null, doStuff);
    }((0, _Line.tryMatch)(listItemRegex, _arg2.data[0]));
  }, paragraph = $var8 => {
    var fn;
    return (fn = function (arg10__6) {
      return (0, _Parsing.firstLineIndentParagraphBlock)(settings.reformat, arg10__6);
    }, function (arg10__7) {
      return (0, _Nonempty.map)(fn, arg10__7);
    })((0, _Parsing.splitIntoChunks)((0, _Parsing.afterRegex)((0, _RegExp.create)("(\\\\|\\s{2})$")))($var8));
  }, paragraphTerminator = (parsers_1 = (0, _List.ofArray)([_Parsing.blankLines, fencedCodeBlock, nonText, listItem, blockQuote, atxHeading, htmlType1to6]), function (lines_5) {
    return (0, _Parsing.tryMany)(parsers_1, lines_5);
  }), allParsers = function (lines_6) {
    return (0, _Option.defaultArgWith)((0, _Parsing.tryMany)((0, _List.ofArray)([_Parsing.blankLines, fencedCodeBlock, table, nonText, atxHeading, indentedCodeBlock, listItem, blockQuote]), lines_6), function () {
      return (0, _Parsing.takeUntil)(paragraphTerminator, paragraph)(lines_6);
    });
  }, $var9 => {
    var fn_1;
    return (0, _Parsing.repeatToEnd)(allParsers)((fn_1 = function (str_3) {
      return (0, _Line.tabsToSpaces)(settings.tabWidth, str_3);
    }, function (arg10__8) {
      return (0, _Nonempty.map)(fn_1, arg10__8);
    })($var9));
  }));
}

function mdMarker(marker) {
  return (0, _RegExp.create)("^ {0,3}" + marker, 1);
}

const listItemRegex = mdMarker("([-+*]|[0-9]+[.)])(\\s+|$)");
exports.listItemRegex = listItemRegex;
const blockQuoteRegex = mdMarker(">");
exports.blockQuoteRegex = blockQuoteRegex;
const fencedCodeBlockRegex = mdMarker("(`{3,}|~{3,})");
exports.fencedCodeBlockRegex = fencedCodeBlockRegex;
const lineStartsWith = (0, _CurriedLambda.default)($var12 => ($var10 => $var11 => (0, _Line.contains)($var10, $var11))(mdMarker($var12)));
exports.lineStartsWith = lineStartsWith;

function findListItemEnd(indent) {
  var trimIndent;
  var modifyState;
  var loop;
  return (0, _CurriedLambda.default)((trimIndent = function (line) {
    let p = 0;

    while ((p < indent ? p < line.length : false) ? line[p] === " " : false) {
      p = p + 1 | 0;
    }

    return line.substr(p);
  }, modifyState = function (state, line_1) {
    return state.tag === 1 ? lineStartsWith("(```|~~~)", line_1) ? new MarkdownState(0) : (!(0, _Line.containsText)(line_1) ? true : lineStartsWith("#{1,6} ", line_1)) ? new MarkdownState(2) : new MarkdownState(1) : state.tag === 2 ? lineStartsWith("(```|~~~)", line_1) ? new MarkdownState(0) : (!(0, _Line.containsText)(line_1) ? true : lineStartsWith("#{1,6} ", line_1)) ? new MarkdownState(2) : (0, _Line.contains)((0, _RegExp.create)("^ {4,}"), line_1) ? new MarkdownState(2) : new MarkdownState(1) : lineStartsWith("(```|~~~)", line_1) ? new MarkdownState(2) : new MarkdownState(0);
  }, loop = function (output, state_1, lines) {
    const exitLoop = function () {
      return [(0, _List.reverse)(output), (0, _Nonempty.fromList)(lines)];
    };

    if (lines.tail == null) {
      return exitLoop();
    } else {
      const trimmedLine = trimIndent(lines.head);

      const continueLoop = function () {
        return loop(new _List.default(lines.head, output), modifyState(state_1, trimmedLine), lines.tail);
      };

      if ((0, _Line.isBlank)(lines.head)) {
        return continueLoop();
      } else {
        const indentIsLess = lines.head.length - trimmedLine.length < indent;

        if (indentIsLess) {
          if (state_1.tag === 1) {
            if (((0, _Line.contains)(blockQuoteRegex, lines.head) ? true : (0, _Line.contains)(listItemRegex, lines.head)) ? true : (0, _Line.contains)(fencedCodeBlockRegex, lines.head)) {
              return exitLoop();
            } else {
              return continueLoop();
            }
          } else if (state_1.tag === 2) {
            return exitLoop();
          } else {
            return continueLoop();
          }
        } else {
          return continueLoop();
        }
      }
    }
  }, (0, _CurriedLambda.default)(loop)(new _List.default())));
}