import { isBrowser, isJsDom } from 'browser-or-node';
import * as mod from 'module';
let internalRequire = null;
if(typeof require !== 'undefined') internalRequire = require;
const ensureRequire = ()=> (!internalRequire) && (internalRequire = mod.createRequire(import.meta.url));

let crypto = null;
if(isBrowser || isJsDom){
    crypto = window.crypto;
}else{
    ensureRequire();
    crypto = internalRequire('crypto').webcrypto;
}

async function digest(message, algorithm='SHA-256'){
    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    const hash = await crypto.subtle.digest(algorithm, data);
    return hash;
}

export const hash = async (value, options={})=>{
    if(options.algorithm === null) options.algorithm = 'SHA-1';
    if(options.excludeValues === null) options.excludeValues = false;
    if(options.encoding === null) options.encoding = 'UTF8';
    if(options.ignoreUnknown === null) options.ignoreUnknown = false;
    if(options.replacer === null) options.replacer = null;
    if(options.respectFunctionProperties === null) options.respectFunctionProperties = true;
    if(options.respectFunctionNames === null) options.respectFunctionNames = true;
    if(options.unorderedArrays === null) options.unorderedArrays = false;
    if(options.unorderedSets === null) options.unorderedSets = true;
    
    const signature = objectSignature(value, options);
    const hashBuffer = await digest(signature, options.algorithm);
    const hashArray = Array.from(new Uint8Array(hashBuffer)); // convert buffer to byte array
    const hashHex = hashArray
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
    return hashHex;
};

const objectSignature = (v, options)=>{
    let value = v;
    let type = Array.isArray(value)?'array':(typeof value);
    let handleValue = options.replacer || ((v)=>v);
    if(type === 'object'){
        if(value instanceof Map) type = 'map';
        if(value instanceof Set) type = 'set';
    }
    let keys = null;
    switch(type){
        case 'array':
            if(!options.unorderedArrays){
                value = value.slice().sort();
            }
            return 'array'+value.map((item)=>{
                return objectSignature(item, options);
            }).join(':');
            //break;
        case 'map':
            
            break;
        case 'set':
            if(!options.unorderedSets){
                value = value.slice().sort();
            }
            return 'set'+value.map((item)=>{
                return objectSignature(item, options);
            }).join(':');
            //break;
        case 'object':
            keys = Object.keys(v);
            keys.sort();
            return 'object:'+keys.map((key)=>{
                return key+':'+objectSignature(value[key], options);
            }).join('');
            //break;
        case 'string':
            if(options.excludeValues) return 'string';
            return 'string:'+handleValue(value);
            //break;
        case 'number':
            if(options.excludeValues) return 'number';
            return 'number:'+handleValue(value).toString();
            //break;
        case 'boolean':
            if(options.excludeValues) return 'boolean';
            return 'boolean:'+handleValue(value).toString();
            //break;
        case 'function':
            break;
        default: throw new Error(`Unknown type: ${type}`);
    }
};