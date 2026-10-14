const progression = window.RS_PROGRESSION || {
  id: 'classic_knight_path',
  milestones: [
    { stage: 'Novice', jobId: 'novice', baseStart: 1, baseMilestone: 15, jobStart: 1, jobMilestone: 10, nextStage: 'Swordman' },
    { stage: 'Swordman', jobId: 'swordman', baseStart: 15, baseMilestone: 65, jobStart: 10, jobMilestone: 50, nextStage: 'Knight' },
    { stage: 'Knight', jobId: 'knight', baseStart: 65, baseMilestone: 80, jobStart: 50, jobMilestone: 50, nextStage: null }
  ],
  levelCap: { base: 99, job: 50 }
};

window.RS_DATABASE = {
  schemaVersion: '1.0.0',
  contentVersion: 2,
  gameVersion: '0.5.1',
  sources: {
    monsterDatabase: 'https://db.irowiki.org/db/',
    classDatabase: 'https://irowiki.org/wiki/Classes',
    knight: 'https://irowiki.org/wiki/Knight',
    swordman: 'https://irowiki.org/wiki/Swordman',
    novice: 'https://irowiki.org/wiki/Novice'
  },
  settings: { infiniteSp: true },
  stats: window.RS_STATS,
  jobs: window.RS_JOBS,
  characters: window.RS_CHARACTERS,
  progression,
  builds: window.RS_BUILDS,
  skills: window.RS_SKILLS,
  monsters: window.RS_MONSTERS
};
