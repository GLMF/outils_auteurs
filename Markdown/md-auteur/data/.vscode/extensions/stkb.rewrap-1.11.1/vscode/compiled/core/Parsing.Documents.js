"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.plainText = plainText;
exports.languageForFile = languageForFile;
exports.select = select;
exports.languages = void 0;

var _Parsing = require("./Parsing.Core");

var _Block = require("./Block");

var _Nonempty = require("./Nonempty");

var _CurriedLambda = _interopRequireDefault(require("../fable-core/CurriedLambda"));

var _List = _interopRequireWildcard(require("../fable-core/List"));

var _Parsing2 = require("./Parsing.SourceCode");

var _Parsing3 = require("./Parsing.Language");

var _Parsing4 = require("./Parsing.Markdown");

var _Parsing5 = require("./Parsing.DocComments");

var _Parsing6 = require("./Parsing.Latex");

var _Util = require("../fable-core/Util");

var _RegExp = require("../fable-core/RegExp");

var _Option = require("../fable-core/Option");

var _Prelude = require("./Prelude");

var _String = require("../fable-core/String");

var _Seq = require("../fable-core/Seq");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function plainText(settings) {
  const paragraphs = $var1 => {
    var fn;
    return (fn = function (lines) {
      return (0, _Parsing.indentSeparatedParagraphBlock)(function (tupledArg) {
        return (0, _Block.text)(tupledArg[0], tupledArg[1]);
      }, lines);
    }, function (arg10__1) {
      return (0, _Nonempty.map)(fn, arg10__1);
    })((0, _Parsing.splitIntoChunks)(function (arg10_) {
      return (0, _Parsing.onIndent)(settings.tabWidth, arg10_);
    })($var1));
  };

  return (0, _Parsing.repeatToEnd)((0, _Parsing.takeUntil)(_Parsing.blankLines, paragraphs));
}

