!function() {
    "use strict";
    window.storage = {
        get: function(a, b) {
            var c;
            try {
                c = localStorage.getItem(a)
            } catch(d) {
                return void 0
            }
            return c ? b ? JSON.parse(c) : c: void 0
        },
        set: function(a, b, c) {
            c && (b = JSON.stringify(b));
            try {
                localStorage.setItem(a, b)
            } catch(d) {
                return void 0
            }
            return ! 0
        },
        remove: function(a) {
            try {
                localStorage.removeItem(a)
            } catch(b) {}
        },
        removeAll: function(a) {
            for (var b = a.length - 1; b >= 0; b--) {
                var c = a[b].name;
                try {
                    localStorage.removeItem(c)
                } catch(d) {}
            }
        }
    },
    window.isSupportLocalStorage = storage.set("isSupportLocalStorage", 1),
    window.hashcode = function(a) {
        var b, c, d = 0;
        if (0 === a.length) return d;
        for (c = 0; c < a.length; c++) b = a.charCodeAt(c),
        d = (d << 5) - d + b,
        d &= d;
        return d
    },
    window.loader = {
        isCss: /.css$/,
        isImg: /.(jpg|png|gif)$/,
        debug: !1,
        res: [],
        resNum: 0,
        resAppendNum: 0,
        callback: function() {},
        base: "",
        alias: {},
        /**
         * [isLocal 保存本地]
         * @param  {[type]}  a [description]
         * @return {Boolean}   [description]
         */
        isLocal: function(a) {
            var b = a.name,
            c = storage.get(b, !0);

            return c && c.v === a.v && c.hash === hashcode(c.code) ? !0 : !1
        },
        /**
         * [nameToUrl 整理加载资源]
         * @param  {[str]} a [参数]
         */
        nameToUrl: function(a) {
            return a = this.alias[a] || a,
            this.base + a
        },
        /**
         * [parseUrl 去掉url后缀的数字戳]
         * @param  {[str]} a [description]
         * @return {[str]}   [description]
         */
        parseUrl: function(a) {
            var b, c = /_\d*\w?/,
            d = {};
            return b = a.match(c),
            b ? (d.name = a.replace(b[0], ""), d.v = b[0].replace("_", "")) : (d.name = a, d.v = -1),
            d
        },
        config: function(a) {
            var b, c, d, e, f = a.res.length, //加载资源
            g = this.isCss,
            h = this.isImg;
            for (this.resNum = f, this.callback = a.callback, this.base = a.base || "", this.alias = a.alias || this.alias, this.debug = a.debug || !window.isSupportLocalStorage, b = 0; f > b; b++) c = this.nameToUrl(a.res[b]),
            d = {},
            e = this.parseUrl(c), //console.log(e),
            d.url = c,
            d.name = e.name,
            d.v = e.v,
            d.isLocal = this.isLocal(d),
            g.test(c) && (d.isCss = !0),
            h.test(c) && (d.isImg = !0),
            this.res.push(d);
            console.log( this.res );
            this.debug && storage.removeAll(this.res),
            this.append()
        },
        append: function() {
            var a, b, c = this.res,
            d = c.length;
            for (a = 0; d > a; a++) if (b = c[a], b.isLocal && !this.debug) {
                var e = storage.get(b.name, !0);
                console.log( e );
                this.renderJs(e.code),
                this.resAppendNum++,
                this.callback(this.resAppendNum, this.resNum, c)
            } else b.isCss ? this.getCss(b) : b.isImg ? this.getImg(b) : this.getScript(b)
        },
        getCss: function(a) {
            var b = this,
            c = document.createElement("link");
            c.rel = "stylesheet",
            c.href = a.url,
            c.onload = function() {
                b.resAppendNum++,
                b.callback(b.resAppendNum, b.resNum, a)
            },
            document.getElementsByTagName("head")[0].appendChild(c)
        },
        getImg: function(a) {
            var b = this,
            c = document.createElement("img");
            c.src = a.url,
            c.onload = function() {
                c.style.display = "none",
                b.resAppendNum++,
                b.callback(b.resAppendNum, b.resNum, a)
            },
            document.getElementsByTagName("head")[0].appendChild(c)
        },
        getScript: function(a) {
            var b = this,
            c = document.createElement("script");
            c.async = !1,
            c.src = a.url,
            c.onload = function() {
                b.resAppendNum++,
                b.callback(b.resAppendNum, b.resNum, a)
            },
            document.getElementsByTagName("head")[0].appendChild(c)
        },
        renderJs: function(a) {
            var b = document.createElement("script");
            b.innerHTML = "(" + a + ")()",
            document.head.appendChild(b)
        },
        renderCss: function(a) {
            var b = document.createElement("style");
            b.innerHTML = a,
            document.head.appendChild(b)
        }
    },
    window.define = function(a, b) {
        console.log('define!!!');
        a = loader.nameToUrl(a);
        var c = loader.parseUrl(a),
        d = {};
        d.code = b.toString(),
        d.hash = hashcode(d.code),
        d.name = c.name,
        d.v = c.v,
        storage.set(d.name, d, !0),
        loader.renderJs(d.code);
    }
} ();