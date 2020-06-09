"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.compare = compare;
exports.compareTo = compareTo;
exports.startsWith = startsWith;
exports.indexOfAny = indexOfAny;
exports.printf = printf;
exports.toConsole = toConsole;
exports.toConsoleError = toConsoleError;
exports.toText = toText;
exports.toFail = toFail;
exports.fsFormat = fsFormat;
exports.format = format;
exports.endsWith = endsWith;
exports.initialize = initialize;
exports.insert = insert;
exports.isNullOrEmpty = isNullOrEmpty;
exports.isNullOrWhiteSpace = isNullOrWhiteSpace;
exports.join = join;
exports.validateGuid = validateGuid;
exports.newGuid = newGuid;
exports.guidToArray = guidToArray;
exports.arrayToGuid = arrayToGuid;
exports.toBase64String = toBase64String;
exports.fromBase64String = fromBase64String;
exports.padLeft = padLeft;
exports.padRight = padRight;
exports.remove = remove;
exports.replace = replace;
exports.replicate = replicate;
exports.getCharAtIndex = getCharAtIndex;
exports.split = split;
exports.trim = trim;
exports.filter = filter;

var _Date = require("./Date");

var _RegExp = require("./RegExp");

var _Util = require("./Util");

const fsFormatRegExp = /(^|[^%])%([0+ ]*)(-?\d+)?(?:\.(\d+))?(\w)/;
const formatRegExp = /\{(\d+)(,-?\d+)?(?:\:(.+?))?\}/g; // From https://stackoverflow.com/a/13653180/3922220

const guidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const StringComparison = {
  CurrentCulture: 0,
  CurrentCultureIgnoreCase: 1,
  InvariantCulture: 2,
  InvariantCultureIgnoreCase: 3,
  Ordinal: 4,
  OrdinalIgnoreCase: 5
};

function cmp(x, y, ic) {
  function isIgnoreCase(i) {
    return i === true || i === StringComparison.CurrentCultureIgnoreCase || i === StringComparison.InvariantCultureIgnoreCase || i === StringComparison.OrdinalIgnoreCase;
  }

  function isOrdinal(i) {
    return i === StringComparison.Ordinal || i === StringComparison.OrdinalIgnoreCase;
  }

  if (x == null) {
    return y == null ? 0 : -1;
  }

  if (y == null) {
    return 1;
  } // everything is bigger than null


  if (isOrdinal(ic)) {
    if (isIgnoreCase(ic)) {
      x = x.toLowerCase();
      y = y.toLowerCase();
    }

    return x === y ? 0 : x < y ? -1 : 1;
  } else {
    if (isIgnoreCase(ic)) {
      x = x.toLocaleLowerCase();
      y = y.toLocaleLowerCase();
    }

    return x.localeCompare(y);
  }
}

function compare(...args) {
  switch (args.length) {
    case 2:
      return cmp(args[0], args[1], false);

    case 3:
      return cmp(args[0], args[1], args[2]);

    case 4:
      return cmp(args[0], args[1], args[2] === true);

    case 5:
      return cmp(args[0].substr(args[1], args[4]), args[2].substr(args[3], args[4]), false);

    case 6:
      return cmp(args[0].substr(args[1], args[4]), args[2].substr(args[3], args[4]), args[5]);

    case 7:
      return cmp(args[0].substr(args[1], args[4]), args[2].substr(args[3], args[4]), args[5] === true);

    default:
      throw new Error("String.compare: Unsupported number of parameters");
  }
}

function compareTo(x, y) {
  return cmp(x, y, false);
}

function startsWith(str, pattern, ic) {
  if (str.length >= pattern.length) {
    return cmp(str.substr(0, pattern.length), pattern, ic) === 0;
  }

  return false;
}

function indexOfAny(str, anyOf, ...args) {
  if (str == null || str === "") {
    return -1;
  }

  const startIndex = args.length > 0 ? args[0] : 0;

  if (startIndex < 0) {
    throw new Error("String.indexOfAny: Start index cannot be negative");
  }

  const length = args.length > 1 ? args[1] : str.length - startIndex;

  if (length < 0) {
    throw new Error("String.indexOfAny: Length cannot be negative");
  }

  if (length > str.length - startIndex) {
    throw new Error("String.indexOfAny: Invalid startIndex and length");
  }

  str = str.substr(startIndex, length);

  for (const c of anyOf) {
    const index = str.indexOf(c);

    if (index > -1) {
      return index + startIndex;
    }
  }

  return -1;
}

