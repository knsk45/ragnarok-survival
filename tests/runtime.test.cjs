const test = require("node:test"), assert = require("node:assert/strict");
const {boot}=require("./helpers.cjs");
test("capped Base still allows Job EXP and MAX bars stay finite",()=>{const {dom,w,g}=boot();g.state.lvl=98;g.state.need=1252761;g.xp(1252761,0);assert.equal(g.state.lvl,99);assert.equal(w.document.querySelector('#xpText').textContent,'MAX');assert.equal(w.document.querySelector('#xp').style.width,'100%');g.state.stage='Knight';g.state.job=1;g.state.jobXp=0;g.state.jobNeed=2500;g.xp(0,250);assert.equal(g.state.job,2);assert.equal(g.state.jobNeed,4200);assert.equal(g.state.lvl,99);dom.window.close()});
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
  assert.equal(g.state.xp, 127);
  assert.equal(g.state.lvl, 2); // 27 × 25 = 675; 548 spent, 127 carried over.
  assert.equal(g.state.job, 1);
  assert.equal(g.state.jobXp, 0);
  j.x = j.y = 0;
  g.update(0);
  assert.equal(g.state.xp, 127);
  assert.equal(g.state.job, 6);
  assert.equal(g.state.jobXp, 113);
  g.update(0);
  assert.equal(g.state.xp, 127);
  assert.equal(g.state.jobXp, 113);
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
    'Base EXP ×25 · Job EXP ×15');
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
    g.reset();
    g.state.lvl = m.stats.level;
    assert(g.spawn(m.key, false, !!m.isBoss), m.key);
    const e = g.enemies().at(-1);
    assert.equal(e.type,m.key);
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
test("equipment recalculation is idempotent and survives save/restore", () => {
  const {dom,w,g}=boot();
  g.start();g.state.stage='Knight';g.state.job=50;
  g.xp(w.RS_DATABASE.experience.base.slice(1,99).reduce((a,b)=>a+b,0)/25,0);
  const before=[g.state.atkMin,g.state.atkMax,g.state.hit,g.state.armor];
  assert(g.state.atkMin>1700);
  g.recalc();g.recalc();
  assert.deepEqual([g.state.atkMin,g.state.atkMax,g.state.hit,g.state.armor],before);
  assert(g.saveRun());g.reset();g.restoreRun();
  assert.deepEqual([g.state.atkMin,g.state.atkMax,g.state.hit,g.state.armor],before);
  dom.window.close();
});
test("late bosses can be defeated with basic attacks without spending SP", () => {
  for(const [level,key,limit] of [[81,'maya_purple',170],[99,'wild_rider',90],[99,'dark_illusion',70]]){
    const {dom,w,g}=boot();let seed=12345;
    w.Math.random=()=>((seed=(seed*1664525+1013904223)>>>0)/4294967296);
    g.start();g.state.stage='Knight';g.state.job=50;
    g.xp(w.RS_DATABASE.experience.base.slice(1,level).reduce((a,b)=>a+b,0)/25,0);
    g.state.spawn=1e9;g.state.nextBoss=1e9;g.state.debugInfiniteHp=true;
    for(const skill of w.RS_DATABASE.skills)g.state.skillEnabled[skill.id]=false;
    assert(g.spawn(key,false,true));
    const boss=g.enemies().find(e=>e.boss);
    boss.x=g.player.x+35;boss.y=g.player.y;boss.speed=0;
    let elapsed=0;
    while(!boss.dead&&elapsed<limit){g.update(.1);elapsed+=.1}
    assert(boss.dead,key+' within '+limit+' seconds of continuous melee');
    assert.equal(g.state.metrics.spSpent,0);
    dom.window.close();
  }
});
test("learning Riding selects the mounted sprite only for Knight, including after restore", () => {
  const {dom,w,g,images,canvas}=boot();const calls=[];
  canvas.drawImage=(...args)=>calls.push(args);
  const mount=images.find(i=>i.src==='assets/irowiki/characters/knight-peco-male.png');
  mount.complete=true;mount.naturalWidth=mount.naturalHeight=150;
  g.start();g.state.stage='Knight';g.state.job=2;g.state.endure=1;g.state.skillPoints=1;
  g.pause();
  const card=[...w.document.querySelectorAll('#pauseCards button')].find(b=>b.querySelector('strong').textContent.trim()==='Peco Peco Ride');
  assert(card && !card.disabled);
  g.draw();assert(!calls.some(a=>a[0]===mount));
  card.click();assert.equal(g.state.peco,1);
  calls.length=0;g.draw();
  assert(calls.some(a=>a[0]===mount&&a[1]===38&&a[3]===69&&a[4]===113));
  assert(g.saveRun());g.reset();g.restoreRun();
  calls.length=0;g.draw();assert(calls.some(a=>a[0]===mount));
  g.state.stage='Swordman';calls.length=0;g.draw();
  assert(!calls.some(a=>a[0]===mount));
  dom.window.close();
});
test("boss queue respects time, unlocks, one living boss and regular cap of three", () => {
  const {dom,w,g}=boot();
  g.state.t=119; g.state.lvl=99;
  assert.equal(g.spawnBoss(),false);
  g.state.t=120; g.state.lvl=26;
  assert.equal(g.spawnBoss(),false);
  g.state.lvl=27;
  for(let i=0;i<60;i++)g.spawn();
  assert.equal(g.spawnBoss(),true);
  const boss=g.enemies().find(e=>e.boss);
  assert.equal(boss.type,'toad');
  assert.equal(boss.hp,w.RS_DATABASE.monsters.toad.combat.hp);
  assert.equal(g.enemies().filter(e=>!e.boss).length,3);
  assert.equal(g.spawn(),false);
  assert.equal(g.spawnBoss(),false);
  const regular=g.enemies().find(e=>!e.boss);
  g.hit(regular,1e9);
  assert.equal(g.spawn(),true);
  assert.equal(g.spawn(),false);
  g.state.t=800;
  assert.equal(g.spawnBoss(),false); // No overlapping encounter even if overdue.
  const gifts=g.gems().filter(x=>x.kind==='gift').length;
  g.hit(boss,1e9);
  assert.equal(g.gems().filter(x=>x.kind==='gift').length,gifts+1);
  assert.equal(g.state.nextBoss,890);
  g.hit(boss,1e9);
  assert.equal(g.gems().filter(x=>x.kind==='gift').length,gifts+1);
  assert.equal(g.spawn(),true);
  g.state.t=889;g.state.lvl=99;
  assert.equal(g.spawnBoss(),false);
  g.state.t=890;
  assert.equal(g.spawnBoss(),true);
  assert.equal(g.enemies().find(e=>e.boss).type,'eclipse');
  dom.window.close();
});
test("all seventeen bosses spawn, render, die and drop exactly one Gift Box each", () => {
  const {dom,w,g}=boot();
  for(const key of w.RS_DATABASE.bosses.roster){
    g.reset();g.state.lvl=99;g.state.t=120;
    g.state.bossesDefeated=w.RS_DATABASE.bosses.roster.filter(k=>k!==key);
    assert(g.spawnBoss(),key);
    const boss=g.enemies().find(e=>e.boss);
    assert.equal(boss.type,key);
    assert.equal(boss.max,w.RS_DATABASE.monsters[key].combat.hp);
    assert.doesNotThrow(()=>g.draw(),key);
    g.hit(boss,1e9);
    assert.equal(g.gems().filter(x=>x.kind==='gift').length,1,key);
    assert.equal(g.gems().find(x=>x.kind==='baseExp').amount,w.RS_DATABASE.monsters[key].combat.baseExp);
    assert.equal(g.spawnBoss(),false);
  }
  dom.window.close();
});
test("boss encounter progress survives save and restore without duplication", () => {
  const {dom,g}=boot();
  g.start();g.state.lvl=99;g.state.t=120;g.spawnBoss();
  g.hit(g.enemies().find(e=>e.boss),1e9);
  g.state.t=g.state.nextBoss;g.spawnBoss();
  const boss=g.enemies().find(e=>e.boss);boss.hp=100;
  assert(g.saveRun());g.reset();g.restoreRun();
  assert.deepEqual(Array.from(g.state.bossesDefeated),['toad']);
  assert.equal(g.enemies().find(e=>e.boss).type,'eclipse');
  assert.equal(g.enemies().find(e=>e.boss).hp,100);
  assert.equal(g.spawnBoss(),false);
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