const configFile = (0, _CurriedLambda.default)((() => {
  const commentParsers = (0, _List.ofArray)([(0, _Parsing2.line)("#")]);
  return (0, _CurriedLambda.default)(function (settings) {
    return (0, _Parsing2.sourceCode)(commentParsers, settings);
  });
})());
const python = (0, _CurriedLambda.default)((() => {
  const commentParsers = (0, _List.ofArray)([(0, _Parsing2.line)("#"), (0, _Parsing2.block)(["([Bb][Rr]?|[Ff][Rr]?|[Rr][BbFf]?|[Uu])?\"\"\"", "\"\"\""]), (0, _Parsing2.block)(["([Bb][Rr]?|[Ff][Rr]?|[Rr][BbFf]?|[Uu])?'''", "'''"])]);
  return (0, _CurriedLambda.default)(function (settings) {
    return (0, _Parsing2.sourceCode)(commentParsers, settings);
  });
})());
const lang = (0, _CurriedLambda.default)(_Parsing3.LanguageModule.create.bind(_Parsing3.LanguageModule));
let languages = (0, _Util.createAtom)((0, _List.ofArray)([lang("AsciiDoc", "", ".adoc|.asciidoc", (0, _CurriedLambda.default)(plainText)), lang("AutoHotkey", "ahk", ".ahk", (() => {
  const commentParsers = (0, _List.ofArray)([(0, _Parsing2.line)(";"), _Parsing2.cBlock]);
  return (0, _CurriedLambda.default)(function (settings_1) {
    return (0, _Parsing2.sourceCode)(commentParsers, settings_1);
  });
})()), lang("Basic", "vb", ".vb", (() => {
  const commentParsers_1 = (0, _List.ofArray)([(0, _Parsing2.customLine)(_Parsing2.html, "'''"), (0, _Parsing2.line)("'")]);
  return (0, _CurriedLambda.default)(function (settings_2) {
    return (0, _Parsing2.sourceCode)(commentParsers_1, settings_2);
  });
})()), lang("Batch file", "bat", ".bat", (() => {
  const commentParsers_2 = (0, _List.ofArray)([(0, _Parsing2.line)("(?:rem|::)")]);
  return (0, _CurriedLambda.default)(function (settings_3) {
    return (0, _Parsing2.sourceCode)(commentParsers_2, settings_3);
  });
})()), lang("Bikeshed", "", ".bs", (0, _CurriedLambda.default)(_Parsing4.markdown)), lang("C/C++", "c|c++|cpp", ".c|.cpp|.h", (() => {
  const commentParsers_3 = (0, _List.ofArray)([(0, _CurriedLambda.default)(_Parsing2.customBlock)(_Parsing5.javadoc, ["\\*?", " * "], _Parsing2.javadocMarkers), _Parsing2.cBlock, (0, _Parsing2.customLine)(_Parsing2.html, "///"), (0, _Parsing2.customLine)(_Parsing5.javadoc, "//!?"), _Parsing2.cLine]);
  return (0, _CurriedLambda.default)(function (settings_5) {
    return (0, _Parsing2.sourceCode)(commentParsers_3, settings_5);
  });
})()), lang("C#", "csharp", ".cs", (() => {
  const commentParsers_4 = (0, _List.ofArray)([(0, _Parsing2.customLine)(_Parsing2.html, "///"), _Parsing2.cLine, (0, _CurriedLambda.default)(_Parsing2.customBlock)(_Parsing5.javadoc, ["\\*?", " * "], _Parsing2.javadocMarkers), _Parsing2.cBlock]);
  return (0, _CurriedLambda.default)(function (settings_6) {
    return (0, _Parsing2.sourceCode)(commentParsers_4, settings_6);
  });
})()), lang("CMake", "", "CMakeLists.txt", configFile), lang("CoffeeScript", "", ".coffee", (() => {
  const commentParsers_5 = (0, _List.ofArray)([(0, _CurriedLambda.default)(_Parsing2.customBlock)(_Parsing5.javadoc, ["[*#]", " * "], ["###\\*", "###"]), (0, _Parsing2.block)(["###", "###"]), (0, _Parsing2.line)("#")]);
  return (0, _CurriedLambda.default)(function (settings_7) {
    return (0, _Parsing2.sourceCode)(commentParsers_5, settings_7);
  });
})()), lang("Configuration", "properties", ".conf|.gitconfig", configFile), lang("Crystal", "", ".cr", (() => {
  const commentParsers_6 = (0, _List.ofArray)([(0, _Parsing2.line)("#")]);
  return (0, _CurriedLambda.default)(function (settings_8) {
    return (0, _Parsing2.sourceCode)(commentParsers_6, settings_8);
  });
})()), lang("CSS", "postcss", ".css|.pcss|.postcss", _Parsing2.css), lang("D", "", ".d", (() => {
  const commentParsers_7 = (0, _List.ofArray)([(0, _Parsing2.customLine)(_Parsing5.ddoc, "///"), _Parsing2.cLine, (0, _CurriedLambda.default)(_Parsing2.customBlock)(_Parsing5.ddoc, ["\\*", " * "], _Parsing2.javadocMarkers), (0, _CurriedLambda.default)(_Parsing2.customBlock)(_Parsing5.ddoc, ["\\+", " + "], ["/\\+\\+", "\\+/"]), _Parsing2.cBlock, (0, _Parsing2.block)(["/\\+", "\\+/"])]);
  return (0, _CurriedLambda.default)(function (settings_9) {
    return (0, _Parsing2.sourceCode)(commentParsers_7, settings_9);
  });
})()), lang("Dart", "", ".dart", (() => {
  const commentParsers_8 = (0, _List.ofArray)([(0, _Parsing2.customLine)(_Parsing5.dartdoc, "///"), _Parsing2.cLine, (0, _CurriedLambda.default)(_Parsing2.customBlock)(_Parsing5.dartdoc, ["\\*", " * "], _Parsing2.javadocMarkers), _Parsing2.cBlock]);
  return (0, _CurriedLambda.default)(function (settings_10) {
    return (0, _Parsing2.sourceCode)(commentParsers_8, settings_10);
  });
})()), lang("Dockerfile", "docker", "dockerfile", configFile), lang("Elixir", "", ".ex|.exs", (() => {
  const commentParsers_9 = (0, _List.ofArray)([(0, _Parsing2.line)("#"), (0, _Parsing2.block)(["@(module|type|)doc\\s+\"\"\"", "\"\"\""])]);
  return (0, _CurriedLambda.default)(function (settings_11) {
    return (0, _Parsing2.sourceCode)(commentParsers_9, settings_11);
  });
})()), lang("Elm", "", ".elm", (() => {
  const commentParsers_10 = (0, _List.ofArray)([(0, _Parsing2.line)("--"), (0, _Parsing2.block)(["{-\\|?", "-}"])]);
  return (0, _CurriedLambda.default)(function (settings_12) {
    return (0, _Parsing2.sourceCode)(commentParsers_10, settings_12);
  });
})()), lang("F#", "fsharp", ".fs|.fsx", (() => {
  const commentParsers_11 = (0, _List.ofArray)([(0, _Parsing2.customLine)(_Parsing2.html, "///"), _Parsing2.cLine, (0, _Parsing2.block)(["\\(\\*", "\\*\\)"])]);
  return (0, _CurriedLambda.default)(function (settings_13) {
    return (0, _Parsing2.sourceCode)(commentParsers_11, settings_13);
  });
})()), lang("Go", "", ".go", (() => {
  const commentParsers_12 = (0, _List.ofArray)([(0, _CurriedLambda.default)(_Parsing2.customBlock)((0, _CurriedLambda.default)(_Parsing5.godoc), ["", ""], _Parsing2.javadocMarkers), _Parsing2.cBlock, (0, _Parsing2.customLine)((0, _CurriedLambda.default)(_Parsing5.godoc), "//"), _Parsing2.cLine]);
  return (0, _CurriedLambda.default)(function (settings_16) {
    return (0, _Parsing2.sourceCode)(commentParsers_12, settings_16);
  });
})()), lang("Git commit", "git-commit", "tag_editmsg", (0, _CurriedLambda.default)(_Parsing4.markdown)), lang("GraphQL", "", ".graphql|.gql", configFile), lang("Groovy", "", ".groovy", _Parsing2.java), lang("Handlebars", "", ".handlebars|.hbs", (() => {
  const commentParsers_13 = (0, _List.ofArray)([(0, _Parsing2.block)(["{{!--", "--}}"]), (0, _Parsing2.block)(["{{!", "}}"]), (0, _Parsing2.block)(["<!--", "-->"])]);
  return (0, _CurriedLambda.default)(function (settings_18) {
    return (0, _Parsing2.sourceCode)(commentParsers_13, settings_18);
  });
})()), lang("Haskell", "", ".hs", (() => {
  const commentParsers_14 = (0, _List.ofArray)([(0, _Parsing2.line)("--"), (0, _Parsing2.block)(["{-\\s*\\|?", "-}"])]);
  return (0, _CurriedLambda.default)(function (settings_19) {
    return (0, _Parsing2.sourceCode)(commentParsers_14, settings_19);
  });
})()), lang("HCL", "terraform", ".hcl|.tf", (() => {
  const commentParsers_15 = (0, _List.ofArray)([(0, _CurriedLambda.default)(_Parsing2.customBlock)(_Parsing5.javadoc, ["\\*?", " * "], _Parsing2.javadocMarkers), _Parsing2.cBlock, (0, _Parsing2.customLine)(_Parsing5.javadoc, "//[/!]"), _Parsing2.cLine, (0, _Parsing2.line)("#")]);
  return (0, _CurriedLambda.default)(function (settings_20) {
    return (0, _Parsing2.sourceCode)(commentParsers_15, settings_20);
  });
})()), lang("HTML", "vue", ".htm|.html|.vue", _Parsing2.html), lang("INI", "", ".ini", (() => {
  const commentParsers_16 = (0, _List.ofArray)([(0, _Parsing2.line)("[#;]")]);
  return (0, _CurriedLambda.default)(function (settings_21) {
    return (0, _Parsing2.sourceCode)(commentParsers_16, settings_21);
  });
})()), lang("Java", "", ".java", _Parsing2.java), lang("JavaScript", "javascriptreact|js", ".js|.jsx", _Parsing2.java), lang("Julia", "", ".jl", python), lang("JSON", "json5|jsonc", ".json|.json5|.jsonc", _Parsing2.java), lang("LaTeX", "tex", ".bbx|.cbx|.cls|.sty|.tex", (0, _CurriedLambda.default)(_Parsing6.latex)), lang("Lean", "", ".lean", (() => {
  const commentParsers_17 = (0, _List.ofArray)([(0, _Parsing2.line)("--"), (0, _Parsing2.block)(["/-[-!]?", "-/"])]);
  return (0, _CurriedLambda.default)(function (settings_23) {
    return (0, _Parsing2.sourceCode)(commentParsers_17, settings_23);
  });
})()), lang("Less", "", ".less", _Parsing2.java), lang("Lua", "", ".lua", (() => {
  const commentParsers_18 = (0, _List.ofArray)([(0, _Parsing2.block)(["--\\[\\[", "\\]\\]"]), (0, _Parsing2.line)("--")]);
  return (0, _CurriedLambda.default)(function (settings_24) {
    return (0, _Parsing2.sourceCode)(commentParsers_18, settings_24);
  });
})()), lang("Makefile", "make", "makefile", configFile), lang("Markdown", "", ".md", (0, _CurriedLambda.default)(_Parsing4.markdown)), lang("MATLAB", "", "", (() => {
  const commentParsers_19 = (0, _List.ofArray)([(0, _Parsing2.line)("%(?![%{}])"), (0, _Parsing2.block)(["%\\{", "%\\}"])]);
  return (0, _CurriedLambda.default)(function (settings_26) {
    return (0, _Parsing2.sourceCode)(commentParsers_19, settings_26);
  });
})()), lang("Objective-C", "", ".m|.mm", _Parsing2.java), lang("Perl", "perl6", ".p6|.pl|.pl6|.pm|.pm6", configFile), lang("PHP", "", ".php", (() => {
  const commentParsers_20 = (0, _List.ofArray)([(0, _CurriedLambda.default)(_Parsing2.customBlock)(_Parsing5.javadoc, ["\\*", " * "], _Parsing2.javadocMarkers), _Parsing2.cBlock, (0, _Parsing2.line)("(?://|#)")]);
  return (0, _CurriedLambda.default)(function (settings_27) {
    return (0, _Parsing2.sourceCode)(commentParsers_20, settings_27);
  });
})()), lang("PowerShell", "", ".ps1|.psd1|.psm1", (() => {
  const commentParsers_21 = (0, _List.ofArray)([(0, _Parsing2.customLine)(_Parsing5.psdoc, "#"), (0, _CurriedLambda.default)(_Parsing2.customBlock)(_Parsing5.psdoc, ["", ""], ["<#", "#>"])]);
  return (0, _CurriedLambda.default)(function (settings_28) {
    return (0, _Parsing2.sourceCode)(commentParsers_21, settings_28);
  });
})()), lang("Prolog", "", "", (() => {
  const commentParsers_22 = (0, _List.ofArray)([(0, _CurriedLambda.default)(_Parsing2.customBlock)(_Parsing5.javadoc, ["\\*?", " * "], _Parsing2.javadocMarkers), _Parsing2.cBlock, (0, _Parsing2.line)("%[%!]?")]);
  return (0, _CurriedLambda.default)(function (settings_29) {
    return (0, _Parsing2.sourceCode)(commentParsers_22, settings_29);
  });
})()), lang("Protobuf", "proto|proto3", ".proto", (() => {
  const commentParsers_23 = (0, _List.ofArray)([_Parsing2.cLine]);
  return (0, _CurriedLambda.default)(function (settings_30) {
    return (0, _Parsing2.sourceCode)(commentParsers_23, settings_30);
  });
})()), lang("Pug", "jade", ".jade|.pug", (() => {
  const commentParsers_24 = (0, _List.ofArray)([_Parsing2.cLine]);
  return (0, _CurriedLambda.default)(function (settings_31) {
    return (0, _Parsing2.sourceCode)(commentParsers_24, settings_31);
  });
})()), lang("PureScript", "", ".purs", (() => {
  const commentParsers_25 = (0, _List.ofArray)([(0, _Parsing2.line)("--\\s*\\|"), (0, _Parsing2.line)("--"), (0, _Parsing2.block)(["{-\\s*\\|?", "-}"])]);
  return (0, _CurriedLambda.default)(function (settings_32) {
    return (0, _Parsing2.sourceCode)(commentParsers_25, settings_32);
  });
})()), lang("Python", "", ".py", python), lang("R", "", ".r", (() => {
  const commentParsers_26 = (0, _List.ofArray)([(0, _Parsing2.line)("#'?")]);
  return (0, _CurriedLambda.default)(function (settings_33) {
    return (0, _Parsing2.sourceCode)(commentParsers_26, settings_33);
  });
})()), lang("reStructuredText", "", ".rst|.rest", (0, _CurriedLambda.default)(plainText)), lang("Ruby", "", ".rb", (() => {
  const commentParsers_27 = (0, _List.ofArray)([(0, _Parsing2.line)("#"), (0, _Parsing2.block)(["=begin", "=end"])]);
  return (0, _CurriedLambda.default)(function (settings_35) {
    return (0, _Parsing2.sourceCode)(commentParsers_27, settings_35);
  });
})()), lang("Rust", "", ".rs", (() => {
  const commentParsers_28 = (0, _List.ofArray)([(0, _Parsing2.line)("\\/\\/(?:\\/|\\!)?")]);
  return (0, _CurriedLambda.default)(function (settings_36) {
    return (0, _Parsing2.sourceCode)(commentParsers_28, settings_36);
  });
})()), lang("SCSS", "", ".scss", _Parsing2.java), lang("Scala", "", ".scala", _Parsing2.java), lang("Shaderlab", "", ".shader", _Parsing2.java), lang("Shell script", "shellscript", ".sh", configFile), lang("SQL", "", ".sql", (() => {
  const commentParsers_29 = (0, _List.ofArray)([(0, _Parsing2.line)("--"), _Parsing2.cBlock]);
  return (0, _CurriedLambda.default)(function (settings_37) {
    return (0, _Parsing2.sourceCode)(commentParsers_29, settings_37);
  });
})()), lang("Swift", "", ".swift", _Parsing2.java), lang("Tcl", "", ".tcl", configFile), lang("TOML", "", ".toml", configFile), lang("TypeScript", "typescriptreact", ".ts|.tsx", _Parsing2.java), lang("Verilog/SystemVerilog", "systemverilog|verilog", ".sv|.svh|.v|.vh|.vl", _Parsing2.java), lang("XML", "xsl", ".xml|.xsl", _Parsing2.html), lang("YAML", "", ".yaml|.yml", (0, _CurriedLambda.default)(function (settings_38) {
  const comments = (0, _Parsing2.line)("#{1,3}", settings_38);
  return (0, _Parsing.repeatToEnd)((0, _Parsing.takeUntil)(comments, plainText(settings_38)));
}))]));
exports.languages = languages;

