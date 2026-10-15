// Classic class graph. Only reviewed playable branches are enabled.
window.RS_CLASS_CATALOG = [];
const classicRows = [
  ['swordman','Swordman','knight','Knight','crusader','Crusader','lord_knight','Lord Knight','paladin','Paladin'],
  ['mage','Mage','wizard','Wizard','sage','Sage','high_wizard','High Wizard','scholar','Scholar'],
  ['archer','Archer','hunter','Hunter','bard','Bard','sniper','Sniper','minstrel','Minstrel'],
  ['archer','Archer','dancer','Dancer',null,null,'gypsy','Gypsy',null,null],
  ['merchant','Merchant','blacksmith','Blacksmith','alchemist','Alchemist','mastersmith','Mastersmith','biochemist','Biochemist'],
  ['thief','Thief','assassin','Assassin','rogue','Rogue','assassin_cross','Assassin Cross','stalker','Stalker'],
  ['acolyte','Acolyte','priest','Priest','monk','Monk','high_priest','High Priest','champion','Champion'],
];
for(const row of classicRows){
  for(const offset of [2,4,6,8]){
    const id=row[offset];if(!id)continue;
    const transcendent=offset>=6;
    const path=transcendent?['high_novice','high_'+row[0],id]:['novice',row[0],id];
    window.RS_CLASS_CATALOG.push({id,name:row[offset+1],group:transcendent?'transcendent':'normal',jobPath:path,
      characterId:id==='knight'?'knight_male':id==='hunter'?'hunter_male':null,
      enabled:['knight','hunter'].includes(id),source:'https://irowiki.org/classic/Classes'});
  }
}
for(const [id,name,path] of [
  ['super_novice','Super Novice',['novice','super_novice']],['ninja','Ninja',['novice','ninja']],
  ['gunslinger','Gunslinger',['novice','gunslinger']],['taekwon','TaeKwon Kid',['novice','taekwon']],
  ['taekwon_master','TaeKwon Master',['novice','taekwon','taekwon_master']],['soul_linker','Soul Linker',['novice','taekwon','soul_linker']],
])window.RS_CLASS_CATALOG.push({id,name,group:'expanded',jobPath:path,enabled:false,characterId:null,source:'https://irowiki.org/classic/Classes'});

Object.assign(window.RS_CHARACTERS.knight_male,{
  jobPath:['novice','swordman','knight'],buildId:'hybrid_knight',
  combatProfiles:{novice:{kind:'melee',primaryStat:'str',range:92},swordman:{kind:'melee',primaryStat:'str',range:92},knight:{kind:'melee',primaryStat:'str',range:92}},
});
window.RS_JOBS.archer={id:'archer',name:'Archer',displayName:'Archer',parentId:'novice',jobLevelMax:50,hpJobA:.5,hpJobB:5,spPerLevel:1,statBonuses:{str:3,agi:3,vit:1,int:2,dex:7,luk:2},sourceRefs:['classic_archer'],nextJobId:'hunter'};
window.RS_JOBS.hunter={id:'hunter',name:'Hunter',displayName:'Hunter',parentId:'archer',jobLevelMax:50,hpJobA:.85,hpJobB:5,spPerLevel:2,statBonuses:{str:4,agi:6,vit:2,int:4,dex:10,luk:4},sourceRefs:['classic_hunter'],nextJobId:null};
window.RS_EXPERIENCE.jobs.Archer=window.RS_EXPERIENCE.jobs.Swordman.slice();
window.RS_EXPERIENCE.jobs.Hunter=window.RS_EXPERIENCE.jobs.Knight.slice();
window.RS_BUILDS.dex_agi_hunter={id:'dex_agi_hunter',name:'DEX/AGI Hunter',sourceRefs:['classic_hunter'],target:{str:1,agi:95,vit:15,int:20,dex:99,luk:25},allocation:'deficit-weighted'};
window.RS_EQUIPMENT.profiles.hunter_auto_gear={id:'hunter_auto_gear',milestones:window.RS_EQUIPMENT.profiles.knight_auto_gear.milestones.map(r=>({...r,weaponAtk:Math.round(r.weaponAtk*.85),defense:Math.round(r.defense*.6),name:r.level<70?r.name:'Лук и лёгкая броня'}))};
window.RS_CHARACTERS.hunter_male={id:'hunter_male',name:'Hunter',gender:'male',playable:true,sourceRefs:['classic_archer','classic_hunter'],startingJobId:'novice',jobPath:['novice','archer','hunter'],buildId:'dex_agi_hunter',buildIds:['dex_agi_hunter'],equipmentProfileId:'hunter_auto_gear',baseStats:{str:1,agi:1,vit:1,int:1,dex:1,luk:1},
  combatProfiles:{novice:{kind:'melee',primaryStat:'str',range:92},archer:{kind:'bow',primaryStat:'dex',range:240,projectileSpeed:620},hunter:{kind:'bow',primaryStat:'dex',range:280,projectileSpeed:680}},
  visuals:{archer:{spriteUrl:'assets/irowiki/characters/archer-male.png',renderHeight:86,facing:'right',sourceRect:{x:13,y:12,width:37,height:92}},hunter:{spriteUrl:'assets/irowiki/characters/hunter-male.png',renderHeight:86,facing:'right',sourceRect:{x:12,y:10,width:36,height:95}}},
  evolution:[{jobId:'novice',order:1},{jobId:'archer',order:2},{jobId:'hunter',order:3}],
};
for(const [id,title] of [['classic_classes','Classes'],['classic_archer','Archer'],['classic_hunter','Hunter']]){
 window.RS_SOURCES.records[id]={id,type:'job',authority:'reference',title:'iRO Wiki Classic — '+title,url:'https://irowiki.org/classic/'+title};
}
