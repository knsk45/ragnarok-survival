window.RS_MONSTERS = {
  poring: {
    id: 1002, key: 'poring', name: 'Poring', source: 'https://db.irowiki.org/db/monster-info/1002/',
    classification: { size: 'medium', race: 'plant', element: 'water', elementLevel: 1, modes: ['passive', 'looter'] },
    stats: { level: 1, def: 2, mdef: 5, agi: 1, vit: 1, int: 0, dex: 6, luk: 5, hit: 202, flee: 177 },
    combat: { hp: 60, atkMin: 8, atkMax: 9, range: 1, aspd: 106.4, moveMs: 400, speed: 40, damage: 8, baseExp: 27, jobExp: 20, exp: 27 },
    visual: { spriteKey: 'poring', color: '#ef73b3', shadow: '#9a3978', radius: 15 }
  },
  lunatic: {
    id: 1063, key: 'lunatic', name: 'Lunatic', source: 'https://db.irowiki.org/db/monster-info/1063/',
    classification: { size: 'small', race: 'brute', element: 'neutral', elementLevel: 3, modes: ['passive'] },
    stats: { level: 3, def: 18, mdef: 0, agi: 3, vit: 3, int: 0, dex: 8, luk: 5, hit: 206, flee: 181 },
    combat: { hp: 55, atkMin: 11, atkMax: 12, range: 1, aspd: 127.2, moveMs: 200, speed: 68, damage: 12, baseExp: 36, jobExp: 27, exp: 36 },
    visual: { spriteKey: 'lunatic', color: '#eee6db', shadow: '#a89793', radius: 12 }
  },
  fabre: {
    id: 1008, key: 'fabre', name: 'Fabre', source: 'prototype',
    classification: { size: 'small', race: 'insect', element: 'earth', elementLevel: 1, modes: ['aggressive'] },
    stats: { level: 2, def: 5, mdef: 0, agi: 5, vit: 2, int: 0, dex: 7, luk: 2 },
    combat: { hp: 52, atkMin: 8, atkMax: 12, range: 1, aspd: 120, moveMs: 300, speed: 55, damage: 10, baseExp: 14, jobExp: 9, exp: 14 },
    visual: { spriteKey: 'poring', color: '#75bc5e', shadow: '#3e713c', radius: 14 }
  },
  poporing: {
    id: 1031, key: 'poporing', name: 'Poporing', source: 'prototype',
    classification: { size: 'medium', race: 'plant', element: 'wind', elementLevel: 1, modes: ['aggressive'] },
    stats: { level: 10, def: 10, mdef: 5, agi: 8, vit: 4, int: 0, dex: 10, luk: 5 },
    combat: { hp: 110, atkMin: 14, atkMax: 20, range: 1, aspd: 110, moveMs: 450, speed: 45, damage: 17, baseExp: 55, jobExp: 35, exp: 55 },
    visual: { spriteKey: 'poring', color: '#79ca76', shadow: '#398954', radius: 18 }
  },
  orc: {
    id: 1023, key: 'orc', name: 'Orc Warrior', source: 'prototype',
    classification: { size: 'medium', race: 'demihuman', element: 'earth', elementLevel: 1, modes: ['aggressive', 'elite'] },
    stats: { level: 44, def: 40, mdef: 5, agi: 20, vit: 30, int: 0, dex: 25, luk: 5 },
    combat: { hp: 190, atkMin: 35, atkMax: 52, range: 1, aspd: 90, moveMs: 500, speed: 50, damage: 23, baseExp: 120, jobExp: 80, exp: 120 },
    visual: { spriteKey: 'poring', color: '#8ca85a', shadow: '#435b38', radius: 21 }
  }
};
