// Scene settings: pestaña ICONOS. Opciones: estrategico (alpha objetivo %) y ui (opacity %).
(function () {
    var G = IconosOpc.G;
    if (IconosOpc.registrarIdiomas) { IconosOpc.registrarIdiomas(); }
    var L = function (t) { return '!LOC:' + t; };
    var niveles = ['100', '90', '80', '70', '60', '50', '40', '30', '20', '10'];
    var textos = niveles.map(function (n) { return n + '%'; });
    var skins = ['original', '2_hueca', '4_bisel'];
    var skinTxt = ['Original (game icons)', 'Outline', 'Bevel'].map(L);
    var tams = ['75', '90', '100', '110', '125', '150', '175', '200', '250', '300', '350'];
    var gl = L('Same as general');
    var textosGl = [gl].concat(textos), nivelesGl = ['global'].concat(niveles);
    var tamsGl = ['global'].concat(tams), tamsTxt = [gl].concat(tams.map(function (n) { return n + '%'; }));
    var skinsGl = ['global'].concat(skins), skinTxtGl = [gl].concat(skinTxt);
    var colores = ['equipo', 'rojo', 'amarillo', 'verde', 'cian', 'azul', 'magenta', 'blanco'];
    var coloresTxt = ['Team color', 'Red', 'Yellow', 'Green', 'Cyan', 'Blue', 'Magenta', 'White'].map(L);
    var presets = ['custom', 'default', 'discreet', 'contrast'];
    var presetsTxt = ['Custom', 'Default', 'Discreet', 'High contrast'].map(L);
    var defs = {
        title: L('ICONS'),
        local_only: true,
        settings: {
            skin: { title: L('Icon style'), type: 'select', options: skins, optionsText: skinTxt, default: 'original' },
            tamano: { title: L('Strategic icon size'), type: 'select', options: tams, optionsText: tams.map(function (n) { return n + '%'; }), default: '100' },
            estrategico: { title: L('Strategic icon opacity'), type: 'select', options: niveles, optionsText: textos, default: '100' },
            ui: { title: L('Unit portrait opacity (selection / build bar)'), type: 'select', options: niveles, optionsText: textos, default: '100' },
            sk_tierra: { title: L('Style: land units'), type: 'select', options: skinsGl, optionsText: skinTxtGl, default: 'global' },
            sk_naval: { title: L('Style: naval units'), type: 'select', options: skinsGl, optionsText: skinTxtGl, default: 'global' },
            sk_aire: { title: L('Style: air units'), type: 'select', options: skinsGl, optionsText: skinTxtGl, default: 'global' },
            sk_orbital: { title: L('Style: orbital units'), type: 'select', options: skinsGl, optionsText: skinTxtGl, default: 'global' },
            sk_estructura: { title: L('Style: structures'), type: 'select', options: skinsGl, optionsText: skinTxtGl, default: 'global' },
            z_unidades: { title: L('Size: units'), type: 'select', options: tamsGl, optionsText: tamsTxt, default: 'global' },
            z_edificios: { title: L('Size: structures'), type: 'select', options: tamsGl, optionsText: tamsTxt, default: 'global' },
            z_orbital: { title: L('Size: orbital units'), type: 'select', options: tamsGl, optionsText: tamsTxt, default: 'global' },
            e_unidades: { title: L('Opacity: units'), type: 'select', options: nivelesGl, optionsText: textosGl, default: 'global' },
            e_edificios: { title: L('Opacity: structures'), type: 'select', options: nivelesGl, optionsText: textosGl, default: 'global' },
            e_orbital: { title: L('Opacity: orbital units'), type: 'select', options: nivelesGl, optionsText: textosGl, default: 'global' },
            e_blip: { title: L('Blip opacity'), type: 'select', options: nivelesGl, optionsText: textosGl, default: 'global' },
            c_blip: { title: L('Blip color'), type: 'select', options: colores, optionsText: coloresTxt, default: 'equipo' },
            anillo_seleccion: { title: L('Selection ring style'), type: 'select', options: ['original', 'dom314'], optionsText: ['Default', 'Rainbow (dom314)'].map(L), default: 'original' },
            anillo_hover: { title: L('Hover ring color'), type: 'select', options: ['original'].concat(colores.slice(1)), optionsText: [L('Default')].concat(coloresTxt.slice(1)), default: 'original' },
            preajuste: { title: L('Preset'), type: 'select', options: presets, optionsText: presetsTxt, default: 'custom' }
        }
    };
    api.settings.definitions[G] = defs;
    var PRESETS = {
        default: {},
        discreet: { estrategico: '60', tamano: '90', e_blip: '40' },
        contrast: { skin: '4_bisel', tamano: '110', estrategico: '100' }
    };
    function opt(k) { return '<div class="option" data-bind="template: { name: \'setting-template\', data: $root.settingsItemMap()[\'' + G + '.' + k + '\'] }"></div>'; }
    function grupo(titulo, claves, extra) {
        return '<div class="form-group"><div class="sub-group-title" data-bind="text: loc(\'!LOC:' + titulo + '\')"></div><div class="sub-group top">' + claves.map(opt).join('') + (extra || '') + '</div></div>';
    }
    var html =
        '<div class="option-list iconos" style="max-height:100%;overflow-y:auto" data-bind="visible: ($root.settingGroups().indexOf(\'' + G + '\') === $root.activeSettingsGroupIndex())">' +
        '<div class="option iconos-aviso" style="padding:6px 0;font-style:italic" data-bind="text: loc(\'!LOC:Want an icon added to the mod? Let us know in the Planetary Annihilation Discord, channel #making-mods.\')"></div>' +
        grupo('UNIT ICONS', ['skin', 'tamano', 'estrategico', 'ui'], '<div class="option"><div class="iconos-prev" style="padding:6px 0"></div></div>') +
        grupo('STYLE BY DOMAIN', ['sk_tierra', 'sk_naval', 'sk_aire', 'sk_orbital', 'sk_estructura']) +
        grupo('SIZE AND OPACITY BY CATEGORY', ['z_unidades', 'z_edificios', 'z_orbital', 'e_unidades', 'e_edificios', 'e_orbital']) +
        grupo('RADAR BLIPS', ['e_blip', 'c_blip']) +
        grupo('SELECTION AND HOVER RINGS', ['anillo_seleccion', 'anillo_hover'], '<div class="option" data-bind="text: loc(\'!LOC:Ring changes reload the game view.\')"></div>') +
        grupo('PRESETS AND RESET', ['preajuste'], '<div class="option"><button class="btn iconos-reset" data-bind="text: loc(\'!LOC:Reset to defaults\')"></button></div><div class="option" data-bind="text: loc(\'!LOC:Translations are automatic and may contain errors.\')"></div>') +
        '</div>';
    if ($('.container_settings').length) { $('.container_settings').append(html); } else { $(function () { $('.container_settings').append(html); }); }
    if (window.model && model.settingDefinitions) { model.settingDefinitions(api.settings.definitions); model.settingDefinitions.valueHasMutated(); }

    // Vista previa, preajustes y restablecer: se enganchan cuando el modelo de Ajustes ya tiene los items.
    var BASE = 'coui://ui/mods/' + G + '/';
    var DOMS = ['tierra', 'naval', 'aire', 'orbital', 'estructura'];
    var aplicando = false;
    // Guarda solo el grupo de este mod (model.save() guardaria tambien cambios pendientes de otras pestanas y aplicaria graficos).
    function guardarGrupo() {
        try {
            var k = api.settings.localStorageKey(), st = JSON.parse(localStorage.getItem(k) || '{}');
            if (api.settings.data && api.settings.data[G]) { st[G] = JSON.parse(JSON.stringify(api.settings.data[G])); localStorage.setItem(k, JSON.stringify(st)); }
            IconosOpc.montar();
        } catch (e) { console.error('[Unit Icons] no pude guardar los ajustes', e); }
    }
    function val(map, k) { try { return String(map[G + '.' + k].value()); } catch (e) { return ''; } }
    function vistaPrevia(map) {
        var box = $('.iconos-prev'); if (!box.length) { return; }
        var sg = val(map, 'skin') || 'original';
        box.html(DOMS.map(function (d) {
            var sk = val(map, 'sk_' + d); if (!sk || sk === 'global') { sk = sg; }
            return '<img src="' + BASE + 'previews/' + sk + '/' + d + '.png" style="width:52px;height:52px;margin-right:6px;image-rendering:pixelated"/>';
        }).join(''));
    }
    function engancharse() {
        var map = window.model && model.settingsItemMap && model.settingsItemMap();
        if (!map || !map[G + '.skin'] || !$('.iconos-prev').length) { return false; }
        var claves = Object.keys(defs.settings);
        claves.forEach(function (k) {
            var it = map[G + '.' + k]; if (!it || !it.value || !it.value.subscribe) { return; }
            it.value.subscribe(function (v) {
                if (k === 'preajuste') {
                    if (aplicando || v === 'custom' || !PRESETS[v]) { return; }
                    aplicando = true;
                    claves.forEach(function (c) { if (c !== 'preajuste') { map[G + '.' + c].value(defs.settings[c].default); } });
                    Object.keys(PRESETS[v]).forEach(function (c) { map[G + '.' + c].value(PRESETS[v][c]); });
                    aplicando = false; guardarGrupo();
                } else if (!aplicando && val(map, 'preajuste') !== 'custom') {
                    aplicando = true; map[G + '.preajuste'].value('custom'); aplicando = false;
                }
                vistaPrevia(map);
            });
        });
        $('.iconos-reset').off('click').on('click', function () {
            aplicando = true;
            claves.forEach(function (k) { map[G + '.' + k].value(defs.settings[k].default); });
            aplicando = false; guardarGrupo(); vistaPrevia(map);
        });
        vistaPrevia(map); return true;
    }
    var intentos = 0, timer = setInterval(function () { if (engancharse() || ++intentos > 100) { clearInterval(timer); } }, 300);
})();

// Al guardar, publicar el valor nuevo para el atlas (el atlas lo lee en vivo).
(function () {
    var s0 = api.settings.save;
    api.settings.save = function () { var r = s0.apply(this, arguments); try { IconosOpc.montar(); } catch (e) {} return r; };
})();