function toHex(value) {
  return value < 0 ? "ff" + (16777215 - (Math.abs(value) - 1)).toString(16) : value.toString(16);
}

function printf(input) {
  return {
    input,
    cont: fsFormat(input)
  };
}

function toConsole(arg) {
  return arg.cont(console.log);
}

function toConsoleError(arg) {
  return arg.cont(console.error);
}

function toText(arg) {
  return arg.cont(x => x);
}

function toFail(arg) {
  return arg.cont(x => {
    throw new Error(x);
  });
}

function formatOnce(str2, rep) {
  return str2.replace(fsFormatRegExp, (_, prefix, flags, pad, precision, format) => {
    switch (format) {
      case "f":
      case "F":
        rep = rep.toFixed(precision || 6);
        break;

      case "g":
      case "G":
        rep = rep.toPrecision(precision);
        break;

      case "e":
      case "E":
        rep = rep.toExponential(precision);
        break;

      case "O":
        rep = (0, _Util.toString)(rep);
        break;

      case "A":
        rep = (0, _Util.toString)(rep, true);
        break;

      case "x":
        rep = toHex(Number(rep));
        break;

      case "X":
        rep = toHex(Number(rep)).toUpperCase();
        break;
    }

    const plusPrefix = flags.indexOf("+") >= 0 && parseInt(rep, 10) >= 0;
    pad = parseInt(pad, 10);

    if (!isNaN(pad)) {
      const ch = pad >= 0 && flags.indexOf("0") >= 0 ? "0" : " ";
      rep = padLeft(rep, Math.abs(pad) - (plusPrefix ? 1 : 0), ch, pad < 0);
    }

    const once = prefix + (plusPrefix ? "+" + rep : rep);
    return once.replace(/%/g, "%%");
  });
}

function createPrinter(str, cont) {
  const printer = (...args) => {
    // Make a copy as the function may be used several times
    let strCopy = str;

    for (const arg of args) {
      strCopy = formatOnce(strCopy, arg);
    }

    return fsFormatRegExp.test(strCopy) ? createPrinter(strCopy, cont) : cont(strCopy.replace(/%%/g, "%"));
  }; // Mark it as curried so it doesn't
  // get wrapped by CurriedLambda


  printer.curried = true;
  return printer;
}

function fsFormat(str) {
  return cont => {
    return fsFormatRegExp.test(str) ? createPrinter(str, cont) : cont(str);
  };
}

function format(str, ...args) {
  return str.replace(formatRegExp, (match, idx, pad, pattern) => {
    let rep = args[idx];
    let padSymbol = " ";

    if (typeof rep === "number") {
      switch ((pattern || "").substring(0, 1)) {
        case "f":
        case "F":
          rep = pattern.length > 1 ? rep.toFixed(pattern.substring(1)) : rep.toFixed(2);
          break;

        case "g":
        case "G":
          rep = pattern.length > 1 ? rep.toPrecision(pattern.substring(1)) : rep.toPrecision();
          break;

        case "e":
        case "E":
          rep = pattern.length > 1 ? rep.toExponential(pattern.substring(1)) : rep.toExponential();
          break;

        case "p":
        case "P":
          rep = (pattern.length > 1 ? (rep * 100).toFixed(pattern.substring(1)) : (rep * 100).toFixed(2)) + " %";
          break;

        case "x":
          rep = toHex(Number(rep));
          break;

        case "X":
          rep = toHex(Number(rep)).toUpperCase();
          break;

        default:
          const m = /^(0+)(\.0+)?$/.exec(pattern);

          if (m != null) {
            let decs = 0;

            if (m[2] != null) {
              rep = rep.toFixed(decs = m[2].length - 1);
            }

            pad = "," + (m[1].length + (decs ? decs + 1 : 0)).toString();
            padSymbol = "0";
          } else if (pattern) {
            rep = pattern;
          }

      }
    } else if (typeof rep.ToString === "function") {
      rep = rep.ToString(pattern);
    } else if (rep instanceof Date) {
      rep = (0, _Date.toString)(rep, pattern);
    }

    pad = parseInt((pad || "").substring(1), 10);

    if (!isNaN(pad)) {
      rep = padLeft(rep, Math.abs(pad), padSymbol, pad < 0);
    }

    return rep;
  });
}

