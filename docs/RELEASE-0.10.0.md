# 0.10.0 — Automatic equipment and mounted Knight

From Base level 70 the character gains an automatic weapon/armor budget. This is an explicit Survivor adaptation, not the stats of invented iRO items. Before B70, combat values are unchanged. Level milestones and interpolation live in `data/equipment.js`; the character chooses its profile through `equipmentProfileId`, allowing future classes to use different gear curves.

| Base | Weapon ATK | HIT | Flat DEF |
| --- | ---: | ---: | ---: |
| 70 | +450 | +45 | +30 |
| 80 | +900 | +80 | +70 |
| 90 | +1400 | +115 | +110 |
| 99 | +1800 | +140 | +150 |

Between milestones the bonuses interpolate per level. Weapon ATK participates in the existing random attack range and skill damage calculations; HIT addresses the repeated misses against late bosses. Armor adds flat defense to the existing damage calculation. Recalculation recomputes the bonuses from Base level, so buffs, skill learning and restore never stack the same equipment bonus repeatedly. The pause Character tab displays the profile and all three bonuses.

Basic-only seeded combat checks use real Hybrid auto stats, source boss HP/DEF, no active skills and unlimited player HP solely to isolate outgoing damage. Maya Purple at B81 must die within 170 game seconds; Wild Rider and Dark Illusion at B99 within 90 and 70 seconds. These assume continuous melee contact, so they are not promises of real encounter duration.

The male mounted sprite is the original transparent PNG from https://irowiki.org/w/images/3/33/Knight-Peco.png , referenced by https://irowiki.org/wiki/Peco_Peco_Ride . The unmodified image is stored locally and SHA-256 tracked. A source rectangle excludes transparent padding without editing the original pixels. Knight automatically uses this visual whenever learned `peco_peco_ride` is at least level 1, including restored games; Novice and Swordman retain their own sprites. Both horizontal directions and missing-image fallback are preserved. No movement animation is added in this release.

All existing boss rewards, spawn rules and Base ×25 / Job ×15 remain unchanged. `tests/bosses.html` can inspect foot/mounted variants and B70/80/90/99 scenes without saving over a real run.
