// ==UserScript==
// @name         AGARIO EXTENDED
// @namespace    http://andrielkoromi.blogspot.com.br/
// @version      0.2
// @description  Cor Das Células Código Inimigo. Ativar Zoom. Mostrar Fronteiras, Tamanho Oponente, Minimap
// @author       AndrielKoRoMi
// @require      https://code.jquery.com/jquery-latest.js
// @match        http://agar.io/
// @grant        none
// ==/UserScript==

var show_targeting_colors = false;
var allow_zoom = true;
var show_borders = true;
var show_opponent_size = true;
var show_minimap = false;

var map = null;
var last = {'x':0, 'y':0, 'color':'#000000', 'size':200};

function CenterOfMass(cells, prop){
    var n = 0;
    var d = 0;
    for (var i in cells){
        n += cells[i].size*cells[i].size * cells[i][prop];
        d += cells[i].size*cells[i].size;
    }
    return n/d;
}

function DrawBorders(c, dark)
{
       if (show_borders){
            c.strokeStyle = dark ? "#FFFFFF" : "#000000";
            c.beginPath();
            c.moveTo(0, 0), c.lineTo(11180, 0), c.lineTo(11180, 11180), c.lineTo(0, 11180), c.lineTo(0, 0);
            c.stroke();
        }        
}





