import { fadeIn, fadeOut } from './animations';
import { serialize } from './extensions';
import { ajax, post, get, getJSON, serializeJSON } from './helpers';
import $ from './selector';

/**
 * HQuery version 1.0
 * © 2020 maurictg, MIT Licence
 */

let HQuery = function() {
    return {
        extensions: { fadeIn, fadeOut, serialize },
        version: '1.0',
        init: function() {
            const helpers = { ajax, post, get, getJSON, serializeJSON };
            for (const [k, v] of Object.entries(helpers)) {
                $[k] = v;
            }
        },
        addHelper(name, callback) {
            $[name] = callback;
        }
    };
}();

//Auto-init hquery
HQuery.init();

global.HQuery = HQuery;
global.$ = $;

export { HQuery, $ };