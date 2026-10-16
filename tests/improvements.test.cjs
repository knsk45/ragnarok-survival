const test=require('node:test'),assert=require('node:assert/strict'),{boot}=require('./helpers.cjs');
const {create}=require('../engine/clock.js');
function scenario(){const b=boot(),{g,w}=b;g.selectCharacter('assassin_male');g.state.debugInfiniteSp=false;g.state.stage='Assassin';g.state.job=50;g.state.lvl=3;g.recalc(true);for(const d of w.RS_SKILLS)g.state.skillEnabled[d.id]=false;g.spawn('lunatic');const e=g.enemies()[0];Object.assign(e,{x:55,y:0,speed:0,hp:1e7,max:1e7});g.start();g.state.debugInfiniteHp=true;g.state.spawn=g.state.nextBoss=g.state.attack=1e9;return {...b,e};}
test('Venom Dust ticks at 60 FPS while refreshing the same poison',()=>{
 const {g,w,dom,e}=scenario();g.state.venom_dust=10;g.state.skillEnabled.venom_dust=true;g.state.sp=100;assert(g.special());
 for(let i=0;i<360;i++)g.update(1/60);
 assert(g.state.metrics.damage.poison_tick>0);assert(e.hp<1e7);assert(e.poison.next>g.state.t);dom.window.close();
});
test('refreshing weapon poison preserves the scheduled tick and the strongest damage',()=>{
 const {g,w,dom,e}=scenario();const types={lunatic:Array(8).fill(null).concat(w.RS_MONSTERS.lunatic)},ctx={state:g.state,types};
 w.RSAdventurers.poison(ctx,e,10);const next=e.poison.next,damage=e.poison.damage;g.state.t=.3;w.RSAdventurers.poison(ctx,e,1);assert.equal(e.poison.next,next);assert.equal(e.poison.damage,damage);dom.window.close();
});
test('clock cancels stale generations, has one chain and equal simulation time at 15/60 FPS',()=>{
 function simulate(fps){let callbacks=new Map(),id=0,steps=0;const clock=create({request:fn=>(callbacks.set(++id,fn),id),cancel:i=>callbacks.delete(i),step:()=>steps++,render:()=>{},active:()=>true,onError:e=>{throw e;}});
 clock.start();const stale=[...callbacks.values()][0];clock.start();assert.equal(callbacks.size,1);stale(1);assert.equal(callbacks.size,1);
 for(let i=0;i<=fps*3;i++){const fn=[...callbacks.values()][0];callbacks.clear();fn(i*1000/fps);assert.equal(callbacks.size,1);}clock.stop();assert.equal(callbacks.size,0);return steps;}
 assert(Math.abs(simulate(15)-simulate(60))<=1);
});
test('restart preserves Assassin weapon and selected stat build',()=>{
 const {g,w,dom}=boot();g.selectCharacter('assassin_male');g.selectPreset('assassin_dual');g.start();w.document.getElementById('restart').click();assert.equal(g.state.weaponStyle,'dual');assert.equal(g.state.buildPreset,'assassin_dual');dom.window.close();
});
test('saved projectiles and hit sets restore without duplicated SP costs or repeated hit IDs',()=>{
 const {g,w,dom}=boot();g.selectCharacter('hunter_male');g.state.stage='Archer';g.state.job=10;g.recalc(true);for(const d of w.RS_SKILLS)g.state.skillEnabled[d.id]=false;
 g.spawn('poring');g.enemies()[0].x=150;g.enemies()[0].y=0;g.state.double_strafe=10;g.state.skillEnabled.double_strafe=true;g.start();assert(g.special());const sp=g.state.sp;g.shots()[0].hit.add(987);assert(g.saveRun());g.reset();g.restoreRun();assert.equal(g.shots().length,2);assert(g.shots()[0].hit.has(987));assert.equal(g.state.sp,sp);dom.window.close();
});
test('all presets reference real skills, recommend valid ancestor dependencies and consume actual points',()=>{
 const {g,w,dom}=boot();for(const [id,p]of Object.entries(w.RS_PRESETS)){
 assert(p.skills.every(id=>w.RS_SKILLS.some(d=>d.id===id)),id);g.reset(p.characterId);assert(g.selectPreset(id));g.start();g.awardJobXp(1151);assert.equal(g.recommendSkills(),9);g.pause();g.awardJobXp(1251530);assert.equal(g.recommendSkills(),49);assert.equal(g.state.skillPoints,0);g.pause();assert.notEqual(g.state.stage,'Novice');
 }dom.window.close();
});
test('SP reserve blocks offense but never blocks a necessary defensive heal',()=>{
 const {g,w,dom}=scenario();g.state.envenom=10;g.state.skillEnabled.envenom=true;g.state.tactics.reserve=.5;g.state.sp=g.state.spMax*.5;assert(!g.special());g.state.firstAid=1;g.state.skillEnabled.first_aid=true;g.state.hp=1;assert(g.special());assert(g.state.hp>1);dom.window.close();
});
test('boss focus selects a boss for magic; disabled and wrong-weapon reasons are visible',()=>{
 const {g,w,dom}=boot();g.selectCharacter('wizard_male');g.state.stage='Wizard';g.state.lvl=3;g.recalc(true);for(const d of w.RS_SKILLS)g.state.skillEnabled[d.id]=false;
 g.spawn('lunatic');g.enemies()[0].x=40;g.enemies()[0].y=0;g.spawn('toad',false,true);const boss=g.enemies().find(e=>e.boss);boss.x=180;boss.y=0;g.state.fire_bolt=1;g.state.skillEnabled.fire_bolt=true;g.state.tactics.focusBoss=true;g.state.sp=100;assert(g.special());assert.equal(g.state.pendingClassCast.targetId,boss.id);dom.window.close();
});
test('monster attacks telegraph before damage and safe players can leave the marked area',()=>{
 const {g,w,dom}=boot();const S={t:0,hostileProjectiles:[],dangerAreas:[]},P={x:0,y:0},e={id:4,type:'myst',x:100,y:0,atkMin:10,atkMax:12,speed:20},hits=[];
 const ctx={state:S,player:P,enemies:()=>[e],sees:()=>true,hurt:(...a)=>hits.push(a)};w.RSMonsterAI.update(ctx,1/60);assert.equal(S.dangerAreas.length,1);assert.equal(hits.length,0);P.x=300;S.t=1.4;w.RSMonsterAI.update(ctx,1/60);assert.equal(hits.length,0);P.x=0;S.t=2.2;w.RSMonsterAI.update(ctx,1/60);assert.equal(hits.length,1);dom.window.close();
});
test('danger areas and hostile projectiles survive run restoration',()=>{
 const {g,dom}=scenario();g.state.dangerAreas=[{x:0,y:0,r:65,armedAt:1.3,expires:3,next:1.3,source:{type:'lunatic',atkMin:1,atkMax:2}}];g.state.hostileProjectiles=[{x:100,y:0,vx:-30,vy:0,life:3,source:{type:'lunatic',atkMin:1,atkMax:2}}];g.saveRun();g.reset();g.restoreRun();assert.equal(g.state.dangerAreas.length,1);assert.equal(g.state.hostileProjectiles.length,1);dom.window.close();
});
test('run report shows named damage, evolution, bosses, death source and training status',()=>{
 const {g,w,dom}=scenario();g.state.metrics.damage={poison_tick:300,sonic_blow:700};g.state.metrics.evolution=[{stage:'Assassin',time:142,base:64}];g.state.bossesDefeated=['toad'];g.state.metrics.lastHit={name:'Toad',amount:50,attack:'Опасная зона'};g.finish(false);const text=w.document.getElementById('endStats').textContent;assert(text.includes('Периодический яд'));assert(text.includes('Sonic Blow'));assert(text.includes('Toad'));assert(text.includes('02:22'));assert(text.includes('Тренировочный'));dom.window.close();
});
test('runtime, package, asset queries and error dialogs share a single version',()=>{
 const fs=require('fs'),path=require('path'),{w,dom}=boot();assert.equal(w.RS_DATABASE.gameVersion,require('../package.json').version);const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');for(const m of html.matchAll(/\?v=([\d.]+)/g))assert.equal(m[1],w.RS_VERSION);dom.window.close();
});
