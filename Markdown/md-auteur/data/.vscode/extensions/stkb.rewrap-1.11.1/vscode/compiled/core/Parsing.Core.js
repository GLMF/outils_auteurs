"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.optionParser = optionParser;
exports.ignoreParser = ignoreParser;
exports.tryMany = tryMany;
exports.takeUntil = takeUntil;
exports.repeatToEnd = repeatToEnd;
exports.splitIntoChunks = splitIntoChunks;
exports.beforeRegex = beforeRegex;
exports.afterRegex = afterRegex;
exports.onIndent = onIndent;
exports.firstLineIndentParagraphBlock = firstLineIndentParagraphBlock;
exports.ignoreFirstLine = ignoreFirstLine;
exports.indentSeparatedParagraphBlock = indentSeparatedParagraphBlock;
exports.takeLinesBetweenMarkers = takeLinesBetweenMarkers;
exports.blankLines = void 0;

var _CurriedLambda = _interopRequireDefault(require("../fable-core/CurriedLambda"));

var _Prelude = require("./Prelude");

var _Option = require("../fable-core/Option");

var _Nonempty = require("./Nonempty");

var _Block = require("./Block");

var _List = _interopRequireWildcard(require("../fable-core/List"));

var _Line = require("./Line");

var _Seq = require("../fable-core/Seq");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function optionParser(splitter, parser) {
  return (0, _CurriedLambda.default)($var1 => {
    var mapping;
    return (mapping = function (tupledArg) {
      return _Prelude.Tuple.mapFirst(parser, tupledArg[0], tupledArg[1]);
    }, function (option) {
      return (0, _Option.defaultArg)(option, null, mapping);
    })(splitter($var1));
  });
}

function ignoreParser(splitter) {
  return (0, _CurriedLambda.default)($var3 => {
    var mapping;
    var f;
    return (mapping = (f = $var2 => (0, _Nonempty.singleton)((0, _Block.ignore)($var2)), function (tupledArg) {
      return _Prelude.Tuple.mapFirst(f, tupledArg[0], tupledArg[1]);
    }), function (option) {
      return (0, _Option.defaultArg)(option, null, mapping);
    })(splitter($var3));
  });
}

function tryMany(parsers, lines) {
  tryMany: while (true) {
    if (parsers.tail != null) {
      const matchValue = parsers.head(lines);

      if (matchValue == null) {
        parsers = parsers.tail;
        lines = lines;
        continue tryMany;
      } else {
        return matchValue;
      }
    } else {
      return null;
    }
  }
}

function takeUntil(otherParser, totalParser) {
  var loop;
  return (0, _CurriedLambda.default)((loop = function (buffer, _arg1) {
    const matchValue = otherParser(_arg1);

    if (matchValue == null) {
      const matchValue_1 = (0, _Nonempty.fromList)(_arg1.data[1]);

      if (matchValue_1 == null) {
        return [totalParser((0, _Nonempty.rev)()(new _Prelude.Nonempty(0, [_arg1.data[0], buffer]))), null];
      } else {
        return loop(new _List.default(_arg1.data[0], buffer), (0, _Option.getValue)(matchValue_1));
      }
    } else {
      const remainingLines = (0, _Option.getValue)(matchValue)[1];
      const blocks = (0, _Option.getValue)(matchValue)[0];
      const matchValue_2 = (0, _Nonempty.fromList)((0, _List.reverse)(buffer));

      if (matchValue_2 == null) {
        return [blocks, remainingLines];
      } else {
        return [(0, _Nonempty.append)(totalParser((0, _Option.getValue)(matchValue_2)), blocks), remainingLines];
      }
    }
  }, (0, _CurriedLambda.default)(loop)(new _List.default())));
}

function repeatToEnd(partialParser) {
  var loop;
  return (0, _CurriedLambda.default)((loop = function (blocks, lines) {
    const matchValue = partialParser(lines);

    if (matchValue[1] == null) {
      return (0, _Nonempty.appendToList)(blocks, matchValue[0]);
    } else {
      const remainingLines = (0, _Option.getValue)(matchValue[1]);
      return loop((0, _List.append)(blocks, (0, _Nonempty.toList)(matchValue[0])), remainingLines);
    }
  }, (0, _CurriedLambda.default)(loop)(new _List.default())));
}

function splitIntoChunks(splitFn) {
  return (0, _CurriedLambda.default)((0, _Nonempty.unfold)(splitFn));
}

