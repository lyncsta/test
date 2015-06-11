// ==UserScript==
// @name         Agar Unfair
// @namespace    http://your.homepage/
// @version      0.1
// @description  Highly experimental version of Agar Extended.  This script connects to the spectate feed to display a larger area
// @author       agar_cheats
// @require      https://code.jquery.com/jquery-latest.js
// @match        http://agar.io/
// @grant        none
// ==/UserScript==

var show_targeting_colors = true;
var allow_zoom = true;
var show_borders = true;
var show_opponent_size = true;
var show_minimap = true;

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

function DrawMinimap(oc, cells) {
    var client_width = window.innerWidth, client_height = window.innerHeight;
    var board_size = 11180;
    
    map && oc.drawImage(map, client_width-map.width-10, client_height-map.height-10);
    map || (map = document.createElement("canvas"));
    var c = Math.min(150, .3 * client_height, .3 * client_width) / board_size;
    map.width = board_size * c;
    map.height = board_size * c;

    mc = map.getContext("2d");
    mc.scale(c, c);
    mc.globalAlpha = .2;
    mc.fillStyle = "#000000";
    mc.fillRect(0, 0, board_size, board_size);
    mc.globalAlpha = .4;
    mc.lineWidth = 200;
    mc.strokeStyle = "#000000";
    mc.strokeRect(0, 0, board_size, board_size);
    if (cells && cells[0]){
        last.x = CenterOfMass(cells,'x');
        last.y = CenterOfMass(cells,'y');
        last.size = 200;
        last.color = cells[0].color;
    }
    mc.beginPath();
    mc.arc(last.x, last.y, last.size, 0, 2 * Math.PI, false);
    mc.globalAlpha = .8;
    mc.fillStyle = last.color;
    mc.fill();
    mc.lineWidth = 70;
    mc.stroke();
}    

