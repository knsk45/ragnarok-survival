window.RS_JOBS = {
  novice: {
    id: 'novice', name: 'Novice', displayName: 'Novice', parentId: null,
    sourceRefs: ['irowiki_classes', 'irowiki_novice'],
    jobLevelMax: 10, hpJobA: 0, hpJobB: 5, statBonuses: { str: 0, agi: 0, vit: 0, int: 0, dex: 0, luk: 0 },
    nextJobId: 'swordman', nextAt: { jobLevel: 10 }
  },
  swordman: {
    id: 'swordman', name: 'Swordman', displayName: 'Swordman', parentId: 'novice',
    sourceRefs: ['irowiki_classes', 'irowiki_swordman'],
    jobLevelMax: 50, hpJobA: 0.7, hpJobB: 5, statBonuses: { str: 7, agi: 2, vit: 4, int: 0, dex: 3, luk: 2 },
    nextJobId: 'knight', nextAt: { jobLevel: 50 }
  },
  knight: {
    id: 'knight', name: 'Knight', displayName: 'Knight', parentId: 'swordman',
    sourceRefs: ['irowiki_classes', 'irowiki_knight'],
    jobLevelMax: 50, hpJobA: 1.5, hpJobB: 5, statBonuses: { str: 8, agi: 2, vit: 10, int: 0, dex: 6, luk: 4 },
    nextJobId: null, nextAt: null
  }
};
