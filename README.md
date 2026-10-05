# Unit Icons

Client mod for **Planetary Annihilation: TITANS** (build 124683). Cosmetic only. / Mod cliente para **Planetary Annihilation: TITANS**. Solo cosmético.

Forum / Foro: https://github.com/pablohenriquez93k-glitch/pa-unit-icons/discussions/1

## What it does / Qué hace
- **EN:** Replaces the strategic unit icons with a domain × role icon system (31 glyphs). Choose the original icons or one of 5 skins (Flat, Outline, Bold, Bevel, Neon); style per domain (land, naval, air, orbital, structure); size and opacity per category; radar blip color; selection and hover ring options; presets and a reset button. 20 settings in the **ICONS** tab of Settings.
- **ES:** Reemplaza los iconos estratégicos de las unidades por un sistema de iconos dominio × rol (31 glifos). Elige los iconos originales o una de 5 skins (Plana, Hueca, Audaz, Bisel, Neón); estilo por dominio (tierra, mar, aire, orbital, estructura); tamaño y opacidad por categoría; color de los blips del radar; opciones de anillo de selección y de hover; preajustes y botón de restablecer. 20 ajustes en la pestaña **ICONOS** de Ajustes.

## Install / Instalar
- **EN:** Easiest: install **Unit Icons** from the in-game **Community Mods** index. Manual install: close the game and copy the contents of the downloaded package into `%LOCALAPPDATA%\Uber Entertainment\Planetary Annihilation\client_mods\com.pa.pabloandclaude.uniticons\` so that `modinfo.json` sits directly inside that folder.
- **ES:** Lo más fácil: instala **Unit Icons** desde el índice de **Community Mods** dentro del juego. Instalación manual: cierra el juego y copia el contenido del paquete descargado en `%LOCALAPPDATA%\Uber Entertainment\Planetary Annihilation\client_mods\com.pa.pabloandclaude.uniticons\` de modo que `modinfo.json` quede directamente dentro.

1. Open the game and enable **Unit Icons** in the Mods manager (client mod). / Abre el juego y activa **Unit Icons** en el gestor de Mods (mod cliente).
2. Settings → **ICONS**, pick your options and press **Save**. Ring changes reload the game view. / Ajustes → **ICONOS**, elige tus opciones y pulsa **Guardar**. Los cambios de anillo recargan la vista de la partida.

To remove it, disable it in the Mods manager (or close the game and delete that folder). / Para quitarlo, desactívalo en el gestor de Mods (o cierra el juego y borra esa carpeta).

## Translations / Traducciones
- **EN:** The ICONS tab is translated into 27 locales. **The translations are automatic and may contain errors.**
- **ES:** La pestaña ICONOS está traducida a 27 locales. **Las traducciones son automáticas y pueden contener errores.**

## Compatibility and limits / Compatibilidad y límites
- **EN:** The mod overrides 4 game shaders (`particle_icon.fs`, `unit_ring_selection.fs`, `unit_ring_hover.fs`, `particle_direct_ring_selection.vs`) with priority 150, so it wins over other mods that replace the same files. The ring options depend on the game's table of 50 selection diameters; if a game patch changes it, the ring feature turns itself off. Re-check after game patches. Rings in games with a unit tag (Galactic War, replays) are not verified: the mod does nothing there.
- **ES:** El mod pisa 4 shaders del juego (`particle_icon.fs`, `unit_ring_selection.fs`, `unit_ring_hover.fs`, `particle_direct_ring_selection.vs`) con prioridad 150, así que gana a otros mods que reemplacen los mismos archivos. Las opciones de anillo dependen de la tabla de 50 diámetros de selección del juego; si un parche la cambia, la función de anillos se apaga sola. Conviene revisarlo tras cada parche. Los anillos en partidas con tag (Galactic War, repeticiones) no están verificados: allí el mod no actúa.

## Credits / Créditos
- **dom314** — *Rainbow Circle Ring*: https://forums.uberent.com/threads/rel-client-rainbow-ring.71299/#post-1123827
  - **EN:** The "Rainbow (dom314)" selection-ring option adapts code from that mod (the `hsv2rgb` function and the rainbow block in `shaders/unit_ring_selection.fs`). dom314 published **no license**. Pablo contacted the author on Discord; there has been no reply. The authors of this mod treat the code, with attribution, as if it were MIT: that is their own decision, **not permission from the author**. If dom314 objects or asks for anything, it will be done, including removing their content.
  - **ES:** La opción "Arcoíris (dom314)" del anillo de selección adapta código de ese mod (la función `hsv2rgb` y el bloque arcoíris de `shaders/unit_ring_selection.fs`). dom314 **no publicó licencia**. Pablo contactó al autor por Discord; no ha habido respuesta. Los autores de este mod tratan el código, con atribución, como si fuera MIT: es decisión propia, **no un permiso del autor**. Si dom314 se opone o pide algo, se hará, incluido retirar su contenido.
- Mod by / por **Pablo & Claude**.

## License / Licencia
MIT (see `LICENSE`), except the dom314 credit above. / MIT (ver `LICENSE`), salvo lo acreditado a dom314 arriba.
