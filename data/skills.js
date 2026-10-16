// Classic iRO skill tree. spendable skills consume one Job Skill Point per level.
// Quest and Soul Link skills are kept in the database for completeness but do not consume points.
window.RS_SKILLS = [
  // Novice: 9 spendable points at Job 10.
  { id: 'basic_skill', name: 'Basic Skill', icon: '◉', jobId: 'novice', maxLevel: 9, stateKey: 'basic', spendable: true, spCost: 0, cooldown: 0, requires: [], description: 'Базовый навык Novice.' },
  { id: 'first_aid', name: 'First Aid', icon: '✚', jobId: 'novice', maxLevel: 1, stateKey: 'firstAid', spendable: false, quest: true, spCost: 3, cooldown: 4, requires: [], description: 'Quest skill: восстанавливает HP.' },
  { id: 'play_dead', name: 'Play Dead', icon: '☠', jobId: 'novice', maxLevel: 1, stateKey: 'playDead', spendable: false, quest: true, spCost: 0, cooldown: 0, requires: [], description: 'Quest skill: притвориться мёртвым.' },

  // Swordman: 49 spendable points at Job 50.
  { id: 'bash', name: 'Bash', icon: '⚔', jobId: 'swordman', maxLevel: 10, stateKey: 'bash', spendable: true, spCost: 8, cooldown: 1.2, requires: [], description: 'Сильный удар по одной цели.' },
  { id: 'endure', name: 'Endure', icon: '🛡', jobId: 'swordman', maxLevel: 10, stateKey: 'endure', spendable: true, spCost: 10, cooldown: 8, requires: [{ skillId: 'provoke', level: 5 }], description: 'Сопротивление отбрасыванию и flinch.' },
  { id: 'increase_hp_recovery', name: 'Increase HP Recovery', icon: '♥', jobId: 'swordman', maxLevel: 10, stateKey: 'hpRecovery', spendable: true, spCost: 0, cooldown: 0, requires: [], description: 'Ускоряет восстановление HP.' },
  { id: 'magnum_break', name: 'Magnum Break', icon: '🔥', jobId: 'swordman', maxLevel: 10, stateKey: 'magnum', spendable: true, spCost: 15, cooldown: 2.4, requires: [{ skillId: 'bash', level: 5 }], description: 'Огненная круговая атака вокруг героя.' },
  { id: 'provoke', name: 'Provoke', icon: '↘', jobId: 'swordman', maxLevel: 10, stateKey: 'provoke', spendable: true, spCost: 4, cooldown: 2.5, requires: [], description: 'Ослабляет защиту цели и усиливает её ATK.' },
  { id: 'sword_mastery', name: 'Sword Mastery', icon: '⚔', jobId: 'swordman', maxLevel: 10, stateKey: 'swordMastery', spendable: true, spCost: 0, cooldown: 0, requires: [], description: 'Повышает ATK мечей и dagger.' },
  { id: 'twohanded_sword_mastery', name: 'Two-Handed Sword Mastery', icon: '⚔', jobId: 'swordman', maxLevel: 10, stateKey: 'twohandMastery', spendable: true, spCost: 0, cooldown: 0, requires: [{ skillId: 'sword_mastery', level: 1 }], description: 'Повышает ATK двуручного меча.' },
  { id: 'berserk', name: 'Berserk', icon: '☄', jobId: 'swordman', maxLevel: 1, stateKey: 'berserk', spendable: false, quest: true, jobLevelRequirement: 30, spCost: 0, cooldown: 0, requires: [], description: 'Quest skill: усиливает ATK при низком HP.' },
  { id: 'fatal_blow', name: 'Fatal Blow', icon: '✹', jobId: 'swordman', maxLevel: 1, stateKey: 'fatalBlow', spendable: false, quest: true, jobLevelRequirement: 30, spCost: 0, cooldown: 0, requires: [{ skillId: 'bash', level: 5 }], description: 'Quest skill: Bash получает шанс оглушения.' },
  { id: 'hp_recovery_while_moving', name: 'HP Recovery While Moving', icon: '♥', jobId: 'swordman', maxLevel: 1, stateKey: 'hpRecoveryMoving', spendable: false, quest: true, jobLevelRequirement: 35, spCost: 0, cooldown: 0, requires: [{ skillId: 'increase_hp_recovery', level: 1 }], description: 'Quest skill: восстановление HP во время движения.' },

  // Knight: 49 spendable points at Job 50; the full classic tree contains 76 levels.
  { id: 'counter_attack', name: 'Counter Attack', icon: '🛡', jobId: 'knight', maxLevel: 5, stateKey: 'counter', spendable: true, spCost: 3, cooldown: 4, requires: [{ skillId: 'twohanded_sword_mastery', level: 1 }], description: 'Блокирует атаку и отвечает критическим ударом.' },
  { id: 'bowling_bash', name: 'Bowling Bash', icon: '⚔', jobId: 'knight', maxLevel: 10, stateKey: 'bowling', spendable: true, spCost: 13, cooldown: 1, requires: [{ skillId: 'bash', level: 10 }, { skillId: 'magnum_break', level: 3 }, { skillId: 'twohanded_sword_mastery', level: 5 }, { skillId: 'twohand_quicken', level: 10 }, { skillId: 'counter_attack', level: 5 }], description: 'Удар по области 3×3 с отбрасыванием.' },
  { id: 'brandish_spear', name: 'Brandish Spear', icon: '➹', jobId: 'knight', maxLevel: 10, stateKey: 'brandish', spendable: true, spCost: 12, cooldown: 2, requires: [{ skillId: 'peco_peco_ride', level: 1 }, { skillId: 'spear_stab', level: 3 }], description: 'Фронтальная атака копьём по области.' },
  { id: 'cavalier_mastery', name: 'Cavalier Mastery', icon: '🐤', jobId: 'knight', maxLevel: 5, stateKey: 'cavalier', spendable: true, spCost: 0, cooldown: 0, requires: [{ skillId: 'peco_peco_ride', level: 1 }], description: 'Снижает штраф ASPD при езде на Peco Peco.' },
  { id: 'peco_peco_ride', name: 'Peco Peco Ride', icon: '🐤', jobId: 'knight', maxLevel: 1, stateKey: 'peco', spendable: true, spCost: 0, cooldown: 0, requires: [{ skillId: 'endure', level: 1 }], description: 'Позволяет ездить на Peco Peco.' },
  { id: 'pierce', name: 'Pierce', icon: '◈', jobId: 'knight', maxLevel: 10, stateKey: 'pierce', spendable: true, spCost: 7, cooldown: 1.2, requires: [{ skillId: 'spear_mastery', level: 1 }], description: 'Пронзающая атака с числом ударов по размеру цели.' },
  { id: 'spear_boomerang', name: 'Spear Boomerang', icon: '↗', jobId: 'knight', maxLevel: 5, stateKey: 'boomerang', spendable: true, spCost: 10, cooldown: 2, requires: [{ skillId: 'peco_peco_ride', level: 1 }, { skillId: 'spear_stab', level: 3 }], description: 'Бросок копья по дальней цели.' },
  { id: 'spear_mastery', name: 'Spear Mastery', icon: '⟡', jobId: 'knight', maxLevel: 10, stateKey: 'spearMastery', spendable: true, spCost: 0, cooldown: 0, requires: [], description: 'Повышает ATK копья.' },
  { id: 'spear_stab', name: 'Spear Stab', icon: '➹', jobId: 'knight', maxLevel: 10, stateKey: 'spearStab', spendable: true, spCost: 9, cooldown: 1.5, requires: [{ skillId: 'pierce', level: 5 }], description: 'Линейная атака копьём с отбрасыванием.' },
  { id: 'twohand_quicken', name: 'Twohand Quicken', icon: '⇈', jobId: 'knight', maxLevel: 10, stateKey: 'quicken', spendable: true, spCost: 14, cooldown: 8, requires: [{ skillId: 'twohanded_sword_mastery', level: 1 }], description: 'Снижает задержку атак на 30% на 30 × уровень секунд.' },
  { id: 'charge_attack', name: 'Charge Attack', icon: '⚡', jobId: 'knight', maxLevel: 1, stateKey: 'charge', spendable: false, quest: true, jobLevelRequirement: 40, spCost: 0, cooldown: 0, requires: [], description: 'Quest skill: дальняя атака-рывок.' },
  { id: 'one_hand_quicken', name: 'One-Hand Quicken', icon: '⇈', jobId: 'knight', maxLevel: 1, stateKey: 'oneHandQuicken', spendable: false, soulLink: true, spCost: 0, cooldown: 0, requires: [], description: 'Soul Link skill: ASPD одноручного меча.' }
];

// The skill records share the job-page source and, for the Knight tree,
// the legacy simulator that exposes exact prerequisites and max levels.
const SKILL_SOURCE_REFS = {
  novice: ['irowiki_novice'],
  swordman: ['irowiki_swordman'],
  knight: ['irowiki_knight', 'oldskillsim_knight']
};
window.RS_SKILLS.forEach(skill => {
  skill.sourceRefs = [...(SKILL_SOURCE_REFS[skill.jobId] || ['irowiki_classes'])];
});
