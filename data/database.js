const progression = window.RS_PROGRESSION || {
  id: 'classic_knight_path',
  milestones: [
    { stage: 'Novice', jobId: 'novice', baseStart: 1, baseMilestone: 15, jobStart: 1, jobMilestone: 10, nextStage: 'Swordman' },
    { stage: 'Swordman', jobId: 'swordman', baseStart: 15, baseMilestone: 65, jobStart: 1, jobMilestone: 50, nextStage: 'Knight' },
    { stage: 'Knight', jobId: 'knight', baseStart: 65, baseMilestone: 80, jobStart: 1, jobMilestone: 50, nextStage: null }
  ],
  levelCap: { base: 99, job: 50 }
};

const sourceRegistry = window.RS_SOURCES || {
  schemaVersion: '1.0.0',
  policy: { priority: ['prototype'], rule: 'No source registry loaded.' },
  records: {}
};

window.RS_DATABASE = {
  schemaVersion: '1.0.0',
  contentVersion: 21,
  gameVersion: '0.6.18',
  sourceRegistry,
  sources: {
    monsterDatabase: 'https://db.irowiki.org/db/',
    classDatabase: 'https://irowiki.org/wiki/Classes',
    knight: 'https://irowiki.org/wiki/Knight',
    swordman: 'https://irowiki.org/wiki/Swordman',
    novice: 'https://irowiki.org/wiki/Novice'
  },
  settings: {
    infiniteSp: false,
    maxEnemies: 60,
    enemyPowerCap: 7,
    bossHpMultiplier: 10
  },
  stats: window.RS_STATS,
  jobs: window.RS_JOBS,
  characters: window.RS_CHARACTERS,
  progression,
  builds: window.RS_BUILDS,
  skills: window.RS_SKILLS,
  monsters: window.RS_MONSTERS,
  buffs: window.RS_BUFFS,
  items: window.RS_ITEMS
};