function endsWith(str, search) {
  const idx = str.lastIndexOf(search);
  return idx >= 0 && idx === str.length - search.length;
}

function initialize(n, f) {
  if (n < 0) {
    throw new Error("String length must be non-negative");
  }

  const xs = new Array(n);

  for (let i = 0; i < n; i++) {
    xs[i] = f(i);
  }

  return xs.join("");
}

function insert(str, startIndex, value) {
  if (startIndex < 0 || startIndex > str.length) {
    throw new Error("startIndex is negative or greater than the length of this instance.");
  }

  return str.substring(0, startIndex) + value + str.substring(startIndex);
}

function isNullOrEmpty(str) {
  return typeof str !== "string" || str.length === 0;
}

function isNullOrWhiteSpace(str) {
  return typeof str !== "string" || /^\s*$/.test(str);
}

function join(delimiter, xs) {
  let xs2 = typeof xs === "string" ? [xs] : xs;
  const len = arguments.length;

  if (len > 2) {
    xs2 = Array(len - 1);

    for (let key = 1; key < len; key++) {
      xs2[key - 1] = arguments[key];
    }
  } else if (!Array.isArray(xs2)) {
    xs2 = Array.from(xs2);
  }

  return xs2.map(x => (0, _Util.toString)(x)).join(delimiter);
}
/** Validates UUID as specified in RFC4122 (versions 1-5). Trims braces. */


function validateGuid(str, doNotThrow) {
  const trimmed = trim(str, "both", "{", "}");

  if (guidRegex.test(trimmed)) {
    return doNotThrow ? [true, trimmed] : trimmed;
  } else if (doNotThrow) {
    return [false, "00000000-0000-0000-0000-000000000000"];
  }

  throw new Error("Guid should contain 32 digits with 4 dashes: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx");
}
/* tslint:disable */
// From https://gist.github.com/LeverOne/1308368


function newGuid() {
  let b = "";

  for (let a = 0; a++ < 36; b += a * 51 & 52 ? (a ^ 15 ? 8 ^ Math.random() * (a ^ 20 ? 16 : 4) : 4).toString(16) : "-");

  return b;
} // Maps for number <-> hex string conversion


let _convertMapsInitialized = false;

let _byteToHex;

let _hexToByte;

function initConvertMaps() {
  _byteToHex = new Array(256);
  _hexToByte = {};

  for (var i = 0; i < 256; i++) {
    _byteToHex[i] = (i + 0x100).toString(16).substr(1);
    _hexToByte[_byteToHex[i]] = i;
  }

  _convertMapsInitialized = true;
}
/** Parse a UUID into it's component bytes */
// Adapted from https://github.com/zefferus/uuid-parse


function guidToArray(s) {
  if (!_convertMapsInitialized) {
    initConvertMaps();
  }

  let i = 0;
  const buf = new Uint8Array(16);
  s.toLowerCase().replace(/[0-9a-f]{2}/g, function (oct) {
    switch (i) {
      // .NET saves first three byte groups with differten endianness
      // See https://stackoverflow.com/a/16722909/3922220
      case 0:
      case 1:
      case 2:
      case 3:
        buf[3 - i++] = _hexToByte[oct];
        break;

      case 4:
      case 5:
        buf[9 - i++] = _hexToByte[oct];
        break;

      case 6:
      case 7:
        buf[13 - i++] = _hexToByte[oct];
        break;

      case 8:
      case 9:
      case 10:
      case 11:
      case 12:
      case 13:
      case 14:
      case 15:
        buf[i++] = _hexToByte[oct];
        break;
    }
  }); // Zero out remaining bytes if string was short

  while (i < 16) {
    buf[i++] = 0;
  }

  return buf;
}
/** Convert UUID byte array into a string */


