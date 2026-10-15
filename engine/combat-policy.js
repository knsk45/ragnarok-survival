(function(root){
 const defensive=d=>['heal','playDead','buff','wall','coat','sightBlast','hide','cloak','slide','detox','react','enchant','concentration'].includes(d.runtime.action||d.runtime.kind);
 function cost(d,l){return d.spCosts?.[Math.max(0,l-1)]??d.spCost;}
 function reason(ctx,d){
  const S=ctx.state,a=d.runtime.action,l=S[d.stateKey]||0;
  if(!l)return 'Не изучен';if(S.skillEnabled[d.id]===false)return 'Выключен';
  if(d.implemented===false)return 'Пока недоступен';
  if(['sonic','grim'].includes(a)&&S.weaponStyle==='dual')return 'Нужен катар';
  if(a==='grim'&&!root.RSAdventurers.hidden(ctx))return 'Нужна скрытность';
  const effect={concentration:'concentration',coat:'energyCoat',enchant:'enchantPoison',react:'poisonReact',wall:'safetyWall',sightBlast:'sightBlaster'}[a];
  if(effect&&S.effects[effect]?.expires>S.t&&(effect!=='safetyWall'||S.effects[effect].charges>0))return 'Эффект активен';
  if(a==='detox'&&!(S.poisonedUntil>S.t))return 'Нет отравления';
  if(a==='waterBall')return 'Нужен водоём';
  if(a==='stoneSupply')return 'Расходники отключены';
  if((S.cooldowns[d.id]||0)>S.t)return Math.ceil(S.cooldowns[d.id]-S.t)+' сек.';
  if(S.pendingClassCast?.id===d.id||S.pendingHunterCast?.skillId===d.id)return 'Применяется';
  if(d.runtime.kind==='adventurer'&&S.pendingClassCast)return 'Ожидает окончания каста';
  if(!S.debugInfiniteSp&&S.sp<cost(d,l))return 'Нет SP';
  if(!S.debugInfiniteSp&&!defensive(d)){
   const reserve=S.spMax*(S.tactics?.reserve||0);
   if(S.sp-cost(d,l)<reserve)return 'Резерв SP';
  }
  const target=ctx.nearest(d.runtime.range||S.attackRange||92);
  if(!target&&['adventurer','hunter'].includes(d.runtime.kind))return 'Нет цели';
  if(!target&&!defensive(d))return 'Нет цели';
  if(target&&d.element&&root.RSCore.elementMultiplier(d.element,root.RSAdventurers.classification(ctx,target))<=0&&!ctx.enemies().some(e=>!e.dead&&Math.hypot(e.x-ctx.player.x,e.y-ctx.player.y)<=(d.runtime.range||320)+e.r&&root.RSCore.elementMultiplier(d.element,root.RSAdventurers.classification(ctx,e))>0))return 'Иммунитет стихии';
  if(['hide','cloak'].includes(a)&&root.RSAdventurers.hidden(ctx))return 'Скрытность активна';
  if(a==='hide'&&S.hp>S.max*.65||a==='cloak'&&S.hp>S.max*.8||a==='slide'&&S.hp>S.max*.7)return 'Нет угрозы здоровью';
  if(target&&a==='stone'&&target.boss)return 'Босс невосприимчив';
  if(target&&d.runtime.kind==='hunter'&&['land_mine','blast_mine','claymore_trap','freezing_trap'].includes(d.id)){
   const element={land_mine:'earth',blast_mine:'wind',claymore_trap:'fire',freezing_trap:'water'}[d.id];
   if(root.RSCore.elementMultiplier(element,root.RSAdventurers.classification(ctx,target))<=0)return 'Иммунитет стихии';
  }
  if(target&&['envenom','sonic','sand'].includes(a)&&Math.hypot(target.x-ctx.player.x,target.y-ctx.player.y)>100)return 'Слишком далеко';
  return '';
 }
 function priority(S,d){
  let rank=d.runtime.priority??10;
  if(S.tactics?.mode==='control'&&['field','stone','ice','trap'].includes(d.runtime.action))rank-=5;
  if(S.tactics?.mode==='economy')rank+=cost(d,S[d.stateKey]||1)/20;
  return rank;
 }
 function next(S,defs,available){
  const preset=root.RS_PRESETS[S.buildPreset],byId=Object.fromEntries(defs.map(d=>[d.id,d]));
  function dependency(id,seen=new Set()){
   const d=byId[id];if(!d||seen.has(id)||d.spendable===false||d.implemented===false)return null;seen.add(id);
   if(available(id))return d;
   for(const r of d.requires)if((S[byId[r.skillId]?.stateKey]||0)<r.level){const found=dependency(r.skillId,seen);if(found)return found;}
   return null;
  }
  for(const id of preset?.skills||[]){const found=dependency(id);if(found)return found;}
  return defs.find(d=>available(d.id))||null;
 }
 root.RSCombatPolicy={cost,reason,priority,next,defensive};
})(typeof window!=='undefined'?window:globalThis);
