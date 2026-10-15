// Source/asset import for the Classic Archer -> Hunter branch.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),os=require('node:os');
const {execFile}=require('node:child_process'),{promisify}=require('node:util'),{JSDOM}=require('jsdom');
const run=promisify(execFile),root=path.resolve(__dirname,'..');
async function page(name){
  const url='https://irowiki.org/classic/'+name.replaceAll(' ','_');
  const cache=path.join(os.tmpdir(),'rs-hunter-'+crypto.createHash('sha256').update(url).digest('hex')+'.html');
  if(!fs.existsSync(cache))await run('curl',['-fsSL','--max-time','40',url,'-o',cache]);
  return {url,doc:new JSDOM(fs.readFileSync(cache,'utf8')).window.document};
}
async function parallel(items,fn){let n=0;const out=[];await Promise.all(Array.from({length:4},async()=>{while(n<items.length){const i=n++;out[i]=await fn(items[i])}}));return out}
(async()=>{
 const files=[],skills=[];
 for(const job of ['Archer','Hunter']){
  const {url,doc}=await page(job);
  for(const img of doc.querySelectorAll('.mw-parser-output img')){
   const src=img.getAttribute('src');if(src.includes('/thumb/'))continue;
   const file=decodeURIComponent(src.split('/').at(-1));
   if(!file.endsWith('.png'))continue;
   const name=file.slice(0,-4).replaceAll('_',' '),key=name.toLowerCase().replaceAll("'",'').replaceAll('-','_').replaceAll(' ','_');
   const group=name===job?'characters':'skills';
   files.push({key,group,jobId:job.toLowerCase(),sourceUrl:url,imageSourceUrl:new URL(src,'https://irowiki.org').href,path:'assets/irowiki/'+group+'/'+(group==='characters'?key+'-male':key)+'.png'});
   if(group==='skills')skills.push({key,name,jobId:job.toLowerCase()});
  }
 }
 const details=await parallel(skills,async s=>{
  const {url,doc}=await page(s.name);const body=doc.querySelector('.mw-parser-output');
  const tables=[...body.querySelectorAll('table')].filter(t=>/SP Cost:|Type:|Prerequisites/.test(t.textContent));
  return {...s,source:url,tables:tables.slice(0,3).map(t=>t.textContent.replace(/\s+/g,' ').trim()),text:body.textContent.replace(/\s+/g,' ').trim().slice(0,9000)};
 });
 files.push({key:'hunter_falcon',group:'companions',sourceUrl:'https://www.spriters-resource.com/pc_computer/ragnarokonline/asset/141268/',imageSourceUrl:'https://www.spriters-resource.com/media/assets/138/141268.png?updated=1755481944',path:'assets/irowiki/characters/falcon-sheet.png'});
 await parallel(files,async a=>{
  const target=path.join(root,a.path);fs.mkdirSync(path.dirname(target),{recursive:true});
  if(!fs.existsSync(target))await run('curl',['-fsSL','--max-time','40',a.imageSourceUrl,'-o',target]);
  const bytes=fs.readFileSync(target);if(bytes.subarray(0,8).toString('hex')!=='89504e470d0a1a0a')throw Error('Invalid PNG '+a.path);
  Object.assign(a,{sha256:crypto.createHash('sha256').update(bytes).digest('hex'),width:bytes.readUInt32BE(16),height:bytes.readUInt32BE(20)});
 });
 console.log(JSON.stringify({retrieved:'2026-10-15',files,skills:details},null,2));
})().catch(e=>{console.error(e);process.exit(1)});
