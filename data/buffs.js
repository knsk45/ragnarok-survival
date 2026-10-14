// Temporary buffs granted by consumable drops.
// Values follow the corresponding iRO Wiki skill pages.
window.RS_BUFFS = {
  blessing: {
    id: 'blessing', name: 'Blessing 10', skill: 'Blessing', level: 10,
    icon: '✦', iconUrl: 'https://irowiki.org/w/images/f/f5/I_Blessing.png',
    duration: 240, sourceRefs: ['irowiki_blessing'],
    effect: { stats: { str: 10, dex: 10, int: 10 }, hit: 20 }
  },
  increaseAgi: {
    id: 'increaseAgi', name: 'Increase AGI 10', skill: 'Increase AGI', level: 10,
    icon: '↗', iconUrl: 'https://irowiki.org/w/images/6/62/I_IncreaseAgility.png',
    duration: 240, sourceRefs: ['irowiki_increase_agi'],
    effect: { stats: { agi: 12 }, aspdRate: .10, moveRate: .10 }
  },
  magnificat: {
    id: 'magnificat', name: 'Magnificat 5', skill: 'Magnificat', level: 5,
    icon: '✚', iconUrl: 'https://irowiki.org/w/images/f/f7/I_Magnificant.png',
    duration: 90, sourceRefs: ['irowiki_magnificat'],
    effect: { spRecoveryRate: 2 }
  },
  impositioManus: {
    id: 'impositioManus', name: 'Impositio Manus 5', skill: 'Impositio Manus', level: 5,
    icon: '⚔', iconUrl: 'https://irowiki.org/w/images/0/0b/I_ImpositioManus.png',
    duration: 120, sourceRefs: ['irowiki_impositio_manus'],
    effect: { atk: 25 }
  }
};

