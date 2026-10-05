// Shaders estáticos: opciones en selection_icon.diameter, sin recompilar.
// Firma nueva en partida: montar specs -> tag vigente -> F5 (patrón WFX).
(function () {
    'use strict';
    var G = IconosOpc.G, MARCA = '/ui/mods/' + G + '/anillos_estado.json';
    var catalogo, ocupado = false, rendido = false, KEY = G + '.recargaAnillos';
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
    function montar(code) {
        return cat().then(function(c){
            var firma = 'v' + c.version + ':' + contenido() + ':' + code;
            var estado = $.Deferred();
            leer(MARCA).done(function(m){estado.resolve({marca:true,vigente:m.firma === firma});}).fail(function(){estado.resolve({marca:false,vigente:false});});
            return estado.promise().then(function(e){
                // Sin cambios visibles (codigo 0) y sin marca previa: no montar las 86 fichas.
                if (e.vigente || (code === 0 && !e.marca)) { return {ok:true,cambio:false}; }
                var files = {}, fallos = [], jobs = [];
                c.specs.forEach(function(s){
                    jobs.push(leer(s.ruta).then(function(d){
                        var raw = d.selection_icon && Number(d.selection_icon.diameter);
                        // Una definición efectiva puede heredar selection_icon: no inventar campos.
                        if (!isFinite(raw) || raw <= 0) { return; }
                        var base = decode(raw,c).diametro;
                        if (c.diametros.indexOf(base) < 0) { fallos.push(s.ruta); return; }
                        d.selection_icon.diameter = base + (code * c.paso + c.marca) / c.escala;
                        files[s.ruta] = JSON.stringify(d);
                    },function(){fallos.push(s.ruta);}));
                });
                return $.when.apply($,jobs).then(function(){
                    if (fallos.length) { console.error('[Unit Icons] anillos: no montar, defs no compatibles=' + fallos.length); return {ok:false,cambio:false}; }
                    files[MARCA] = JSON.stringify({firma:firma,codigo:code,defs:c.specs.length});
                    var listo = $.Deferred();
                    api.file.mountMemoryFiles(files).then(function(){
                        console.log('[Unit Icons] anillos vivos: codigo=' + code + ' defs=' + c.specs.length);
                        listo.resolve({ok:true,cambio:true});
                    },function(){listo.resolve({ok:false,cambio:false});});
                    return listo.promise();
                });
            });
        });
    }
    function aplicarEnPartida() {
        if (ocupado || rendido || Date.now() - Number(sessionStorage.getItem(KEY) || 0) < 20000) { return; }
        ocupado = true;
        // Partidas con tag (GW, repeticiones): el mod monta fichas sin tag, asi que alli no actua (no verificado).
        api.game.getUnitSpecTag().then(function(tag){
            if (tag) { ocupado = false; rendido = true; console.log('[Unit Icons] anillos: partida con tag, no actuo'); return; }
            codigoPuente().then(montar).then(function recibido(r){
                // Coherent puede entregar la promesa nativa como valor, sin asimilarla.
                if (r && typeof r.then === 'function') { r.then(recibido,function(){ocupado = false;}); return; }
                if (!r.ok || !r.cambio) { ocupado = false; if (!r.ok) { rendido = true; } return; }
                sessionStorage.setItem(KEY,String(Date.now()));
                sessionStorage.setItem(KEY + '.reanudar',JSON.stringify(!(window.model && model.paused && model.paused())));
                api.game.setUnitSpecTag('');
                setTimeout(function(){api.game.debug.reloadScene(api.Panel.pageId); ocupado = false;},1000);
            },function(){ocupado = false; rendido = true; console.error('[Unit Icons] anillos: no pude leer el catálogo ni el puente; no reintento en esta partida');});
        },function(){ocupado = false; rendido = true; console.error('[Unit Icons] anillos: no pude obtener el tag');});
    }
    IconosOpc.Anillos = {codigo:codigo,decode:decode,montar:montar,aplicarEnPartida:aplicarEnPartida};
    var escena = String(window.location.href);
    if (/(?:\/start\/start|\/new_game\/new_game|\/connect_to_game\/connect_to_game)\.html/.test(escena)) { montar(codigo()); }
    if (/\/live_game\/live_game\.html/.test(escena)) {
        if (sessionStorage.getItem(KEY + '.reanudar') === 'true') {
            sessionStorage.removeItem(KEY + '.reanudar');
            // Solo en partida local: en multijugador otro jugador pudo pausar en ese intervalo y playSim() quitaria su pausa.
            setTimeout(function(){if (window.model && model.playSim && model.isLocalGame && model.isLocalGame()) { model.playSim(); }},2000);
        }
        setInterval(aplicarEnPartida,5000);
    }
})();
