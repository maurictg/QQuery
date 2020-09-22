import { serializeJSON } from './helpers';

//Serialize extension
const serialize = (q, json = false) => {
    //Serialize form to url-encoded formdata or JSON
    let d = {};
    let form = q[0];
    Array.prototype.slice.call(form.elements).forEach((f) => {
        if (!f.name || f.disabled || ['file', 'reset', 'submit', 'button'].indexOf(f.type) > -1) return;
        if (f.type === 'select-multiple') {
            Array.prototype.slice.call(f.options).forEach((o) => {
                if (!o.selected) return;
                d[f.name] = o.value;
            });
            return;
        }
        if (['checkbox', 'radio'].indexOf(f.type) > -1 && !f.checked) return;
        d[f.name] = f.value;
    });
    return (json) ? d : serializeJSON(d);
}

export { serialize };