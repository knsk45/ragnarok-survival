const test=require('node:test'),assert=require('node:assert/strict'),{boot}=require('./helpers.cjs');
function setup(hero,stage){const b=boot();b.g.selectCharacter(hero+'_male');Object.assign(b.g.state,{stage,job:50,lvl:3,debugInfiniteHp:true});b.g.recalc(true);for(const d of b.w.RS_SKILLS)b.g.state.skillEnabled[d.id]=false;return b;}
function enable(b,id,l=1){const d=b.w.RS_SKILLS.find(d=>d.id===id);b.g.state[d.stateKey]=l;b.g.state.skillEnabled[id]=true;return d;}
function enemy(b,x=65,y=0){b.g.spawn('lunatic');const e=b.g.enemies().at(-1);Object.assign(e,{x,y,speed:0,hp:1e7,max:1e7});return e;}
function start(g){g.start();g.state.spawn=g.state.nextBoss=g.state.attack=1e9;}
test('development defaults and optional automation persist through settings and restore',()=>{
 const {g,w,dom}=boot();assert(g.state.debugInfiniteSp);assert(!g.state.autoSkills);assert(w.document.querySelector('#debugInfiniteSp').checked);assert(!w.document.querySelector('#autoSkills').checked);g.start();g.pause();
 const sp=w.document.querySelector('#debugInfiniteSp');sp.click();assert(!g.state.debugInfiniteSp);
 const auto=w.document.querySelector('#autoSkills');assert.equal(auto.closest('[data-pause-panel]').dataset.pausePanel,'settings');auto.click();assert(g.state.autoSkills);g.reset();g.restoreRun();assert(!g.state.debugInfiniteSp);assert(g.state.autoSkills);assert(!sp.checked);assert(auto.checked);dom.window.close();
});
test('every build allocates new Job points in the background and evolves without pausing',()=>{
 const {g,w,dom}=boot();for(const [id,p]of Object.entries(w.RS_PRESETS)){
  g.reset(p.characterId);g.selectPreset(id);g.state.autoSkills=true;g.start();
  for(const amount of [1151,1251530,5601400]){g.awardJobXp(amount);assert.equal(g.state.skillPoints,0,id);assert(!g.state.pause,id);}
  assert.equal(g.state.stage,w.RS_CHARACTERS[p.characterId].jobPath.at(-1).replace(/^./,s=>s.toUpperCase()));
 }g.reset();g.start();g.awardJobXp(1151);assert.equal(g.state.skillPoints,9);assert(g.state.pause);dom.window.close();
});
test('three Wizard spells cast concurrently, retain separate delays, and restore once',()=>{
 const b=setup('wizard','Wizard'),{g,w,dom}=b;for(const id of ['fire_bolt','cold_bolt','lightning_bolt'])enable(b,id,5);const e=enemy(b);start(g);assert(g.special());assert.equal(g.state.pendingClassCasts.length,3);assert(!g.special());
 g.attack();assert.equal(g.shots().length,1,'basic attack also works during casts');g.saveRun();const sp=g.state.sp;g.reset();g.restoreRun();assert.equal(g.state.pendingClassCasts.length,3);assert.equal(g.state.sp,sp);g.pause();g.state.spawn=g.state.nextBoss=g.state.attack=1e9;for(let i=0;i<60;i++)g.update(1/30);for(const id of ['fire_bolt','cold_bolt','lightning_bolt'])assert.equal(g.state.metrics.casts[id],1);assert.equal(g.state.pendingClassCasts.length,0);assert(g.state.metrics.damage.fire_bolt>0);dom.window.close();
});
test('Hunter casts both delayed skills and immediate skills together',()=>{
 const b=setup('hunter','Hunter'),{g,dom}=b;for(const id of ['arrow_repel','blitz_beat','double_strafe','arrow_shower','improve_concentration','falconry_mastery'])enable(b,id);enemy(b,140);assert(g.special());assert.equal(g.state.pendingHunterCasts.length,2);for(const id of ['arrow_repel','blitz_beat','double_strafe','arrow_shower','improve_concentration'])assert.equal(g.state.metrics.casts[id],1,id);g.attack();assert(g.shots().some(p=>p.skillId==='basic'));dom.window.close();
});
test('self buffs work without targets, use canonical durations and recast only after expiry',()=>{
 for(const [hero,stage,id,l,key,duration]of [['knight','Knight','twohand_quicken',10,'quicken',300],['knight','Swordman','endure',10,'endure',37],['knight','Knight','counter_attack',3,'counter',1.2],['hunter','Archer','improve_concentration',10,'concentration',240],['wizard','Wizard','energy_coat',1,'energyCoat',300],['assassin','Assassin','enchant_poison',10,'enchantPoison',165],['assassin','Assassin','poison_react',10,'poisonReact',60]]){
  const b=setup(hero,stage),{g,w,dom}=b;enable(b,id,l);assert(g.special(),id);assert(Math.abs(g.state.effects[key].expires-duration)<1e-9,id);assert(w.RSInsights.statuses(g.state).some(s=>s.includes(' с')));g.state.t=duration-.01;assert(!g.special(),id+' active');g.state.t=Math.max(duration,g.state.cooldowns[id]);assert(g.special(),id+' expires');assert.equal(g.state.metrics.casts[id],2);dom.window.close();
 }
});
test('Energy Coat follows SP bands and stops at zero',()=>{
 const b=setup('wizard','Wizard'),{g,w,dom}=b;const ctx={state:g.state,player:g.player,types:{},useSp:n=>(g.state.sp=Math.max(0,g.state.sp-n),true)};for(const [ratio,damage]of [[1,70],[.8,76],[.6,82],[.4,88],[.2,94]]){g.state.sp=g.state.spMax*ratio;g.state.effects.energyCoat={expires:300};assert.equal(w.RSAdventurers.incoming(ctx,{},100),damage);}
 g.state.sp=0;assert.equal(w.RSAdventurers.incoming(ctx,{},100),100);assert(!g.state.effects.energyCoat);dom.window.close();
});
for(const [hero,stage]of [['knight','Novice'],['knight','Swordman'],['knight','Knight'],['hunter','Archer'],['hunter','Hunter'],['wizard','Mage'],['wizard','Wizard'],['assassin','Thief'],['assassin','Assassin']])test(stage+' basic attacks hit the target and its neighbors only',()=>{
 const b=setup(hero,stage),{g,w,dom}=b;const a=enemy(b),near=enemy(b,65,24),far=enemy(b,65,140);w.Math.random=()=>.2;g.attack();start(g);for(let i=0;i<12;i++)g.update(1/60);assert(a.hp<1e7);assert(near.hp<1e7);assert.equal(far.hp,1e7);dom.window.close();
});

