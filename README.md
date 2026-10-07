# Unit Icons

Client mod for **Planetary Annihilation: TITANS** (build 124683). Cosmetic only.

Forum: https://github.com/pablohenriquez93k-glitch/pa-unit-icons/discussions/1

## What it does
Replaces the strategic unit icons with a domain × role icon system (31 glyphs). Choose the original icons, **Original (Enhanced)** (the game's icons redrawn as sharp vector art for high icon quality) or one of 2 custom styles (Outline, Bevel); pick the commander icon among 21 designs (also used for cosmetic commanders); style per domain (land, naval, air, orbital, structure); size (75–350 %; above 200 % is meant for 4K screens), icon quality (Standard 52 px, High 104 px, Very high 208 px: sharper icons at large sizes; at Standard the Original (Enhanced) style shows the game's own 52 px icons, so its improvement is visible at High/Very high quality and large UI scale) and opacity per category; radar blip color; metal spot color (planet markers always look as in the game in every style); selection and hover ring options; presets and a reset button. 23 settings in the **ICONS** tab of Settings.

## Install
Easiest: install **Unit Icons** from the in-game **Community Mods** index. Manual install: close the game and copy the contents of the downloaded package into `%LOCALAPPDATA%\Uber Entertainment\Planetary Annihilation\client_mods\com.pa.pabloandclaude.uniticons\` so that `modinfo.json` sits directly inside that folder.

1. Open the game and enable **Unit Icons** in the Mods manager (client mod).
2. Settings → **ICONS**, pick your options and press **Save**. Ring changes reload the game view.

To remove it, disable it in the Mods manager (or close the game and delete that folder).

## Translations
The ICONS tab is translated into 27 locales. **The translations are automatic and may contain errors.**

## Compatibility and limits
The mod overrides 5 game shaders (`particle_icon.fs`, `particle_icon.vs`, `unit_ring_selection.fs`, `unit_ring_hover.fs`, `particle_direct_ring_selection.vs`) with priority 150, so it wins over other mods that replace the same files. The ring options depend on the game's table of 50 selection diameters; if a game patch changes it, the ring feature turns itself off. Re-check after game patches. Rings in games with a unit tag (Galactic War, replays) are not verified: the mod does nothing there.

## Credits
- **dom314** — *Rainbow Circle Ring*: https://forums.uberent.com/threads/rel-client-rainbow-ring.71299/#post-1123827

  The "Rainbow (dom314)" selection-ring option adapts code from that mod (the `hsv2rgb` function and the rainbow block in `shaders/unit_ring_selection.fs`). dom314 published **no license**. The mod authors contacted dom314 on Discord; there has been no reply. The authors of this mod treat the code, with attribution, as if it were MIT: that is their own decision, **not permission from the author**. If dom314 objects or asks for anything, it will be done, including removing their content.

## License
MIT (see `LICENSE`), except the dom314 credit above.
