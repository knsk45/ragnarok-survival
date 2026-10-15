// UI presentation and run summaries are kept outside the simulation.
(function(root){
 const time=t=>Math.floor(t/60).toString().padStart(2,'0')+':'+Math.floor(t%60).toString().padStart(2,'0');
 function statuses(S){
  const rows=[];
  for(const [id,label]of [['hiding','Скрытность'],['cloaking','Cloaking'],['energyCoat','Energy Coat'],['enchantPoison','Яд на оружии'],['poisonReact','Poison React'],['concentration','Concentration'],['sightBlaster','Sight Blaster']]){
   const e=S.effects[id];if(e?.expires>S.t)rows.push(label+' · '+Math.ceil(e.expires-S.t)+' с');
  }
  const wall=S.effects.safetyWall;if(wall?.expires>S.t&&wall.charges>0)rows.push('Safety Wall · '+wall.charges+' блоков · '+Math.ceil(wall.expires-S.t)+' с');
  if(S.poisonedUntil>S.t)rows.push('Отравление · '+Math.ceil(S.poisonedUntil-S.t)+' с');
  return rows;
 }
 function preview(d,current,S){
  const next=Math.min(d.maxLevel,current+1),sp=root.RSCombatPolicy.cost(d,next),cast=d.runtime.kind==='adventurer'?root.RSAdventurers.castTime(d,next,0):0;
  let result='Lv '+current+' → '+next+' · SP '+sp;
  if(['fire_bolt','cold_bolt','lightning_bolt','earth_spike'].includes(d.id))result+=' · '+next+'× MATK';
  if(d.id==='double_attack')result+=' · '+5*next+'% двойного удара';
  if(d.id==='improve_dodge')result+=' · +'+next*(S.stage==='Assassin'?4:3)+' FLEE';
  if(d.id==='sonic_blow')result+=' · '+(300+50*next)+'% ATK';
  if(d.id==='safety_wall')result+=' · '+(2+next)+' блоков';
  if(d.id==='owls_eye')result+=' · +'+next+' DEX';
  if(cast)result+=' · базовый каст '+cast.toFixed(2)+' с до DEX';
  return result;
 }
 function summary(S,defs){
  const names=Object.fromEntries(defs.map(d=>[d.id,d.name]));names.arcane_spark='Магическая искра';names.poison_tick='Периодический яд';names.basic='Обычная атака';
  return {time:time(S.t),character:S.stage,level:S.lvl,kills:S.kills,bosses:[...S.bossesDefeated],evolution:S.metrics.evolution||[],cause:S.metrics.lastHit||null,debug:!!(S.metrics.assisted||S.debugInfiniteHp||S.debugInfiniteSp),damage:Object.entries(S.metrics.damage).sort((a,b)=>b[1]-a[1]).map(([id,value])=>({name:names[id]||id,value:Math.round(value)}))};
 }
 function renderEnd(box,report,db){
  box.replaceChildren();const doc=box.ownerDocument;
  const add=(tag,text)=>{const e=doc.createElement(tag);e.textContent=text;box.append(e);return e;};
  add('p','Время '+report.time+' · '+report.character+' B'+report.level+' · Побед '+report.kills);
  if(report.debug)add('p','Тренировочный забег: использованы отладочные настройки');
  add('p','Побеждённые боссы: '+(report.bosses.map(k=>db.monsters[k]?.name||k).join(', ')||'нет'));
  if(report.cause)add('p','Последний удар: '+report.cause.name+' · '+report.cause.amount+' HP · '+(report.cause.attack||'контактная атака'));
  add('p','Эволюция: '+(report.evolution.map(e=>e.stage+' в '+time(e.time)).join(' → ')||'не было'));
  add('h3','Урон навыков');const total=report.damage.reduce((n,d)=>n+d.value,0);
  for(const d of report.damage)add('div',d.name+': '+d.value.toLocaleString('ru-RU')+' ('+(total?Math.round(d.value*100/total):0)+'%)');
 }
 function effectBadges(ctx,x,screen){
  for(const e of ctx.enemies()){
   const labels=[];if(e.poison?.expires>ctx.state.t)labels.push('ЯД');if(e.frozen)labels.push('ЛЁД');if(e.stonedUntil>ctx.state.t)labels.push('КАМЕНЬ');if(e.rootedUntil>ctx.state.t)labels.push('КОРНИ');if(e.blindedUntil>ctx.state.t)labels.push('СЛЕПОТА');
   if(!labels.length)continue;const p=screen(e.x,e.y);x.save();x.font='bold 10px Arial';x.textAlign='center';x.fillStyle='#fff';x.strokeStyle='#18222c';x.lineWidth=3;const label=labels.join(' · ');x.strokeText(label,p.x,p.y-e.r*2.8-10);x.fillText(label,p.x,p.y-e.r*2.8-10);x.restore();
  }
 }
 root.RSInsights={statuses,preview,summary,renderEnd,effectBadges};
})(typeof window!=='undefined'?window:globalThis);
