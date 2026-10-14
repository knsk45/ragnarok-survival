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
    "builds",
    "skills",
    "skill-runtime",
    "monsters",
    "buffs",
    "items",
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
  const monsters = Object.values(database().monsters);
  for (let l = 1; l <= 99; l++)
    assert(
      monsters.some((m) => l >= m.stats.level && l <= m.stats.level + 15),
      "level " + l,
    );
});
module.exports = { root };