function arrayToGuid(buf) {
  if (buf.length !== 16) {
    throw new Error("Byte array for GUID must be exactly 16 bytes long");
  }

  if (!_convertMapsInitialized) {
    initConvertMaps();
  }

  return _byteToHex[buf[3]] + _byteToHex[buf[2]] + _byteToHex[buf[1]] + _byteToHex[buf[0]] + "-" + _byteToHex[buf[5]] + _byteToHex[buf[4]] + "-" + _byteToHex[buf[7]] + _byteToHex[buf[6]] + "-" + _byteToHex[buf[8]] + _byteToHex[buf[9]] + "-" + _byteToHex[buf[10]] + _byteToHex[buf[11]] + _byteToHex[buf[12]] + _byteToHex[buf[13]] + _byteToHex[buf[14]] + _byteToHex[buf[15]];
}
/* tslint:enable */


function notSupported(name) {
  throw new Error("The environment doesn't support '" + name + "', please use a polyfill.");
}

function toBase64String(inArray) {
  let str = "";

  for (let i = 0; i < inArray.length; i++) {
    str += String.fromCharCode(inArray[i]);
  }

  return typeof btoa === "function" ? btoa(str) : notSupported("btoa");
}

function fromBase64String(b64Encoded) {
  const binary = typeof atob === "function" ? atob(b64Encoded) : notSupported("atob");
  const bytes = new Uint8Array(binary.length);

  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }

  return bytes;
}

function padLeft(str, len, ch, isRight) {
  ch = ch || " ";
  str = String(str);
  len = len - str.length;

  for (let i = 0; i < len; i++) {
    str = isRight ? str + ch : ch + str;
  }

  return str;
}

function padRight(str, len, ch) {
  return padLeft(str, len, ch, true);
}

function remove(str, startIndex, count) {
  if (startIndex >= str.length) {
    throw new Error("startIndex must be less than length of string");
  }

  if (typeof count === "number" && startIndex + count > str.length) {
    throw new Error("Index and count must refer to a location within the string.");
  }

  return str.slice(0, startIndex) + (typeof count === "number" ? str.substr(startIndex + count) : "");
}

function replace(str, search, replace) {
  return str.replace(new RegExp((0, _RegExp.escape)(search), "g"), replace);
}

function replicate(n, x) {
  return initialize(n, () => x);
}

function getCharAtIndex(input, index) {
  if (index < 0 || index > input.length) {
    throw new Error("System.IndexOutOfRangeException: Index was outside the bounds of the array.");
  }

  return input[index];
}

function split(str, splitters, count, removeEmpty) {
  count = typeof count === "number" ? count : null;
  removeEmpty = typeof removeEmpty === "number" ? removeEmpty : null;

  if (count < 0) {
    throw new Error("Count cannot be less than zero");
  }

  if (count === 0) {
    return [];
  }

  let splitters2 = splitters;

  if (!Array.isArray(splitters)) {
    const len = arguments.length;
    splitters2 = Array(len - 1);

    for (let key = 1; key < len; key++) {
      splitters2[key - 1] = arguments[key];
    }
  }

  splitters2 = splitters2.map(x => (0, _RegExp.escape)(x));
  splitters2 = splitters2.length > 0 ? splitters2 : [" "];
  let i = 0;
  const splits = [];
  const reg = new RegExp(splitters2.join("|"), "g");

  while (count == null || count > 1) {
    const m = reg.exec(str);

    if (m === null) {
      break;
    }

    if (!removeEmpty || m.index - i > 0) {
      count = count != null ? count - 1 : count;
      splits.push(str.substring(i, m.index));
    }

    i = reg.lastIndex;
  }

  if (!removeEmpty || str.length - i > 0) {
    splits.push(str.substring(i));
  }

  return splits;
}

function trim(str, side, ...chars) {
  if (side === "both" && chars.length === 0) {
    return str.trim();
  }

  if (side === "start" || side === "both") {
    const reg = chars.length === 0 ? /^\s+/ : new RegExp("^[" + (0, _RegExp.escape)(chars.join("")) + "]+");
    str = str.replace(reg, "");
  }

  if (side === "end" || side === "both") {
    const reg = chars.length === 0 ? /\s+$/ : new RegExp("[" + (0, _RegExp.escape)(chars.join("")) + "]+$");
    str = str.replace(reg, "");
  }

  return str;
}

function filter(pred, x) {
  return x.split("").filter(pred).join("");
}