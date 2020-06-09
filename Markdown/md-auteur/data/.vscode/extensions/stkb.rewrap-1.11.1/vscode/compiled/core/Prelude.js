"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.maybe = maybe;
exports.String = exports.List = exports.Tuple = exports.These = exports.Nonempty = void 0;

var _Symbol2 = _interopRequireWildcard(require("../fable-core/Symbol"));

var _Util = require("../fable-core/Util");

var _List = _interopRequireWildcard(require("../fable-core/List"));

var _Seq = require("../fable-core/Seq");

var _Option = require("../fable-core/Option");

var _CurriedLambda = _interopRequireDefault(require("../fable-core/CurriedLambda"));

var _String2 = require("../fable-core/String");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

class Nonempty {
  constructor(tag, data) {
    this.tag = tag | 0;
    this.data = data;
  }

  [_Symbol2.default.reflection]() {
    return {
      type: "Prelude.Nonempty",
      interfaces: ["FSharpUnion", "System.IEquatable", "System.IComparable", "seq"],
      cases: [["Nonempty", (0, _Util.GenericParam)("T"), (0, _Util.makeGeneric)(_List.default, {
        T: (0, _Util.GenericParam)("T")
      })]]
    };
  }

  Equals(other) {
    return this === other || this.tag === other.tag && (0, _Util.equals)(this.data, other.data);
  }

  CompareTo(other) {
    return (0, _Util.compareUnions)(this, other) | 0;
  }

  static op_Addition(_arg1, _arg2) {
    return new Nonempty(0, [_arg1.data[0], (0, _List.append)(_arg1.data[1], new _List.default(_arg2.data[0], _arg2.data[1]))]);
  }

  GetEnumerator() {
    return (0, _Seq.getEnumerator)((0, _Seq.ofList)(new _List.default(this.data[0], this.data[1])));
  }

}

exports.Nonempty = Nonempty;
(0, _Symbol2.setType)("Prelude.Nonempty", Nonempty);

class These {
  constructor(tag, data) {
    this.tag = tag | 0;
    this.data = data;
  }

  [_Symbol2.default.reflection]() {
    return {
      type: "Prelude.These",
      interfaces: ["FSharpUnion", "System.IEquatable", "System.IComparable"],
      cases: [["This", (0, _Util.GenericParam)("A")], ["That", (0, _Util.GenericParam)("B")], ["These", (0, _Util.GenericParam)("A"), (0, _Util.GenericParam)("B")]]
    };
  }

  Equals(other) {
    return this === other || this.tag === other.tag && (0, _Util.equals)(this.data, other.data);
  }

  CompareTo(other) {
    return (0, _Util.compareUnions)(this, other) | 0;
  }

  static maybeThis(maybeA, b) {
    if (maybeA == null) {
      return new These(1, b);
    } else {
      return new These(2, [(0, _Option.getValue)(maybeA), b]);
    }
  }

  static maybeThat(a, maybeB) {
    if (maybeB == null) {
      return new These(0, a);
    } else {
      return new These(2, [a, (0, _Option.getValue)(maybeB)]);
    }
  }

  static mapThis(f, these) {
    if (these.tag === 1) {
      return new These(1, these.data);
    } else if (these.tag === 2) {
      return new These(2, [f(these.data[0]), these.data[1]]);
    } else {
      return new These(0, f(these.data));
    }
  }

}

exports.These = These;
(0, _Symbol2.setType)("Prelude.These", These);

function maybe(def, f, x) {
  return function (option) {
    return (0, _Option.defaultArg)(option, def);
  }(function (option_1) {
    return (0, _Option.defaultArg)(option_1, null, f);
  }(x));
}

const Tuple = function (__exports) {
  const map = __exports.map = function (f, a, b) {
    return [f(a), f(b)];
  };

  const mapFirst = __exports.mapFirst = function (f, a, b) {
    return [f(a), b];
  };

  const mapSecond = __exports.mapSecond = function (f, a, b) {
    return [a, f(b)];
  };

  const replaceFirst = __exports.replaceFirst = function (x, a, b) {
    return [x, b];
  };

  const replaceSecond = __exports.replaceSecond = function (x, a, b) {
    return [a, x];
  };

  return __exports;
}({});

exports.Tuple = Tuple;

const List = function (__exports) {
  const safeSkip = __exports.safeSkip = function (n, list) {
    safeSkip: while (true) {
      if (n > 0) {
        if (list.tail != null) {
          n = n - 1;
          list = list.tail;
          continue safeSkip;
        } else {
          return new _List.default();
        }
      } else {
        return list;
      }
    }
  };

  const span = __exports.span = function (predicate) {
    var loop;
    return (0, _CurriedLambda.default)((loop = function (output, remaining) {
      return remaining.tail != null ? predicate(remaining.head) ? loop(new _List.default(remaining.head, output), remaining.tail) : [(0, _List.reverse)(output), remaining] : [(0, _List.reverse)(output), new _List.default()];
    }, (0, _CurriedLambda.default)(loop)(new _List.default())));
  };

  const safeSplitAt = __exports.safeSplitAt = function (n, list) {
    return [(0, _List.slice)(0, n - 1, list), safeSkip(n, list)];
  };

  const tryTail = __exports.tryTail = function (list) {
    if (list.tail == null) {
      return null;
    } else {
      return list.tail;
    }
  };

  const tryInit = __exports.tryInit = function (list) {
    return (0, _Option.defaultArg)(tryTail((0, _List.reverse)(list)), null, _List.reverse);
  };

  return __exports;
}({});

exports.List = List;

const _String = function (__exports) {
  const dropStart = __exports.dropStart = function (n, str) {
    if (n > str.length) {
      return "";
    } else {
      return str.substr(n > 0 ? n : 0);
    }
  };

  const takeStart = __exports.takeStart = function (n, str) {
    if (n > str.length) {
      return str;
    } else {
      return str.substr(0, n > 0 ? n : 0);
    }
  };

  const trim = __exports.trim = function (str) {
    return (0, _String2.trim)(str, "both");
  };

  const trimStart = __exports.trimStart = function (str) {
    return (0, _String2.trim)(str, "start");
  };

  const trimEnd = __exports.trimEnd = function (str) {
    return (0, _String2.trim)(str, "end");
  };

  return __exports;
}({});

exports.String = _String;