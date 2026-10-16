// Runs actual Chromium and WebKit against a local static server. No mock Canvas.
const {chromium,webkit}=require('playwright'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const root=path.resolve(__dirname,'..');
const server=http.createServer((req,res)=>{
 if(req.url==='/favicon.ico'){res.writeHead(204);return res.end();}
 const rel=decodeURIComponent(new URL(req.url,'http://localhost').pathname),file=path.resolve(root,'.'+(rel==='/'?'/index.html':rel));
 if(!file.startsWith(root+path.sep)){res.writeHead(403);return res.end();}
 fs.readFile(file,(err,data)=>{if(err){res.writeHead(404);return res.end();}const ext=path.extname(file);res.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.css':'text/css','.png':'image/png','.json':'application/json'})[ext]||'application/octet-stream');res.end(data);});
});
async function suite(engine,name){
 const browser=await engine.launch({headless:true});
 try{for(const [width,height]of [[320,480],[390,660],[844,390],[1366,768]]){
  const page=await browser.newPage({viewport:{width,height}}),errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)errors.push(r.url()+' '+r.status());});
  await page.goto('http://127.0.0.1:'+server.address().port+'/?test=1&scene=1');await page.waitForFunction(()=>window.RS_BOOTED===true);
  for(const hero of ['knight','hunter','wizard','assassin']){
   await page.locator('[data-class-id="'+hero+'"]').click();
   const start=page.locator('#startBtn');await start.scrollIntoViewIfNeeded();assert(await start.isVisible());
   const bounds=await start.boundingBox();assert(bounds.y>=0&&bounds.y+bounds.height<=height,'start accessible '+name+' '+width+' '+hero);
  }
  await page.locator('#buildPreset').selectOption('assassin_dual');await page.locator('#startBtn').click();
  await page.locator('#pauseBtn').click();await page.getByRole('tab',{name:'Настройки',exact:true}).click();assert(await page.locator('#debugInfiniteSp').isChecked());assert(!(await page.locator('#autoSkills').isChecked()));await page.locator('#debugInfiniteSp').uncheck();await page.locator('#autoSkills').check();await page.locator('#combatMode').selectOption('economy');await page.locator('#spReserve').selectOption('0.25');await page.locator('#focusBoss').check();
  await page.locator('#resume').click();await page.waitForFunction(()=>window.RS_TEST.state.t>.15);await page.locator('#pauseBtn').click();
  assert.equal(await page.evaluate(()=>window.RS_TEST.state.tactics.mode),'economy');
  assert(await page.locator('#autoSkills').isChecked());assert(!(await page.locator('#debugInfiniteSp').isChecked()));
  // Test hook only prepares a deterministic combat scene; actual browser loop/render/input stay real.
  for(const [hero,stage]of [['wizard_male','Wizard'],['assassin_male','Assassin'],['hunter_male','Hunter'],['knight_male','Knight']]){
   await page.evaluate(({hero,stage})=>{const g=window.RS_TEST;g.reset(hero);g.state.stage=stage;g.state.lvl=85;g.state.job=50;g.state.debugInfiniteHp=true;g.state.debugInfiniteSp=true;g.state.skillPoints=0;for(const d of window.RS_DATABASE.skills)if(d.implemented&&g.skillAvailable(d.id))g.state[d.stateKey]=Math.min(3,d.maxLevel);g.recalc(true);g.start();}, {hero,stage});
   await page.waitForFunction(()=>window.RS_TEST.state.t>.2);await page.locator('#pauseBtn').click();
   assert.equal(await page.locator('#fatal').isVisible(),false);assert.equal(await page.evaluate(()=>window.RS_TEST.state.stage),stage);
   assert(await page.evaluate(()=>[window.RS_TEST.state.hp,window.RS_TEST.state.sp].every(Number.isFinite)));
  }
  await page.evaluate(()=>{window.RS_TEST.reset();});
  await page.locator('#mapChoice').selectOption('pay_fild08');
  await page.locator('#startBtn').click();
  await page.keyboard.press('ArrowRight');
  await page.waitForFunction(()=>window.RS_TEST.state.t>.3);
  await page.screenshot({path:path.join(root,'test-results',name+'-payon-'+width+'x'+height+'.png')});
  await page.locator('#pauseBtn').click();
  assert.equal(await page.evaluate(()=>window.RS_TEST.state.mapId),'pay_fild08');
  assert(await page.evaluate(()=>{const g=window.RS_TEST;return g.terrain.free(g.player.x,g.player.y)&&g.enemies().every(e=>g.terrain.free(e.x,e.y));}));
  await page.screenshot({path:path.join(root,'test-results',name+'-'+width+'x'+height+'.png')});
  assert.deepEqual(errors,[]);await page.close();console.log(name+' '+width+'×'+height+' passed');
 }
 const skillsPage=await browser.newPage({viewport:{width:390,height:660}});
 await skillsPage.goto('http://127.0.0.1:'+server.address().port+'/?test=1&scene=1');await skillsPage.waitForFunction(()=>window.RS_TEST);
 await skillsPage.evaluate(()=>{const g=window.RS_TEST;g.selectCharacter('wizard_male');g.selectMap('pay_fild08');Object.assign(g.state,{stage:'Wizard',job:50,lvl:90,debugInfiniteHp:true});for(const d of window.RS_SKILLS)g.state.skillEnabled[d.id]=false;for(const id of ['fire_bolt','cold_bolt','lightning_bolt','energy_coat','sight','sight_blaster']){const d=window.RS_SKILLS.find(d=>d.id===id);g.state[d.stateKey]=Math.min(5,d.maxLevel);g.state.skillEnabled[id]=true;}g.recalc(true);g.start();g.state.spawn=g.state.nextBoss=1e9;});
 await skillsPage.waitForFunction(()=>window.RS_TEST.state.metrics.casts.energy_coat===1&&document.querySelector('#classStatus')?.textContent.includes('Energy Coat'));
 assert(await skillsPage.locator('#classStatus').textContent().then(s=>s.includes('Energy Coat')));
 await skillsPage.screenshot({path:path.join(root,'test-results',name+'-buff-timers.png')});await skillsPage.close();
 // Real browser decoding for every monster, including iOS/WebKit-compatible fallbacks.
 for(const failure of ['network','decode']){
  const page=await browser.newPage({viewport:{width:390,height:660}}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.route('**/assets/irowiki/monsters/1010.png*',route=>failure==='network'?route.abort():route.fulfill({status:200,contentType:'image/png',body:'invalid image bytes'}));
  await page.goto('http://127.0.0.1:'+server.address().port+'/?test=1&scene=1');
  await page.waitForFunction(()=>window.RS_TEST&&Object.keys(window.RS_DATABASE.monsters).every(k=>window.RS_TEST.spriteImage(k)));
  assert(await page.evaluate(()=>window.RS_TEST.spriteImage('willow').src.startsWith('data:image/png;base64,')));
  await page.evaluate(()=>{const g=window.RS_TEST;g.selectMap('pay_fild08');g.state.lvl=window.RS_DATABASE.monsters.willow.stats.level;g.spawn('willow');const e=g.enemies()[0];if(e.type!=='willow')throw Error('Wrong visual QA monster');e.x=g.player.x+65;e.y=g.player.y+80;g.start();g.state.pause=true;g.draw();});
  await page.screenshot({path:path.join(root,'test-results',name+'-willow-'+failure+'.png')});
  assert.deepEqual(errors,[]);await page.close();console.log(name+' Willow '+failure+' recovery and all 65 sprites decoded');
 }
 }finally{await browser.close();}
}
(async()=>{fs.mkdirSync(path.join(root,'test-results'),{recursive:true});await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));try{await suite(chromium,'chromium');if(process.env.BROWSER_ALL==='1')await suite(webkit,'webkit');}finally{server.close();}})().catch(e=>{console.error(e);process.exitCode=1;server.close();});