function addCustomLanguage(name, markers) {
  const escape = function (arg00) {
    return (0, _RegExp.escape)(arg00);
  };

  const maybeLine = (0, _Option.defaultArg)(markers.line, null, $var3 => ($var2 => (0, _CurriedLambda.default)(_Parsing2.line)($var2))(escape($var3)));
  const maybeBlock = (0, _Option.defaultArg)(markers.block, null, $var5 => ($var4 => (0, _CurriedLambda.default)(_Parsing2.block)($var4))(function (tupledArg) {
    return _Prelude.Tuple.map(escape, tupledArg[0], tupledArg[1]);
  }($var5)));
  const list = (0, _List.choose)(function (x) {
    return x;
  }, (0, _List.ofArray)([maybeLine, maybeBlock]));
  const cl = lang(name, "", "", (0, _CurriedLambda.default)(function (settings) {
    return (0, _Parsing2.sourceCode)(list, settings);
  }));
  languages(new _List.default(cl, languages()));
  return cl;
}

function languageForFile(file) {
  const l = file.language.toLocaleLowerCase();

  if (!((0, _String.isNullOrWhiteSpace)(l) ? true : l === "plaintext")) {
    return (0, _Seq.tryFind)(function (arg10_) {
      return _Parsing3.LanguageModule.matchesFileLanguage(l, arg10_);
    }, languages());
  } else {
    return (0, _Seq.tryFind)(function (arg10__1) {
      return _Parsing3.LanguageModule.matchesFilePath(file.path, arg10__1);
    }, languages());
  }
}

function select(file) {
  return (0, _CurriedLambda.default)((0, _CurriedLambda.default)(function (x) {
    return (0, _Prelude.maybe)(plainText, _Parsing3.LanguageModule.parser.bind(_Parsing3.LanguageModule), x);
  })((0, _Option.defaultArgWith)(languageForFile(file), function () {
    const matchValue = file.getMarkers();

    if (matchValue == null) {
      return null;
    } else {
      return addCustomLanguage(file.language, matchValue);
    }
  })));
}