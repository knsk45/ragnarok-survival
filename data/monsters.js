window.RS_MONSTERS = {
  poring: {
    id: 1002, key: 'poring', name: 'Poring', source: 'https://db.irowiki.org/db/monster-info/1002/', sourceRefs: ['irowiki_monster_db', 'irowiki_monster_poring'],
    classification: { size: 'medium', race: 'plant', element: 'water', elementLevel: 1, modes: ['passive', 'looter'] },
    stats: { level: 1, def: 2, mdef: 5, agi: 1, vit: 1, int: 0, dex: 6, luk: 5, hit: 202, flee: 177 },
    combat: { hp: 60, atkMin: 8, atkMax: 9, range: 1, aspd: 106.4, moveMs: 400, speed: 40, damage: 8, baseExp: 27, jobExp: 20, exp: 27 },
    visual: { spriteKey: 'poring', color: '#ef73b3', shadow: '#9a3978', radius: 15 }
  },
  lunatic: {
    id: 1063, key: 'lunatic', name: 'Lunatic', source: 'https://db.irowiki.org/db/monster-info/1063/', sourceRefs: ['irowiki_monster_db', 'irowiki_monster_lunatic'],
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
    id: 1023, key: 'orc', name: 'Orc Warrior', source: 'https://db.irowiki.org/db/monster-info/1023/', sourceRefs: ['irowiki_monster_db', 'irowiki_monster_orc_warrior'],
    classification: { size: 'medium', race: 'demihuman', element: 'earth', elementLevel: 1, modes: ['aggressive', 'elite'] },
    stats: { level: 44, def: 52, mdef: 3, agi: 15, vit: 24, int: 15, dex: 16, luk: 10, hit: 259, flee: 230 },
    combat: { hp: 1434, atkMin: 71, atkMax: 104, range: 1, aspd: 106.8, moveMs: 200, speed: 56, damage: 104, baseExp: 350, jobExp: 540, exp: 350 },
    visual: { spriteKey: 'orc', spriteUrl: 'https://nn.ai4rei.net/dev/npclist/i/ORK_WARRIOR.gif', color: '#8ca85a', shadow: '#435b38', radius: 21 }
  },
  rocker: {
    id: 1052, key: 'rocker', name: 'Rocker', source: 'https://db.irowiki.org/db/monster-info/1052/', sourceRefs: ['irowiki_monster_db', 'irowiki_monster_rocker'],
    classification: { size: 'medium', race: 'insect', element: 'earth', elementLevel: 1, modes: ['passive'] },
    stats: { level: 15, def: 16, mdef: 3, agi: 18, vit: 8, int: 10, dex: 17, luk: 5, hit: 233, flee: 202 },
    combat: { hp: 185, atkMin: 19, atkMax: 24, range: 1, aspd: 106.8, moveMs: 200, speed: 55, damage: 24, baseExp: 99, jobExp: 74, exp: 99 },
    visual: { spriteKey: 'rocker', spriteUrl: 'https://nn.ai4rei.net/dev/npclist/i/ROCKER.gif', color: '#b7c45e', shadow: '#66743a', radius: 16 }
  },
  creamy: {
    id: 1018, key: 'creamy', name: 'Creamy', source: 'https://db.irowiki.org/db/monster-info/1018/', sourceRefs: ['irowiki_monster_db', 'irowiki_monster_creamy'],
    classification: { size: 'small', race: 'insect', element: 'wind', elementLevel: 1, modes: ['passive'] },
    stats: { level: 23, def: 28, mdef: 20, agi: 1, vit: 1, int: 0, dex: 1, luk: 20, hit: 224, flee: 194 },
    combat: { hp: 378, atkMin: 61, atkMax: 62, range: 1, aspd: 143.2, moveMs: 150, speed: 60, damage: 62, baseExp: 144, jobExp: 162, exp: 144 },
    balance: { speedMultiplier: .68, damageMultiplier: .52 },
    visual: { spriteKey: 'creamy', renderMode: 'custom', spriteUrl: 'https://nn.ai4rei.net/dev/npclist/i/CREAMY.gif', color: '#d8a6e8', shadow: '#845c9b', radius: 14 }
  },
  soldierSkeleton: {
    id: 1028, key: 'soldierSkeleton', name: 'Soldier Skeleton', source: 'https://db.irowiki.org/db/monster-info/1028/', sourceRefs: ['irowiki_monster_db', 'irowiki_monster_soldier_skeleton'],
    classification: { size: 'medium', race: 'undead', element: 'undead', elementLevel: 1, modes: ['aggressive'] },
    stats: { level: 34, def: 53, mdef: 5, agi: 10, vit: 32, int: 5, dex: 29, luk: 3, hit: 244, flee: 233 },
    combat: { hp: 804, atkMin: 84, atkMax: 98, range: 1, aspd: 86.2, moveMs: 200, speed: 59, damage: 98, baseExp: 216, jobExp: 243, exp: 216 },
    visual: { spriteKey: 'soldierSkeleton', spriteUrl: 'https://nn.ai4rei.net/dev/npclist/i/SKEL_SOLDIER.gif', color: '#c4c8d2', shadow: '#646b78', radius: 19 }
  },
  myst: {
    id: 1151, key: 'myst', name: 'Myst', source: 'https://db.irowiki.org/db/monster-info/1151/', sourceRefs: ['irowiki_monster_db', 'irowiki_monster_myst'],
    classification: { size: 'large', race: 'formless', element: 'poison', elementLevel: 1, modes: ['aggressive'] },
    stats: { level: 49, def: 61, mdef: 10, agi: 37, vit: 20, int: 10, dex: 41, luk: 10, hit: 286, flee: 260 },
    combat: { hp: 1223, atkMin: 96, atkMax: 116, range: 1, aspd: 121.2, moveMs: 200, speed: 62, damage: 116, baseExp: 396, jobExp: 446, exp: 396 },
    visual: { spriteKey: 'myst', spriteUrl: 'https://nn.ai4rei.net/dev/npclist/i/MYST.gif', color: '#8bb6a2', shadow: '#466d61', radius: 23 }
  },
  savage: {
    id: 1166, key: 'savage', name: 'Savage', source: 'https://db.irowiki.org/db/monster-info/1166/', sourceRefs: ['irowiki_monster_db', 'irowiki_monster_savage'],
    classification: { size: 'large', race: 'brute', element: 'earth', elementLevel: 2, modes: ['passive'] },
    stats: { level: 59, def: 126, mdef: 3, agi: 21, vit: 54, int: 10, dex: 52, luk: 15, hit: 280, flee: 281 },
    combat: { hp: 2301, atkMin: 181, atkMax: 204, range: 1, aspd: 102, moveMs: 150, speed: 65, damage: 204, baseExp: 573, jobExp: 644, exp: 573 },
    visual: { spriteKey: 'savage', spriteUrl: 'https://nn.ai4rei.net/dev/npclist/i/SAVAGE.gif', color: '#d39b62', shadow: '#82522f', radius: 25 }
  },
  zerom: {
    id: 1178, key: 'zerom', name: 'Zerom', source: 'https://db.irowiki.org/db/monster-info/1178/', sourceRefs: ['irowiki_monster_db', 'irowiki_monster_zerom'],
    classification: { size: 'medium', race: 'demihuman', element: 'fire', elementLevel: 1, modes: ['aggressive'] },
    stats: { level: 70, def: 93, mdef: 15, agi: 49, vit: 30, int: 15, dex: 62, luk: 20, hit: 319, flee: 302 },
    combat: { hp: 2687, atkMin: 328, atkMax: 366, range: 1, aspd: 111, moveMs: 200, speed: 68, damage: 366, baseExp: 720, jobExp: 960, exp: 720 },
    visual: { spriteKey: 'zerom', spriteUrl: 'https://nn.ai4rei.net/dev/npclist/i/ZEROM.gif', color: '#d66a54', shadow: '#873b31', radius: 22 }
  },
  goat: {
    id: 1372, key: 'goat', name: 'Goat', source: 'https://db.irowiki.org/db/monster-info/1372/', sourceRefs: ['irowiki_monster_db', 'irowiki_monster_goat'],
    classification: { size: 'medium', race: 'brute', element: 'fire', elementLevel: 3, modes: ['passive', 'assist'] },
    stats: { level: 80, def: 95, mdef: 43, agi: 40, vit: 48, int: 40, dex: 78, luk: 31, hit: 320, flee: 328 },
    combat: { hp: 3980, atkMin: 426, atkMax: 486, range: 1, aspd: 131, moveMs: 165, speed: 70, damage: 486, baseExp: 1065, jobExp: 1197, exp: 1065 },
    visual: { spriteKey: 'goat', spriteUrl: 'https://nn.ai4rei.net/dev/npclist/i/GOAT.gif', color: '#b68b65', shadow: '#6d4d3d', radius: 24 }
  },
  marionette: {
    id: 1143, key: 'marionette', name: 'Marionette', source: 'https://db.irowiki.org/db/monster-info/1143/', sourceRefs: ['irowiki_monster_db', 'irowiki_monster_marionette'],
    classification: { size: 'small', race: 'demon', element: 'ghost', elementLevel: 3, modes: ['aggressive'] },
    stats: { level: 90, def: 35, mdef: 24, agi: 79, vit: 28, int: 105, dex: 86, luk: 20, hit: 369, flee: 346 },
    combat: { hp: 7166, atkMin: 222, atkMax: 412, range: 1, aspd: 126, moveMs: 300, speed: 74, damage: 412, baseExp: 1442, jobExp: 2009, exp: 1442 },
    visual: { spriteKey: 'marionette', spriteUrl: 'https://nn.ai4rei.net/dev/npclist/i/MARIONETTE.gif', color: '#9d7bd1', shadow: '#5f4688', radius: 17 }
  }
};
