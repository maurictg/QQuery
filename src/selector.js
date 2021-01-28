let Selector = function() {
    'use strict';

    /* Constructor _c */
    let _c = function(s) {
        if(!s) return;

        let nodes = [];
        if(typeof s === 'string')  {
            /* Check if it is HTML or not */
            let arr = Array.from(new DOMParser().parseFromString(s, 'text/html').body.childNodes);
            nodes = (arr.some(n => n.nodeType === 1)) ? arr : document.querySelectorAll(s);
        }
        else if(s instanceof NodeList || s instanceof HTMLCollection || s instanceof _c || (s instanceof Array && s.length > 0 && s[0] instanceof HTMLElement)) nodes = s;
        else if(s instanceof HTMLElement) nodes[0] = s;
        else if(s instanceof Function) {
            if (document.readyState === "complete" || (document.readyState !== "loading" && !document.documentElement.doScroll)) s();
            else document.addEventListener("DOMContentLoaded", s);
            return;
        }
        
        this.length = (s instanceof _c) ? s.length : nodes.length;

        /* Store query in prototype.Q */
        _c.prototype.Q = s; 

        /* Store objects in "this" */
        for (let i = 0; i < this.length; i++) this[i] = nodes[i];

        if (global.QQuery) {
            /**
             * Load extensions.
             * For the usage of extensions: see animations.js
             */
            for (const [k, v] of Object.entries(global.QQuery.extensions)) {
                _c.prototype[k] = (...p) => v(this, ...p);
            }
        } else {
            console.error('Qquery is undefined in constructor');
        }
    }

    /* Shorthand */
    let fn = _c.prototype;

    /**
     * Chaining functions
     */

    /* Each callback(e, i) */
    fn.each = function(cb) {
        if (!cb || typeof cb !== 'function') return;
        for (var i = 0; i < this.length; i++) cb(this[i], i);
        return this;
    }

    fn.addClass = function(c) {
        var classes = c.split(' ');
        this.each((el) => {
            classes.forEach(e => el.classList.add(e));
        });
        return this;
    }

    fn.rmClass = function(c) {
        var classes = c.split(' ');
        this.each((el) => {
            classes.forEach(e => el.classList.remove(e));
        });
        return this;
    }

    fn.hide = function() {
        this.css('display', 'none');
        return this;
    }

    fn.show = function() {
        this.css('display', 'block');
        return this;
    }

    fn.replace = function(e) {
        if(!e) return;
        this.each((x) => x.replaceWith(e));
        return this;
    }

    fn.on = function(e, handler) {
        this.each((x) => x.addEventListener(e, handler));
        return this;
    }

    fn.off = function() {
        this.each((x, i) => {
            let n = x.cloneNode(true);
            this[i].parentNode.replaceChild(n, x);
            this[i] = n; //Also replace in selector
        });
        return this;
    }

    fn.skip = function(n) {
        return new _c(Array.prototype.slice.call(this, n));
    }

    fn.take = function(n) {
        return new _c(Array.prototype.slice.call(this, 0, Math.min(this.length, n)));
    } 

    fn.parent = function() {
        return new _c(this[0].parentNode);
    }

    fn.children = function() {
        return new _c(this[0].children);
    }

    fn.first = function() {
        return new _c(this[0]);
    }

    fn.get = function(i) {
        return new _c(this[i]);
    }

    fn.focus = function() {
        this[0].focus();
        return this;
    }
    
    /**
     * Semi-chaining functions (getters/setters), only setters are chainable
     */

    fn.html = function(h) {
        if(!(h || h === '')) return this[0].innerHTML
        this.each((e) => e.innerHTML = h);
        return this;
    }

    fn.append = function(e) {
        if(!e) return;
        this[0].appendChild($(e)[0]);
        return this;
    }

    fn.appendTo = function(e) {
        if (!(e || typeof e === 'string' || e instanceof _c)) return;
        if(typeof e === 'string') e = new _c(e);
        this.each((el) => e.append(el));
        return this;
    }
    
    fn.text = function(t) {
        if(!(t || t === '')) return this[0].innerText;
        this.each((e) => e.textContent = t);
        return this;
    }

    fn.css = function(n, v) {
        if(!n) return;
        if(!(v || v === '')) return this[0].style[n];
        this.each((e) => e.style[n] = v);
        return this;
    }

    fn.rmCss = function(n) {
        if(!n) return;
        this.each((e) => e.style.removeProperty(n));
        return this;
    }

    fn.attr = function(n, v) {
        if(!n) return;
        if(v === undefined) return this[0].getAttribute(n);
        this.each((e) => e.setAttribute(n, v));
        return this;
    }

    fn.rmAttr = function(n) {
        if(!n) return;
        this.each((e) => e.removeAttribute(n));
        return this;
    }

    fn.prop = function(n, v) {
        if(!n) return;
        if(v === undefined) return this[0][n];
        this.each((e) => e[n] = v);
        return this;
    }

    fn.data = function(n, v) {
        return this.attr('data-'+n, v);
    }

    fn.rmData = function(n) {
        return this.rmAttr('data-'+n);
    }

    fn.val = function(v) {
        if(!(v || v === '')) return this[0].value;
        this.each((e) => e.value = v);
        return this; 
    }

    /***
     * Non-chaining functions
     */

    fn.destroy = function() {
        this.each((e) => e.parentNode.removeChild(e));
    }

    fn.toArray = function() {
        return Array.prototype.slice.call(this);
    }

    fn.clone = function() {
        return this[0].cloneNode(true);
    }

    fn.any = function() {
        return (this.length > 0)
    }
    
    /* Return initalized constructor */
    return (s) => new _c(s);
}();

export default Selector;