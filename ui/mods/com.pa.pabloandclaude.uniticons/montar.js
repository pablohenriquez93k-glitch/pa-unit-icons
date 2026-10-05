// Scenes start y live_game: publica la opcion en memoria para el atlas.
(function () {
    try { api.settings.load(true, true); } catch (e) {}
    IconosOpc.montar();
    console.log('[Unit Icons] montado: skin=' + IconosOpc.skin() + ' tamano=' + IconosOpc.tam() + ' alpha=' + Math.round(IconosOpc.estrategico() * 100));
})();
