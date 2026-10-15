// Telegraphs and attacks are Survivor adaptations, not original RO monster skills.
(function(root){
 const move=(ctx,o,dx,dy)=>ctx.moveEntity?ctx.moveEntity(o,dx,dy):(o.x+=dx,o.y+=dy);
 const ranged=new Set(['condor','chonchon','harpy']),dashers=new Set(['savage','alligator','grand_peco','roween']),casters=new Set(['myst','marionette','wraith','zerom']);
 const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
 function source(ctx,e){return {type:e.type,atkMin:e.atkMin,atkMax:e.atkMax,damageScale:e.damageScale||1,boss:!!e.boss};}
 function update(ctx,dt){
  const S=ctx.state,P=ctx.player;
  for(const e of ctx.enemies()){
   if(e.dead||e.stunnedUntil>S.t||!ctx.sees(e))continue;
   const d=distance(e,P);
   if(e.charge){
    if(e.rootedUntil>S.t){delete e.charge;continue;}
    if(e.charge.at>S.t)continue;
    const previous={x:e.x,y:e.y};move(ctx,e,Math.cos(e.charge.angle)*500*dt,Math.sin(e.charge.angle)*500*dt);
    if(root.RSCore.segmentHits(previous.x,previous.y,e.x,e.y,P.x,P.y,e.r+16))ctx.hurt(e,1,'Рывок',true);
    if(S.t>=e.charge.until)delete e.charge;continue;
   }
   if((e.nextAbility||0)>S.t||d>450||(ctx.lineOfSight&&!ctx.lineOfSight(e,P)))continue;
   e.nextAbility=S.t+(e.boss?9:6)+(e.id%3);
   if(ranged.has(e.type)){
    const angle=Math.atan2(P.y-e.y,P.x-e.x);S.hostileProjectiles.push({x:e.x,y:e.y,vx:Math.cos(angle)*170,vy:Math.sin(angle)*170,life:3,source:source(ctx,e)});
   }else if(dashers.has(e.type)&&d>70&&d<330){
    e.charge={at:S.t+.9,until:S.t+1.35,angle:Math.atan2(P.y-e.y,P.x-e.x)};
   }else if(casters.has(e.type)||e.boss){
    S.dangerAreas.push({x:P.x,y:P.y,r:e.boss?90:65,armedAt:S.t+1.3,expires:S.t+3.3,next:S.t+1.3,source:source(ctx,e)});
   }
  }
  S.hostileProjectiles=S.hostileProjectiles.filter(p=>{
   const x=p.x,y=p.y;p.x+=p.vx*dt;p.y+=p.vy*dt;p.life-=dt;
   if(ctx.lineOfSight&&!ctx.lineOfSight({x,y},p))return false;
   if(root.RSCore.segmentHits(x,y,p.x,p.y,P.x,P.y,20)){ctx.hurt(p.source,.7,'Дальний выстрел',false);return false;}return p.life>0;
  }).slice(-80);
  S.dangerAreas=S.dangerAreas.filter(a=>{
   if(a.expires<=S.t)return false;
   if(S.t>=a.armedAt&&S.t>=a.next){a.next+=.75;if(distance(a,P)<a.r+16)ctx.hurt(a.source,.65,'Опасная зона',false);}
   return true;
  }).slice(-24);
 }
 function moveScale(e,P,t){if(e.charge)return 0;return ranged.has(e.type)&&distance(e,P)<190 ? 0 : 1;}
 function draw(ctx,x,screen){
  const S=ctx.state;
  for(const a of S.dangerAreas){const p=screen(a.x,a.y),armed=S.t>=a.armedAt;x.save();x.strokeStyle=armed?'#ff5970':'#ffd665';x.fillStyle=armed?'#ed31533b':'#ffda4418';x.lineWidth=3;x.beginPath();x.arc(p.x,p.y,a.r,0,Math.PI*2);x.fill();x.stroke();x.fillStyle='#fff';x.font='bold 12px Arial';x.textAlign='center';x.fillText(armed?'ОПАСНО':'ОТОЙДИ',p.x,p.y);x.restore();}
  for(const e of ctx.enemies())if(e.charge&&e.charge.at>S.t){const p=screen(e.x,e.y);x.save();x.strokeStyle='#ffd665';x.lineWidth=12;x.globalAlpha=.5;x.beginPath();x.moveTo(p.x,p.y);x.lineTo(p.x+Math.cos(e.charge.angle)*220,p.y+Math.sin(e.charge.angle)*220);x.stroke();x.restore();}
  for(const p of S.hostileProjectiles){const v=screen(p.x,p.y);x.save();x.fillStyle='#ff73c3';x.strokeStyle='#fff';x.lineWidth=2;x.beginPath();x.arc(v.x,v.y,7,0,Math.PI*2);x.fill();x.stroke();x.restore();}
 }
 root.RSMonsterAI={update,moveScale,draw};
})(typeof window!=='undefined'?window:globalThis);
