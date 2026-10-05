# Changelog — Unit Icons

## 1.0.1 (2026-10-05)

- EN: Icon styles are now Original, Outline and Bevel (Flat, Bold and Neon removed). New note in the ICONS tab: ideas for new icons can be sent in the Planetary Annihilation Discord, channel #making-mods.
- EN: Strategic icon size now goes up to 350 % (new steps 175/200/250/300/350 %; 75–150 % unchanged, saved settings keep working). Sizes above 150 % are applied by a 5th overridden game shader (`particle_icon.vs`) that scales the icon quad using a 1-pixel marker in the icon atlas; if the marker is not read, icons draw as in the original game. Sizes above 200 % are meant for 4K screens (on 1080p icons overlap); edges soften at large sizes (the atlas cell is 52 px). Re-check `particle_icon.vs` after game patches.
- ES: Los estilos de icono ahora son Original, Outline y Bevel (se quitan Flat, Bold y Neon). Mensaje nuevo en la pestaña ICONOS: las ideas de iconos nuevos se pueden enviar al Discord de Planetary Annihilation, canal #making-mods.
- ES: El tamaño de los iconos estratégicos llega hasta 350 % (pasos nuevos 175/200/250/300/350 %; 75–150 % sin cambios, los ajustes guardados siguen valiendo). Los tamaños sobre 150 % los aplica un 5.º shader pisado (`particle_icon.vs`) que escala el quad del icono según un marcador de 1 píxel en el atlas; si no se lee el marcador, los iconos se dibujan como en el juego original. Los tamaños sobre 200 % están pensados para pantallas 4K (en 1080p los iconos se solapan); los bordes se suavizan con tamaños grandes (la celda del atlas es de 52 px). Conviene revisar `particle_icon.vs` tras cada parche.

## 1.0.0 (2026-10-05) — first release / primera versión

- EN: Strategic unit icons (original + 5 skins), per-domain style, size/opacity by category, radar blip color, selection/hover ring options and presets (20 settings, ICONS tab). Overrides 4 game shaders; ring options depend on the game's diameter table. Translations (27 locales) are automatic and may contain errors.
- EN: The "Rainbow (dom314)" selection-ring option adapts code from *Rainbow Circle Ring* by **dom314**, who published no license (Pablo contacted the author on Discord; no reply); used with attribution as if MIT by the mod authors' decision, and removed on request.
- ES: Iconos estratégicos (original + 5 skins), estilo por dominio, tamaño/opacidad por categoría, color de blips, anillos de selección/hover y preajustes (20 ajustes, pestaña ICONOS). Pisa 4 shaders del juego; los anillos dependen de la tabla de diámetros. Las traducciones (27 locales) son automáticas y pueden contener errores.
- ES: La opción "Arcoíris (dom314)" del anillo de selección adapta código de *Rainbow Circle Ring* de **dom314**, que no publicó licencia (Pablo contactó al autor por Discord; sin respuesta); se usa con atribución, como si fuera MIT por decisión de los autores del mod, y se retira si lo pide.
