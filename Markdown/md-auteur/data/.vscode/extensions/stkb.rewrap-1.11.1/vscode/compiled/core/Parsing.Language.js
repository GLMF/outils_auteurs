"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LanguageModule = void 0;

var _Symbol2 = _interopRequireWildcard(require("../fable-core/Symbol"));

var _Util = require("../fable-core/Util");

var _Types = require("./Types");

var _Prelude = require("./Prelude");

var _Block = require("./Block");

var _String = require("../fable-core/String");

var _CurriedLambda = _interopRequireDefault(require("../fable-core/CurriedLambda"));

var _Seq = require("../fable-core/Seq");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

class Language {
  constructor(tag, data) {
    this.tag = tag | 0;
    this.data = data;
  }

  [_Symbol2.default.reflection]() {
    return {
      type: "Parsing.Language.Language",
      interfaces: ["FSharpUnion"],
      cases: [["Language", "string", (0, _Util.Array)("string"), (0, _Util.Array)("string"), (0, _Util.Function)([_Types.Settings, (0, _Util.makeGeneric)(_Prelude.Nonempty, {
        T: "string"
      }), (0, _Util.makeGeneric)(_Prelude.Nonempty, {
        T: _Block.Block
      })])]]
    };
  }

}

(0, _Symbol2.setType)("Parsing.Language.Language", Language);

const LanguageModule = function (__exports) {
  const create = __exports.create = function (name, aliases, exts, parser) {
    const split = function (s) {
      return (0, _String.split)(s.toLocaleLowerCase(), ["|"], null, 1);
    };

    return new Language(0, [name, [name.toLocaleLowerCase()].concat(split(aliases)), split(exts), parser]);
  };

  const name = __exports.name = function (_arg1) {
    return _arg1.data[0];
  };

  const parser = __exports.parser = function (_arg1) {
    return (0, _CurriedLambda.default)(_arg1.data[3]);
  };

  const matchesFileLanguage = __exports.matchesFileLanguage = function (fileLang, _arg1) {
    return (0, _Seq.exists)($var1 => (0, _Util.equals)(fileLang.toLocaleLowerCase(), $var1), _arg1.data[1]);
  };

  const matchesFilePath = __exports.matchesFilePath = function (path, _arg1) {
    const fileName = (0, _Seq.last)((0, _String.split)(path.toLocaleLowerCase(), "\\", "/"));

    const tryMatch = function (_arg2) {
      if (_arg2.indexOf(".") === 0) {
        return (0, _String.endsWith)(fileName, _arg2);
      } else {
        return fileName === _arg2;
      }
    };

    return (0, _Seq.exists)(tryMatch, _arg1.data[2]);
  };

  return __exports;
}({});

exports.LanguageModule = LanguageModule;