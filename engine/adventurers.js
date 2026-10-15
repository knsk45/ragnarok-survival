(function(root){
 'use strict';
 const dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y),magicJobs=['Mage','Wizard'];
 const colors={fire:'#ff9861',water:'#8cdeff',wind:'#d3b2ff',earth:'#c1b279',ghost:'#d4ddff',poison:'#a5e478',neutral:'#faf0cd'};
 function classification(ctx,e){return e.frozen?{element:'water',elementLevel:1}:e.stonedUntil>ctx.state.t?{element:'earth',elementLevel:1}:ctx.types[e.type][8].classification;}
 function hidden(ctx){return (ctx.state.effects.hiding?.expires||0)>ctx.state.t||(ctx.state.effects.cloaking?.expires||0)>ctx.state.t;}
 function reveal(ctx){delete ctx.state.effects.hiding;delete ctx.state.effects.cloaking;}
 function poison(ctx,e,l){
  const c=classification(ctx,e);if(e.boss||['poison','undead'].includes(c.element))return;
  const existing=e.poison?.expires>ctx.state.t?e.poison:null;
  e.poison={expires:ctx.state.t+5+2*l,next:existing?.next??ctx.state.t+1,damage:Math.max(existing?.damage||0,ctx.state.atk*.08+3*l,1)};
 }
 function status(ctx,e,kind,duration){
  if(e.dead||e.boss)return;
  const c=classification(ctx,e);
  if((kind==='freeze'&&['undead','water'].includes(c.element))||(kind==='stone'&&['undead','earth'].includes(c.element)))return;
  if(kind==='freeze'){e.frozen=true;e.stunnedUntil=ctx.state.t+duration;}
  else if(kind==='stone'){e.stonedUntil=ctx.state.t+duration;e.stunnedUntil=e.stonedUntil;}
  else e.stunnedUntil=ctx.state.t+duration;
 }
 function visual(ctx,id,pos,r,element,duration=.4){
  const S=ctx.state;S.classVisuals.push({id,x:pos.x,y:pos.y,r,element,expires:S.t+duration,started:S.t});
  if(S.classVisuals.length>60)S.classVisuals.shift();
 }
 function hurt(ctx,e,damage,id,element,magical=false){ctx.hit(e,damage,false,id,{element,magical});}
 function targets(ctx,p,r){return ctx.enemies().filter(e=>!e.dead&&dist(e,p)<=r+e.r);}
 function field(ctx,id,pos,l,element){
  const S=ctx.state,matk=S.matk;
  const config={
   fire_wall:[62,4,.45,matk*.5],thunderstorm:[82,Math.max(1,l*.25),.25,matk*.8],
   storm_gust:[130,4.5,.45,matk*(1+.4*l)],meteor_storm:[130,4,.65,matk*(1+.22*l)],
   lord_of_vermilion:[145,3,.6,matk*(.8+.2*l)],quagmire:[100,5+3*l,.3,0],
   fire_pillar:[50,5,.3,matk*(.4+.1*l)],venom_dust:[70,5*l,.8,0],ice_wall:[65,2+l,.2,0],
  }[id];
  const[r,duration,interval,damage]=config;
  S.classFields.push({id,x:pos.x,y:pos.y,r,l,element,expires:S.t+duration,next:S.t,interval,damage});
  if(S.classFields.length>18)S.classFields.shift();
 }
 function resolve(ctx,c){
  const S=ctx.state,P=ctx.player,d=ctx.byId[c.id],l=c.level,id=d.id;
  const target=ctx.enemies().find(e=>e.id===c.targetId&&!e.dead),pos=target||{x:c.x,y:c.y};
  if(d.runtime.action==='field'){field(ctx,id,{x:c.x,y:c.y},l,d.element);return;}
  if(d.runtime.action!=='spell')return;
  let mult=1,r=0,knock=0,freeze=0;
  if(['fire_bolt','cold_bolt','lightning_bolt'].includes(id))mult=l;
  else if(id==='napalm_beat'){mult=.7+.1*l;r=48;}
  else if(id==='soul_strike'){mult=Math.ceil(l/2);if(target&&classification(ctx,target).element==='undead')mult*=1+.05*l;}
  else if(id==='fire_ball'){mult=.7+.1*l;r=80;}
  else if(id==='frost_diver'){mult=1+.1*l;freeze=.35+.03*l;}
  else if(id==='earth_spike')mult=l;
  else if(id==='heavens_drive'){mult=l;r=85;}
  else if(id==='jupitel_thunder'){mult=2+l;knock=35+5*l;}
  else if(id==='frost_nova'){mult=.66+.044*l;r=130;freeze=.33+.05*l;}
  else if(id==='sightrasher'){mult=1+.2*l;r=150;knock=70;}
  const origin=['frost_nova','sightrasher'].includes(id)?P:pos;
  const victims=r?targets(ctx,origin,r):target?[target]:[];
  for(const e of victims){
   hurt(ctx,e,c.power*mult,id,d.element,true);
   if(freeze&&Math.random()<freeze)status(ctx,e,'freeze',2+l*.3);
   if(knock&&!e.boss&&!e.dead){const a=Math.atan2(e.y-P.y,e.x-P.x);e.x+=Math.cos(a)*knock;e.y+=Math.sin(a)*knock;}
  }
  visual(ctx,id,origin,r||28,d.element);
 }
 function castTime(d,l,dex){
  const base={fire_bolt:.7*l,cold_bolt:.7*l,lightning_bolt:.7*l,fire_ball:1.5,fire_wall:2,frost_diver:.8,napalm_beat:.5,soul_strike:.5,thunderstorm:1+.7*l,earth_spike:.7*l,heavens_drive:1,jupitel_thunder:2+.5*l,storm_gust:5+1*l,meteor_storm:15,lord_of_vermilion:15-.5*l,quagmire:0,fire_pillar:1.5,frost_nova:1,sightrasher:.7}[d.id]||0;
  // Arena pacing: original cast base, DEX reduction, then 0.35x Survivor factor.
  return Math.max(0,base*(1-Math.min(150,dex)/150)*.35);
 }
 function cost(d,l){
  if(d.spCosts)return d.spCosts[l-1];
  if(['fire_bolt','cold_bolt','lightning_bolt'].includes(d.id))return 10+2*l;
  if(d.id==='earth_spike')return 10+2*l;
  if(d.id==='thunderstorm')return 24+5*l;
  if(d.id==='jupitel_thunder')return 18+2*l;
  if(d.id==='storm_gust')return 78;
  if(d.id==='meteor_storm'||d.id==='lord_of_vermilion')return 20+4*l;
  if(d.id==='sonic_blow')return 14+2*l;
  return d.spCosts?.[l-1]??d.spCost;
 }
 function cast(ctx,d){
  const S=ctx.state,P=ctx.player,l=S[d.stateKey],a=d.runtime.action,id=d.id;
  if(S.pendingClassCast||S.classCastReady>S.t)return false;
  const list=ctx.enemies().filter(e=>!e.dead&&dist(e,P)<=(d.runtime.range||320)+e.r&&(!d.element||root.RSCore.elementMultiplier(d.element,classification(ctx,e))>0));
  list.sort((a,b)=>(S.tactics?.focusBoss?Number(b.boss)-Number(a.boss):0)||dist(a,P)-dist(b,P));const target=list[0];if(!target)return false;
  if(a==='waterBall'||a==='stoneSupply')return false;
  if((a==='sonic'||a==='grim')&&S.weaponStyle==='dual')return false;
  if(a==='grim'&&!hidden(ctx))return false;
  if(a==='sonic'&&dist(target,P)>100)return false;
  if(['envenom','sand'].includes(a)&&dist(target,P)>100)return false;
  if(a==='hide'&&(hidden(ctx)||S.hp>S.max*.65||dist(target,P)>130))return false;
  if(a==='cloak'&&(hidden(ctx)||S.hp>S.max*.8||dist(target,P)>180))return false;
  if(a==='slide'&&(dist(target,P)>65||S.hp>S.max*.7))return false;
  if(a==='detox'&&!(S.poisonedUntil>S.t))return false;
  if(a==='stone'&&(target.boss||target.stunnedUntil>S.t))return false;
  if(a==='sight'&&!list.some(e=>e.hidden))return false;
  if(a==='steal'&&(target.boss||target.stealAttempted))return false;
  const buffKey={coat:'energyCoat',enchant:'enchantPoison',react:'poisonReact',wall:'safetyWall',sightBlast:'sightBlaster'}[a];
  if(buffKey&&S.effects[buffKey]?.expires>S.t&&(buffKey!=='safetyWall'||S.effects[buffKey].charges>0))return false;
  if(['field','dust','ice'].includes(a)&&S.classFields.some(f=>f.id===id&&f.expires>S.t))return false;
  if(a==='splasher'&&S.venomBombs.some(b=>b.targetId===target.id))return false;
  if(!ctx.useSp(cost(d,l)))return false;
  S.cooldowns[id]=S.t+Math.max(.3,d.cooldown);S.metrics.casts[id]=(S.metrics.casts[id]||0)+1;ctx.skillCast(d.name);
  S.classCastReady=S.t+.3;
  if(a==='spell'||a==='field'){
   const wait=castTime(d,l,ctx.stats().dex);
   S.pendingClassCast={id,level:l,targetId:target.id,x:target.x,y:target.y,power:S.matk,startedAt:S.t,finishesAt:S.t+wait};
   S.cooldowns[id]+=wait;
   if(!wait){resolve(ctx,S.pendingClassCast);S.pendingClassCast=null;}
  }else if(a==='wall')S.effects.safetyWall={expires:S.t+5+l*2,x:P.x,y:P.y,charges:2+l};
  else if(a==='sightBlast')S.effects.sightBlaster={expires:S.t+120};
  else if(a==='coat')S.effects.energyCoat={expires:S.t+120};
  else if(a==='enchant')S.effects.enchantPoison={expires:S.t+30+15*l,level:l};
  else if(a==='react')S.effects.poisonReact={expires:S.t+30,charges:1+Math.floor(l/2),level:l};
  else if(a==='hide'||a==='cloak'){
   S.effects[a==='hide'?'hiding':'cloaking']={expires:S.t+2+l*.35,level:l};
  }else if(a==='slide'){
   const angle=Math.atan2(P.y-target.y,P.x-target.x);P.x+=Math.cos(angle)*80;P.y+=Math.sin(angle)*80;
   visual(ctx,id,P,40,'ghost');
  }else if(a==='detox')S.poisonedUntil=0;
  else if(a==='stone')status(ctx,target,'stone',2+l*.4);
  else if(a==='sight'){for(const e of list)e.hidden=false;}
  else if(a==='ice')field(ctx,'ice_wall',{x:(P.x+target.x)/2,y:(P.y+target.y)/2},l,'water');
  else if(a==='dust')field(ctx,'venom_dust',target,l,'poison');
  else if(a==='sense'){
   const m=ctx.types[target.type][8];ctx.say(m.name+' · HP '+Math.ceil(target.hp)+'/'+target.max+' · '+m.classification.element+' '+m.classification.elementLevel+' · DEF '+m.stats.def+' / MDEF '+m.stats.mdef);
  }else if(a==='steal'){
   target.stealAttempted=true;
   if(Math.random()<Math.min(.6,.05*l+ctx.stats().dex/500)){ctx.dropGift(target);ctx.say('Steal: Gift Box!');}
  }else if(a==='splasher'){
   reveal(ctx);S.venomBombs.push({targetId:target.id,x:target.x,y:target.y,at:S.t+3,damage:S.atk*(5+.5*l),l});
  }else{
   if(a!=='grim')reveal(ctx);
   const poisonElement=S.effects.enchantPoison?.expires>S.t?'poison':'neutral';
   if(a==='sonic'){
    hurt(ctx,target,S.atk*(3+.5*l)*(S.sonic_acceleration?1.1:1),id,poisonElement);
    if(Math.random()<.1+.02*l)status(ctx,target,'stun',2);
   }else if(a==='grim'){
    for(const e of targets(ctx,target,55))hurt(ctx,e,S.atk*(1+.2*l),id,poisonElement);
   }else if(a==='envenom'||a==='knife'){
    hurt(ctx,target,S.atk+(a==='envenom'?15*l:0),id,'poison');if(Math.random()<.1+.04*l)poison(ctx,target,l);
   }else if(a==='sand'){
    hurt(ctx,target,S.atk*1.25,id,'earth');if(!target.boss&&Math.random()<.15)target.blindedUntil=S.t+5;
   }else if(a==='fling'){
    ctx.hit(target,50,false,id,{ignoreDef:true,element:'neutral'});if(Math.random()<.05)status(ctx,target,'stun',2);
   }
   visual(ctx,id,target,a==='grim'?55:28,a==='envenom'||a==='knife'?'poison':'neutral');
  }
  return true;
 }
 function basic(ctx,profile){
  const S=ctx.state,P=ctx.player;if(S.pendingClassCast)return true;
  const target=ctx.nearest(S.attackRange);if(!target)return true;
  if(profile.kind==='magic'){
   // Non-canonical free magic spark keeps a solo Survivor run viable without SP.
   const a=Math.atan2(target.y-P.y,target.x-P.x),speed=600;P.dir=a;
   ctx.shots.push({x:P.x,y:P.y,vx:Math.cos(a)*speed,vy:Math.sin(a)*speed,r:6,life:S.attackRange/speed+.2,hit:new Set(),dmg:S.matk*.7,crit:false,col:colors.ghost,skillId:'arcane_spark',classMagic:true,element:'neutral'});
   return true;
  }
  if(!['dagger','assassin'].includes(profile.kind))return false;
  if(hidden(ctx))return true;
  const dual=profile.kind==='assassin'&&S.weaponStyle==='dual',katar=profile.kind==='assassin'&&!dual;
  const crit=Math.random()<S.crit;
  if(!crit&&Math.random()>root.RSCore.chance(S.hit,ctx.types[target.type][8].stats.flee-(target.quagmireUntil>S.t?5*target.quagmireLevel:0)))return true;
  const double=!katar&&!crit&&Math.random()<.05*(S.double_attack||0),atk=S.atk*(crit?2:1);
  const main=dual ? .5+.1*(S.righthand_mastery||0) : 1,off=dual ? .3+.1*(S.lefthand_mastery||0) : katar ? .01+.02*(S.double_attack||0) : 0;
  const element=S.effects.enchantPoison?.expires>S.t?'poison':'neutral';
  P.dir=Math.atan2(target.y-P.y,target.x-P.x);
  const damage=atk*(main*(double?2:1)+off);
  ctx.hit(target,damage,crit,double?'double_attack':'basic',{element,ignoreDef:crit});
  for(const e of targets(ctx,target,42))if(e!==target)hurt(ctx,e,damage*.35,'basic',element);
  if(S.effects.enchantPoison?.expires>S.t&&Math.random()<.05*S.effects.enchantPoison.level)poison(ctx,target,S.effects.enchantPoison.level);
  visual(ctx,'slash',target,40,element);return true;
 }
 function update(ctx,dt){
  const S=ctx.state;
  if(S.effects.sightBlaster?.expires>S.t){
   const e=ctx.nearest(60);if(e){hurt(ctx,e,S.matk,'sight_blaster','fire',true);if(!e.boss&&!e.dead){const a=Math.atan2(e.y-ctx.player.y,e.x-ctx.player.x);e.x+=Math.cos(a)*60;e.y+=Math.sin(a)*60;}delete S.effects.sightBlaster;visual(ctx,'sight_blaster',ctx.player,65,'fire');}
  }
  if(S.pendingClassCast?.finishesAt<=S.t){const c=S.pendingClassCast;S.pendingClassCast=null;resolve(ctx,c);}
  for(const e of [...ctx.enemies()]){
   if(e.frozen&&!(e.stunnedUntil>S.t)){e.frozen=false;}
   if(e.stonedUntil&&e.stonedUntil<=S.t)e.stonedUntil=0;
   if(e.poison?.expires>S.t&&e.poison.next<=S.t){e.poison.next=S.t+1;ctx.hit(e,e.poison.damage,false,'poison_tick',{element:'poison',ignoreDef:true});}
  }
  for(const f of S.classFields){
   if(f.expires<=S.t||f.next>S.t)continue;f.next=S.t+f.interval;
   const victims=targets(ctx,f,f.r);
   for(const e of victims){
    if(f.id==='quagmire'){e.quagmireUntil=S.t+.5;e.quagmireLevel=f.l;continue;}
    if(f.id==='ice_wall'){if(!e.boss)e.rootedUntil=S.t+.3;continue;}
    if(f.id==='venom_dust'){poison(ctx,e,f.l);continue;}
    hurt(ctx,e,f.damage,f.id,f.element,true);
    if(f.id==='fire_wall'&&!e.boss&&!e.dead){const a=Math.atan2(e.y-f.y,e.x-f.x);e.x+=Math.cos(a)*20;e.y+=Math.sin(a)*20;}
    if(f.id==='storm_gust'){e.gustHits=(e.gustHits||0)+1;if(e.gustHits%3===0)status(ctx,e,'freeze',2);}
    if(f.id==='meteor_storm'&&Math.random()<.03*f.l)status(ctx,e,'stun',1.5);
   }
   visual(ctx,f.id,f,f.r,f.element,.3);
  }
  S.classFields=S.classFields.filter(f=>f.expires>S.t);
  for(const b of S.venomBombs){
   const e=ctx.enemies().find(e=>e.id===b.targetId&&!e.dead);if(e){b.x=e.x;b.y=e.y;}
   if(b.at<=S.t){for(const victim of targets(ctx,b,100))hurt(ctx,victim,b.damage,'venom_splasher','neutral');visual(ctx,'venom_splasher',b,100,'poison');}
  }
  S.venomBombs=S.venomBombs.filter(b=>b.at>S.t);
  S.classVisuals=S.classVisuals.filter(v=>v.expires>S.t);
 }
 function seesPlayer(ctx,e){
  if(!hidden(ctx))return true;
  return e.boss||['insect','demon'].includes(classification(ctx,e).race);
 }
 function incoming(ctx,e,taken,options={}){
  const S=ctx.state,wall=S.effects.safetyWall;
  if(options.melee!==false&&wall?.expires>S.t&&wall.charges>0&&dist(ctx.player,wall)<=36){wall.charges--;return 0;}
  if(S.effects.energyCoat?.expires>S.t&&S.sp>0){const cost=Math.max(1,Math.ceil(S.spMax*.01));if(ctx.useSp(cost))taken*=.7;else delete S.effects.energyCoat;}
  const react=S.effects.poisonReact;
  if(react?.expires>S.t&&react.charges>0){react.charges--;hurt(ctx,e,S.atk*(1+.3*react.level),'poison_react','poison');}
  return Math.max(1,Math.round(taken));
 }
 function draw(ctx,x,screen){
  const S=ctx.state;
  function circle(pos,r,color,alpha){const p=screen(pos.x,pos.y);x.save();x.globalAlpha=alpha;x.strokeStyle=color;x.lineWidth=2;x.fillStyle=color+'18';x.beginPath();x.ellipse(p.x,p.y,r,r*.45,0,0,Math.PI*2);x.fill();x.stroke();x.restore();}
  for(const f of S.classFields||[])circle(f,f.r,colors[f.element]||colors.ghost,.5);
  for(const v of S.classVisuals||[]){
   const progress=(S.t-v.started)/(v.expires-v.started),p=screen(v.x,v.y),color=colors[v.element]||colors.ghost;
   circle(v,v.r*(.7+.3*progress),color,1-progress);
   if(['meteor_storm','thunderstorm','lord_of_vermilion','jupitel_thunder'].includes(v.id)){
    x.save();x.globalAlpha=1-progress;x.strokeStyle=color;x.lineWidth=v.id==='meteor_storm'?8:3;
    for(let i=0;i<3;i++){const ox=(i-1)*v.r*.5;x.beginPath();x.moveTo(p.x+ox-18,p.y-100);x.lineTo(p.x+ox+8,p.y-55);x.lineTo(p.x+ox-5,p.y);x.stroke();}x.restore();
   }
  }
  if(S.effects?.safetyWall?.expires>S.t&&S.effects.safetyWall.charges>0)circle(S.effects.safetyWall,36,'#f2b4ff',.8);
  if(S.effects?.energyCoat?.expires>S.t)circle(ctx.player,27,'#a5bdff',.6);
  if(S.effects?.enchantPoison?.expires>S.t)circle(ctx.player,22,'#a5e478',.5);
  if(S.pendingClassCast){
   const p=screen(ctx.player.x,ctx.player.y),c=S.pendingClassCast,progress=(S.t-c.startedAt)/Math.max(.01,c.finishesAt-c.startedAt);x.save();x.fillStyle='#172634';x.fillRect(p.x-28,p.y-102,56,5);x.fillStyle='#bcb3ff';x.fillRect(p.x-28,p.y-102,56*Math.max(0,Math.min(1,progress)),5);x.restore();
  }
 }
 root.RSAdventurers={cast,update,basic,draw,incoming,seesPlayer,hidden,reveal,classification,poison,status,castTime,cost,magicJobs};
})(typeof window!=='undefined'?window:globalThis);
