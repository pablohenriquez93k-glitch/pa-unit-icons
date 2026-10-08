# Changelog — Unit Icons

## 1.0.5 (2026-10-08)

- Fix: with Icon quality Medium or High, radar blips were drawn huge and with a black dot. They now keep their normal size at every quality, including Low with size above 150 %.
- Fix: a reload mark from Weapon FX with a future timestamp (clock moved back) no longer delays ring changes.
- Less background polling: the icon atlas reads the settings every 2 s (was 1 s) and the selection/build bar portraits every 3 s (was 1 s).
- Internal cleanup (duplicate size helper removed). No visible change.
- Works together with Weapon FX: both mods now coordinate in game when they update the same unit files (shared check and a single scene reload), so ring options and weapon effects no longer risk overwriting each other. In a match, ring changes now apply as soon as the settings menu closes.
- With a server mod that changes the selection ring size of a unit, the ring options stay off for that match (as before) and the server mod's values are kept.

## 1.0.4 (2026-10-07)

- Fixed: with High or Very high icon quality and a strategic icon opacity below 100 %, icons were drawn 2× or 4× too large. Opacity no longer affects the size marker, so icons keep the game's size at every quality, size and opacity. This also fixes sizes above 150 % being ignored when opacity was below 100 %.
- New **Metal spot color** setting (new **PLANET MARKERS** section): the game's green metal spot or red, yellow, green, cyan, blue, magenta or white.
- Planet markers (metal spots, metal spot preview, energy spots, control points) now always look as in the game in every icon style.
- Fixed the ICONS tab layout on small windows (sections overlapped). "Icon quality" title no longer says Outline/Bevel only.
- 23 settings; new texts translated into the same 27 locales (automatic translations).

## 1.0.3 (2026-10-07)

- New icon style **Original (Enhanced)**: the game's own icons redrawn as clean vector art (131 icons) for the High (104 px) and Very high (208 px) icon quality, with team color as in the game. At Standard quality it uses the game's 52 px icons, so the improvement shows at high icon quality and large UI scale. Asteroid, avatar and map-object icons stay as in the game.
- Outline and Bevel icons redrawn from vector sources: cleaner shapes at every quality, same size as the game's icons.
- New **Commander icon** setting (ICONS tab): the original icon or one of 21 new commander designs (default: chevron badge). It also replaces the cosmetic commanders' icons, works with every style and icon quality, and keeps the team color. Preview next to the style preview.
- 22 settings; the new title is translated into the same 27 locales (design names in English).

## 1.0.2 (2026-10-06)

- New **Icon quality** setting (ICONS tab): Standard (52 px, default, same as 1.0.1), High (104 px) or Very high (208 px). It raises the resolution of the Outline and Bevel icons, which makes them sharper at large sizes (above 200 %); the Original style keeps the game's own 52 px icons. Only the selected quality is loaded. On-screen size is unchanged: the overridden `particle_icon.vs` compensates for the larger atlas cell.
- 21 settings; the new text is translated into the same 27 locales (automatic translations).

## 1.0.1 (2026-10-05)

- Icon styles are now Original, Outline and Bevel (Flat, Bold and Neon removed). New note in the ICONS tab: ideas for new icons can be sent in the Planetary Annihilation Discord, channel #making-mods.
- Strategic icon size now goes up to 350 % (new steps 175/200/250/300/350 %; 75–150 % unchanged, saved settings keep working). Sizes above 150 % are applied by a 5th overridden game shader (`particle_icon.vs`) that scales the icon quad using a 1-pixel marker in the icon atlas; if the marker is not read, icons draw as in the original game. Sizes above 200 % are meant for 4K screens (on 1080p icons overlap); edges soften at large sizes (the atlas cell is 52 px). Re-check `particle_icon.vs` after game patches.

## 1.0.0 (2026-10-05) — first release

- Strategic unit icons (original + 5 skins), per-domain style, size/opacity by category, radar blip color, selection/hover ring options and presets (20 settings, ICONS tab). Overrides 4 game shaders; ring options depend on the game's diameter table. Translations (27 locales) are automatic and may contain errors.
- The "Rainbow (dom314)" selection-ring option adapts code from *Rainbow Circle Ring* by **dom314**, who published no license (the mod authors contacted dom314 on Discord; no reply); used with attribution as if MIT by the mod authors' decision, and removed on request.
