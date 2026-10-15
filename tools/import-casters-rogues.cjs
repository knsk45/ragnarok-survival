// Import original Classic Wiki PNGs and reviewable skill metadata; never generate art.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),os=require('node:os');
const {execFile}=require('node:child_process'),{promisify}=require('node:util'),{JSDOM}=require('jsdom');
const run=promisify(execFile);
const root=path.resolve(__dirname,'..'),files=[],skills=[],jobs=[];
async function page(name){
 const url='https://irowiki.org/classic/'+name.replaceAll(' ','_');
 const cache=path.join(os.tmpdir(),'rs-classic-'+crypto.createHash('sha256').update(url).digest('hex')+'.html');
 if(!fs.existsSync(cache))await run('curl',['-fsSL','--retry','2','--max-time','30',url,'-o',cache]);
 const doc=new JSDOM(fs.readFileSync(cache,'utf8')).window.document;
 if(!doc.querySelector('.mw-parser-output'))throw Error('Invalid wiki page '+name);
 return {url,doc};
}
async function parallel(items,fn){let n=0;await Promise.all(Array.from({length:6},async()=>{while(n<items.length)await fn(items[n++]);}));}
(async()=>{
for(const job of ['Mage','Wizard','Thief','Assassin']){
 const {url,doc}=await page(job),body=doc.querySelector('.mw-parser-output');
 jobs.push({name:job,source:url});
 for(const img of body.querySelectorAll('img')){
  const src=img.getAttribute('src');if(src.includes('/thumb/'))continue;
  const file=decodeURIComponent(src.split('/').at(-1));if(!file.endsWith('.png')||/^\d+\.png$/.test(file))continue;
  const name=file.slice(0,-4).replaceAll('_',' '),key=name.toLowerCase().replaceAll("'",'').replaceAll('-','_').replaceAll(' ','_');
  const group=name===job?'characters':'skills';
  const asset={key,group,jobId:job.toLowerCase(),sourceUrl:url,imageSourceUrl:new URL(src,url).href,path:'assets/irowiki/'+group+'/'+key+(group==='characters'?'-male':'')+'.png'};
  if(files.some(f=>f.path===asset.path))continue;
  files.push(asset);
 }
}
await parallel(files,async asset=>{
  const {key,group,jobId}=asset,name=key.replaceAll('_',' '),target=path.join(root,asset.path);
  if(!fs.existsSync(target))await run('curl',['-fsSL','--retry','2','--max-time','30',asset.imageSourceUrl,'-o',target]);
  const bytes=fs.readFileSync(target);if(bytes.subarray(0,8).toString('hex')!=='89504e470d0a1a0a')throw Error('Invalid PNG '+target);
  Object.assign(asset,{sha256:crypto.createHash('sha256').update(bytes).digest('hex'),width:bytes.readUInt32BE(16),height:bytes.readUInt32BE(20)});
  if(group==='skills'){
   const original=asset.imageSourceUrl.split('/').at(-1).replace(/\.png$/,'');
   const p=await page(decodeURIComponent(original).replaceAll('_',' ')),b=p.doc.querySelector('.mw-parser-output');
   skills.push({key,name,jobId,source:p.url,tables:[...b.querySelectorAll('table')].filter(t=>/SP Cost:|Type:|Prerequisites/.test(t.textContent)).slice(0,3).map(t=>t.textContent.replace(/\s+/g,' ').trim())});
  }
  console.log('Imported '+name);
});
skills.sort((a,b)=>a.key.localeCompare(b.key));
fs.writeFileSync(path.join(root,'data/casters-rogues-sources.json'),JSON.stringify({retrieved:'2026-10-15',jobs,files,skills},null,2)+'\n');
})().catch(e=>{console.error(e);process.exit(1)});
