import { fadeIn, fadeOut } from './animations';
import { serialize } from './extensions';
import { ajax, post, get, put, del, getJSON, serializeJSON, deserializeJSON, cookie } from './helpers';
import $ from './selector';

/**
 * QQuery version 1.0.2
 * © 2020 maurictg, MIT Licence
 */

let QQuery = function() {
    return {
        extensions: { fadeIn, fadeOut, serialize },
        version: '1.0.2',
        init: function() {
            const helpers = { ajax, post, get, put, del, getJSON, serializeJSON, deserializeJSON, cookie };
            for (const [k, v] of Object.entries(helpers)) {
                $[k] = v;
            }
        },
        setup: {
            ajax: {
                type: 'header',
                key: 'X-CSRF-TOKEN',
                value: () => $('meta[name="csrf-token"]').attr('content'),
                hasValue: () => $('meta[name="csrf-token"]').any(),
                before: () => {},
                after: (statusCode, response) => {}
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