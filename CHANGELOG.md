# Changelog — Unit Icons

## 1.0.1 (2026-10-05)

- Icon styles are now Original, Outline and Bevel (Flat, Bold and Neon removed). New note in the ICONS tab: ideas for new icons can be sent in the Planetary Annihilation Discord, channel #making-mods.
- Strategic icon size now goes up to 350 % (new steps 175/200/250/300/350 %; 75–150 % unchanged, saved settings keep working). Sizes above 150 % are applied by a 5th overridden game shader (`particle_icon.vs`) that scales the icon quad using a 1-pixel marker in the icon atlas; if the marker is not read, icons draw as in the original game. Sizes above 200 % are meant for 4K screens (on 1080p icons overlap); edges soften at large sizes (the atlas cell is 52 px). Re-check `particle_icon.vs` after game patches.

## 1.0.0 (2026-10-05) — first release

- Strategic unit icons (original + 5 skins), per-domain style, size/opacity by category, radar blip color, selection/hover ring options and presets (20 settings, ICONS tab). Overrides 4 game shaders; ring options depend on the game's diameter table. Translations (27 locales) are automatic and may contain errors.
- The "Rainbow (dom314)" selection-ring option adapts code from *Rainbow Circle Ring* by **dom314**, who published no license (Pablo contacted the author on Discord; no reply); used with attribution as if MIT by the mod authors' decision, and removed on request.
