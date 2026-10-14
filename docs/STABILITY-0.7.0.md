# Technical release 0.7.0

## Implemented

- Atomic death processing: one kill and one loot award, never splice(-1).
- Shared collision geometry with finite wave length/width. Effect rendering uses the same radius/width.
- Independent skill cooldowns, canonical SP costs, target checks before spending, healing priority.
- Explicit active/passive/triggered skill classification. Learned levels never change when disabling auto-cast.
- Provoke debuff, temporary Endure/Quicken/Counter, Play Dead, Fatal Blow, moving recovery, projectile Boomerang and Spear Stab handlers.
- Independent Base and Job experience; monster jobExp is carried by drops. Stage milestones are calibration targets, not guaranteed outcomes.
- Job caps prompt pause once per stage. Unspent skill points block evolution, not further Base experience. Evolution recalculates derived stats immediately.
- Enemy DEF and player/monster HIT/FLEE affect combat through explicitly simplified survivor formulas.
- Viewport-aware offscreen spawning and retry of elite spawns when the monster cap is full. No new HP multipliers.
- Unified stylesheet, always-visible pause footer, one scroll surface, pause tabs and character/combat statistics.
- Only learned active skills in auto-cast bars; independent cooldown/Off/low-SP status.
- Auto-pause on visibility loss, local run snapshots every 10 game seconds and on pause/pagehide, resume from start screen.
- Initialization/resource failure screen plus local bounded error history.
- Modular combat core, skill scheduler and persistence. Debug hooks are available only with ?test=1.
- Asset provenance catalog; Fabre no longer uses Poring art. Non-original local SVG artwork is explicitly marked prototype-art.

## Verification

Run `npm install` and `npm test` using Node 22 or later.
Tests cover schema/dependency validation, finite geometry, idempotent death, spawning, resource paths, startup, pause, independent skill cost/cooldown, Job caps/evolution, saves and all monster render branches.
A 30-minute game-time simulation uses infinite HP/SP and mocked Canvas/DOM. This is an exception/numeric-state regression test, **not** an iPhone render/performance test and not a balance playthrough.

## Deliberately not claimed complete

- Exact Classic/Renewal combat parity, original sprite replacement for every monster and exact wiki animation/frame timing.
- Guaranteed B99 at minute 20: independent EXP curves need real playthrough telemetry and calibration.
- Full engine decomposition into separate movement/loot/render/state modules.
- Dedicated boss AI, new professions, equipment and alternate builds.
- Real-device browser matrix and hardware performance profiling.
- Server-enforced CI deployment gate/branch protection. Local automated tests are run before publishing; repository protection is not changed by this release.

## Release and rollback

Assemble the full release in a separate release branch. Run tests before moving main; do not publish partially uploaded modules. Preserve the previous main as a backup branch. Roll back with a normal revert/release commit, not destructive history rewriting.

No external asset host is required at runtime. Embedded PNG references remain embedded until they can be migrated without changing their pixels. New SVG assets are local placeholders, not claimed to be official Ragnarok artwork.