(function(f, l) {
    function Ta() {
        ma = !0;
        Ba();
        setInterval(Ba, 18E4);
        C = na = document.getElementById("canvas");
        g = C.getContext("2d");
        C.onmousedown = function(a) {
            if (Ca) {
                var b = a.clientX - (5 + r / 5 / 2),
                    c = a.clientY - (5 + r / 5 / 2);
                if (Math.sqrt(b * b + c * c) <= r / 5 / 2) {
                    L();
                    D(17);
                    return
                }
            }
            U = a.clientX;
            V = a.clientY;
            oa();
            L()
        };
        C.onmousemove = function(a) {
            U = a.clientX;
            V = a.clientY;
            oa()
        };
        C.onmouseup = function() {};
        /firefox/i.test(navigator.userAgent) ? document.addEventListener("DOMMouseScroll", Da, !1) : document.body.onmousewheel = Da;
        var a = !1,
            b = !1,
            c = !1;
        f.onkeydown = function(d) {
            32 != d.keyCode || a || (L(), D(17), a = !0);
            81 != d.keyCode || b || (D(18), b = !0);
            87 != d.keyCode || c || (L(), D(21), c = !0);
            27 == d.keyCode && Ea(!0)
        };
        f.onkeyup = function(d) {
            32 == d.keyCode && (a = !1);
            87 == d.keyCode && (c = !1);
            81 == d.keyCode && b && (D(19), b = !1)
        };
        f.onblur = function() {
            D(19);
            c = b = a = !1
        };
        f.onresize = Fa;
        Fa();
        f.requestAnimationFrame ? f.requestAnimationFrame(Ga) : setInterval(pa, 1E3 / 60);
        setInterval(L, 40);
        w && l("#region").val(w);
        Ha();
        W(l("#region").val());
        null == q && w && X();
        l("#overlays").show()
    }

    function Da(a) {
        E *= Math.pow(.9, a.wheelDelta / -120 || a.detail || 0);
        1 > E && (E = 1);
        E > 4 / k && (E = 4 / k)
    }

    function Ua() {
        if (.4 > k) M = null;
        else {
            for (var a = Number.POSITIVE_INFINITY, b = Number.POSITIVE_INFINITY, c = Number.NEGATIVE_INFINITY, d = Number.NEGATIVE_INFINITY, e = 0, m = 0; m < v.length; m++) {
                var h = v[m];
                !h.J() || h.N || 20 >= h.size * k || (e = Math.max(h.size, e), a = Math.min(h.x, a), b = Math.min(h.y, b), c = Math.max(h.x, c), d = Math.max(h.y, d))
            }
            M = Va.ca({
                X: a - (e + 100),
                Y: b - (e + 100),
                fa: c + (e + 100),
                ga: d + (e + 100),
                da: 2,
                ea: 4
            });
            for (m = 0; m < v.length; m++)
                if (h = v[m], h.J() && !(20 >= h.size * k))
                    for (a = 0; a < h.a.length; ++a) b = h.a[a].x, c = h.a[a].y, b < t - r / 2 / k || c < u - s / 2 / k || b > t + r / 2 / k || c > u + s / 2 / k || M.i(h.a[a])
        }
    }

    function oa() {
        Y = (U - r / 2) / k + t;
        Z = (V - s / 2) / k + u
    }

    function Ba() {
        null == $ && ($ = {}, l("#region").children().each(function() {
            var a = l(this),
                b = a.val();
            b && ($[b] = a.text())
        }));
        
                S: function() {
                    for (var a = this.D(); this.a.length > a;) {
                        var b = ~~(Math.random() * this.a.length);
                        this.a.splice(b, 1);
                        this.l.splice(b, 1)
                    }
                    0 == this.a.length && 0 < a && (this.a.push({
                        R: this,
                        e: this.size,
                        x: this.x,
                        y: this.y
                    }), this.l.push(Math.random() - .5));
                    for (; this.a.length < a;) {
                        var b = ~~(Math.random() * this.a.length),
                            c = this.a[b];
                        this.a.splice(b, 0, {
                            R: this,
                            e: c.e,
                            x: c.x,
                            y: c.y
                        });
                        this.l.splice(b, 0, this.l[b])
                    }
                },
                D: function() {
                    if (0 == this.id) return 16;
                    var a = 10;
                    20 > this.size && (a = 0);
                    this.d && (a = 30);
                    var b = this.size;
                    this.d || (b *= k);
                    b *= z;
                    this.W & 32 && (b *= .25);
                    return ~~Math.max(b, a)
                },
                ha: function() {
                    this.S();
                    for (var a = this.a, b = this.l, c = a.length, d = 0; d < c; ++d) {
                        var e = b[(d - 1 + c) % c],
                            m = b[(d + 1) % c];
                        b[d] += (Math.random() - .5) * (this.j ? 3 : 1);
                        b[d] *= .7;
                        10 < b[d] && (b[d] = 10); - 10 > b[d] && (b[d] = -10);
                        b[d] = (e + m + 8 * b[d]) / 10
                    }
                    for (var h = this, g = this.d ? 0 : (this.id / 1E3 + H / 1E4) % (2 * Math.PI), d = 0; d < c; ++d) {
                        var f = a[d].e,
                            e = a[(d - 1 + c) % c].e,
                            m = a[(d + 1) % c].e;
                        if (15 < this.size && null != M && 20 < this.size * k && 0 != this.id) {
                            var l = !1,
                                n = a[d].x,
                                q = a[d].y;
                            M.ia(n -
                                5, q - 5, 10, 10,
                                function(a) {
                                    a.R != h && 25 > (n - a.x) * (n - a.x) + (q - a.y) * (q - a.y) && (l = !0)
                                });
                            !l && (a[d].x < ea || a[d].y < fa || a[d].x > ga || a[d].y > ha) && (l = !0);
                            l && (0 < b[d] && (b[d] = 0), b[d] -= 1)
                        }
                        f += b[d];
                        0 > f && (f = 0);
                        f = this.j ? (19 * f + this.size) / 20 : (12 * f + this.size) / 13;
                        a[d].e = (e + m + 8 * f) / 10;
                        e = 2 * Math.PI / c;
                        m = this.a[d].e;
                        this.d && 0 == d % 2 && (m += 5);
                        a[d].x = this.x + Math.cos(e * d + g) * m;
                        a[d].y = this.y + Math.sin(e * d + g) * m
                    }
                },
                L: function() {
                    if (0 == this.id) return 1;
                    var a;
                    a = (H - this.M) / 120;
                    a = 0 > a ? 0 : 1 < a ? 1 : a;
                    var b = 0 > a ? 0 : 1 < a ? 1 : a;
                    this.h();
                    if (this.A && 1 <= b) {
                        var c = I.indexOf(this); - 1 != c && I.splice(c, 1)
                    }
                    this.x = a * (this.F - this.p) + this.p;
                    this.y = a * (this.G - this.q) + this.q;
                    this.size = b * (this.n - this.o) + this.o;
                    return b
                },
                J: function() {
                    return 0 == this.id ? !0 : this.x + this.size + 40 < t - r / 2 / k || this.y + this.size + 40 < u - s / 2 / k || this.x - this.size - 40 > t + r / 2 / k || this.y - this.size - 40 > u + s / 2 / k ? !1 : !0
                },
                isTeamColor: function(cells) {
                    for (var e = cells[0].color, t = 0; 3 > t; ++t) {
                        var n = e.substring(2 * t + 1, 2 * t + 3).toLowerCase();
                        if ("ff" === n) {
                            var i = this.color.substring(2 * t + 1, 2 * t + 3).toLowerCase();
                            return i === n ? true : false
                        }
                    }
                    return false
                },                     
                getTargetColor: function(cells, game_mode, is_virus){
                    var color = {'fill':this.color, 'stroke':this.color};
                    var mass = this.size * this.size;
                    if (show_targeting_colors && mass > 400) {
                        var is_teams = (":teams" == game_mode);
                        var smallest = Math.min.apply(null, cells.map(function(e) {
                            return e.size*e.size;
                        }));
                        
                        if (this[is_virus] || 0 === cells.length){
                            color.fill = color.stroke = "#666666";
                        }
                        else if(~cells.indexOf(this) || is_teams && this.isTeamColor(cells)){
                            color.fill = "#3371FF";
                            if (!is_teams) color.stroke = "#3371FF";
                        }
                        else if(mass > 2.5 * smallest){
                            color.fill = "#FF3C3C";
                            if (!is_teams) color.stroke = "#FF3C3C";
                        }
                        else if(.74 * mass > smallest){
                            color.fill = "#FFBF3D";
                            if (!is_teams) color.stroke = "#FFBF3D";
                        }
                        else if(mass > .74 * smallest){
                            color.fill = "#FFFF00";
                            if (!is_teams) color.stroke = "#FFFF00";
                        }
                        else if(mass > .4 * smallest){
                            color.fill = "#00AA00";
                            if (!is_teams) color.stroke = "#00AA00";
                        }
                        else{
                            color.fill = "#44F720";
                            if (!is_teams) color.stroke = "#44F720";
                        }                            
                    }
                    return color;
                },                
                B: function(a) {
                    var color = this.getTargetColor(n, N, 'W');
                    if (this.J()) {
                        var b = 0 != this.id && !this.d && !this.j && .4 > k;
                        5 > this.D() && (b = !0);
                        if (this.N && !b)
                            for (var c = 0; c < this.a.length; c++) this.a[c].e = this.size;
                        this.N = b;
                        a.save();
                        this.ba = H;
                        c = this.L();
                        this.A && (a.globalAlpha *= 1 - c);
                        a.lineWidth = 10;
                        a.lineCap = "round";
                        a.lineJoin = this.d ? "miter" : "round";
                        za ? (a.fillStyle = "#FFFFFF", a.strokeStyle = "#AAAAAA") : (a.fillStyle = color.fill, a.strokeStyle = color.stroke);
                        if (b) a.beginPath(), a.arc(this.x, this.y, this.size, 0, 2 * Math.PI, !1);
                        else {
                            this.ha();
                            a.beginPath();
                            var d = this.D();
                            a.moveTo(this.a[0].x, this.a[0].y);
                            for (c = 1; c <= d; ++c) {
                                var e = c % d;
                                a.lineTo(this.a[e].x, this.a[e].y)
                            }
                        }
                        a.closePath();
                        d = this.name.toLowerCase();
                        !this.j && Pa && ":teams" != N ? -1 != Aa.indexOf(d) ? (K.hasOwnProperty(d) || (K[d] = new Image, K[d].src = "skins/" + d + ".png"), c = 0 != K[d].width && K[d].complete ? K[d] : null) : c = null : c = null;
                        c = (e = c) ? -1 != ib.indexOf(d) : !1;
                        b || a.stroke();
                        a.fill();
                        null == e || c || (a.save(), a.clip(), a.drawImage(e, this.x - this.size, this.y - this.size, 2 * this.size, 2 * this.size), a.restore());
                        (za || 15 < this.size) && !b && (a.strokeStyle = "#000000", a.globalAlpha *= .1, a.stroke());
                        a.globalAlpha = 1;
                        null != e && c && a.drawImage(e, this.x - 2 * this.size, this.y - 2 * this.size, 4 * this.size, 4 * this.size);
                        c = -1 != n.indexOf(this);
                        b = ~~this.y;
                        if ((la || c) && this.name && this.k && (null == e || -1 == hb.indexOf(d))) {
                            e = this.k;
                            e.u(this.name);
                            e.I(this.h());
                            d = Math.ceil(10 * k) / 10;
                            e.$(d);
                            var e = e.H(),
                                m = ~~(e.width / d),
                                h = ~~(e.height / d);
                            a.drawImage(e, ~~this.x - ~~(m / 2), b - ~~(h / 2), m, h);
                            b += e.height / 2 / d + 4
                        }
                        Qa && (c || (0 == n.length || show_opponent_size) && 20 < this.size) && (null == this.K && (this.K = new ka(this.h() / 2, "#FFFFFF", !0, "#000000")), c = this.K, c.I(this.h() / 2), c.u(~~(this.size * this.size / 100)), d = Math.ceil(10 * k) / 10, c.$(d), e = c.H(), m = ~~(e.width / d), h = ~~(e.height / d), a.drawImage(e, ~~this.x - ~~(m / 2), b - ~~(h / 2), m, h));
                        a.restore()
                    }
                }
            };
            ka.prototype = {
                w: "",
                O: "#000000",
                Q: !1,
                s: "#000000",
                r: 16,
                m: null,
                P: null,
                g: !1,
                v: 1,
                I: function(a) {
                    this.r != a && (this.r = a, this.g = !0)
                },
                $: function(a) {
                    this.v != a && (this.v = a, this.g = !0)
                },
                setStrokeColor: function(a) {
                    this.s != a && (this.s = a, this.g = !0)
                },
                u: function(a) {
                    a != this.w && (this.w = a, this.g = !0)
                },
                H: function() {
                    null == this.m && (this.m = document.createElement("canvas"), this.P = this.m.getContext("2d"));
                    if (this.g) {
                        this.g = !1;
                        var a = this.m,
                            b = this.P,
                            c = this.w,
                            d = this.v,
                            e = this.r,
                            m = e + "px Ubuntu";
                        b.font = m;
                        var h = ~~(.2 * e);
                        a.width = (b.measureText(c).width +
                            6) * d;
                        a.height = (e + h) * d;
                        b.font = m;
                        b.scale(d, d);
                        b.globalAlpha = 1;
                        b.lineWidth = 3;
                        b.strokeStyle = this.s;
                        b.fillStyle = this.O;
                        this.Q && b.strokeText(c, 3, e - h / 2);
                        b.fillText(c, 3, e - h / 2)
                    }
                    return this.m
                }
            };
            Date.now || (Date.now = function() {
                return (new Date).getTime()
            });
            var Va = {
                ca: function(a) {
                    function b(a, b, c, d, e) {
                        this.x = a;
                        this.y = b;
                        this.f = c;
                        this.c = d;
                        this.depth = e;
                        this.items = [];
                        this.b = []
                    }
                    var c = a.da || 2,
                        d = a.ea || 4;
                    b.prototype = {
                        x: 0,
                        y: 0,
                        f: 0,
                        c: 0,
                        depth: 0,
                        items: null,
                        b: null,
                        C: function(a) {
                            for (var b = 0; b < this.items.length; ++b) {
                                var c = this.items[b];
                                if (c.x >= a.x && c.y >= a.y && c.x < a.x + a.f && c.y < a.y + a.c) return !0
                            }
                            if (0 != this.b.length) {
                                var d = this;
                                return this.V(a, function(b) {
                                    return d.b[b].C(a)
                                })
                            }
                            return !1
                        },
                        t: function(a, b) {
                            for (var c = 0; c < this.items.length; ++c) b(this.items[c]);
                            if (0 != this.b.length) {
                                var d = this;
                                this.V(a, function(c) {
                                    d.b[c].t(a, b)
                                })
                            }
                        },
                        i: function(a) {
                            0 != this.b.length ? this.b[this.U(a)].i(a) : this.items.length >= c && this.depth < d ? (this.aa(), this.b[this.U(a)].i(a)) : this.items.push(a)
                        },
                        U: function(a) {
                            return a.x < this.x + this.f / 2 ? a.y < this.y + this.c / 2 ? 0 : 2 : a.y < this.y + this.c / 2 ? 1 : 3
                        },
                        V: function(a, b) {
                            return a.x < this.x + this.f / 2 && (a.y < this.y + this.c / 2 && b(0) || a.y >= this.y + this.c / 2 && b(2)) || a.x >= this.x + this.f / 2 && (a.y < this.y + this.c / 2 && b(1) || a.y >= this.y + this.c / 2 && b(3)) ? !0 : !1
                        },
                        aa: function() {
                            var a = this.depth + 1,
                                c = this.f / 2,
                                d = this.c / 2;
                            this.b.push(new b(this.x, this.y, c, d, a));
                            this.b.push(new b(this.x + c, this.y, c, d, a));
                            this.b.push(new b(this.x, this.y + d, c, d, a));
                            this.b.push(new b(this.x + c, this.y + d, c, d, a));
                            a = this.items;
                            this.items = [];
                            for (c = 0; c < a.length; c++) this.i(a[c])
                        },
                        clear: function() {
                            for (var a = 0; a < this.b.length; a++) this.b[a].clear();
                            this.items.length = 0;
                            this.b.length = 0
                        }
                    };
                    var e = {
                        x: 0,
                        y: 0,
                        f: 0,
                        c: 0
                    };
                    return {
                        root: new b(a.X, a.Y, a.fa - a.X, a.ga - a.Y, 0),
                        i: function(a) {
                            this.root.i(a)
                        },
                        t: function(a, b) {
                            this.root.t(a, b)
                        },
                        ia: function(a, b, c, d, f) {
                            e.x = a;
                            e.y = b;
                            e.f = c;
                            e.c = d;
                            this.root.t(e, f)
                        },
                        C: function(a) {
                            return this.root.C(a)
                        },
                        clear: function() {
                            this.root.clear()
                        }
                    }
                }
            };
            l(function() {
                function a() {
                    0 < n.length && (b.color = n[0].color);
                    d.clearRect(0, 0, 32, 32);
                    d.save();
                    d.translate(16, 16);
                    d.scale(.4, .4);
                    b.B(d);
                    d.restore();
                    ++e;
                    e %= 10;
                    if (0 == e) {
                        var a = document.getElementById("favicon"),
                            f = a.cloneNode(!0);
                        f.setAttribute("href", c.toDataURL("image/png"));
                        a.parentNode.replaceChild(f, a)
                    }
                }
                var b = new va(0, 0, 0, 32, "#ED1C24", ""),
                    c = document.createElement("canvas");
                c.width = 32;
                c.height = 32;
                var d = c.getContext("2d"),
                    e = 0;
                a();
                setInterval(a, 1E3 / 60)
            });
            f.onload = Ta
        }
    }
})(window, window.jQuery);
