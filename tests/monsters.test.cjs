const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {boot}=require('./helpers.cjs');
const imported=require('../data/monster-expansion.json');
const core=require('../engine/core.js');
const root=path.resolve(__dirname,'..');
test('monster batch is an additive subset of the exact 269-result user filter',()=>{
 const {dom,w}=boot(),db=w.RS_DATABASE,regular=Object.values(db.monsters).filter(m=>!m.isBoss);
 assert.equal(imported.totalMatches,269);assert.equal(imported.files.length,35);assert.equal(regular.length,48);
 assert.equal(new Set(Object.values(db.monsters).map(m=>m.id)).size,65);
 for(const f of imported.files){
  const candidate=imported.candidates.find(m=>m.id===f.id),m=db.monsters[f.key];
  assert(candidate?.selected);assert.equal(candidate.level,m.stats.level);assert.equal(candidate.hp,m.combat.hp);
  assert(!m.isBoss);assert(m.stats.level>=1&&m.stats.level<=95);assert(m.combat.hp>=45&&m.combat.hp<=10000);
  for(const k of ['hp','atkMin','atkMax','range','aspd','moveMs','baseExp','jobExp'])assert.equal(m.combat[k],f.stats[k],f.key+' '+k);
  for(const k of ['level','def','mdef','agi','vit','int','dex','luk','hit','flee'])assert.equal(m.stats[k],f.stats[k],f.key+' '+k);
  assert(m.sourceRefs.every(ref=>db.sourceRegistry.records[ref]),f.key+' source');
 }
 assert.equal(db.monsters.creamy.combat.hp,378);assert.equal(db.monsters.creamy.balance.damageMultiplier,.52);
 assert.equal(db.settings.experienceRates.base,25);assert.equal(db.settings.experienceRates.job,15);
 dom.window.close();
});
test('actual spawn pool respects both level boundaries and adds late-game variety',()=>{
 const {dom,w,g}=boot(),db=w.RS_DATABASE;
 for(const f of imported.files){
  g.state.lvl=f.stats.level-1;assert(!g.availableMonsterKeys().includes(f.key));
  g.state.lvl=f.stats.level;assert(g.availableMonsterKeys().includes(f.key));
  g.state.lvl=f.stats.level+15;assert(g.availableMonsterKeys().includes(f.key));
  g.state.lvl=f.stats.level+16;assert(!g.availableMonsterKeys().includes(f.key));
 }
 for(let lvl=1;lvl<=99;lvl++){
  g.state.lvl=lvl;const pool=g.availableMonsterKeys();assert(pool.length>0,'Base '+lvl);
  for(const key of pool){const m=db.monsters[key];assert(!m.isBoss);assert(lvl>=m.stats.level&&lvl<=m.stats.level+15);}
  if(lvl>=15)assert(pool.length>=6,'thin pool at '+lvl);
 }
 for(const [lvl,count] of [[40,9],[60,7],[99,6]]){g.state.lvl=lvl;assert.equal(g.availableMonsterKeys().length,count);}
 dom.window.close();
});
test('every source PNG reaches the real sprite-render branch with its own aspect ratio',()=>{
 const {dom,w,g,images,canvas}=boot(),calls=[];
 canvas.drawImage=(...args)=>calls.push(args);
 for(const m of Object.values(w.RS_DATABASE.monsters)){
  const image=images.find(i=>i.src===m.visual.spriteUrl),bytes=fs.readFileSync(path.join(root,m.visual.spriteUrl));
  assert(image,'loaded sprite '+m.key);image.complete=true;image.naturalWidth=bytes.readUInt32BE(16);image.naturalHeight=bytes.readUInt32BE(20);
  g.reset();g.state.lvl=m.stats.level;assert(g.spawn(m.key,false,!!m.isBoss));
  const e=g.enemies()[0];e.x=60;e.y=0;calls.length=0;g.draw();
  const call=calls.find(a=>a[0]===image);assert(call,'sprite drawn '+m.key);assert.equal(call.length,5);
  assert(Math.abs(call[3]/call[4]-image.naturalWidth/image.naturalHeight)<1e-9,m.key+' aspect ratio');
 }
 dom.window.close();
});
test('each imported monster keeps source HP and separate source EXP drops',()=>{
 const {dom,w,g}=boot();
 for(const f of imported.files){
  g.reset();g.state.lvl=f.stats.level;assert(g.spawn(f.key));const e=g.enemies()[0];
  assert.equal(e.max,f.stats.hp);g.hit(e,1e9);g.hit(e,1e9);
  assert.equal(g.state.kills,1);const gems=g.gems();
  for(const [kind,amount] of [['baseExp',f.stats.baseExp],['jobExp',f.stats.jobExp]]){
   const drops=gems.filter(d=>d.kind===kind);assert.equal(drops.length,1);assert.equal(drops[0].amount,amount);assert.equal(drops[0].monsterId,f.id);
  }
 }
 dom.window.close();
});
test('regular cap and boss limit still hold with the expanded roster',()=>{
 const {dom,w,g}=boot();g.state.lvl=95;
 for(let i=0;i<70;i++)g.spawn();assert.equal(g.enemies().length,w.RS_DATABASE.settings.maxEnemies);
 assert(g.spawn('dark_illusion',false,true));assert.equal(g.enemies().filter(e=>!e.boss).length,3);
 assert(!g.spawn());assert.equal(g.enemies().filter(e=>e.boss).length,1);
 dom.window.close();
});
test('validation rejects duplicate IDs and non-finite combat data before launch',()=>{
 const {dom,w}=boot(),db=w.RS_DATABASE,m=db.monsters.drops;
 const id=m.id;m.id=db.monsters.poring.id;assert.throws(()=>core.validate(db),/монстр/);m.id=id;
 const atk=m.combat.atkMax;m.combat.atkMax=NaN;assert.throws(()=>core.validate(db),/монстр/);m.combat.atkMax=atk;
 assert.equal(core.validate(db),db);dom.window.close();
});
