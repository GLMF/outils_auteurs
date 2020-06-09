"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DocState = exports.Edit = exports.Selection = exports.Position = exports.Settings = exports.File = exports.CustomMarkers = void 0;

var _Symbol2 = _interopRequireWildcard(require("../fable-core/Symbol"));

var _Util = require("../fable-core/Util");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

class CustomMarkers {
  [_Symbol2.default.reflection]() {
    return {
      type: "Rewrap.CustomMarkers",
      nullable: true,
      properties: {
        block: (0, _Util.Option)((0, _Util.Tuple)(["string", "string"])),
        line: (0, _Util.Option)("string")
      }
    };
  }

  constructor(line, block) {
    this["line@6"] = line;
    this["block@6"] = block;
  }

  get line() {
    return this["line@6"];
  }

  get block() {
    return this["block@6"];
  }

}

exports.CustomMarkers = CustomMarkers;
(0, _Symbol2.setType)("Rewrap.CustomMarkers", CustomMarkers);

class File {
  constructor(language, path, getMarkers) {
    this.language = language;
    this.path = path;
    this.getMarkers = getMarkers;
  }

  [_Symbol2.default.reflection]() {
    return {
      type: "Rewrap.File",
      interfaces: ["FSharpRecord", "System.IEquatable"],
      properties: {
        language: "string",
        path: "string",
        getMarkers: (0, _Util.Function)([_Util.Unit, CustomMarkers])
      }
    };
  }

  Equals(other) {
    return (0, _Util.equalsRecords)(this, other);
  }

}

exports.File = File;
(0, _Symbol2.setType)("Rewrap.File", File);

class Settings {
  constructor(column, tabWidth, doubleSentenceSpacing, reformat, wholeComment) {
    this.column = column | 0;
    this.tabWidth = tabWidth | 0;
    this.doubleSentenceSpacing = doubleSentenceSpacing;
    this.reformat = reformat;
    this.wholeComment = wholeComment;
  }

  [_Symbol2.default.reflection]() {
    return {
      type: "Rewrap.Settings",
      interfaces: ["FSharpRecord", "System.IEquatable", "System.IComparable"],
      properties: {
        column: "number",
        tabWidth: "number",
        doubleSentenceSpacing: "boolean",
        reformat: "boolean",
        wholeComment: "boolean"
      }
    };
  }

  Equals(other) {
    return (0, _Util.equalsRecords)(this, other);
  }

  CompareTo(other) {
    return (0, _Util.compareRecords)(this, other) | 0;
  }

}

exports.Settings = Settings;
(0, _Symbol2.setType)("Rewrap.Settings", Settings);

class Position {
  constructor(line, character) {
    this.line = line | 0;
    this.character = character | 0;
  }

  [_Symbol2.default.reflection]() {
    return {
      type: "Rewrap.Position",
      interfaces: ["FSharpRecord", "System.IEquatable", "System.IComparable"],
      properties: {
        line: "number",
        character: "number"
      }
    };
  }

  Equals(other) {
    return (0, _Util.equalsRecords)(this, other);
  }

  CompareTo(other) {
    return (0, _Util.compareRecords)(this, other) | 0;
  }

}

exports.Position = Position;
(0, _Symbol2.setType)("Rewrap.Position", Position);

class Selection {
  constructor(anchor, active) {
    this.anchor = anchor;
    this.active = active;
  }

  [_Symbol2.default.reflection]() {
    return {
      type: "Rewrap.Selection",
      interfaces: ["FSharpRecord", "System.IEquatable", "System.IComparable"],
      properties: {
        anchor: Position,
        active: Position
      }
    };
  }

  Equals(other) {
    return (0, _Util.equalsRecords)(this, other);
  }

  CompareTo(other) {
    return (0, _Util.compareRecords)(this, other) | 0;
  }

}

exports.Selection = Selection;
(0, _Symbol2.setType)("Rewrap.Selection", Selection);

class Edit {
  constructor(startLine, endLine, lines, selections) {
    this.startLine = startLine | 0;
    this.endLine = endLine | 0;
    this.lines = lines;
    this.selections = selections;
  }

  [_Symbol2.default.reflection]() {
    return {
      type: "Rewrap.Edit",
      interfaces: ["FSharpRecord", "System.IEquatable", "System.IComparable"],
      properties: {
        startLine: "number",
        endLine: "number",
        lines: (0, _Util.Array)("string"),
        selections: (0, _Util.Array)(Selection)
      }
    };
  }

  Equals(other) {
    return (0, _Util.equalsRecords)(this, other);
  }

  CompareTo(other) {
    return (0, _Util.compareRecords)(this, other) | 0;
  }

}

exports.Edit = Edit;
(0, _Symbol2.setType)("Rewrap.Edit", Edit);

class DocState {
  constructor(filePath, version, selections) {
    this.filePath = filePath;
    this.version = version | 0;
    this.selections = selections;
  }

  [_Symbol2.default.reflection]() {
    return {
      type: "Rewrap.DocState",
      interfaces: ["FSharpRecord", "System.IEquatable", "System.IComparable"],
      properties: {
        filePath: "string",
        version: "number",
        selections: (0, _Util.Array)(Selection)
      }
    };
  }

  Equals(other) {
    return (0, _Util.equalsRecords)(this, other);
  }

  CompareTo(other) {
    return (0, _Util.compareRecords)(this, other) | 0;
  }

}

exports.DocState = DocState;
(0, _Symbol2.setType)("Rewrap.DocState", DocState);