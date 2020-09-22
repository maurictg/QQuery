//HQuery animation: HFade
const hFade = {
    fade: (t, q, dur, cb) => {
        let o = (t) ? 0 : 1;
        let c = hFade.calc(dur);
        q.css('opacity', `${o}`).show();

        let i = setInterval(() => {
            if((t && o >= 1) || (!t && o <= c.i)) {
                clearInterval(i);
                q.rmCss('opacity');
                if(!t) q.hide();
                if(cb) cb(); //Call callback
            } else {
                o += (t) ? c.i : c.i * -1;
                q.css('opacity', o);
            }
        }, (c.d / c.s));

        //Chainable, but be carefull
        return q;
    },
    calc: (dur) => {
        let s;
        if(isNaN(dur)) {
            if(dur === 'fast') dur = 500;
            else if(dur === 'slow') dur = 3000;
            else dur = 1500;
        }

        if(dur <= 750) s = 10;
        else if(dur <= 1500) s = 20;
        else if (dur <= 3000) s = 30;
        else if(dur <= 5000) s = 40;
        else s = 100;

        return {s: s, d: dur, i: ((100 / s) * 0.01) };
    }
}

const fadeOut = (...p) => hFade.fade(false, ...p);
const fadeIn = (...p) => hFade.fade(true, ...p);

export { fadeOut, fadeIn };