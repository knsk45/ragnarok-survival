window.RS_CHARACTERS = {
  knight_male: {
    id: 'knight_male',
    name: 'Knight',
    gender: 'male',
    sourceRefs: ['irowiki_novice', 'irowiki_swordman', 'irowiki_knight'],
    playable: true,
    baseStats: { str: 1, agi: 1, vit: 1, int: 1, dex: 1, luk: 1 },
    startingJobId: 'novice',
    evolution: [
      { jobId: 'novice', order: 1, spriteKey: 'novice_male' },
      { jobId: 'swordman', order: 2, spriteKey: 'swordman_male', unlock: { jobLevel: 10 } },
      { jobId: 'knight', order: 3, spriteKey: 'knight_male', unlock: { jobLevel: 50 } }
    ],
    buildIds: ['hybrid_knight']
  }
};
