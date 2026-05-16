# The Isle Bosch Overlay v2 Update Notes

V2 is the big Gateway map overhaul. The overlay has been rebuilt around Vulnona-style Gateway map data so it is easier to read, easier to trust, and much closer to the map players already use for reference. Huge shoutout to Vulnona for the Gateway map work and map-data structure that made this pass possible.

## Map And Tracking

- Reworked the Gateway map presentation to match the Vulnona-style layout much more closely.
- Recalibrated Bosch tracker coordinates against Vulnona reference points to reduce the old south/east drift.
- Added a tighter player marker with a stronger white glow so your location is easier to see.
- Matched friend/location markers to the player marker scale so party markers do not overpower the map.
- Added a rotating heading compass around the compact map with the facing direction kept at the top.
- Added a small directional pointer outside the map circle.
- Adjusted compact/full map sizing and spacing so the right-side direction labels do not get clipped.
- Fixed full-size map click handling so clicking the overlay should not click through into the game.
- Increased tracker refresh behavior where the Bosch side allows it.

## Vulnona-Style Layers

- Added migration zone overlays.
- Added patrol zone overlays with a more readable red highlight.
- Added sanctuary overlays.
- Made migration, patrol, and sanctuary layers visible by default.
- Tuned zone transparency and outline thickness so borders are clearer without blocking the map.
- Removed messy zone icons over migration and patrol areas.
- Made layer toggles available in full map mode only, keeping compact mode clean.

## How To Use The New Map Overlays

- Press `F8` to open the full map. The layer buttons are intentionally hidden in compact mode so the small overlay stays clean.
- Use `Migration` to show the purple migration-zone overlays.
- Use `Patrol` to show the red patrol-zone overlays.
- Use `Sanctuary` to show the pink sanctuary overlays.
- Use `Gastro` to show flat food-resource icons pulled from Vulnona map data.
- Use `Salt` to show salt-rock icons pulled from Vulnona map data.
- Use `Mud` to show Vulnona's brown mud areas with yellow outlines.
- Migration, Patrol, and Sanctuary are turned on by default when the overlay opens. Gastro, Salt, and Mud can be toggled on when you need resource routing.
- The overlays are meant as visual map references. Your current zone readout still depends on live Bosch tracking and the calibrated player position.

## Water, Mud, Salt, And Food Resources

- Replaced hand-drawn water approximations with Vulnona drinking-water data.
- Added clearer interior drinking water visibility across lakes, rivers, ponds, and puddles.
- Kept ocean/saltwater treatment separate from drinkable interior water.
- Added Gastro resource markers from Vulnona data.
- Added Salt Rock markers from Vulnona data.
- Added Mud as a toggle using Vulnona's actual brown/yellow mud layer rather than the misaligned IsleMaps mud overlay.
- Reworked Gastro and Salt markers into flat minimal icons without boxed borders.
- Reduced overlapping map-label text and made location labels more consistent.

## Login And Usability

- Fixed the tiny/condensed Bosch login problem. `Connect Bosch` now opens Bosch in a full-size login window instead of trapping the website in a short strip at the top of the overlay.
- Restored auto-close behavior after tracking is detected.
- Kept Bosch session handling persistent so reconnecting is less painful.
- Cleaned compact mode by hiding full-map layer controls there.
- Nudged the bottom HUD upward for a cleaner modern overlap with the compact map.
- Updated desktop shortcuts automatically after every rebuilt version.

## Installer Behavior

- Installs v2 to the user's Desktop as `The Isle Bosch Overlay v2`.
- Replaces old desktop launchers where possible.
- Removes older known v1/Reptarland overlay desktop folders and local install folders before installing v2.
- Includes launch and uninstall shortcuts.
