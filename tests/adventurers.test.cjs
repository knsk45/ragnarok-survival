const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {boot}=require('./helpers.cjs');
function setup(id,stage){const b=boot(),{g,w}=b;assert(g.selectCharacter(id+'_male'));g.state.stage=stage;g.state.lvl=90;g.state.job=50;g.recalc(true);for(const d of w.RS_DATABASE.skills)g.state.skillEnabled[d.id]=false;return b;}
function enable(b,id,l){const {g,w}=b,d=w.RS_DATABASE.skills.find(d=>d.id===id);g.state[d.stateKey]=l;g.state.skillEnabled[id]=true;return d;}
function enemy(b,key='poring',x=100,boss=false){const {g,w}=b,level=g.state.lvl;g.state.lvl=w.RS_DATABASE.monsters[key].stats.level;assert(g.spawn(key,false,boss));g.state.lvl=level;const e=g.enemies().at(-1);assert.equal(e.type,key);e.x=x;e.y=0;e.speed=0;e.hp=e.max=1e7;return e;}
function run(g){g.start();g.state.spawn=1e9;g.state.nextBoss=1e9;g.state.attack=1e9;g.state.debugInfiniteHp=true;}
test('both new branches are selectable, weapon choice is accessible and locked after start',()=>{
 const {g,w,dom}=boot();assert.equal(w.document.querySelectorAll('.class-card:not(:disabled)').length,4);
 w.document.querySelector('[data-class-id="wizard"]').click();assert.equal(g.state.characterId,'wizard_male');assert.equal(w.document.querySelector('#selectedPath').textContent,'Novice → Mage → Wizard');
 w.document.querySelector('[data-class-id="assassin"]').click();assert(!w.document.querySelector('#weaponStyle').hidden);assert(g.selectWeaponStyle('dual'));assert.equal(g.state.weaponStyle,'dual');
 g.start();assert(!g.selectWeaponStyle('katar'));assert(!g.selectCharacter('wizard_male'));dom.window.close();
});
for(const [id,first,last]of [['wizard','Mage','Wizard'],['assassin','Thief','Assassin']])test(id+' evolves by 9/49/49 skill points, ancestry never leaks',()=>{
 const {g,w,dom}=boot();g.selectCharacter(id+'_male');g.start();g.awardJobXp(1151);assert.equal(g.state.skillPoints,9);
 for(let i=0;i<9;i++)assert(g.learnSkill('basic_skill'));g.pause();assert.equal(g.state.stage,first);
 for(const [stage,amount]of [[first,1251530],[last,5601400]]){
  g.awardJobXp(amount);assert.equal(g.state.skillPoints,49);assert.equal(g.state.stage,stage);
  for(let i=0;i<49;i++){const d=w.RS_DATABASE.skills.find(d=>d.jobId===stage.toLowerCase()&&g.skillAvailable(d.id))||w.RS_DATABASE.skills.find(d=>g.skillAvailable(d.id));assert(d,'available point '+i);assert(g.learnSkill(d.id));}
  if(stage===first){g.pause();assert.equal(g.state.stage,last);}
 }
 assert.equal(g.state.lvl,1);for(const id of ['bash','double_strafe','blitz_beat'])assert(!g.skillAvailable(id));
 assert(!g.skillAvailable(id==='wizard'?'sonic_blow':'fire_bolt'));dom.window.close();
});
test('MATK scales with INT, ignores physical DEF/HIT and is reduced by MDEF',()=>{
 const b=setup('wizard','Wizard'),{g,w,dom}=b;g.state.stats.int=10;g.recalc();const low=g.state.matk;g.state.stats.int=90;g.recalc();assert(g.state.matk>low);
 const e=enemy(b);g.state.hit=0;const m=w.RS_DATABASE.monsters.poring; m.stats.def=1e6;m.stats.mdef=0;
 g.hit(e,1000,false,'magic',{magical:true});const noMdef=1e7-e.hp;e.hp=1e7;m.stats.mdef=200;g.hit(e,1000,false,'magic',{magical:true});assert(1e7-e.hp<noMdef);
 g.state.hit=0;g.attack();assert(g.shots()[0].classMagic);run(g);g.update(.2);assert(e.hp<1e7);dom.window.close();
});
test('bolts spend displayed SP once, wait for cast and survive losing target',()=>{
 const b=setup('wizard','Mage'),{g,w,dom}=b;const d=enable(b,'fire_bolt',10);g.state.sp=100;const e=enemy(b);
 assert(g.special());assert.equal(g.state.sp,100-d.spCosts[9]);assert.equal(e.hp,1e7);assert(g.state.pendingClassCast);assert(!g.special());
 run(g);g.update(g.state.pendingClassCast.finishesAt+.01);assert(e.hp<1e7);assert(g.state.metrics.damage.fire_bolt>0);
 assert(w.RSAdventurers.castTime(d,10,90)<w.RSAdventurers.castTime(d,10,1));
 dom.window.close();
});
test('wrong elements do not spend SP and insufficient SP does not cast',()=>{
 const b=setup('wizard','Mage'),{g,w,dom}=b;enable(b,'cold_bolt',10);const e=enemy(b,'poring');w.RS_DATABASE.monsters.poring.classification.elementLevel=4;g.state.sp=100;
 assert(!g.special());assert.equal(g.state.sp,100);w.RS_DATABASE.monsters.poring.classification.element='fire';g.state.sp=0;assert(!g.special());assert(!g.state.pendingClassCast);dom.window.close();
});
test('Storm Gust persists as an area, affects multiple targets, never freezes bosses',()=>{
 const b=setup('wizard','Wizard'),{g,dom}=b;enable(b,'storm_gust',10);g.state.sp=200;const a=enemy(b),c=enemy(b,'poring',120),boss=enemy(b,'toad',110,true);
 assert(g.special());run(g);g.update(g.state.pendingClassCast.finishesAt+.01);assert(g.state.classFields.some(f=>f.id==='storm_gust'));
 for(let i=0;i<7;i++)g.update(.5);assert(a.hp<1e7&&c.hp<1e7&&boss.hp<1e7);assert(!boss.frozen);assert(!boss.stunnedUntil);assert(g.state.metrics.damage.storm_gust>0);dom.window.close();
});
test('Safety Wall has finite charges and only protects its location; Energy Coat consumes SP',()=>{
 const b=setup('wizard','Wizard'),{g,w,dom}=b;enable(b,'safety_wall',3);g.state.sp=200;const e=enemy(b,'poring',15);assert(g.special());
 const ctx={state:g.state,player:g.player,types:{},useSp:n=>{g.state.sp-=n;return true;}};
 for(let i=0;i<5;i++)assert.equal(w.RSAdventurers.incoming(ctx,e,100),0);assert.equal(w.RSAdventurers.incoming(ctx,e,100),100);
 g.state.effects.safetyWall.charges=2;g.player.x=100;assert.equal(w.RSAdventurers.incoming(ctx,e,100),100);
 g.state.effects.energyCoat={expires:100};const sp=g.state.sp;assert.equal(w.RSAdventurers.incoming(ctx,e,100),70);assert(g.state.sp<sp);dom.window.close();
});
test('dagger Double Attack and dual mastery differ from katars; crit bypasses flee',()=>{
 const b=setup('assassin','Thief'),{g,w,dom}=b;const e=enemy(b,'poring',70);g.state.double_attack=10;g.state.hit=1e6;g.state.crit=0;w.Math.random=()=>.1;g.attack();assert(g.state.metrics.damage.double_attack>0);
 g.state.stage='Assassin';g.state.weaponStyle='dual';g.recalc();g.state.crit=0;g.state.double_attack=0;g.state.hit=1e6;e.hp=1e7;g.attack();const weak=1e7-e.hp;
 g.state.righthand_mastery=5;g.state.lefthand_mastery=5;e.hp=1e7;g.attack();assert(1e7-e.hp>weak);
 g.state.weaponStyle='katar';g.recalc();const katarCrit=g.state.crit;g.state.weaponStyle='dual';g.recalc();assert(katarCrit>g.state.crit);
 g.state.weaponStyle='katar';g.state.crit=1;g.state.hit=0;e.hp=1e7;g.attack();assert(e.hp<1e7);dom.window.close();
});
test('Sonic Blow and Grimtooth require katars, and Grimtooth requires hiding',()=>{
 const b=setup('assassin','Assassin'),{g,dom}=b;enable(b,'sonic_blow',10);g.state.sp=200;const e=enemy(b,'poring',70);g.state.weaponStyle='dual';assert(!g.special());assert.equal(g.state.sp,200);
 g.state.weaponStyle='katar';assert(g.special());assert(e.hp<1e7);g.state.skillEnabled.sonic_blow=false;enable(b,'grimtooth',5);g.state.t=2;assert(!g.special());
 g.state.effects.hiding={expires:5};assert(g.special());assert(g.state.metrics.damage.grimtooth>0);assert(g.state.effects.hiding);dom.window.close();
});
test('stealth hides from normal monsters but not bosses, insects or demons; attacks reveal',()=>{
 const b=setup('assassin','Assassin'),{g,w,dom}=b;const e=enemy(b),insect=enemy(b,'fabre'),boss=enemy(b,'toad',100,true);g.state.effects.cloaking={expires:5};
 const ctx={state:g.state,types:Object.fromEntries(Object.entries(w.RS_DATABASE.monsters).map(([k,m])=>[k,[null,null,null,null,null,null,null,null,m]]))};
 assert(!w.RSAdventurers.seesPlayer(ctx,e));assert(w.RSAdventurers.seesPlayer(ctx,insect));assert(w.RSAdventurers.seesPlayer(ctx,boss));
 enable(b,'envenom',5);e.x=70;g.state.sp=100;assert(g.special());assert(!g.state.effects.cloaking);dom.window.close();
});
test('poison ticks without multiplying rewards; bosses are poison immune',()=>{
 const b=setup('assassin','Assassin'),{g,w,dom}=b;enable(b,'venom_dust',10);g.state.sp=200;const e=enemy(b,'lunatic'),boss=enemy(b,'toad',100,true);
 assert(g.special());run(g);g.update(.1);assert(e.poison);assert(!boss.poison);const hp=e.hp;g.update(1);assert(e.hp<hp);assert(g.state.metrics.damage.poison_tick>0);dom.window.close();
});
test('pending casts, ground effects, weapon style and poison bombs restore without another SP charge',()=>{
 const b=setup('wizard','Wizard'),{g,dom}=b;enable(b,'meteor_storm',10);g.state.sp=200;enemy(b);g.start();assert(g.special());const cost=g.state.sp;assert(g.saveRun());g.reset('knight_male');g.restoreRun();
 assert.equal(g.state.characterId,'wizard_male');assert(g.state.pendingClassCast);assert.equal(g.state.sp,cost);g.state.pause=false;g.state.spawn=1e9;g.state.attack=1e9;g.update(g.state.pendingClassCast.finishesAt+.01);assert(g.state.classFields.length);
 assert(g.saveRun());g.reset();g.restoreRun();assert(g.state.classFields.length);g.reset('assassin_male');assert(g.selectWeaponStyle('dual'));g.state.stage='Assassin';g.recalc();g.start();g.state.venomBombs=[{targetId:999,x:0,y:0,at:3,damage:100,l:1}];assert(g.saveRun());g.reset();g.restoreRun();assert.equal(g.state.weaponStyle,'dual');assert.equal(g.state.venomBombs.length,1);dom.window.close();
});
test('new source PNG hashes and male source frames match the real render path',()=>{
 const snapshot=require('../data/casters-rogues-sources.json'),root=path.resolve(__dirname,'..');
 for(const f of snapshot.files){const bytes=fs.readFileSync(path.join(root,f.path));assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),f.sha256);assert.equal(bytes.readUInt32BE(16),f.width);assert.equal(bytes.readUInt32BE(20),f.height);}
 for(const [id,stages]of [['wizard',['Mage','Wizard']],['assassin',['Thief','Assassin']]]){
  const {g,w,images,canvas,dom}=setup(id,stages[0]),calls=[];canvas.drawImage=(...a)=>calls.push(a);
  for(const stage of stages){const j=stage.toLowerCase(),v=w.RS_DATABASE.characters[id+'_male'].visuals[j],image=images.find(i=>i.src===v.spriteUrl);image.complete=true;image.naturalWidth=118;image.naturalHeight=111;g.state.stage=stage;calls.length=0;g.draw();const call=calls.find(a=>a[0]===image);assert(call);assert.equal(call[1],v.sourceRect.x);assert.equal(call[3],v.sourceRect.width);assert(call[1]+call[3]<=59,'male half only');}
  dom.window.close();
 }
});
test('every level shows the same SP cost as execution and source-dependent poison skills stay locked',()=>{
 const {w,g,dom}=setup('assassin','Assassin');
 for(const d of w.RS_ADVENTURER_SKILLS)for(let l=1;l<=d.maxLevel;l++)assert.equal(w.RSAdventurers.cost(d,l),d.spCosts?.[l-1]??d.spCost,d.id+' '+l);
 assert(!g.skillAvailable('poison_react'));assert(!g.skillAvailable('venom_dust'));g.state.envenom=10;assert(!g.skillAvailable('poison_react'));g.state.enchant_poison=3;assert(g.skillAvailable('poison_react'));assert(!g.skillAvailable('venom_dust'));g.state.enchant_poison=5;assert(g.skillAvailable('venom_dust'));dom.window.close();
});
test('a lost cast target is safe, ground spells finish at their saved position and freeze expires',()=>{
 const b=setup('wizard','Wizard'),{g,w,dom}=b;enable(b,'meteor_storm',10);g.state.sp=200;const e=enemy(b);assert(g.special());g.hit(e,1e9);run(g);g.update(g.state.pendingClassCast.finishesAt+.01);assert(g.state.classFields.length);
 const fresh=enemy(b);fresh.frozen=true;fresh.stunnedUntil=g.state.t+.1;g.update(.2);assert(!fresh.frozen);dom.window.close();
});
test('Sight Blaster triggers once against an approaching enemy',()=>{
 const b=setup('wizard','Wizard'),{g,dom}=b;enable(b,'sight_blaster',1);g.state.sp=100;const e=enemy(b,'poring',50);assert(g.special());assert(g.state.effects.sightBlaster);run(g);g.update(.1);assert(g.state.metrics.damage.sight_blaster>0);assert(!g.state.effects.sightBlaster);dom.window.close();
});
for(const [id,first,last]of [['wizard','Mage','Wizard'],['assassin','Thief','Assassin']])test(id+' 30-minute deterministic engine simulation stays finite and branch-isolated',()=>{
 const {g,w,dom}=setup(id,first);g.start();g.state.debugInfiniteHp=true;g.state.debugInfiniteSp=true;
 let seed=1253;w.Math.random=()=>((seed=(seed*1664525+1013904223)>>>0)/4294967296);
 for(let n=0;n<18001;n++){
  if(n===300){g.state.stage=last;g.recalc();}
  for(const d of w.RS_DATABASE.skills)if(['novice',first.toLowerCase(),last.toLowerCase()].includes(d.jobId)&&d.implemented)g.state[d.stateKey]=d.maxLevel;
  g.state.skillPoints=0;g.state.pause=false;g.update(.1);
  if(n%100===0){g.draw();for(const key of ['hp','sp','matk','atk','t'])assert(Number.isFinite(g.state[key]),key);assert(g.state.classFields.length<=18);assert(g.state.classVisuals.length<=60);}
 }
 assert(g.state.end);assert(!g.state.metrics.casts.bash);assert(!g.state.metrics.casts.double_strafe);assert(!g.state.metrics.casts[id==='wizard'?'sonic_blow':'fire_bolt']);dom.window.close();
});
