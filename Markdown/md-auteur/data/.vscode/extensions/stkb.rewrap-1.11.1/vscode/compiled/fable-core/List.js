"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.append = append;
exports.choose = choose;
exports.collect = collect;
exports.concat = concat;
exports.filter = filter;
exports.where = where;
exports.initialize = initialize;
exports.map = map;
exports.mapIndexed = mapIndexed;
exports.indexed = indexed;
exports.partition = partition;
exports.replicate = replicate;
exports.reverse = reverse;
exports.singleton = singleton;
exports.slice = slice;
exports.unzip = unzip;
exports.unzip3 = unzip3;
exports.groupBy = groupBy;
exports.splitAt = splitAt;
exports.head = head;
exports.tail = tail;
Object.defineProperty(exports, "ofArray", {
  enumerable: true,
  get: function () {
    return _ListClass.ofArray;
  }
});
exports.default = void 0;

var _ListClass = _interopRequireWildcard(require("./ListClass"));

var _Map = require("./Map");

var _Option = require("./Option");

var _Seq = require("./Seq");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var _default = _ListClass.default;
exports.default = _default;

function append(xs, ys) {
  return (0, _Seq.fold)((acc, x) => new _ListClass.default(x, acc), ys, reverse(xs));
}

function choose(f, xs) {
  const r = (0, _Seq.fold)((acc, x) => {
    const y = f(x);
    return y != null ? new _ListClass.default((0, _Option.getValue)(y), acc) : acc;
  }, new _ListClass.default(), xs);
  return reverse(r);
}

function collect(f, xs) {
  return (0, _Seq.fold)((acc, x) => append(acc, f(x)), new _ListClass.default(), xs);
} // TODO: should be xs: Iterable<List<T>>


function concat(xs) {
  return collect(x => x, xs);
}

function filter(f, xs) {
  return reverse((0, _Seq.fold)((acc, x) => f(x) ? new _ListClass.default(x, acc) : acc, new _ListClass.default(), xs));
}

function where(f, xs) {
  return filter(f, xs);
}

function initialize(n, f) {
  if (n < 0) {
    throw new Error("List length must be non-negative");
  }

  let xs = new _ListClass.default();

  for (let i = 1; i <= n; i++) {
    xs = new _ListClass.default(f(n - i), xs);
  }

  return xs;
}

function map(f, xs) {
  return reverse((0, _Seq.fold)((acc, x) => new _ListClass.default(f(x), acc), new _ListClass.default(), xs));
}

function mapIndexed(f, xs) {
  return reverse((0, _Seq.fold)((acc, x, i) => new _ListClass.default(f(i, x), acc), new _ListClass.default(), xs));
}

function indexed(xs) {
  return mapIndexed((i, x) => [i, x], xs);
}

function partition(f, xs) {
  return (0, _Seq.fold)((acc, x) => {
    const lacc = acc[0];
    const racc = acc[1];
    return f(x) ? [new _ListClass.default(x, lacc), racc] : [lacc, new _ListClass.default(x, racc)];
  }, [new _ListClass.default(), new _ListClass.default()], reverse(xs));
}

function replicate(n, x) {
  return initialize(n, () => x);
}

function reverse(xs) {
  return (0, _Seq.fold)((acc, x) => new _ListClass.default(x, acc), new _ListClass.default(), xs);
}

function singleton(x) {
  return new _ListClass.default(x, new _ListClass.default());
}

function slice(lower, upper, xs) {
  const noLower = lower == null;
  const noUpper = upper == null;
  return reverse((0, _Seq.fold)((acc, x, i) => (noLower || lower <= i) && (noUpper || i <= upper) ? new _ListClass.default(x, acc) : acc, new _ListClass.default(), xs));
}
/* ToDo: instance unzip() */


function unzip(xs) {
  return (0, _Seq.foldBack)((xy, acc) => [new _ListClass.default(xy[0], acc[0]), new _ListClass.default(xy[1], acc[1])], xs, [new _ListClass.default(), new _ListClass.default()]);
}
/* ToDo: instance unzip3() */


function unzip3(xs) {
  return (0, _Seq.foldBack)((xyz, acc) => [new _ListClass.default(xyz[0], acc[0]), new _ListClass.default(xyz[1], acc[1]), new _ListClass.default(xyz[2], acc[2])], xs, [new _ListClass.default(), new _ListClass.default(), new _ListClass.default()]);
}

function groupBy(f, xs) {
  return (0, _Seq.toList)((0, _Seq.map)(k => [k[0], (0, _Seq.toList)(k[1])], (0, _Map.groupBy)(f, xs)));
}

function splitAt(index, xs) {
  if (index < 0) {
    throw new Error("The input must be non-negative.");
  }

  let i = 0;
  let last = xs;
  const first = new Array(index);

  while (i < index) {
    if (last.tail == null) {
      throw new Error("The input sequence has an insufficient number of elements.");
    }

    first[i] = last.head;
    last = last.tail;
    i++;
  }

  return [(0, _ListClass.ofArray)(first), last];
}

function head(xs) {
  if (xs.head !== undefined) {
    return xs.head;
  } else {
    throw new Error("The input list was empty.");
  }
}

function tail(xs) {
  if (xs.tail !== undefined) {
    return xs.tail;
  } else {
    throw new Error("The input list was empty.");
  }
}