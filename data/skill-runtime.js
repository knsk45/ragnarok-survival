// Survivor adaptation, not a claim of exact Classic/Renewal combat parity.
// Canonical SP/cooldown values remain on RS_SKILLS; runtime owns geometry and effects.
(function () {
  const runtime = {
    basic_skill: { type: "passive", kind: "basic" },
    first_aid: {
      type: "active",
      kind: "heal",
      amount: 5,
      threshold: 0.75,
      priority: 0,
    },
    play_dead: {
      type: "active",
      kind: "playDead",
      duration: 2,
      cooldown: 15,
      threshold: 0.25,
      priority: 1,
    },
    bash: {
      type: "active",
      kind: "single",
      range: 110,
      multiplier: 1.3,
      perLevel: 0.18,
    },
    endure: {
      type: "active",
      kind: "buff",
      buff: "endure",
      duration: 10,
      range: 160,
    },
    increase_hp_recovery: { type: "passive", kind: "hpRecovery" },
    magnum_break: {
      type: "active",
      kind: "ring",
      range: 140,
      radiusMin: 70,
      radiusMax: 140,
      multiplier: 0.42,
      perLevel: 0.06,
    },
    provoke: {
      type: "active",
      kind: "debuff",
      range: 160,
      duration: 10,
      defDown: 0.3,
      atkUp: 0.1,
    },
    sword_mastery: { type: "passive", kind: "mastery" },
    twohanded_sword_mastery: { type: "passive", kind: "mastery" },
    berserk: {
      type: "triggered",
      kind: "lowHpAttack",
      threshold: 0.25,
      multiplier: 1.25,
    },
    fatal_blow: {
      type: "triggered",
      kind: "bashStun",
      chance: 0.2,
      duration: 1,
    },
    hp_recovery_while_moving: { type: "passive", kind: "hpRecoveryMoving" },
    counter_attack: {
      type: "active",
      kind: "buff",
      buff: "counter",
      duration: 2,
      range: 100,
    },
    bowling_bash: {
      type: "active",
      kind: "bowling",
      range: 150,
      radiusMin: 150,
      radiusMax: 200,
      multiplier: 1.8,
      perLevel: 0.25,
    },
    brandish_spear: {
      type: "active",
      kind: "wave",
      range: 300,
      width: 52,
      multiplier: 1.7,
      perLevel: 0.2,
    },
    cavalier_mastery: { type: "passive", kind: "rideMastery" },
    peco_peco_ride: { type: "passive", kind: "mount" },
    pierce: {
      type: "active",
      kind: "single",
      range: 130,
      multiplier: 1.35,
      perLevel: 0.22,
      sizeHits: true,
    },
    spear_boomerang: {
      type: "active",
      kind: "projectile",
      range: 360,
      multiplier: 1.3,
      perLevel: 0.2,
      speed: 460,
    },
    spear_mastery: { type: "passive", kind: "mastery" },
    spear_stab: {
      type: "active",
      kind: "wave",
      range: 240,
      width: 36,
      multiplier: 1.2,
      perLevel: 0.18,
      knockback: 50,
    },
    twohand_quicken: {
      type: "active",
      kind: "buff",
      buff: "quicken",
      duration: 30,
      range: 240,
    },
    charge_attack: {
      type: "active",
      kind: "single",
      range: 260,
      multiplier: 2.3,
      perLevel: 0,
      cooldown: 6,
      knockback: 55,
    },
    one_hand_quicken: {
      type: "active",
      kind: "buff",
      buff: "quicken",
      duration: 30,
      range: 240,
      cooldown: 10,
      implemented: false,
    },
  };
  for (const s of window.RS_SKILLS) {
    const r = runtime[s.id];
    if (!r) throw Error("Нет реализации: " + s.id);
    s.type = r.type;
    s.runtime = r;
    s.implemented = r.implemented !== false;
    if (r.cooldown != null) s.cooldown = r.cooldown;
  }
})();
