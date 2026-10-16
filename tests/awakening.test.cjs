const test=require('node:test'),assert=require('node:assert/strict'),{boot}=require('./helpers.cjs');
function hero(name='knight',rank=0,stacks={}){const b=boot(),{g,w}=b;g.selectCharacter(name+'_male');Object.assign(g.state,{stage:{knight:'Knight',hunter:'Hunter',wizard:'Wizard',assassin:'Assassin'}[name],lvl:99,job:50,debugInfiniteHp:true});g.state.awakening={...w.RSAwakening.fresh(),active:true,level:rank*5,stacks};for(const d of w.RS_SKILLS)g.state.skillEnabled[d.id]=false;g.recalc(true);g.start();g.state.spawn=g.state.nextBoss=g.state.attack=1e9;return b;}
function mob(b,x=60,y=0,hp=1e7){const {g,w}=b;const level=g.state.lvl;g.state.lvl=w.RS_MONSTERS.lunatic.stats.level;g.spawn('lunatic');g.state.lvl=level;const e=g.enemies().at(-1);Object.assign(e,{x,y,speed:0,hp,max:hp});return e;}
function enable(b,id,l=1){const d=b.w.RS_SKILLS.find(d=>d.id===id);b.g.state[d.stateKey]=l;b.g.state.skillEnabled[id]=true;return d;}
test('only final classes at 99/50 unlock; repeated valid choices multiply and every fifth unlocks class tier',()=>{
 const {g,w,dom}=boot(),A=w.RSAwakening;for(const stage of ['Novice','Swordman','Archer','Mage','Thief']){Object.assign(g.state,{lvl:99,job:50,stage});assert(!A.eligible(g.state));}
 Object.assign(g.state,{lvl:99,job:50,stage:'Knight'});assert(A.sync(g.state));assert(!A.sync(g.state));assert.equal(g.state.awakening.pending,1);
 for(let i=0;i<15;i++){const a=g.state.awakening;if(i)a.pending++;a.offer=['damage','health','area'];assert(!A.choose(g.state,'defense'));assert(A.choose(g.state,'damage'));}
 assert(Math.abs(A.factors(g.state).damage-1.25**15)<1e-8);assert.equal(A.tier(g.state),3);assert.equal(g.state.lvl,99);assert.equal(g.state.job,50);dom.window.close();
});
test('post-cap base and job EXP apply rates once and roll excess into queued levels',()=>{
 const {g,w,dom}=hero(),a=g.state.awakening,A=w.RSAwakening;const need=A.need(g.state);g.xp(need/25,0);assert.equal(a.earned,1);assert.equal(a.pending,1);assert.equal(a.xp,0);assert(g.state.choose&&g.state.pause);const t=g.state.t;g.update(10);assert.equal(g.state.t,t);assert.equal(w.document.querySelectorAll('#cards button').length,3);assert.equal(new Set(a.offer).size,3);g.xp(0,100);assert.equal(a.xp,1500);assert.equal(g.state.lvl,99);assert.equal(g.state.job,50);while(g.state.choose)w.document.querySelector('#cards button').click();assert(!g.state.pause);assert.equal(a.level,1);dom.window.close();
});
test('pending offers, XP, stacks and class tiers survive restore; legacy saves migrate',()=>{
 const {g,w,dom}=hero('wizard',2,{damage:4,area:2});g.xp(5000,0);const before={...g.state.awakening,offer:[...g.state.awakening.offer]};assert(g.saveRun());g.reset();g.restoreRun();assert(g.state.choose);assert.equal(g.state.awakening.level,10);assert.equal(g.state.awakening.stacks.damage,4);assert.deepEqual([...g.state.awakening.offer],before.offer);while(g.state.choose)w.document.querySelector('#cards button').click();g.saveRun();const save=JSON.parse(w.localStorage.getItem('rs.run.v2'));delete save.state.awakening;w.localStorage.setItem('rs.run.v2',JSON.stringify(save));g.reset();g.restoreRun();assert.equal(g.state.awakening.level,0);dom.window.close();
});
test('HP increases restore the gain, recalculation is idempotent and attack/cooldown have safe overflow',()=>{
 const {g,w,dom}=hero(),A=w.RSAwakening,base=g.state.max;g.state.hp=base/2;g.state.awakening.stacks={health:4,attack:1000,cooldown:1000,area:1000};g.recalc();const max=g.state.max,hp=g.state.hp;assert.equal(max,Math.round(base*1.2**4));assert.equal(hp,base/2+max-base);g.recalc();assert.equal(g.state.hp,hp);assert.equal(g.state.max,max);assert.equal(g.state.rate,.06);assert(g.state.basicOverflow>1);assert.equal(A.delay(g.state,1),.08);assert.equal(A.area(g.state),5);assert(A.areaOverflow(g.state)>1);dom.window.close();
});
test('Knight waves reach enemies beyond basic splash and Bowling Bash deaths chain with bounded reactions',()=>{
 const b=hero('knight',2),{g,w,dom}=b;mob(b);const farther=mob(b,170,10);w.Math.random=()=>.2;g.attack();assert(g.state.metrics.damage.awakening_wave>0);assert(farther.hp<farther.max);const victim=mob(b,170,20,1);g.hit(victim,100,false,'bowling_bash');assert(g.state.awakening.reactions.length);g.update(.1);assert(g.state.metrics.damage.awakening_blast>0);assert(g.state.awakening.reactions.length<=128);dom.window.close();
});
test('Hunter fires a fan, central arrow pierces, and falcon covers a wider group',()=>{
 const b=hero('hunter',1,{fury:2}),{g,w,dom}=b;const a=mob(b,100),other=mob(b,220);w.Math.random=()=>.2;g.attack();assert.equal(g.shots().length,5);assert(g.shots().every(p=>p.pierce===4));g.update(.4);assert(a.hp<a.max);assert(other.hp<other.max);
 enable(b,'blitz_beat',5);enable(b,'falconry_mastery');const nearby=mob(b,165,30);assert(g.special());g.update(1.6);assert(g.state.metrics.damage.blitz_beat>0);assert(nearby.hp<nearby.max);dom.window.close();
});
test('Wizard echoes damage without a second SP charge and spells spread on kills',()=>{
 const b=hero('wizard',1),{g,w,dom}=b;enable(b,'fire_bolt',1);g.state.debugInfiniteSp=false;g.state.sp=100;const a=mob(b,100);assert(g.special());assert.equal(g.state.pendingClassCasts.length,2);assert.equal(g.state.sp,88);assert.equal(g.state.metrics.casts.fire_bolt,1);g.update(1);assert(a.hp<a.max);assert.equal(g.state.pendingClassCasts.length,0);const victim=mob(b,100,10,1);g.hit(victim,100,false,'fire_bolt',{magical:true,element:'fire'});g.update(.1);assert(g.state.metrics.damage.awakening_blast>0);dom.window.close();
});
test('Assassin crits cause poison explosions and execute nearby weakened enemies',()=>{
 const b=hero('assassin',2),{g,w,dom}=b;const main=mob(b),near=mob(b,65,25);w.Math.random=()=>0;g.attack();assert(g.state.metrics.damage.awakening_poison>0);assert(near.poison);assert(main.hp<main.max);dom.window.close();
});
test('late waves add quantity, retain finite caps and never inflate monster HP',()=>{
 const {g,w,dom}=hero(),A=w.RSAwakening;const caps=[0,420,780,1020].map(t=>(g.state.t=t,A.wave(g.state)));assert.deepEqual(caps.map(c=>c.cap),[60,90,140,200]);assert.deepEqual(caps.map(c=>c.batch),[1,2,4,7]);const level=g.state.lvl;g.state.lvl=3;g.spawn('lunatic');const e=g.enemies()[0];assert.equal(e.max,w.RS_MONSTERS.lunatic.combat.hp);g.state.lvl=level;dom.window.close();
});
test('EXP compaction preserves totals and every Gift Box',()=>{
 const {w,dom}=boot(),gems=[];for(let i=0;i<1000;i++)gems.push({kind:i%2?'baseExp':'jobExp',x:10,y:10,amount:i+1,life:10});const gift={kind:'gift',x:1,y:2};gems.push(gift);const out=w.RSAwakening.compact(gems);assert.equal(out.length,3);assert(out.includes(gift));assert.equal(out.filter(g=>g.amount).reduce((s,g)=>s+g.amount,0),500500);dom.window.close();
});
for(const name of ['knight','hunter','wizard','assassin'])test(name+' extreme awakening stays finite under mass combat without debug HP',()=>{
 const b=hero(name,20,{damage:25,health:15,defense:20,attack:60,cooldown:60,area:30,fury:40}),{g,w,dom}=b;g.state.debugInfiniteHp=false;g.state.t=1020;g.state.spawn=.01;g.state.attack=0;for(const d of w.RS_SKILLS)if(g.skillAvailable(d.id)&&d.implemented)g.state[d.stateKey]=Math.min(5,d.maxLevel);let seed=173;w.Math.random=()=>((seed=(seed*1664525+1013904223)>>>0)/4294967296);
 for(let n=0;n<300;n++){while(g.state.choose)w.document.querySelector('#cards button').click();g.update(1/30);if(n%30===0)g.draw();assert(g.enemies().length<=200);assert(g.shots().length<=350);assert(g.state.awakening.reactions.length<=128);for(const k of ['hp','max','atk','matk','rate'])assert(Number.isFinite(g.state[k]),name+' '+k);}assert(!g.state.end);assert(g.state.hp>0);dom.window.close();
});

test('zero-delay skills keep normal damage outside awakening',()=>{
 const {g,w,dom}=boot();g.spawn('lunatic');const e=g.enemies()[0];e.hp=e.max=1e6;g.hit(e,100,false,'basic');const baseline=1e6-e.hp;e.hp=1e6;g.hit(e,100,false,'double_strafe');assert.equal(1e6-e.hp,baseline);dom.window.close();
});
test('area stacks extend basic splash and defensive stacks reduce real incoming damage',()=>{
 const damages=[];for(const boosted of [false,true]){const b=hero('knight',0,boosted?{area:5,defense:10}:{}),{g,w,dom}=b;const main=mob(b),side=mob(b,140);w.Math.random=()=>.5;g.attack();assert.equal(side.hp<side.max,boosted);const e=mob(b,0,0);Object.assign(e,{atkMin:10000,atkMax:10000});Object.assign(g.state,{hp:1e6,max:1e6,flee:0,debugInfiniteHp:false});g.update(.01);damages.push(g.state.metrics.taken);dom.window.close();}assert(damages[0]>0);assert(damages[1]<damages[0]*.3);
});
