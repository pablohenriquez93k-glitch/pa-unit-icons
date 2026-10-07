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
    function calidadOk(v) { return v === '2' || v === '4' ? Number(v) : 1; }   // factor de resolucion: 1 = 52 px, 2 = 104 px, 4 = 208 px
    var COMANDANTES = ['c04', 'c01', 'c02', 'c03', 'c05', 'c06', 'c07', 'c08', 'c09', 'c10', 'c11', 'c12', 'c13', 'c14', 'c15', 'c16', 'c17', 'c18', 'c19', 'c20', 'c21'];
    function comandanteOk(v) { return v === 'original' || COMANDANTES.indexOf(v) >= 0 ? v : 'c04'; }   // icono de comandante: 'original' o una de las 21 variantes (por defecto c04)
    function skinOk(v) { return v === '2_hueca' || v === '4_bisel' || v === 'original_hd' ? v : 'original'; }
    function numOpc(clave, min, max) {   // 'global' (o invalido) -> null
        var v = txt(clave, 'global');
        if (v === 'global') { return null; }
        v = Number(v);
        return isFinite(v) ? Math.max(min, Math.min(max, v)) : null;
    }
    return {
        G: G, estrategico: function () { return pct('estrategico'); }, ui: function () { return pct('ui'); },
        skin: function () { return skinOk(txt('skin', 'original')); },
        calidad: function () { return calidadOk(txt('calidad', '1')); },
        tam: function () { var v = Number(txt('tamano', '100')); return isFinite(v) ? Math.max(50, Math.min(350, v)) : 100; },
        DOMINIOS: DOMINIOS, CATS: CATS, COLORES: COLORES,
        anillos: function () {
            var s = txt('anillo_seleccion', 'original'), h = txt('anillo_hover', 'original');
            return { seleccion: s === 'dom314' ? s : 'original', hover: COLORES.indexOf(h) >= 0 ? h : 'original' };
        },
        // Configuracion completa para el atlas (ico-30). Por defecto todo 'global': mismo comportamiento que antes.
        cfg: function () {
            var sd = {}, zc = {}, ec = {};
            DOMINIOS.forEach(function (d) { var v = txt('sk_' + d, 'global'); sd[d] = v === 'global' ? null : skinOk(v); });
            CATS.forEach(function (c) { zc[c] = numOpc('z_' + c, 50, 350); ec[c] = numOpc('e_' + c, 0, 100); });
            var cb = txt('c_blip', 'equipo');
            return { e: Math.round(pct('estrategico') * 100), u: Math.round(pct('ui') * 100), s: skinOk(txt('skin', 'original')), q: calidadOk(txt('calidad', '1')), cm: comandanteOk(txt('comandante', 'c04')), z: IconosOpc_tam(),
                     sd: sd, zc: zc, ec: ec, eb: numOpc('e_blip', 0, 100), cb: COLORES.indexOf(cb) >= 0 ? cb : '', ar: codigoAnillos() };
        }
    };
    // Codigo de anillos (0 = sin cambios): lo publica iconos_valor.json para que live_game no sondee los ajustes.
    function codigoAnillos() {
        var a = IconosOpc.anillos(), h = COLORES.indexOf(a.hover) + 1;
        return (a.seleccion === 'dom314' ? 8 : 0) + Math.max(0, h);
    }
    function IconosOpc_tam() { var v = Number(txt('tamano', '100')); return isFinite(v) ? Math.max(50, Math.min(350, v)) : 100; }
})();

// Resolucion por icono (pura, probada en VM): que skin/PNG, tamano y opacidad le tocan a cada nombre segun cfg + categorias + bbox.
// Con la cfg por defecto (todo null) devuelve lo mismo que el atlas anterior a ico-30.
IconosOpc.UMBRAL_SHADER = 150;   // z (%) a partir del cual el tamano lo da el shader (marcador R = z/5, G = 5, B = 250 en el pixel 0,0 de la celda)
// Iconos de comandante (tambien los cosmeticos): la variante elegida los sustituye (carpetas comandantes, comandantes_104 y comandantes_208: <variante>.png).
IconosOpc.COMANDANTES = ['commander', 'commander_beast_king', 'commander_kapowaz', 'commander_pumpkin', 'commander_unicorn', 'bot_support_commander', 'tutorial_titan_commander'];
IconosOpc.OBJETOS_MAPA = ['metal_splat_02', 'energy_spot_01', 'control_point_01'];
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
    // Hasta UMBRAL_SHADER: escala CSS dentro de la celda (tope 52/d). Por encima: marcador para particle_icon.vs (quad mas grande), sin escala CSS.
    var q = (cfg.q === 2 || cfg.q === 4) ? cfg.q : 1;
    // Elementos del mapa (puntos de metal/energia, punto de control): el motor los dibuja sin leer el marcador y al tamano de la celda -> con calidad > 1 se encogen con CSS 1/q.
    var objeto = q > 1 && IconosOpc.OBJETOS_MAPA.indexOf(n) >= 0;
    var marca = !objeto && (z > IconosOpc.UMBRAL_SHADER || q > 1) ? Math.round(Math.min(z, 350) / 5) : 0;   // con calidad > 1 el shader fija siempre el tamano (el motor dibuja la celda 52*q px)
    return { skin: skEf, q: q, cm: (cfg.cm && cfg.cm !== 'original' && IconosOpc.COMANDANTES.indexOf(n) >= 0) ? cfg.cm : '', blipColor: (info.c === 'blip' && cfg.cb) ? cfg.cb : '', escala: objeto ? (z > IconosOpc.UMBRAL_SHADER ? 1 : (zf > 1 ? Math.min(zf, 52 / d) : zf)) / q : (marca ? 1 : (zf > 1 ? Math.min(zf, 52 / d) : zf)), e: e, marca: marca };
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
