// Classic trees with explicitly Survivor-adapted targeting, pacing and equipment.
(function(){
 const W=window;
 const jobRows=[
  ['mage','Mage','novice','wizard',.3,3,{str:0,agi:4,vit:0,int:8,dex:3,luk:3}],
  ['wizard','Wizard','mage',null,.55,5,{str:1,agi:8,vit:1,int:12,dex:6,luk:2}],
  ['thief','Thief','novice','assassin',.5,1,{str:4,agi:4,vit:2,int:1,dex:4,luk:3}],
  ['assassin','Assassin','thief',null,1.1,2,{str:6,agi:10,vit:2,int:4,dex:8,luk:0}],
 ];
 for(const [id,name,parentId,nextJobId,hpJobA,spPerLevel,statBonuses]of jobRows){
  W.RS_SOURCES.records['classic_'+id]={id:'classic_'+id,type:'job',authority:'reference',title:name,url:'https://irowiki.org/classic/'+name};
  W.RS_JOBS[id]={id,name,displayName:name,parentId,nextJobId,jobLevelMax:50,hpJobA,hpJobB:5,spPerLevel,statBonuses,sourceRefs:['classic_'+id]};
  W.RS_EXPERIENCE.jobs[name]=W.RS_EXPERIENCE.jobs[['mage','thief'].includes(id)?'Swordman':'Knight'].slice();
 }
 for(const [id,name,target]of [
  ['int_dex_wizard','INT/DEX Wizard',{str:1,agi:9,vit:35,int:99,dex:90,luk:9}],
  ['agi_crit_assassin','AGI/STR/LUK Assassin',{str:80,agi:90,vit:25,int:10,dex:45,luk:60}],
 ])W.RS_BUILDS[id]={id,name,target,allocation:'deficit-weighted',sourceRefs:['classic_'+(id.includes('wizard')?'wizard':'assassin')]};
 for(const [id,first,build,atk,def,hint]of [
  ['wizard','mage','int_dex_wizard',.85,.45,'Стихийная магия и контроль · авто-билд INT/DEX'],
  ['assassin','thief','agi_crit_assassin',.8,.6,'Катары или два кинжала, яды · авто-билд AGI/STR/LUK'],
 ]){
  const gear=id+'_auto_gear';
  W.RS_EQUIPMENT.profiles[gear]={id:gear,milestones:W.RS_EQUIPMENT.profiles.knight_auto_gear.milestones.map(r=>({...r,weaponAtk:Math.round(r.weaponAtk*atk),defense:Math.round(r.defense*def),name:r.level<70?r.name:id==='wizard'?'Посох и мантия':'Оружие Assassin и лёгкая броня'}))};
  const frames={mage:{x:10,y:12,width:39,height:92},wizard:{x:11,y:13,width:40,height:92},thief:{x:13,y:12,width:35,height:92},assassin:{x:10,y:10,width:39,height:95}};
  const visuals={};for(const j of [first,id])visuals[j]={spriteUrl:'assets/irowiki/characters/'+j+'-male.png',renderHeight:86,facing:'right',sourceRect:frames[j]};
  W.RS_CHARACTERS[id+'_male']={id:id+'_male',name:W.RS_JOBS[id].name,gender:'male',playable:true,hint,sourceRefs:['classic_'+first,'classic_'+id],startingJobId:'novice',jobPath:['novice',first,id],buildId:build,buildIds:[build],equipmentProfileId:gear,baseStats:{str:1,agi:1,vit:1,int:1,dex:1,luk:1},visuals,
   combatProfiles:{novice:{kind:'melee',primaryStat:'str',range:92},[first]:{kind:id==='wizard'?'magic':'dagger',primaryStat:id==='wizard'?'int':'str',range:id==='wizard'?280:92},[id]:{kind:id==='wizard'?'magic':'assassin',primaryStat:id==='wizard'?'int':'str',range:id==='wizard'?320:92}},evolution:['novice',first,id].map((jobId,i)=>({jobId,order:i+1}))};
  const entry=W.RS_CLASS_CATALOG.find(c=>c.id===id);entry.enabled=true;entry.characterId=id+'_male';
 }
 const rows=[];
 function add(job,id,name,max,sp,cd,requires,action,description,extra={}){
  const source='https://irowiki.org/classic/'+name.replaceAll(' ','_'),ref='classic_skill_'+id;
  W.RS_SOURCES.records[ref]={id:ref,type:'skill',authority:'reference',title:name,url:source};
  rows.push({id,name,jobId:job,maxLevel:max,stateKey:id,spCost:sp,cooldown:cd,requires:requires.map(([skillId,level])=>({skillId,level})),spendable:!extra.quest,type:action==='passive'?'passive':'active',runtime:{kind:'adventurer',action,priority:extra.priority??8,range:extra.range??320,...extra.runtime},description,implemented:extra.implemented!==false,icon:job==='mage'||job==='wizard'?'✦':'⚔',iconUrl:'assets/irowiki/skills/'+id+'.png',source,sourceRefs:[ref],...extra});
 }
 const mage=(...a)=>add('mage',...a),wiz=(...a)=>add('wizard',...a),thief=(...a)=>add('thief',...a),sin=(...a)=>add('assassin',...a);
 mage('increase_sp_recovery','Increase SP Recovery',10,0,0,[],'passive','Усиливает восстановление SP; в Survivor работает и в движении.');
 mage('napalm_beat','Napalm Beat',10,9,1,[],'spell','Призрачный взрыв вокруг цели.',{element:'ghost'});
 mage('soul_strike','Soul Strike',10,18,1,[['napalm_beat',4]],'spell','До пяти призрачных попаданий; сильнее против нежити.',{element:'ghost'});
 mage('safety_wall','Safety Wall',10,30,8,[['napalm_beat',7],['soul_strike',5]],'wall','Создаёт неподвижную защиту с ограниченным числом блоков ближних атак.',{priority:2});
 mage('sight','Sight',1,10,8,[],'sight','Раскрывает скрытые цели рядом с персонажем.');
 mage('fire_bolt','Fire Bolt',10,12,1,[],'spell','До десяти огненных попаданий по цели.',{element:'fire'});
 mage('cold_bolt','Cold Bolt',10,12,1,[],'spell','До десяти водных попаданий по цели.',{element:'water'});
 mage('lightning_bolt','Lightning Bolt',10,12,1,[],'spell','До десяти ветряных попаданий по цели.',{element:'wind'});
 mage('fire_ball','Fire Ball',10,25,1,[['fire_bolt',4]],'spell','Огненный взрыв по группе монстров.',{element:'fire'});
 mage('fire_wall','Fire Wall',10,40,5,[['sight',1],['fire_ball',5]],'field','Огненная преграда наносит повторный урон и отталкивает.',{element:'fire'});
 mage('frost_diver','Frost Diver',10,25,2,[['cold_bolt',5]],'spell','Водная атака с шансом заморозки обычной цели.',{element:'water'});
 mage('thunderstorm','Thunderstorm',10,29,3,[['lightning_bolt',4]],'field','Ветряные удары по области.',{element:'wind'});
 mage('stone_curse','Stone Curse',10,25,7,[],'stone','Окаменение обычной цели. Боссы невосприимчивы.');
 mage('energy_coat','Energy Coat',1,30,15,[],'coat','Снижает входящий физический урон, расходуя SP.',{quest:true,priority:1});
 wiz('earth_spike','Earth Spike',5,12,1,[['stone_curse',1]],'spell','До пяти земляных попаданий.',{element:'earth'});
 wiz('heavens_drive',"Heaven's Drive",5,28,2,[['earth_spike',3]],'spell','Земляная атака по площади.',{element:'earth',iconUrl:'assets/irowiki/skills/heavens_drive.png'});
 wiz('jupitel_thunder','Jupitel Thunder',10,20,2,[['napalm_beat',1],['lightning_bolt',1]],'spell','Молния с несколькими попаданиями и отбрасыванием.',{element:'wind'});
 wiz('storm_gust','Storm Gust',10,78,5,[['frost_diver',1],['jupitel_thunder',3]],'field','Метель: повторный водный урон и заморозка обычных монстров.',{element:'water',priority:5});
 wiz('meteor_storm','Meteor Storm',10,60,5,[['sightrasher',2],['thunderstorm',1]],'field','Метеоритная зона: огненные удары и шанс оглушения.',{element:'fire',priority:5});
 wiz('lord_of_vermilion','Lord of Vermilion',10,60,5,[['jupitel_thunder',5],['thunderstorm',1]],'field','Серия ветряных взрывов в большой области.',{element:'wind',priority:5});
 wiz('quagmire','Quagmire',5,5,7,[['heavens_drive',1]],'field','Болото замедляет и снижает AGI/DEX; слабее против боссов.',{element:'earth',priority:3});
 wiz('frost_nova','Frost Nova',10,45,4,[['frost_diver',1],['ice_wall',1]],'spell','Ледяной взрыв вокруг мага с шансом заморозки.',{element:'water',range:140});
 wiz('ice_wall','Ice Wall',10,20,8,[['stone_curse',1],['frost_diver',1]],'ice','Неподвижная ледяная преграда задерживает обычных монстров.',{priority:3});
 wiz('fire_pillar','Fire Pillar',10,75,6,[['fire_wall',1]],'field','Огненная ловушка в области цели.',{element:'fire'});
 wiz('sightrasher','Sightrasher',10,35,4,[['sight',1],['lightning_bolt',1]],'spell','Огненное кольцо вокруг мага с отбрасыванием.',{element:'fire',range:150});
 wiz('sense','Sense',1,10,5,[],'sense','Показывает характеристики ближайшей цели.',{utility:true});
 wiz('water_ball','Water Ball',5,15,4,[['cold_bolt',1],['lightning_bolt',1]],'waterBall','Требует водоёма; на текущей сухой арене недоступен.',{element:'water',implemented:false});
 wiz('sight_blaster','Sight Blaster',1,40,10,[],'sightBlast','Огненная защита: следующий подошедший враг получает урон и отбрасывание.',{quest:true,priority:2});
 thief('double_attack','Double Attack',10,0,0,[],'passive','Кинжал: шанс двойного удара +5% за уровень.');
 thief('improve_dodge','Improve Dodge',10,0,0,[],'passive','Повышает FLEE; у Assassin также увеличивает скорость движения.');
 thief('steal','Steal',10,10,3,[],'steal','Одна попытка на обычного монстра: шанс украсть дополнительный Gift Box.',{utility:true});
 thief('hiding','Hiding',10,10,8,[['steal',5]],'hide','Короткое укрытие; насекомые, демоны и боссы видят персонажа.',{priority:3});
 thief('envenom','Envenom',10,12,1,[],'envenom','Удар ядом с добавочным уроном и шансом отравления.');
 thief('detoxify','Detoxify',1,10,1,[['envenom',3]],'detox','Снимает отравление персонажа.');
 thief('sand_attack','Sand Attack',1,9,3,[],'sand','Земляная атака и шанс ослепления.',{quest:true});
 thief('back_slide','Back Slide',1,7,6,[],'slide','Отступление от ближайшего врага при опасном сближении.',{quest:true,priority:0});
 thief('find_stone','Find Stone',1,2,3,[],'stoneSupply','Материалы не расходуются: поиск камней не требуется.',{quest:true,implemented:false});
 thief('stone_fling','Stone Fling',1,2,3,[],'fling','Бросок камня: 50 урона без DEF и шанс оглушения.',{quest:true,range:280});
 sin('righthand_mastery','Righthand Mastery',5,0,0,[],'passive','Восстанавливает урон правого кинжала до 100%.');
 sin('lefthand_mastery','Lefthand Mastery',5,0,0,[['righthand_mastery',2]],'passive','Восстанавливает урон левого кинжала до 80%.');
 sin('katar_mastery','Katar Mastery',10,0,0,[],'passive','Добавляет до 30 ATK при использовании катара.');
 sin('cloaking','Cloaking',10,15,10,[['hiding',2]],'cloak','Краткая скрытность в движении; атака раскрывает персонажа.',{priority:3});
 sin('sonic_blow','Sonic Blow',10,16,3,[['katar_mastery',4]],'sonic','Восемь ударов катаром, до 800% ATK, шанс оглушения.',{priority:5});
 sin('grimtooth','Grimtooth',5,3,1,[['cloaking',2],['sonic_blow',5]],'grim','Атака катаром из скрытности по группе врагов.',{priority:4,range:240});
 sin('enchant_poison','Enchant Poison',10,20,10,[['envenom',1]],'enchant','Временно придаёт оружию стихию яда.',{priority:1});
 sin('poison_react','Poison React',10,25,10,[['enchant_poison',3]],'react','При получении удара отвечает ядовитой контратакой.',{priority:2});
 sin('venom_dust','Venom Dust',10,20,6,[['enchant_poison',5]],'dust','Облако отравляет обычных монстров поблизости.');
 sin('venom_splasher','Venom Splasher',10,12,5,[['poison_react',5],['venom_dust',5]],'splasher','Отложенный взрыв по группе; срабатывает и при ранней смерти цели.',{priority:6});
 sin('sonic_acceleration','Sonic Acceleration',1,0,0,[],'passive','Повышает урон Sonic Blow на 10%.',{quest:true});
 sin('venom_knife','Venom Knife',1,15,3,[],'knife','Дальний ядовитый удар.',{quest:true,range:280});
 // Keep the displayed SP cost identical to the executor at every skill level.
 for(const d of rows){
  const formula={fire_bolt:l=>10+2*l,cold_bolt:l=>10+2*l,lightning_bolt:l=>10+2*l,earth_spike:l=>10+2*l,thunderstorm:l=>24+5*l,jupitel_thunder:l=>17+3*l,meteor_storm:l=>20+4*l,lord_of_vermilion:l=>56+4*l,sonic_blow:l=>14+2*l,poison_react:l=>l>=9?45:20+5*l,venom_splasher:l=>10+2*l,napalm_beat:l=>l===10?18:9+3*Math.floor((l-1)/3),stone_curse:l=>26-l,frost_diver:l=>26-l,frost_nova:l=>47-2*l,heavens_drive:l=>24+2*l,sightrasher:l=>33+2*l,soul_strike:l=>[18,14,24,20,30,26,36,32,42,38][l-1]}[d.id];
  if(formula)d.spCosts=Array.from({length:d.maxLevel},(_,i)=>formula(i+1));
 }
 W.RS_ADVENTURER_SKILLS=rows;W.RS_SKILLS.push(...rows);
})();
