(function (root) {
  "use strict";
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  function contains(f, e) {
    const dx = e.x - f.x,
      dy = e.y - f.y,
      r = e.r || 0;
    if (f.kind === "ring" || f.kind === "bowling")
      return Math.hypot(dx, dy) <= f.r + r;
    const along = dx * Math.cos(f.a) + dy * Math.sin(f.a),
      side = -dx * Math.sin(f.a) + dy * Math.cos(f.a);
    return (
      along >= -r &&
      along <= f.r + r &&
      Math.abs(side) <= (f.width || 32) / 2 + r
    );
  }
  function removeDead(enemies, e) {
    const i = enemies.indexOf(e);
    if (i < 0 || e.dead || e.hp > 0) return false;
    e.dead = true;
    enemies.splice(i, 1);
    return true;
  }
  function chance(hit, flee) {
    return clamp(0.8 + (hit - flee) / 100, 0.05, 0.95);
  }
  function damage(raw, def = 0) {
    return Math.max(1, Math.round((raw * 100) / (100 + Math.max(0, def))));
  }
  function baseNeed(level, experience = root.RS_EXPERIENCE) {
    const value = experience?.base?.[level];
    if (!Number.isInteger(value) || value < 0)
      throw Error("Нет Base EXP для уровня " + level);
    return value;
  }
  function jobNeed(job, stage, experience = root.RS_EXPERIENCE) {
    const value = experience?.jobs?.[stage]?.[job];
    if (!Number.isInteger(value) || value < 0)
      throw Error("Нет Job EXP: " + stage + " " + job);
    return value;
  }
  function spawnPoint(player, width, height, random = Math.random) {
    const edge = Math.floor(random() * 4),
      margin = 80 + random() * 80;
    if (edge < 2)
      return {
        x: player.x + (edge === 0 ? -1 : 1) * (width / 2 + margin),
        y: player.y + (random() - 0.5) * height,
      };
    return {
      x: player.x + (random() - 0.5) * width,
      y: player.y + (edge === 2 ? -1 : 1) * (height / 2 + margin),
    };
  }
  function validate(db) {
    if (
      !db ||
      !db.jobs ||
      !db.monsters ||
      !Array.isArray(db.skills) ||
      !db.progression
    )
      throw Error("База данных неполна");
    if (
      db.experience?.ruleset !== "renewal" ||
      db.experience.base.length !== 100
    )
      throw Error("Таблица Base EXP не загружена");
    for (let level = 1; level < 99; level++)
      if (!(baseNeed(level, db.experience) > 0))
        throw Error("Неверная строка Base EXP");
    for (const [stage, cap] of Object.entries({
      Novice: 10,
      Swordman: 50,
      Knight: 50,
    })) {
      for (let level = 1; level < cap; level++)
        if (!(jobNeed(level, stage, db.experience) > 0))
          throw Error("Неверная строка Job EXP");
      if (jobNeed(cap, stage, db.experience) !== 0)
        throw Error("Неверный Job cap");
    }
    if (!db.bosses || !Array.isArray(db.bosses.roster) ||
      new Set(db.bosses.roster).size !== db.bosses.roster.length ||
      !(db.bosses.firstSpawnAt >= 0) || !(db.bosses.cooldown > 0) ||
      !Number.isInteger(db.bosses.maxRegular) || db.bosses.maxRegular < 0)
      throw Error("Некорректная конфигурация боссов");
    for (const key of db.bosses.roster) {
      const m = db.monsters[key];
      if (!m?.isBoss || m.drops?.giftBoxPlain !== 1 || !m.visual?.spriteUrl)
        throw Error("Некорректный босс: " + key);
    }
    const byId = new Map(),
      states = new Set();
    for (const s of db.skills) {
      if (byId.has(s.id) || states.has(s.stateKey))
        throw Error("Повтор навыка: " + s.id);
      byId.set(s.id, s);
      states.add(s.stateKey);
      if (
        !db.jobs[s.jobId] ||
        !s.type ||
        !s.runtime ||
        !Number.isFinite(s.spCost) ||
        s.spCost < 0 ||
        s.cooldown < 0
      )
        throw Error("Некорректный навык: " + s.id);
    }
    const visiting = new Set(),
      visited = new Set();
    function visit(id) {
      if (visiting.has(id)) throw Error("Цикл навыков: " + id);
      if (visited.has(id)) return;
      visiting.add(id);
      for (const r of byId.get(id).requires) {
        const parent = byId.get(r.skillId);
        if (!parent || r.level > parent.maxLevel)
          throw Error("Зависимость навыка: " + id);
        visit(parent.id);
      }
      visiting.delete(id);
      visited.add(id);
    }
    for (const id of byId.keys()) visit(id);
    for (const m of Object.values(db.monsters))
      if (
        !m.key ||
        !Number.isFinite(m.stats?.level) ||
        !(m.combat?.hp > 0) ||
        !Number.isFinite(m.combat?.atkMin) ||
        !Number.isFinite(m.visual?.radius) ||
        !Number.isInteger(m.combat?.baseExp) ||
        !Number.isInteger(m.combat?.jobExp)
      )
        throw Error("Некорректный монстр: " + m.key);
    return db;
  }
  const api = {
    clamp,
    contains,
    removeDead,
    chance,
    damage,
    baseNeed,
    jobNeed,
    spawnPoint,
    validate,
  };
  root.RSCore = api;
  if (typeof module !== "undefined") module.exports = api;
})(typeof window !== "undefined" ? window : globalThis);
