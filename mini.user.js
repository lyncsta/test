(function (MyWindow, MyJQuery) {
    function GameInit() {
        IsLoaded = !0;
        UpdateRegionGui();
        setInterval(UpdateRegionGui, 18E4);
        Canvas2 = Canvas1 = document.getElementById("canvas");
        Canvas2dContext = Canvas2.getContext("2d");
        Canvas2.onmousedown = function (a) {
            if (IsMobile) {
                var b = a.clientX - (5 + WindowWidth / 5 / 2),
                    c = a.clientY - (5 + WindowWidth / 5 / 2);
                if (Math.sqrt(b * b + c * c) <= WindowWidth / 5 / 2) {
                    SendDesiredWorldCoords();
                    SendSinglePacket(17);
                    return;
                }
            }
            MouseX = a.clientX;
            MouseY = a.clientY;
            UpdateDesiredWorldCoordinates();
            SendDesiredWorldCoords()
        };
        Canvas2.onmousemove = function (a) {
            MouseX = a.clientX;
            MouseY = a.clientY;
            UpdateDesiredWorldCoordinates()
        };
        Canvas2.onmouseup = function (a) {
        };
        /firefox/i.test(navigator.userAgent) ? document.addEventListener("DOMMouseScroll", OnMouseWheel, !1) : document.body.onmousewheel = OnMouseWheel;
        var a = !1,
            b = !1,
            c = !1;
        MyWindow.onkeydown = function (d) {
            32 != d.keyCode || a || (SendDesiredWorldCoords(), SendSinglePacket(17), a = !0); // Space
            81 != d.keyCode || b || (SendSinglePacket(18), b = !0); // Q
            87 != d.keyCode || c || (SendDesiredWorldCoords(), SendSinglePacket(21), c = !0); // W
            27 == d.keyCode && Aa(!0); // Escape
        };
        MyWindow.onkeyup = function (d) {
            32 == d.keyCode && (a = !1); // Space
            87 == d.keyCode && (c = !1); // W
            81 == d.keyCode && b && (SendSinglePacket(19), b = !1); // Q
        };
        MyWindow.onblur = function () {
            SendSinglePacket(19);
            c = b = a = !1
        };
        MyWindow.onresize = UpdateWindowSize;
        UpdateWindowSize();
        MyWindow.requestAnimationFrame ? MyWindow.requestAnimationFrame(PresentLoop) : setInterval(Present, 1E3 / 60);
        setInterval(SendDesiredWorldCoords, 40);
        ServerRegion && MyJQuery("#region").val(ServerRegion);
        Da();
        U(MyJQuery("#region").val());
        null == MySocket && ServerRegion && WaitingForConnection();
        MyJQuery("#overlays").show()
    }
 
    function OnMouseWheel(a) {
        Zoom *= Math.pow(.9, a.wheelDelta / -120 || a.detail || 0);
        1 > Zoom && (Zoom = 1);
        Zoom > 4 / VisionSpread && (Zoom = 4 / VisionSpread)
    }
 
    function InsertEntitiesIntoQuadTree() {
        if (.35 > VisionSpread) QuadTreeInterface = null;
        else {
            for (var a = Number.POSITIVE_INFINITY, b = Number.POSITIVE_INFINITY, c = Number.NEGATIVE_INFINITY, d = Number.NEGATIVE_INFINITY, e = 0, q = 0; q < EntityList.length; q++) EntityList[q].shouldRender() && (e = Math.max(EntityList[q].size, e), a = Math.min(EntityList[q].x, a), b = Math.min(EntityList[q].y, b), c = Math.max(EntityList[q].x, c), d = Math.max(EntityList[q].y, d));
            QuadTreeInterface = QUAD.init({
                minX: a - (e + 100),
                minY: b - (e + 100),
                maxX: c + (e + 100),
                maxY: d + (e + 100)
            });
            for (q = 0; q < EntityList.length; q++)
                if (a = EntityList[q], a.shouldRender())
                    for (b = 0; b < a.points.length; ++b) QuadTreeInterface.insert(a.points[b])
        }
    }
 
    function UpdateDesiredWorldCoordinates() {
        DesiredWorldX = (MouseX - WindowWidth / 2) / VisionSpread + LocalX;
        DesiredWorldY = (MouseY - WindowHeight / 2) / VisionSpread + LocalY;
    }
 
    function UpdateRegionGui() {
        null == Y && (Y = {}, MyJQuery("#region").children().each(function () {
            var a = MyJQuery(this),
                b = a.val();
            b && (Y[b] = a.text())
        }));
        MyJQuery.get(HttpProtocol + "//m.agar.io/info", function (a) {
            var b = {},
                c;
            for (c in a.regions) {
                var d = c.split(":")[0];
                b[d] = b[d] || 0;
                b[d] += a.regions[c].numPlayers
            }
            for (c in b) MyJQuery('#region option[value="' + c + '"]').text(Y[c] + " (" + b[c] + " players)")
        }, "json")
    }
 
    function Ea() {
        MyJQuery("#adsBottom").hide();
        MyJQuery("#overlays").hide();
        Da()
    }
 
    function U(a) {
        a && a != ServerRegion && (MyJQuery("#region").val() != a && MyJQuery("#region").val(a),
            ServerRegion = MyWindow.localStorage.location = a, MyJQuery(".region-message").hide(), MyJQuery(".region-message." + a).show(), MyJQuery(".btn-needs-server").prop("disabled", !1), IsLoaded && WaitingForConnection())
    }
 
    function Aa(a) {
        LocalName = null;
        MyJQuery("#overlays").fadeIn(a ? 200 : 3E3);
        a || MyJQuery("#adsBottom").fadeIn(3E3)
    }
 
    function Da() {
        MyJQuery("#region").val() ? MyWindow.localStorage.location = MyJQuery("#region").val() : MyWindow.localStorage.location && MyJQuery("#region").val(MyWindow.localStorage.location);
        MyJQuery("#region").val() ? MyJQuery("#locationKnown").append(MyJQuery("#region")) : MyJQuery("#locationUnknown").append(MyJQuery("#region"))
    }
 
    function FindServer() {
        console.log("Find " +
        ServerRegion + GameMode);
        MyJQuery.ajax(HttpProtocol + "//m.agar.io/", {
            error: function () {
                setTimeout(FindServer, 1E3)
            },
            success: function (a) {
                a = a.split("\n");
                "45.79.222.79:443" == a[0] ? FindServer() : Connect("ws://" + a[0])
            },
            dataType: "text",
            method: "POST",
            cache: !1,
            crossDomain: !0,
            data: ServerRegion + GameMode || "?"
        })
    }
 
    function WaitingForConnection() {
        IsLoaded && ServerRegion && (MyJQuery("#connecting").show(), FindServer())
    }
 
    function Connect(__Ip) {
        if (MySocket) {
            MySocket.onopen = null;
            MySocket.onmessage = null;
            MySocket.onclose = null;
            try {
                MySocket.close()
            } catch (b) {
            }
            MySocket = null
        }
        var c = MyWindow.location.search.slice(1);
        /^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+:[0-9]+$/.test(c) && (__Ip = "ws://" + c);
        IsHttps && (__Ip = __Ip.split(":"), __Ip = __Ip[0] + "s://ip-" +
        __Ip[1].replace(/\./g, "-").replace(/\//g, "") + ".tech.agar.io:" + (+__Ip[2] + 2E3));
        E = [];
        OwnEntities = [];
        EntityArray = {};
        EntityList = [];
        DestroyedEntityList = [];
        ScoreBoardPlayerArray = [];
        TempCanvas = w = null;
        H = 0;
        console.log("Connecting to " + __Ip);
        MySocket = new WebSocket(__Ip, IsHttps ? ["binary", "base64"] : []);
        MySocket.binaryType = "arraybuffer";
        MySocket.onopen = OnSocketOpen;
        MySocket.onmessage = OnSocketMessage;
        MySocket.onclose = OnSocketClose;
        MySocket.onerror = function () {
            console.log("socket error");
        }
    }
 
    function OnSocketOpen(a) {
        TimeOutForReconnect = 500;
        MyJQuery("#connecting").hide();
        console.log("socket open");
        a = new ArrayBuffer(5);
        var b = new DataView(a);
        b.setUint8(0, 254);
        b.setUint32(1, 4, !0);
        MySocket.send(a);
        a = new ArrayBuffer(5);
        b = new DataView(a);
        b.setUint8(0, 255);
        b.setUint32(1, 673720360, !0);
        MySocket.send(a);
        SendName();
    }
 
    function OnSocketClose(a) {
        console.log("socket close");
        setTimeout(WaitingForConnection, TimeOutForReconnect);
        TimeOutForReconnect *= 1.5
    }
 
    function OnSocketMessage(a) {
        function ReceiveString() {
            for (var a = ""; ;) {
                var b = RecStream.getUint16(RecStreamIndex, !0);
                RecStreamIndex += 2;
                if (0 == b) break;
                a += String.fromCharCode(b)
            }
            return a
        }
 
        var RecStreamIndex = 0,
            RecStream = new DataView(a.data);
        240 == RecStream.getUint8(RecStreamIndex) && (RecStreamIndex += 5);
        switch (RecStream.getUint8(RecStreamIndex++)) {
            case 16:
                UpdateEntities(RecStream, RecStreamIndex);
                break;
            case 17:
                CameraX = RecStream.getFloat32(RecStreamIndex, !0);
                RecStreamIndex += 4;
                CameraY = RecStream.getFloat32(RecStreamIndex, !0);
                RecStreamIndex += 4;
                CameraSpread = RecStream.getFloat32(RecStreamIndex, !0);
                RecStreamIndex += 4;
                break;
            case 20:
                OwnEntities = [];
                E = [];
                break;
            case 21:
                oa = RecStream.getInt16(RecStreamIndex, !0);
                RecStreamIndex += 2;
                pa = RecStream.getInt16(RecStreamIndex, !0);
                RecStreamIndex += 2;
                qa || (qa = !0, $ = oa, aa = pa);
                break;
            case 32:
                E.push(RecStream.getUint32(RecStreamIndex, !0));
                RecStreamIndex += 4;
                break;
            case 49:
                if (null != w) break;
                a = RecStream.getUint32(RecStreamIndex, !0);
                RecStreamIndex += 4;
                ScoreBoardPlayerArray = [];
                for (var e = 0; e < a; ++e) {
                    var q = RecStream.getUint32(RecStreamIndex, !0),
                        c = RecStreamIndex + 4;
                    ScoreBoardPlayerArray.push({
                        id: q,
                        name: ReceiveString()
                    })
                }
                DrawScoreBoard();
                break;
            case 50:
                w = [];
                a = RecStream.getUint32(RecStreamIndex, !0);
                RecStreamIndex += 4;
                for (e = 0; e < a; ++e) w.push(RecStream.getFloat32(RecStreamIndex, !0)), RecStreamIndex += 4;
                DrawScoreBoard();
                break;
            case 64:
                ba = RecStream.getFloat64(RecStreamIndex, !0), RecStreamIndex += 8, ca = RecStream.getFloat64(RecStreamIndex, !0), RecStreamIndex += 8, da = RecStream.getFloat64(RecStreamIndex, !0), RecStreamIndex += 8, ea = RecStream.getFloat64(RecStreamIndex, !0), RecStreamIndex += 8, CameraX = (da + ba) / 2, CameraY = (ea + ca) / 2, CameraSpread = 1, 0 == OwnEntities.length && (LocalX = CameraX, LocalY = CameraY, VisionSpread = CameraSpread)
        }
    }
 
    function UpdateEntities(RecStream, RecStreamIndex) {
        CurTimeStamp = +new Date;
        var RandNum = Math.random();
        ra = !1;
        var d = RecStream.getUint16(RecStreamIndex, !0);
        RecStreamIndex += 2;
        for (var e = 0; e < d; ++e) {
            var q = EntityArray[RecStream.getUint32(RecStreamIndex, !0)],
                f = EntityArray[RecStream.getUint32(RecStreamIndex + 4, !0)];
            RecStreamIndex += 8;
            q && f && (f.destroy(), f.ox = f.x, f.oy = f.y, f.oSize = f.size, f.nx = q.x, f.ny = q.y, f.nSize = f.size, f.updateTime = CurTimeStamp)
        }
        for (e = 0; ;) {
            d = RecStream.getUint32(RecStreamIndex, !0);
            RecStreamIndex += 4;
            if (0 == d) break;
            ++e;
            var g, q = RecStream.getInt16(RecStreamIndex, !0);
            RecStreamIndex += 2;
            f = RecStream.getInt16(RecStreamIndex, !0);
            RecStreamIndex += 2;
            g = RecStream.getInt16(RecStreamIndex, !0);
            RecStreamIndex += 2;
            for (var h = RecStream.getUint8(RecStreamIndex++), m = RecStream.getUint8(RecStreamIndex++), p = RecStream.getUint8(RecStreamIndex++), h = (h << 16 | m << 8 | p).toString(16); 6 > h.length;) h = "0" + h;
            var h = "#" + h,
                k = RecStream.getUint8(RecStreamIndex++),
                m = !!(k & 1),
                p = !!(k & 16);
            k & 2 && (RecStreamIndex += 4);
            k & 4 && (RecStreamIndex += 8);
            k & 8 && (RecStreamIndex += 16);
            for (var n, k = ""; ;) {
                n = RecStream.getUint16(RecStreamIndex, !0);
                RecStreamIndex += 2;
                if (0 == n) break;
                k += String.fromCharCode(n)
            }
            n = k;
            k = null;
            EntityArray.hasOwnProperty(d) ? (k = EntityArray[d], k.updatePos(), k.ox = k.x, k.oy = k.y, k.oSize = k.size, k.color = h) : (k = new Entity(d, q, f, g, h, n), k.pX = q, k.pY = f);
            k.isVirus = m;
            k.isAgitated = p;
            k.nx = q;
            k.ny = f;
            k.nSize = g;
            k.updateCode = RandNum;
            k.updateTime = CurTimeStamp;
            n && k.setName(n);
            -1 != E.indexOf(d) && -1 == OwnEntities.indexOf(k) && (document.getElementById("overlays").style.display = "none", OwnEntities.push(k), 1 == OwnEntities.length && (LocalX = k.x, LocalY = k.y))
        }
        RandNum = RecStream.getUint32(RecStreamIndex, !0);
        RecStreamIndex += 4;
        for (e = 0; e < RandNum; e++) d = RecStream.getUint32(RecStreamIndex, !0), RecStreamIndex += 4, k = EntityArray[d], null != k && k.destroy();
        ra && 0 == OwnEntities.length && Aa(!1)
    }
 
    function SendDesiredWorldCoords() {
        if (IsSocketReady()) {
            var a = MouseX - WindowWidth / 2,
                b = MouseY - WindowHeight / 2;
            64 > a * a + b * b || Ka == DesiredWorldX && La == DesiredWorldY || (Ka = DesiredWorldX, La = DesiredWorldY, a = new ArrayBuffer(21), b = new DataView(a), b.setUint8(0, 16), b.setFloat64(1, DesiredWorldX, !0), b.setFloat64(9, DesiredWorldY, !0), b.setUint32(17, 0, !0), MySocket.send(a))
        }
    }
 
    function SendName() {
        if (IsSocketReady() && null != LocalName) {
            var a = new ArrayBuffer(1 + 2 * LocalName.length),
                b = new DataView(a);
            b.setUint8(0, 0);
            for (var c = 0; c < LocalName.length; ++c) b.setUint16(1 +
            2 * c, LocalName.charCodeAt(c), !0);
            MySocket.send(a)
        }
    }
 
    function IsSocketReady() {
        return null != MySocket && MySocket.readyState == MySocket.OPEN
    }
 
    function SendSinglePacket(a) {
        if (IsSocketReady()) {
            var b = new ArrayBuffer(1);
            (new DataView(b)).setUint8(0, a);
            MySocket.send(b)
        }
    }
 
    function PresentLoop() {
        Present();
        MyWindow.requestAnimationFrame(PresentLoop)
    }
 
    function UpdateWindowSize() {
        WindowWidth = MyWindow.innerWidth;
        WindowHeight = MyWindow.innerHeight;
        Canvas1.width = Canvas2.width = WindowWidth;
        Canvas1.height = Canvas2.height = WindowHeight;
        Present();
    }
 
    function GetFOV() {
        var Temp;
        Temp = 1 * Math.max(WindowHeight / 1080, WindowWidth / 1920);
        return Temp *= Zoom;
    }
 
    function UpdateVisionSpread() {
        if (0 != OwnEntities.length) {
            for (var a = 0, b = 0; b < OwnEntities.length; b++) a += OwnEntities[b].size;
            a = Math.pow(Math.min(64 / a, 1), .4) * GetFOV();
            VisionSpread = (9 * VisionSpread + a) / 10
        }
    }
 
    function Present() {
        var a, b, c = +new Date;
        ++Wa;
        CurTimeStamp = +new Date;
        if (0 < OwnEntities.length) {
            UpdateVisionSpread();
            for (var d = a = b = 0; d < OwnEntities.length; d++) OwnEntities[d].updatePos(), b += OwnEntities[d].x / OwnEntities.length, a += OwnEntities[d].y / OwnEntities.length;
            CameraX = b;
            CameraY = a;
            CameraSpread = VisionSpread;
            LocalX = (LocalX + b) / 2;
            LocalY = (LocalY + a) / 2
        } else LocalX = (29 * LocalX + CameraX) / 30, LocalY = (29 * LocalY + CameraY) / 30, VisionSpread = (9 * VisionSpread + CameraSpread * GetFOV()) / 10;
        InsertEntitiesIntoQuadTree();
        UpdateDesiredWorldCoordinates();
        IsAcid || Canvas2dContext.clearRect(0, 0, WindowWidth, WindowHeight);
        if (IsAcid) Canvas2dContext.fillStyle = UseDarkTheme ? "#111111" : "#F2FBFF", Canvas2dContext.globalAlpha = .05, Canvas2dContext.fillRect(0, 0, WindowWidth, WindowHeight), Canvas2dContext.globalAlpha = 1;
        else {
            Canvas2dContext.fillStyle = UseDarkTheme ? "#111111" : "#F2FBFF";
            Canvas2dContext.fillRect(0, 0, WindowWidth, WindowHeight);
            Canvas2dContext.save();
            Canvas2dContext.strokeStyle = UseDarkTheme ? "#AAAAAA" : "#000000";
            Canvas2dContext.globalAlpha = .2;
            Canvas2dContext.scale(VisionSpread, VisionSpread);
            b = WindowWidth / VisionSpread;
            a = WindowHeight / VisionSpread;
            for (d = -.5 + (-LocalX + b / 2) % 50; d < b; d += 50) Canvas2dContext.beginPath(), Canvas2dContext.moveTo(d, 0), Canvas2dContext.lineTo(d, a), Canvas2dContext.stroke();
            for (d = -.5 + (-LocalY + a / 2) % 50; d < a; d += 50) Canvas2dContext.beginPath(), Canvas2dContext.moveTo(0, d), Canvas2dContext.lineTo(b, d), Canvas2dContext.stroke();
            Canvas2dContext.restore()
        }
        EntityList.sort(function (a, b) {
            return a.size == b.size ? a.id - b.id : a.size - b.size
        });
        Canvas2dContext.save();
        Canvas2dContext.translate(WindowWidth / 2, WindowHeight / 2);
        Canvas2dContext.scale(VisionSpread, VisionSpread);
        Canvas2dContext.translate(-LocalX, -LocalY);
        for (d = 0; d < DestroyedEntityList.length; d++) DestroyedEntityList[d].draw();
        for (d = 0; d < EntityList.length; d++) EntityList[d].draw();
        if (qa) {
            $ = (3 * $ + oa) / 4;
            aa = (3 * aa + pa) / 4;
            Canvas2dContext.save();
            Canvas2dContext.strokeStyle = "#FFAAAA";
            Canvas2dContext.lineWidth = 10;
            Canvas2dContext.lineCap = "round";
            Canvas2dContext.lineJoin = "round";
            Canvas2dContext.globalAlpha =
                .5;
            Canvas2dContext.beginPath();
            for (d = 0; d < OwnEntities.length; d++) Canvas2dContext.moveTo(OwnEntities[d].x, OwnEntities[d].y), Canvas2dContext.lineTo($, aa);
            Canvas2dContext.stroke();
            Canvas2dContext.restore()
        }
        Canvas2dContext.restore();
        TempCanvas && TempCanvas.width && Canvas2dContext.drawImage(TempCanvas, WindowWidth - TempCanvas.width - 10, 10);
        H = Math.max(H, GetOwnTotalSqrSize());
        0 != H && (null == ga && (ga = new Style(24, "#FFFFFF")), ga.setValue("Score: " + ~~(H / 100)), a = ga.render(), b = a.width, Canvas2dContext.globalAlpha = .2, Canvas2dContext.fillStyle = "#000000", Canvas2dContext.fillRect(10, WindowHeight - 10 - 24 - 10, b + 10, 34), Canvas2dContext.globalAlpha = 1, Canvas2dContext.drawImage(a, 15, WindowHeight - 10 - 24 - 5));
        DrawMobileLogo();
        c = +new Date - c;
        c > 1E3 / 60 ? x -= .01 : c < 1E3 / 65 && (x += .01);
        .4 > x && (x = .4);
        1 < x && (x = 1)
    }
 
    function DrawMobileLogo() {
        if (IsMobile && Logo.width) {
            var a = WindowWidth / 5;
            Canvas2dContext.drawImage(Logo, 5, 5, a, a)
        }
    }
 
    function GetOwnTotalSqrSize() {
        for (var a = 0, b = 0; b < OwnEntities.length; b++) a += OwnEntities[b].nSize * OwnEntities[b].nSize;
        return a
    }
 
    function DrawScoreBoard() {
        TempCanvas = null;
        if (null != w || 0 != ScoreBoardPlayerArray.length)
            if (null != w || ShowNames) {
                TempCanvas = document.createElement("canvas");
                var TempCanvas2dContext = TempCanvas.getContext("2d"),
                    b = 60,
                    b = null == w ? b + 24 * ScoreBoardPlayerArray.length : b + 180,
                    c = Math.min(200, .3 * WindowWidth) / 200;
                TempCanvas.width = 200 * c;
                TempCanvas.height = b * c;
                TempCanvas2dContext.scale(c, c);
                TempCanvas2dContext.globalAlpha = .4;
                TempCanvas2dContext.fillStyle = "#000000";
                TempCanvas2dContext.fillRect(0, 0, 200, b);
                TempCanvas2dContext.globalAlpha = 1;
                TempCanvas2dContext.fillStyle = "#FFFFFF";
                c = null;
                c = "Leaderboard";
                TempCanvas2dContext.font = "30px Ubuntu";
                TempCanvas2dContext.fillText(c, 100 - TempCanvas2dContext.measureText(c).width /
                2, 40);
                if (null == w)
                    for (TempCanvas2dContext.font = "20px Ubuntu", b = 0; b < ScoreBoardPlayerArray.length; ++b) c = ScoreBoardPlayerArray[b].name || "An unnamed cell", ShowNames || (c = "An unnamed cell"), -1 != E.indexOf(ScoreBoardPlayerArray[b].id) ? (OwnEntities[0].name && (c = OwnEntities[0].name), TempCanvas2dContext.fillStyle = "#FFAAAA") : TempCanvas2dContext.fillStyle = "#FFFFFF", c = b + 1 + ". " + c, TempCanvas2dContext.fillText(c, 100 - TempCanvas2dContext.measureText(c).width / 2, 70 + 24 * b);
                else
                    for (b = c = 0; b < w.length; ++b) angEnd = c + w[b] * Math.PI * 2, TempCanvas2dContext.fillStyle = Za[b + 1], TempCanvas2dContext.beginPath(), TempCanvas2dContext.moveTo(100, 140), TempCanvas2dContext.arc(100, 140, 80, c, angEnd, !1), TempCanvas2dContext.fill(), c = angEnd
            }
    }
 
    function Entity(__Id, __x, __y, __Size, __Color, __Name) {
        EntityList.push(this);
        EntityArray[__Id] = this;
        this.id = __Id;
        this.ox = this.x = __x;
        this.oy = this.y = __y;
        this.oSize = this.size = __Size;
        this.color = __Color;
        this.points = [];
        this.pointsAcc = [];
        this.createPoints();
        this.setName(__Name)
    }
 
    function Style(__Size, __Color, __Stroke, __StrokeColor) {
        __Size && (this._size = __Size);
        __Color && (this._color = __Color);
        this._stroke = !!__Stroke;
        __StrokeColor && (this._strokeColor = __StrokeColor)
    }
 
    var HttpProtocol = MyWindow.location.protocol,
        IsHttps = "https:" == HttpProtocol;
    if ("agar.io" != MyWindow.location.hostname && "localhost" != MyWindow.location.hostname && "10.10.2.13" != MyWindow.location.hostname) MyWindow.location = HttpProtocol + "//agar.io/";
    else if (MyWindow.top != MyWindow) MyWindow.top.location = HttpProtocol + "//agar.io/";
    else {
        var Canvas1, Canvas2dContext, Canvas2, WindowWidth, WindowHeight, QuadTreeInterface = null,
            MySocket = null,
            LocalX = 0,
            LocalY = 0,
            E = [],
            OwnEntities = [],
            EntityArray = {},
            EntityList = [],
            DestroyedEntityList = [],
            ScoreBoardPlayerArray = [],
            MouseX = 0,
            MouseY = 0,
            DesiredWorldX = -1,
            DesiredWorldY = -1,
            Wa = 0,
            CurTimeStamp = 0,
            LocalName = null,
            ba = 0,
            ca = 0,
            da = 1E4,
            ea = 1E4,
            VisionSpread = 1,
            ServerRegion = null,
            ShowSkins = !0,
            ShowNames = !0,
            ShowColors = !1,
            ra = !1,
            H = 0,
            UseDarkTheme = !1,
            ShowOwnMass = !1,
            CameraX = LocalX = ~~((ba + da) / 2),
            CameraY = LocalY = ~~((ca + ea) / 2),
            CameraSpread = 1,
            GameMode = "",
            w = null,
            IsLoaded = !1,
            qa = !1,
            oa = 0,
            pa = 0,
            $ = 0,
            aa = 0,
            Canvas3 = 0,
            Za = ["#333333", "#FF3333", "#33FF33", "#3333FF"],
            IsAcid = !1,
            Zoom = 1,
            IsMobile = "ontouchstart" in MyWindow && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
            Logo = new Image;
        Logo.src = "img/split.png";
        Canvas3 = document.createElement("canvas");
        if ("undefined" == typeof console || "undefined" == typeof DataView ||
            "undefined" == typeof WebSocket || null == Canvas3 || null == Canvas3.getContext || null == MyWindow.localStorage) alert("You browser does not support this game, we recommend you to use Firefox to play this");
        else {
            var Y = null;
            MyWindow.setNick = function (a) {
                Ea();
                LocalName = a;
                SendName();
                H = 0
            };
            MyWindow.setRegion = U;
            MyWindow.setSkins = function (a) {
                ShowSkins = a
            };
            MyWindow.setNames = function (a) {
                ShowNames = a
            };
            MyWindow.setDarkTheme = function (a) {
                UseDarkTheme = a
            };
            MyWindow.setColors = function (a) {
                ShowColors = a
            };
            MyWindow.setShowMass = function (a) {
                ShowOwnMass = a
            };
            MyWindow.spectate = function () {
                LocalName = null;
                SendSinglePacket(1);
                Ea()
            };
            MyWindow.setGameMode = function (a) {
                a != GameMode && (GameMode = a, WaitingForConnection())
            };
            MyWindow.setAcid = function (a) {
                IsAcid = a
            };
            null != MyWindow.localStorage && (null == MyWindow.localStorage.AB8 && (MyWindow.localStorage.AB8 = 0 + ~~(100 * Math.random())), Canvas3 = +MyWindow.localStorage.AB8, MyWindow.ABGroup = Canvas3);
            MyJQuery.get(HttpProtocol + "//gc.agar.io", function (a) {
                var b = a.split(" ");
                a = b[0];
                b = b[1] || "";
                -1 == "DE IL PL HU BR AT UA".split(" ").indexOf(a) && NameCodes1.push("nazi");
                -1 == ["UA"].indexOf(a) && NameCodes1.push("ussr"); // Check for Censor
                Countries.hasOwnProperty(a) && ("string" == typeof Countries[a] ? ServerRegion || U(Countries[a]) : Countries[a].hasOwnProperty(b) && (ServerRegion || U(Countries[a][b])))
            }, "text");
            setTimeout(function () {
            }, 3E5);
            var Countries = {
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
            MyWindow.connect = Connect;
            var TimeOutForReconnect = 500,
                Ka = -1,
                La = -1,
                TempCanvas = null,
                x = 1,
                ga = null,
                J = {},
                NameCodes1 = "poland;usa;china;russia;canada;australia;spain;brazil;germany;ukraine;france;sweden;hitler;north korea;south korea;japan;united kingdom;earth;greece;latvia;lithuania;estonia;finland;norway;cia;maldivas;austria;nigeria;reddit;yaranaika;confederate;9gag;indiana;4chan;italy;bulgaria;tumblr;2ch.hk;hong kong;portugal;jamaica;german empire;mexico;sanik;switzerland;croatia;chile;indonesia;bangladesh;thailand;iran;iraq;peru;moon;botswana;bosnia;netherlands;european union;taiwan;pakistan;hungary;satanist;qing dynasty;matriarchy;patriarchy;feminism;ireland;texas;facepunch;prodota;cambodia;steam;piccolo;ea;india;kc;denmark;quebec;ayy lmao;sealand;bait;tsarist russia;origin;vinesauce;stalin;belgium;luxembourg;stussy;prussia;8ch;argentina;scotland;sir;romania;belarus;wojak;doge;nasa;byzantium;imperial japan;french kingdom;somalia;turkey;mars;pokerface;8;irs;receita federal".split(";"),
                NameCodes2 = ["8", "nasa"],
                ab = ["m'blob"];
            Entity.prototype = {
                id: 0,
                points: null,
                pointsAcc: null,
                name: null,
                nameCache: null,
                sizeCache: null,
                x: 0, // Cur x/y
                y: 0,
                size: 0,
                ox: 0, // Last x/y
                oy: 0,
                oSize: 0,
                nx: 0, // Server x/y (integer)
                ny: 0,
                nSize: 0,
                updateTime: 0,
                updateCode: 0,
                drawTime: 0,
                destroyed: !1,
                isVirus: !1,
                isAgitated: !1,
                wasSimpleDrawing: !0,
                destroy: function () {
                    var a;
                    for (a = 0; a < EntityList.length; a++)
                        if (EntityList[a] == this) {
                            EntityList.splice(a, 1);
                            break
                        }
                    delete EntityArray[this.id];
                    a = OwnEntities.indexOf(this);
                    -1 != a && (ra = !0, OwnEntities.splice(a, 1));
                    a = E.indexOf(this.id);
                    -1 != a && E.splice(a, 1);
                    this.destroyed = !0;
                    DestroyedEntityList.push(this)
                },
                getNameSize: function () {
                    return Math.max(~~(.3 * this.size), 24)
                },
                setName: function (a) {
                    if (this.name = a) null == this.nameCache ? this.nameCache = new Style(this.getNameSize(), "#FFFFFF", !0, "#000000") : this.nameCache.setSize(this.getNameSize()), this.nameCache.setValue(this.name)
                },
                createPoints: function () {
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
                getNumPoints: function () {
                    var a = 10;
                    20 > this.size && (a = 5);
                    this.isVirus && (a = 30);
                    var b = this.size;
                    this.isVirus || (b *= VisionSpread);
                    b *= x;
                    return ~~Math.max(b, a)
                },
                movePoints: function () {
                    this.createPoints();
                    for (var a = this.points, b = this.pointsAcc, c = a.length, d = 0; d < c; ++d) {
                        var e = b[(d - 1 + c) % c],
                            f = b[(d + 1) % c];
                        b[d] += (Math.random() - .5) * (this.isAgitated ? 3 : 1);
                        b[d] *= .7;
                        10 < b[d] && (b[d] = 10);
                        -10 > b[d] && (b[d] = -10);
                        b[d] = (e + f + 8 * b[d]) / 10
                    }
                    for (var h = this, d = 0; d < c; ++d) {
                        var g = a[d].v,
                            e = a[(d - 1 + c) % c].v,
                            f = a[(d + 1) % c].v;
                        if (15 < this.size && null != QuadTreeInterface) {
                            var l = !1,
                                m = a[d].x,
                                n = a[d].y;
                            QuadTreeInterface.retrieve2(m - 5, n - 5, 10, 10, function (a) {
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
                updatePos: function () {
                    var a;
                    a = (CurTimeStamp - this.updateTime) / 120;
                    a = 0 > a ? 0 : 1 < a ? 1 : a;
                    var b = 0 > a ? 0 : 1 < a ? 1 : a;
                    this.getNameSize();
                    if (this.destroyed && 1 <= b) {
                        var c = DestroyedEntityList.indexOf(this);
                        -1 != c && DestroyedEntityList.splice(c, 1)
                    }
                    this.x = a * (this.nx - this.ox) + this.ox;
                    this.y = a * (this.ny - this.oy) + this.oy;
                    this.size = b * (this.nSize - this.oSize) + this.oSize;
                    return b
                },
                shouldRender: function () {
                    return this.x + this.size + 40 < LocalX - WindowWidth / 2 / VisionSpread || this.y + this.size + 40 < LocalY - WindowHeight / 2 / VisionSpread || this.x - this.size - 40 > LocalX + WindowWidth / 2 / VisionSpread || this.y - this.size - 40 > LocalY + WindowHeight / 2 / VisionSpread ? !1 : !0
                },
                draw: function () {
                    if (this.shouldRender()) {
                        var a = !this.isVirus && !this.isAgitated && .35 > VisionSpread;
                        if (this.wasSimpleDrawing && !a)
                            for (var b = 0; b < this.points.length; b++) this.points[b].v = this.size;
                        this.wasSimpleDrawing = a;
                        Canvas2dContext.save();
                        this.drawTime = CurTimeStamp;
                        b = this.updatePos();
                        this.destroyed && (Canvas2dContext.globalAlpha *= 1 - b);
                        Canvas2dContext.lineWidth = 10;
                        Canvas2dContext.lineCap = "round";
                        Canvas2dContext.lineJoin = this.isVirus ? "mitter" : "round";
                        ShowColors ? (Canvas2dContext.fillStyle = "#FFFFFF", Canvas2dContext.strokeStyle = "#AAAAAA") : (Canvas2dContext.fillStyle = this.color, Canvas2dContext.strokeStyle = this.color);
                        if (a) Canvas2dContext.beginPath(), Canvas2dContext.arc(this.x, this.y, this.size, 0, 2 * Math.PI, !1);
                        else {
                            this.movePoints();
                            Canvas2dContext.beginPath();
                            var c = this.getNumPoints();
                            Canvas2dContext.moveTo(this.points[0].x, this.points[0].y);
                            for (b = 1; b <= c; ++b) {
                                var d = b % c;
                                Canvas2dContext.lineTo(this.points[d].x, this.points[d].y)
                            }
                        }
                        Canvas2dContext.closePath();
                        c = this.name.toLowerCase();
                        !this.isAgitated && ShowSkins && "" == GameMode ? -1 != NameCodes1.indexOf(c) ? (J.hasOwnProperty(c) || (J[c] = new Image, J[c].src = "skins/" + c + ".png"), b = 0 != J[c].width && J[c].complete ? J[c] : null) : b = null : b = null;
                        b = (d = b) ? -1 != ab.indexOf(c) : !1;
                        a || Canvas2dContext.stroke();
                        Canvas2dContext.fill();
                        null == d || b || (Canvas2dContext.save(), Canvas2dContext.clip(), Canvas2dContext.drawImage(d, this.x - this.size, this.y - this.size, 2 * this.size, 2 * this.size), Canvas2dContext.restore());
                        (ShowColors || 15 < this.size) && !a && (Canvas2dContext.strokeStyle = "#000000", Canvas2dContext.globalAlpha *= .1, Canvas2dContext.stroke());
                        Canvas2dContext.globalAlpha = 1;
                        null != d && b && Canvas2dContext.drawImage(d, this.x - 2 * this.size, this.y - 2 * this.size, 4 * this.size, 4 * this.size);
                        b = -1 != OwnEntities.indexOf(this);
                        a = ~~this.y;
                        if ((ShowNames || b) && this.name && this.nameCache && (null == d || -1 == NameCodes2.indexOf(c))) {
                            d = this.nameCache;
                            d.setValue(this.name);
                            d.setSize(this.getNameSize());
                            c = Math.ceil(10 * VisionSpread) / 10;
                            d.setScale(c);
                            var d = d.render(),
                                f = ~~(d.width / c),
                                g = ~~(d.height / c);
                            Canvas2dContext.drawImage(d, ~~this.x - ~~(f / 2), a - ~~(g / 2), f, g);
                            a += d.height / 2 / c + 4
                        }
                        ShowOwnMass && (b || 0 == OwnEntities.length && (!this.isVirus || this.isAgitated) && 20 < this.size) && (null == this.sizeCache && (this.sizeCache = new Style(this.getNameSize() / 2, "#FFFFFF", !0, "#000000")), b = this.sizeCache, b.setSize(this.getNameSize() / 2), b.setValue(~~(this.size * this.size / 100)), c = Math.ceil(10 * VisionSpread) / 10, b.setScale(c), d = b.render(), f = ~~(d.width / c), g = ~~(d.height / c), Canvas2dContext.drawImage(d, ~~this.x - ~~(f / 2), a - ~~(g / 2), f, g));
                        Canvas2dContext.restore()
                    }
                }
            };
            Style.prototype = {
                _value: "",
                _color: "#000000",
                _stroke: !1,
                _strokeColor: "#000000",
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
                    this._stroke != a && (this._stroke = a, this._dirty = !0)
                },
                setStrokeColor: function (a) {
                    this._strokeColor != a && (this._strokeColor = a, this._dirty = !0)
                },
                setValue: function (a) {
                    a != this._value && (this._value = a, this._dirty = !0)
                },
                render: function () {
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
            MyWindow.onload = GameInit
        }
    }
})(window, jQuery);
