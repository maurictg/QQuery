import { fadeIn, fadeOut } from './animations';
import { serialize } from './extensions';
import { ajax, post, get, getJSON, serializeJSON } from './helpers';
import $ from './selector';

/**
 * QQuery version 1.0.0
 * © 2020 maurictg, MIT Licence
 */

let QQuery = function() {
    return {
        extensions: { fadeIn, fadeOut, serialize },
        version: '1.0.0',
        init: function() {
            const helpers = { ajax, post, get, getJSON, serializeJSON };
            for (const [k, v] of Object.entries(helpers)) {
                $[k] = v;
            }
        },
        addHelper(name, callback) {
            $[name] = callback;
        },
        use: function() {
            return $;
        }
    };
}();

//Auto-init qquery
QQuery.init();

global.QQuery = QQuery;
global.$ = $;

export default QQuery;