(function(f, g) {
    function Pa() {
        ja = !0;
        xa();
        setInterval(xa, 18E4);
        A = ka = document.getElementById("canvas");
        e = A.getContext("2d");
        A.onmousedown = function(a) {
            if (ya) {
                var b = a.clientX - (5 + p / 5 / 2),
                    c = a.clientY - (5 + p / 5 / 2);
                if (Math.sqrt(b * b + c * c) <= p / 5 / 2) {
                    K();
                    B(17);
                    return
                }
            }
            S = a.clientX;
            T = a.clientY;
            la();
            K()
        };
        A.onmousemove = function(a) {
            S = a.clientX;
            T = a.clientY;
            la()
        };
        A.onmouseup = function(a) {};
        /firefox/i.test(navigator.userAgent) ? document.addEventListener("DOMMouseScroll", za, !1) : document.body.onmousewheel = za;
        var a = !1,
            b = !1,
            c = !1;
        f.onkeydown = function(d) {
            32 != d.keyCode || a || (K(), B(17), a = !0);
            81 != d.keyCode || b || (B(18), b = !0);
            87 != d.keyCode || c || (K(), B(21), c = !0);
            27 == d.keyCode && Aa(!0)
        };
        f.onkeyup = function(d) {
            32 == d.keyCode && (a = !1);
            87 == d.keyCode && (c = !1);
            81 == d.keyCode && b && (B(19), b = !1)
        };
        f.onblur = function() {
            B(19);
            c = b = a = !1
        };
        f.onresize = Ba;
        Ba();
        f.requestAnimationFrame ? f.requestAnimationFrame(Ca) : setInterval(ma, 1E3 / 60);
        setInterval(K, 40);
        u && g("#region").val(u);
        Da();
        U(g("#region").val());
        null == m && u && V();
        g("#overlays").show()
    }

    function za(a) {
        C *= Math.pow(.9, a.wheelDelta / -120 || a.detail || 0);
        1 > C && (C = 1);
        C > 4 / h && (C = 4 / h)
    }

    function Qa() {
        if (.35 > h) L = null;
        else {
            for (var a = Number.POSITIVE_INFINITY, b = Number.POSITIVE_INFINITY, c = Number.NEGATIVE_INFINITY, d = Number.NEGATIVE_INFINITY, e = 0, q = 0; q < n.length; q++) n[q].shouldRender() && (e = Math.max(n[q].size, e), a = Math.min(n[q].x, a), b = Math.min(n[q].y, b), c = Math.max(n[q].x, c), d = Math.max(n[q].y, d));
            L = QUAD.init({
                minX: a - (e + 100),
                minY: b - (e + 100),
                maxX: c + (e + 100),
                maxY: d + (e + 100)
            });
            for (q = 0; q < n.length; q++)
                if (a = n[q], a.shouldRender())
                    for (b = 0; b < a.points.length; ++b) L.insert(a.points[b])
        }
    }

    function la() {
        W = (S - p / 2) / h + s;
        X = (T - r / 2) / h + t
    }

    function xa() {
        null == Y && (Y = {}, g("#region").children().each(function() {
            var a = g(this),
                b = a.val();
            b && (Y[b] = a.text())
        }));
        g.get(F + "//m.agar.io/info", function(a) {
            var b = {}, c;
            for (c in a.regions) {
                var d = c.split(":")[0];
                b[d] = b[d] || 0;
                b[d] += a.regions[c].numPlayers
            }
            for (c in b) g('#region option[value="' + c + '"]').text(Y[c] + " (" + b[c] + " players)")
        }, "json")
    }

    function Ea() {
        g("#adsBottom").hide();
        g("#overlays").hide();
        Da()
    }

    function U(a) {
        a && a != u && (g("#region").val() != a && g("#region").val(a),
            u = f.localStorage.location = a, g(".region-message").hide(), g(".region-message." + a).show(), g(".btn-needs-server").prop("disabled", !1), ja && V())
    }

    function Aa(a) {
        D = null;
        g("#overlays").fadeIn(a ? 200 : 3E3);
        a || g("#adsBottom").fadeIn(3E3)
    }

    function Da() {
        g("#region").val() ? f.localStorage.location = g("#region").val() : f.localStorage.location && g("#region").val(f.localStorage.location);
        g("#region").val() ? g("#locationKnown").append(g("#region")) : g("#locationUnknown").append(g("#region"))
    }

    function na() {
        console.log("Find " +
            u + M);
        g.ajax(F + "//m.agar.io/", {
            error: function() {
                setTimeout(na, 1E3)
            },
            success: function(a) {
                a = a.split("\n");
                "45.79.222.79:443" == a[0] ? na() : Fa("ws://" + a[0])
            },
            dataType: "text",
            method: "POST",
            cache: !1,
            crossDomain: !0,
            data: u + M || "?"
        })
    }

    function V() {
        ja && u && (g("#connecting").show(), na())
    }
    
    var web_socket_2 = null;
    var server = null;
    
    var primary = null;
    var retries = 0;
    var matched = false;
    var failed = false;

    function closeSocket()
    {
        if (web_socket_2) {
            web_socket_2.onopen = null;
            web_socket_2.onmessage = null;
            web_socket_2.onclose = null;
            try {
                web_socket_2.close()
            } catch (b) {}
            web_socket_2 = null;
        }
    }
    
    function SecondaryConnect()
    {
        closeSocket();
        if (retries > 5) {
            failed = true;
            return;
        }
        retries++;
      
        web_socket_2 = new WebSocket(server, Ga ? ["binary", "base64"] : []);
        web_socket_2.binaryType = "arraybuffer";
        web_socket_2.onopen = OnSocketOpen2;
        web_socket_2.onmessage = Sa2;
        //web_socket_2.onclose = OnSocketClose2;
        web_socket_2.onerror = function() {
            console.log("socket error")
        }
    }
    
    function Fa(a) {
        if (m) {
            m.onopen = null;
            m.onmessage = null;
            m.onclose = null;
            try {
                m.close()
            } catch (b) {}
            m = null
        }
        primary = null;
        retries = 0;
        matched = false;        
        failed = false;
        
        var c = f.location.search.slice(1);
        /^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+:[0-9]+$/.test(c) && (a = "ws://" + c);
        Ga && (a = a.split(":"), a = a[0] + "s://ip-" +
            a[1].replace(/\./g, "-").replace(/\//g, "") + ".tech.agar.io:" + (+a[2] + 2E3));
        E = [];
        l = [];
        y = {};
        n = [];
        G = [];
        z = [];
        v = w = null;
        H = 0;
        console.log("Connecting to " + a);
        server = a;
        m = new WebSocket(a, Ga ? ["binary", "base64"] : []);
        m.binaryType = "arraybuffer";
        m.onopen = Ra;
        m.onmessage = Sa;
        m.onclose = Ta;
        m.onerror = function() {
            console.log("socket error")
        }
        SecondaryConnect();
    }
    
    function OnSocketOpen2(a) {
        Z = 500;
        g("#connecting").hide();
        console.log("socket open");
        a = new ArrayBuffer(5);
        var b = new DataView(a);
        b.setUint8(0, 254);
        b.setUint32(1, 4, !0);
        web_socket_2.send(a);
        a = new ArrayBuffer(5);
        b = new DataView(a);
        b.setUint8(0, 255);
        b.setUint32(1, 673720360, !0);
        web_socket_2.send(a);
        Ha()
        
        b = new ArrayBuffer(1);
        (new DataView(b)).setUint8(0, 1);
        web_socket_2.send(b)
    }

    function Ra(a) {
        Z = 500;
        g("#connecting").hide();
        console.log("socket open");
        a = new ArrayBuffer(5);
        var b = new DataView(a);
        b.setUint8(0, 254);
        b.setUint32(1, 4, !0);
        m.send(a);
        a = new ArrayBuffer(5);
        b = new DataView(a);
        b.setUint8(0, 255);
        b.setUint32(1, 673720360, !0);
        m.send(a);
        Ha();
        
        //b = new ArrayBuffer(1);
        //(new DataView(b)).setUint8(0, 1);
        //m.send(b)        
    }

    function Ta(a) {
        console.log("socket close");
        setTimeout(V, Z);
        Z *= 1.5
    }
    
    function Sa2(a) {
        function b() {
            for (var a = "";;) {
                var b = d.getUint16(c, !0);
                c += 2;
                if (0 == b) break;
                a += String.fromCharCode(b)
            }
            return a
        }
        var c = 0,
            d = new DataView(a.data);
        240 == d.getUint8(c) && (c += 5);
        switch (d.getUint8(c++)) {
            case 16:
                matched && Ua2(d, c);
                break;
           /* case 17:
                N = d.getFloat32(c, !0);
                c += 4;
                O = d.getFloat32(c, !0);
                c += 4;
                P = d.getFloat32(c, !0);
                c += 4;
                break;
            case 20:
                l = [];
                E = [];
                break;
            case 21:
                oa = d.getInt16(c, !0);
                c += 2;
                pa = d.getInt16(c, !0);
                c += 2;
                qa || (qa = !0, $ = oa, aa = pa);
                break;
            case 32:
                E.push(d.getUint32(c, !0));
                c += 4;
                break;*/
            case 49:
                if (null != w) break;
                a = d.getUint32(c, !0);
                c += 4;
                z = [];
                for (var e = 0; e < a; ++e) {
                    var q = d.getUint32(c, !0),
                        c = c + 4;
                    z.push({
                        id: q,
                        name: b()
                    })
                }
                if (!matched){
                    var secondary = z.map(function(e){return e.name;}).join();
                    if (primary){
                        if (secondary === primary){
                            matched = true;
                            console.log('matched');
                        }
                        else{
                            console.log('retry for match');
                            SecondaryConnect();                        
                        }
                    }
                }
                //Ia();
                break;
            case 50:
                w = [];
                a = d.getUint32(c, !0);
                c += 4;
                for (e = 0; e < a; ++e) w.push(d.getFloat32(c, !0)), c += 4;
                if (!matched){
                    var secondary = w.map(function(e){return ~~(e*100);}).join();
                    if (primary){
                        if (secondary === primary){
                            matched = true;
                            console.log('matched:teams');
                        }
                        else{
                            console.log('retry for match:teams');
                            SecondaryConnect();                        
                        }
                    }
                }
                //Ia();
                break;
            /*case 64:
                ba = d.getFloat64(c, !0), c += 8, ca = d.getFloat64(c, !0), c += 8, da = d.getFloat64(c, !0), c += 8, ea = d.getFloat64(c, !0), c += 8, N = (da + ba) / 2, O = (ea + ca) / 2, P = 1, 0 == l.length && (s = N, t =
                    O, h = P)*/
        }
    }

    function Sa(a) {
        function b() {
            for (var a = "";;) {
                var b = d.getUint16(c, !0);
                c += 2;
                if (0 == b) break;
                a += String.fromCharCode(b)
            }
            return a
        }
        var c = 0,
            d = new DataView(a.data);
        240 == d.getUint8(c) && (c += 5);
        switch (d.getUint8(c++)) {
            case 16:
                Ua(d, c);
                break;
            case 17:
                N = d.getFloat32(c, !0);
                c += 4;
                O = d.getFloat32(c, !0);
                c += 4;
                P = d.getFloat32(c, !0);
                c += 4;
                break;
            case 20:
                l = [];
                E = [];
                break;
            case 21:
                oa = d.getInt16(c, !0);
                c += 2;
                pa = d.getInt16(c, !0);
                c += 2;
                qa || (qa = !0, $ = oa, aa = pa);
                break;
            case 32:
                E.push(d.getUint32(c, !0));
                c += 4;
                break;
            case 49:
                if (null != w) break;
                a = d.getUint32(c, !0);
                c += 4;
                z = [];
                for (var e = 0; e < a; ++e) {
                    var q = d.getUint32(c, !0),
                        c = c + 4;
                    z.push({
                        id: q,
                        name: b()
                    })
                }
                if (!matched && !failed){
                    primary = z.map(function(e){return e.name;}).join();
                }
                Ia();
                break;
            case 50:
                w = [];
                a = d.getUint32(c, !0);
                c += 4;
                for (e = 0; e < a; ++e) w.push(d.getFloat32(c, !0)), c += 4;
                if (!matched && !failed){
                    primary = w.map(function(e){return ~~(e*100);}).join();
                }
                Ia();
                break;
            case 64:
                ba = d.getFloat64(c, !0), c += 8, ca = d.getFloat64(c, !0), c += 8, da = d.getFloat64(c, !0), c += 8, ea = d.getFloat64(c, !0), c += 8, N = (da + ba) / 2, O = (ea + ca) / 2, P = 1, 0 == l.length && (s = N, t =
                    O, h = P)
        }
    }
    function Ua(a, b) {
        I = +new Date;
        var c = Math.random();
        ra = !1;
        var d = a.getUint16(b, !0);
        b += 2;
        for (var e = 0; e < d; ++e) {
            var q = y[a.getUint32(b, !0)],
                f = y[a.getUint32(b + 4, !0)];
            b += 8;
            q && f && (f.destroy(), f.ox = f.x, f.oy = f.y, f.oSize = f.size, f.nx = q.x, f.ny = q.y, f.nSize = f.size, f.updateTime = I)
        }
        for (e = 0;;) {
            d = a.getUint32(b, !0);
            b += 4;
            if (0 == d) break;
            ++e;
            var g, q = a.getInt16(b, !0);
            b += 2;
            f = a.getInt16(b, !0);
            b += 2;
            g = a.getInt16(b, !0);
            b += 2;
            for (var h = a.getUint8(b++), m = a.getUint8(b++), p = a.getUint8(b++), h = (h << 16 | m << 8 | p).toString(16); 6 > h.length;) h = "0" + h;
            var h = "#" + h,
                k = a.getUint8(b++),
                m = !! (k & 1),
                p = !! (k & 16);
            k & 2 && (b += 4);
            k & 4 && (b += 8);
            k & 8 && (b += 16);
            for (var n, k = "";;) {
                n = a.getUint16(b, !0);
                b += 2;
                if (0 == n) break;
                k += String.fromCharCode(n)
            }
            n = k;
            k = null;
            y.hasOwnProperty(d) ? (k = y[d], k.updatePos(), k.ox = k.x, k.oy = k.y, k.oSize = k.size, k.color = h) : (k = new Ja(d, q, f, g, h, n), k.pX = q, k.pY = f);
            k.isVirus = m;
            k.isAgitated = p;
            k.nx = q;
            k.ny = f;
            k.nSize = g;
            k.updateCode = c;
            k.updateTime = I;
            n && k.setName(n); - 1 != E.indexOf(d) && -1 == l.indexOf(k) && (document.getElementById("overlays").style.display = "none", l.push(k), 1 == l.length && (s = k.x, t = k.y))
        }
        c = a.getUint32(b, !0);
        b += 4;
        for (e = 0; e < c; e++) d = a.getUint32(b, !0), b += 4, k = y[d], null != k && k.destroy();
        ra && 0 == l.length && Aa(!1)
    }
    function Ua2(a, b) {
        I = +new Date;
        var c = Math.random();
        ra = !1;
        var d = a.getUint16(b, !0);
        b += 2;
        for (var e = 0; e < d; ++e) {
            var q = y[a.getUint32(b, !0)],
                f = y[a.getUint32(b + 4, !0)];
            b += 8;
            q && f && -1 == l.indexOf(f) && (f.destroy(), f.ox = f.x, f.oy = f.y, f.oSize = f.size, f.nx = q.x, f.ny = q.y, f.nSize = f.size, f.updateTime = I)
        }
        for (e = 0;;) {
            d = a.getUint32(b, !0);
            b += 4;
            if (0 == d) break;
            ++e;
            var g, q = a.getInt16(b, !0);
            b += 2;
            f = a.getInt16(b, !0);
            b += 2;
            g = a.getInt16(b, !0);
            b += 2;
            for (var h = a.getUint8(b++), m = a.getUint8(b++), p = a.getUint8(b++), h = (h << 16 | m << 8 | p).toString(16); 6 > h.length;) h = "0" + h;
            var h = "#" + h,
                k = a.getUint8(b++),
                m = !! (k & 1),
                p = !! (k & 16);
            k & 2 && (b += 4);
            k & 4 && (b += 8);
            k & 8 && (b += 16);
            for (var n, k = "";;) {
                n = a.getUint16(b, !0);
                b += 2;
                if (0 == n) break;
                k += String.fromCharCode(n)
            }
            n = k;
            k = null;
            y.hasOwnProperty(d) ? (k = y[d], k.updatePos(), k.ox = k.x, k.oy = k.y, k.oSize = k.size, k.color = h) : (k = new Ja(d, q, f, g, h, n), k.pX = q, k.pY = f);
            k.isVirus = m;
            k.isAgitated = p;
            k.nx = q;
            k.ny = f;
            k.nSize = g;
            k.updateCode = c;
            k.updateTime = I;
            n && k.setName(n); - 1 != E.indexOf(d) && -1 == l.indexOf(k) && (document.getElementById("overlays").style.display = "none", l.push(k), 1 == l.length && (s = k.x, t = k.y))
        }
        c = a.getUint32(b, !0);
        b += 4;
        for (e = 0; e < c; e++) d = a.getUint32(b, !0), b += 4, k = y[d], null != k && -1 == l.indexOf(k) && k.destroy();
        ra && 0 == l.length && Aa(!1)
    }


    function K() {
        if (sa()) {
            var a = S - p / 2,
                b = T - r / 2;
            64 > a * a + b * b || Ka == W && La == X || (Ka = W, La = X, a = new ArrayBuffer(21), b = new DataView(a), b.setUint8(0, 16), b.setFloat64(1, W, !0), b.setFloat64(9, X, !0), b.setUint32(17, 0, !0), m.send(a))
        }
    }

    function Ha() {
        if (sa() && null != D) {
            var a = new ArrayBuffer(1 + 2 * D.length),
                b = new DataView(a);
            b.setUint8(0, 0);
            for (var c = 0; c < D.length; ++c) b.setUint16(1 +
                2 * c, D.charCodeAt(c), !0);
            m.send(a)
        }
    }

    function sa() {
        return null != m && m.readyState == m.OPEN
    }

    function B(a) {
        if (sa()) {
            var b = new ArrayBuffer(1);
            (new DataView(b)).setUint8(0, a);
            m.send(b)
        }
    }

    function Ca() {
        ma();
        f.requestAnimationFrame(Ca)
    }

    function Ba() {
        p = f.innerWidth;
        r = f.innerHeight;
        ka.width = A.width = p;
        ka.height = A.height = r;
        ma()
    }

    function Ma() {
        var a;
        a = 1 * Math.max(r / 1080, p / 1920);
        return a *= C
    }

    function Va() {
        if (0 != l.length) {
            for (var a = 0, b = 0; b < l.length; b++) a += l[b].size;
            a = Math.pow(Math.min(64 / a, 1), .4) * Ma();
            var z = (9 * h + a) / 10;
            allow_zoom ? (h=Math.min(h,z)):(h=z);
        }
    }
    
    function Zoom(e) {
        allow_zoom && (h *= 1 + e.wheelDelta / 1e3);
    }
    "onwheel" in document ? document.addEventListener("wheel", Zoom) : "onmousewheel" in document ? document.addEventListener("mousewheel", Zoom) : document.addEventListener("MozMousePixelScroll", Zoom);

    function ma() {
        var a,
            b, c = +new Date;
        ++Wa;
        I = +new Date;
        if (0 < l.length) {
            Va();
            for (var d = a = b = 0; d < l.length; d++) l[d].updatePos(), b += l[d].x / l.length, a += l[d].y / l.length;
            N = b;
            O = a;
            P = h;
            s = (s + b) / 2;
            t = (t + a) / 2
        } else s = (29 * s + N) / 30, t = (29 * t + O) / 30, h = (9 * h + P * Ma()) / 10;
        Qa();
        la();
        ta || e.clearRect(0, 0, p, r);
        if (ta) e.fillStyle = fa ? "#111111" : "#F2FBFF", e.globalAlpha = .05, e.fillRect(0, 0, p, r), e.globalAlpha = 1;
        else {
            e.fillStyle = fa ? "#111111" : "#F2FBFF";
            e.fillRect(0, 0, p, r);
            e.save();
            e.strokeStyle = fa ? "#AAAAAA" : "#000000";
            e.globalAlpha = .2;
            e.scale(h, h);
            b = p / h;
            a = r / h;
            for (d = -.5 + (-s + b / 2) % 50; d < b; d += 50) e.beginPath(), e.moveTo(d, 0), e.lineTo(d, a), e.stroke();
            for (d = -.5 + (-t + a / 2) % 50; d < a; d += 50) e.beginPath(), e.moveTo(0, d), e.lineTo(b, d), e.stroke();
            e.restore()
        }
        n.sort(function(a, b) {
            return a.size == b.size ? a.id - b.id : a.size - b.size
        });
        e.save();
        e.translate(p / 2, r / 2);
        e.scale(h, h);
        e.translate(-s, -t);
        if (show_borders){
            e.strokeStyle = fa ? "#FFFFFF" : "#000000";
            e.beginPath();
            e.moveTo(0, 0), e.lineTo(11180, 0), e.lineTo(11180, 11180), e.lineTo(0, 11180), e.lineTo(0, 0);
            e.stroke();
        }
        for (d = 0; d < G.length; d++) G[d].draw();
        for (d = 0; d < n.length; d++) n[d].draw();
        if (qa) {
            $ = (3 * $ + oa) / 4;
            aa = (3 * aa + pa) / 4;
            e.save();
            e.strokeStyle = "#FFAAAA";
            e.lineWidth = 10;
            e.lineCap = "round";
            e.lineJoin = "round";
            e.globalAlpha =
                .5;
            e.beginPath();
            for (d = 0; d < l.length; d++) e.moveTo(l[d].x, l[d].y), e.lineTo($, aa);
            e.stroke();
            e.restore()
        }
        e.restore();
        v && v.width && e.drawImage(v, p - v.width - 10, 10);
        DrawMinimap(e, l);
        H = Math.max(H, Xa());
        0 != H && (null == ga && (ga = new ha(24, "#FFFFFF")), ga.setValue("Score: " + ~~(H / 100)), a = ga.render(), b = a.width, e.globalAlpha = .2, e.fillStyle = "#000000", e.fillRect(10, r - 10 - 24 - 10, b + 10, 34), e.globalAlpha = 1, e.drawImage(a, 15, r - 10 - 24 - 5));
        Ya();
        c = +new Date - c;
        c > 1E3 / 60 ? x -= .01 : c < 1E3 / 65 && (x += .01);.4 > x && (x = .4);
        1 < x && (x = 1)
    }

    function Ya() {
        if (ya && ua.width) {
            var a = p / 5;
            e.drawImage(ua, 5, 5, a, a)
        }
    }

    function Xa() {
        for (var a = 0, b = 0; b < l.length; b++) a += l[b].nSize * l[b].nSize;
        return a
    }

    function Ia() {
        v = null;
        if (null != w || 0 != z.length)
            if (null != w || ia) {
                v = document.createElement("canvas");
                var a = v.getContext("2d"),
                    b = 60,
                    b = null == w ? b + 24 * z.length : b + 180,
                    c = Math.min(200, .3 * p) / 200;
                v.width = 200 * c;
                v.height = b * c;
                a.scale(c, c);
                a.globalAlpha = .4;
                a.fillStyle = "#000000";
                a.fillRect(0, 0, 200, b);
                a.globalAlpha = 1;
                a.fillStyle = "#FFFFFF";
                c = null;
                c = "Leaderboard";
                a.font = "30px Ubuntu";
                a.fillText(c, 100 - a.measureText(c).width /
                    2, 40);
                if (null == w)
                    for (a.font = "20px Ubuntu", b = 0; b < z.length; ++b) c = z[b].name || "An unnamed cell", ia || (c = "An unnamed cell"), -1 != E.indexOf(z[b].id) ? (l[0].name && (c = l[0].name), a.fillStyle = "#FFAAAA") : a.fillStyle = "#FFFFFF", c = b + 1 + ". " + c, a.fillText(c, 100 - a.measureText(c).width / 2, 70 + 24 * b);
                else
                    for (b = c = 0; b < w.length; ++b) angEnd = c + w[b] * Math.PI * 2, a.fillStyle = Za[b + 1], a.beginPath(), a.moveTo(100, 140), a.arc(100, 140, 80, c, angEnd, !1), a.fill(), c = angEnd
            }
    }

    function Ja(a, b, c, d, e, f) {
        n.push(this);
        y[a] = this;
        this.id = a;
        this.ox = this.x = b;
        this.oy = this.y = c;
        this.oSize = this.size = d;
        this.color = e;
        this.points = [];
        this.pointsAcc = [];
        this.createPoints();
        this.setName(f)
    }

    function ha(a, b, c, d) {
        a && (this._size = a);
        b && (this._color = b);
        this._stroke = !!c;
        d && (this._strokeColor = d)
    }
    var F = f.location.protocol,
        Ga = "https:" == F;
    if ("agar.io" != f.location.hostname && "localhost" != f.location.hostname && "10.10.2.13" != f.location.hostname) f.location = F + "//agar.io/";
    else if (f.top != f) f.top.location = F + "//agar.io/";
    else {
        var ka, e, A, p, r, L = null,
            m = null,
            s = 0,
            t = 0,
            E = [],
            l = [],
            y = {},
            n = [],
            G = [],
            z = [],
            S = 0,
            T = 0,
            W = -1,
            X = -1,
            Wa = 0,
            I = 0,
            D = null,
            ba = 0,
            ca = 0,
            da = 1E4,
            ea = 1E4,
            h = 1,
            u = null,
            Na = !0,
            ia = !0,
            va = !1,
            ra = !1,
            H = 0,
            fa = !1,
            Oa = !0,
            N = s = ~~((ba + da) / 2),
            O = t = ~~((ca + ea) / 2),
            P = 1,
            M = "",
            w = null,
            ja = !1,
            qa = !1,
            oa = 0,
            pa = 0,
            $ = 0,
            aa = 0,
            Q = 0,
            Za = ["#333333", "#FF3333", "#33FF33", "#3333FF"],
            ta = !1,
            C = 1,
            ya = "ontouchstart" in f && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
            ua = new Image;
        ua.src = "img/split.png";
        Q = document.createElement("canvas");
        if ("undefined" == typeof console || "undefined" == typeof DataView ||
            "undefined" == typeof WebSocket || null == Q || null == Q.getContext || null == f.localStorage) alert("You browser does not support this game, we recommend you to use Firefox to play this");
        else {
            var Y = null;
            f.setNick = function(a) {
                Ea();
                D = a;
                Ha();
                H = 0
            };
            f.setRegion = U;
            f.setSkins = function(a) {
                Na = a
            };
            f.setNames = function(a) {
                ia = a
            };
            f.setDarkTheme = function(a) {
                fa = a
            };
            f.setColors = function(a) {
                va = a
            };
            f.setShowMass = function(a) {
                Oa = a
            };
            f.spectate = function() {
                D = null;
                B(1);
                Ea()
            };
            f.setGameMode = function(a) {
                a != M && (M = a, V())
            };
            f.setAcid = function(a) {
                ta = a
            };
            null != f.localStorage && (null == f.localStorage.AB8 && (f.localStorage.AB8 = 0 + ~~(100 * Math.random())), Q = +f.localStorage.AB8, f.ABGroup = Q);
            g.get(F + "//gc.agar.io", function(a) {
                var b = a.split(" ");
                a = b[0];
                b = b[1] || ""; - 1 == "DE IL PL HU BR AT UA".split(" ").indexOf(a) && wa.push("nazi"); - 1 == ["UA"].indexOf(a) && wa.push("ussr");
                R.hasOwnProperty(a) && ("string" == typeof R[a] ? u || U(R[a]) : R[a].hasOwnProperty(b) && (u || U(R[a][b])))
            }, "text");
            setTimeout(function() {}, 3E5);
            var R = {
                AF: "JP-Tokyo",
                AX: "EU-London",
                AL: "EU-London",
                DZ: "EU-London",
                AS: "SG-Singapore",
                AD: "EU-London",
                AO: "EU-London",
                AI: "US-Atlanta",
                AG: "US-Atlanta",
                AR: "BR-Brazil",
                AM: "JP-Tokyo",
                AW: "US-Atlanta",
                AU: "SG-Singapore",
                AT: "EU-London",
                AZ: "JP-Tokyo",
                BS: "US-Atlanta",
                BH: "JP-Tokyo",
                BD: "JP-Tokyo",
                BB: "US-Atlanta",
                BY: "EU-London",
                BE: "EU-London",
                BZ: "US-Atlanta",
                BJ: "EU-London",
                BM: "US-Atlanta",
                BT: "JP-Tokyo",
                BO: "BR-Brazil",
                BQ: "US-Atlanta",
                BA: "EU-London",
                BW: "EU-London",
                BR: "BR-Brazil",
                IO: "JP-Tokyo",
                VG: "US-Atlanta",
                BN: "JP-Tokyo",
                BG: "EU-London",
                BF: "EU-London",
                BI: "EU-London",
                KH: "JP-Tokyo",
                CM: "EU-London",
                CA: "US-Atlanta",
                CV: "EU-London",
                KY: "US-Atlanta",
                CF: "EU-London",
                TD: "EU-London",
                CL: "BR-Brazil",
                CN: "CN-China",
                CX: "JP-Tokyo",
                CC: "JP-Tokyo",
                CO: "BR-Brazil",
                KM: "EU-London",
                CD: "EU-London",
                CG: "EU-London",
                CK: "SG-Singapore",
                CR: "US-Atlanta",
                CI: "EU-London",
                HR: "EU-London",
                CU: "US-Atlanta",
                CW: "US-Atlanta",
                CY: "JP-Tokyo",
                CZ: "EU-London",
                DK: "EU-London",
                DJ: "EU-London",
                DM: "US-Atlanta",
                DO: "US-Atlanta",
                EC: "BR-Brazil",
                EG: "EU-London",
                SV: "US-Atlanta",
                GQ: "EU-London",
                ER: "EU-London",
                EE: "EU-London",
                ET: "EU-London",
                FO: "EU-London",
                FK: "BR-Brazil",
                FJ: "SG-Singapore",
                FI: "EU-London",
                FR: "EU-London",
                GF: "BR-Brazil",
                PF: "SG-Singapore",
                GA: "EU-London",
                GM: "EU-London",
                GE: "JP-Tokyo",
                DE: "EU-London",
                GH: "EU-London",
                GI: "EU-London",
                GR: "EU-London",
                GL: "US-Atlanta",
                GD: "US-Atlanta",
                GP: "US-Atlanta",
                GU: "SG-Singapore",
                GT: "US-Atlanta",
                GG: "EU-London",
                GN: "EU-London",
                GW: "EU-London",
                GY: "BR-Brazil",
                HT: "US-Atlanta",
                VA: "EU-London",
                HN: "US-Atlanta",
                HK: "JP-Tokyo",
                HU: "EU-London",
                IS: "EU-London",
                IN: "JP-Tokyo",
                ID: "JP-Tokyo",
                IR: "JP-Tokyo",
                IQ: "JP-Tokyo",
                IE: "EU-London",
                IM: "EU-London",
                IL: "JP-Tokyo",
                IT: "EU-London",
                JM: "US-Atlanta",
                JP: "JP-Tokyo",
                JE: "EU-London",
                JO: "JP-Tokyo",
                KZ: "JP-Tokyo",
                KE: "EU-London",
                KI: "SG-Singapore",
                KP: "JP-Tokyo",
                KR: "JP-Tokyo",
                KW: "JP-Tokyo",
                KG: "JP-Tokyo",
                LA: "JP-Tokyo",
                LV: "EU-London",
                LB: "JP-Tokyo",
                LS: "EU-London",
                LR: "EU-London",
                LY: "EU-London",
                LI: "EU-London",
                LT: "EU-London",
                LU: "EU-London",
                MO: "JP-Tokyo",
                MK: "EU-London",
                MG: "EU-London",
                MW: "EU-London",
                MY: "JP-Tokyo",
                MV: "JP-Tokyo",
                ML: "EU-London",
                MT: "EU-London",
                MH: "SG-Singapore",
                MQ: "US-Atlanta",
                MR: "EU-London",
                MU: "EU-London",
                YT: "EU-London",
                MX: "US-Atlanta",
                FM: "SG-Singapore",
                MD: "EU-London",
                MC: "EU-London",
                MN: "JP-Tokyo",
                ME: "EU-London",
                MS: "US-Atlanta",
                MA: "EU-London",
                MZ: "EU-London",
                MM: "JP-Tokyo",
                NA: "EU-London",
                NR: "SG-Singapore",
                NP: "JP-Tokyo",
                NL: "EU-London",
                NC: "SG-Singapore",
                NZ: "SG-Singapore",
                NI: "US-Atlanta",
                NE: "EU-London",
                NG: "EU-London",
                NU: "SG-Singapore",
                NF: "SG-Singapore",
                MP: "SG-Singapore",
                NO: "EU-London",
                OM: "JP-Tokyo",
                PK: "JP-Tokyo",
                PW: "SG-Singapore",
                PS: "JP-Tokyo",
                PA: "US-Atlanta",
                PG: "SG-Singapore",
                PY: "BR-Brazil",
                PE: "BR-Brazil",
                PH: "JP-Tokyo",
                PN: "SG-Singapore",
                PL: "EU-London",
                PT: "EU-London",
                PR: "US-Atlanta",
                QA: "JP-Tokyo",
                RE: "EU-London",
                RO: "EU-London",
                RU: "RU-Russia",
                RW: "EU-London",
                BL: "US-Atlanta",
                SH: "EU-London",
                KN: "US-Atlanta",
                LC: "US-Atlanta",
                MF: "US-Atlanta",
                PM: "US-Atlanta",
                VC: "US-Atlanta",
                WS: "SG-Singapore",
                SM: "EU-London",
                ST: "EU-London",
                SA: "EU-London",
                SN: "EU-London",
                RS: "EU-London",
                SC: "EU-London",
                SL: "EU-London",
                SG: "JP-Tokyo",
                SX: "US-Atlanta",
                SK: "EU-London",
                SI: "EU-London",
                SB: "SG-Singapore",
                SO: "EU-London",
                ZA: "EU-London",
                SS: "EU-London",
                ES: "EU-London",
                LK: "JP-Tokyo",
                SD: "EU-London",
                SR: "BR-Brazil",
                SJ: "EU-London",
                SZ: "EU-London",
                SE: "EU-London",
                CH: "EU-London",
                SY: "EU-London",
                TW: "JP-Tokyo",
                TJ: "JP-Tokyo",
                TZ: "EU-London",
                TH: "JP-Tokyo",
                TL: "JP-Tokyo",
                TG: "EU-London",
                TK: "SG-Singapore",
                TO: "SG-Singapore",
                TT: "US-Atlanta",
                TN: "EU-London",
                TR: "TK-Turkey",
                TM: "JP-Tokyo",
                TC: "US-Atlanta",
                TV: "SG-Singapore",
                UG: "EU-London",
                UA: "EU-London",
                AE: "EU-London",
                GB: "EU-London",
                US: {
                    AL: "US-Atlanta",
                    AK: "US-Fremont",
                    AZ: "US-Fremont",
                    AR: "US-Atlanta",
                    CA: "US-Fremont",
                    CO: "US-Fremont",
                    CT: "US-Atlanta",
                    DE: "US-Atlanta",
                    FL: "US-Atlanta",
                    GA: "US-Atlanta",
                    HI: "US-Fremont",
                    ID: "US-Fremont",
                    IL: "US-Atlanta",
                    IN: "US-Atlanta",
                    IA: "US-Atlanta",
                    KS: "US-Atlanta",
                    KY: "US-Atlanta",
                    LA: "US-Atlanta",
                    ME: "US-Atlanta",
                    MD: "US-Atlanta",
                    MA: "US-Atlanta",
                    MI: "US-Atlanta",
                    MN: "US-Fremont",
                    MS: "US-Atlanta",
                    MO: "US-Atlanta",
                    MT: "US-Fremont",
                    NE: "US-Fremont",
                    NV: "US-Fremont",
                    NH: "US-Atlanta",
                    NJ: "US-Atlanta",
                    NM: "US-Fremont",
                    NY: "US-Atlanta",
                    NC: "US-Atlanta",
                    ND: "US-Fremont",
                    OH: "US-Atlanta",
                    OK: "US-Atlanta",
                    OR: "US-Fremont",
                    PA: "US-Atlanta",
                    RI: "US-Atlanta",
                    SC: "US-Atlanta",
                    SD: "US-Fremont",
                    TN: "US-Atlanta",
                    TX: "US-Atlanta",
                    UT: "US-Fremont",
                    VT: "US-Atlanta",
                    VA: "US-Atlanta",
                    WA: "US-Fremont",
                    WV: "US-Atlanta",
                    WI: "US-Atlanta",
                    WY: "US-Fremont",
                    DC: "US-Atlanta",
                    AS: "US-Atlanta",
                    GU: "US-Atlanta",
                    MP: "US-Atlanta",
                    PR: "US-Atlanta",
                    UM: "US-Atlanta",
                    VI: "US-Atlanta"
                },
                UM: "SG-Singapore",
                VI: "US-Atlanta",
                UY: "BR-Brazil",
                UZ: "JP-Tokyo",
                VU: "SG-Singapore",
                VE: "BR-Brazil",
                VN: "JP-Tokyo",
                WF: "SG-Singapore",
                EH: "EU-London",
                YE: "JP-Tokyo",
                ZM: "EU-London",
                ZW: "EU-London"
            };
            f.connect = Fa;
            var Z = 500,
                Ka = -1,
                La = -1,
                v = null,
                x = 1,
                ga = null,
                J = {},
                wa = "poland;usa;china;russia;canada;australia;spain;brazil;germany;ukraine;france;sweden;hitler;north korea;south korea;japan;united kingdom;earth;greece;latvia;lithuania;estonia;finland;norway;cia;maldivas;austria;nigeria;reddit;yaranaika;confederate;9gag;indiana;4chan;italy;bulgaria;tumblr;2ch.hk;hong kong;portugal;jamaica;german empire;mexico;sanik;switzerland;croatia;chile;indonesia;bangladesh;thailand;iran;iraq;peru;moon;botswana;bosnia;netherlands;european union;taiwan;pakistan;hungary;satanist;qing dynasty;matriarchy;patriarchy;feminism;ireland;texas;facepunch;prodota;cambodia;steam;piccolo;ea;india;kc;denmark;quebec;ayy lmao;sealand;bait;tsarist russia;origin;vinesauce;stalin;belgium;luxembourg;stussy;prussia;8ch;argentina;scotland;sir;romania;belarus;wojak;doge;nasa;byzantium;imperial japan;french kingdom;somalia;turkey;mars;pokerface;8;irs;receita federal".split(";"),
                $a = ["8", "nasa"],
                ab = ["m'blob"];
            Ja.prototype = {
                id: 0,
                points: null,
                pointsAcc: null,
                name: null,
                nameCache: null,
                sizeCache: null,
                x: 0,
                y: 0,
                size: 0,
                ox: 0,
                oy: 0,
                oSize: 0,
                nx: 0,
                ny: 0,
                nSize: 0,
                updateTime: 0,
                updateCode: 0,
                drawTime: 0,
                destroyed: !1,
                isVirus: !1,
                isAgitated: !1,
                wasSimpleDrawing: !0,
                destroy: function() {
                    var a;
                    for (a = 0; a < n.length; a++)
                        if (n[a] == this) {
                            n.splice(a, 1);
                            break
                        }
                    delete y[this.id];
                    a = l.indexOf(this); - 1 != a && (ra = !0, l.splice(a, 1));
                    a = E.indexOf(this.id); - 1 != a && E.splice(a, 1);
                    this.destroyed = !0;
                    G.push(this)
                },
                getNameSize: function() {
                    return Math.max(~~(.3 * this.size), 24)
                },
                setName: function(a) {
                    if (this.name = a) null == this.nameCache ? this.nameCache = new ha(this.getNameSize(), "#FFFFFF", !0, "#000000") : this.nameCache.setSize(this.getNameSize()), this.nameCache.setValue(this.name)
                },
                createPoints: function() {
                    for (var a = this.getNumPoints(); this.points.length > a;) {
                        var b = ~~(Math.random() * this.points.length);
                        this.points.splice(b, 1);
                        this.pointsAcc.splice(b, 1)
                    }
                    0 == this.points.length && 0 < a && (this.points.push({
                        c: this,
                        v: this.size,
                        x: this.x,
                        y: this.y
                    }), this.pointsAcc.push(Math.random() - .5));
                    for (; this.points.length < a;) {
                        var b = ~~(Math.random() * this.points.length),
                            c = this.points[b];
                        this.points.splice(b, 0, {
                            c: this,
                            v: c.v,
                            x: c.x,
                            y: c.y
                        });
                        this.pointsAcc.splice(b, 0, this.pointsAcc[b])
                    }
                },
                getNumPoints: function() {
                    var a = 10;
                    20 > this.size && (a = 5);
                    this.isVirus && (a = 30);
                    var b = this.size;
                    this.isVirus || (b *= h);
                    b *= x;
                    return ~~Math.max(b, a)
                },
                movePoints: function() {
                    this.createPoints();
                    for (var a = this.points, b = this.pointsAcc, c = a.length, d = 0; d < c; ++d) {
                        var e = b[(d - 1 + c) % c],
                            f = b[(d + 1) % c];
                        b[d] += (Math.random() - .5) * (this.isAgitated ? 3 : 1);
                        b[d] *= .7;
                        10 < b[d] && (b[d] = 10); - 10 > b[d] && (b[d] = -10);
                        b[d] = (e + f + 8 * b[d]) / 10
                    }
                    for (var h = this, d = 0; d < c; ++d) {
                        var g = a[d].v,
                            e = a[(d - 1 + c) % c].v,
                            f = a[(d + 1) % c].v;
                        if (15 < this.size && null != L) {
                            var l = !1,
                                m = a[d].x,
                                n = a[d].y;
                            L.retrieve2(m - 5, n - 5, 10, 10, function(a) {
                                a.c != h && 25 > (m - a.x) * (m - a.x) + (n - a.y) * (n - a.y) && (l = !0)
                            });
                            !l && (a[d].x < ba || a[d].y < ca || a[d].x > da || a[d].y > ea) && (l = !0);
                            l && (0 < b[d] && (b[d] = 0), b[d] -= 1)
                        }
                        g += b[d];
                        0 > g && (g = 0);
                        g = this.isAgitated ? (19 * g + this.size) / 20 : (12 * g + this.size) / 13;
                        a[d].v = (e + f + 8 * g) / 10;
                        e = 2 * Math.PI / c;
                        f = this.points[d].v;
                        this.isVirus && 0 == d % 2 && (f += 5);
                        a[d].x = this.x + Math.cos(e * d) * f;
                        a[d].y = this.y + Math.sin(e * d) * f
                    }
                },
                updatePos: function() {
                    var a;
                    a = (I - this.updateTime) / 120;
                    a = 0 > a ? 0 : 1 < a ? 1 : a;
                    var b = 0 > a ? 0 : 1 < a ? 1 : a;
                    this.getNameSize();
                    if (this.destroyed && 1 <= b) {
                        var c = G.indexOf(this); - 1 != c && G.splice(c, 1)
                    }
                    this.x = a * (this.nx - this.ox) + this.ox;
                    this.y = a * (this.ny - this.oy) + this.oy;
                    this.size = b * (this.nSize - this.oSize) + this.oSize;
                    return b
                },
                shouldRender: function() {
                    return this.x + this.size + 40 < s - p / 2 / h || this.y + this.size + 40 < t - r / 2 / h || this.x - this.size - 40 >
                        s + p / 2 / h || this.y - this.size - 40 > t + r / 2 / h ? !1 : !0
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
                getTargetColor: function(cells, game_mode){
                    var color = {'fill':this.color, 'stroke':this.color};
                    var mass = this.size * this.size;
                    if (show_targeting_colors && mass > 400) {
                        var is_teams = (":teams" == game_mode);
                        var smallest = Math.min.apply(null, cells.map(function(e) {
                            return e.size*e.size;
                        }));
                        
                        if (this.isVirus || 0 === cells.length){
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
                draw: function() {
                    var color = this.getTargetColor(l, M);
                    if (this.shouldRender()) {
                        var a = !this.isVirus && !this.isAgitated && .35 > h;
                        if (this.wasSimpleDrawing && !a)
                            for (var b = 0; b < this.points.length; b++) this.points[b].v = this.size;
                        this.wasSimpleDrawing = a;
                        e.save();
                        this.drawTime = I;
                        b = this.updatePos();
                        this.destroyed && (e.globalAlpha *= 1 - b);
                        e.lineWidth = 10;
                        e.lineCap = "round";
                        e.lineJoin = this.isVirus ? "mitter" : "round";
                        va ? (e.fillStyle = "#FFFFFF", e.strokeStyle = "#AAAAAA") : (e.fillStyle = color.fill, e.strokeStyle = color.stroke);
                        if (a) e.beginPath(), e.arc(this.x, this.y, this.size, 0, 2 * Math.PI, !1);
                        else {
                            this.movePoints();
                            e.beginPath();
                            var c = this.getNumPoints();
                            e.moveTo(this.points[0].x, this.points[0].y);
                            for (b = 1; b <= c; ++b) {
                                var d = b % c;
                                e.lineTo(this.points[d].x, this.points[d].y)
                            }
                        }
                        e.closePath();
                        c = this.name.toLowerCase();
                        !this.isAgitated && Na && "" == M ? -1 != wa.indexOf(c) ? (J.hasOwnProperty(c) || (J[c] = new Image, J[c].src = "skins/" + c + ".png"), b = 0 != J[c].width && J[c].complete ? J[c] : null) : b = null : b = null;
                        b = (d = b) ? -1 != ab.indexOf(c) : !1;
                        a || e.stroke();
                        e.fill();
                        null == d || b || (e.save(), e.clip(), e.drawImage(d, this.x - this.size, this.y - this.size, 2 * this.size, 2 * this.size), e.restore());
                        (va || 15 < this.size) && !a && (e.strokeStyle = "#000000", e.globalAlpha *= .1, e.stroke());
                        e.globalAlpha = 1;
                        null != d && b && e.drawImage(d, this.x - 2 * this.size, this.y - 2 * this.size, 4 * this.size, 4 * this.size);
                        b = -1 != l.indexOf(this);
                        a = ~~this.y;
                        if ((ia || b) && this.name && this.nameCache && (null == d || -1 == $a.indexOf(c))) {
                            d = this.nameCache;
                            d.setValue(this.name);
                            d.setSize(this.getNameSize());
                            c = Math.ceil(10 * h) / 10;
                            d.setScale(c);
                            var d = d.render(),
                                f = ~~(d.width / c),
                                g = ~~(d.height / c);
                            e.drawImage(d, ~~this.x - ~~(f / 2), a - ~~(g / 2), f, g);
                            a += d.height / 2 / c + 4
                        }
                        Oa && (b || (0 == l.length || show_opponent_size) && 20 < this.size) && (null == this.sizeCache && (this.sizeCache = new ha(this.getNameSize() / 2, "#FFFFFF", !0, "#000000")), b = this.sizeCache, b.setSize(this.getNameSize() / 2), b.setValue(~~(this.size * this.size / 100)), c = Math.ceil(10 * h) / 10, b.setScale(c), d = b.render(), f = ~~(d.width / c), g = ~~(d.height / c), e.drawImage(d, ~~this.x - ~~(f / 2), a - ~~(g / 2), f, g));
                        e.restore()
                    }
                }
            };
            ha.prototype = {
                _value: "",
                _color: "#000000",
                _stroke: !1,
                _strokeColor: "#000000",
                _size: 16,
                _canvas: null,
                _ctx: null,
                _dirty: !1,
                _scale: 1,
                setSize: function(a) {
                    this._size != a && (this._size = a, this._dirty = !0)
                },
                setScale: function(a) {
                    this._scale != a && (this._scale = a, this._dirty = !0)
                },
                setColor: function(a) {
                    this._color != a && (this._color = a, this._dirty = !0)
                },
                setStroke: function(a) {
                    this._stroke != a && (this._stroke = a, this._dirty = !0)
                },
                setStrokeColor: function(a) {
                    this._strokeColor != a && (this._strokeColor = a, this._dirty = !0)
                },
                setValue: function(a) {
                    a != this._value && (this._value = a, this._dirty = !0)
                },
                render: function() {
                    null == this._canvas && (this._canvas = document.createElement("canvas"), this._ctx = this._canvas.getContext("2d"));
                    if (this._dirty) {
                        this._dirty = !1;
                        var a = this._canvas,
                            b = this._ctx,
                            c = this._value,
                            d = this._scale,
                            e = this._size,
                            f = e + "px Ubuntu";
                        b.font = f;
                        var g = b.measureText(c).width,
                            h = ~~(.2 * e);
                        a.width = (g + 6) * d;
                        a.height = (e + h) * d;
                        b.font = f;
                        b.scale(d, d);
                        b.globalAlpha = 1;
                        b.lineWidth = 3;
                        b.strokeStyle = this._strokeColor;
                        b.fillStyle = this._color;
                        this._stroke && b.strokeText(c, 3, e - h / 2);
                        b.fillText(c, 3, e - h / 2)
                    }
                    return this._canvas
                }
            };
            f.onload = Pa
        }
    }
})(window, jQuery);




































// ==UserScript==
// @name         Virus Shortcut
// @version      1.0
// @description  Press F to throw 7 masses instead of 1,for green cells
// @author       Daniel
// @match        http://agar.io/
// @require      https://code.jquery.com/jquery-latest.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/canvasjs/1.4.1/canvas.min.js
// @run-at       document-start
// @grant        none
// @namespace http://your.homepage/
// ==/UserScript==

function pressW() {
	var oEvent = document.createEvent('KeyboardEvent');
	var k = 87;
	// Chromium Hack
	Object.defineProperty(oEvent, 'keyCode', {
	            get : function() {
	                return this.keyCodeVal;
	            }
	});     
	Object.defineProperty(oEvent, 'which', {
	            get : function() {
	                return this.keyCodeVal;
	            }
	});     

	if (oEvent.initKeyboardEvent) {
	    oEvent.initKeyboardEvent("keydown", true, true, document.defaultView, false, false, false, false, k, k);
	} else {
	    oEvent.initKeyEvent("keydown", true, true, document.defaultView, false, false, false, false, k, 0);
	}

	oEvent.keyCodeVal = k;

	if (oEvent.keyCode !== k) {
	    console.log("keyCode mismatch " + oEvent.keyCode + "(" + oEvent.which + ")");
	}
	document.dispatchEvent(oEvent);

	var oEvent = document.createEvent('KeyboardEvent');
	// Chromium Hack
	Object.defineProperty(oEvent, 'keyCode', {
	            get : function() {
	                return this.keyCodeVal;
	            }
	});     
	Object.defineProperty(oEvent, 'which', {
	            get : function() {
	                return this.keyCodeVal;
	            }
	});     

	if (oEvent.initKeyboardEvent) {
	    oEvent.initKeyboardEvent("keyup", true, true, document.defaultView, false, false, false, false, k, k);
	} else {
	    oEvent.initKeyEvent("keyup", true, true, document.defaultView, false, false, false, false, k, 0);
	}

	oEvent.keyCodeVal = k;

	if (oEvent.keyCode !== k) {
	    console.log("keyCode mismatch " + oEvent.keyCode + "(" + oEvent.which + ")");
	}	
	document.dispatchEvent(oEvent);
}
window.pressW = pressW;
document.onkeypress = function(e) {
	e = e || window.event;
	if (e.keyCode == 102) {
		for (var i = 0; i<7; i++) {
			setTimeout(pressW, i * 80);
		}
	} else if (e.keyCode == 103) {
		for (var i = 0; i<50; i++) {
			setTimeout(pressW, i * 40);
		}
	} else if (e.keyCode == 104) {
		for (var i = 0; i<400; i++) {
			setTimeout(pressW, i * 5);
		}
	}
}




























/ ==UserScript==
// @name        AgarBot
// @namespace   Apos
// @description Plays Agar
// @include     http://agar.io/
// @version     1
// @grant       none
// @author      twitch.tv/apostolique
// @run-at document-start
// ==/UserScript==


var changed = 0; // script need to be edited with

window.addEventListener('beforescriptexecute', function (e) {

	//for external script:
	src = e.target.src;
	if (src.search(/main_out\.js..../) != -1) {
		console.log('event listener fired, main_out found');
		changed++;
		e.preventDefault();
		e.stopPropagation();
		append(main_out);
		//init();
	};

	//when done, remove the listener:
	if (changed == 1)
		window.removeEventListener(e.type, arguments.callee, true);

}, true);

////// append with new block function:
function append(s) {
	console.log('append fired');
	document.head.appendChild(document.createElement('script'))
	.innerHTML = s.toString().replace(/^function.*{|}$/g, '');
}

////////////////////////////////////////////////
function main_out() {
(function (g, q) {
  function wa() {
    ha();
    setInterval(ha, 180000);
    z = $ = document.getElementById('canvas');
    d = z.getContext('2d');
    z.onmousedown = function (a) {
      if (ia) {
        var b = a.clientX - (5 + l / 5 / 2),
        c = a.clientY - (5 + l / 5 / 2);
        if (Math.sqrt(b * b + c * c) <= l / 5 / 2) {
          E();
          A(17);
          return
        }
      }
      N = a.clientX;
      O = a.clientY;
      aa();
      E()
    };
    z.onmousemove = function (a) {
      N = a.clientX;
      O = a.clientY;
      aa()
    };
    z.onmouseup = function (a) {
    };
    var a = !1,
    b = !1,
    c = !1;
    g.onkeydown = function (e) {
      32 != e.keyCode || a || (E(), A(17), a = !0);
      81 != e.keyCode || b || (A(18), b = !0);
      87 != e.keyCode || c || (E(), A(21), c = !0);
      27 == e.keyCode && q('#overlays').fadeIn(200)
      
      if (84 == e.keyCode) {
        console.log("Toggle");
        toggle = !toggle;
      }
      if (82 == e.keyCode) {
        console.log("ToggleDraw");
        toggleDraw = !toggleDraw;
      }
    };
    g.onkeyup = function (e) {
      32 == e.keyCode && (a = !1);
      87 == e.keyCode && (c = !1);
      81 == e.keyCode && b && (A(19), b = !1)
    };
    g.onblur = function () {
      A(19);
      c = b = a = !1
    };
    g.onresize = ja;
    ja();
    g.requestAnimationFrame ? g.requestAnimationFrame(ka)  : setInterval(ba, 1000 / 60);
    setInterval(E, 40);
    la(q('#region').val());
    q('#overlays').show()
  }
  function xa() {
    if (0.5 > k) F = null;
     else {
      for (var a = Number.POSITIVE_INFINITY, b = Number.POSITIVE_INFINITY, c = Number.NEGATIVE_INFINITY, e = Number.NEGATIVE_INFINITY, d = 0, f = 0; f < p.length; f++) p[f].shouldRender() && (d = Math.max(p[f].size, d), a = Math.min(p[f].x, a), b = Math.min(p[f].y, b), c = Math.max(p[f].x, c), e = Math.max(p[f].y, e));
      F = QUAD.init({
        minX: a - (d + 100),
        minY: b - (d + 100),
        maxX: c + (d + 100),
        maxY: e + (d + 100)
      });
      for (f = 0; f < p.length; f++) if (a = p[f], a.shouldRender()) for (b = 0; b < a.points.length; ++b) F.insert(a.points[b])
    }
  }
  function aa() {
    P = (N - l / 2) / k + s;
    Q = (O - r / 2) / k + t
  }
  function ha() {
    null == R && (R = {
    }, q('#region').children().each(function () {
      var a = q(this),
      b = a.val();
      b && (R[b] = a.text())
    }));
    q.get('http://m.agar.io/info', function (a) {
      var b = {
      },
      c;
      for (c in a.regions) {
        var e =
        c.split(':') [0];
        b[e] = b[e] || 0;
        b[e] += a.regions[c].numPlayers
      }
      for (c in b) q('#region option[value="' + c + '"]').text(R[c] + ' (' + b[c] + ' players)')
    }, 'json')
  }
  function ma() {
    q('#adsBottom').hide();
    q('#overlays').hide()
  }
  function la(a) {
    a && a != G && (G = a, ca())
  }
  function na() {
    console.log('Find ' + G + H);
    q.ajax('http://m.agar.io/', {
      error: function () {
        setTimeout(na, 1000)
      },
      success: function (a) {
        a = a.split('\n');
        oa('ws://' + a[0])
      },
      dataType: 'text',
      method: 'POST',
      cache: !1,
      crossDomain: !0,
      data: G + H || '?'
    })
  }
  function ca() {
    G && (q('#connecting').show(), na())
  }
  function oa(a) {
    h && (h.onopen = null, h.onmessage = null, h.onclose = null, h.close(), h = null);
    B = [
    ];
    m = [
    ];
    v = {
    };
    p = [
    ];
    C = [
    ];
    w = [
    ];
    x = null;
    console.log('Connecting to ' + a);
    h = new WebSocket(a);
    h.binaryType = 'arraybuffer';
    h.onopen = ya;
    h.onmessage = za;
    h.onclose = Aa;
    h.onerror = function () {
      console.log('socket error')
    }
  }
  function ya(a) {
    q('#connecting').hide();
    console.log('socket open');
    a = new ArrayBuffer(5);
    var b = new DataView(a);
    b.setUint8(0, 254);
    b.setUint32(1, 1, !0);
    h.send(a);
    a = new ArrayBuffer(5);
    b = new DataView(a);
    b.setUint8(0, 255);
    b.setUint32(1, 1, !0);
    h.send(a);
    pa()
  }
  function Aa(a) {
    console.log('socket close');
    setTimeout(ca, 500)
  }
  function za(a) {
    function b() {
      for (var a = ''; ; ) {
        var b = e.getUint16(c, !0);
        c += 2;
        if (0 == b) break;
        a += String.fromCharCode(b)
      }
      return a
    }
    var c = 1,
    e = new DataView(a.data);
    switch (e.getUint8(0)) {
      case 16:
        Ba(e);
        break;
      case 17:
        I = e.getFloat32(1, !0);
        J = e.getFloat32(5, !0);
        K = e.getFloat32(9, !0);
        break;
      case 20:
        m = [
        ];
        B = [
        ];
        break;
      case 32:
        B.push(e.getUint32(1, !0));
        break;
      case 49:
        if (null != x) break;
        a = e.getUint32(c, !0);
        c += 4;
        w = [
        ];
        for (var d = 0; d < a; ++d) {
          var f = e.getUint32(c, !0),
          c = c + 4;
          w.push({
            id: f,
            name: b()
          })
        }
        qa();
        break;
      case 50:
        x = [
        ];
        a = e.getUint32(c, !0);
        c += 4;
        for (d = 0; d < a; ++d) x.push(e.getFloat32(c, !0)),
        c += 4;
        qa();
        break;
      case 64:
        S = e.getFloat64(1, !0),
        T = e.getFloat64(9, !0),
        U = e.getFloat64(17, !0),
        V = e.getFloat64(25, !0),
        I = (U + S) / 2,
        J = (V + T) / 2,
        K = 1,
        0 == m.length && (s = I, t = J, k = K)
    }
  }
  function Ba(a) {
    D = + new Date;
    var b = Math.random(),
    c = 1;
    da = !1;
    for (var e = a.getUint16(c, !0), c = c + 2, d = 0; d < e; ++d) {
      var f = v[a.getUint32(c, !0)],
      g = v[a.getUint32(c + 4, !0)],
      c = c + 8;
      f && g && (g.destroy(), g.ox =
      g.x, g.oy = g.y, g.oSize = g.size, g.nx = f.x, g.ny = f.y, g.nSize = g.size, g.updateTime = D)
    }
    for (; ; ) {
      e = a.getUint32(c, !0);
      c += 4;
      if (0 == e) break;
      for (var d = a.getFloat32(c, !0), c = c + 4, f = a.getFloat32(c, !0), c = c + 4, g = a.getFloat32(c, !0), c = c + 4, h = a.getUint8(c++), k = a.getUint8(c++), l = a.getUint8(c++), h = (h << 16 | k << 8 | l).toString(16); 6 > h.length; ) h = '0' + h;
      h = '#' + h;
      l = a.getUint8(c++);
      k = !!(l & 1);
      l & 2 && (c += 4);
      l & 4 && (c += 8);
      l & 8 && (c += 16);
      for (l = ''; ; ) {
        var n = a.getUint16(c, !0),
        c = c + 2;
        if (0 == n) break;
        l += String.fromCharCode(n)
      }
      n = null;
      v.hasOwnProperty(e) ? (n = v[e], n.updatePos(), n.ox = n.x, n.oy = n.y, n.oSize = n.size, n.color = h)  : (n = new ra(e, d, f, g, h, k, l), n.pX = d, n.pY = f);
      n.nx = d;
      n.ny = f;
      n.nSize = g;
      n.updateCode = b;
      n.updateTime = D;
      - 1 != B.indexOf(e) && - 1 == m.indexOf(n) && (document.getElementById('overlays').style.display = 'none', m.push(n), 1 == m.length && (s = n.x, t = n.y))
    }
    a.getUint16(c, !0);
    c += 2;
    f = a.getUint32(c, !0);
    c += 4;
    for (d = 0; d < f; d++) e = a.getUint32(c, !0),
    c += 4,
    v[e] && (v[e].updateCode = b);
    for (d = 0; d < p.length; d++) p[d].updateCode != b && p[d--].destroy();
    da && 0 == m.length && q('#overlays').fadeIn(3000) && setNick(originalName)
  }
  
    function computeDistance(x1, y1, x2, y2) {
        var xdis = x1 - x2; // <--- FAKE AmS OF COURSE!
        var ydis = y1 - y2;
        var distance = Math.sqrt(Math.pow(xdis, 2)  + Math.pow(ydis, 2));
        
        return distance;
    }

    function computerDistanceFromCircleEdge(x1, y1, x2, y2, s2) {
        var tempD = computeDistance(x2, y2, x1, y1);
        
        var offsetX = 0;
        var offsetY = 0;
        
        var ratioX =  tempD / (x2 - x1);
        var ratioY =  tempD / (y2 - y1);

        offsetX = x2 - (s2 / ratioX);
        offsetY = y2 - (s2 / ratioY);
        
        return computeDistance(x1, y1, offsetX, offsetY);
    }

    function getListmasedOnFunction(booleanFunction, listToUse) {
        var dotList = [];
        Object.keys(listToUse).forEach(function (element, index) {
            if (booleanFunction(element)){
                dotList.push(v[element]);
            }
        });
        
        return dotList;
    }

    //TODO: Make it only go to a virus if it's big enough. If it shrinks, it shouldn't only grab a single dot and go back in.
    function getAllNiceViruses() {
        var dotList = [];
        
        if (m.length == 1) {
            dotList = getListmasedOnFunction(function (element){
                if (v[element].isVirus && (v[element].size *1.10 <= m[0].size) && v[element].size * 1.15 >= m[0].size) {
                        return true;
                }
                return false;
            }, v);
        }

        
        return dotList;
    }

    function getAllThreats() {
        var dotList = [];
        
        dotList = getListmasedOnFunction(function (element){
            var isMe = false;
            
            for (var i = 0; i < m.length; i++) {
                if (v[element].id == m[i].id) {
                    isMe = true;
                    break;
                }
            }
            
            for (var i = 0; i < m.length; i++) {
                if (!isMe && (!v[element].isVirus && (v[element].size >= m[i].oSize * 1.15))) {
                    return true;
                } else if (v[element].isVirus && (v[element].size * 1.15 <= m[i].oSize)) {
                    return true;
                }
                return false;
            }
        }, v);
        
        return dotList;
    }

    function getAllFood() {
        var elementList = [];
        var dotList = [];
        
        elementList = getListmasedOnFunction(function (element){
            var isMe = false;
            
            for (var i = 0; i < m.length; i++) {
                if (v[element].id == m[i].id) {
                    isMe = true;
                    break;
                }
            }
            
            for (var i = 0; i < m.length; i++) {
                if (!isMe && !v[element].isVirus && (v[element].size * 1.25 <= m[i].size)  || (v[element].size <= 11)){return true;} else{return false;}
            }
        }, v);
        
        for (var i = 0; i < elementList.length; i++) {
            dotList.push([elementList[i].x, elementList[i].y, elementList[i].size]);
        }
        
        return dotList;
    }

    function clusterFood(foodList, blobSize) {
        var clusters = [];
        var addedCluster = false;
        for (var i = 0; i < foodList.length; i++) {
            for (var j = 0; j < clusters.length; j++) {
                if (computeDistance(foodList[i][0], foodList[i][1], clusters[j][0], clusters[j][1]) < blobSize * 1.5) {
                    clusters[j][0] = (foodList[i][0] + clusters[j][0]) / 2;
                    clusters[j][1] = (foodList[i][1] + clusters[j][1]) / 2;
                    clusters[j][2] += foodList[i][2];
                    addedCluster = true;
                    break;
                }
            }
            if (!addedCluster) {
                clusters.push([foodList[i][0], foodList[i][1], foodList[i][2]]);
            }
            addedCluster = false;
        }
        return clusters;
    }

    //Given two points on a line, finds the slope of a perpendicular line crossing it.
    function inverseSlope(x1, y1, x2, y2) {
        var m = (y1 - y2) / (x1 - x2);
        return (-1) / m;
    }

    //Given a slope and an offset, returns two points on that line.
    function pointsOnLine(slope, useX, useY) {
        
        var b = useY - slope * useX;
        
        return [[useX - 100, slope * (useX - 100) + b], [useX + 100, slope * (useX + 100) + b]];
    }

    //Using a line formed from point a to b, tells if point c is on S side of that line.
    function isSideLine(a, b, c) {
        if ((b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]) > 0) {
            return true;
        }
        return false;
    }

    function findDestination() {
        dPoints = [];
        lines = [];
        
        var tempMoveX = P;
        var tempMoveY = Q;
        
        if (m[0] != null) {
            var allPossibleFood = null;
            allPossibleFood = getAllFood(); // #1
            
            /*for (var i = -1000; i < 1000; i += m[0].size) {
                for (var j = -1000; j < 1000; j += m[0].size) {
                    allPossibleFood.push([m[0].x + i, m[0].y + j, -200]);
                }
            }*/
            
            var allPossibleThreats = getAllThreats();
            
            var allPossibleNiceViruses = getAllNiceViruses();
            var closestNiceViruse = null;
            if (allPossibleNiceViruses.length != 0) {
                closestNiceViruse = [allPossibleNiceViruses[0], computeDistance(allPossibleNiceViruses[0].x, allPossibleNiceViruses[0].y, m[0].x, m[0].y)];
            
                for (var i = 1; i < allPossibleNiceViruses.length; i++) {
                    var testD = computeDistance(allPossibleNiceViruses[i].x, allPossibleNiceViruses[i].y, m[0].x, m[0].y)
                    if (testD < closestNiceViruse[1]) {
                        closestNiceViruse = [allPossibleNiceViruses[i], testD];
                    }
                }
                
                console.log("NO WAY!!! LET THE TROLLING mEGIN!");
            }
            
            var allThreatLines = [];
            var allThreatLinesmool = [];
            var allFallbackPointsLeft = [];
            var allFallbackPointsRight = [];
            var allFallbackmool = [];
            var allFallbackCount = [];
            
            var closestThreatIndex = null;
            var closestThreatD = null;
            var closestThreatIndex2 = null;
            var closestThreatD2 = null;
            
            var isSafeSpot = true;
            
            var clusterAllFood = clusterFood(allPossibleFood, m[0].oSize);
            
            for (var i = 0; i < allPossibleThreats.length; i++) {
                var tempD = computerDistanceFromCircleEdge(m[0].x, m[0].y, allPossibleThreats[i].x, allPossibleThreats[i].y, allPossibleThreats[i].size);
                
                if (closestThreatIndex != null) {
                    if (closestThreatD > tempD) {
                        closestThreatIndex2 = closestThreatIndex;
                        closestThreatD2 = closestThreatD;
                        closestThreatIndex = i;
                        closestThreatD = tempD;
                    }
                } else {
                    closestThreatIndex = i;
                    closestThreatD = tempD;
                }
                
                var ratioX =  tempD / (allPossibleThreats[i].x - m[0].x);
                var ratioY =  tempD / (allPossibleThreats[i].y - m[0].y);
                
                var offsetX = 0;
                var offsetY = 0;
                
                var offsetEscapeX = 0;
                var offsetEscapeY = 0;
                
                var offsetLeftX = 0;
                var offsetLeftY = 0;

                var offsetRightX = 0;
                var offsetRightY = 0;
                
                var offsetEscapeLeftX = 0;
                var offsetEscapeLeftY = 0;

                var offsetEscapeRightX = 0;
                var offsetEscapeRightY = 0;
                
                var escape = 5;
                var escapeMid = 3;
                
                iSlope = inverseSlope(allPossibleThreats[i].x, allPossibleThreats[i].y, m[0].x, m[0].y);
                
                var sidePoints = pointsOnLine(iSlope, allPossibleThreats[i].x, allPossibleThreats[i].y);
                
                var SD = computeDistance(allPossibleThreats[i].x, allPossibleThreats[i].y, sidePoints[0][0], sidePoints[0][1]);

                var ratioLeftX = SD / (allPossibleThreats[i].x - sidePoints[0][0]);
                var ratioLeftY = SD / (allPossibleThreats[i].y - sidePoints[0][1]);
                
                if (allPossibleThreats[i].size >= m[0].size * 4) {
                    offsetX = allPossibleThreats[i].x - (allPossibleThreats[i].size / ratioX * 1.5);
                    offsetY = allPossibleThreats[i].y - (allPossibleThreats[i].size / ratioY * 1.5);
                    
                    offsetLeftX = allPossibleThreats[i].x - (allPossibleThreats[i].size / ratioLeftX * 3);
                    offsetLeftY = allPossibleThreats[i].y - (allPossibleThreats[i].size / ratioLeftY * 3);
                    
                    offsetRightX = allPossibleThreats[i].x + (allPossibleThreats[i].size / ratioLeftX * 3);
                    offsetRightY = allPossibleThreats[i].y + (allPossibleThreats[i].size / ratioLeftY * 3);
                    
                    offsetEscapeX = allPossibleThreats[i].x - (allPossibleThreats[i].size / ratioX * escape);
                    offsetEscapeY = allPossibleThreats[i].y - (allPossibleThreats[i].size / ratioY * escape);
                    
                    offsetEscapeLeftX = offsetEscapeX - (allPossibleThreats[i].size / ratioLeftX * escapeMid);
                    offsetEscapeLeftY = offsetEscapeY - (allPossibleThreats[i].size / ratioLeftY * escapeMid);

                    offsetEscapeRightX = offsetEscapeX + (allPossibleThreats[i].size / ratioLeftX * escapeMid);
                    offsetEscapeRightY = offsetEscapeY + (allPossibleThreats[i].size / ratioLeftY * escapeMid);
                    
                } else if (allPossibleThreats[i].size >= m[0].size * 2.1) {
                    offsetX = allPossibleThreats[i].x - (allPossibleThreats[i].size / ratioX * 4);
                    offsetY = allPossibleThreats[i].y - (allPossibleThreats[i].size / ratioY * 4);
                    
                    offsetLeftX = allPossibleThreats[i].x - (allPossibleThreats[i].size / ratioLeftX * 4);
                    offsetLeftY = allPossibleThreats[i].y - (allPossibleThreats[i].size / ratioLeftY * 4);
                    
                    offsetRightX = allPossibleThreats[i].x + (allPossibleThreats[i].size / ratioLeftX * 4);
                    offsetRightY = allPossibleThreats[i].y + (allPossibleThreats[i].size / ratioLeftY * 4);
                    
                    offsetEscapeX = allPossibleThreats[i].x - (allPossibleThreats[i].size / ratioX * escape);
                    offsetEscapeY = allPossibleThreats[i].y - (allPossibleThreats[i].size / ratioY * escape);
                    
                    offsetEscapeLeftX = offsetEscapeX - (allPossibleThreats[i].size / ratioLeftX * escapeMid);
                    offsetEscapeLeftY = offsetEscapeY - (allPossibleThreats[i].size / ratioLeftY * escapeMid);

                    offsetEscapeRightX = offsetEscapeX + (allPossibleThreats[i].size / ratioLeftX * escapeMid);
                    offsetEscapeRightY = offsetEscapeY + (allPossibleThreats[i].size / ratioLeftY * escapeMid);
                } else {
                    offsetX = allPossibleThreats[i].x - (allPossibleThreats[i].size / ratioX * 1);
                    offsetY = allPossibleThreats[i].y - (allPossibleThreats[i].size / ratioY * 1);
                    
                    offsetLeftX = allPossibleThreats[i].x - (allPossibleThreats[i].size / ratioLeftX * 3);
                    offsetLeftY = allPossibleThreats[i].y - (allPossibleThreats[i].size / ratioLeftY * 3);
                    
                    offsetRightX = allPossibleThreats[i].x + (allPossibleThreats[i].size / ratioLeftX * 3);
                    offsetRightY = allPossibleThreats[i].y + (allPossibleThreats[i].size / ratioLeftY * 3);
                    
                    offsetEscapeX = allPossibleThreats[i].x - (allPossibleThreats[i].size / ratioX * escape);
                    offsetEscapeY = allPossibleThreats[i].y - (allPossibleThreats[i].size / ratioY * escape);
                    
                    offsetEscapeLeftX = offsetEscapeX - (allPossibleThreats[i].size / ratioLeftX * escapeMid);
                    offsetEscapeLeftY = offsetEscapeY - (allPossibleThreats[i].size / ratioLeftY * escapeMid);

                    offsetEscapeRightX = offsetEscapeX + (allPossibleThreats[i].size / ratioLeftX * escapeMid);
                    offsetEscapeRightY = offsetEscapeY + (allPossibleThreats[i].size / ratioLeftY * escapeMid);
                }
                
                if (m[0].x < allPossibleThreats[i].x && m[0].y > allPossibleThreats[i].y) {
                    var c = offsetRightX;
                    offsetRightX = offsetLeftX;
                    offsetLeftX = c;

                    var d = offsetRightY;
                    offsetRightY = offsetLeftY;
                    offsetLeftY = d;
                    
                    var e = offsetEscapeRightX;
                    offsetEscapeRightX = offsetEscapeLeftX;
                    offsetEscapeLeftX = e;

                    var f = offsetEscapeRightY;
                    offsetEscapeRightY = offsetEscapeLeftY;
                    offsetEscapeLeftY = f;
                    //console.log("Swap");
                } else if (m[0].x > allPossibleThreats[i].x && m[0].y > allPossibleThreats[i].y)
                {
                    var c = offsetRightX;
                    offsetRightX = offsetLeftX;
                    offsetLeftX = c;

                    var d = offsetRightY;
                    offsetRightY = offsetLeftY;
                    offsetLeftY = d;
                    
                    var e = offsetEscapeRightX;
                    offsetEscapeRightX = offsetEscapeLeftX;
                    offsetEscapeLeftX = e;

                    var f = offsetEscapeRightY;
                    offsetEscapeRightY = offsetEscapeLeftY;
                    offsetEscapeLeftY = f;
                    //console.log("Swap");
                }
                
                //offsetX = ((allPossibleThreats[i].x + m[0].x) / 2);
                //offsetY = ((allPossibleThreats[i].y + m[0].y) / 2);

                drawPoint(offsetX, offsetY, 2);
                
                drawPoint(offsetLeftX, offsetLeftY, 3);
                drawPoint(offsetRightX, offsetRightY, 3);
                
                var SSlope = inverseSlope(allPossibleThreats[i].x, allPossibleThreats[i].y, sidePoints[0][0], sidePoints[0][1]);
                
                threatLineLeft = [[offsetLeftX, offsetLeftY], [offsetX, offsetY]];
                threatLineRight = [[offsetRightX, offsetRightY], [offsetX, offsetY]];
                
                threatLine = pointsOnLine(iSlope, offsetX, offsetY);
                
                drawLine(allPossibleThreats[i].x, allPossibleThreats[i].y, m[0].x, m[0].y, 3);
                
                //drawLine(threatLine[0][0], threatLine[0][1], threatLine[1][0], threatLine[1][1], 0);
                
                drawLine(threatLineLeft[0][0], threatLineLeft[0][1], threatLineLeft[1][0], threatLineLeft[1][1], 0);
                drawLine(threatLineRight[0][0], threatLineRight[0][1], threatLineRight[1][0], threatLineRight[1][1], 0);
                
                allThreatLines.push([threatLineLeft, threatLineRight]);
                
                drawPoint(offsetEscapeLeftX, offsetEscapeLeftY, 4);
                drawPoint(offsetEscapeRightX, offsetEscapeRightY, 4);
                //drawPoint(offsetEscapeX, offsetEscapeY, 4);
                
                //allFallbackPoints.push([offsetEscapeX, offsetEscapeY]);
                allFallbackPointsLeft.push([offsetEscapeLeftX, offsetEscapeLeftY]);
                allFallbackPointsRight.push([offsetEscapeRightX, offsetEscapeRightY]);
                //allFallbackPoints.push([offsetEscapeRightX, offsetEscapeRightY]);
                
                allFallbackmool.push(true);
                //allFallbackmool.push(true);
                
                allFallbackCount.push(0);
                //allFallbackCount.push(0);
                
                var badSide = isSideLine(threatLine[0], threatLine[1], [allPossibleThreats[i].x, allPossibleThreats[i].y]);
                
                var badSideLeft = isSideLine(threatLineLeft[0], threatLineLeft[1], [allPossibleThreats[i].x, allPossibleThreats[i].y]);
                var badSideRight = isSideLine(threatLineRight[0], threatLineRight[1], [allPossibleThreats[i].x, allPossibleThreats[i].y]);
                
                allThreatLinesmool.push([badSideLeft, badSideRight]);
                
                isSafeSpot = (
                        badSideLeft != isSideLine(threatLineLeft[0], threatLineLeft[1], [m[0].x, m[0].y]) &&
                        badSideRight != isSideLine(threatLineRight[0], threatLineRight[1], [m[0].x, m[0].y]) && isSafeSpot
                );
                
                var removeClusterList = [];
                
                for (var j = 0; j < clusterAllFood.length; j++) {
                    if (
                        badSideLeft == isSideLine(threatLineLeft[0], threatLineLeft[1], [clusterAllFood[j][0], clusterAllFood[j][1]]) &&
                        badSideRight == isSideLine(threatLineRight[0], threatLineRight[1], [clusterAllFood[j][0], clusterAllFood[j][1]])
                    ) {
                        removeClusterList.push(j);
                    }
                }
                for (var j = removeClusterList.length - 1; j >= 0; j--) {
                    if (!toggle) {
                        drawPoint(clusterAllFood[j][0], clusterAllFood[j][1], 0);
                    }
                    clusterAllFood.splice(removeClusterList[j], 1);
                }
                
                if (
                    badSideLeft == isSideLine(threatLineLeft[0], threatLineLeft[1], [tempPoint[0], tempPoint[1]]) &&
                    badSideRight == isSideLine(threatLineRight[0], threatLineRight[1], [tempPoint[0], tempPoint[1]])
                ) {
                    tempPoint[2] = 0;
                } 
            }
            
            for (var i = 0; i < clusterAllFood.length; i++) {
                //console.log("mefore: " + clusterAllFood[i][2]);
                clusterAllFood[i][2] = clusterAllFood[i][2] * 6 - computeDistance(clusterAllFood[i][0], clusterAllFood[i][1], m[0].ox, m[0].oy);
                if (!toggle) {
                    drawPoint(clusterAllFood[i][0], clusterAllFood[i][1], 1);
                }
                //console.log("After: " + clusterAllFood[i][2]);
            }
            
            if (clusterAllFood.length != 0 && isSafeSpot) {
                biggestCluster = clusterAllFood[0];
                for (var i = 1; i < clusterAllFood.length; i++) {
                    if (clusterAllFood[i][2] > biggestCluster[2]) {
                        biggestCluster = clusterAllFood[i];
                    }
                }
                
                /**
                 * #1 Get a list of all the food.
                 * #2 Get a list of all the threats.
                 * #3 Remove all the food near threats.
                 * #4 Find closest food after the filter.
                 */
                
                if (closestNiceViruse != null && closestNiceViruse[0].size * 1.15 <= m[0].size) {
                    for (var i = 0; i < m.length; i++) {
                        drawLine(m[i].ox, m[i].oy, closestNiceViruse[0].x, closestNiceViruse[0].y, 5);
                    }
                    
                    virusmait = true;
     
                    tempMoveX = closestNiceViruse[0].x;
                    tempMoveY = closestNiceViruse[0].y;
                } else {
                    for (var i = 0; i < m.length; i++) {
                        drawLine(m[i].ox, m[i].oy, biggestCluster[0], biggestCluster[1], 1);
                    }
                    
                    virusmait = false;
     
                    tempMoveX = biggestCluster[0];
                    tempMoveY = biggestCluster[1];
                    //console.log("Moving");
                }
                
                //console.log("X: " + P + " Y: " + Q);
                
                if (!toggle) {
                  if (m.length > 1 && splitted) {
                      splitted = false;
                      tempMoveX = biggestCluster[0];
                      tempMoveY = biggestCluster[1];
                  }
                  if (splitting) {
                      tempMoveX = biggestCluster[0];
                      tempMoveY = biggestCluster[1];
                      A(17);
                      splitting = false;
                      splitted = true;
                  }
                  
                  if (biggestCluster[2] * 2.5 < m[0].size && biggestCluster[2] > m[0].size / 5 &&  biggestCluster[2] > 11 && !splitted && !splitting) {
                      drawLine(m[0].x, m[0].y, biggestCluster[0], biggestCluster[1], 4);
                      
                      var worthyTargetDistance = computeDistance(m[0].x, m[0].y, biggestCluster[0], biggestCluster[1]);
                      
                      console.log("I want to split.");
                      
                      if ((worthyTargetDistance < m[0].size * 3) && m.length == 1) {
                          tempMoveX = biggestCluster[0];
                          tempMoveY = biggestCluster[1];
                          splitting = true;
                      }
                  }
                }
                
            } else if (!virusmait) {
                //console.log("I'm lost, where do I go?");
                
                /*if (closestThreatIndex2 != null) {
                    if (allPossibleThreats[closestThreatIndex].x < allPossibleThreats[closestThreatIndex2].x && allPossibleThreats[closestThreatIndex].y < allPossibleThreats[closestThreatIndex2].y) {
                        tempMoveX = allFallbackPointsLeft[closestThreatIndex][0];
                        tempMoveY = allFallbackPointsLeft[closestThreatIndex][1];
                    } else if (allPossibleThreats[closestThreatIndex].x > allPossibleThreats[closestThreatIndex2].x && allPossibleThreats[closestThreatIndex].y < allPossibleThreats[closestThreatIndex2].y) {
                        tempMoveX = allFallbackPointsRight[closestThreatIndex][0];
                        tempMoveY = allFallbackPointsRight[closestThreatIndex][1];
                    } else if (allPossibleThreats[closestThreatIndex].x < allPossibleThreats[closestThreatIndex2].x && allPossibleThreats[closestThreatIndex].y > allPossibleThreats[closestThreatIndex2].y) {
                        tempMoveX = allFallbackPointsRight[closestThreatIndex][0];
                        tempMoveY = allFallbackPointsRight[closestThreatIndex][1];
                    } else if (allPossibleThreats[closestThreatIndex].x > allPossibleThreats[closestThreatIndex2].x && allPossibleThreats[closestThreatIndex].y > allPossibleThreats[closestThreatIndex2].y) {
                        tempMoveX = allFallbackPointsLeft[closestThreatIndex][0];
                        tempMoveY = allFallbackPointsLeft[closestThreatIndex][1];
                    } else {
                        console.log("Hmm, WTF!!!");
                    }
                } else {
                    tempMoveX = allFallbackPointsLeft[closestThreatIndex][0];
                    tempMoveY = allFallbackPointsLeft[closestThreatIndex][1];
                }*/
                tempMoveX = allFallbackPointsLeft[closestThreatIndex][0];
                tempMoveY = allFallbackPointsLeft[closestThreatIndex][1];
                
                if (tempMoveX < S || tempMoveX > U) {
                    tempMoveX = allFallbackPointsRight[closestThreatIndex][0];
                    tempMoveY = allFallbackPointsRight[closestThreatIndex][1];
                } else if (tempMoveX < T || tempMoveX > V) {
                    tempMoveX = allFallbackPointsRight[closestThreatIndex][0];
                    tempMoveY = allFallbackPointsRight[closestThreatIndex][1];
                }
                
                
                drawLine(m[0].x, m[0].y, tempMoveX, tempMoveY, 6);
                //#1 Find closest enemy.
                //#2 go to its teal line.
                
                /*for (var i = 0; i < allFallbackPoints.length; i++) {
                    for (var j = 0; j < allThreatLines.length; j++) {
                        var badSideLeft = allThreatLinesmool[0];
                        var badSideRight = allThreatLinesmool[1];
                        
                        if (allFallbackmool[i] &&
                            badSideLeft != isSideLine(allThreatLines[j][0][0], allThreatLines[j][0][1], allFallbackPoints[i]) &&
                            badSideRight != isSideLine(allThreatLines[j][1][0], allThreatLines[j][1][1], allFallbackPoints[i])
                        ) {
                            allFallbackmool[i] = true;
                            //console.log("Step 1");
                        } else {
                            //console.log("Failed Step 1");
                            allFallbackmool[i] = false;
                            allFallbackCount[i] += 1;
                        }
                    }
                    
                }
                
                var closestFallback = null;
                var fallbackDistance = null;
                for (var i = 1; i < allFallbackPoints.length; i++) {
                    if (allFallbackmool[i]) {
                        var tempDistance = computeDistance(m[0].x, m[0].y, allFallbackPoints[i][0], allFallbackPoints[i][1]);
                        if (closestFallback != null) {
                            if (tempDistance < fallbackDistance) {
                                closestFallback = allFallbackPoints[i];
                                fallbackDistance = tempDistance;
                            }
                        } else {
                            //console.log("FOUND CHILL SPOT!");
                            closestFallback = allFallbackPoints[i];
                            fallbackDistance = tempDistance;
                        }
                    }
                }
                
                if (closestFallback != null) {
                    console.log("ESCAPING");
                    tempMoveX = closestFallback[0];
                    tempMoveY = closestFallback[1];
                    drawLine(m[0].x, m[0].y, tempMoveX, tempMoveY, 6);
                } else {
                    console.log("NOPE! NEVER RUNNING AWAY!");
                }*/
                
                //#1 Loop through fallbackpoints
                //#2 Loop through threatlines
                //#3 Verify if a point is fine. If not, add counter to point's overlaps
                //#4 Go to closest safe point, otherwise find point with lowest counter.
            }
            
            drawPoint(tempPoint[0], tempPoint[1], tempPoint[2]);
            tempPoint[2] = 1;
        }
        
        if (!toggle) {
            P = tempMoveX;
            Q = tempMoveY;
        }
    }

    function drawPoint(x_1, y_1, drawColor) {
        if (!toggleDraw) {
            var x1 = ((x_1 - I) * k) + l/2;
            var y1 = ((y_1 - J) * k) + r/2;
            dPoints.push([x1, y1, drawColor]);
        }
    }

    function drawLine(x_1, y_1, x_2, y_2, drawColor) {
        if (!toggleDraw) {
            var x1 = ((x_1 - I) * k) + l/2;
            var y1 = ((y_1 - J) * k) + r/2;
            var x2 = ((x_2 - I) * k) + l/2;
            var y2 = ((y_2 - J) * k) + r/2;
            lines.push([x1, y1, x2, y2, drawColor]);
        }
    }
  
  function E() {
    findDestination();
      
    if (null != h && h.readyState == h.OPEN) {
      var a = N - l / 2,
      b = O - r / 2;
      64 > a * a + b * b || sa == P && ta == Q || (sa = P, ta = Q, a = new ArrayBuffer(21), b = new DataView(a), b.setUint8(0, 16), b.setFloat64(1, P, !0), b.setFloat64(9, Q, !0), b.setUint32(17, 0, !0), h.send(a))
    }
  }
  function pa() {
    if (null != h && h.readyState == h.OPEN && null != L) {
      var a = new ArrayBuffer(1 + 2 * L.length),
      b = new DataView(a);
      b.setUint8(0, 0);
      for (var c = 0; c < L.length; ++c) b.setUint16(1 + 2 * c, L.charCodeAt(c), !0);
      h.send(a)
    }
  }
  function A(a) {
    if (null != h && h.readyState == h.OPEN) {
      var b = new ArrayBuffer(1);
      (new DataView(b)).setUint8(0, a);
      h.send(b)
    }
  }
  function ka() {
    ba();
    g.requestAnimationFrame(ka)
  }
  function ja() {
    l = g.innerWidth;
    r = g.innerHeight;
    $.width = z.width = l;
    $.height = z.height = r;
    ba()
  }
  function Ca() {
    if (0 != m.length) {
      for (var a = 0, b = 0; b < m.length; b++) a += m[b].size;
      a = Math.pow(Math.min(64 / a, 1), 0.4) * Math.max(r / 1080, l / 1920);
      k = (9 * k + a) / 10
    }
  }
  function ba() {
    var a = + new Date;
    ++Da;
    D = + new Date;
    if (0 < m.length) {
      Ca();
      for (var b = 0, c = 0, e = 0; e < m.length; e++) m[e].updatePos(),
      b += m[e].x / m.length,
      c += m[e].y / m.length;
      I = b;
      J = c;
      K = k;
      s = (s + b) / 2;
      t = (t + c) / 2
    } else s = (29 * s + I) / 30,
    t = (29 * t + J) / 30,
    k = (9 * k + K) / 10;
    xa();
    aa();
    d.clearRect(0, 0, l, r);
    d.fillStyle = ea ? '#111111' : '#F2FBFF';
    d.fillRect(0, 0, l, r);
    d.save();
    d.strokeStyle = ea ? '#AAAAAA' : '#000000';
    d.globalAlpha = 0.2;
    d.scale(k, k);
    b = l / k;
    c = r / k;
    for (e = - 0.5 + ( - s + b / 2) % 50; e < b; e += 50) d.beginPath(),
    d.moveTo(e, 0),
    d.lineTo(e, c),
    d.stroke();
    for (e = - 0.5 + ( - t + c / 2) % 50; e < c; e += 50) d.beginPath(),
    d.moveTo(0, e),
    d.lineTo(b, e),
    d.stroke();
    d.restore();
    p.sort(function (a, b) {
      return a.size == b.size ? a.id - b.id : a.size - b.size
    });
    d.save();
    d.translate(l /
    2, r / 2);
    d.scale(k, k);
    d.translate( - s, - t);
    for (e = 0; e < C.length; e++) C[e].draw();
    for (e = 0; e < p.length; e++) p[e].draw();
    d.restore();
    y && 0 != w.length && d.drawImage(y, l - y.width - 10, 10);
    M = Math.max(M, Ea());
    sessionScore = Math.max(sessionScore, M);
    0 != M && (null == W && (W = new X(24, '#FFFFFF')), W.setValue('Score: ' + ~~(M / 100) + ' || Best Score: ' + ~~(sessionScore / 100)), c = W.render(), b = c.width, d.globalAlpha = 0.2, d.fillStyle = '#000000', d.fillRect(10, r - 10 - 24 - 10, b + 10, 34), d.globalAlpha = 1, d.drawImage(c, 15, r - 10 - 24 - 5));
    Fa();
    a = + new Date - a;
    a > 1000 / 60 ? u -= 0.01 : a < 1000 / 65 && (u += 0.01);
    0.4 > u && (u = 0.4);
    1 < u && (u = 1)
    
    for (var i = 0; i < dPoints.length; i++) {
        var radius = 10;
        

        d.beginPath();
        d.arc(dPoints[i][0], dPoints[i][1], radius, 0, 2 * Math.PI, false);

        if (dPoints[i][2] == 0) {
            d.fillStyle = "black";
        } else if (dPoints[i][2] == 1) {
            d.fillStyle = "yellow";
        } else if (dPoints[i][2] == 2) {
            d.fillStyle = "blue";
        } else if (dPoints[i][2] == 3) {
            d.fillStyle = "red";
        } else if (dPoints[i][2] == 4) {
            d.fillStyle = "#008080";
        } else {
            d.fillStyle = "#000000";
        }
          
        d.fill();
        d.lineWidth = 2;
        d.strokeStyle = '#003300';
        d.stroke();
    }
    d.lineWidth = 1;
    
    for(var i = 0; i < lines.length; i++) {
        d.beginPath();
        
        d.lineWidth = 5;
        
        if (lines[i][4] == 0) {
            d.strokeStyle = "#FF0000";
        } else if (lines[i][4] == 1) {
            d.strokeStyle = "#00FF00";
        } else if (lines[i][4] == 2) {
            d.strokeStyle = "#0000FF";
        } else if (lines[i][4] == 3) {
            d.strokeStyle = "#FF8000";
        } else if (lines[i][4] == 4) {
            d.strokeStyle = "#8A2BE2";
        } else if (lines[i][4] == 5) {
            d.strokeStyle = "#FF69B4";
        } else if (lines[i][4] == 6) {
            d.strokeStyle = "#008080";
        } else {
            d.strokeStyle = "#000000";
        }
        
        d.moveTo(lines[i][0], lines[i][1]);
        d.lineTo(lines[i][2], lines[i][3]);
        
        d.stroke();
    }
    d.lineWidth = 1;
  }
  function Fa() {
    if (ia && fa.width) {
      var a = l / 5;
      d.drawImage(fa, 5, 5, a, a)
    }
  }
  function Ea() {
    for (var a = 0, b = 0; b < m.length; b++) a += m[b].nSize * m[b].nSize;
    return a
  }
  function qa() {
    if (0 != w.length) if (Y) {
      y = document.createElement('canvas');
      var a = y.getContext('2d'),
      b = 60,
      b = null == x ? b + 24 * w.length : b + 180,
      c = Math.min(200, 0.3 * l) / 200;
      y.width = 200 * c;
      y.height = b * c;
      a.scale(c, c);
      a.globalAlpha = 0.4;
      a.fillStyle = '#000000';
      a.fillRect(0, 0, 200, b);
      a.globalAlpha = 1;
      a.fillStyle = '#FFFFFF';
      c = null;
      c = 'Leaderboard';
      a.font = '30px Ubuntu';
      a.fillText(c, 100 - a.measureText(c).width / 2, 40);
      if (null == x) {
        for (a.font = '20px Ubuntu', b = 0; b < w.length; ++b) {
            c = w[b].name || 'An unnamed cell',
              Y || (c = 'An unnamed cell'),
              - 1 != B.indexOf(w[b].id) ? (m[0].name && (c = m[0].name), a.fillStyle = '#FFAAAA')  : a.fillStyle = '#FFFFFF',
              c = b + 1 + '. ' + c,
              a.fillText(c, 100 - a.measureText(c).width / 2, 70 + 24 * b);
        }
      } else for (b = c = 0; b < x.length; ++b) angEnd = c + x[b] * Math.PI * 2,
      a.fillStyle = Ga[b + 1],
      a.beginPath(),
      a.moveTo(100, 140),
      a.arc(100, 140, 80, c, angEnd, !1),
      a.fill(),
      c = angEnd
    } else y = null
  }
  function ra(a, b, c, e, d, f, g) {
    p.push(this);
    v[a] = this;
    this.id = a;
    this.ox = this.x = b;
    this.oy = this.y = c;
    this.oSize = this.size = e;
    this.color = d;
    this.isVirus = f;
    this.points = [
    ];
    this.pointsAcc = [
    ];
    this.createPoints();
    this.setName(g)
  }
  function X(a, b, c, e) {
    a && (this._size = a);
    b && (this._color = b);
    this._stroke = !!c;
    e && (this._strokeColor = e)
  }
  if ('agar.io' != g.location.hostname && 'localhost' != g.location.hostname && '10.10.2.13' != g.location.hostname) g.location = 'http://agar.io/';
   else if (g.top != g) g.top.location = 'http://agar.io/';
   else {
    var $,
    toggle = false,
    toggleDraw = false,
    splitted = false,
    splitting = false,
    virusBait = false,
    tempPoint = [0, 0, 1],
    dPoints = [],
    lines = [],
    originalName,
    sessionScore = 0,
    d,
    z,
    l,
    r,
    F = null,
    h = null,
    s = 0,
    t = 0,
    B = [
    ],
    m = [
    ],
    v = {
    },
    p = [
    ],
    C = [
    ],
    w = [
    ],
    N = 0,
    O = 0,
    P = - 1,
    Q = - 1,
    Da = 0,
    D = 0,
    L = null,
    S = 0,
    T = 0,
    U = 10000,
    V = 10000,
    k = 1,
    G = null,
    ua = !0,
    Y = !0,
    ga = !1,
    da = !1,
    M = 0,
    ea = !1,
    va = !1,
    I = s = ~~((S + U) / 2),
    J = t = ~~((T + V) / 2),
    K = 1,
    H = '',
    x = null,
    Ga = [
      '#333333',
      '#FF3333',
      '#33FF33',
      '#3333FF'
    ],
    ia = 'ontouchstart' in g && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
    fa = new Image;
    fa.src = 'img/split.png';
    var R = null;
    g.setNick = function (a) {
      originalName = a;
      ma();
      L = a;
      pa();
      M = 0
    };
    g.setRegion = la;
    g.setSkins = function (a) {
      ua = a
    };
    g.setNames = function (a) {
      Y = a
    };
    g.setDarkTheme = function (a) {
      ea = a
    };
    g.setColors =
    function (a) {
      ga = a
    };
    g.setShowMass = function (a) {
      va = a
    };
    g.spectate = function () {
      A(1);
      ma()
    };
    g.setGameMode = function (a) {
      a != H && (H = a, ca())
    };
    g.connect = oa;
    var sa = - 1,
    ta = - 1,
    y = null,
    u = 1,
    W = null,
    Z = {
    },
    Ha = 'notreallyabot;poland;usa;china;russia;canada;australia;spain;brazil;germany;ukraine;france;sweden;hitler;north korea;south korea;japan;united kingdom;earth;greece;latvia;lithuania;estonia;finland;norway;cia;maldivas;austria;nigeria;reddit;yaranaika;confederate;9gag;indiana;4chan;italy;ussr;bulgaria;tumblr;2ch.hk;hong kong;portugal;jamaica;german empire;mexico;sanik;switzerland;croatia;chile;indonesia;bangladesh;thailand;iran;iraq;peru;moon;botswana;bosnia;netherlands;european union;taiwan;pakistan;hungary;satanist;qing dynasty;nazi;matriarchy;patriarchy;feminism;ireland;texas;facepunch;prodota;cambodia;steam;piccolo;ea;india;kc;denmark;quebec;ayy lmao;sealand;bait;tsarist russia;origin;vinesauce;stalin;belgium;luxembourg;stussy;prussia;8ch;argentina;scotland;sir;romania;belarus;wojak;isis;doge;nasa;byzantium;imperial japan;french kingdom;somalia;turkey;mars;pokerface'.split(';'),
    Ia = [
      'm\'blob'
    ];
    ra.prototype = {
      id: 0,
      points: null,
      pointsAcc: null,
      name: null,
      nameCache: null,
      sizeCache: null,
      x: 0,
      y: 0,
      size: 0,
      ox: 0,
      oy: 0,
      oSize: 0,
      nx: 0,
      ny: 0,
      nSize: 0,
      updateTime: 0,
      updateCode: 0,
      drawTime: 0,
      destroyed: !1,
      isVirus: !1,
      destroy: function () {
        var a;
        for (a = 0; a < p.length; a++) if (p[a] == this) {
          p.splice(a, 1);
          break
        }
        delete v[this.id];
        a = m.indexOf(this);
        - 1 != a && (da = !0, m.splice(a, 1));
        a = B.indexOf(this.id);
        - 1 != a && B.splice(a, 1);
        this.destroyed = !0;
        C.push(this)
      },
      getNameSize: function () {
        return Math.max(~~(0.3 * this.size), 24)
      },
      setName: function (a) {
        if (this.name = a) null == this.nameCache ? this.nameCache = new X(this.getNameSize(), '#FFFFFF', !0, '#000000')  : this.nameCache.setSize(this.getNameSize()),
        this.nameCache.setValue(this.name)
      },
      createPoints: function () {
        for (var a = this.getNumPoints(); this.points.length > a; ) {
          var b = ~~(Math.random() * this.points.length);
          this.points.splice(b, 1);
          this.pointsAcc.splice(b, 1)
        }
        0 == this.points.length && 0 < a && (this.points.push({
          c: this,
          v: this.size,
          x: this.x,
          y: this.y
        }), this.pointsAcc.push(Math.random() - 0.5));
        for (; this.points.length < a; ) {
          var b = ~~(Math.random() * this.points.length),
          c = this.points[b];
          this.points.splice(b, 0, {
            c: this,
            v: c.v,
            x: c.x,
            y: c.y
          });
          this.pointsAcc.splice(b, 0, this.pointsAcc[b])
        }
      },
      getNumPoints: function () {
        var a = 10;
        20 > this.size && (a = 5);
        this.isVirus && (a = 30);
        return ~~Math.max(this.size * k * (this.isVirus ? Math.min(2 * u, 1)  : u), a)
      },
      movePoints: function () {
        this.createPoints();
        for (var a = this.points, b = this.pointsAcc, c = b.concat(), e = a.concat(), d = e.length, f = 0; f < d; ++f) {
          var g = c[(f - 1 + d) % d],
          h = c[(f + 1) % d];
          b[f] += Math.random() - 0.5;
          b[f] *= 0.7;
          10 < b[f] && (b[f] = 10);
          - 10 > b[f] && (b[f] = - 10);
          b[f] = (g + h + 8 * b[f]) / 10
        }
        for (var l = this, f = 0; f < d; ++f) {
          c = e[f].v;
          g = e[(f - 1 + d) % d].v;
          h = e[(f + 1) % d].v;
          if (15 < this.size && null != F) {
            var k = !1,
            n = a[f].x,
            m = a[f].y;
            F.retrieve2(n - 5, m - 5, 10, 10, function (a) {
              a.c != l && 25 > (n - a.x) * (n - a.x) + (m - a.y) * (m - a.y) && (k = !0)
            });
            !k && (a[f].x < S || a[f].y < T || a[f].x > U || a[f].y > V) && (k = !0);
            k && (0 < b[f] && (b[f] = 0), b[f] -= 1)
          }
          c += b[f];
          0 > c && (c = 0);
          c = (12 * c + this.size) / 13;
          a[f].v = (g + h + 8 * c) / 10;
          g = 2 * Math.PI / d;
          h = this.points[f].v;
          this.isVirus && 0 == f % 2 && (h += 5);
          a[f].x = this.x + Math.cos(g * f) * h;
          a[f].y = this.y + Math.sin(g * f) *
          h
        }
      },
      updatePos: function () {
        var a;
        a = (D - this.updateTime) / 120;
        a = 0 > a ? 0 : 1 < a ? 1 : a;
        a = a * a * (3 - 2 * a);
        this.getNameSize();
        if (this.destroyed && 1 <= a) {
          var b = C.indexOf(this);
          - 1 != b && C.splice(b, 1)
        }
        this.x = a * (this.nx - this.ox) + this.ox;
        this.y = a * (this.ny - this.oy) + this.oy;
        this.size = a * (this.nSize - this.oSize) + this.oSize;
        return a
      },
      shouldRender: function () {
        return this.x + this.size + 40 < s - l / 2 / k || this.y + this.size + 40 < t - r / 2 / k || this.x - this.size - 40 > s + l / 2 / k || this.y - this.size - 40 > t + r / 2 / k ? !1 : !0
      },
      draw: function () {
        if (this.shouldRender()) {
          var a = !this.isVirus &&
          0.5 > k;
          d.save();
          this.drawTime = D;
          var b = this.updatePos();
          this.destroyed && (d.globalAlpha *= 1 - b);
          d.lineWidth = 10;
          d.lineCap = 'round';
          d.lineJoin = this.isVirus ? 'mitter' : 'round';
          ga ? (d.fillStyle = '#FFFFFF', d.strokeStyle = '#AAAAAA')  : (d.fillStyle = this.color, d.strokeStyle = this.color);
          if (a) d.beginPath(),
          d.arc(this.x, this.y, this.size, 0, 2 * Math.PI, !1);
           else {
            this.movePoints();
            d.beginPath();
            b = this.getNumPoints();
            d.moveTo(this.points[0].x, this.points[0].y);
            for (var c = 1; c <= b; ++c) {
              var e = c % b;
              d.lineTo(this.points[e].x, this.points[e].y)
            }
          }
          d.closePath();
          b = this.name.toLowerCase();
          ua && '' == H ? - 1 != Ha.indexOf(b) ? (Z.hasOwnProperty(b) || (Z[b] = new Image, b == "notreallyabot" ? Z[b].src = "http://i.imgur.com/ZW5T4cd.png" : Z[b].src = 'skins/' + b + '.png'), c = Z[b])  : c = null : c = null;
          b = c ? - 1 != Ia.indexOf(b)  : !1;
          a || d.stroke();
          d.fill();
          null != c && 0 < c.width && !b && (d.save(), d.clip(), d.drawImage(c, this.x - this.size, this.y - this.size, 2 * this.size, 2 * this.size), d.restore());
          (ga || 15 < this.size) && !a && (d.strokeStyle = '#000000', d.globalAlpha *= 0.1, d.stroke());
          d.globalAlpha = 1;
          null != c && 0 < c.width && b && d.drawImage(c, this.x - 2 * this.size, this.y - 2 * this.size, 4 * this.size, 4 * this.size);
          c = - 1 != m.indexOf(this);
          a = ~~this.y;
          if ((Y || c) && this.name && this.nameCache) {
            e = this.nameCache;
            e.setValue(this.name);
            e.setSize(this.getNameSize());
            b = Math.ceil(10 * k) / 10;
            e.setScale(b);
            var e = e.render(),
            g = ~~(e.width / b),
            f = ~~(e.height / b);
            d.drawImage(e, ~~this.x - ~~(g / 2), a - ~~(f / 2), g, f);
            a += e.height / 2 / b + 4
          }
          va && c && (null == this.sizeCache && (this.sizeCache = new X(this.getNameSize() / 2, '#FFFFFF', !0, '#000000')), c = this.sizeCache, c.setSize(this.getNameSize() / 2), c.setValue(~~(this.size * this.size / 100)), b = Math.ceil(10 *
          k) / 10, c.setScale(b), e = c.render(), g = ~~(e.width / b), f = ~~(e.height / b), d.drawImage(e, ~~this.x - ~~(g / 2), a - ~~(f / 2), g, f));
          d.restore()
        }
      }
    };
    X.prototype = {
      _value: '',
      _color: '#000000',
      _stroke: !1,
      _strokeColor: '#000000',
      _size: 16,
      _canvas: null,
      _ctx: null,
      _dirty: !1,
      _scale: 1,
      setSize: function (a) {
        this._size != a && (this._size = a, this._dirty = !0)
      },
      setScale: function (a) {
        this._scale != a && (this._scale = a, this._dirty = !0)
      },
      setColor: function (a) {
        this._color != a && (this._color = a, this._dirty = !0)
      },
      setStroke: function (a) {
        this._stroke != a && (this._stroke =
        a, this._dirty = !0)
      },
      setStrokeColor: function (a) {
        this._strokeColor != a && (this._strokeColor = a, this._dirty = !0)
      },
      setValue: function (a) {
        a != this._value && (this._value = a, this._dirty = !0)
      },
      render: function () {
        null == this._canvas && (this._canvas = document.createElement('canvas'), this._ctx = this._canvas.getContext('2d'));
        if (this._dirty) {
          this._dirty = !1;
          var a = this._canvas,
          b = this._ctx,
          c = this._value,
          e = this._scale,
          d = this._size,
          f = d + 'px Ubuntu';
          b.font = f;
          var g = b.measureText(c).width,
          h = ~~(0.2 * d);
          a.width = (g + 6) * e;
          a.height = (d + h) * e;
          b.font = f;
          b.scale(e, e);
          b.globalAlpha = 1;
          b.lineWidth = 3;
          b.strokeStyle = this._strokeColor;
          b.fillStyle = this._color;
          this._stroke && b.strokeText(c, 3, d - h / 2);
          b.fillText(c, 3, d - h / 2)
        }
        return this._canvas
      }
    };
    g.onload = wa
  }
}) (window, jQuery);
}
