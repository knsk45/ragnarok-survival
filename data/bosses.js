// Source-derived boss records; encounter pacing is a Survivor adaptation.
window.RS_BOSSES = {
  "sourceFilter": "https://db.irowiki.org/db/monster-search/?search&boss=1&category=1&hp=3,100000,0&level=3,100,&ltype=1&sort=1,1&header=10",
  "firstSpawnAt": 120,
  "cooldown": 90,
  "maxRegular": 3,
  "roster": [
    "toad",
    "eclipse",
    "mastering",
    "dragon_fly",
    "mutant_dragonoid",
    "deviling",
    "chimera",
    "angeling",
    "cat_o_nine_tails",
    "maya_purple",
    "arc_angeling",
    "ghostring",
    "octopus_henchman",
    "owl_duke",
    "vagabond_wolf",
    "wild_rider",
    "dark_illusion"
  ]
};
window.RS_BOSS_MONSTERS = {
  "toad": {
    "id": 1089,
    "key": "toad",
    "name": "Toad",
    "isBoss": true,
    "source": "https://db.irowiki.org/db/monster-info/1089/",
    "sourceRefs": [
      "irowiki_monster_db",
      "irowiki_boss_toad"
    ],
    "classification": {
      "size": "medium",
      "race": "fish",
      "element": "water",
      "elementLevel": 1,
      "modes": [
        "boss",
        "aggressive"
      ]
    },
    "stats": {
      "level": 27,
      "def": 24,
      "mdef": 6,
      "hit": 246,
      "flee": 221,
      "agi": 19,
      "vit": 27,
      "int": 10,
      "dex": 24,
      "luk": 5
    },
    "combat": {
      "hp": 660,
      "atkMin": 70,
      "atkMax": 89,
      "baseExp": 162,
      "jobExp": 183,
      "aspd": 138.2,
      "moveMs": 200,
      "range": 1,
      "speed": 80.0,
      "damage": 89
    },
    "drops": {
      "giftBoxPlain": 1
    },
    "visual": {
      "spriteKey": "toad",
      "color": "#b093d1",
      "shadow": "#534466",
      "radius": 17,
      "spriteUrl": "assets/irowiki/monsters/1089.png",
      "renderMode": "sprite",
      "facing": "left",
      "provenance": "irowiki-original"
    }
  },
  "eclipse": {
    "id": 1093,
    "key": "eclipse",
    "name": "Eclipse",
    "isBoss": true,
    "source": "https://db.irowiki.org/db/monster-info/1093/",
    "sourceRefs": [
      "irowiki_monster_db",
      "irowiki_boss_eclipse"
    ],
    "classification": {
      "size": "medium",
      "race": "brute",
      "element": "neutral",
      "elementLevel": 3,
      "modes": [
        "boss",
        "aggressive"
      ]
    },
    "stats": {
      "level": 31,
      "def": 50,
      "mdef": 20,
      "hit": 259,
      "flee": 228,
      "agi": 28,
      "vit": 35,
      "int": 17,
      "dex": 27,
      "luk": 55
    },
    "combat": {
      "hp": 625,
      "atkMin": 60,
      "atkMax": 80,
      "baseExp": 207,
      "jobExp": 233,
      "aspd": 127.2,
      "moveMs": 200,
      "range": 1,
      "speed": 80.0,
      "damage": 80
    },
    "drops": {
      "giftBoxPlain": 1
    },
    "visual": {
      "spriteKey": "eclipse",
      "color": "#b093d1",
      "shadow": "#534466",
      "radius": 15,
      "spriteUrl": "assets/irowiki/monsters/1093.png",
      "renderMode": "sprite",
      "facing": "left",
      "provenance": "irowiki-original"
    }
  },
  "mastering": {
    "id": 1090,
    "key": "mastering",
    "name": "Mastering",
    "isBoss": true,
    "source": "https://db.irowiki.org/db/monster-info/1090/",
    "sourceRefs": [
      "irowiki_monster_db",
      "irowiki_boss_mastering"
    ],
    "classification": {
      "size": "medium",
      "race": "plant",
      "element": "water",
      "elementLevel": 1,
      "modes": [
        "boss",
        "aggressive"
      ]
    },
    "stats": {
      "level": 42,
      "def": 48,
      "mdef": 31,
      "hit": 263,
      "flee": 241,
      "agi": 21,
      "vit": 41,
      "int": 12,
      "dex": 29,
      "luk": 60
    },
    "combat": {
      "hp": 1260,
      "atkMin": 80,
      "atkMax": 120,
      "baseExp": 315,
      "jobExp": 354,
      "aspd": 146.4,
      "moveMs": 300,
      "range": 1,
      "speed": 53.333333333333336,
      "damage": 120
    },
    "drops": {
      "giftBoxPlain": 1
    },
    "visual": {
      "spriteKey": "mastering",
      "color": "#b093d1",
      "shadow": "#534466",
      "radius": 15,
      "spriteUrl": "assets/irowiki/monsters/1090.png",
      "renderMode": "sprite",
      "facing": "left",
      "provenance": "irowiki-original"
    }
  },
  "dragon_fly": {
    "id": 1091,
    "key": "dragon_fly",
    "name": "Dragon Fly",
    "isBoss": true,
    "source": "https://db.irowiki.org/db/monster-info/1091/",
    "sourceRefs": [
      "irowiki_monster_db",
      "irowiki_boss_dragon_fly"
    ],
    "classification": {
      "size": "small",
      "race": "insect",
      "element": "wind",
      "elementLevel": 1,
      "modes": [
        "boss",
        "aggressive"
      ]
    },
    "stats": {
      "level": 47,
      "def": 57,
      "mdef": 28,
      "hit": 291,
      "flee": 261,
      "agi": 44,
      "vit": 30,
      "int": 15,
      "dex": 44,
      "luk": 15
    },
    "combat": {
      "hp": 1035,
      "atkMin": 102,
      "atkMax": 135,
      "baseExp": 360,
      "jobExp": 405,
      "aspd": 146.2,
      "moveMs": 100,
      "range": 1,
      "speed": 160.0,
      "damage": 135
    },
    "drops": {
      "giftBoxPlain": 1
    },
    "visual": {
      "spriteKey": "dragon_fly",
      "color": "#b093d1",
      "shadow": "#534466",
      "radius": 15,
      "spriteUrl": "assets/irowiki/monsters/1091.png",
      "renderMode": "sprite",
      "facing": "left",
      "provenance": "irowiki-original"
    }
  },
  "mutant_dragonoid": {
    "id": 1262,
    "key": "mutant_dragonoid",
    "name": "Mutant Dragonoid",
    "isBoss": true,
    "source": "https://db.irowiki.org/db/monster-info/1262/",
    "sourceRefs": [
      "irowiki_monster_db",
      "irowiki_boss_mutant_dragonoid"
    ],
    "classification": {
      "size": "large",
      "race": "dragon",
      "element": "fire",
      "elementLevel": 2,
      "modes": [
        "boss",
        "aggressive"
      ]
    },
    "stats": {
      "level": 65,
      "def": 130,
      "mdef": 20,
      "hit": 300,
      "flee": 343,
      "agi": 35,
      "vit": 30,
      "int": 68,
      "dex": 108,
      "luk": 35
    },
    "combat": {
      "hp": 50706,
      "atkMin": 1176,
      "atkMax": 1710,
      "baseExp": 3644,
      "jobExp": 12830,
      "aspd": 136,
      "moveMs": 250,
      "range": 4,
      "speed": 64.0,
      "damage": 1710
    },
    "drops": {
      "giftBoxPlain": 1
    },
    "visual": {
      "spriteKey": "mutant_dragonoid",
      "color": "#b093d1",
      "shadow": "#534466",
      "radius": 38,
      "spriteUrl": "assets/irowiki/monsters/1262.png",
      "renderMode": "sprite",
      "facing": "left",
      "provenance": "irowiki-original"
    }
  },
  "deviling": {
    "id": 1582,
    "key": "deviling",
    "name": "Deviling",
    "isBoss": true,
    "source": "https://db.irowiki.org/db/monster-info/1582/",
    "sourceRefs": [
      "irowiki_monster_db",
      "irowiki_boss_deviling"
    ],
    "classification": {
      "size": "medium",
      "race": "demon",
      "element": "shadow",
      "elementLevel": 4,
      "modes": [
        "boss",
        "aggressive"
      ]
    },
    "stats": {
      "level": 66,
      "def": 67,
      "mdef": 70,
      "hit": 316,
      "flee": 321,
      "agi": 50,
      "vit": 33,
      "int": 75,
      "dex": 85,
      "luk": 200
    },
    "combat": {
      "hp": 16890,
      "atkMin": 313,
      "atkMax": 496,
      "baseExp": 2281,
      "jobExp": 2379,
      "aspd": 146.4,
      "moveMs": 200,
      "range": 1,
      "speed": 80.0,
      "damage": 496
    },
    "drops": {
      "giftBoxPlain": 1
    },
    "visual": {
      "spriteKey": "deviling",
      "color": "#b093d1",
      "shadow": "#534466",
      "radius": 15,
      "spriteUrl": "assets/irowiki/monsters/1582.png",
      "renderMode": "sprite",
      "facing": "left",
      "provenance": "irowiki-original"
    }
  },
  "chimera": {
    "id": 1283,
    "key": "chimera",
    "name": "Chimera",
    "isBoss": true,
    "source": "https://db.irowiki.org/db/monster-info/1283/",
    "sourceRefs": [
      "irowiki_monster_db",
      "irowiki_boss_chimera"
    ],
    "classification": {
      "size": "large",
      "race": "brute",
      "element": "fire",
      "elementLevel": 3,
      "modes": [
        "boss",
        "aggressive"
      ]
    },
    "stats": {
      "level": 70,
      "def": 159,
      "mdef": 10,
      "hit": 308,
      "flee": 331,
      "agi": 38,
      "vit": 110,
      "int": 88,
      "dex": 91,
      "luk": 85
    },
    "combat": {
      "hp": 26406,
      "atkMin": 1029,
      "atkMax": 1177,
      "baseExp": 5168,
      "jobExp": 4698,
      "aspd": 161.4,
      "moveMs": 200,
      "range": 1,
      "speed": 80.0,
      "damage": 1177
    },
    "drops": {
      "giftBoxPlain": 1
    },
    "visual": {
      "spriteKey": "chimera",
      "color": "#b093d1",
      "shadow": "#534466",
      "radius": 32,
      "spriteUrl": "assets/irowiki/monsters/1283.png",
      "renderMode": "sprite",
      "facing": "left",
      "provenance": "irowiki-original"
    }
  },
  "angeling": {
    "id": 1096,
    "key": "angeling",
    "name": "Angeling",
    "isBoss": true,
    "source": "https://db.irowiki.org/db/monster-info/1096/",
    "sourceRefs": [
      "irowiki_monster_db",
      "irowiki_boss_angeling"
    ],
    "classification": {
      "size": "medium",
      "race": "angel",
      "element": "holy",
      "elementLevel": 4,
      "modes": [
        "boss",
        "aggressive"
      ]
    },
    "stats": {
      "level": 77,
      "def": 72,
      "mdef": 238,
      "hit": 327,
      "flee": 327,
      "agi": 50,
      "vit": 33,
      "int": 105,
      "dex": 80,
      "luk": 200
    },
    "combat": {
      "hp": 19800,
      "atkMin": 391,
      "atkMax": 536,
      "baseExp": 3060,
      "jobExp": 2693,
      "aspd": 146.4,
      "moveMs": 200,
      "range": 1,
      "speed": 80.0,
      "damage": 536
    },
    "drops": {
      "giftBoxPlain": 1
    },
    "visual": {
      "spriteKey": "angeling",
      "color": "#b093d1",
      "shadow": "#534466",
      "radius": 15,
      "spriteUrl": "assets/irowiki/monsters/1096.png",
      "renderMode": "sprite",
      "facing": "left",
      "provenance": "irowiki-original"
    }
  },
  "cat_o_nine_tails": {
    "id": 1307,
    "key": "cat_o_nine_tails",
    "name": "Cat O' Nine Tails",
    "isBoss": true,
    "source": "https://db.irowiki.org/db/monster-info/1307/",
    "sourceRefs": [
      "irowiki_monster_db",
      "irowiki_boss_cat_o_nine_tails"
    ],
    "classification": {
      "size": "medium",
      "race": "demon",
      "element": "fire",
      "elementLevel": 3,
      "modes": [
        "boss",
        "aggressive"
      ]
    },
    "stats": {
      "level": 79,
      "def": 100,
      "mdef": 50,
      "hit": 354,
      "flee": 328,
      "agi": 75,
      "vit": 40,
      "int": 50,
      "dex": 79,
      "luk": 48
    },
    "combat": {
      "hp": 23600,
      "atkMin": 467,
      "atkMax": 547,
      "baseExp": 4148,
      "jobExp": 5792,
      "aspd": 136.2,
      "moveMs": 155,
      "range": 1,
      "speed": 103.2258064516129,
      "damage": 547
    },
    "drops": {
      "giftBoxPlain": 1
    },
    "visual": {
      "spriteKey": "cat_o_nine_tails",
      "color": "#b093d1",
      "shadow": "#534466",
      "radius": 19,
      "spriteUrl": "assets/irowiki/monsters/1307.png",
      "renderMode": "sprite",
      "facing": "left",
      "provenance": "irowiki-original"
    }
  },
  "maya_purple": {
    "id": 1289,
    "key": "maya_purple",
    "name": "Maya Purple",
    "isBoss": true,
    "source": "https://db.irowiki.org/db/monster-info/1289/",
    "sourceRefs": [
      "irowiki_monster_db",
      "irowiki_boss_maya_purple"
    ],
    "classification": {
      "size": "large",
      "race": "insect",
      "element": "earth",
      "elementLevel": 4,
      "modes": [
        "boss",
        "aggressive"
      ]
    },
    "stats": {
      "level": 81,
      "def": 139,
      "mdef": 40,
      "hit": 333,
      "flee": 339,
      "agi": 52,
      "vit": 80,
      "int": 95,
      "dex": 88,
      "luk": 119
    },
    "combat": {
      "hp": 77670,
      "atkMin": 1592,
      "atkMax": 2145,
      "baseExp": 11714,
      "jobExp": 6516,
      "aspd": 148.8,
      "moveMs": 100,
      "range": 2,
      "speed": 160.0,
      "damage": 2145
    },
    "drops": {
      "giftBoxPlain": 1
    },
    "visual": {
      "spriteKey": "maya_purple",
      "color": "#b093d1",
      "shadow": "#534466",
      "radius": 37,
      "spriteUrl": "assets/irowiki/monsters/1289.png",
      "renderMode": "sprite",
      "facing": "left",
      "provenance": "irowiki-original"
    }
  },
  "arc_angeling": {
    "id": 1388,
    "key": "arc_angeling",
    "name": "Arc Angeling",
    "isBoss": true,
    "source": "https://db.irowiki.org/db/monster-info/1388/",
    "sourceRefs": [
      "irowiki_monster_db",
      "irowiki_boss_arc_angeling"
    ],
    "classification": {
      "size": "medium",
      "race": "angel",
      "element": "holy",
      "elementLevel": 3,
      "modes": [
        "boss",
        "aggressive"
      ]
    },
    "stats": {
      "level": 84,
      "def": 92,
      "mdef": 81,
      "hit": 332,
      "flee": 373,
      "agi": 48,
      "vit": 62,
      "int": 99,
      "dex": 119,
      "luk": 105
    },
    "combat": {
      "hp": 25100,
      "atkMin": 593,
      "atkMax": 693,
      "baseExp": 3253,
      "jobExp": 2910,
      "aspd": 146.4,
      "moveMs": 180,
      "range": 1,
      "speed": 88.88888888888889,
      "damage": 693
    },
    "drops": {
      "giftBoxPlain": 1
    },
    "visual": {
      "spriteKey": "arc_angeling",
      "color": "#b093d1",
      "shadow": "#534466",
      "radius": 15,
      "spriteUrl": "assets/irowiki/monsters/1388.png",
      "renderMode": "sprite",
      "facing": "left",
      "provenance": "irowiki-original"
    }
  },
  "ghostring": {
    "id": 1120,
    "key": "ghostring",
    "name": "Ghostring",
    "isBoss": true,
    "source": "https://db.irowiki.org/db/monster-info/1120/",
    "sourceRefs": [
      "irowiki_monster_db",
      "irowiki_boss_ghostring"
    ],
    "classification": {
      "size": "medium",
      "race": "demon",
      "element": "ghost",
      "elementLevel": 4,
      "modes": [
        "boss",
        "aggressive"
      ]
    },
    "stats": {
      "level": 90,
      "def": 88,
      "mdef": 72,
      "hit": 375,
      "flee": 379,
      "agi": 85,
      "vit": 66,
      "int": 66,
      "dex": 119,
      "luk": 66
    },
    "combat": {
      "hp": 26700,
      "atkMin": 385,
      "atkMax": 547,
      "baseExp": 4305,
      "jobExp": 4467,
      "aspd": 139,
      "moveMs": 300,
      "range": 1,
      "speed": 53.333333333333336,
      "damage": 547
    },
    "drops": {
      "giftBoxPlain": 1
    },
    "visual": {
      "spriteKey": "ghostring",
      "color": "#b093d1",
      "shadow": "#534466",
      "radius": 15,
      "spriteUrl": "assets/irowiki/monsters/1120.png",
      "renderMode": "sprite",
      "facing": "left",
      "provenance": "irowiki-original"
    }
  },
  "octopus_henchman": {
    "id": 2192,
    "key": "octopus_henchman",
    "name": "Octopus Henchman",
    "isBoss": true,
    "source": "https://db.irowiki.org/db/monster-info/2192/",
    "sourceRefs": [
      "irowiki_monster_db",
      "irowiki_boss_octopus_henchman"
    ],
    "classification": {
      "size": "small",
      "race": "fish",
      "element": "water",
      "elementLevel": 2,
      "modes": [
        "boss",
        "aggressive"
      ]
    },
    "stats": {
      "level": 90,
      "def": 154,
      "mdef": 21,
      "hit": 381,
      "flee": 373,
      "agi": 91,
      "vit": 138,
      "int": 60,
      "dex": 113,
      "luk": 45
    },
    "combat": {
      "hp": 6000,
      "atkMin": 778,
      "atkMax": 1003,
      "baseExp": 2000,
      "jobExp": 1000,
      "aspd": 171.2,
      "moveMs": 300,
      "range": 1,
      "speed": 53.333333333333336,
      "damage": 1003
    },
    "drops": {
      "giftBoxPlain": 1
    },
    "visual": {
      "spriteKey": "octopus_henchman",
      "color": "#b093d1",
      "shadow": "#534466",
      "radius": 15,
      "spriteUrl": "assets/irowiki/monsters/2192.png",
      "renderMode": "sprite",
      "facing": "left",
      "provenance": "divine-pride-original"
    }
  },
  "owl_duke": {
    "id": 1320,
    "key": "owl_duke",
    "name": "Owl Duke",
    "isBoss": true,
    "source": "https://db.irowiki.org/db/monster-info/1320/",
    "sourceRefs": [
      "irowiki_monster_db",
      "irowiki_boss_owl_duke"
    ],
    "classification": {
      "size": "large",
      "race": "demon",
      "element": "neutral",
      "elementLevel": 3,
      "modes": [
        "boss",
        "aggressive"
      ]
    },
    "stats": {
      "level": 92,
      "def": 80,
      "mdef": 45,
      "hit": 343,
      "flee": 368,
      "agi": 51,
      "vit": 45,
      "int": 88,
      "dex": 106,
      "luk": 50
    },
    "combat": {
      "hp": 7381,
      "atkMin": 624,
      "atkMax": 924,
      "baseExp": 1377,
      "jobExp": 1953,
      "aspd": 132.75,
      "moveMs": 195,
      "range": 1,
      "speed": 82.05128205128206,
      "damage": 924
    },
    "drops": {
      "giftBoxPlain": 1
    },
    "visual": {
      "spriteKey": "owl_duke",
      "color": "#b093d1",
      "shadow": "#534466",
      "radius": 25,
      "spriteUrl": "assets/irowiki/monsters/1320.png",
      "renderMode": "sprite",
      "facing": "left",
      "provenance": "irowiki-original"
    }
  },
  "vagabond_wolf": {
    "id": 1092,
    "key": "vagabond_wolf",
    "name": "Vagabond Wolf",
    "isBoss": true,
    "source": "https://db.irowiki.org/db/monster-info/1092/",
    "sourceRefs": [
      "irowiki_monster_db",
      "irowiki_boss_vagabond_wolf"
    ],
    "classification": {
      "size": "medium",
      "race": "brute",
      "element": "earth",
      "elementLevel": 1,
      "modes": [
        "boss",
        "aggressive"
      ]
    },
    "stats": {
      "level": 93,
      "def": 102,
      "mdef": 51,
      "hit": 356,
      "flee": 371,
      "agi": 63,
      "vit": 55,
      "int": 29,
      "dex": 108,
      "luk": 15
    },
    "combat": {
      "hp": 8203,
      "atkMin": 519,
      "atkMax": 565,
      "baseExp": 1422,
      "jobExp": 2601,
      "aspd": 147.6,
      "moveMs": 150,
      "range": 1,
      "speed": 106.66666666666667,
      "damage": 565
    },
    "drops": {
      "giftBoxPlain": 1
    },
    "visual": {
      "spriteKey": "vagabond_wolf",
      "color": "#b093d1",
      "shadow": "#534466",
      "radius": 15,
      "spriteUrl": "assets/irowiki/monsters/1092.png",
      "renderMode": "sprite",
      "facing": "left",
      "provenance": "irowiki-original"
    }
  },
  "wild_rider": {
    "id": 2208,
    "key": "wild_rider",
    "name": "Wild Rider",
    "isBoss": true,
    "source": "https://db.irowiki.org/db/monster-info/2208/",
    "sourceRefs": [
      "irowiki_monster_db",
      "irowiki_boss_wild_rider"
    ],
    "classification": {
      "size": "large",
      "race": "fish",
      "element": "water",
      "elementLevel": 2,
      "modes": [
        "boss",
        "aggressive"
      ]
    },
    "stats": {
      "level": 95,
      "def": 480,
      "mdef": 22,
      "hit": 419,
      "flee": 377,
      "agi": 124,
      "vit": 89,
      "int": 56,
      "dex": 112,
      "luk": 56
    },
    "combat": {
      "hp": 33300,
      "atkMin": 1320,
      "atkMax": 1650,
      "baseExp": 4150,
      "jobExp": 1650,
      "aspd": 178.4,
      "moveMs": 120,
      "range": 1,
      "speed": 133.33333333333334,
      "damage": 1650
    },
    "drops": {
      "giftBoxPlain": 1
    },
    "visual": {
      "spriteKey": "wild_rider",
      "color": "#b093d1",
      "shadow": "#534466",
      "radius": 22,
      "spriteUrl": "assets/irowiki/monsters/2208.png",
      "renderMode": "sprite",
      "facing": "left",
      "provenance": "divine-pride-original"
    }
  },
  "dark_illusion": {
    "id": 1302,
    "key": "dark_illusion",
    "name": "Dark Illusion",
    "isBoss": true,
    "source": "https://db.irowiki.org/db/monster-info/1302/",
    "sourceRefs": [
      "irowiki_monster_db",
      "irowiki_boss_dark_illusion"
    ],
    "classification": {
      "size": "large",
      "race": "demon",
      "element": "undead",
      "elementLevel": 4,
      "modes": [
        "boss",
        "aggressive"
      ]
    },
    "stats": {
      "level": 96,
      "def": 145,
      "mdef": 30,
      "hit": 332,
      "flee": 448,
      "agi": 36,
      "vit": 55,
      "int": 100,
      "dex": 182,
      "luk": 88
    },
    "combat": {
      "hp": 46255,
      "atkMin": 1166,
      "atkMax": 1526,
      "baseExp": 4091,
      "jobExp": 4099,
      "aspd": 148.8,
      "moveMs": 145,
      "range": 2,
      "speed": 110.34482758620689,
      "damage": 1526
    },
    "drops": {
      "giftBoxPlain": 1
    },
    "visual": {
      "spriteKey": "dark_illusion",
      "color": "#b093d1",
      "shadow": "#534466",
      "radius": 38,
      "spriteUrl": "assets/irowiki/monsters/1302.png",
      "renderMode": "sprite",
      "facing": "left",
      "provenance": "irowiki-original"
    }
  }
};
Object.assign(window.RS_MONSTERS, window.RS_BOSS_MONSTERS);
window.RS_BOSS_ARTWORK = [
  {
    "key": "toad",
    "id": 1089,
    "group": "monsters",
    "path": "assets/irowiki/monsters/1089.png",
    "sourceUrl": "https://db.irowiki.org/db/monster-info/1089/",
    "imageSourceUrl": "https://db.irowiki.org/image/monster/1089.png",
    "sha256": "c18e93c3ff65e0f365ed9c9162ef826fb0de4ac42836e66a47adcc04eb5dcd83",
    "width": 65,
    "height": 78
  },
  {
    "key": "eclipse",
    "id": 1093,
    "group": "monsters",
    "path": "assets/irowiki/monsters/1093.png",
    "sourceUrl": "https://db.irowiki.org/db/monster-info/1093/",
    "imageSourceUrl": "https://db.irowiki.org/image/monster/1093.png",
    "sha256": "28d2413ef4eb31ec4f7aa2da58884ff7afbeb238cf6fdfbe2f6956a032079c09",
    "width": 49,
    "height": 39
  },
  {
    "key": "mastering",
    "id": 1090,
    "group": "monsters",
    "path": "assets/irowiki/monsters/1090.png",
    "sourceUrl": "https://db.irowiki.org/db/monster-info/1090/",
    "imageSourceUrl": "https://db.irowiki.org/image/monster/1090.png",
    "sha256": "0cb2115ef30958b6e1f90a86f34ff17bf4eaada1baf860379f7b4d2a32fa1e55",
    "width": 62,
    "height": 60
  },
  {
    "key": "dragon_fly",
    "id": 1091,
    "group": "monsters",
    "path": "assets/irowiki/monsters/1091.png",
    "sourceUrl": "https://db.irowiki.org/db/monster-info/1091/",
    "imageSourceUrl": "https://db.irowiki.org/image/monster/1091.png",
    "sha256": "5602cee38a0a8a1fb4b19d21e6e99b2314ebc8af65394d28d7371723714b76e3",
    "width": 37,
    "height": 33
  },
  {
    "key": "mutant_dragonoid",
    "id": 1262,
    "group": "monsters",
    "path": "assets/irowiki/monsters/1262.png",
    "sourceUrl": "https://db.irowiki.org/db/monster-info/1262/",
    "imageSourceUrl": "https://db.irowiki.org/image/monster/1262.png",
    "sha256": "047dd7a563570ace3821942267dc1923fd74768a7bfcabb78b2318b6758406e8",
    "width": 116,
    "height": 183
  },
  {
    "key": "deviling",
    "id": 1582,
    "group": "monsters",
    "path": "assets/irowiki/monsters/1582.png",
    "sourceUrl": "https://db.irowiki.org/db/monster-info/1582/",
    "imageSourceUrl": "https://db.irowiki.org/image/monster/1582.png",
    "sha256": "eb67435b19d860b06e2af971f1485e6e2e09625581a839d2f4a212ea75c235ea",
    "width": 78,
    "height": 40
  },
  {
    "key": "chimera",
    "id": 1283,
    "group": "monsters",
    "path": "assets/irowiki/monsters/1283.png",
    "sourceUrl": "https://db.irowiki.org/db/monster-info/1283/",
    "imageSourceUrl": "https://db.irowiki.org/image/monster/1283.png",
    "sha256": "2cc67610bc12e15710a4eb259e4b85937b8a6b1fdd459136ddd015511d0af797",
    "width": 132,
    "height": 145
  },
  {
    "key": "angeling",
    "id": 1096,
    "group": "monsters",
    "path": "assets/irowiki/monsters/1096.png",
    "sourceUrl": "https://db.irowiki.org/db/monster-info/1096/",
    "imageSourceUrl": "https://db.irowiki.org/image/monster/1096.png",
    "sha256": "78c616bc3b55413539d1418e62c3af43dde627d7f6b7ed8f5670539b247da13c",
    "width": 66,
    "height": 46
  },
  {
    "key": "cat_o_nine_tails",
    "id": 1307,
    "group": "monsters",
    "path": "assets/irowiki/monsters/1307.png",
    "sourceUrl": "https://db.irowiki.org/db/monster-info/1307/",
    "imageSourceUrl": "https://db.irowiki.org/image/monster/1307.png",
    "sha256": "bc44eeba671b431886daf9e3f611dc6d053858d88091047052e88c6d31fe395b",
    "width": 78,
    "height": 88
  },
  {
    "key": "maya_purple",
    "id": 1289,
    "group": "monsters",
    "path": "assets/irowiki/monsters/1289.png",
    "sourceUrl": "https://db.irowiki.org/db/monster-info/1289/",
    "imageSourceUrl": "https://db.irowiki.org/image/monster/1289.png",
    "sha256": "300c7e5037723377f4ab45451abcdd7f206e7bb9a6cb1e43978fa6e0590328db",
    "width": 128,
    "height": 166
  },
  {
    "key": "arc_angeling",
    "id": 1388,
    "group": "monsters",
    "path": "assets/irowiki/monsters/1388.png",
    "sourceUrl": "https://db.irowiki.org/db/monster-info/1388/",
    "imageSourceUrl": "https://db.irowiki.org/image/monster/1388.png",
    "sha256": "ee66eb971808c1e59c616eee8b37a2619720c922703df6f1e0af19223e4457b7",
    "width": 66,
    "height": 46
  },
  {
    "key": "ghostring",
    "id": 1120,
    "group": "monsters",
    "path": "assets/irowiki/monsters/1120.png",
    "sourceUrl": "https://db.irowiki.org/db/monster-info/1120/",
    "imageSourceUrl": "https://db.irowiki.org/image/monster/1120.png",
    "sha256": "ba1a74a3794feda262f6e8363983c1b563bde56a7a653bb06d34fbfc58f3c523",
    "width": 40,
    "height": 51
  },
  {
    "key": "octopus_henchman",
    "id": 2192,
    "group": "monsters",
    "path": "assets/irowiki/monsters/2192.png",
    "sourceUrl": "https://db.irowiki.org/db/monster-info/2192/",
    "imageSourceUrl": "https://static.divine-pride.net/images/mobs/png/2192.png",
    "sha256": "f7f9ba5cbdd904f5fec8a838a4ef42bfa9fae4dc0b527565636dc2335633cd88",
    "width": 38,
    "height": 48
  },
  {
    "key": "owl_duke",
    "id": 1320,
    "group": "monsters",
    "path": "assets/irowiki/monsters/1320.png",
    "sourceUrl": "https://db.irowiki.org/db/monster-info/1320/",
    "imageSourceUrl": "https://db.irowiki.org/image/monster/1320.png",
    "sha256": "baa88a279c7196cb2b1386a4d60243f55808f9bdf216ec76317a414d732aeecc",
    "width": 66,
    "height": 112
  },
  {
    "key": "vagabond_wolf",
    "id": 1092,
    "group": "monsters",
    "path": "assets/irowiki/monsters/1092.png",
    "sourceUrl": "https://db.irowiki.org/db/monster-info/1092/",
    "imageSourceUrl": "https://db.irowiki.org/image/monster/1092.png",
    "sha256": "fb80d39edd5835ce7140809c5050ad1c80f4413f666658764410b5dad9ff99cc",
    "width": 78,
    "height": 65
  },
  {
    "key": "wild_rider",
    "id": 2208,
    "group": "monsters",
    "path": "assets/irowiki/monsters/2208.png",
    "sourceUrl": "https://db.irowiki.org/db/monster-info/2208/",
    "imageSourceUrl": "https://static.divine-pride.net/images/mobs/png/2208.png",
    "sha256": "395840446ba00cd733435b288c71620665bb3dd00090720be7cc8a2b1f119b8f",
    "width": 83,
    "height": 100
  },
  {
    "key": "dark_illusion",
    "id": 1302,
    "group": "monsters",
    "path": "assets/irowiki/monsters/1302.png",
    "sourceUrl": "https://db.irowiki.org/db/monster-info/1302/",
    "imageSourceUrl": "https://db.irowiki.org/image/monster/1302.png",
    "sha256": "49e130acdb5b486e7556983e3ec0fd75ac429ea95a5e5c8aaa2bff0a103eb102",
    "width": 170,
    "height": 214
  }
];
for (const m of Object.values(window.RS_BOSS_MONSTERS)) {
  if (window.RS_SOURCES?.records) window.RS_SOURCES.records[m.sourceRefs[1]] = {
    id: m.sourceRefs[1], type: "monster", authority: "reference", title: m.name, url: m.source
  };
}