test('Poison React counters only successful rolls and consumes finite charges',()=>{
 const b=setup('assassin','Assassin'),{g,w,dom}=b;enable(b,'poison_react',3);const e=enemy(b);assert(g.special());assert.equal(g.state.effects.poisonReact.charges,2);
 const ctx={state:g.state,player:g.player,types:{lunatic:Array(8).fill(null).concat(w.RS_MONSTERS.lunatic)},hit:g.hit,useSp:()=>true};w.Math.random=()=>.9;w.RSAdventurers.incoming(ctx,e,100);assert.equal(g.state.effects.poisonReact.charges,2);w.Math.random=()=>.1;w.RSAdventurers.incoming(ctx,e,100);assert.equal(g.state.effects.poisonReact.charges,1);w.RSAdventurers.incoming(ctx,e,100);assert(!g.state.effects.poisonReact);assert(g.state.metrics.damage.poison_react>0);dom.window.close();
});
test('Hiding has its Wiki duration and drains SP while active',()=>{
 const b=setup('assassin','Thief'),{g,w,dom}=b;enable(b,'hiding',2);enemy(b);g.state.hp=g.state.max*.5;g.state.debugInfiniteSp=false;g.state.sp=50;assert(g.special());assert.equal(g.state.effects.hiding.expires,60);assert.equal(g.state.sp,40);start(g);g.update(6);assert.equal(g.state.sp,39);assert(g.state.effects.hiding);dom.window.close();
});
