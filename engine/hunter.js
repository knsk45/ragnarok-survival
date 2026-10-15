(function(root){
  'use strict';
  const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
  function bestElement(ctx,target){
    const defense=ctx.types[target.type][8].classification;
    return ['neutral','water','earth','fire','wind','holy','shadow','ghost','poison']
      .sort((a,b)=>root.RSCore.elementMultiplier(b,defense)-root.RSCore.elementMultiplier(a,defense))[0];
  }
  function arrow(ctx,target,damage,options={}){
    const {state:S,player:P,shots}=ctx,speed=options.speed||680;
    const a=Math.atan2(target.y-P.y,target.x-P.x);
    shots.push({x:P.x,y:P.y,vx:Math.cos(a)*speed,vy:Math.sin(a)*speed,speed,
      r:3,life:1.5,hit:new Set(),dmg:damage,crit:!!options.crit,col:'#ffe3a2',
      skillId:options.skillId||'basic',hunterArrow:true,targetId:target.id,
      splash:options.splash||0,knockback:options.knockback||0,miss:!!options.miss,
      delay:options.delay||0,element:options.element||bestElement(ctx,target)});
  }
  function falcon(ctx,target,manual=false){
    const {state:S,player:P,enemies,stats,hit}=ctx;
    if(!S.falconry_mastery||!S.blitz_beat||!target||target.dead)return;
    const q=stats(),hits=manual?S.blitz_beat:Math.min(S.blitz_beat,1+Math.floor(S.job/10));
    const victims=enemies().filter(e=>!e.dead&&distance(e,target)<=55+e.r);
    const damage=(80+6*(S.steel_crow||0)+2*Math.floor(q.int/2)+2*Math.floor(q.dex/10))*hits/(manual?1:Math.max(1,victims.length));
    for(const e of victims)hit(e,damage,false,'blitz_beat',{ignoreDef:true,element:'neutral'});
    S.falconFlights.push({x:P.x,y:P.y-40,tx:target.x,ty:target.y,life:.55,max:.55});
  }
  function impact(ctx,p,target){
    if(p.miss)return;
    const victims=p.splash?ctx.enemies().filter(e=>!e.dead&&distance(e,target)<=p.splash+e.r):[target];
    for(const e of victims){
      ctx.hit(e,p.dmg,p.crit,p.skillId,{element:p.element});
      if(p.skillId==='basic'&&['brute','insect'].includes(ctx.types[e.type][8].classification.race)&&ctx.state.beast_bane)
        ctx.hit(e,4*ctx.state.beast_bane,false,'beast_bane',{ignoreDef:true});
      if(p.knockback&&!e.boss&&!e.dead){const a=Math.atan2(e.y-ctx.player.y,e.x-ctx.player.x);e.x+=Math.cos(a)*p.knockback;e.y+=Math.sin(a)*p.knockback;}
    }
    if(p.splash)ctx.burst(target.x,target.y,'#ffe3a2',12);
  }
  function resolve(ctx,d,target){
    const {state:S,player:P,stats}=ctx,l=S[d.stateKey],action=d.runtime.action;
    if(!target||target.dead)return;
    const atk=(S.atkMin+S.atkMax)/2;
    if(action==='double')for(let i=0;i<2;i++)arrow(ctx,target,atk*(.9+.1*l),{skillId:d.id,delay:i*.08});
    else if(action==='shower')arrow(ctx,target,atk*(.75+.05*l),{skillId:d.id,splash:72,knockback:30});
    else if(action==='repel'||action==='phantasmic')arrow(ctx,target,atk*1.5,{skillId:d.id,knockback:action==='repel'?96:48});
    else if(action==='falcon')falcon(ctx,target,true);
    else if(action==='concentration'){
      S.effects.concentration={expires:S.t+40+20*l,level:l};ctx.recalc();
      for(const e of ctx.enemies())if(distance(e,P)<70)e.hidden=false;
    }else if(action==='detect'){
      for(const e of ctx.enemies())if(distance(e,P)<=120+45*l)e.hidden=false;
    }else if(action==='remove'){
      const trap=S.traps.find(t=>distance(t,P)<110);if(trap)S.traps.splice(S.traps.indexOf(trap),1);
    }else if(action==='spring'){
      const trap=S.enemyTraps?.find(t=>distance(t,P)<120+20*l);if(trap)S.enemyTraps.splice(S.enemyTraps.indexOf(trap),1);
    }else if(action==='trap'){
      const a=Math.atan2(target.y-P.y,target.x-P.x);
      const durations={land_mine:240-40*l,blast_mine:30-5*l,claymore_trap:20*l,ankle_snare:300-50*l,flasher:180-30*l,freezing_trap:180-30*l,sandman:180-30*l,shockwave_trap:240-40*l,skid_trap:360-60*l,talkie_box:600};
      S.traps.push({skillId:d.id,level:l,x:P.x+Math.cos(a)*55,y:P.y+Math.sin(a)*55,armedAt:S.t+.4,expiresAt:S.t+durations[d.id]});
    }
  }
  function cast(ctx,d){
    const {state:S,player:P}=ctx,l=S[d.stateKey],action=d.runtime.action;
    if(S.hunterCastReady>S.t||S.pendingHunterCast)return false;
    const target=ctx.nearest((S.attackRange||280)+48);
    if(!target)return false;
    if(action==='concentration'&&S.effects.concentration?.expires>S.t)return false;
    if(action==='trap'&&(distance(target,P)>220||S.traps.length>=8||S.traps.some(t=>t.skillId===d.id)))return false;
    const trapElement={land_mine:'earth',blast_mine:'wind',claymore_trap:'fire',freezing_trap:'water'}[d.id];
    if(trapElement&&root.RSCore.elementMultiplier(trapElement,ctx.types[target.type][8].classification)<=0)return false;
    if(action==='falcon'&&!S.falconry_mastery)return false;
    if(action==='detect'&&!ctx.enemies().some(e=>e.hidden&&distance(e,P)<120+45*l))return false;
    if(action==='remove'&&!S.traps.some(t=>distance(t,P)<110))return false;
    if(action==='spring'&&!S.enemyTraps?.some(t=>distance(t,P)<120+20*l))return false;
    if(action==='craft'||action==='linked')return false;
    const cost=d.spCosts?.[l-1]??d.spCost;
    if(!ctx.useSp(cost))return false;
    const castTime=action==='falcon'||action==='repel'?1.5:0;
    S.hunterCastReady=S.t+Math.max(.35,castTime);
    S.cooldowns[d.id]=S.t+(d.runtime.delay==='aspd'?S.rate:d.cooldown)+castTime;
    S.metrics.casts[d.id]=(S.metrics.casts[d.id]||0)+1;
    ctx.skillCast(d.name);
    if(castTime)S.pendingHunterCast={skillId:d.id,targetId:target.id,finishesAt:S.t+castTime};
    else resolve(ctx,d,target);
    return true;
  }
  function update(ctx,dt){
    const {state:S,player:P,stats}=ctx;
    if(S.pendingHunterCast?.finishesAt<=S.t){const c=S.pendingHunterCast;S.pendingHunterCast=null;resolve(ctx,ctx.byId[c.skillId],ctx.enemies().find(e=>e.id===c.targetId));}
    for(const t of [...S.traps]){
      if(t.expiresAt<=S.t){S.traps.splice(S.traps.indexOf(t),1);continue;}
      if(t.armedAt>S.t)continue;
      const target=ctx.enemies().find(e=>!e.dead&&distance(e,t)<=25+e.r);if(!target)continue;
      S.traps.splice(S.traps.indexOf(t),1);
      const q=stats(),l=t.level,id=t.skillId;
      const radius=['claymore_trap','sandman','flasher'].includes(id)?80:48;
      const victims=id==='land_mine'||id==='ankle_snare'||id==='skid_trap'?[target]:ctx.enemies().filter(e=>!e.dead&&distance(e,t)<=radius+e.r);
      for(const e of victims){
        if(id==='land_mine'||id==='blast_mine'||id==='claymore_trap'){
          const base=id==='blast_mine'?50+Math.floor(q.dex/2):id==='claymore_trap'?75+Math.floor(q.dex/2):75+q.dex;
          ctx.hit(e,l*base*(1+q.int/100)*(id==='land_mine'?1:victims.length),false,id,{ignoreDef:true,element:{land_mine:'earth',blast_mine:'wind',claymore_trap:'fire'}[id]});
          if(id==='land_mine'&&!e.boss&&Math.random()<.2*l)e.stunnedUntil=S.t+2;
        }else if(id==='freezing_trap'){
          ctx.hit(e,S.atk,false,id,{element:'water'});
          if(!e.boss){e.stunnedUntil=S.t+3*l;e.frozen=true;}
        }else if(id==='ankle_snare')e.rootedUntil=S.t+4*l/(e.boss?5:1);
        else if(id==='sandman'&&!e.boss){e.sleeping=true;e.stunnedUntil=S.t+5+2*l;}
        else if(id==='flasher'&&!e.boss)e.blindedUntil=S.t+5+2*l;
        else if(id==='shockwave_trap')e.sp=Math.max(0,(e.sp||0)*(1-.1*l));
        else if(id==='skid_trap'&&!e.boss){const a=Math.atan2(e.y-P.y,e.x-P.x);e.x+=Math.cos(a)*(5+l)*16;e.y+=Math.sin(a)*(5+l)*16;}
      }
      if(id==='talkie_box')ctx.say('Talkie Box: Hunter был здесь');
      ctx.burst(t.x,t.y,id==='freezing_trap'?'#9edfff':'#ffd075',12);
    }
    for(const f of S.falconFlights)f.life-=dt;
    S.falconFlights=S.falconFlights.filter(f=>f.life>0);
  }
  root.RSHunter={arrow,impact,cast,update,falcon};
})(typeof window!=='undefined'?window:globalThis);
