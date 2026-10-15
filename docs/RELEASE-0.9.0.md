# 0.9.0 — Boss encounters

Adds all 17 entries from the user's iRO Wiki boss filter, ordered by level: Toad, Eclipse, Mastering, Dragon Fly, Mutant Dragonoid, Deviling, Chimera, Angeling, Cat O' Nine Tails, Maya Purple, Arc Angeling, Ghostring, Octopus Henchman, Owl Duke, Vagabond Wolf, Wild Rider, Dark Illusion.

## Encounter rules

- First encounter is eligible after 120 game seconds and Base level 27.
- Choose the lowest-level undefeated eligible boss. Bosses unlock at their source level, never enter the regular random spawn pool, and appear at most once per run.
- Only one boss can be alive. The next eligible boss waits until 90 game seconds after the previous boss dies. This uses game time, respects pause and game speed, and does not accumulate a backlog of instant spawns.
- On arrival, surrounding regular monsters retreat without rewards, leaving the three closest. While the boss is alive, regular spawns replenish up to three living regular monsters. After victory the ordinary cap of 60 resumes.
- Boss HP, attack range, defense and Base/Job rewards come from the source; there are no HP/progression multipliers. Existing melee AI and combat formulas are used; source boss spell sets are not implemented in this release.
- One Gift Box (item 644) is guaranteed on each boss death. Other item drops are deferred. Base EXP ×25 / Job EXP ×15 also apply to boss experience crystals.
- Boss identity and HP appear in a compact bar beneath the main HUD. Per-run defeated list, active enemy and next encounter time are saved.

## Sources and assets

The exact query and per-monster URLs are stored in `data/bosses.js`. Local original PNGs are verified by ID and SHA-256 in `data/irowiki-snapshot.json`. iRO Wiki's PNG links for Wild Rider (2208) and Octopus Henchman (2192) return 404; their original matching sprites are sourced from Divine Pride, with the exception recorded explicitly. All assets are served from this repository.

`node tools/import-bosses.cjs` downloads/verifies the filtered roster and reports source stats and artwork metadata. `npm test` covers boss scheduling, normal-wave limits, guaranteed drops, saves and all render branches.
