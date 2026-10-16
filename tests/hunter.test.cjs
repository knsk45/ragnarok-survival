const test=require('node:test'),assert=require('node:assert/strict');
const {boot}=require('./helpers.cjs');
function hunter(){const b=boot();b.g.selectCharacter('hunter_male');b.g.state.debugInfiniteSp=false;return b;}
function disableSkills(g,w){for(const d of w.RS_DATABASE.skills)g.state.skillEnabled[d.id]=false;}
test('start menu unlocks four reviewed branches and prevents changing an active run',()=>{
 const{g,w,dom}=boot();
 assert.equal(w.document.querySelector('[data-class-id="sage"]').disabled,true);
 assert.equal(w.document.querySelectorAll('.class-card:not(:disabled)').length,4);
 w.document.querySelector('[data-class-id="hunter"]').click();
 assert.equal(g.state.characterId,'hunter_male');
 assert.equal(w.document.querySelector('#selectedPath').textContent,'Novice → Archer → Hunter');
 assert.equal(g.selectCharacter('sage_male'),false);
 g.start();assert.equal(g.selectCharacter('knight_male'),false);
 dom.window.close();
});
test('Hunter evolves with exactly 9/49/49 Job points, never by Base level',()=>{
 const{g,w,dom}=hunter();g.start();
 g.awardJobXp(1151);assert.equal(g.state.skillPoints,9);assert(g.state.pause);
 g.pause();assert.equal(g.state.stage,'Novice'); // Unspent points still block evolution.
 g.pause();for(let i=0;i<9;i++)assert(g.learnSkill('basic_skill'));
 g.pause();assert.equal(g.state.stage,'Archer');assert.equal(g.state.lvl,1);
 assert.equal(g.state.arrow_repel,1);assert.equal(g.state.arrow_crafting,1);
 g.awardJobXp(1251530);assert.equal(g.state.job,50);assert.equal(g.state.skillPoints,49);
 for(const[id,levels]of[['owls_eye',10],['vultures_eye',10],['double_strafe',10],['improve_concentration',10],['arrow_shower',9]])
  for(let i=0;i<levels;i++)assert(g.learnSkill(id),id);
 assert.equal(g.state.stage,'Archer');g.pause();assert.equal(g.state.stage,'Hunter');
 assert.equal(g.state.job,1);assert.equal(g.state.phantasmic_arrow,1);
 assert.equal(g.state.arrow_repel,1);assert.equal(g.state.firstAid,1);
 g.awardJobXp(5601400);assert.equal(g.state.skillPoints,49);
 for(let i=0;i<49;i++){const d=w.RS_DATABASE.skills.find(d=>d.jobId==='hunter'&&g.skillAvailable(d.id));assert(d);assert(g.learnSkill(d.id));}
 assert.equal(g.state.skillPoints,0);assert.equal(g.state.job,50);assert.equal(g.state.lvl,1);
 dom.window.close();
});
test('skill ancestry isolates branches and validates Falcon prerequisites',()=>{
 const{g,dom}=hunter();g.state.stage='Hunter';g.state.job=10;g.recalc();
 assert(!g.skillAvailable('bash'));assert(!g.skillAvailable('peco_peco_ride'));
 assert(!g.skillAvailable('falconry_mastery'));g.state.beast_bane=1;
 assert(g.skillAvailable('falconry_mastery'));g.state.falconry_mastery=1;
 assert(g.skillAvailable('blitz_beat'));assert(!g.skillAvailable('steel_crow'));
 g.state.blitz_beat=5;assert(g.skillAvailable('steel_crow'));
 g.reset('knight_male');g.state.stage='Knight';g.state.double_strafe=10;
 assert(!g.skillRuns('double_strafe'));assert(!g.skillAvailable('owls_eye'));
 dom.window.close();
});
test('bow attack scales from DEX and Vulture increases range/HIT',()=>{
 const{g,dom}=hunter();g.state.stage='Archer';g.state.stats.dex=1;g.recalc();const low=g.state.atk;
 g.state.stats.dex=80;g.recalc();assert(g.state.atk>low*3);
 const range=g.state.attackRange,hit=g.state.hit;g.state.vultures_eye=10;g.recalc();
 assert.equal(g.state.attackRange,range+140);assert.equal(g.state.hit,hit+10);
 g.state.owls_eye=10;assert.equal(g.totalStats().dex>=90,true);
 dom.window.close();
});
test('basic arrows travel, splash adjacent enemies and do not tunnel at high speed',()=>{
 const{g,w,dom}=hunter();g.state.stage='Archer';g.state.job=1;g.recalc();
 disableSkills(g,w);g.spawn('poring');g.spawn('poring');
 const[a,b]=g.enemies();for(const e of[a,b]){e.x=150;e.y=0;e.speed=0;e.hp=e.max=10000;}
 w.Math.random=()=>.2;g.attack();assert.equal(g.shots().length,1);assert.equal(a.hp,10000);
 g.start();g.state.attack=100;g.state.spawn=1e9;g.state.nextBoss=1e9;
 for(let i=0;i<3;i++)g.update(.1);
 assert(a.hp<10000);assert(b.hp<10000);assert(b.hp>a.hp);assert.equal(g.shots().length,0);
 dom.window.close();
});
test('Double Strafe spends canonical SP once and launches two separate arrows',()=>{
 const{g,w,dom}=hunter();g.state.stage='Archer';g.recalc();disableSkills(g,w);
 g.state.double_strafe=10;g.state.skillEnabled.double_strafe=true;g.state.sp=100;
 g.spawn('poring');g.enemies()[0].x=180;g.enemies()[0].y=0;
 assert(g.special());assert.equal(g.state.sp,88);assert.equal(g.shots().length,2);
 assert(!g.special());assert.equal(g.state.sp,88);
 dom.window.close();
});
test('Concentration applies level-dependent cost/duration and cannot stack',()=>{
 const{g,w,dom}=hunter();g.state.stage='Archer';g.recalc();disableSkills(g,w);
 g.state.improve_concentration=10;g.state.skillEnabled.improve_concentration=true;
 g.state.sp=100;g.spawn('poring');g.enemies()[0].x=150;g.enemies()[0].y=0;
 assert(g.special());assert.equal(g.state.sp,30);assert.equal(g.state.effects.concentration.expires,240);
 const before=g.totalStats().dex;g.recalc();assert.equal(g.totalStats().dex,before);
 g.state.t=5;assert(!g.special());assert.equal(g.state.sp,30);
 dom.window.close();
});
test('Blitz Beat waits for its cast, ignores DEF and cannot trigger Knight skills',()=>{
 const{g,w,dom}=hunter();g.state.stage='Hunter';g.state.job=50;g.state.falconry_mastery=1;g.state.blitz_beat=5;g.state.steel_crow=10;g.recalc();
 disableSkills(g,w);g.state.skillEnabled.blitz_beat=true;g.state.sp=100;
 g.spawn('poring');const e=g.enemies()[0];e.x=150;e.y=0;e.speed=0;e.hp=e.max=10000;
 w.RS_DATABASE.monsters.poring.stats.def=100000;
 assert(g.special());assert.equal(g.state.sp,78);assert.equal(e.hp,10000);
 g.start();g.state.attack=100;g.state.spawn=1e9;g.update(1.6);
 assert(e.hp<9500);assert(g.state.metrics.damage.blitz_beat>500);
 dom.window.close();
});
test('Ankle Snare roots bosses without disabling their attacks; freeze cannot freeze a boss',()=>{
 const{g,w,dom}=hunter();g.state.stage='Hunter';g.state.job=50;g.recalc();disableSkills(g,w);
 g.state.ankle_snare=5;g.state.skillEnabled.ankle_snare=true;g.state.sp=100;
 g.state.lvl=99;g.spawn('toad',false,true);const e=g.enemies()[0];e.x=55;e.y=0;e.speed=0;
 assert(g.special());g.start();g.state.attack=100;g.state.spawn=1e9;g.update(.5);
 assert.equal(e.rootedUntil,4.5);assert(!e.stunnedUntil);
 g.state.skillEnabled.ankle_snare=false;g.state.freezing_trap=5;g.state.skillEnabled.freezing_trap=true;
 g.state.hunterCastReady=0;g.state.sp=100;
 assert(g.special());g.update(.5);assert(!e.frozen);
 dom.window.close();
});
test('Hunter saves restore the branch; legacy saves without identity restore Knight',()=>{
 const{g,w,dom}=hunter();g.start();g.state.stage='Hunter';g.state.job=20;g.state.double_strafe=5;g.recalc();
 assert(g.saveRun());g.reset('knight_male');g.restoreRun();
 assert.equal(g.state.characterId,'hunter_male');assert.equal(g.state.stage,'Hunter');assert.equal(g.state.double_strafe,5);
 g.reset('knight_male');g.start();assert(g.saveRun());const saved=JSON.parse(w.localStorage.getItem('rs.run.v2'));delete saved.state.characterId;
 w.localStorage.setItem('rs.run.v2',JSON.stringify(saved));g.reset('hunter_male');g.restoreRun();
 assert.equal(g.state.characterId,'knight_male');assert.equal(g.state.stage,'Novice');
 dom.window.close();
});
test('Hunter male sprites use cropped source frames, not the female half',()=>{
 const{g,images,canvas,dom}=hunter();const calls=[];canvas.drawImage=(...args)=>calls.push(args);
 for(const stage of ['Archer','Hunter']){
  const image=images.find(i=>i.src==='assets/irowiki/characters/'+stage.toLowerCase()+'-male.png');
  image.complete=true;image.naturalWidth=118;image.naturalHeight=111;
  g.state.stage=stage;calls.length=0;g.draw();
  const call=calls.find(c=>c[0]===image);assert(call);assert(call[1]<20&&call[3]<40);
 }
 dom.window.close();
});
test('Hunter survives a 20-minute engine simulation without branch leakage or invalid numbers',()=>{
 const{g,w,dom}=hunter();g.start();g.state.debugInfiniteHp=true;g.state.debugInfiniteSp=true;
 let seed=9876;w.Math.random=()=>((seed=(seed*1664525+1013904223)>>>0)/4294967296);
 for(let n=0;n<=w.RS_DATABASE.settings.runDuration*10;n++){
  if(n===200){g.state.stage='Archer';g.state.job=20;g.state.lvl=20;g.recalc();}
  if(n===1000){g.state.stage='Hunter';g.state.job=50;g.state.lvl=90;g.recalc();}
  for(const d of w.RS_DATABASE.skills)if(['novice','archer','hunter'].includes(d.jobId)&&d.implemented)g.state[d.stateKey]=d.maxLevel;
  g.state.skillPoints=0;g.state.pause=false;g.update(.1);
  if(n%100===0){g.draw();for(const k of['hp','sp','atkMin','atkMax','t'])assert(Number.isFinite(g.state[k]),k);}
 }
 assert(g.state.end);assert(!g.state.metrics.casts.bash);assert(!g.state.metrics.casts.bowling_bash);
 dom.window.close();
});
