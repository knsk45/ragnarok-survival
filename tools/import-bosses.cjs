// Import exactly the user's filtered iRO Wiki boss list and original PNG bytes.
// node tools/import-bosses.cjs > /tmp/ragnarok-boss-import.json
const fs = require('node:fs'), path = require('node:path'), crypto = require('node:crypto');
const {execFile} = require('node:child_process'), {promisify} = require('node:util');
const {JSDOM} = require('jsdom');
const run = promisify(execFile), root = path.resolve(__dirname, '..');
const sourceFilter = 'https://db.irowiki.org/db/monster-search/?search&boss=1&category=1&hp=3,100000,0&level=3,100,&ltype=1&sort=1,1&header=10';
async function html(url) {
  const cached=path.join(require('node:os').tmpdir(),'ragnarok-boss-page-'+crypto.createHash('sha256').update(url).digest('hex')+'.html');
  if(!fs.existsSync(cached)) await run('curl', ['-fsSL','--max-time','40',url,'-o',cached], {maxBuffer:4000000});
  return new JSDOM(fs.readFileSync(cached,'utf8')).window.document;
}
const nums = s => (String(s).match(/[\d,.]+/g)||[]).map(n=>Number(n.replaceAll(',','')));
(async()=>{
  const search = await html(sourceFilter);
  const links = [...search.querySelectorAll('a[href*="monster-info/"]')]
    .filter(a=>/monster-info\/\d+\//.test(a.href));
  if (!links.length) throw Error('Empty boss filter results');
  const out = new Array(links.length); let cursor=0;
  await Promise.all(Array.from({length:4},async()=>{
    while(cursor<links.length){
      const i=cursor++, a=links[i], id=Number(a.href.match(/monster-info\/(\d+)/)[1]);
      const name=a.textContent.trim(), key=name.toLowerCase().replaceAll("'",'').replace(/[^a-z0-9]+/g,'_');
      const source='https://db.irowiki.org/db/monster-info/'+id+'/';
      const doc=await html(source), fields={};
      if(!doc.title.toLowerCase().includes(name.toLowerCase())) throw Error('ID/name mismatch '+id);
      for(const c of doc.querySelectorAll('.statTitle')) fields[c.textContent.trim()]=c.nextElementSibling?.querySelector('.defStat')?.textContent||c.nextElementSibling?.textContent.trim();
      for(const k of ['Level','HP','Attack','Def','MDef','Base Exp','Job Exp','Aspd','Move Speed','100% Hit','95% Flee']) if(!fields[k])throw Error('Missing '+k+' '+name);
      const get=k=>nums(fields[k])[0];
      const wikiImageUrl=doc.querySelector('[style*="image/monster/"]')?.getAttribute('style').match(/url\(['"]?([^)'" ]+)/)?.[1];
      // These iRO Wiki images return 404. Preserve matching original sprites by ID.
      const imageSourceUrl=[2192,2208].includes(id) ? 'https://static.divine-pride.net/images/mobs/png/'+id+'.png' : wikiImageUrl;
      if(!imageSourceUrl)throw Error('Missing image '+id);
      const assetPath='assets/irowiki/monsters/'+id+'.png', target=path.join(root,assetPath);
      if(!fs.existsSync(target)) await run('curl',['-fsSL','--max-time','40',imageSourceUrl,'-o',target]);
      const bytes=fs.readFileSync(target);
      if(bytes.subarray(0,8).toString('hex')!=='89504e470d0a1a0a')throw Error('Invalid PNG '+id);
      const stats={level:get('Level'),hp:get('HP'),atkMin:get('Attack'),atkMax:nums(fields.Attack)[1],def:get('Def'),mdef:get('MDef'),baseExp:get('Base Exp'),jobExp:get('Job Exp'),aspd:get('Aspd'),moveMs:get('Move Speed'),hit:get('100% Hit'),flee:get('95% Flee')};
      stats.range=get('Range');
      const baseLabels=[...doc.querySelectorAll('td.baseStat')].find(c=>c.textContent.trim()==='Agi')?.parentElement;
      if(baseLabels){
        const values=[...baseLabels.nextElementSibling.children];
        [...baseLabels.children].forEach((c,n)=>{stats[c.textContent.trim().toLowerCase()]=nums(values[n].textContent)[0]});
      }
      const cells=[...a.closest('tr').children].map(c=>c.textContent.trim());
      const classification={size:cells[5].toLowerCase(),race:cells[6].toLowerCase(),element:cells[7].split(' ')[0].toLowerCase(),elementLevel:nums(cells[7])[0],modes:['boss','aggressive']};
      if(!Object.values(stats).every(Number.isFinite))throw Error('Invalid stats '+name);
      out[i]={key,id,name,source,classification,stats,group:'monsters',sourceUrl:source,imageSourceUrl,path:assetPath,sha256:crypto.createHash('sha256').update(bytes).digest('hex'),bytes:bytes.length,width:bytes.readUInt32BE(16),height:bytes.readUInt32BE(20)};
    }
  }));
  console.log(JSON.stringify({retrieved:'2026-10-15',sourceFilter,files:out},null,2));
})().catch(e=>{console.error(e);process.exit(1)});
