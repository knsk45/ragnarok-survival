// Survivor endgame: multiplicative progression and bounded class reactions.
(function(root){
 'use strict';
 const definitions=[
  {id:'damage',name:'Разрушение',description:'Весь урон ×1,25. Множители перемножаются.'},
  {id:'health',name:'Живучесть',description:'Максимальный HP ×1,20. Прибавка здоровья восстанавливается.'},
  {id:'attack',name:'Стремительность',description:'Интервал базовой атаки ×0,90. Избыток скорости усиливает удары.'},
  {id:'cooldown',name:'Поток навыков',description:'Перезарядки и подготовка заклинаний ×0,90.'},
  {id:'area',name:'Масштаб',description:'Радиусы атак, взрывов и зон ×1,15.'},
  {id:'fury',name:'Неистовство',description:'+1 снаряд или повтор удара. Избыток повторов усиливает попадание.'},
  {id:'defense',name:'Стальная кожа',description:'Получаемый урон ×0,88. Защита усиливается с каждым пробуждением.'},
 ];
 const classes={Knight:'Волны меча и цепные взрывы Bowling Bash',Hunter:'Веер пробивающих стрел и сокол по площади',Wizard:'Эхо заклинаний и распространяющиеся взрывы',Assassin:'Ядовитые взрывы критов и цепные добивания'};
 const fresh=()=>({paceVersion:2,active:false,level:0,earned:0,xp:0,pending:0,stacks:{},offer:[],reactions:[],nextWave:0,nextCrit:0});
 function state(S){return S.awakening??(S.awakening=fresh());}
 const eligible=S=>S.lvl>=99&&S.job>=50&&!!classes[S.stage];
 const power=(base,n)=>Math.min(1e12,Math.pow(base,Math.min(1000,Math.max(0,n||0))));
 function factors(S){const s=state(S).stacks;return {damage:power(1.25,s.damage),health:power(1.2,s.health),attack:1/power(1/.9,s.attack),cooldown:1/power(1/.9,s.cooldown),area:power(1.15,s.area),defense:1/power(1/.88,s.defense),fury:s.fury||0};}
 const tier=S=>Math.floor(state(S).level/5);
 const area=S=>Math.min(5,factors(S).area);
 const areaOverflow=S=>Math.max(1,factors(S).area/5);
 const need=S=>3*Math.round(60000*power(1.1,state(S).earned));
 function sync(S){const a=state(S);if(!a.active&&eligible(S)){a.active=true;a.pending++;return true;}return false;}
 function award(S,amount){const a=state(S);if(!a.active||!eligible(S))return 0;a.xp+=Math.max(0,amount||0);let n=0;while(a.xp>=need(S)&&n<200){a.xp-=need(S);a.earned++;a.pending++;n++;}return n;}
 function offer(S,random=Math.random){const a=state(S);if(!a.pending)return [];if(a.offer.length!==3){const pool=[...definitions];a.offer=[];while(a.offer.length<3)a.offer.push(pool.splice(Math.floor(random()*pool.length),1)[0].id);}return a.offer.map(id=>definitions.find(d=>d.id===id));}
 function choose(S,id){const a=state(S);if(!a.pending||!a.offer.includes(id))return false;a.stacks[id]=(a.stacks[id]||0)+1;a.level++;a.pending--;a.offer=[];return true;}
 function autoChoose(S,random=Math.random){
  const a=state(S);let count=0;
  while(a.pending>0&&count<200){const d=definitions[Math.min(definitions.length-1,Math.floor(random()*definitions.length))];a.offer=[d.id];choose(S,d.id);a.lastUpgrade=d.id;count++;}
  a.offer=[];return count;
 }
 function migrate(saved){const a={...fresh(),...saved};if(saved&&saved.paceVersion!==2)a.xp=Math.max(0,a.xp||0)*3;a.paceVersion=2;a.offer=[];return a;}
 function delay(S,seconds){return Math.max(.08,seconds*factors(S).cooldown);}
 function wave(S){const phase=S.t<420?0:S.t<780?1:S.t<1020?2:3;return {phase,cap:[60,90,140,200][phase],batch:[1,2,4,7][phase],interval:[.72,.48,.30,.18][phase],regular:phase<2?3:Math.min(120,40+tier(S)*4)};}
 function enqueue(S,event){const a=state(S);if(a.reactions.length<128)a.reactions.push(event);else a.reactions[a.reactions.length-1].raw+=event.raw;}
 function targets(ctx,p,r){return ctx.enemies().filter(e=>!e.dead&&Math.hypot(e.x-p.x,e.y-p.y)<=r+e.r&&(!ctx.lineOfSight||ctx.lineOfSight(p,e)));}
 function ring(ctx,p,r,col){ctx.burst(p.x,p.y,col==='poison'?'#a5e478':'#c8b1ff',10);ctx.state.classVisuals.push({id:'awakening',x:p.x,y:p.y,r,element:col==='poison'?'poison':'ghost',started:ctx.state.t,expires:ctx.state.t+.3});if(ctx.state.classVisuals.length>60)ctx.state.classVisuals.shift();}
 function afterHit(ctx,e,raw,crit,id,options,killed){
  const S=ctx.state,a=state(S),rank=tier(S),f=factors(S);if(!a.active)return;
  const depth=options.awakeningDepth||0,base=id==='basic'||id==='double_attack'||id==='arcane_spark';
  if(killed&&rank&&depth<3&&((S.stage==='Knight'&&['bowling_bash','awakening_wave','awakening_blast'].includes(id))||(S.stage==='Wizard'&&(options.magical||id==='awakening_blast'))))enqueue(S,{x:e.x,y:e.y,raw:raw*.65,magical:S.stage==='Wizard',depth:depth+1,rank});
  if(options.awakeningProc)return;
  if(f.fury&&!e.dead&&((S.stage!=='Hunter'&&(base||ctx.byId[id]))||(S.stage==='Hunter'&&!options.awakeningProjectile&&ctx.byId[id])))ctx.hit(e,raw*f.fury,false,'awakening_repeat',{...options,awakeningProc:true});
  if(S.stage==='Knight'&&rank&&base&&a.nextWave<=S.t){
   a.nextWave=S.t+.1;const P=ctx.player,angle=Math.atan2(e.y-P.y,e.x-P.x),r=(180+30*Math.min(6,rank))*area(S);
   for(const v of targets(ctx,P,r)){const dx=v.x-P.x,dy=v.y-P.y,along=dx*Math.cos(angle)+dy*Math.sin(angle),side=Math.abs(-dx*Math.sin(angle)+dy*Math.cos(angle));if(along>=0&&side<55*area(S))ctx.hit(v,raw*.6*rank,false,'awakening_wave',{awakeningProc:true});}ring(ctx,e,70*area(S),'ghost');
  }
  if(S.stage==='Assassin'&&rank&&crit&&a.nextCrit<=S.t){
   a.nextCrit=S.t+.1;const victims=targets(ctx,e,90*area(S));
   for(const v of victims){root.RSAdventurers.poison(ctx,v,Math.min(10,rank+3));ctx.hit(v,raw*.6*rank,false,'awakening_poison',{awakeningProc:true,element:'poison'});}
   for(const v of targets(ctx,e,130*area(S)).slice(0,12))if(!v.boss&&v.hp<=v.max*Math.min(.35,.08+.025*rank))ctx.hit(v,v.hp+v.max,false,'awakening_execute',{awakeningProc:true,ignoreDef:true});ring(ctx,e,90*area(S),'poison');
  }
 }
 function update(ctx){const S=ctx.state,a=state(S);let n=0;while(a.reactions.length&&n++<12){const b=a.reactions.shift();for(const e of targets(ctx,b,95*area(S)))ctx.hit(e,b.raw,false,'awakening_blast',{magical:b.magical,awakeningProc:true,awakeningDepth:b.depth});ring(ctx,b,95*area(S),'ghost');}}
 function compact(gems){if(gems.length<700)return gems;const out=[],groups=new Map();for(const g of gems){if(!['baseExp','jobExp'].includes(g.kind)){out.push(g);continue;}const key=g.kind+':'+Math.floor(g.x/120)+':'+Math.floor(g.y/120);if(groups.has(key)){const old=groups.get(key);old.amount+=g.amount;old.life=Math.max(old.life,g.life);}else{groups.set(key,g);out.push(g);}}return out;}
 root.RSAwakening={definitions,classes,fresh,state,eligible,sync,award,need,offer,choose,autoChoose,migrate,factors,tier,area,areaOverflow,delay,wave,afterHit,update,compact};
})(typeof window!=='undefined'?window:globalThis);
