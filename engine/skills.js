(function (root) {
  "use strict";
  root.RSSkills = {
    cast: function (ctx) {
      const {
        state: S,
        definitions: SKILL_DEFS,
        runs: skillRuns,
        nearest,
        useSp,
        skillCast,
        random: rnd,
        burst,
        player: P,
        hit,
        byId: SKILL_BY_ID,
        stopJoystick,
        recalc,
        shots,
        effects: fx,
        types,
      } = ctx;
      const MELEE_RANGE = 92;

      let used = false;
      const defs = SKILL_DEFS.filter((d) => skillRuns(d.id)).sort(
        (a, b) => (a.runtime.priority ?? 10) - (b.runtime.priority ?? 10),
      );
      for (const d of defs) {
        if ((S.cooldowns[d.id] || 0) > S.t) continue;
        if(d.runtime.kind==='hunter'){
          used = root.RSHunter.cast(ctx,d) || used;
          continue;
        }
        const r = d.runtime,
          l = S[d.stateKey],
          target = nearest(r.range || MELEE_RANGE);
        if (r.kind === "heal" && S.hp >= S.max * r.threshold) continue;
        if (
          r.kind === "playDead" &&
          (S.hp >= S.max * r.threshold || !nearest(120))
        )
          continue;
        if (!["heal", "playDead"].includes(r.kind) && !target) continue;
        if (r.kind === "buff" && S.effects[r.buff]?.expires > S.t) continue;
        if (r.kind === "debuff" && target.provokedUntil > S.t) continue;
        const radius =
          r.radiusMin == null
            ? null
            : r.radiusMin +
              ((r.radiusMax - r.radiusMin) * (l - 1)) /
                Math.max(1, d.maxLevel - 1);
        if (
          radius != null &&
          Math.hypot(target.x - P.x, target.y - P.y) > radius + target.r
        )
          continue;
        if (!useSp(d.spCost)) continue;
        S.cooldowns[d.id] = S.t + Math.max(0.1, d.cooldown);
        S.metrics.casts[d.id] = (S.metrics.casts[d.id] || 0) + 1;
        skillCast(d.name);
        used = true;
        const dmg =
          rnd(S.atkMin, S.atkMax) *
          ((r.multiplier || 1) + (r.perLevel || 0) * l);
        if (r.kind === "heal") {
          S.hp = Math.min(S.max, S.hp + r.amount);
          burst(P.x, P.y, "#8dffb0", 6);
        } else if (r.kind === "playDead") {
          S.effects.playDead = { expires: S.t + r.duration };
          stopJoystick();
        } else if (r.kind === "buff") {
          S.effects[r.buff] = { expires: S.t + r.duration, level: l };
          recalc();
        } else if (r.kind === "debuff") {
          target.provokedUntil = S.t + r.duration;
          target.provoke = r;
        } else if (r.kind === "single") {
          const hits = r.sizeHits
            ? { small: 1, medium: 2, large: 3 }[
                types[target.type][8].classification.size
              ] || 1
            : 1;
          hit(target, dmg * hits, false, d.id);
          if (
            d.id === "bash" &&
            S.fatalBlow &&
            Math.random() < SKILL_BY_ID.fatal_blow.runtime.chance
          )
            target.stunnedUntil = S.t + SKILL_BY_ID.fatal_blow.runtime.duration;
          if (r.knockback) {
            let a = Math.atan2(target.y - P.y, target.x - P.x);
            target.x += Math.cos(a) * r.knockback;
            target.y += Math.sin(a) * r.knockback;
          }
        } else if (r.kind === "projectile") {
          let a = Math.atan2(target.y - P.y, target.x - P.x);
          shots.push({
            x: P.x,
            y: P.y,
            vx: Math.cos(a) * r.speed,
            vy: Math.sin(a) * r.speed,
            r: 7,
            life: r.range / r.speed,
            hit: new Set(),
            dmg,
            crit: false,
            col: "#c5f3ff",
            skillId: d.id,
          });
        } else {
          let a = Math.atan2(target.y - P.y, target.x - P.x);
          fx.push({
            x: r.kind === "bowling" ? target.x : P.x,
            y: r.kind === "bowling" ? target.y : P.y,
            r: radius || r.range,
            max: radius || r.range,
            width: r.width || 32,
            a,
            life: 0.35,
            m: 0.35,
            dmg,
            kind: r.kind,
            col: "#ffb36b",
            skillId: d.id,
            knockback: r.knockback || 0,
          });
        }
      }
      return used;
    },
  };
})(typeof window !== "undefined" ? window : globalThis);
