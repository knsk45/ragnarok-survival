window.RS_CHARACTERS = {
  knight_male: {
    id: 'knight_male',
    name: 'Knight',
    gender: 'male',
    sourceRefs: ['irowiki_novice', 'irowiki_swordman', 'irowiki_knight', 'irowiki_stats', 'irowiki_max_hp'],
    playable: true,
    equipmentProfileId: 'knight_auto_gear',
    mountedVisual: {
      skillId: 'peco_peco_ride', stateKey: 'peco', jobId: 'knight',
      spriteUrl: 'assets/irowiki/characters/knight-peco-male.png',
      source: 'https://irowiki.org/wiki/Peco_Peco_Ride',
      imageSource: 'https://irowiki.org/w/images/3/33/Knight-Peco.png',
      renderHeight: 110, facing: 'right',
      sourceRefs: ['irowiki_peco_ride', 'irowiki_knight_mounted'],
      sourceRect: { x: 38, y: 26, width: 69, height: 113 }
    },
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
