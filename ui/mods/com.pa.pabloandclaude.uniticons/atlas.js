// Scene icon_atlas: el atlas (origen atlas://, localStorage propio vacio) lee las opciones de un archivo en memoria que montan las otras scenes.
// Cambiar el DOM del atlas actualiza la textura en vivo (probado), sin reiniciar.
// e = alpha objetivo % (opacity = sqrt, el motor aplica el alpha dos veces); s = skin ('original' o carpeta); z = tamano % (transform: scale por icono, limitado por bbox).
(function () {
    var RUTA = 'coui://' + IconosOpc.RUTA_MEM;
    var MODID = IconosOpc.G;
    var BASE = 'coui://ui/mods/' + MODID + '/';
    var cur = { e: null, cfg: null, txt: null };
    var bbox = null, cats = null;
    function nombre(img) {
        var m = /icon_si_(.+)\.png/.exec(img.getAttribute('data-n') || img.getAttribute('src') || '');
        return m ? m[1] : null;
    }
    function aplicarImgs() {
        var imgs = document.querySelectorAll('#page img');
        var cfg = cur.cfg || { s: 'original', z: 100 };
        for (var i = 0; i < imgs.length; i++) {
            var im = imgs[i], n = nombre(im);
            if (!n) { continue; }
            if (!im.hasAttribute('data-src0')) { im.setAttribute('data-src0', im.getAttribute('src') || ''); }
            if (!im.getAttribute('data-n')) { im.setAttribute('data-n', 'icon_si_' + n + '.png'); }
            var r = IconosOpc.resolver(n, cfg, cats, bbox);
            var src = im.getAttribute('data-src0');
            if (r.blipColor) { src = BASE + 'blips/' + r.skin + '/icon_si_blip_' + r.blipColor + '.png'; }
            else if (r.skin !== 'original') { src = BASE + 'skins/' + r.skin + '/icon_si_' + n + '.png'; }
            if (im.getAttribute('src') !== src) { im.setAttribute('data-skin', r.blipColor ? 'blip' : r.skin); im.setAttribute('src', src); }
            im.style.webkitTransform = r.escala === 1 ? '' : 'scale(' + r.escala + ')';
            // marcador de factor para particle_icon.vs: 1 pixel (0,0) de la celda, bajo la imagen
            var mc = r.marca ? 'linear-gradient(rgb(' + r.marca + ',5,250),rgb(' + r.marca + ',5,250)) no-repeat 0 0 / 1px 1px' : '';
            if (im.style.background !== mc) { im.style.background = mc; }
            im.style.opacity = r.e === null ? '' : String(Math.sqrt(Math.max(0, Math.min(100, r.e)) / 100));   // sin valor propio: regla global
        }
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
            cur.cfg = { s: typeof d.s === 'string' ? d.s : 'original', z: z, sd: d.sd || {}, zc: d.zc || {}, ec: d.ec || {}, eb: (d.eb === undefined ? null : d.eb), cb: typeof d.cb === 'string' ? d.cb : '' };
            if (e !== cur.e) { cur.e = e; css(); }
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
