const test=require('node:test'),assert=require('node:assert/strict'),{boot}=require('./helpers.cjs');
function prepare(g){g.start();g.state.debugInfiniteHp=true;g.state.spawn=g.state.nextBoss=g.state.attack=1e9;}
test('run ends at 20 game minutes and the menu reflects its configured duration',()=>{
 const {g,w,dom}=boot();assert.equal(w.RS_DATABASE.settings.runDuration,1200);assert(w.document.querySelector('#characterHint').textContent.endsWith('20 минут'));prepare(g);g.state.t=1199.8;g.update(.1);assert(!g.state.end);g.update(.2);assert(g.state.end);assert.equal(g.state.t,1200);assert.equal(g.state.report.time,'20:00');assert(w.document.querySelector('#endTitle').textContent.includes('ВЫДЕРЖАЛ'));dom.window.close();
});
test('pause and game speed respect the 20-minute limit',()=>{
 const {g,dom}=boot();prepare(g);g.state.t=1199;g.pause();g.update(10);assert.equal(g.state.t,1199);assert(!g.state.end);g.pause();g.state.spd=4;g.update(.25);assert(g.state.end);assert.equal(g.state.t,1200);dom.window.close();
});
test('old saves before the new limit continue, saves past it finish safely',()=>{
 const {g,w,dom}=boot();prepare(g);g.state.t=1190;g.saveRun();g.reset();g.restoreRun();assert(g.state.pause);assert(!g.state.end);assert.equal(g.state.t,1190);g.pause();g.state.t=1300;assert(g.saveRun());g.reset();g.restoreRun();assert(g.state.end);assert.equal(g.state.t,1200);assert.equal(g.state.report.time,'20:00');assert.equal(w.localStorage.getItem('rs.run.v2'),null);dom.window.close();
});
