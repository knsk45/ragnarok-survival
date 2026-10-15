# 0.8.0 — original art and Renewal experience

- Requirements are exact current iRO Wiki Renewal **Normal Base** and **Regular Novice / First / Second Class Job** EXP-to-next-level rows, cached in data/experience.js. No curve is derived from Base level, stage milestones or elapsed time.
- Base 1→99 requires 14,305,769 EXP. Swordman and Knight use distinct Job tables; Knight 1→50 requires 5,601,400 Job EXP. Caps have requirement 0 and display MAX without division by zero.
- Evolution requires current Job cap and all skill points spent. Previous B15/B65 gates are removed: changing Base level cannot accelerate or block Job progression.
- Monster Base/Job rewards are literal DB values at rate ×1. No bonus is applied to elites. Source values are recorded in data/irowiki-snapshot.json, including original image URLs and SHA-256 hashes.
- Each death emits exactly one blue B crystal with full Base EXP and one purple J crystal with full Job EXP. Picking one never awards the other. Healing and item drops are independent.
- The bottom HUD contains only learned, active, **enabled** auto-skills. Pause contains all learned active skills, including disabled ones, so they can be re-enabled.
- All 13 current monsters, 25 skill icons, 4 buff/status icons and Gift Box use original, unmodified local PNGs. Creamy uses the original sprite path, not custom code. No external host is required while playing.
- Fabre corrected from wrong ID 1008 (Pupa) to 1007; Fabre/Poporing prototype stats replaced with source data. All Base/Job rewards verified against the same source snapshot.
- Existing 0.7 saves remain untouched in rs.run.v1. New runs use rs.run.v2 and include the experience table ID. An old run with artificially fast levels is not silently imported into the new ruleset.

## Pacing and balance

The 30-minute session limit remains. Original requirements and ×1 monster rewards take priority over the former goal of reaching 99 at minute 20; that target is **not guaranteed** in this ruleset. No invisible catch-up, level-dependent EXP rate or enemy HP multiplier is introduced.

Late monster HP/ATK remain the source values, with the existing Creamy playtest adjustment retained. This release fixes progression and art; it does not claim that a 99/50 solo character is balanced against every late wave. Equipment, attack budgets and encounter pacing should be balanced separately from canonical data.

## Verification

`npm ci && npm test` checks exact table fixtures/totals, independent pickup paths, caps, disabled-skill visibility, original resource hashes, source rewards, evolution and the existing 30-minute exception simulation (mock Canvas; not a hardware performance test).

`tests/artwork.html` displays every original asset; `tests/mobile.html` provides fixed-size portrait/landscape interface checks.

## Sources

- https://irowiki.org/wiki/Base_EXP_Chart
- https://irowiki.org/wiki/Job_EXP_Chart
- https://db.irowiki.org/db/monster-info/<id>/ (per-record source in the snapshot)
- https://db.irowiki.org/db/item-info/644/
- https://irowiki.org/wiki/Novice
- https://irowiki.org/wiki/Swordman
- https://irowiki.org/wiki/Knight

Imported on 2026-10-15. Reproducible artwork/source import: `node tools/sync-irowiki.cjs --download`. It verifies monster names against IDs before accepting downloads; it does not run during gameplay.
