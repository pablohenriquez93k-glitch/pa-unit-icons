// Scene icon_atlas: el atlas (origen atlas://, localStorage propio vacio) lee las opciones de un archivo en memoria que montan las otras scenes.
// Cambiar el DOM del atlas actualiza la textura en vivo (probado), sin reiniciar.
// e = alpha objetivo % (opacity = sqrt, el motor aplica el alpha dos veces); s = skin ('original' o carpeta); z = tamano % (transform: scale por icono, limitado por bbox).
(function () {
    var RUTA = 'coui://' + IconosOpc.RUTA_MEM;
    var MODID = IconosOpc.G;
    var BASE = 'coui://ui/mods/' + MODID + '/';
    var cur = { e: null, cfg: null, txt: null, q: 1 };
    var bbox = null, cats = null;
    function nombre(img) {
        var m = /icon_si_(.+)\.png/.exec(img.getAttribute('data-n') || img.getAttribute('src') || '');
        return m ? m[1] : null;
    }
    function aplicarImgs() {
        var imgs = document.querySelectorAll('#page img');
        var cfg = cur.cfg || { s: 'original', z: 100, q: 1 };
        for (var i = 0; i < imgs.length; i++) {
            var im = imgs[i], n = nombre(im);
            if (!n) { continue; }
            if (!im.hasAttribute('data-src0')) { im.setAttribute('data-src0', im.getAttribute('src') || ''); }
            if (!im.getAttribute('data-n')) { im.setAttribute('data-n', 'icon_si_' + n + '.png'); }
            var r = IconosOpc.resolver(n, cfg, cats, bbox);
            var src = im.getAttribute('data-src0');
            if (r.blipColor) { src = BASE + 'blips/' + (r.skin === 'original_hd' ? 'original' : r.skin) + '/icon_si_blip_' + r.blipColor + '.png'; }
            else if (r.metalColor) { src = BASE + 'metal/icon_si_metal_splat_02_' + r.metalColor + '.png'; }
            else if (r.cm) { src = BASE + 'comandantes' + (r.q > 1 ? '_' + (52 * r.q) : '') + '/' + r.cm + '.png'; }
            else if (r.skin !== 'original' && !(r.skin === 'original_hd' && r.q === 1)) { src = BASE + (r.q > 1 ? 'skins_' + (52 * r.q) : 'skins') + '/' + r.skin + '/icon_si_' + n + '.png'; }
            if (im.getAttribute('src') !== src) { im.setAttribute('data-skin', r.blipColor ? 'blip' : r.metalColor ? 'metal' : r.cm ? 'cmd' : r.skin); im.setAttribute('src', src); }
            im.style.webkitTransform = r.escala === 1 ? '' : 'scale(' + r.escala + ')';
            // marcador de factor para particle_icon.vs: 1 pixel (0,0) de la celda, bajo la imagen
            var mc = r.marca ? 'linear-gradient(rgb(' + r.marca + ',' + (5 * r.q) + ',250),rgb(' + r.marca + ',' + (5 * r.q) + ',250)) no-repeat 0 0 / ' + r.q + 'px ' + r.q + 'px' : '';
            if (im.style.background !== mc) { im.style.background = mc; }
            var op = Math.sqrt(Math.max(0, Math.min(100, r.e === null ? (cur.e === null ? 100 : cur.e) : r.e)) / 100);
            if (r.marca && op < 1) {
                // la opacidad CSS bajaria tambien el alfa del marcador y el shader lo descartaria (icono al tamano de la celda):
                // se aplica con una mascara que deja opaco el marcador (q x q px)
                im.style.opacity = '1';
                im.style.webkitMaskImage = 'linear-gradient(#000,#000),linear-gradient(rgba(0,0,0,' + op + '),rgba(0,0,0,' + op + '))';
                im.style.webkitMaskSize = r.q + 'px ' + r.q + 'px,100% 100%';
                im.style.webkitMaskPosition = '0 0,0 0';
                im.style.webkitMaskRepeat = 'no-repeat,no-repeat';
            } else {
                im.style.webkitMaskImage = '';
                im.style.opacity = r.e === null ? '' : String(op);   // sin valor propio: regla global
            }
        }
    }
    // Calidad: el tamano de celda del atlas (52 / 104 / 208 px). El original envia 52; con otra calidad se reenvia la lista con la celda nueva.
    function celda(q) {
        if (q === cur.q) { return; }
        cur.q = q;
        var st = document.getElementById('iconos_celda_css');
        if (!st) { st = document.createElement('style'); st.id = 'iconos_celda_css'; document.head.appendChild(st); }
        st.textContent = q === 1 ? '' : '#page img { width: ' + (52 * q) + 'px; height: ' + (52 * q) + 'px; }';
        try { if (window.model && model.strategicIcons) { engine.call('handle_icon_list', model.strategicIcons(), 52 * q); } } catch (e) { console.error('[Unit Icons] handle_icon_list', e); }
    }
    function css() {
        var o = Math.sqrt(Math.max(0, Math.min(100, cur.e === null ? 100 : cur.e)) / 100);
        var st = document.getElementById('iconos_atlas_css');
        if (!st) { st = document.createElement('style'); st.id = 'iconos_atlas_css'; document.head.appendChild(st); }
        st.textContent = '#page img { opacity: ' + o + '; }';
    }
    // si un PNG de skin no existe, volver al original
    document.addEventListener('error', function (ev) {
        var t = ev.target;
        if (t && t.tagName === 'IMG' && t.getAttribute('data-skin') && t.getAttribute('data-skin') !== 'original') {
            var n = nombre(t);
            t.setAttribute('data-skin', 'original');
            if (n && t.hasAttribute('data-src0')) { t.setAttribute('src', t.getAttribute('data-src0')); }
        }
    }, true);
    function leer() {
        $.ajax({ url: RUTA, cache: false, dataType: 'json' }).done(function (d) {
            if (!d) { return; }
            var e = Number(d.e);
            if (!isFinite(e)) { e = 100; }
            var txt = JSON.stringify(d);
            if (txt === cur.txt && e === cur.e) { return; }
            cur.txt = txt;
            var z = Number(d.z); if (!isFinite(z) || z <= 0) { z = 100; }
            cur.cfg = { s: typeof d.s === 'string' ? d.s : 'original', cm: typeof d.cm === 'string' ? d.cm : '', q: (Number(d.q) === 2 || Number(d.q) === 4) ? Number(d.q) : 1, z: z, sd: d.sd || {}, zc: d.zc || {}, ec: d.ec || {}, eb: (d.eb === undefined ? null : d.eb), cb: typeof d.cb === 'string' ? d.cb : '', mt: typeof d.mt === 'string' ? d.mt : '' };
            if (e !== cur.e) { cur.e = e; css(); }
            celda(cur.cfg.q);
            aplicarImgs();
        });
    }
    function cargarBbox() {
        $.ajax({ url: BASE + 'bbox.json', cache: false, dataType: 'json' }).done(function (d) { bbox = d; aplicarImgs(); });
        $.ajax({ url: BASE + 'categorias.json', cache: false, dataType: 'json' }).done(function (d) { cats = d; aplicarImgs(); });
    }
    css();
    cargarBbox();
    leer();
    if (window.model && model.strategicIcons && model.strategicIcons.subscribe) {
        model.strategicIcons.subscribe(function () { setTimeout(aplicarImgs, 0); });
    }
    setInterval(leer, 1000);
})();
