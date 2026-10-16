// Keep exact PNG default-frame bytes; remove only APNG animation/control chunks.
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),dir=path.join(root,'assets/irowiki/monsters'),result={};
for(const name of fs.readdirSync(dir).filter(n=>n.endsWith('.png')).sort()){
 const bytes=fs.readFileSync(path.join(dir,name)),chunks=[bytes.subarray(0,8)];let offset=8;
 while(offset<bytes.length){const length=bytes.readUInt32BE(offset),type=bytes.toString('ascii',offset+4,offset+8);if(offset+12+length>bytes.length)throw Error('Truncated PNG '+name);if(!['acTL','fcTL','fdAT'].includes(type))chunks.push(bytes.subarray(offset,offset+length+12));offset+=length+12;}
 result['assets/irowiki/monsters/'+name]='data:image/png;base64,'+Buffer.concat(chunks).toString('base64');
}
fs.writeFileSync(path.join(root,'data/sprite-fallbacks.js'),'// Exact default PNG frames from original local assets; only APNG animation chunks are removed.\nwindow.RS_SPRITE_FALLBACKS='+JSON.stringify(result)+';\n');
console.log(Object.keys(result).length+' source-derived fallback frames');
