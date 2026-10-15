(() => {
  const c = document.getElementById("game"),
    x = c.getContext("2d"),
    TAU = Math.PI * 2,
    JOY_MAX = 92,
    MELEE_RANGE = 92,
    MELEE_SPLASH = 44;
  let W = 960,
    H = 540;
  const $ = (id) => document.getElementById(id),
    cl = (v, a, b) => Math.max(a, Math.min(b, v)),
    rnd = (a, b) => a + Math.random() * (b - a);
  function syncViewportLayout() {
    let v = window.visualViewport,
      portrait =
        window.innerWidth < window.innerHeight || (v && v.width < v.height);
    document.body.classList.toggle("portrait-ui", !!portrait);
  }
  function resizeCanvas() {
    syncViewportLayout();
    let r = document.getElementById("app").getBoundingClientRect();
    W = Math.max(320, Math.round(r.width));
    H = Math.max(240, Math.round(r.height));
    c.width = W;
    c.height = H;
    x.imageSmoothingEnabled = false;
  }
  let keys = {},
    touch = {
      on: false,
      id: null,
      bx: 0,
      by: 0,
      x: 0,
      y: 0,
      dx: 0,
      dy: 0,
      max: JOY_MAX,
    },
    en = [],
    shots = [],
    gems = [],
    fx = [],
    parts = [],
    dnums = [],
    skillTexts = [],
    eid = 1,
    last = 0;
  function showFatal(message, error) {
    let detail = error?.message ? ` (${error.message})` : "";
    $("fatalText").textContent = message + detail;
    $("fatal").classList.remove("hide");
    $("start").classList.add("hide");
    $("fatalReload").onclick = () => location.reload();
    try {
      RSStorage.log(localStorage, {
        version: "0.8.0",
        time: new Date().toISOString(),
        message: message + detail,
        stack: error?.stack || "",
      });
    } catch {}
    console.error("[Ragnarok Survival]", message, error || "");
  }
  function validateDatabase(db) {
    window.RSCore.validate(db);
    if (
      !Array.isArray(db.stats?.order) ||
      !db.builds?.hybrid_knight ||
      !db.items ||
      !db.buffs
    )
      throw Error("Игровая база загружена неполностью");
    return db;
  }
  let DB;
  try {
    DB = validateDatabase(window.RS_DATABASE);
  } catch (e) {
    showFatal(e.message, e);
    return;
  }
  const STAGE_JOB_IDS = {
      Novice: "novice",
      Swordman: "swordman",
      Knight: "knight",
    },
    PROGRESSION = DB.progression.milestones,
    PROGRESSION_BY_STAGE = Object.fromEntries(
      PROGRESSION.map((p) => [p.stage, p]),
    ),
    STAT_KEYS = DB.stats.order.map((s) => [s.id, s.label]),
    HYBRID_TARGET = DB.builds.hybrid_knight.target,
    JOB_BONUSES = Object.fromEntries(
      Object.values(DB.jobs).map((j) => [j.name, j.statBonuses]),
    ),
    PLAYTEST_FLAGS = DB.settings,
    BUFF_DEFS = DB.buffs,
    ITEM_DEFS = DB.items,
    MAX_ENEMIES = Math.max(10, Math.floor(PLAYTEST_FLAGS.maxEnemies ?? 60));
  const S = {
    run: false,
    pause: false,
    choose: false,
    end: false,
    t: 0,
    spd: 1,
    kills: 0,
    lvl: 1,
    xp: 0,
    need: RSCore.baseNeed(1, DB.experience),
    hp: 100,
    max: 100,
    sp: 40,
    spMax: 40,
    debugInfiniteHp: !!PLAYTEST_FLAGS.debugInfiniteHp,
    debugInfiniteSp: !!PLAYTEST_FLAGS.debugInfiniteSp,
    stage: "Novice",
    job: 1,
    skillPoints: 0,
    skillEnabled: {},
    statPoints: 48,
    stats: { str: 1, agi: 1, vit: 1, int: 1, dex: 1, luk: 1 },
    atk: 18,
    atkMin: 16,
    atkMax: 20,
    rate: 1.15,
    armor: 0,
    mag: 72,
    crit: 0.05,
    hit: 176,
    flee: 102,
    perfect: 0,
    count: 1,
    move: 145,
    movePower: 0,
    basic: 0,
    firstAid: 0,
    playDead: 0,
    bash: 0,
    endure: 0,
    hpRecovery: 0,
    magnum: 0,
    provoke: 0,
    swordMastery: 0,
    twohandMastery: 0,
    berserk: 0,
    fatalBlow: 0,
    hpRecoveryMoving: 0,
    bowling: 0,
    brandish: 0,
    cavalier: 0,
    pierce: 0,
    boomerang: 0,
    spearMastery: 0,
    spearStab: 0,
    quicken: 0,
    peco: 0,
    counter: 0,
    charge: 0,
    oneHandQuicken: 0,
    guard: 0,
    bowlingSeen: false,
    nextBoss: 300,
    inv: 0,
    attack: 0,
    special: 0,
    spawn: 0,
  };
  const P = { x: 0, y: 0, dir: 0 };
  function screen(wx, wy) {
    return { x: wx - P.x + W / 2, y: wy - P.y + H / 2 };
  }
  const NOVICE_SPRITE_DATA =
    "data:image/png;base64,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";
  const SWORDMAN_SPRITE_DATA =
    "data:image/png;base64,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";
  const KNIGHT_SPRITE_DATA =
    "data:image/png;base64,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";
  const noviceSprite = new Image(),
    swordmanSprite = new Image(),
    knightSprite = new Image();
  noviceSprite.src = NOVICE_SPRITE_DATA;
  swordmanSprite.src = SWORDMAN_SPRITE_DATA;
  knightSprite.src = KNIGHT_SPRITE_DATA;
  noviceSprite.onload =
    swordmanSprite.onload =
    knightSprite.onload =
      () => {
        if (typeof draw === "function") draw();
      };
  const PORING_SPRITE_DATA =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACkAAAAnCAYAAACSamGGAAADeklEQVR4nOyYS0hUURjHv3m0mSDMMnttjJQeSsbgptqUmUGLSqJ0UesiFCICN06gm6BFCwnaBUFkIWWLIjMygkIqSVNMLBKix4z2kCA3YRP/23yX7557zp07zvgC/3Cd69xzz/md7/zPd86ZIM1jxZuakvict5AMuGA0byMptQiZKy1C5koLAjI8Vw1zHuwdeUcHbrYF5orDKAAm+18lk79fW9e9Y7WeiTtnkeSGoiXFju+NkdoY8l13xpC6XjPYymipq3x1tJTiJcX2O4AubKwhipQTTfYRvZ9K26YvLwBMRqiwudlZAI1JAcAkLpsqc7+2Lq0nPR9KOAeYAjXVNaJ9P1RVoq9Y6UQiFqPVLS1GFu0DLVwKTAf09+tnU/22gmvW6TuQAvYCdXmSAV1DqpEfOF1ZAHNnQ1X/v0N7caKkbqIFjIBZRs6vOMIc2cSF266MEDABqnC5BPMEjZRbQ5+YmKBtra0Wn70sWoBIDQIQYHzNpLh+tDt195bLahYkosg5TgLOphztTfZRYV6enZOticMzGYB+4N4OjWYMsXlLke+y4EA0o7GY9X+YaeGHP9e6rS/bOp9an/vKyuwX4REWepmpfnz56apLBUeA1FQFPmu45XLW9eQFHb9+nk50dNDlR88cYHxlK64DI6KOij2SGPLGGlq/qoCCcqjR28cfximwdHvWIH5BP42Na2GlgmoPIuHZP+4ClBSvyxRorzhLTp6h/CuX6PTenfZDeZ+JHg4M2PfS16pkNKVUb9qRTKRmEsNNFxCrBTzdPRy3LgnsJV00WWESQy1n4HQFT7dHT9HV4R7r/92bDmVVH+CD6DmUv3a5tlD7y8GMKt2zoSArIBZSItZxkp6EBxJDo44UA8AjFe7dtpeQLXo+jtHZikprEnp50iTpR2w0gvgjfSCT9uj3X/b9xQfPjZWq0Yafz+3f4cvX6qSxFSknHuUgF/zWO0hbK3c5yqEhwAGiaMUyT1ApWAcXljaTjUzCKhQ6eJTeNDTY2zXXVo0jqVtZZMRklNEZHaiUOik5SlLVdYctQFLOPtpNL5ZJRHYmpUKaAF2QDIoXWJ037tj36pk613A6QC0kg2JhN20m1IZM8KYhJc1BDB7E3NAdb9MeafHpBczS/TDA0h1tsTbDUpgDJjhfkKr66+vT7j5kZ2Q6k6km0x+o/gUAAP//38nWwMk1NskAAAAASUVORK5CYII=";
  const poringSprite = new Image();
  poringSprite.src = PORING_SPRITE_DATA;
  poringSprite.onload = () => {
    if (typeof draw === "function") draw();
  };
  const LUNATIC_SPRITE_DATA =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACMAAAAcCAYAAADr9QYhAAADSElEQVR4nMxXP2gTURx+PRycS3EKCSEIQnFQ6SRGXAqmi4pDBXFRkHSIiEPVJRZEEXQwQ4KgDqJYUdTFFioiVpz8N4ggSIgnTkKLm91Ovpf7Lr/73bvLWR36Qbjc+/N73/t+f947z2wgbFrPpBPHZoOp/bXo/eCRvSN4Prn/KsDze++zbT91fmbkfxF1Agt+ePctAFZWggDv1y+1bZtsx3+0/43tXMpoJUrlUqz/6Mm6GR2Nz/G/+qZYHrdzb965kkuhoTGD3YHIgelq1CYXRjvfV1f7v+WlZfsOd23fVsrDw2KoMp+++OG/PpnqZDVaWJLCO8ExnFMsjwcg9k8xxFiA1IwFF9Ce1if7YS8rjjKV2TNZS8SHhlbIBfbDnt2kaQculVLJYAeaiF7URaR1uWOfjXN12+/3+m6GrR27aK/mJOQkA7dwF1m7Zh8JANNrP8z85kL0zg3JoEYczjTqCUKpykhV0jKCJJDChef3TLEw5iRrwqAGIYwF2q1Owu66jwMQQX2B8Z9vHw8dD2IgVNraJ4DaM8jUPmLKVCqVC9qACXfuIoKdgsjOX78jVeAixAvBlJcqwR7Wevnm0Zy067mISPk+vvdjRkEEi5FIHkU4H3Pgfqqj1/Vcikgjr5cWoskk8nR+QCRLFWmLbiKhhw9eNDWhoTHDWgMjTNdniwsJIho8GmRlBrCx2dNn7f+rF283ZZ/nUiU2OcwqlnimqCaiVZExAiVlTUJaI5uwqX27DzepjlMZHbDa+MTYmpOIVoFz6B70c3M4fBHAMoiHHpRZRY/FjYpgrCQk58I9d290oiPBBa/b7cbc1Dh+pjk4dZNgMIMIFESKp5GXroEiIIKEkHYI8HC6KUsNGN0ycciSAGnXWNnG0iBBQhoeWaUvnwRI8ACkW+RTKwL3YDzjpXXr2hwCmOD6nm6gQWSAC6wZgCYEFXSbCRMCarAPYODKdWNuQgczibWE0OSwS70A7r321/Nj7YgPnEMYT/tYS3skETP47ICseneSHNthGHIjbeXiaCMpAkcMD8a0sHCmNu4YvB5KQrqOSKJTpmYVAAnUEEt+MU4i/EpIvXZmXpBxyTKO+4x0JT9DMFaPA4m8nykbDn8CAAD//4hYJmVCfr1+AAAAAElFTkSuQmCC";
  const lunaticSprite = new Image();
  lunaticSprite.src = LUNATIC_SPRITE_DATA;
  lunaticSprite.onload = () => {
    if (typeof draw === "function") draw();
  };
  const poringTintCanvas = document.createElement("canvas"),
    poringTintCtx = poringTintCanvas.getContext("2d"),
    giftBoxSprite = new Image();
  giftBoxSprite.src = ITEM_DEFS.giftBoxPlain.visual.spriteUrl;
  giftBoxSprite.onload = () => {
    if (typeof draw === "function") draw();
  };
  const types = Object.fromEntries(
      Object.values(DB.monsters).map((m) => [
        m.key,
        [
          m.name,
          m.visual.color,
          m.visual.shadow,
          m.combat.hp,
          m.combat.speed,
          m.combat.damage,
          m.combat.baseExp,
          m.visual.radius,
          m,
        ],
      ]),
    ),
    monsterSprites = {};
  Object.values(DB.monsters).forEach((m) => {
    if (!m.visual?.spriteUrl) return;
    let sprite = new Image();
    sprite.src = m.visual.spriteUrl;
    monsterSprites[m.key] = sprite;
    sprite.onload = () => {
      if (typeof draw === "function") draw();
    };
    sprite.onerror = () => {
      monsterSprites[m.key] = null;
    };
  });
  const SKILL_DEFS = DB.skills,
    SKILL_BY_ID = Object.fromEntries(SKILL_DEFS.map((s) => [s.id, s])),
    JOB_RANK = { novice: 0, swordman: 1, knight: 2 };
  const ups = SKILL_DEFS.map((d) => [
    d.icon,
    d.name,
    d.description,
    () => S[d.stateKey]++,
    d.jobId,
    d.id,
  ]);
  function stageAllows(jobId) {
    return JOB_RANK[jobId] <= JOB_RANK[STAGE_JOB_IDS[S.stage]];
  }
  function skillAvailable(id) {
    let d = SKILL_BY_ID[id];
    return (
      !!d &&
      d.implemented !== false &&
      d.spendable !== false &&
      stageAllows(d.jobId) &&
      S[d.stateKey] < d.maxLevel &&
      d.requires.every((r) => {
        let dep = SKILL_BY_ID[r.skillId];
        return dep && (S[dep.stateKey] || 0) >= r.level;
      })
    );
  }
  function skillIsActive(d) {
    return !!d && d.type === "active" && d.implemented !== false;
  }
  function skillIsEnabled(id) {
    return S.skillEnabled?.[id] !== false;
  }
  function skillRuns(id) {
    let d = SKILL_BY_ID[id];
    return (
      !!d && skillIsActive(d) && (S[d.stateKey] || 0) > 0 && skillIsEnabled(id)
    );
  }
  function skillMenuVisible(d) {
    return stageAllows(d.jobId) && skillIsActive(d) && (S[d.stateKey] || 0) > 0;
  }
  function unlockQuestSkillsForStage() {
    if (!S.questUnlocked) S.questUnlocked = {};
    SKILL_DEFS.filter((d) => d.quest).forEach((d) => {
      let rank = JOB_RANK[d.jobId],
        current = JOB_RANK[STAGE_JOB_IDS[S.stage]],
        unlocked = !!S.questUnlocked[d.id] || rank <= current;
      if (unlocked) {
        S.questUnlocked[d.id] = true;
        S[d.stateKey] = Math.max(1, S[d.stateKey] || 0);
      }
    });
  }
  function skillIcon(d) {
    return d.iconUrl
      ? '<img class="skill-art" src="' + d.iconUrl + '" alt="">'
      : d.icon;
  }
  function renderSkillToggleBox(box, onlyEnabled = false) {
    if (!box) return;
    const visible = (d) =>
      skillMenuVisible(d) && (!onlyEnabled || skillIsEnabled(d.id));
    let sig = SKILL_DEFS.filter(visible)
      .map(
        (d) =>
          d.id +
          ":" +
          (S[d.stateKey] || 0) +
          ":" +
          (skillIsEnabled(d.id) ? 1 : 0),
      )
      .join("|");
    if (box.dataset.signature === sig) return;
    box.dataset.signature = sig;
    box.innerHTML = "";
    let pool = SKILL_DEFS.filter(visible);
    if (!pool.length) {
      box.innerHTML = '<span class="muted">Активных навыков пока нет.</span>';
      return;
    }
    pool.forEach((d) => {
      let level = S[d.stateKey] || 0,
        active = skillIsActive(d),
        enabled = skillIsEnabled(d.id),
        b = document.createElement("button");
      b.type = "button";
      b.dataset.skillId = d.id;
      b.setAttribute("aria-pressed", String(enabled));
      b.className =
        "skill " +
        (active ? (enabled ? "skill-on" : "skill-off") : "skill-passive");
      b.title =
        d.name +
        " — " +
        d.description +
        " — " +
        (active
          ? enabled
            ? "Отключить автозапуск"
            : "Включить автозапуск"
          : d.description);
      b.innerHTML =
        '<span class="skill-icon">' +
        skillIcon(d) +
        '</span><span class="skill-info"><span class="skill-name">' +
        d.name +
        '</span><span class="skill-level">Lv ' +
        level +
        "/" +
        d.maxLevel +
        (active && !enabled ? '<em class="skill-state"> Off</em>' : "") +
        "</span></span>";
      if (active && level > 0)
        b.onclick = () => {
          S.skillEnabled[d.id] = !enabled;
          saveRun();
          renderActiveSkills();
          hud();
        };
      else b.disabled = true;
      box.appendChild(b);
    });
  }
  function renderActiveSkills() {
    renderSkillToggleBox($("skills"), true);
    renderSkillToggleBox($("pauseActiveSkills")?.querySelector(".skills"));
  }
  function activeBuff(id) {
    let b = S.buffs?.[id],
      d = BUFF_DEFS[id];
    return b && d && b.expiresAt > S.t ? d : null;
  }
  function buffSum(path) {
    return Object.keys(BUFF_DEFS).reduce((sum, id) => {
      let d = activeBuff(id),
        v = d?.effect?.[path];
      return sum + (Number.isFinite(v) ? v : 0);
    }, 0);
  }
  function totalStats() {
    let q = {},
      b = JOB_BONUSES[S.stage] || JOB_BONUSES.Novice;
    STAT_KEYS.forEach(
      ([k]) =>
        (q[k] = S.stats[k] + Math.floor((b[k] * Math.min(S.job, 50)) / 50)),
    );
    Object.keys(BUFF_DEFS).forEach((id) => {
      let d = activeBuff(id);
      Object.entries(d?.effect?.stats || {}).forEach(([k, v]) => {
        if (k in q) q[k] += v;
      });
    });
    return q;
  }
  function autoAllocateStats() {
    let guard = 0;
    while (S.statPoints > 0 && guard++ < 1000) {
      let choices = STAT_KEYS.map(([k]) => k).filter(
        (k) =>
          S.stats[k] < HYBRID_TARGET[k] && statCost(S.stats[k]) <= S.statPoints,
      );
      if (!choices.length) break;
      choices.sort((a, b) => {
        let da = (HYBRID_TARGET[a] - S.stats[a]) / HYBRID_TARGET[a],
          db = (HYBRID_TARGET[b] - S.stats[b]) / HYBRID_TARGET[b];
        return db - da || statCost(S.stats[a]) - statCost(S.stats[b]);
      });
      let k = choices[0],
        cost = statCost(S.stats[k]);
      S.stats[k]++;
      S.statPoints -= cost;
    }
  }
  function baseHpForLevel(level, stage) {
    let j = DB.jobs[STAGE_JOB_IDS[stage]] || DB.jobs.novice,
      a = Number(j.hpJobA) || 0,
      b = Number(j.hpJobB) || 5,
      base = 35 + level * b;
    for (let i = 2; i <= level; i++) base += Math.round(a * i);
    return base;
  }
  function recalc(full = false) {
    let q = totalStats(),
      oldMax = S.max || 100,
      oldSp = S.spMax || 40,
      quick = S.effects?.quicken?.expires > S.t,
      baseAtk =
        12 +
        q.str * 1.35 +
        Math.floor(q.dex / 5) +
        Math.floor(q.luk / 3) +
        S.swordMastery * 4 +
        S.twohandMastery * 4 +
        S.spearMastery * 4 +
        buffSum("atk");
    if (S.berserk && S.hp < S.max * 0.25) baseAtk *= 1.25;
    S.atkMin = Math.max(1, Math.floor(baseAtk * 0.9));
    S.atkMax = Math.max(S.atkMin + 1, Math.ceil(baseAtk * 1.1 + q.str * 0.08));
    S.atk = (S.atkMin + S.atkMax) / 2;
    S.rate =
      Math.max(0.32, 1.25 - q.agi * 0.008 - q.dex * 0.002) *
      (quick ? 0.7 : 1) *
      (1 - buffSum("aspdRate"));
    S.max = Math.max(
      1,
      Math.floor(baseHpForLevel(S.lvl, S.stage) * (1 + q.vit * 0.01)),
    );
    S.spMax = 48 + q.int * 2;
    S.armor =
      Math.floor(q.vit / 10) + (S.effects?.endure?.expires > S.t ? 5 : 0);
    S.crit = Math.min(0.85, 0.02 + q.luk * 0.003 + (quick ? 0.05 : 0));
    S.hit = 175 + S.lvl + q.dex + Math.floor(q.luk / 3) + buffSum("hit");
    S.flee = 100 + S.lvl + q.agi + Math.floor(q.luk / 5);
    S.perfect = Math.min(0.2, Math.floor(q.luk / 10) * 0.01);
    S.move = (125 + q.agi * 0.75 + S.peco * 15) * (1 + buffSum("moveRate"));
    S.mag = 60 + Math.floor(q.luk / 2) + S.peco * 12;
    if (full) {
      S.hp = S.max;
      S.sp = S.spMax;
    } else {
      S.hp = Math.min(S.max, S.hp + Math.max(0, S.max - oldMax));
      S.sp = Math.min(S.spMax, S.sp + Math.max(0, S.spMax - oldSp));
    }
  }
  function statCost(v) {
    return Math.floor((v - 1) / 10) + 2;
  }
  function syncJobLevel() {
    return 0;
  } // Job levels are earned only by awardJobXp.
  function awardJobXp(amount) {
    if (jobCapReached()) return;
    S.jobXp += Math.max(0, amount || 0);
    while (S.jobXp >= S.jobNeed && !jobCapReached()) {
      S.jobXp -= S.jobNeed;
      S.job++;
      S.skillPoints++;
      S.jobNeed = RSCore.jobNeed(S.job, S.stage, DB.experience);
    }
    if (jobCapReached()) S.jobXp = 0;
    unlockQuestSkillsForStage();
    recalc();
    if (jobCapReached() && S.skillPoints > 0 && !S.jobCapPrompted[S.stage]) {
      S.jobCapPrompted[S.stage] = true;
      openPause(true);
    }
  }
  function evolveByProgression() {
    let p = PROGRESSION_BY_STAGE[S.stage];
    if (p && p.nextStage && S.job >= p.jobMilestone && S.skillPoints === 0) {
      S.stage = p.nextStage;
      S.job = 1;
      S.jobXp = 0;
      S.jobNeed = RSCore.jobNeed(1, S.stage, DB.experience);
      unlockQuestSkillsForStage();
      recalc();
      say("Эволюция: " + S.stage);
      hud();
    }
  }
  function spendStat(k) {
    let v = S.stats[k],
      cost = statCost(v);
    if (S.statPoints < cost || v >= 99) return;
    let old = S.max;
    S.stats[k]++;
    S.statPoints -= cost;
    recalc();
    if (k === "vit") S.hp += S.max - old;
    hud();
  }
  function reset() {
    Object.assign(S, {
      run: false,
      pause: false,
      choose: false,
      end: false,
      t: 0,
      spd: 1,
      kills: 0,
      lvl: 1,
      xp: 0,
      need: RSCore.baseNeed(1, DB.experience),
      hp: 100,
      max: 100,
      sp: 40,
      spMax: 40,
      debugInfiniteHp: !!PLAYTEST_FLAGS.debugInfiniteHp,
      debugInfiniteSp: !!PLAYTEST_FLAGS.debugInfiniteSp,
      stage: "Novice",
      job: 1,
      skillPoints: 0,
      skillEnabled: {},
      questUnlocked: {},
      statPoints: 48,
      stats: { str: 1, agi: 1, vit: 1, int: 1, dex: 1, luk: 1 },
      buffs: {},
      atk: 18,
      atkMin: 16,
      atkMax: 20,
      rate: 1.15,
      armor: 0,
      mag: 72,
      crit: 0.05,
      hit: 176,
      flee: 102,
      perfect: 0,
      count: 1,
      move: 145,
      movePower: 0,
      basic: 0,
      firstAid: 0,
      playDead: 0,
      bash: 0,
      endure: 0,
      hpRecovery: 0,
      magnum: 0,
      provoke: 0,
      swordMastery: 0,
      twohandMastery: 0,
      berserk: 0,
      fatalBlow: 0,
      hpRecoveryMoving: 0,
      bowling: 0,
      brandish: 0,
      cavalier: 0,
      pierce: 0,
      boomerang: 0,
      spearMastery: 0,
      spearStab: 0,
      quicken: 0,
      peco: 0,
      counter: 0,
      charge: 0,
      oneHandQuicken: 0,
      guard: 0,
      bowlingSeen: false,
      nextBoss: 300,
      inv: 0,
      attack: 0,
      special: 0,
      spawn: 0,
    });
    Object.assign(S, {
      jobXp: 0,
      lastSave: 0,
      jobNeed: RSCore.jobNeed(1, "Novice", DB.experience),
      jobCapPrompted: {},
      cooldowns: {},
      effects: {},
      metrics: { damage: {}, casts: {}, spSpent: 0, taken: 0 },
    });
    unlockQuestSkillsForStage();
    recalc(true);
    autoAllocateStats();
    recalc(true);
    P.x = P.y = 0;
    en = [];
    shots = [];
    gems = [];
    fx = [];
    parts = [];
    dnums = [];
    skillTexts = [];
    eid = 1;
    touch.on = false;
    touch.dx = touch.dy = 0;
    ["start", "levelUp", "pause", "end"].forEach((id) =>
      $(id).classList.toggle("hide", id !== "start"),
    );
    syncDebugControls();
    hud();
    if (typeof updateJoystick === "function") updateJoystick();
  }
  function start() {
    if (S.run) return;
    $("start").classList.add("hide");
    S.run = true;
    last = performance.now();
    say("Испытание началось!");
    requestAnimationFrame(loop);
  }
  function say(t) {
    $("toast").textContent = t;
    $("toast").classList.add("show");
    clearTimeout(say.timer);
    say.timer = setTimeout(() => $("toast").classList.remove("show"), 2200);
  }
  function time(t) {
    return (
      String(Math.floor(t / 60)).padStart(2, "0") +
      ":" +
      String(Math.floor(t % 60)).padStart(2, "0")
    );
  }
  function applyBuff(id) {
    let d = BUFF_DEFS[id];
    if (!d) return;
    S.buffs[id] = { expiresAt: S.t + d.duration, level: d.level };
    recalc();
    say("Получен баф: " + d.name + " · " + d.duration + " сек.");
  }
  function applyRandomBuff() {
    let ids = ITEM_DEFS.giftBoxPlain.effects.filter((id) => BUFF_DEFS[id]);
    if (!ids.length) return;
    applyBuff(ids[Math.floor(Math.random() * ids.length)]);
  }
  function xp(n, jobAmount = 0) {
    awardJobXp(jobAmount);
    if (S.lvl >= 99) return;
    S.xp += Math.max(0, n || 0);
    while (S.xp >= S.need && S.lvl < 99) {
      S.xp -= S.need;
      S.lvl++;
      S.statPoints += Math.floor((S.lvl - 1) / 5) + 3;
      autoAllocateStats();
      S.need = RSCore.baseNeed(S.lvl, DB.experience);
      recalc();
    }
    if (S.lvl >= 99) {
      S.lvl = 99;
      S.xp = S.need;
    }
    evolveByProgression();
    updateXpText();
  }
  function jobCapReached() {
    let p = PROGRESSION_BY_STAGE[S.stage];
    return !!p && S.job >= p.jobMilestone;
  }
  function renderSkillMenu() {
    let box = $("pauseCards"),
      scroll = document.querySelector(".pause-scroll"),
      position = scroll?.scrollTop || 0;
    $("pauseHint").textContent = S.skillPoints
      ? S.stage + " · доступно очков: " + S.skillPoints
      : "Нет свободных очков навыков";
    box.innerHTML = "";
    for (const d of SKILL_DEFS.filter(
      (d) => d.spendable !== false && stageAllows(d.jobId),
    )) {
      const current = S[d.stateKey] || 0,
        available = skillAvailable(d.id),
        b = document.createElement("button");
      b.className = "card";
      b.disabled = !available || S.skillPoints <= 0 || d.implemented === false;
      let reasons = d.requires
        .filter((r) => (S[SKILL_BY_ID[r.skillId].stateKey] || 0) < r.level)
        .map((r) => SKILL_BY_ID[r.skillId].name + " " + r.level)
        .join(", ");
      b.innerHTML =
        "<strong>" +
        skillIcon(d) +
        " " +
        d.name +
        "</strong><small>" +
        d.description +
        '<br><span class="skill-next">Текущий уровень: ' +
        current +
        "/" +
        d.maxLevel +
        "</span>" +
        (reasons ? "<br>Требуется: " + reasons : "") +
        (d.implemented === false ? "<br>Пока не реализован" : "") +
        "</small>";
      b.onclick = () => {
        if (!skillAvailable(d.id) || S.skillPoints <= 0) return;
        S[d.stateKey]++;
        S.skillPoints--;
        recalc();
        saveRun();
        renderSkillMenu();
        hud();
      };
      box.appendChild(b);
    }
    if (scroll) scroll.scrollTop = position;
  }
  function updateSkillIndicator() {
    let badge = $("skillBadge");
    if (!badge) return;
    badge.textContent = S.skillPoints;
    badge.classList.toggle("hide", S.skillPoints <= 0);
  }
  function syncDebugControls() {
    let hp = $("debugInfiniteHp"),
      sp = $("debugInfiniteSp");
    if (hp) hp.checked = !!S.debugInfiniteHp;
    if (sp) sp.checked = !!S.debugInfiniteSp;
    document
      .querySelectorAll(".speed")
      .forEach((b) =>
        b.classList.toggle("active", Number(b.dataset.s) === S.spd),
      );
  }
  function openPause(force = false) {
    if (!S.run || S.end) return;
    stopJoystick();
    keys = {};
    S.pause = true;
    S.choose = false;
    saveRun();
    $("pause").classList.remove("hide");
    renderSkillMenu();
    renderCharacterInfo();
    renderActiveSkills();
    updateSkillStatus();
    updateSkillIndicator();
    if (force) {
      document.querySelector('[data-tab="skills"]')?.click();
      say("Максимальный Job Level: распредели навыки");
    }
  }
  function levelUp() {
    updateSkillIndicator();
    if (S.skillPoints > 0 && jobCapReached() && !S.pause) openPause(true);
  }
  function enemyPower() {
    return 1;
  }
  function monsterLevel(key) {
    return types[key]?.[8]?.stats?.level ?? 1;
  }
  function availableMonsterKeys() {
    return Object.keys(types).filter((key) => {
      let level = monsterLevel(key);
      return S.lvl >= level && S.lvl <= level + 15;
    });
  }
  function pickMonster(force = null) {
    let pool = availableMonsterKeys();
    if (force && pool.includes(force)) return force;
    if (!pool.length) return "poring";
    return pool[Math.floor(Math.random() * pool.length)];
  }
  function monsterAttackInterval(e) {
    let aspd = Number(e?.aspd) || 100;
    return cl(1.95 - (aspd - 80) * 0.006, 0.82, 1.95);
  }
  function spawn(force = null, elite = false) {
    if (en.length >= MAX_ENEMIES) return false;
    let pos = RSCore.spawnPoint(P, W, H),
      t = pickMonster(force),
      q = types[t],
      c = q?.[8]?.combat || {},
      balance = q?.[8]?.balance || {};
    if (!q || ![3, 4, 5, 6, 7].every((i) => Number.isFinite(q[i])))
      return false;
    en.push({
      id: eid++,
      type: t,
      ...pos,
      hp: q[3],
      max: q[3],
      dead: false,
      speed: q[4] * (balance.speedMultiplier ?? 1),
      atkMin: c.atkMin,
      atkMax: c.atkMax,
      aspd: Number(c.aspd) || 100,
      damageScale: balance.damageMultiplier ?? 1,
      attackCooldown: 0,
      val: q[6],
      r: q[7],
      elite,
    });
    return true;
  }
  function nearest(max = 9999) {
    let z = null,
      d0 = max;
    en.forEach((e) => {
      if (e.dead) return;
      let d = Math.hypot(P.x - e.x, P.y - e.y);
      if (d < d0) {
        z = e;
        d0 = d;
      }
    });
    return z;
  }
  function useSp(n) {
    if (S.debugInfiniteSp) return true;
    if (S.sp < n) return false;
    S.sp -= n;
    S.metrics.spSpent += n;
    return true;
  }
  function attack() {
    let e = nearest(MELEE_RANGE);
    if (!e) return;
    let a = Math.atan2(e.y - P.y, e.x - P.x);
    P.dir = a;
    if (Math.random() > RSCore.chance(S.hit, types[e.type][8].stats.flee)) {
      say("Промах");
      return;
    }
    let cr = Math.random() < S.crit,
      dmg = rnd(S.atkMin, S.atkMax) * (cr ? 2 : 1),
      near = [
        e,
        ...en.filter(
          (q) => q !== e && Math.hypot(q.x - e.x, q.y - e.y) <= MELEE_SPLASH,
        ),
      ];
    hit(e, dmg, cr);
    for (let q of near.slice(1)) hit(q, dmg * 0.55, false);
    fx.push({
      x: e.x,
      y: e.y,
      r: 8,
      max: MELEE_SPLASH,
      life: 0.2,
      m: 0.2,
      kind: "melee",
      a,
      hit: new Set(en.map((q) => q.id)),
      col: cr ? "#ffe36b" : "#c5f3ff",
    });
    burst(e.x, e.y, cr ? "#ffe36b" : "#c5f3ff", cr ? 10 : 5);
  }
  function magnumRadius(level) {
    let l = cl(level, 1, 10);
    return 70 + ((l - 1) * 70) / 9;
  }
  function skillCast(name) {
    skillTexts.push({ x: P.x, y: P.y - 74, text: name, life: 0.72, m: 0.72 });
  }
  function special() {
    return RSSkills.cast({
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
    });
  }
  function runEnabledSpecial() {
    if (S.effects.playDead?.expires > S.t) return false;
    return special();
  }
  function hit(e, d, crit = false, skillId = "basic") {
    if (!e || e.dead || en.indexOf(e) < 0 || !Number.isFinite(d) || d <= 0)
      return;
    let def = types[e.type]?.[8]?.stats?.def || 0;
    if (e.provokedUntil > S.t) def *= 1 - e.provoke.defDown;
    d = RSCore.damage(d, def);
    e.hp -= d;
    S.metrics.damage[skillId] = (S.metrics.damage[skillId] || 0) + d;
    damageNumber(e.x, e.y, d, crit);
    burst(e.x, e.y, crit ? "#ffe36b" : "#ffe4a1", crit ? 5 : 2);
    if (RSCore.removeDead(en, e)) {
      S.kills++;
      const reward = types[e.type][8].combat;
      gems.push({
        x: e.x - 8,
        y: e.y,
        kind: "baseExp",
        amount: reward.baseExp,
        monsterId: types[e.type][8].id,
        life: 45,
      });
      gems.push({
        x: e.x + 8,
        y: e.y,
        kind: "jobExp",
        amount: reward.jobExp,
        monsterId: types[e.type][8].id,
        life: 45,
      });
      if (Math.random() < 0.035)
        gems.push({ x: e.x, y: e.y, v: 0, heart: true, life: 16 });
      if (Math.random() < ITEM_DEFS.giftBoxPlain.dropChance)
        gems.push({
          x: e.x,
          y: e.y,
          v: 0,
          kind: "gift",
          itemId: 644,
          life: 30,
        });
      burst(e.x, e.y, e.elite ? "#ff536c" : "#e8f5ff", e.elite ? 18 : 7);
    }
  }
  function damageNumber(x, y, d, crit = false) {
    dnums.push({
      x: x + rnd(-5, 5),
      y: y - 8,
      life: crit ? 0.9 : 0.68,
      m: crit ? 0.9 : 0.68,
      lift: 0,
      value: Math.max(1, Math.round(d)),
      crit,
      seed: Math.random() * TAU,
    });
  }
  function burst(x, y, col, n) {
    for (let i = 0; i < n; i++) {
      let a = Math.random() * TAU,
        s = rnd(20, 90);
      parts.push({
        x,
        y,
        vx: Math.cos(a) * s,
        vy: Math.sin(a) * s,
        life: rnd(0.3, 0.8),
        m: 0.8,
        col,
        r: rnd(1, 3),
      });
    }
  }
  function move() {
    let x = 0,
      y = 0,
      keyboard = false;
    if (keys.w || keys.arrowup) {
      y--;
      keyboard = true;
    }
    if (keys.s || keys.arrowdown) {
      y++;
      keyboard = true;
    }
    if (keys.a || keys.arrowleft) {
      x--;
      keyboard = true;
    }
    if (keys.d || keys.arrowright) {
      x++;
      keyboard = true;
    }
    if (touch.on) {
      x += touch.dx / touch.max;
      y += touch.dy / touch.max;
    }
    let d = Math.hypot(x, y);
    if (!d) return { x: 0, y: 0, power: 0 };
    let power =
      touch.on && !keyboard
        ? cl(Math.hypot(touch.dx, touch.dy) / touch.max, 0, 1)
        : 1;
    return { x: x / d, y: y / d, power };
  }
  function update(dt) {
    if (!S.run || S.pause) return;
    dt *= S.spd;
    S.t += dt;
    S.metrics.spRegen = S.metrics.spRegen || 0;
    for (const id of Object.keys(S.effects)) {
      if (S.effects[id].expires <= S.t) {
        delete S.effects[id];
        recalc();
      }
    }
    if (S.berserk) recalc();
    let expired = false;
    Object.keys(S.buffs).forEach((id) => {
      if (S.buffs[id].expiresAt <= S.t) {
        delete S.buffs[id];
        expired = true;
      }
    });
    if (expired) recalc();
    S.inv = Math.max(0, S.inv - dt);
    if (S.debugInfiniteHp) S.hp = S.max;
    if (S.debugInfiniteSp) S.sp = S.spMax;
    else
      S.sp = Math.min(
        S.spMax,
        S.sp +
          dt *
            (1.4 + totalStats().int * 0.05) *
            (activeBuff("magnificat") ? 2 : 1),
      );
    let m = move();
    if (m.power > 0.01) delete S.effects.playDead;
    let ease = 1 - Math.exp(-dt * 12);
    S.movePower += (m.power - S.movePower) * ease;
    P.x += m.x * S.move * S.movePower * dt;
    P.y += m.y * S.move * S.movePower * dt;
    if (m.power > 0.01) P.dir = Math.atan2(m.y, m.x);
    S.attack -= dt;
    if (S.attack <= 0 && !(S.effects.playDead?.expires > S.t)) {
      attack();
      S.attack = S.rate;
    }
    runEnabledSpecial();
    if (S.debugInfiniteSp) S.sp = S.spMax;
    if (S.t >= S.nextBoss) {
      if (spawn(null, true)) {
        say("ОПАСНОСТЬ: ЭЛИТНЫЙ МОНСТР");
        S.nextBoss += 300;
      }
    }
    S.spawn -= dt;
    if (S.spawn <= 0) {
      spawn();
      if (S.t > 900) spawn();
      S.spawn = Math.max(0.16, 0.78 - S.t / 1450);
    }
    for (let e of [...en]) {
      if (e.dead || e.stunnedUntil > S.t) continue;
      let dx = P.x - e.x,
        dy = P.y - e.y,
        d = Math.hypot(dx, dy) || 1;
      e.attackCooldown = Math.max(0, (e.attackCooldown || 0) - dt);
      e.x += (dx / d) * e.speed * dt;
      e.y += (dy / d) * e.speed * dt;
      if (
        d < e.r + 18 &&
        S.inv <= 0 &&
        e.attackCooldown <= 0 &&
        !(S.effects.playDead?.expires > S.t)
      ) {
        e.attackCooldown = monsterAttackInterval(e);
        if (
          Math.random() < S.perfect ||
          Math.random() > RSCore.chance(types[e.type][8].stats.hit, S.flee)
        ) {
          say("Идеальное уклонение");
          continue;
        }
        if (S.effects.counter?.expires > S.t) {
          hit(e, rnd(S.atkMin, S.atkMax) * (1.7 + S.counter * 0.2), true);
          burst(P.x, P.y, "#fff1a1", 10);
          S.inv = 0.35;
          continue;
        }
        let raw = rnd(e.atkMin, e.atkMax),
          taken = Math.max(
            1,
            Math.round(
              raw *
                e.damageScale *
                (e.provokedUntil > S.t ? 1 + e.provoke.atkUp : 1) -
                S.armor,
            ),
          );
        if (!S.debugInfiniteHp) {
          S.hp -= taken;
          S.metrics.taken += taken;
          damageNumber(P.x, P.y, taken, false);
          S.inv = 0.65;
          burst(P.x, P.y, "#ff536c", 7);
          if (S.hp <= 0) return finish(false);
        }
      }
    }
    for (let p of [...shots]) {
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.life -= dt;
      if (p.life <= 0) {
        shots.splice(shots.indexOf(p), 1);
        continue;
      }
      for (let e of [...en])
        if (!p.hit.has(e.id) && Math.hypot(p.x - e.x, p.y - e.y) < p.r + e.r) {
          p.hit.add(e.id);
          hit(e, p.dmg, p.crit, p.skillId);
          p.life -= 0.08;
        }
      if (p.life <= 0) shots.splice(shots.indexOf(p), 1);
    }
    for (let f of [...fx]) {
      f.life -= dt;
      for (let e of [...en]) {
        if (RSCore.contains(f, e)) {
          f.hit ??= new Set();
          if (!f.hit.has(e.id)) {
            f.hit.add(e.id);
            hit(e, f.dmg, false, f.skillId);
            if (f.knockback && !e.dead) {
              e.x += Math.cos(f.a) * f.knockback;
              e.y += Math.sin(f.a) * f.knockback;
            }
          }
        }
      }
      if (f.life <= 0) fx.splice(fx.indexOf(f), 1);
    }
    for (let g of [...gems]) {
      g.life -= dt;
      let d = Math.hypot(P.x - g.x, P.y - g.y);
      if (d < S.mag) {
        let dx = P.x - g.x,
          dy = P.y - g.y,
          l = d || 1;
        g.x += (dx / l) * (280 + S.mag) * dt;
        g.y += (dy / l) * (280 + S.mag) * dt;
      }
      if (d < 20) {
        gems.splice(gems.indexOf(g), 1);
        if (g.kind === "gift") applyRandomBuff();
        else if (g.heart) S.hp = Math.min(S.max, S.hp + S.max * 0.15);
        else if (g.kind === "baseExp") xp(g.amount, 0);
        else if (g.kind === "jobExp") xp(0, g.amount);
      }
      if (g.life <= 0 && gems.includes(g)) gems.splice(gems.indexOf(g), 1);
    }
    for (let q of parts) {
      q.x += q.vx * dt;
      q.y += q.vy * dt;
      q.life -= dt;
      q.vx *= 0.94;
      q.vy *= 0.94;
    }
    parts = parts.filter((q) => q.life > 0);
    for (let n of dnums) {
      n.life -= dt;
      n.lift += (n.crit ? 42 : 34) * dt;
    }
    dnums = dnums.filter((n) => n.life > 0);
    if (S.t >= 1800) return finish(true);
    hud();
  }
  /* Passive HP recovery: VIT slightly improves the rate and speed controls scale with game time. */
  const gameUpdate = update;
  update = function (dt) {
    if (S.run && !S.pause) {
      let q = totalStats(),
        moving = move().power > 0.01;
      S.hp = Math.min(
        S.max,
        S.hp +
          dt *
            S.spd *
            (0.35 + q.vit * 0.015 + S.hpRecovery * 0.25) *
            (!moving || S.hpRecoveryMoving ? 1 : 0.5),
      );
    }
    gameUpdate(dt);
    if (S.run && !S.pause && S.t - (S.lastSave || 0) >= 10) {
      S.lastSave = S.t;
      saveRun();
    }
    if (!S.pause)
      for (let n of skillTexts) {
        n.life -= dt * S.spd;
        n.y -= dt * S.spd * 8;
      }
    skillTexts = skillTexts.filter((n) => n.life > 0);
  };
  function player() {
    let X = W / 2,
      Y = H / 2,
      flip = Math.cos(P.dir) < -0.05 ? -1 : 1;
    x.fillStyle = "#0006";
    x.beginPath();
    x.ellipse(X, Y + 18, 23, 8, 0, 0, TAU);
    x.fill();
    let sprite =
      S.stage === "Knight"
        ? knightSprite
        : S.stage === "Swordman"
          ? swordmanSprite
          : noviceSprite;
    if (sprite.complete && sprite.naturalWidth) {
      let h = 86,
        w = (h * sprite.naturalWidth) / sprite.naturalHeight;
      x.save();
      x.translate(X, Y);
      x.scale(flip, 1);
      x.drawImage(sprite, -w / 2, -h * 0.78, w, h);
      x.restore();
    } else {
      x.save();
      x.translate(X, Y);
      x.scale(flip, 1);
      x.fillStyle =
        S.stage === "Knight"
          ? "#d6e8ef"
          : S.stage === "Swordman"
            ? "#a8bbc7"
            : "#c88d68";
      x.fillRect(-14, -12, 28, 25);
      x.fillStyle = "#f2c59b";
      x.fillRect(-10, -28, 20, 17);
      x.fillStyle = S.stage === "Knight" ? "#273442" : "#765347";
      x.fillRect(-14, -33, 28, 7);
      x.fillStyle = S.stage === "Knight" ? "#9deaff" : "#fff0ad";
      x.fillRect(12, -11, 22, 4);
      x.restore();
    }
    if (S.inv > 0) {
      x.strokeStyle = "#fff8";
      x.lineWidth = 3;
      x.beginPath();
      x.arc(X, Y, 28, 0, TAU);
      x.stroke();
    }
  }
  function draw() {
    x.clearRect(0, 0, W, H);
    let tile = 64,
      sx = Math.floor((P.x - W / 2) / tile) - 1,
      ex = Math.floor((P.x + W / 2) / tile) + 1,
      sy = Math.floor((P.y - H / 2) / tile) - 1,
      ey = Math.floor((P.y + H / 2) / tile) + 1;
    x.fillStyle = "#467b49";
    x.fillRect(0, 0, W, H);
    for (let i = sx; i <= ex; i++)
      for (let j = sy; j <= ey; j++) {
        let s = screen(i * tile, j * tile),
          h = (Math.sin(i * 12.9 + j * 78.2) * 43758.5) % 1;
        x.fillStyle = h > 0.7 ? "#4d854c" : h < 0.1 ? "#3e7244" : "#467b49";
        x.fillRect(s.x, s.y, tile + 1, tile + 1);
        if (h > 0.8) {
          x.fillStyle = "#35633c";
          x.fillRect(s.x + 35, s.y + 22, 10, 28);
          x.fillStyle = "#285b38";
          x.fillRect(s.x + 15, s.y + 10, 50, 35);
        }
      }
    for (let g of gems)
      if (g && Number.isFinite(g.x) && Number.isFinite(g.y)) gem(g);
    for (let e of en)
      if (
        e &&
        types[e.type] &&
        Number.isFinite(e.x) &&
        Number.isFinite(e.y) &&
        Number.isFinite(e.r)
      )
        enemy(e);
    for (let p of shots)
      if (p && Number.isFinite(p.x) && Number.isFinite(p.y)) shot(p);
    for (let f of fx)
      if (
        f &&
        Number.isFinite(f.x) &&
        Number.isFinite(f.y) &&
        Number.isFinite(f.r)
      )
        effect(f);
    for (let q of parts)
      if (q && Number.isFinite(q.x) && Number.isFinite(q.y)) particle(q);
    for (let n of dnums)
      if (n && Number.isFinite(n.x) && Number.isFinite(n.y))
        drawDamageNumber(n);
    player();
  }
  function poringShape(r) {
    x.beginPath();
    x.moveTo(-r * 0.98, r * 0.28);
    x.quadraticCurveTo(-r * 1.08, -r * 0.12, -r * 0.76, -r * 0.57);
    x.quadraticCurveTo(-r * 0.52, -r * 0.98, -r * 0.12, -r * 1.05);
    x.quadraticCurveTo(r * 0.2, -r * 1.08, r * 0.48, -r * 0.82);
    x.quadraticCurveTo(r * 0.88, -r * 0.7, r * 0.98, -r * 0.28);
    x.quadraticCurveTo(r * 1.08, r * 0.12, r * 0.78, r * 0.56);
    x.quadraticCurveTo(r * 0.55, r * 0.78, r * 0.25, r * 0.83);
    x.lineTo(-r * 0.52, r * 0.83);
    x.quadraticCurveTo(-r * 0.86, r * 0.72, -r * 0.98, r * 0.28);
    x.closePath();
  }
  function enemy(e) {
    let s = screen(e.x, e.y);
    if (s.x < -90 || s.x > W + 90 || s.y < -90 || s.y > H + 90) return;
    let q = types[e.type],
      r = e.r;
    if (!q || ![r, e.hp, e.max].every(Number.isFinite) || r <= 0) return;
    x.save();
    x.translate(s.x, s.y);
    x.fillStyle = "#0006";
    x.beginPath();
    x.ellipse(0, r * 0.78, r * 1.08, r * 0.32, 0, 0, TAU);
    x.fill();
    if (e.elite) {
      x.strokeStyle = "#ff536c";
      x.lineWidth = 3;
      x.beginPath();
      x.arc(0, 0, r + 6, 0, TAU);
      x.stroke();
    }
    /* All source sprites face right; mirror toward the player. */ x.scale(
      (q[8]?.visual?.facing === "right" ? 1 : -1) * (e.x < P.x ? 1 : -1),
      1,
    );
    let visual = q[8]?.visual,
      drawn =
        visual?.renderMode === "custom" ? false : drawMonsterSprite(e, q, r);
    if (!drawn) {
      let renderer =
        visual?.spriteKey === "lunatic"
          ? drawLunaticMonster
          : visual?.spriteKey === "creamy"
            ? drawCreamyMonster
            : visual?.spriteKey === "poring"
              ? drawPoringMonster
              : drawMissingMonster;
      renderer(q, r);
    }
    if (e.elite) {
      x.fillStyle = "#0009";
      x.fillRect(-r * 1.25, -r - 11, r * 2.5, 4);
      x.fillStyle = "#ff536c";
      x.fillRect(-r * 1.25, -r - 11, r * 2.5 * cl(e.hp / e.max, 0, 1), 4);
    }
    x.restore();
  }
  function drawMonsterSprite(e, q, r) {
    let sprite = monsterSprites[e.type];
    if (!sprite?.complete || !sprite.naturalWidth) return false;
    let h = q[8].visual.renderHeight || Math.max(8, r * 2.75),
      scale = h / sprite.naturalHeight,
      w = Math.max(8, sprite.naturalWidth * scale);
    x.imageSmoothingEnabled = false;
    x.drawImage(sprite, -w / 2, -h * 0.78, w, h);
    return true;
  }
  function drawMissingMonster(q, r) {
    x.fillStyle = q[1];
    x.fillRect(-r * 0.7, -r, r * 1.4, r * 1.7);
    x.font = "9px Arial";
    x.fillStyle = "#fff";
    x.textAlign = "center";
    x.fillText(q[0], 0, -r - 5);
  }
  function drawLunaticMonster(q, r) {
    if (lunaticSprite.complete && lunaticSprite.naturalWidth) {
      let w = Math.max(1, Math.ceil(r * 2.35)),
        h = Math.max(1, Math.ceil(r * 2.7));
      x.drawImage(lunaticSprite, -w / 2, -h * 0.72, w, h);
      return;
    }
    x.fillStyle = q[1];
    x.beginPath();
    x.ellipse(0, r * 0.18, r * 0.9, r * 0.7, 0, 0, TAU);
    x.fill();
    x.beginPath();
    x.moveTo(-r * 0.6, -r * 0.3);
    x.lineTo(-r * 0.62, -r * 1.18);
    x.lineTo(-r * 0.18, -r * 0.55);
    x.moveTo(r * 0.6, -r * 0.3);
    x.lineTo(r * 0.62, -r * 1.18);
    x.lineTo(r * 0.18, -r * 0.55);
    x.fill();
    x.fillStyle = "#17202a";
    x.beginPath();
    x.ellipse(-r * 0.3, r * 0.08, r * 0.08, r * 0.12, 0, 0, TAU);
    x.ellipse(r * 0.3, r * 0.08, r * 0.08, r * 0.12, 0, 0, TAU);
    x.fill();
  }
  function drawCreamyMonster(q, r) {
    let c = q[1],
      s = q[2];
    x.save();
    x.translate(0, -r * 0.12);
    x.strokeStyle = "#3a2948";
    x.lineWidth = Math.max(1, r * 0.08);
    x.lineJoin = "round";
    x.fillStyle = c;
    x.beginPath();
    x.ellipse(-r * 0.62, -r * 0.32, r * 0.72, r * 0.58, -0.48, 0, TAU);
    x.ellipse(r * 0.62, -r * 0.32, r * 0.72, r * 0.58, 0.48, 0, TAU);
    x.fill();
    x.fillStyle = "#f2c8ff";
    x.beginPath();
    x.ellipse(-r * 0.72, -r * 0.43, r * 0.24, r * 0.18, -0.45, 0, TAU);
    x.ellipse(r * 0.72, -r * 0.43, r * 0.24, r * 0.18, 0.45, 0, TAU);
    x.fill();
    x.fillStyle = s;
    x.beginPath();
    x.ellipse(0, r * 0.03, r * 0.23, r * 0.78, 0, 0, TAU);
    x.fill();
    x.stroke();
    x.strokeStyle = s;
    x.lineWidth = Math.max(1, r * 0.07);
    x.beginPath();
    x.moveTo(-r * 0.1, -r * 0.66);
    x.quadraticCurveTo(-r * 0.55, -r * 1.15, -r * 0.68, -r * 1.02);
    x.moveTo(r * 0.1, -r * 0.66);
    x.quadraticCurveTo(r * 0.55, -r * 1.15, r * 0.68, -r * 1.02);
    x.stroke();
    x.fillStyle = "#ffd66b";
    x.beginPath();
    x.arc(-r * 0.68, -r * 1.02, r * 0.08, 0, TAU);
    x.arc(r * 0.68, -r * 1.02, r * 0.08, 0, TAU);
    x.fill();
    x.fillStyle = "#2b1e35";
    x.beginPath();
    x.ellipse(-r * 0.09, -r * 0.02, r * 0.045, r * 0.08, 0, 0, TAU);
    x.ellipse(r * 0.09, -r * 0.02, r * 0.045, r * 0.08, 0, 0, TAU);
    x.fill();
    x.restore();
  }
  function drawPoringMonster(q, r) {
    if (poringSprite.complete && poringSprite.naturalWidth) {
      let w = Math.max(1, Math.ceil(r * 2.65)),
        h = Math.max(1, Math.ceil(r * 2.5));
      poringTintCanvas.width = w;
      poringTintCanvas.height = h;
      poringTintCtx.imageSmoothingEnabled = false;
      poringTintCtx.drawImage(poringSprite, 0, 0, w, h);
      poringTintCtx.globalCompositeOperation = "color";
      poringTintCtx.globalAlpha = 0.92;
      poringTintCtx.fillStyle = q[1];
      poringTintCtx.fillRect(0, 0, w, h);
      poringTintCtx.globalAlpha = 1;
      poringTintCtx.globalCompositeOperation = "destination-in";
      poringTintCtx.drawImage(poringSprite, 0, 0, w, h);
      poringTintCtx.globalCompositeOperation = "source-over";
      x.drawImage(poringTintCanvas, -w / 2, -h * 0.62);
      return;
    }
    poringShape(r);
    x.fillStyle = q[1];
    x.fill();
    x.save();
    x.clip();
    x.fillStyle = q[2];
    x.beginPath();
    x.ellipse(0, r * 0.57, r * 0.78, r * 0.3, 0, 0, TAU);
    x.fill();
    x.restore();
    x.fillStyle = "#ffffff55";
    x.beginPath();
    x.ellipse(-r * 0.34, -r * 0.5, r * 0.18, r * 0.1, -0.45, 0, TAU);
    x.fill();
    x.fillStyle = "#17202a";
    x.beginPath();
    x.ellipse(-r * 0.31, -r * 0.08, r * 0.06, r * 0.11, 0, 0, TAU);
    x.ellipse(r * 0.27, -r * 0.08, r * 0.06, r * 0.11, 0, 0, TAU);
    x.fill();
  }
  function shot(p) {
    let s = screen(p.x, p.y);
    x.save();
    x.translate(s.x, s.y);
    x.rotate(Math.atan2(p.vy, p.vx));
    x.shadowBlur = 12;
    x.shadowColor = p.col;
    x.fillStyle = p.col;
    x.fillRect(-12, -4, 24, 8);
    x.restore();
  }
  function gem(g) {
    let s = screen(g.x, g.y);
    x.save();
    x.translate(s.x, s.y);
    if (g.kind === "gift") {
      drawGiftBox();
      x.restore();
      return;
    }
    x.rotate(Math.PI / 4);
    x.fillStyle = g.heart
      ? "#ff627a"
      : g.kind === "jobExp"
        ? "#c693ff"
        : "#79d8ff";
    x.shadowBlur = 10;
    x.shadowColor = x.fillStyle;
    x.fillRect(-5, -5, 10, 10);
    x.rotate(-Math.PI / 4);
    x.shadowBlur = 0;
    x.font = "bold 7px Arial";
    x.textAlign = "center";
    x.textBaseline = "middle";
    x.fillStyle = "#183240";
    if (!g.heart) x.fillText(g.kind === "jobExp" ? "J" : "B", 0, 0);
    x.restore();
  }
  function drawGiftBox() {
    let size = 26;
    x.shadowBlur = 12;
    x.shadowColor = "#ffd66b";
    if (giftBoxSprite.complete && giftBoxSprite.naturalWidth) {
      x.imageSmoothingEnabled = false;
      x.drawImage(giftBoxSprite, -size / 2, -size / 2, size, size);
      x.shadowBlur = 0;
      return;
    }
    x.fillStyle = "#db4c5c";
    x.fillRect(-10, -7, 20, 15);
    x.fillStyle = "#4ba9e8";
    x.fillRect(-2, -8, 4, 17);
    x.fillRect(-12, -5, 24, 4);
    x.fillStyle = "#ffd66b";
    x.fillRect(-8, -10, 5, 4);
    x.fillRect(3, -10, 5, 4);
    x.shadowBlur = 0;
  }
  function drawDamageNumber(n) {
    let s = screen(n.x, n.y - n.lift),
      alpha = cl(n.life / 0.22, 0, 1),
      scale = n.crit ? 1.15 : 1;
    x.save();
    x.translate(s.x, s.y);
    x.scale(scale, scale);
    x.globalAlpha = alpha;
    x.textAlign = "center";
    x.textBaseline = "middle";
    x.lineJoin = "round";
    let size = n.crit ? 19 : 14;
    x.font = "900 " + size + "px Arial";
    if (n.crit) {
      let w = x.measureText(String(n.value)).width + 24,
        h = 27;
      x.rotate(Math.sin(n.seed + n.life * 8) * 0.035);
      x.fillStyle = "#6a3029";
      x.strokeStyle = "#e3a248";
      x.lineWidth = 2;
      x.beginPath();
      for (let i = 0; i < 20; i++) {
        let a = -Math.PI / 2 + (i * Math.PI) / 10,
          r = i % 2 ? Math.max(w, h) * 0.5 : Math.max(w, h) * 0.72,
          px = Math.cos(a) * r,
          py = Math.sin(a) * r;
        if (i === 0) x.moveTo(px, py);
        else x.lineTo(px, py);
      }
      x.closePath();
      x.fill();
      x.stroke();
      x.shadowColor = "#ffca57";
      x.shadowBlur = 10;
      x.fillStyle = "#ffe36b";
      x.strokeStyle = "#4b1e1e";
      x.lineWidth = 4;
      x.strokeText(String(n.value), 0, 0);
      x.fillText(String(n.value), 0, 0);
      x.shadowBlur = 0;
      x.font = "800 9px Arial";
      x.fillStyle = "#fff0a6";
      x.fillText("CRITICAL!", 0, -h * 0.72);
    } else {
      x.font = "900 14px Arial";
      x.fillStyle = "#fff5d6";
      x.strokeStyle = "#572b35";
      x.lineWidth = 3;
      x.strokeText(String(n.value), 0, 0);
      x.fillText(String(n.value), 0, 0);
    }
    x.restore();
  }
  function skillLabel(n) {
    let s = screen(n.x, n.y);
    x.save();
    x.globalAlpha = cl(n.life / n.m, 0, 1) * 0.72;
    x.textAlign = "center";
    x.textBaseline = "middle";
    x.font = "700 11px Arial";
    x.lineJoin = "round";
    x.fillStyle = "#e7f6ff";
    x.strokeStyle = "#13212b";
    x.lineWidth = 3;
    x.strokeText(n.text, s.x, s.y);
    x.fillText(n.text, s.x, s.y);
    x.restore();
  }
  function effect(f) {
    let s = screen(f.x, f.y);
    x.save();
    x.translate(s.x, s.y);
    x.globalAlpha = cl(f.life / f.m, 0, 1) * 0.75;
    x.strokeStyle = f.col;
    if (f.kind === "bowling") {
      x.lineWidth = 10;
      x.beginPath();
      x.arc(0, 0, f.r, 0, TAU);
      x.stroke();
      x.globalAlpha *= 0.55;
      x.lineWidth = 3;
      x.beginPath();
      x.arc(0, 0, f.r * 0.72, 0, TAU);
      x.stroke();
    } else if (f.kind === "melee") {
      x.rotate(f.a);
      x.lineWidth = 7;
      x.beginPath();
      x.arc(0, 0, f.r, -0.95, 0.95);
      x.stroke();
      x.globalAlpha *= 0.7;
      x.lineWidth = 3;
      x.beginPath();
      x.moveTo(-10, 0);
      x.lineTo(f.r, 0);
      x.stroke();
    } else {
      x.lineWidth = f.kind === "ring" ? 7 : f.width || 32;
      if (f.kind === "ring") {
        x.beginPath();
        x.arc(0, 0, f.r, 0, TAU);
        x.stroke();
      } else {
        x.rotate(f.a);
        x.beginPath();
        x.moveTo(0, 0);
        x.lineTo(f.r, 0);
        x.stroke();
      }
    }
    x.restore();
  }
  function particle(q) {
    let s = screen(q.x, q.y);
    x.globalAlpha = cl(q.life / q.m, 0, 1);
    x.fillStyle = q.col;
    x.fillRect(s.x, s.y, q.r, q.r);
    x.globalAlpha = 1;
  }
  function hud() {
    const now = performance.now();
    if (S.run && !S.pause && now - (hud.last || 0) < 100) return;
    hud.last = now;
    $("level").textContent = S.lvl;
    $("jobLevel").textContent = S.job;
    $("job").textContent = S.stage;
    $("hpText").textContent = Math.ceil(Math.max(0, S.hp)) + "/" + S.max;
    $("spText").textContent = Math.ceil(S.sp) + "/" + S.spMax;
    $("hp").style.width = cl(S.hp / S.max, 0, 1) * 100 + "%";
    $("sp").style.width = cl(S.sp / S.spMax, 0, 1) * 100 + "%";
    $("time").textContent = time(S.t);
    $("kills").textContent = S.kills;
    let legend = document.querySelector(".hud-side .legend");
    if (legend) legend.textContent = S.stage + " · Base 99 / Job 50";
    let q = totalStats();
    $("statGrid").innerHTML = STAT_KEYS.map(
      ([k, n]) =>
        '<div class="stat-cell"><span>' +
        n +
        " <em>" +
        q[k] +
        "</em></span></div>",
    ).join("");
    $("statPoints").textContent = "Hybrid";
    $("skillPointsText").textContent = S.skillPoints;
    renderActiveSkills();
    updateSkillStatus();
    $("buffs").innerHTML = Object.keys(BUFF_DEFS)
      .filter((id) => activeBuff(id))
      .map((id) => {
        let d = BUFF_DEFS[id],
          left = Math.max(0, Math.ceil(S.buffs[id].expiresAt - S.t));
        return (
          '<div class="buff" title="' +
          d.skill +
          " " +
          d.level +
          " · " +
          left +
          ' сек."><span class="buff-icon-wrap"><span class="buff-fallback">' +
          (d.icon || "✦") +
          '</span><img class="buff-icon" src="' +
          (d.iconUrl || "") +
          '" alt="" onerror="this.classList.add(\'is-missing\')"></span><span class="buff-copy"><b>' +
          d.name +
          "</b><span>" +
          left +
          " сек.</span></span></div>"
        );
      })
      .join("");
    updateSkillIndicator();
  }
  function finish(win) {
    S.run = false;
    S.end = true;
    try {
      RSStorage.clear(localStorage);
    } catch {}
    $("end").classList.remove("hide");
    $("endTitle").textContent = win
      ? "МИДГАРД ВЫДЕРЖАЛ ИСПЫТАНИЕ"
      : "ГЕРОЙ ПАЛ В БОЮ";
    $("endStats").innerHTML =
      "Время: <b>" +
      time(S.t) +
      "</b><br>Уровень: <b>" +
      S.lvl +
      "</b> · Профессия: <b>" +
      S.stage +
      "</b><br>Монстров повержено: <b>" +
      S.kills +
      "</b>";
  }
  function pause() {
    if (!S.run || S.end) return;
    if (S.pause) {
      evolveByProgression();
      S.pause = false;
      stopJoystick();
      $("pause").classList.add("hide");
      hud();
    } else openPause(false);
  }
  async function fullscreen() {
    let a = $("app"),
      on = !a.classList.contains("immersive");
    a.classList.toggle("immersive", on);
    try {
      if (
        !on &&
        (document.fullscreenElement || document.webkitFullscreenElement)
      ) {
        if (document.exitFullscreen) await document.exitFullscreen();
        else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
        return;
      }
      if (on) {
        if (a.requestFullscreen) await a.requestFullscreen();
        else if (a.webkitRequestFullscreen) await a.webkitRequestFullscreen();
        else
          say(
            "В Яндекс.Браузере включён компактный режим. Панель браузера скрывается только через меню браузера.",
          );
      }
    } catch (e) {
      say(
        "Включён компактный режим. Для полного экрана используйте меню Яндекс.Браузера",
      );
    }
  }
  let runtimeFault = false;
  const baseDraw = draw;
  draw = function () {
    if (runtimeFault) return;
    try {
      baseDraw();
      for (let n of skillTexts)
        if (
          n &&
          Number.isFinite(n.x) &&
          Number.isFinite(n.y) &&
          Number.isFinite(n.life) &&
          Number.isFinite(n.m)
        )
          skillLabel(n);
    } catch (e) {
      runtimeFault = true;
      S.run = false;
      S.pause = true;
      showFatal(
        "Ошибка игрового цикла. Нажмите «Перезагрузить», чтобы восстановить игру.",
        e,
      );
    }
  };
  function loop(now) {
    if (!S.run && !S.end) return;
    let dt = Math.min(0.05, (now - last) / 1000 || 0);
    last = now;
    try {
      update(dt);
      draw();
    } catch (e) {
      runtimeFault = true;
      S.run = false;
      S.pause = true;
      showFatal(
        "Ошибка игрового цикла. Нажмите «Перезагрузить», чтобы восстановить игру.",
        e,
      );
    }
    if (S.run) requestAnimationFrame(loop);
  }
  addEventListener("error", (e) => {
    if (runtimeFault || !S.run) return;
    runtimeFault = true;
    S.run = false;
    S.pause = true;
    showFatal(
      "Ошибка игрового цикла. Нажмите «Перезагрузить», чтобы восстановить игру.",
      e.error || e.message,
    );
  });
  addEventListener("unhandledrejection", (e) => {
    if (runtimeFault || !S.run) return;
    runtimeFault = true;
    S.run = false;
    S.pause = true;
    showFatal(
      "Ошибка игрового цикла. Нажмите «Перезагрузить», чтобы восстановить игру.",
      e.reason,
    );
  });
  addEventListener("keydown", (e) => {
    keys[e.key.toLowerCase()] = true;
    if (e.key.toLowerCase() === "p") pause();
    if (S.choose && ["1", "2", "3"].includes(e.key)) {
      let b = $("cards").children[+e.key - 1];
      if (b) b.click();
    }
  });
  addEventListener("keyup", (e) => (keys[e.key.toLowerCase()] = false));
  c.addEventListener("pointerdown", (e) => {
    if (!S.run || S.pause) return;
    let r = document.getElementById("app").getBoundingClientRect(),
      px = e.clientX - r.left,
      py = e.clientY - r.top,
      edge = JOY_MAX + 10;
    touch = {
      on: true,
      id: e.pointerId,
      bx: cl(px, edge, r.width - edge),
      by: cl(py, edge, r.height - edge),
      x: px,
      y: py,
      dx: 0,
      dy: 0,
      max: JOY_MAX,
    };
    updateJoystick();
    c.setPointerCapture?.(e.pointerId);
  });
  c.addEventListener("pointermove", (e) => {
    if (!touch.on || e.pointerId !== touch.id) return;
    let r = document.getElementById("app").getBoundingClientRect(),
      px = e.clientX - r.left,
      py = e.clientY - r.top,
      dx = px - touch.bx,
      dy = py - touch.by,
      d = Math.hypot(dx, dy) || 1;
    if (d > touch.max) {
      dx = (dx / d) * touch.max;
      dy = (dy / d) * touch.max;
    }
    touch.x = touch.bx + dx;
    touch.y = touch.by + dy;
    touch.dx = dx;
    touch.dy = dy;
    updateJoystick();
  });
  function stopJoystick() {
    touch.on = false;
    touch.id = null;
    touch.dx = 0;
    touch.dy = 0;
    updateJoystick();
  }
  function updateJoystick() {
    let j = $("joystick"),
      k = $("knob");
    j.style.left = touch.bx + "px";
    j.style.top = touch.by + "px";
    j.classList.toggle("visible", touch.on);
    k.style.transform = "translate(" + touch.dx + "px," + touch.dy + "px)";
  }
  c.addEventListener("pointerup", stopJoystick);
  c.addEventListener("pointercancel", stopJoystick);
  c.addEventListener("lostpointercapture", stopJoystick);
  function clearSelection() {
    let s = window.getSelection?.();
    if (s && s.removeAllRanges) s.removeAllRanges();
  }
  function saveRun() {
    if (!S.run || S.end) return false;
    try {
      return RSStorage.save(localStorage, {
        version: DB.gameVersion,
        experienceId: DB.experience.id,
        state: { ...S, run: false, pause: true },
        player: { ...P },
        enemies: en,
        gems,
        eid,
      });
    } catch {
      return false;
    }
  }
  function restoreRun() {
    let saved;
    try {
      saved = RSStorage.read(localStorage);
    } catch {
      return;
    }
    if (
      !saved ||
      !saved.state ||
      saved.experienceId !== DB.experience.id ||
      !STAGE_JOB_IDS[saved.state.stage] ||
      !Number.isFinite(saved.state.t) ||
      saved.state.t >= 1800 ||
      !saved.state.stats ||
      !Array.isArray(saved.enemies) ||
      !Array.isArray(saved.gems) ||
      !saved.player ||
      !Number.isFinite(saved.player.x) ||
      !Number.isFinite(saved.player.y) ||
      ![
        "lvl",
        "job",
        "xp",
        "jobXp",
        "jobNeed",
        "hp",
        "sp",
        "skillPoints",
      ].every((k) => Number.isFinite(saved.state[k])) ||
      !Object.values(saved.state.stats).every(
        (v) => Number.isFinite(v) && v >= 1 && v <= 99,
      )
    )
      return;
    snapshotRestore(saved);
  }
  function snapshotRestore(saved) {
    reset();
    Object.assign(S, saved.state, { run: false, pause: false, end: false });
    S.cooldowns = S.cooldowns || {};
    S.effects = S.effects || {};
    S.metrics = S.metrics || { damage: {}, casts: {}, spSpent: 0, taken: 0 };
    S.jobCapPrompted = S.jobCapPrompted || {};
    Object.assign(P, saved.player);
    en = (saved.enemies || [])
      .filter(
        (e) =>
          types[e.type] &&
          e.hp > 0 &&
          Number.isFinite(e.x) &&
          Number.isFinite(e.y),
      )
      .slice(0, MAX_ENEMIES);
    gems = (saved.gems || []).filter(
      (g) => Number.isFinite(g.x) && Number.isFinite(g.y),
    );
    eid = saved.eid || 10000;
    recalc();
    syncDebugControls();
    start();
    openPause(false);
  }
  function setupSaveButton() {
    let saved;
    try {
      saved = RSStorage.read(localStorage);
    } catch {}
    if (!saved || saved.experienceId !== DB.experience.id) {
      try {
        if (localStorage.getItem("rs.run.v1")) {
          const note = document.createElement("p");
          note.className = "muted";
          note.textContent =
            "Новая таблица опыта: начните новый забег. Предыдущее сохранение оставлено без изменений.";
          $("startBtn").after(note);
        }
      } catch {}
      return;
    }
    const b = document.createElement("button");
    b.id = "restoreRun";
    b.textContent = "ПРОДОЛЖИТЬ СОХРАНЁННЫЙ ЗАБЕГ";
    b.style.marginTop = "10px";
    b.onclick = restoreRun;
    $("startBtn").after(b);
  }
  function updateSkillStatus() {
    document.querySelectorAll("button[data-skill-id]").forEach((b) => {
      const d = SKILL_BY_ID[b.dataset.skillId],
        remaining = Math.max(0, (S.cooldowns[d.id] || 0) - S.t),
        off = !skillIsEnabled(d.id),
        low = !S.debugInfiniteSp && S.sp < d.spCost;
      let status = b.querySelector(".skill-status");
      if (!status) {
        status = document.createElement("span");
        status.className = "skill-status";
        b.querySelector(".skill-info").appendChild(status);
      }
      status.textContent = off
        ? "Off"
        : remaining > 0
          ? Math.ceil(remaining) + " сек."
          : low
            ? "Нет SP"
            : "Готов";
      b.classList.toggle("skill-no-sp", !off && low);
      b.title = d.name + " · SP " + d.spCost + " · " + d.description;
    });
  }
  function renderCharacterInfo() {
    const box = $("characterInfo");
    if (!box || !S.metrics) return;
    const q = totalStats(),
      rows = [
        ["Профессия", S.stage],
        ["Base / Job", S.lvl + " / " + S.job],
        ["ATK", S.atkMin + "–" + S.atkMax],
        ["Защита", S.armor],
        ["HIT / FLEE", S.hit + " / " + S.flee],
        ["Критический шанс", Math.round(S.crit * 100) + "%"],
        ["Интервал атаки", S.rate.toFixed(2) + " сек."],
        ...Object.entries(q).map(([k, v]) => [k.toUpperCase(), v]),
        ["Потрачено SP", Math.round(S.metrics.spSpent)],
        ["Получено урона", Math.round(S.metrics.taken)],
      ];
    box.innerHTML =
      "<dl>" +
      rows.map(([k, v]) => "<dt>" + k + "</dt><dd>" + v + "</dd>").join("") +
      "</dl><h3>Урон за забег</h3>" +
      Object.entries(S.metrics.damage)
        .map(
          ([id, v]) =>
            "<div>" +
            (SKILL_BY_ID[id]?.name || "Обычная атака") +
            ": " +
            Math.round(v) +
            "</div>",
        )
        .join("");
  }
  function setupPauseTabs() {
    const tabs = document.createElement("div");
    tabs.className = "pause-tabs";
    tabs.setAttribute("role", "tablist");
    const scroll = document.querySelector(".pause-scroll");
    scroll.before(tabs);
    const panels = {
      skills: document.createElement("section"),
      character: document.createElement("section"),
      settings: document.createElement("section"),
    };
    for (const [key, label] of [
      ["skills", "Навыки"],
      ["character", "Персонаж"],
      ["settings", "Настройки"],
    ]) {
      let b = document.createElement("button");
      b.textContent = label;
      b.type = "button";
      b.dataset.tab = key;
      b.setAttribute("role", "tab");
      b.onclick = () => {
        for (const [id, p] of Object.entries(panels))
          p.classList.toggle("hide", id !== key);
        tabs
          .querySelectorAll("button")
          .forEach((t) => t.setAttribute("aria-selected", String(t === b)));
        scroll.scrollTop = 0;
        renderCharacterInfo();
      };
      tabs.appendChild(b);
      panels[key].dataset.pausePanel = key;
      scroll.appendChild(panels[key]);
    }
    panels.skills.append($("pauseActiveSkills"), $("pauseCards"));
    panels.character.id = "characterInfo";
    panels.character.className = "character-info";
    panels.settings.append(
      document.querySelector(".pause-speed"),
      document.querySelector(".debug-switches"),
    );
    const version = document.createElement("p");
    version.textContent = "Сборка " + DB.gameVersion + " · Survivor adaptation";
    panels.settings.appendChild(version);
    tabs.querySelector("button").click();
  }
  const pauseBox = $("pause").querySelector(".box"),
    pauseScroll = document.createElement("div");
  pauseScroll.className = "pause-scroll";
  while (pauseBox.firstChild && pauseBox.firstChild !== $("resume"))
    pauseScroll.appendChild(pauseBox.firstChild);
  pauseBox.insertBefore(pauseScroll, $("resume"));
  setupPauseTabs();
  document.addEventListener("visibilitychange", () => {
    if (document.hidden && S.run && !S.pause) openPause(false);
  });
  addEventListener("pagehide", saveRun);
  const app = document.getElementById("app");
  app.addEventListener(
    "touchstart",
    (e) => {
      clearSelection();
      if (
        !e.target.closest("button") &&
        !e.target.closest(".skills") &&
        !e.target.closest("#cards") &&
        !e.target.closest(".pause-scroll") &&
        !e.target.closest("input") &&
        !e.target.closest(".top-hud")
      )
        e.preventDefault();
    },
    { capture: true, passive: false },
  );
  app.addEventListener(
    "touchmove",
    (e) => {
      clearSelection();
      if (
        e.target.closest("#cards") ||
        e.target.closest(".pause-scroll") ||
        e.target.closest(".skills")
      )
        return;
      e.preventDefault();
    },
    { capture: true, passive: false },
  );
  app.addEventListener("touchend", clearSelection, { passive: true });
  app.addEventListener("pointerdown", clearSelection, { passive: true });
  document.addEventListener("selectstart", (e) => {
    if (e.target.closest("#app")) {
      e.preventDefault();
      clearSelection();
    }
  });
  document.addEventListener("dragstart", (e) => {
    if (e.target.closest("#app")) e.preventDefault();
  });
  document.addEventListener("contextmenu", (e) => {
    if (e.target.closest("#app")) {
      e.preventDefault();
      clearSelection();
    }
  });
  document.addEventListener(
    "dblclick",
    (e) => {
      if (e.target.closest("#app")) {
        e.preventDefault();
        clearSelection();
      }
    },
    { passive: false },
  );
  addEventListener("resize", resizeCanvas);
  window.visualViewport?.addEventListener("resize", resizeCanvas);
  $("startBtn").onclick = start;
  $("resume").onclick = pause;
  $("pauseBtn").onclick = () => pause();
  $("restart").onclick = () => {
    reset();
    start();
  };
  $("fatalReload").onclick = () => location.reload();
  document.querySelectorAll(".speed").forEach(
    (b) =>
      (b.onclick = () => {
        S.spd = +b.dataset.s;
        document
          .querySelectorAll(".speed")
          .forEach((q) => q.classList.remove("active"));
        b.classList.add("active");
      }),
  );
  $("debugInfiniteHp").onchange = (e) => {
    S.debugInfiniteHp = e.target.checked;
    if (S.debugInfiniteHp) S.hp = S.max;
    hud();
  };
  $("debugInfiniteSp").onchange = (e) => {
    S.debugInfiniteSp = e.target.checked;
    if (S.debugInfiniteSp) S.sp = S.spMax;
    hud();
  };
  function jobExpDisplay() {
    return { xp: Math.floor(S.jobXp || 0), need: S.jobNeed };
  }
  function updateXpText() {
    let j = jobExpDisplay();
    $("xpText").textContent =
      S.lvl >= 99 ? "MAX" : Math.floor(S.xp) + "/" + S.need;
    $("xp").style.width =
      (S.lvl >= 99 ? 100 : cl(S.xp / S.need, 0, 1) * 100) + "%";
    $("jobXpText").textContent = jobCapReached() ? "MAX" : j.xp + "/" + j.need;
    $("jobXp").style.width =
      (jobCapReached() ? 100 : cl(j.xp / j.need, 0, 1) * 100) + "%";
    $("critText").textContent = Math.round(S.crit * 100) + "%";
  }
  setInterval(updateXpText, 100);
  document.querySelector(".hud-side").addEventListener("click", (e) => {
    if (
      !S.run ||
      S.end ||
      e.target.closest("button") ||
      e.target.closest(".buffs")
    )
      return;
    pause();
  });
  syncViewportLayout();
  resizeCanvas();
  reset();
  setupSaveButton();
  updateXpText();
  draw();
  window.RS_BOOTED = true;
  if (new URLSearchParams(location.search).has("test"))
    window.RS_TEST = {
      state: S,
      player: P,
      enemies: () => en,
      gems: () => gems,
      hit,
      spawn,
      update,
      draw,
      xp,
      awardJobXp,
      evolveByProgression,
      reset,
      start,
      pause,
      special,
      recalc,
      skillAvailable,
      jobCapReached,
      skillRuns,
      saveRun,
      restoreRun,
    };
})();
