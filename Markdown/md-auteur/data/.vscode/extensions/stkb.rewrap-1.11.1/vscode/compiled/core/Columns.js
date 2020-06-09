"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getWrappingColumn = getWrappingColumn;
exports.maybeChangeWrappingColumn = maybeChangeWrappingColumn;
exports.saveDocState = saveDocState;

var _Types = require("./Types");

var _Util = require("../fable-core/Util");

var _Option = require("../fable-core/Option");

var _Seq = require("../fable-core/Seq");

var _Prelude = require("./Prelude");

let lastDocState = (0, _Util.createAtom)(new _Types.DocState("", 0, []));
const docWrappingColumns = new Map();

function getWrappingColumn(filePath, rulers) {
  var x;

  const setAndReturn = function (column) {
    docWrappingColumns.set(filePath, column);
    return column | 0;
  };

  const firstRuler = rulers[0] | 0;

  if (!docWrappingColumns.has(filePath)) {
    return setAndReturn(firstRuler) | 0;
  } else {
    return setAndReturn(function (option) {
      return (0, _Option.defaultArg)(option, firstRuler);
    }((0, _Seq.tryFind)((x = docWrappingColumns.get(filePath) | 0, function (y) {
      return x === y;
    }), rulers))) | 0;
  }
}

function maybeChangeWrappingColumn(docState, rulers) {
  var x_1;

  if (!docWrappingColumns.has(docState.filePath)) {
    return getWrappingColumn(docState.filePath, rulers) | 0;
  } else {
    const shiftRulerIfDocStateUnchanged = function (i) {
      if (docState.Equals(lastDocState())) {
        return (i + 1) % rulers.length | 0;
      } else {
        return i | 0;
      }
    };

    const rulerIndex = function (x) {
      return (0, _Prelude.maybe)(0, shiftRulerIfDocStateUnchanged, x);
    }((0, _Seq.tryFindIndex)((x_1 = docWrappingColumns.get(docState.filePath) | 0, function (y) {
      return x_1 === y;
    }), rulers)) | 0;

    docWrappingColumns.set(docState.filePath, rulers[rulerIndex]);
    return docWrappingColumns.get(docState.filePath) | 0;
  }
}

function saveDocState(docState) {
  return lastDocState(docState);
}