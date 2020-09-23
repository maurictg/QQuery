import H from './selector';

/**
 * Helper functions
 * Helpers are very easy to create: Make sure your helper file is loaded later than QQuery.
 * Just use QQuery.addHelper() to register a function
 */

/**
 * 
 * @param {Object} o: Options {
 *  method: string, 
 *  url: string, 
 *  data: object, 
 *  responseType: string, 
 *  requestType: string, 
 *  [optional:] headers: object { key: value }
 *  [optional:] onComplete, onError, onProgress(loaded, total, percentage)}
 * @param {Function} cb: Callback function(data, statusCode, statusText)
 */
const ajax = function(o, cb) {
    if(!o || !cb) return false;
    let x = new XMLHttpRequest();
    x.onreadystatechange = function() {
        if(this.readyState === 4) cb(this.response, this.status, this.statusText);
    };

    x.onload = o.onComplete;
    x.onerror = o.onError;
    x.responseType = o.responseType;
    o.method = o.method.toLowerCase();
    if(!o.headers) o.headers = {};

    //Check for XSRF token
    if(H('meta[name="csrf-token"]').any())
        o.headers['X-CSRF-TOKEN'] = H('meta[name="csrf-token"]').attr('content');

    //Open connection
    x.open(o.method, o.url, true);
   
    for(const[k,v] of Object.entries(o.headers)) {
        if(v) x.setRequestHeader(k,v);
    }
         
    if((o.method === 'post' || o.method === 'put') && o.data && o.requestType) {
        let sendString;
        switch (o.requestType) {
            case 'formencoded':
            case 'urlencoded':
                sendString = true;
                o.dataString = (typeof o.data === 'object') ? serializeJSON(o.data) : o.data;
                o.requestType = 'application/x-www-form-urlencoded';
                break;
            case 'json':
                sendString = true;
                o.requestType = 'application/json;charset=UTF-8';
                o.dataString = JSON.stringify(o.data);
            default:
                break;
        }

        if(o.onProgress) x.onprogress = (e) => o.onProgress(e.loaded, e.total, Math.ceil((e.loaded / e.total) * 100));
        x.setRequestHeader('Content-Type', o.requestType);
        x.send((sendString) ? o.dataString : o.data);
    }
    else {
        x.send();
    }
};

const post = (url, data, callback, resType = 'json', reqType = 'urlencoded') => ajax({url: url, method: 'POST', data: data, responseType: resType, requestType: reqType}, callback);
const get = (url, callback, resType = 'text') => ajax({url: url, method: 'GET', responseType: resType}, callback);
const getJSON = (url, cb) => get(url, cb, 'json');

/**
 * Export JSON to url-encoded serialized value
 * @param {*} json: The JSON to be serialized
 * TODO: add support for nested objects
 */
const serializeJSON = (json) => {
    let d = [];
    Object.keys(json).forEach(function(k){
        d.push(encodeURIComponent(k) + '=' + encodeURIComponent(json[k]));
    })
    return d.join('&').replace(/%20/g, '+');
};

export { ajax, post, get, getJSON, serializeJSON };