function beforeRegex(regex, _arg1) {
  var f;
  var f_1;
  const matchValue = (0, _Nonempty.span)($var4 => function (value) {
    return !value;
  }(function (line) {
    return (0, _Line.contains)(regex, line);
  }($var4)))(_arg1);

  if (matchValue == null) {
    return (f = _Nonempty.fromList, function (tupledArg) {
      return _Prelude.Tuple.mapSecond(f, tupledArg[0], tupledArg[1]);
    })((f_1 = function (t) {
      return new _Prelude.Nonempty(0, [_arg1.data[0], t]);
    }, function (tupledArg_1) {
      return _Prelude.Tuple.mapFirst(f_1, tupledArg_1[0], tupledArg_1[1]);
    })(_Prelude.List.span($var5 => function (value_1) {
      return !value_1;
    }(function (line_1) {
      return (0, _Line.contains)(regex, line_1);
    }($var5)))(_arg1.data[1])));
  } else {
    return (0, _Option.getValue)(matchValue);
  }
}

function afterRegex(regex) {
  return (0, _CurriedLambda.default)((0, _Nonempty.splitAfter)(function (line) {
    return (0, _Line.contains)(regex, line);
  }));
}

function onIndent(tabWidth, _arg1) {
  var f;
  var f_1;

  const indentSize = $var7 => {
    return function (str_1) {
      return str_1.length;
    }(($var6 => function (str) {
      return (0, _Line.tabsToSpaces)(tabWidth, str);
    }((0, _Line.leadingWhitespace)($var6)))($var7));
  };

  const firstLineIndentSize = indentSize(_arg1.data[0]) | 0;
  return (f = _Nonempty.fromList, function (tupledArg) {
    return _Prelude.Tuple.mapSecond(f, tupledArg[0], tupledArg[1]);
  })((f_1 = function (tail) {
    return new _Prelude.Nonempty(0, [_arg1.data[0], tail]);
  }, function (tupledArg_1) {
    return _Prelude.Tuple.mapFirst(f_1, tupledArg_1[0], tupledArg_1[1]);
  })(_Prelude.List.span(function (line_1) {
    return Math.abs(indentSize(line_1) - firstLineIndentSize) < 2;
  })(_arg1.data[1])));
}

function firstLineIndentParagraphBlock(reformat, _arg1) {
  const prefixes = reformat ? ["", ""] : [(0, _Line.leadingWhitespace)(_arg1.data[0]), (0, _Line.leadingWhitespace)(function (option) {
    return (0, _Option.defaultArg)(option, _arg1.data[0]);
  }((0, _Seq.tryHead)(_arg1.data[1])))];
  return (0, _Block.text)(prefixes, function (arg10_) {
    return (0, _Nonempty.map)(_Prelude.String.trimStart.bind(_Prelude.String), arg10_);
  }(_arg1));
}

function ignoreFirstLine(otherParser, settings, _arg1) {
  const headBlock = (0, _Block.ignore)((0, _Nonempty.singleton)(_arg1.data[0]));
  return (0, _Option.defaultArg)((0, _Option.defaultArg)((0, _Nonempty.fromList)(_arg1.data[1]), null, $var8 => function (neList) {
    return (0, _Nonempty.cons)(headBlock, neList);
  }((0, _CurriedLambda.default)(otherParser)(settings)($var8))), (0, _Nonempty.singleton)(headBlock));
}

function indentSeparatedParagraphBlock(textType, lines) {
  const prefix = (0, _Line.leadingWhitespace)((0, _Nonempty.head)(lines));
  return textType([[prefix, prefix], function (arg10_) {
    return (0, _Nonempty.map)(_Prelude.String.trimStart.bind(_Prelude.String), arg10_);
  }(lines)]);
}

function takeLinesBetweenMarkers(startRegex, endRegex, _arg1) {
  const takeUntilEndMarker = function (prefix) {
    var f;
    var n;
    return (f = (0, _Nonempty.replaceHead)(_arg1.data[0]), function (tupledArg) {
      return _Prelude.Tuple.mapFirst(f, tupledArg[0], tupledArg[1]);
    })(afterRegex(endRegex)((0, _Nonempty.mapHead)((n = prefix.length | 0, function (str) {
      return _Prelude.String.dropStart(n, str);
    }), _arg1)));
  };

  return function (option) {
    return (0, _Option.defaultArg)(option, null, takeUntilEndMarker);
  }(function (line) {
    return (0, _Line.tryMatch)(startRegex, line);
  }(_arg1.data[0]));
}

const blankLines = ignoreParser((0, _Nonempty.span)(_Line.isBlank));
exports.blankLines = blankLines;