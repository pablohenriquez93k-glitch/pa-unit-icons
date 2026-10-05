// Scenes live_game_selection y live_game_build_bar: opacity CSS de los retratos (mezcla lineal, sin sqrt).
(function () {
    var anterior = null;
    function aplicar(valor) {
        var o = typeof valor === 'number' && isFinite(valor) ? Math.max(0, Math.min(100, valor)) / 100 : IconosOpc.ui();
        if (o === anterior) { return; }
        anterior = o;
        var st = document.getElementById('iconos_ui_css');
        if (!st) { st = document.createElement('style'); st.id = 'iconos_ui_css'; document.head.appendChild(st); }
        st.textContent = '.img_selected_unit, .img_build_unit { opacity: ' + o + '; }';
    }
    try { if (api.settings.load) { api.settings.load(true, true); } } catch (e) {}
    aplicar();
    // Los subpaneles no reciben showSettings: usar el mismo puente en memoria que el atlas.
    setInterval(function () {
        $.ajax({ url: 'coui://' + IconosOpc.RUTA_MEM, cache: false, dataType: 'json' }).done(function (d) {
            if (d) { aplicar(Number(d.u)); }
        });
    }, 1000);
    try { if (window.model && model.showSettings) { model.showSettings.subscribe(function (v) { if (!v) { api.settings.loadLocalData(); aplicar(); } }); } } catch (e) {}
})();
