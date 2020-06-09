"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getWrappingColumn = getWrappingColumn;
exports.maybeChangeWrappingColumn = maybeChangeWrappingColumn;
exports.saveDocState = saveDocState;
exports.languageNameForFile = languageNameForFile;
exports.rewrap = rewrap;
exports.strWidth = strWidth;
exports.maybeAutoWrap = maybeAutoWrap;
exports.languages = void 0;

var _Columns = require("./Columns");

var _Prelude = require("./Prelude");

var _Parsing = require("./Parsing.Language");

var _Parsing2 = require("./Parsing.Documents");

var _Seq = require("../fable-core/Seq");

var _Nonempty = require("./Nonempty");

var _Option = require("../fable-core/Option");

var _Selections = require("./Selections");

var _CurriedLambda = _interopRequireDefault(require("../fable-core/CurriedLambda"));

var _Wrapping = require("./Wrapping");

var _Types = require("./Types");

var _String2 = require("../fable-core/String");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getWrappingColumn(filePath, rulers) {
  return (0, _Columns.getWrappingColumn)(filePath, rulers) | 0;
}

function maybeChangeWrappingColumn(docState, rulers) {
  return (0, _Columns.maybeChangeWrappingColumn)(docState, rulers) | 0;
}

function saveDocState(docState) {
  (0, _Columns.saveDocState)(docState);
}

function languageNameForFile(file) {
  return (0, _Prelude.maybe)(null, _Parsing.LanguageModule.name.bind(_Parsing.LanguageModule), (0, _Parsing2.languageForFile)(file));
}

const languages = Array.from((0, _Seq.map)(_Parsing.LanguageModule.name.bind(_Parsing.LanguageModule), (0, _Parsing2.languages)()));
exports.languages = languages;

function rewrap(file, settings, selections, getLine) {
  const parser = (0, _Parsing2.select)(file);
  const linesList = (0, _Nonempty.fromListUnsafe)((0, _Seq.toList)((0, _Seq.unfold)(function (i) {
    return (0, _Option.defaultArg)(getLine(i), null, function (l) {
      return [l, i + 1];
    });
  }, 0)));
  return function (blocks) {
    return (0, _Selections.wrapSelected)(linesList, selections, settings, blocks);
  }((0, _CurriedLambda.default)(parser)(settings)(linesList));
}

function strWidth(usTabSize, str) {
  const tabSize = (usTabSize > 1 ? usTabSize : 1) | 0;

  const loop = function (acc, i) {
    loop: while (true) {
      if (i >= str.length) {
        return acc | 0;
      } else {
        acc = acc + (0, _Wrapping.charWidthEx)(tabSize, i, str[i].charCodeAt(0));
        i = i + 1;
        continue loop;
      }
    }
  };

  return loop(0, 0) | 0;
}

function maybeAutoWrap(file, settings, newText, pos, getLine) {
  const noEdit = new _Types.Edit(0, 0, [], []);

  if ((0, _String2.isNullOrEmpty)(newText)) {
    return noEdit;
  } else if (settings.column < 1) {
    return noEdit;
  } else if (!(0, _String2.isNullOrWhiteSpace)(newText)) {
    return noEdit;
  } else {
    let patternInput;
    const matchValue = newText[0];

    if (matchValue === "\n") {
      patternInput = [true, newText.substr(1)];
    } else if (matchValue === "\r") {
      patternInput = [true, newText.substr(2)];
    } else {
      patternInput = [false, ""];
    }

    if (!patternInput[0] ? newText.length > 1 : false) {
      return noEdit;
    } else {
      const patternInput_1 = [pos.line, pos.character + (patternInput[0] ? 0 : newText.length)];
      const lineText = getLine(patternInput_1[0]);
      const visualWidth = strWidth(settings.tabWidth, _Prelude.String.takeStart(patternInput_1[1], lineText)) | 0;

      if (visualWidth <= settings.column) {
        return noEdit;
      } else {
        const fakeSelection = new _Types.Selection(new _Types.Position(patternInput_1[0], 0), new _Types.Position(patternInput_1[0], lineText.length));

        const wrappedGetLine = function (i) {
          if (i > patternInput_1[0]) {
            return null;
          } else {
            return getLine(i);
          }
        };

        return function (edit) {
          const afterPos = patternInput[0] ? new _Types.Position(patternInput_1[0] + 1, patternInput[1].length) : new _Types.Position(patternInput_1[0], patternInput_1[1]);
          const selections = [new _Types.Selection(afterPos, afterPos)];
          return new _Types.Edit(edit.startLine, edit.endLine, edit.lines, selections);
        }(rewrap(file, settings, [fakeSelection], wrappedGetLine));
      }
    }
  }
}