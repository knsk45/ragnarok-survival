const test = require("node:test"),
  assert = require("node:assert/strict"),
  fs = require("node:fs"),
  path = require("node:path");
const { JSDOM } = require("jsdom");
const root = path.resolve(__dirname, "..");
function boot() {
  const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
  const dom = new JSDOM(html, {
    runScripts: "outside-only",
    url: "https://example.test/?test=1",
    pretendToBeVisual: true,
  });
  const w = dom.window;
  const canvas = new Proxy(
    { measureText: (t) => ({ width: String(t).length * 8 }) },
    {
      get: (obj, key) => (key in obj ? obj[key] : () => {}),
      set: (obj, key, val) => ((obj[key] = val), true),
    },
  );
  w.HTMLCanvasElement.prototype.getContext = () => canvas;
  w.HTMLElement.prototype.getBoundingClientRect = () => ({
    x: 0,
    y: 0,
    left: 0,
    top: 0,
    width: 390,
    height: 660,
    right: 390,
    bottom: 660,
  });
  w.requestAnimationFrame = () => 1;
  w.Image = class {
    constructor() {
      this.complete = false;
      this.naturalWidth = 0;
    }
  };
  for (const script of html.matchAll(/<script src="([^"?]+)[^"]*"><\/script>/g))
    w.eval(fs.readFileSync(path.join(root, script[1]), "utf8"));
  for (const script of html.matchAll(/<script>([\s\S]*?)<\/script>/g))
    w.eval(script[1]);
  assert(w.RS_TEST, "runtime booted");
  return { dom, w, g: w.RS_TEST };
}
test("capped Base still allows Job EXP and MAX bars stay finite",()=>{const {dom,w,g}=boot();g.state.lvl=98;g.state.need=1252761;g.xp(1252761,0);assert.equal(g.state.lvl,99);assert.equal(w.document.querySelector('#xpText').textContent,'MAX');assert.equal(w.document.querySelector('#xp').style.width,'100%');g.state.stage='Knight';g.state.job=1;g.state.jobXp=0;g.state.jobNeed=2500;g.xp(0,2500);assert.equal(g.state.job,2);assert.equal(g.state.jobNeed,4200);assert.equal(g.state.lvl,99);dom.window.close()});
test("disabled learned skills disappear only from the lower HUD", () => {
  const { dom, w, g } = boot();
  g.start();
  g.pause();
  const button = w.document.querySelector(
    '#pauseActiveSkills [data-skill-id="first_aid"]',
  );
  button.click();
  assert.equal(g.state.firstAid, 1);
  assert(!w.document.querySelector('#skills [data-skill-id="first_aid"]'));
  assert(
    w.document.querySelector('#pauseActiveSkills [data-skill-id="first_aid"]'),
  );
  w.document
    .querySelector('#pauseActiveSkills [data-skill-id="first_aid"]')
    .click();
  assert(w.document.querySelector('#skills [data-skill-id="first_aid"]'));
  dom.window.close();
});
test("each normal or elite death emits full, separate canonical Base/Job rewards", () => {
  const { dom, w, g } = boot();
  for (const elite of [false, true]) {
    g.reset();
    g.spawn("poring", elite);
    const m = g.enemies()[0];
    g.hit(m, 1e9);
    const b = g.gems().filter((x) => x.kind === "baseExp"),
      j = g.gems().filter((x) => x.kind === "jobExp");
    assert.equal(b.length, 1);
    assert.equal(j.length, 1);
    assert.equal(b[0].amount, 27);
    assert.equal(j[0].amount, 20);
    assert.equal(g.state.xp, 0);
    assert.equal(g.state.jobXp, 0);
  }
  dom.window.close();
});
test("Base and Job crystals apply configured rates exactly once to independent counters", () => {
  const { dom, g } = boot();
  g.spawn("poring");
  g.hit(g.enemies()[0], 1e9);
  g.start();
  g.state.spawn = 100;
  const b = g.gems().find((x) => x.kind === "baseExp"),
    j = g.gems().find((x) => x.kind === "jobExp");
  for (const drop of g.gems()) {
    drop.x = 2000;
    drop.y = 2000;
  }
  b.x = b.y = 0;
  g.update(0);
  assert.equal(g.state.xp, 135);
  assert.equal(g.state.job, 1);
  assert.equal(g.state.jobXp, 0);
  j.x = j.y = 0;
  g.update(0);
  assert.equal(g.state.xp, 135);
  assert.equal(g.state.job, 3);
  assert.equal(g.state.jobXp, 12);
  g.update(0);
  assert.equal(g.state.xp, 135);
  assert.equal(g.state.jobXp, 12);
  dom.window.close();
});
test("Base levels never grant Job levels, and evolution has no Base gate", () => {
  const { dom, g } = boot();
  g.xp(50000, 0);
  assert(g.state.lvl > 1);
  assert.equal(g.state.job, 1);
  assert.equal(g.state.skillPoints, 0);
  g.reset();
  g.awardJobXp(1151);
  assert.equal(g.state.job, 10);
  assert.equal(g.state.lvl, 1);
  g.state.basic = 9;
  g.state.skillPoints = 0;
  g.evolveByProgression();
  assert.equal(g.state.stage, "Swordman");
  assert.equal(g.state.lvl, 1);
  assert.equal(g.state.jobNeed, 60);
  dom.window.close();
});
test("boot, pause, settings and resume work; passive/unlearned skills absent", () => {
  let { dom, w, g } = boot();
  g.start();
  w.document.querySelector("#pauseBtn").click();
  assert(g.state.pause);
  assert(w.document.querySelector(".pause-scroll"));
  assert(!w.document.querySelector(".pause-scroll #resume"));
  assert(
    !w.document
      .querySelector("#pauseActiveSkills")
      .textContent.includes("Basic Skill"),
  );
  assert(
    w.document
      .querySelector("#pauseActiveSkills")
      .textContent.includes("Play Dead"),
  );
  w.document.querySelector('[data-tab="settings"]').click();
  assert.equal(w.document.querySelector('#experienceRates').textContent,
    'Base EXP ×5 · Job EXP ×2');
  assert(!w.document.querySelector('#experienceRates').closest('.hide'));
  w.document.querySelector("#debugInfiniteHp").click();
  assert(g.state.debugInfiniteHp);
  w.document.querySelector("#resume").click();
  assert(!g.state.pause);
  dom.window.close();
});
test("kill is awarded once in integrated engine", () => {
  const { dom, g } = boot();
  g.spawn();
  g.spawn();
  let a = g.enemies()[0],
    b = g.enemies()[1];
  g.hit(a, 1e9);
  g.hit(a, 1e9);
  assert.equal(g.state.kills, 1);
  assert(g.enemies().includes(b));
  dom.window.close();
});
test("skill uses DB cost and independent cooldown without mutating learned level", () => {
  const { dom, w, g } = boot();
  Object.assign(g.state, { stage: "Swordman", bash: 1, sp: 50 });
  g.spawn();
  const e = g.enemies()[0];
  e.x = 80;
  e.y = 0;
  e.hp = 1e6;
  g.special();
  assert.equal(g.state.sp, 42);
  assert.equal(g.state.cooldowns.bash, 1.2);
  g.special();
  assert.equal(g.state.sp, 42);
  g.state.skillEnabled.bash = false;
  g.state.t = 10;
  g.special();
  assert.equal(g.state.bash, 1);
  assert.equal(g.state.sp, 42);
  dom.window.close();
});
test("job XP is independent; cap pause and evolution preserve skills and recalculate HP", () => {
  const { dom, g } = boot();
  g.start();
  g.awardJobXp(1e8);
  assert.equal(g.state.lvl, 1);
  assert.equal(g.state.job, 10);
  assert.equal(g.state.skillPoints, 9);
  assert(g.state.pause);
  g.state.lvl = 15;
  g.state.basic = 9;
  g.state.skillPoints = 0;
  g.evolveByProgression();
  assert.equal(g.state.stage, "Swordman");
  assert.equal(g.state.basic, 9);
  assert.equal(g.state.job, 1);
  assert(g.state.max > 100);
  dom.window.close();
});
test("all monster render branches execute without throwing (mock Canvas)", () => {
  const { dom, w, g } = boot();
  g.state.lvl = 99;
  for (const m of Object.values(w.RS_DATABASE.monsters)) {
    g.state.lvl = m.stats.level;
    g.spawn(m.key);
    const e = g.enemies().at(-1);
    e.x = 0;
    e.y = 30;
    g.draw();
    assert(
      w.document.querySelector("#fatal").classList.contains("hide"),
      m.key,
    );
  }
  dom.window.close();
});
test("saved run restores player, enemies, SP, learned skills and pauses safely", () => {
  const { dom, w, g } = boot();
  g.start();
  g.state.bash = 3;
  g.state.sp = 17;
  g.player.x = 123;
  g.spawn();
  assert(g.saveRun());
  g.state.bash = 0;
  g.state.sp = 0;
  g.player.x = 999;
  g.restoreRun();
  assert.equal(g.state.bash, 3);
  assert.equal(g.state.sp, 17);
  assert.equal(g.player.x, 123);
  assert.equal(g.enemies().length, 1);
  assert(g.state.pause);
  w.document.querySelector("#resume").click();
  assert(!g.state.pause);
  dom.window.close();
});
test("no target means no mana spent; a free active skill remains visible", () => {
  const { dom, w, g } = boot();
  g.state.stage = "Knight";
  g.state.charge = 1;
  g.state.magnum = 10;
  g.state.sp = 20;
  g.special();
  assert.equal(g.state.sp, 20);
  g.pause();
  g.start();
  g.pause();
  assert(
    w.document
      .querySelector("#pauseActiveSkills")
      .textContent.includes("Charge Attack"),
  );
  dom.window.close();
});
test("30-minute deterministic-time simulation with all classes and learned skills does not crash", () => {
  const { dom, w, g } = boot();
  g.start();
  g.state.debugInfiniteHp = true;
  g.state.debugInfiniteSp = true;
  for (let n = 0; n < 18001; n++) {
    if (n === 1000) {
      g.state.stage = "Swordman";
      g.state.lvl = 40;
    }
    if (n === 6000) {
      g.state.stage = "Knight";
      g.state.lvl = 90;
    }
    for (const d of w.RS_DATABASE.skills)
      if (d.implemented) g.state[d.stateKey] = d.maxLevel;
    g.state.skillPoints = 0;
    g.state.pause = false;
    g.update(0.1);
    if (n % 200 === 0) {
      g.draw();
      for (const key of ["hp", "sp", "atkMin", "atkMax", "t"])
        assert(Number.isFinite(g.state[key]), key);
    }
  }
  assert(g.state.end);
  assert(w.document.querySelector("#fatal").classList.contains("hide"));
  dom.window.close();
});
