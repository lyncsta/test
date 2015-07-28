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

var show_targeting_colors = true;
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

function DrawMinimap(oc, cells) {
    
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
        l.get(aa + "//m.agar.io/info", function(a) {
            var b = {},
                c;
            for (c in a.regions) {
                var d = c.split(":")[0];
                b[d] = b[d] || 0;
                b[d] += a.regions[c].numPlayers
            }
            for (c in b) l('#region option[value="' + c + '"]').text($[c] + " (" + b[c] + " players)")
        }, "json")
    }

    function Ia() {
        l("#adsBottom").hide();
        l("#overlays").hide();
        Ha()
    }

    function W(a) {
        a && a != w && (l("#region").val() != a && l("#region").val(a), w = f.localStorage.location = a, l(".region-message").hide(), l(".region-message." + a).show(), l(".btn-needs-server").prop("disabled", !1), ma && X())
    }

    function Ea(a) {
        F = null;
        l("#overlays").fadeIn(a ? 200 : 3E3);
        a || l("#adsBottom").fadeIn(3E3)
    }

    function Ha() {
        l("#region").val() ? f.localStorage.location = l("#region").val() : f.localStorage.location && l("#region").val(f.localStorage.location);
        l("#region").val() ? l("#locationKnown").append(l("#region")) : l("#locationUnknown").append(l("#region"))
    }

    function qa() {
        console.log("Find " + w + N);
        l.ajax(aa + "//m.agar.io/", {
            error: function() {
                setTimeout(qa, 1E3)
            },
            success: function(a) {
                a = a.split("\n");
                "45.79.222.79:443" == a[0] ? qa() : Ja("ws://" + a[0])
            },
            dataType: "text",
            method: "POST",
            cache: !1,
            crossDomain: !0,
            data: w + N || "?"
        })
    }

    function X() {
        ma && w && (l("#connecting").show(), qa())
    }

    function Ja(a) {
        if (q) {
            q.onopen = null;
            q.onmessage = null;
            q.onclose = null;
            try {
                q.close()
            } catch (b) {}
            q = null
        }
        var c = f.location.search.slice(1);
        /^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+:[0-9]+$/.test(c) && (a = "ws://" + c);
        Wa && (a = a.split(":"), a = a[0] + "s://ip-" + a[1].replace(/\./g, "-").replace(/\//g, "") + ".tech.agar.io:" + (+a[2] + 2E3));
        G = [];
        n = [];
        A = {};
        v = [];
        I = [];
        B = [];
        x = y = null;
        J = 0;
        console.log("Connecting to " + a);
        q = new WebSocket(a);
        q.binaryType = "arraybuffer";
        q.onopen = Xa;
        q.onmessage = Ya;
        q.onclose = Za;
        q.onerror = function() {
            console.log("socket error")
        }
    }

    function O(a) {
        return new DataView(new ArrayBuffer(a))
    }

    function P(a) {
        q.send(a.buffer)
    }

    function Xa() {
        var a;
        ba = 500;
        l("#connecting").hide();
        console.log("socket open");
        a = O(5);
        a.setUint8(0, 254);
        a.setUint32(1, 4, !0);
        P(a);
        a = O(5);
        a.setUint8(0, 255);
        a.setUint32(1, 673720361, !0);
        P(a);
        Ka()
    }

    function Za() {
        console.log("socket close");
        setTimeout(X, ba);
        ba *= 1.5
    }

    function Ya(a) {
        $a(new DataView(a.data))
    }

    function $a(a) {
        function b() {
            for (var b = "";;) {
                var d = a.getUint16(c, !0);
                c += 2;
                if (0 == d) break;
                b += String.fromCharCode(d)
            }
            return b
        }
        var c = 0;
        240 == a.getUint8(c) && (c += 5);
        switch (a.getUint8(c++)) {
            case 16:
                ab(a, c);
                break;
            case 17:
                Q = a.getFloat32(c, !0);
                c += 4;
                R = a.getFloat32(c, !0);
                c += 4;
                S = a.getFloat32(c, !0);
                c += 4;
                break;
            case 20:
                n = [];
                G = [];
                break;
            case 21:
                ra = a.getInt16(c, !0);
                c += 2;
                sa = a.getInt16(c, !0);
                c += 2;
                ta || (ta = !0, ca = ra, da = sa);
                break;
            case 32:
                G.push(a.getUint32(c, !0));
                c += 4;
                break;
            case 49:
                if (null != y) break;
                var d = a.getUint32(c, !0),
                    c = c + 4;
                B = [];
                for (var e = 0; e < d; ++e) {
                    var m = a.getUint32(c, !0),
                        c = c + 4;
                    B.push({
                        id: m,
                        name: b()
                    })
                }
                La();
                break;
            case 50:
                y = [];
                d = a.getUint32(c, !0);
                c += 4;
                for (e = 0; e < d; ++e) y.push(a.getFloat32(c, !0)), c += 4;
                La();
                break;
            case 64:
                ea = a.getFloat64(c, !0), c += 8, fa = a.getFloat64(c, !0), c += 8, ga = a.getFloat64(c, !0), c += 8, ha = a.getFloat64(c, !0), c += 8, Q = (ga + ea) / 2, R = (ha + fa) / 2, S = 1, 0 == n.length && (t = Q, u = R, k = S)
        }
    }

    function ab(a, b) {
        H = +new Date;
        var c = Math.random();
        ua = !1;
        var d = a.getUint16(b, !0);
        b += 2;
        for (var e = 0; e < d; ++e) {
            var m = A[a.getUint32(b, !0)],
                h = A[a.getUint32(b + 4, !0)];
            b += 8;
            m && h && (h.T(), h.p = h.x, h.q = h.y, h.o = h.size, h.F = m.x, h.G = m.y, h.n = h.size, h.M = H)
        }
        for (e = 0;;) {
            d = a.getUint32(b, !0);
            b += 4;
            if (0 == d) break;
            ++e;
            var g, m = a.getInt16(b, !0);
            b += 2;
            h = a.getInt16(b, !0);
            b += 2;
            g = a.getInt16(b, !0);
            b += 2;
            for (var f = a.getUint8(b++), k = a.getUint8(b++), l = a.getUint8(b++), f = (f <<
                    16 | k << 8 | l).toString(16); 6 > f.length;) f = "0" + f;
            var f = "#" + f,
                k = a.getUint8(b++),
                l = !!(k & 1),
                r = !!(k & 16);
            k & 2 && (b += 4);
            k & 4 && (b += 8);
            k & 8 && (b += 16);
            for (var q, p = "";;) {
                q = a.getUint16(b, !0);
                b += 2;
                if (0 == q) break;
                p += String.fromCharCode(q)
            }
            q = p;
            p = null;
            A.hasOwnProperty(d) ? (p = A[d], p.L(), p.p = p.x, p.q = p.y, p.o = p.size, p.color = f) : (p = new va(d, m, h, g, f, q), v.push(p), A[d] = p, p.ka = m, p.la = h);
            p.d = l;
            p.j = r;
            p.F = m;
            p.G = h;
            p.n = g;
            p.ja = c;
            p.M = H;
            p.W = k;
            q && p.Z(q); - 1 != G.indexOf(d) && -1 == n.indexOf(p) && (document.getElementById("overlays").style.display = "none", n.push(p), 1 == n.length && (t = p.x, u = p.y))
        }
        c = a.getUint32(b, !0);
        b += 4;
        for (e = 0; e < c; e++) d = a.getUint32(b, !0), b += 4, p = A[d], null != p && p.T();
        ua && 0 == n.length && Ea(!1)
    }

    function L() {
        var a;
        if (wa()) {
            a = U - r / 2;
            var b = V - s / 2;
            64 > a * a + b * b || .01 > Math.abs(Ma - Y) && .01 > Math.abs(Na - Z) || (Ma = Y, Na = Z, a = O(21), a.setUint8(0, 16), a.setFloat64(1, Y, !0), a.setFloat64(9, Z, !0), a.setUint32(17, 0, !0), P(a))
        }
    }

    function Ka() {
        if (wa() && null != F) {
            var a = O(1 + 2 * F.length);
            a.setUint8(0, 0);
            for (var b = 0; b < F.length; ++b) a.setUint16(1 + 2 * b, F.charCodeAt(b), !0);
            P(a)
        }
    }

    function wa() {
        return null != q && q.readyState == q.OPEN
    }

    function D(a) {
        if (wa()) {
            var b = O(1);
            b.setUint8(0, a);
            P(b)
        }
    }

    function Ga() {
        pa();
        f.requestAnimationFrame(Ga)
    }

    function Fa() {
        r = f.innerWidth;
        s = f.innerHeight;
        na.width = C.width = r;
        na.height = C.height = s;
        pa()
    }

    function Oa() {
        var a;
        a = 1 * Math.max(s / 1080, r / 1920);
        return a *= E
    }

    function bb() {
        if (0 != n.length && !allow_zoom) {
            for (var a = 0, b = 0; b < n.length; b++) a += n[b].size;
            a = Math.pow(Math.min(64 / a, 1), .4) * Oa();
            k = (9 * k + a) / 10
        }
    }
    
    function Zoom(e) {
        allow_zoom && (k *= 1 + e.wheelDelta / 1e3);
    }
    "onwheel" in document ? document.addEventListener("wheel", Zoom) : "onmousewheel" in document ? document.addEventListener("mousewheel", Zoom) : document.addEventListener("MozMousePixelScroll", Zoom);

    function pa() {
        var a, b = Date.now();
        ++cb;
        H = b;
        if (0 < n.length) {
            bb();
            for (var c = a = 0, d = 0; d < n.length; d++) n[d].L(),
                a += n[d].x / n.length, c += n[d].y / n.length;
            Q = a;
            R = c;
            S = k;
            t = (t + a) / 2;
            u = (u + c) / 2
        } else t = (29 * t + Q) / 30, u = (29 * u + R) / 30, k = (9 * k + S * Oa()) / 10;
        Ua();
        oa();
        xa || g.clearRect(0, 0, r, s);
        xa ? (g.fillStyle = ia ? "#111111" : "#F2FBFF", g.globalAlpha = .05, g.fillRect(0, 0, r, s), g.globalAlpha = 1) : db();
        v.sort(function(a, b) {
            return a.size == b.size ? a.id - b.id : a.size - b.size
        });
        g.save();
        g.translate(r / 2, s / 2);
        g.scale(k, k);
        g.translate(-t, -u);
        DrawBorders(g, ia);
        for (d = 0; d < I.length; d++) I[d].B(g);
        for (d = 0; d < v.length; d++) v[d].B(g);
        if (ta) {
            ca = (3 * ca + ra) / 4;
            da = (3 * da + sa) / 4;
            g.save();
            g.strokeStyle =
                "#FFAAAA";
            g.lineWidth = 10;
            g.lineCap = "round";
            g.lineJoin = "round";
            g.globalAlpha = .5;
            g.beginPath();
            for (d = 0; d < n.length; d++) g.moveTo(n[d].x, n[d].y), g.lineTo(ca, da);
            g.stroke();
            g.restore()
        }
        g.restore();
        x && x.width && g.drawImage(x, r - x.width - 10, 10);
        DrawMinimap(g, n);
        J = Math.max(J, eb());
        0 != J && (null == ja && (ja = new ka(24, "#FFFFFF")), ja.u("Score: " + ~~(J / 100)), c = ja.H(), a = c.width, g.globalAlpha = .2, g.fillStyle = "#000000", g.fillRect(10, s - 10 - 24 - 10, a + 10, 34), g.globalAlpha = 1, g.drawImage(c, 15, s - 10 - 24 - 5));
        fb();
        b = Date.now() - b;
        b > 1E3 / 60 ? z -= .01 : b < 1E3 /
            65 && (z += .01);.4 > z && (z = .4);
        1 < z && (z = 1)
    }

    function db() {
        g.fillStyle = ia ? "#111111" : "#F2FBFF";
        g.fillRect(0, 0, r, s);
        g.save();
        g.strokeStyle = ia ? "#AAAAAA" : "#000000";
        g.globalAlpha = .2;
        g.scale(k, k);
        for (var a = r / k, b = s / k, c = -.5 + (-t + a / 2) % 50; c < a; c += 50) g.beginPath(), g.moveTo(c, 0), g.lineTo(c, b), g.stroke();
        for (c = -.5 + (-u + b / 2) % 50; c < b; c += 50) g.beginPath(), g.moveTo(0, c), g.lineTo(a, c), g.stroke();
        g.restore()
    }

    function fb() {
        if (Ca && ya.width) {
            var a = r / 5;
            g.drawImage(ya, 5, 5, a, a)
        }
    }

    function eb() {
        for (var a = 0, b = 0; b < n.length; b++) a += n[b].n * n[b].n;
        return a
    }

    function La() {
        x = null;
        if (null != y || 0 != B.length)
            if (null != y || la) {
                x = document.createElement("canvas");
                var a = x.getContext("2d"),
                    b = 60,
                    b = null == y ? b + 24 * B.length : b + 180,
                    c = Math.min(200, .3 * r) / 200;
                x.width = 200 * c;
                x.height = b * c;
                a.scale(c, c);
                a.globalAlpha = .4;
                a.fillStyle = "#000000";
                a.fillRect(0, 0, 200, b);
                a.globalAlpha = 1;
                a.fillStyle = "#FFFFFF";
                c = null;
                c = "Leaderboard";
                a.font = "30px Ubuntu";
                a.fillText(c, 100 - a.measureText(c).width / 2, 40);
                if (null == y)
                    for (a.font = "20px Ubuntu", b = 0; b < B.length; ++b) c = B[b].name || "An unnamed cell",
                        la || (c = "An unnamed cell"), -1 != G.indexOf(B[b].id) ? (n[0].name && (c = n[0].name), a.fillStyle = "#FFAAAA") : a.fillStyle = "#FFFFFF", c = b + 1 + ". " + c, a.fillText(c, 100 - a.measureText(c).width / 2, 70 + 24 * b);
                else
                    for (b = c = 0; b < y.length; ++b) {
                        var d = c + y[b] * Math.PI * 2;
                        a.fillStyle = gb[b + 1];
                        a.beginPath();
                        a.moveTo(100, 140);
                        a.arc(100, 140, 80, c, d, !1);
                        a.fill();
                        c = d
                    }
            }
    }

    function va(a, b, c, d, e, m) {
        this.id = a;
        this.p = this.x = b;
        this.q = this.y = c;
        this.o = this.size = d;
        this.color = e;
        this.a = [];
        this.l = [];
        this.S();
        this.Z(m)
    }

    function ka(a, b, c, d) {
        a && (this.r = a);
        b && (this.O = b);
        this.Q = !!c;
        d && (this.s = d)
    }
              
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
