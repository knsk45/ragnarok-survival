const test = require("node:test"),
  assert = require("node:assert/strict"),
  fs = require("node:fs"),
  vm = require("node:vm"),
  path = require("node:path");
const core = require("../engine/core.js");
const root = path.resolve(__dirname, "..");
test("single death cannot remove unrelated monster", () => {
  const a = { hp: 0 },
    b = { hp: 10 },
    list = [a, b];
  assert.equal(core.removeDead(list, a), true);
  assert.equal(core.removeDead(list, a), false);
  assert.deepEqual(list, [b]);
});
test("wave has finite length and width; circle has correct radius", () => {
  const wave = { kind: "wave", x: 0, y: 0, a: 0, r: 100, width: 32 };
  assert(core.contains(wave, { x: 50, y: 0, r: 1 }));
  assert(!core.contains(wave, { x: 10000, y: 0, r: 1 }));
  assert(!core.contains(wave, { x: 50, y: 30, r: 1 }));
  assert(
    core.contains({ kind: "ring", x: 0, y: 0, r: 70 }, { x: 60, y: 0, r: 1 }),
  );
  assert(
    !core.contains({ kind: "ring", x: 0, y: 0, r: 70 }, { x: 80, y: 0, r: 1 }),
  );
});
test("spawn is outside every supported viewport", () => {
  for (const [w, h] of [
    [320, 568],
    [390, 660],
    [768, 1024],
    [1366, 768],
  ])
    for (let n = 0; n < 100; n++) {
      const p = core.spawnPoint({ x: 0, y: 0 }, w, h);
      assert(Math.abs(p.x) > w / 2 || Math.abs(p.y) > h / 2);
    }
});
test("defense and flee affect combat", () => {
  assert(core.damage(100, 100) < core.damage(100, 0));
  assert(core.chance(200, 250) < core.chance(200, 150));
});
function database() {
  const c = { window: {} };
  vm.createContext(c);
  for (const f of [
    "sources",
    "stats",
    "jobs",
    "characters",
    "progression",
    "experience",
    "equipment",
    "builds",
    "skills",
    "skill-runtime",
    "monsters",
    "bosses",
    "buffs",
    "items",
    "artwork",
    "database",
  ])
    vm.runInContext(
      fs.readFileSync(path.join(root, "data", f + ".js"), "utf8"),
      c,
    );
  return c.window.RS_DATABASE;
}
test("database schema, skill links and cycles validate", () => {
  const db = database();
  assert.equal(core.validate(db), db);
  db.skills[0].requires.push({ skillId: "missing", level: 1 });
  assert.throws(() => core.validate(db));
});
test("all local resource and script references exist", () => {
  const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
  for (const m of html
    .split("<body>")[0]
    .matchAll(/(?:src|href)="([^"?#]+)(?:[^\"]*)"/g)) {
    if (!m[1].startsWith("http"))
      assert(fs.existsSync(path.join(root, m[1])), m[1]);
  }
  const db = database();
  for (const def of [...Object.values(db.monsters), ...Object.values(db.items)])
    if (def.visual?.spriteUrl)
      assert(fs.existsSync(path.join(root, def.visual.spriteUrl)));
  for (const b of Object.values(db.buffs))
    assert(fs.existsSync(path.join(root, b.iconUrl)));
});
test("all scripts parse and no duplicate skill ids exist", () => {
  for (const dir of ["data", "engine"])
    for (const f of fs
      .readdirSync(path.join(root, dir))
      .filter((f) => f.endsWith(".js")))
      new vm.Script(fs.readFileSync(path.join(root, dir, f), "utf8"));
  const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
  for (const m of html.matchAll(/<script>([\s\S]*?)<\/script>/g))
    new vm.Script(m[1]);
  const db = database();
  assert.equal(new Set(db.skills.map((s) => s.id)).size, db.skills.length);
});
test("spawn pool has no missing levels 1–99", () => {
  const monsters = Object.values(database().monsters).filter(m=>!m.isBoss);
  for (let l = 1; l <= 99; l++)
    assert(
      monsters.some((m) => l >= m.stats.level && l <= m.stats.level + 15),
      "level " + l,
    );
});
module.exports = { root };
test("canonical Renewal EXP tables have exact fixtures and totals", () => {
  const db = database(),
    e = db.experience;
  assert.equal(core.baseNeed(1, e), 548);
  assert.equal(core.baseNeed(98, e), 1252761);
  assert.equal(core.baseNeed(99, e), 0);
  assert.equal(
    e.base.reduce((a, b) => a + b, 0),
    14305769,
  );
  assert.equal(core.jobNeed(1, "Novice", e), 10);
  assert.equal(core.jobNeed(9, "Novice", e), 340);
  assert.equal(core.jobNeed(1, "Swordman", e), 60);
  assert.equal(core.jobNeed(1, "Knight", e), 2500);
  assert.equal(core.jobNeed(49, "Knight", e), 345400);
  assert.equal(
    e.jobs.Knight.reduce((a, b) => a + b, 0),
    5601400,
  );
  for (const stage of ["Swordman", "Knight"])
    assert.equal(core.jobNeed(50, stage, e), 0);
});
test("automatic equipment starts at B70, grows monotonically and caps at B99", () => {
  const profile=database().equipment.profiles.knight_auto_gear;
  for(let level=1;level<70;level++)assert.equal(core.equipmentBonus(level,profile).weaponAtk,0);
  let previous={weaponAtk:0,hit:0,defense:0};
  for(let level=70;level<=99;level++){
    const gear=core.equipmentBonus(level,profile);
    for(const field of ['weaponAtk','hit','defense'])assert(gear[field]>previous[field]);
    previous=gear;
  }
  assert.equal(core.equipmentBonus(80,profile).weaponAtk,900);
  assert.equal(core.equipmentBonus(99,profile).hit,140);
  assert.equal(core.equipmentBonus(99,profile).defense,150);
  assert.deepEqual(core.equipmentBonus(999,profile),core.equipmentBonus(99,profile));
});
test("boss roster matches all 17 filtered IDs and stays separate from regular monsters", () => {
  const db=database();
  assert.deepEqual(Array.from(db.bosses.roster,k=>db.monsters[k].id),
    [1089,1093,1090,1091,1262,1582,1283,1096,1307,1289,1388,1120,2192,1320,1092,2208,1302]);
  assert.equal(db.bosses.maxRegular,3);
  let previous=0;
  for(const key of db.bosses.roster){
    const m=db.monsters[key];
    assert(m.isBoss && m.stats.level>=previous);
    previous=m.stats.level;
    assert.equal(m.drops.giftBoxPlain,1);
    assert(m.source.includes('/'+m.id+'/'));
    assert(m.visual.spriteUrl.startsWith('assets/'));
    assert(m.sourceRefs.every(ref=>db.sourceRegistry.records[ref]));
  }
});
test("monster rewards and image bytes match the primary-source snapshot", () => {
  const db = database(),
    snap = JSON.parse(
      fs.readFileSync(path.join(root, "data/irowiki-snapshot.json"), "utf8"),
    ),
    crypto = require("node:crypto");
  assert.equal(snap.files.length, 61);
  for (const art of snap.files) {
    const bytes = fs.readFileSync(path.join(root, art.path));
    assert.equal(
      crypto.createHash("sha256").update(bytes).digest("hex"),
      art.sha256,
      art.path,
    );
    assert.equal(bytes.subarray(0, 8).toString("hex"), "89504e470d0a1a0a");
    if (art.group === "monsters") {
      const m = db.monsters[art.key];
      assert.equal(m.id, art.id);
      for (const key of ["hp", "baseExp", "jobExp"])
        assert.equal(m.combat[key], art.stats[key], art.key + " " + key);
      assert.equal(m.visual.renderMode, "sprite");
    }
  }
  assert.equal(db.monsters.fabre.id, 1007);
  assert.equal(db.monsters.poporing.stats.level, 30);
  for (const skill of db.skills)
    assert(
      skill.iconUrl && fs.existsSync(path.join(root, skill.iconUrl)),
      skill.id,
    );
});
