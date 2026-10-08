// Shaders estáticos: opciones en selection_icon.diameter, sin recompilar.
// Firma nueva en partida: montar specs -> tag vigente -> F5 (patrón WFX).
(function () {
    'use strict';
    var G = IconosOpc.G, MARCA = '/ui/mods/' + G + '/anillos_estado.json';
    var catalogo, ocupado = false, rendido = false, KEY = G + '.recargaAnillos';
    // Protocolo de fichas compartidas con Weapon FX (rev-wfx-01): R2 centinela de contenido, R3 una sola recarga coordinada.
    var CENTINELA = '/pa/units/commanders/base_commander/base_commander.json', RECARGA = 'pa.fichas.recarga', MOD = 'uniticons';
    // JSON.parse fuera de .then: con jQuery 2 un JSON invalido lanzaria sin capturar y dejaria la promesa colgada.
    function leer(ruta) {
        var r = $.Deferred();
        $.ajax({url:'coui:/' + ruta,cache:false,dataType:'text'}).then(function(t){
            try { r.resolve(JSON.parse(t)); } catch (e) { r.reject(e); }
        },function(e){r.reject(e);});
        return r.promise();
    }
    function contenido() { try { return String(api.content.active()); } catch (e) { return ''; } }
    function cat() { if (!catalogo) { catalogo = leer('/ui/mods/' + G + '/anillos_catalogo.json'); } return catalogo; }
    function codigo() {
        api.settings.loadLocalData();
        var a = IconosOpc.anillos(), h = IconosOpc.COLORES.indexOf(a.hover) + 1;
        return (a.seleccion === 'dom314' ? 8 : 0) + Math.max(0, h);
    }
    // En partida: el codigo viene del puente (lo publica Guardar), sin parsear ajustes cada segundo.
    function codigoPuente() {
        return leer(IconosOpc.RUTA_MEM).then(function(c){ var v = Number(c && c.ar); return isFinite(v) ? v : 0; });
    }
    function decode(raw, c) {
        for (var i = 0; i < c.diametros.length; i++) {
            var f = (raw - c.diametros[i]) * c.escala, n = Math.round(f);
            if (n >= c.marca && n <= 15 * c.paso + c.marca && n % c.paso === c.marca && Math.abs(f - n) < c.tolerancia) {
                return {diametro:c.diametros[i],codigo:Math.floor(n / c.paso)};
            }
        }
        return {diametro:raw,codigo:0};
    }
    // R2: la ficha centinela servida por coui (memoria incluida) lleva nuestro codigo. Si otro mod monto encima sin el, no esta vigente.
    function centinelaOk(c, code) {
        var r = $.Deferred();
        leer(CENTINELA).then(function(d){
            var raw = d && d.selection_icon && Number(d.selection_icon.diameter);
            r.resolve(isFinite(raw) && raw > 0 && decode(raw,c).codigo === code);
        },function(){r.resolve(false);});
        return r.promise();
    }
    // R3: quien quiere recargar escribe {mod,t} y espera 1,5 s; recarga solo si la clave sigue siendo suya. Candado comun de 20 s. localStorage (no sessionStorage): se comparte entre paneles/escenas de Coherent con seguridad; la marca t lo hace caducar.
    function leerRecarga() { try { return JSON.parse(localStorage.getItem(RECARGA) || 'null'); } catch (e) { return null; } }
    function escribir(k, v) { try { localStorage.setItem(k,JSON.stringify(v)); return true; } catch (e) { return false; } }
    // CON-001: si el otro mod recargo hace < 20 s, no se corta antes de montar: se monta y la recarga espera a que venza el candado.
    // CON-002: si cedo y el otro no recarga en 8 s (seguimos vivos: la recarga es de esta misma pagina), recargo yo.
    function pedirRecarga(hacer) {
        canal('necesito_recarga',{motivo:'anillos'});
        (function intentar(cedidas) {
            // misma regla que Weapon FX (montaje.js): solo cuenta si 0 <= edad < 20000 (hora futura o invalida: no esperar)
            var v = leerRecarga(), edad = v ? Date.now() - (+v.t || 0) : Infinity, espera = v && v.mod !== MOD && edad >= 0 && edad < 20000 ? 20000 - edad : 0;
            if (espera > 0 && cedidas === 0) { setTimeout(function(){ intentar(0); },Math.min(espera + 100,20100)); return; }
            var yo = {mod:MOD,t:Date.now()};
            if (!escribir(RECARGA,yo)) { hacer(); return; }   // sin localStorage: recargar (no hay con quien coordinar)
            setTimeout(function(){
                var a = leerRecarga();
                if (a && a.mod === yo.mod && a.t === yo.t) { hacer(); return; }
                console.log('[Unit Icons] anillos: cedo la recarga a ' + (a && a.mod) + ' (sin confirmar; si no recarga en 8 s, reintento)');
                setTimeout(function(){
                    if (cedidas >= 1) { console.error('[Unit Icons] anillos: el otro mod no recargo; recargo yo'); hacer(); return; }
                    console.log('[Unit Icons] anillos: el otro mod no recargo en 8 s; reintento');
                    intentar(cedidas + 1);
                },8000);
            },1500);
        })(0);
    }
    // Tras montar, releer el centinela a los 2 s; si falta nuestro codigo (carrera con otro mod), remontar sobre la memoria actual (max 2).
    function confirmar(code, intento) {
        setTimeout(function(){
            cat().then(function(c){ return centinelaOk(c,code); }).then(function(ok){
                if (ok) { return; }
                if (intento >= 2) { console.error('[Unit Icons] anillos: el centinela sigue sin nuestro codigo tras 2 reintentos'); return; }
                console.log('[Unit Icons] anillos: centinela sin nuestro codigo, remonto (' + (intento + 1) + ')');
                montar(code,true).then(function hecho(r){ if (r && typeof r.then === 'function') { r.then(hecho); return; } if (r && r.cambio) { confirmar(code,intento + 1); } });
            }).fail(function(e){ console.error('[Unit Icons] anillos: no pude releer el centinela', e); });
        },2000);
    }
    // Canal en el juego con Weapon FX ('pa.fichas.canal' v1): mensajes hola / montando / monte / necesito_recarga. Un fallo del canal nunca cuelga el montaje.
    var CANAL = 'pa.fichas.canal', ESCENA = (String(window.location.pathname || '').match(/\/([a-z_]+)\.html/) || [])[1] || '';
    function canalLeer() { try { var v = JSON.parse(localStorage.getItem(CANAL) || '[]'); return Array.isArray(v) ? v.filter(function(m){ return m && m.ver === 1; }) : []; } catch (e) { return []; } }
    function canal(tipo, extra) {
        try {
            var ahora = Date.now(), m = {de:MOD,ver:1,tipo:tipo,escena:ESCENA,t:ahora}, todos = [];
            Object.keys(extra || {}).forEach(function(k){ m[k] = extra[k]; });
            try { todos = JSON.parse(localStorage.getItem(CANAL) || '[]'); } catch (e) {}
            if (!Array.isArray(todos)) { todos = []; }
            todos = todos.filter(function(x){ return x && ahora - Number(x.t) < 60000; }).concat([m]).slice(-20);
            localStorage.setItem(CANAL,JSON.stringify(todos));
            return m;
        } catch (e) { return {t:Date.now()}; }
    }
    // Turno: si otro mod tiene un 'montando' anterior al mio (empate: nombre menor primero), < 5 s y sin 'monte' posterior, esperar a que cierre (250 ms, max 5 s).
    function turno(mio) {
        var r = $.Deferred(), inicio = Date.now();
        (function mirar() {
            var ms = canalLeer(), espera = false;
            try {
                ms.forEach(function(m){
                    if (m.de === MOD || m.tipo !== 'montando') { return; }
                    var antes = m.t < mio.t || (m.t === mio.t && String(m.de) < MOD);
                    var cerrado = ms.some(function(x){ return x.de === m.de && x.tipo === 'monte' && x.t >= m.t; });
                    if (antes && !cerrado && mio.t - m.t < 5000) { espera = true; }
                });
            } catch (e) { espera = false; }
            if (espera && Date.now() - inicio < 5000) { setTimeout(mirar,250); } else { r.resolve(); }
        })();
        return r.promise();
    }
    // sinConfirmar: en partida viene una recarga; el reintento R2 de los 2 s competiria con ella (la escena nueva revisa de nuevo).
    function montar(code, forzar, sinConfirmar) {
        return cat().then(function(c){
            var firma = 'v' + c.version + ':' + contenido() + ':' + code;
            var estado = $.Deferred();
            leer(MARCA).done(function(m){
                if (forzar || m.firma !== firma) { estado.resolve({marca:true,vigente:false}); return; }
                centinelaOk(c,code).then(function(ok){estado.resolve({marca:true,vigente:ok});});
            }).fail(function(){estado.resolve({marca:false,vigente:false});});
            return estado.promise().then(function(e){
                // Sin cambios visibles (codigo 0) y sin marca previa: no montar las 86 fichas.
                if (e.vigente || (code === 0 && !e.marca)) { return {ok:true,cambio:false}; }
                var mio = canal('montando'), cerrar = $.Deferred();
                // 'monte' se publica siempre, tambien si falla la lectura o el montaje.
                cerrar.done(function(res){ canal('monte',res && res.ok ? {fichas:Object.keys(files).length - 1,hash:firma} : {ok:false}); });
                var files = {}, fallos = [], jobs = [];
                return turno(mio).then(function(){
                if (!c.specs || !c.specs.forEach) { console.error('[Unit Icons] anillos: catalogo sin specs'); cerrar.resolve({ok:false}); return {ok:false,cambio:false}; }   // jQuery 2 no captura throw en .then: devolver, no lanzar
                c.specs.forEach(function(s){
                    jobs.push(leer(s.ruta).then(function(d){
                        var raw = d && d.selection_icon && Number(d.selection_icon.diameter);
                        // Una definición efectiva puede heredar selection_icon: no inventar campos.
                        if (!isFinite(raw) || raw <= 0) { return; }
                        var base = decode(raw,c).diametro;
                        if (c.diametros.indexOf(base) < 0) { fallos.push(s.ruta); return; }
                        d.selection_icon.diameter = base + (code * c.paso + c.marca) / c.escala;
                        files[s.ruta] = JSON.stringify(d);
                    },function(){ fallos.push(s.ruta); return $.Deferred().resolve().promise(); }));
                });
                return $.when.apply($,jobs).then(function(){
                    if (fallos.length) { console.error('[Unit Icons] anillos: no montar, defs no compatibles=' + fallos.length); return {ok:false,cambio:false}; }
                    files[MARCA] = JSON.stringify({firma:firma,codigo:code,defs:c.specs.length});
                    var listo = $.Deferred();
                    try {
                        var pm = api.file.mountMemoryFiles(files);
                        if (!pm || typeof pm.then !== 'function') { pm = $.Deferred().resolve().promise(); }
                        pm.then(function(){
                            console.log('[Unit Icons] anillos vivos: codigo=' + code + ' defs=' + c.specs.length);
                            if (!forzar && !sinConfirmar) { confirmar(code,0); }
                            listo.resolve({ok:true,cambio:true,firma:firma});
                        },function(){listo.resolve({ok:false,cambio:false});});
                    } catch (e) { console.error('[Unit Icons] anillos: mountMemoryFiles lanzo', e); listo.resolve({ok:false,cambio:false}); }
                    return listo.promise();
                }).then(function(res){ cerrar.resolve(res); return res; },function(err){ cerrar.resolve({ok:false}); return $.Deferred().reject(err).promise(); });
                }).always(function(){ if (cerrar.state() === 'pending') { cerrar.resolve({ok:false}); } });   // excepcion sincrona tras 'montando': cerrar igual
            });
        });
    }
    // desdeMenu: al cerrar los ajustes en partida (revision inmediata). pedirRecarga decide quien recarga (una sola).
    function aplicarEnPartida(desdeMenu) {
        if (ocupado || rendido) { return; }   // el candado de recarga ya no corta el montaje (CON-001): solo retrasa la recarga
        ocupado = true;
        // Partidas con tag (GW, repeticiones): el mod monta fichas sin tag, asi que alli no actua (no verificado).
        api.game.getUnitSpecTag().then(function(tag){
            if (tag) { ocupado = false; rendido = true; console.log('[Unit Icons] anillos: partida con tag, no actuo'); return; }
            codigoPuente().then(function(code){ return montar(code,false,true); }).then(function recibido(r){
                // Coherent puede entregar la promesa nativa como valor, sin asimilarla.
                if (r && typeof r.then === 'function') { r.then(recibido,function(){ocupado = false;}); return; }
                if (!r.ok || !r.cambio) { ocupado = false; if (!r.ok) { rendido = true; } return; }
                // Tope de recargas: no repetir la misma firma antes de 60 s (si otro mod vuelve a pisar el centinela no entramos en bucle de F5; volver a un ajuste anterior mas tarde si recarga).
                var ultima = null; try { ultima = JSON.parse(sessionStorage.getItem(KEY + '.ultima') || 'null'); } catch (e) {}
                if (ultima && ultima.firma === r.firma && Date.now() - Number(ultima.t) < 60000) { rendido = true; ocupado = false; console.error('[Unit Icons] anillos: ya recargue por esta firma; otro mod pisa las fichas, no reintento'); return; }
                pedirRecarga(function(){
                    try {
                        sessionStorage.setItem(KEY + '.ultima',JSON.stringify({firma:r.firma,t:Date.now()}));
                        sessionStorage.setItem(KEY + '.reanudar',JSON.stringify(!(window.model && model.paused && model.paused())));
                    } catch (e) {}
                    try { api.game.setUnitSpecTag(''); } catch (e) { console.error('[Unit Icons] anillos: setUnitSpecTag lanzo', e); }
                    setTimeout(function(){
                        try { api.game.debug.reloadScene(api.Panel.pageId); } catch (e) { console.error('[Unit Icons] anillos: reloadScene lanzo', e); }
                        finally { ocupado = false; }
                    },1000);
                });
            },function(){ocupado = false; rendido = true; console.error('[Unit Icons] anillos: no pude leer el catálogo ni el puente; no reintento en esta partida');});
        },function(){ocupado = false; rendido = true; console.error('[Unit Icons] anillos: no pude obtener el tag');});
    }
    IconosOpc.Anillos = {codigo:codigo,decode:decode,montar:montar,aplicarEnPartida:aplicarEnPartida};
    canal('hola',{version:'1.0.5'});
    var escena = String(window.location.href);
    if (/(?:\/start\/start|\/new_game\/new_game|\/connect_to_game\/connect_to_game)\.html/.test(escena)) { montar(codigo()); }
    if (/\/live_game\/live_game\.html/.test(escena)) {
        if (sessionStorage.getItem(KEY + '.reanudar') === 'true') {
            sessionStorage.removeItem(KEY + '.reanudar');
            // Solo en partida local: en multijugador otro jugador pudo pausar en ese intervalo y playSim() quitaria su pausa.
            setTimeout(function(){if (window.model && model.playSim && model.isLocalGame && model.isLocalGame()) { model.playSim(); }},2000);
        }
        setInterval(aplicarEnPartida,5000);
        // Cerrar el menu de ajustes: revisar ya (Weapon FX hace lo mismo), asi los dos montan casi a la vez y hay una sola recarga.
        try { if (window.model && model.showSettings && model.showSettings.subscribe) { model.showSettings.subscribe(function(v){ if (!v) { setTimeout(function(){ aplicarEnPartida(true); },300); } }); } } catch (e) {}
    }
})();
