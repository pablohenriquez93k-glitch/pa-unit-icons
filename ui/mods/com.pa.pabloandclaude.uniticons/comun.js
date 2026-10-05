// Lee las opciones del tab ICONOS (grupo "iconos"). Cualquier scene.
// alpha objetivo T (0..1) del icono estratégico: el motor aplica el alpha dos veces, por eso CSS opacity = sqrt(T) en el atlas.
var IconosOpc = (function () {
    var G = 'com.pa.pabloandclaude.uniticons';
    // Migrar una vez los ajustes antiguos sin compartir escrituras entre identifiers.
    try {
        api.settings.loadLocalData();
        var datos = api.settings.data;
        if (datos && !datos[G] && datos.iconos) {
            datos[G] = JSON.parse(JSON.stringify(datos.iconos));
            localStorage.setItem(api.settings.localStorageKey(), JSON.stringify(datos));
        }
    } catch (e) {}
    function pct(clave) {
        var v = 100;
        try {
            if (window.api && api.settings) { v = Number(api.settings.value(G, clave)); }
        } catch (e) { v = 100; }
        if (!isFinite(v)) { v = 100; }
        return Math.max(0, Math.min(100, v)) / 100;
    }
    function txt(clave, def) {
        var v = def;
        try { if (window.api && api.settings) { v = api.settings.value(G, clave); } } catch (e) { v = def; }
        return (v === undefined || v === null || v === '') ? def : String(v);
    }
    var DOMINIOS = ['tierra', 'naval', 'aire', 'orbital', 'estructura'];
    var CATS = ['unidades', 'edificios', 'orbital'];
    var COLORES = ['rojo', 'amarillo', 'verde', 'cian', 'azul', 'magenta', 'blanco'];
    function skinOk(v) { return /^[0-9a-z_]+$/.test(v) ? v : 'original'; }
    function numOpc(clave, min, max) {   // 'global' (o invalido) -> null
        var v = txt(clave, 'global');
        if (v === 'global') { return null; }
        v = Number(v);
        return isFinite(v) ? Math.max(min, Math.min(max, v)) : null;
    }
    return {
        G: G, estrategico: function () { return pct('estrategico'); }, ui: function () { return pct('ui'); },
        skin: function () { return skinOk(txt('skin', 'original')); },
        tam: function () { var v = Number(txt('tamano', '100')); return isFinite(v) ? Math.max(50, Math.min(200, v)) : 100; },
        DOMINIOS: DOMINIOS, CATS: CATS, COLORES: COLORES,
        anillos: function () {
            var s = txt('anillo_seleccion', 'original'), h = txt('anillo_hover', 'original');
            return { seleccion: s === 'dom314' ? s : 'original', hover: COLORES.indexOf(h) >= 0 ? h : 'original' };
        },
        // Configuracion completa para el atlas (ico-30). Por defecto todo 'global': mismo comportamiento que antes.
        cfg: function () {
            var sd = {}, zc = {}, ec = {};
            DOMINIOS.forEach(function (d) { var v = txt('sk_' + d, 'global'); sd[d] = v === 'global' ? null : skinOk(v); });
            CATS.forEach(function (c) { zc[c] = numOpc('z_' + c, 50, 200); ec[c] = numOpc('e_' + c, 0, 100); });
            var cb = txt('c_blip', 'equipo');
            return { e: Math.round(pct('estrategico') * 100), u: Math.round(pct('ui') * 100), s: skinOk(txt('skin', 'original')), z: IconosOpc_tam(),
                     sd: sd, zc: zc, ec: ec, eb: numOpc('e_blip', 0, 100), cb: COLORES.indexOf(cb) >= 0 ? cb : '', ar: codigoAnillos() };
        }
    };
    // Codigo de anillos (0 = sin cambios): lo publica iconos_valor.json para que live_game no sondee los ajustes.
    function codigoAnillos() {
        var a = IconosOpc.anillos(), h = COLORES.indexOf(a.hover) + 1;
        return (a.seleccion === 'dom314' ? 8 : 0) + Math.max(0, h);
    }
    function IconosOpc_tam() { var v = Number(txt('tamano', '100')); return isFinite(v) ? Math.max(50, Math.min(200, v)) : 100; }
})();

// Resolucion por icono (pura, probada en VM): que skin/PNG, tamano y opacidad le tocan a cada nombre segun cfg + categorias + bbox.
// Con la cfg por defecto (todo null) devuelve lo mismo que el atlas anterior a ico-30.
IconosOpc.resolver = function (n, cfg, cats, bbox) {
    var info = (cats && cats[n]) || { c: 'otro', d: null };
    var sk = cfg.s || 'original';
    if (info.d && cfg.sd && cfg.sd[info.d]) { sk = cfg.sd[info.d]; }
    var tabla = (bbox && bbox[sk]) || {};
    var cubierto = Object.prototype.hasOwnProperty.call(tabla, n);
    var skEf = (sk !== 'original' && cubierto) ? sk : 'original';
    var z = (cfg.z || 100);
    if (cfg.zc && info.c in cfg.zc && cfg.zc[info.c] !== null && cfg.zc[info.c] !== undefined) { z = cfg.zc[info.c]; }
    var e = null;
    if (info.c === 'blip') { e = (cfg.eb === undefined) ? null : cfg.eb; }
    else if (cfg.ec && info.c in cfg.ec && cfg.ec[info.c] !== undefined) { e = cfg.ec[info.c]; }
    var d = (bbox && bbox[skEf] && bbox[skEf][n]) || 52;
    var zf = z / 100;
    return { skin: skEf, blipColor: (info.c === 'blip' && cfg.cb) ? cfg.cb : '', escala: zf > 1 ? Math.min(zf, 52 / d) : zf, e: e };
};

// Puente hacia el atlas (otro origen, sin acceso a los ajustes): archivo en memoria que el atlas lee por coui://.
IconosOpc.RUTA_MEM = '/ui/mods/' + IconosOpc.G + '/iconos_valor.json';
IconosOpc.montar = function () {
    try {
        var f = {};
        f[IconosOpc.RUTA_MEM] = JSON.stringify(IconosOpc.cfg());
        api.file.mountMemoryFiles(f);
    } catch (e) {}
};
