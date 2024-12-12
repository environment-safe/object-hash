"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hash = void 0;
var _browserOrNode = require("browser-or-node");
var mod = _interopRequireWildcard(require("module"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
let internalRequire = null;
if (typeof require !== 'undefined') internalRequire = require;
const ensureRequire = () => !internalRequire && (internalRequire = mod.createRequire(require('url').pathToFileURL(__filename).toString()));
let crypto = null;
if (_browserOrNode.isBrowser || _browserOrNode.isJsDom) {
  crypto = window.crypto;
} else {
  ensureRequire();
  crypto = internalRequire('crypto').webcrypto;
}
async function digest(message, algorithm = 'SHA-256') {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const hash = await crypto.subtle.digest(algorithm, data);
  return hash;
}
const hash = async (value, options = {}) => {
  if (options.algorithm === null) options.algorithm = 'SHA-1';
  if (options.excludeValues === null) options.excludeValues = false;
  if (options.encoding === null) options.encoding = 'UTF8';
  if (options.ignoreUnknown === null) options.ignoreUnknown = false;
  if (options.replacer === null) options.replacer = null;
  if (options.respectFunctionProperties === null) options.respectFunctionProperties = true;
  if (options.respectFunctionNames === null) options.respectFunctionNames = true;
  if (options.unorderedArrays === null) options.unorderedArrays = false;
  if (options.unorderedSets === null) options.unorderedSets = true;
  const signature = objectSignature(value, options);
  const hashBuffer = await digest(signature, options.algorithm);
  const hashArray = Array.from(new Uint8Array(hashBuffer)); // convert buffer to byte array
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
};
exports.hash = hash;
const objectSignature = (v, options) => {
  let value = v;
  let type = Array.isArray(value) ? 'array' : typeof value;
  let handleValue = options.replacer || (v => v);
  if (type === 'object') {
    if (value instanceof Map) type = 'map';
    if (value instanceof Set) type = 'set';
  }
  let keys = null;
  switch (type) {
    case 'array':
      if (!options.unorderedArrays) {
        value = value.slice().sort();
      }
      return 'array' + value.map(item => {
        return objectSignature(item, options);
      }).join(':');
    //break;
    case 'map':
      break;
    case 'set':
      if (!options.unorderedSets) {
        value = value.slice().sort();
      }
      return 'set' + value.map(item => {
        return objectSignature(item, options);
      }).join(':');
    //break;
    case 'object':
      keys = Object.keys(v);
      keys.sort();
      return 'object:' + keys.map(key => {
        return key + ':' + objectSignature(value[key], options);
      }).join('');
    //break;
    case 'string':
      if (options.excludeValues) return 'string';
      return 'string:' + handleValue(value);
    //break;
    case 'number':
      if (options.excludeValues) return 'number';
      return 'number:' + handleValue(value).toString();
    //break;
    case 'boolean':
      if (options.excludeValues) return 'boolean';
      return 'boolean:' + handleValue(value).toString();
    //break;
    case 'function':
      break;
    default:
      throw new Error(`Unknown type: ${type}`);
  }
};