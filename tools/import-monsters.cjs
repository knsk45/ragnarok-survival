// Import the first progression batch from the user's exact iRO Wiki filter.
// node tools/import-monsters.cjs > /tmp/rs-monsters-import.json
// Original PNG bytes are downloaded; data changes are reviewed separately.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),os=require('node:os');
const {execFile}=require('node:child_process'),{promisify}=require('node:util'),{JSDOM}=require('jsdom');
const run=promisify(execFile),root=path.resolve(__dirname,'..');
const sourceFilter='https://db.irowiki.org/db/monster-search/?search&boss=0&category=1&hp=6,45,10000&level=6,1,95&ltype=1&sort=1,1&header=10';
const selectedIds=[1113,1011,1010,1004,1009,1012,1014,1174,1019,1076,1095,1176,1246,1057,1034,1121,1273,1071,1032,1058,1271,1165,1127,1139,1110,1243,1369,1192,1213,1376,1619,1322,1622,1257,1782];
const nums=s=>(String(s).match(/[\d,.]+/g)||[]).map(v=>Number(v.replaceAll(',','')));
async function html(url){
 const cache=path.join(os.tmpdir(),'rs-monster-source-'+crypto.createHash('sha256').update(url).digest('hex')+'.html');
 if(!fs.existsSync(cache))await run('curl',['-fsSL','--max-time','35',url,'-o',cache],{maxBuffer:4000000});
 const doc=new JSDOM(fs.readFileSync(cache,'utf8')).window.document;
 if(!doc.title.includes('iW Database'))throw Error('Unexpected source page '+url);
 return doc;
}
(async()=>{
 const doc=await html(sourceFilter);
 const candidates=[...doc.querySelectorAll('a[href*="monster-info/"]')]
  .filter(a=>/monster-info\/\d+\//.test(a.href)&&a.closest('tr'))
  .map(a=>({id:Number(a.href.match(/monster-info\/(\d+)/)[1]),name:a.textContent.trim(),cells:[...a.closest('tr').children].map(c=>c.textContent.trim())}));
 if(!candidates.length||new Set(candidates.map(m=>m.id)).size!==candidates.length)throw Error('Invalid or empty filter results');
 let cursor=0;const files=new Array(selectedIds.length);
 await Promise.all(Array.from({length:4},async()=>{
  while(cursor<selectedIds.length){
   const i=cursor++,id=selectedIds[i],row=candidates.find(m=>m.id===id);
   if(!row)throw Error('Selected ID is outside filter: '+id);
   const {name,cells}=row,key=name.toLowerCase().replaceAll("'",'').replace(/[^a-z0-9]+/g,'_').replace(/_$/,'');
   const sourceUrl='https://db.irowiki.org/db/monster-info/'+id+'/',page=await html(sourceUrl),fields={};
   if(!page.title.toLowerCase().includes(name.toLowerCase()))throw Error('Name/ID mismatch '+id);
   for(const c of page.querySelectorAll('.statTitle'))fields[c.textContent.trim()]=c.nextElementSibling?.querySelector('.defStat')?.textContent||c.nextElementSibling?.textContent.trim();
   for(const k of ['Level','HP','Attack','Def','MDef','Base Exp','Job Exp','Aspd','Move Speed','100% Hit','95% Flee','Range'])if(!fields[k])throw Error('Missing '+k+' '+name);
   const get=k=>nums(fields[k])[0];
   const stats={level:get('Level'),hp:get('HP'),atkMin:get('Attack'),atkMax:nums(fields.Attack)[1],def:get('Def'),mdef:get('MDef'),baseExp:get('Base Exp'),jobExp:get('Job Exp'),aspd:get('Aspd'),moveMs:get('Move Speed'),hit:get('100% Hit'),flee:get('95% Flee'),range:get('Range')};
   const labels=[...page.querySelectorAll('td.baseStat')].find(c=>c.textContent.trim()==='Agi')?.parentElement;
   if(!labels)throw Error('Missing base stats '+id);
   const values=[...labels.nextElementSibling.children];
   [...labels.children].forEach((c,n)=>stats[c.textContent.trim().toLowerCase()]=nums(values[n].textContent)[0]);
   if(!Object.values(stats).every(Number.isFinite)||stats.level!==Number(cells[1])||stats.hp!==nums(cells[3])[0]||stats.atkMin!==nums(cells[4])[0]||stats.atkMax!==nums(cells[4])[1]||stats.baseExp!==nums(cells[10])[0]||stats.jobExp!==nums(cells[11])[0])throw Error('Card/filter mismatch '+id);
   const image=page.querySelector('[style*="image/monster/"]')?.getAttribute('style').match(/url\(['"]?([^)'" ]+)/)?.[1];
   if(!image)throw Error('Missing image '+id);
   const imageSourceUrl=new URL(image,sourceUrl).href,assetPath='assets/irowiki/monsters/'+id+'.png',target=path.join(root,assetPath);
   fs.mkdirSync(path.dirname(target),{recursive:true});
   if(!fs.existsSync(target))await run('curl',['-fsSL','--max-time','35',imageSourceUrl,'-o',target]);
   const bytes=fs.readFileSync(target);if(bytes.subarray(0,8).toString('hex')!=='89504e470d0a1a0a')throw Error('Not a PNG '+id);
   const modes=[...page.querySelectorAll('li')].map(c=>c.textContent.trim()).filter(s=>['Passive','Aggressive','Assist','Looter','Change Target'].includes(s)).map(s=>s.toLowerCase().replaceAll(' ','-'));
   const classification={size:cells[5].toLowerCase(),race:cells[6].toLowerCase(),element:cells[7].split(' ')[0].toLowerCase(),elementLevel:nums(cells[7])[0],modes};
   if(!stats.moveMs||stats.range>3)throw Error('This batch must use moving, short-range monsters: '+name);
   files[i]={id,key,name,classification,stats,group:'monsters',sourceUrl,imageSourceUrl,path:assetPath,sha256:crypto.createHash('sha256').update(bytes).digest('hex'),bytes:bytes.length,width:bytes.readUInt32BE(16),height:bytes.readUInt32BE(20)};
   console.error('Imported '+name+' L'+stats.level);
  }
 }));
 console.log(JSON.stringify({retrieved:'2026-10-15',sourceFilter,totalMatches:candidates.length,selectionPolicy:'35 moving, short-range monsters covering progression gaps; existing records are preserved.',selectedIds,files,candidates:candidates.map(m=>({id:m.id,name:m.name,level:Number(m.cells[1]),hp:nums(m.cells[3])[0],selected:selectedIds.includes(m.id)}))},null,2));
})().catch(e=>{console.error(e);process.exit(1)});
