// Temporary buffs granted by consumable drops.
// Values follow the corresponding iRO Wiki skill pages.
window.RS_BUFFS = {
  blessing: {
    id: 'blessing', name: 'Blessing 10', skill: 'Blessing', level: 10,
    duration: 240, sourceRefs: ['irowiki_blessing'],
    effect: { stats: { str: 10, dex: 10, int: 10 }, hit: 20 }
  },
  increaseAgi: {
    id: 'increaseAgi', name: 'Increase AGI 10', skill: 'Increase AGI', level: 10,
    duration: 240, sourceRefs: ['irowiki_increase_agi'],
    effect: { stats: { agi: 12 }, aspdRate: .10, moveRate: .10 }
  },
  magnificat: {
    id: 'magnificat', name: 'Magnificat 5', skill: 'Magnificat', level: 5,
    duration: 90, sourceRefs: ['irowiki_magnificat'],
    effect: { spRecoveryRate: 2 }
  },
  impositioManus: {
    id: 'impositioManus', name: 'Impositio Manus 5', skill: 'Impositio Manus', level: 5,
    duration: 120, sourceRefs: ['irowiki_impositio_manus'],
    effect: { atk: 25 }
  }
};
