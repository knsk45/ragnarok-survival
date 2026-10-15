// Additive monster batch: original source stats, no HP/ATK/EXP multipliers.
// Movement is converted to pixels/s (16px cell), bounded to 40–80 for Survivor pacing.
(function(){
  const records = {
  "drops": {
    "id": 1113,
    "key": "drops",
    "name": "Drops",
    "source": "https://db.irowiki.org/db/monster-info/1113/",
    "sourceRefs": [
      "irowiki_monster_db",
      "irowiki_monster_drops",
      "irowiki_monster_expansion_filter"
    ],
    "classification": {
      "size": "medium",
      "race": "plant",
      "element": "fire",
      "elementLevel": 1,
      "modes": [
        "passive",
        "looter"
      ]
    },
    "stats": {
      "level": 2,
      "def": 16,
      "mdef": 0,
      "agi": 1,
      "vit": 1,
      "int": 0,
      "dex": 6,
      "luk": 2,
      "hit": 203,
      "flee": 178
    },
    "combat": {
      "hp": 45,
      "atkMin": 12,
      "atkMax": 13,
      "range": 1,
      "aspd": 131.4,
      "moveMs": 400,
      "baseExp": 27,
      "jobExp": 20,
      "speed": 40,
      "damage": 13
    },
    "visual": {
      "spriteKey": "drops",
      "color": "#98aa72",
      "shadow": "#344536",
      "radius": 18,
      "spriteUrl": "assets/irowiki/monsters/1113.png",
      "renderMode": "sprite",
      "facing": "left",
      "provenance": "irowiki-original"
    }
  },
  "chonchon": {
    "id": 1011,
    "key": "chonchon",
    "name": "Chonchon",
    "source": "https://db.irowiki.org/db/monster-info/1011/",
    "sourceRefs": [
      "irowiki_monster_db",
      "irowiki_monster_chonchon",
      "irowiki_monster_expansion_filter"
    ],
    "classification": {
      "size": "small",
      "race": "insect",
      "element": "wind",
      "elementLevel": 1,
      "modes": [
        "passive"
      ]
    },
    "stats": {
      "level": 5,
      "def": 27,
      "mdef": 0,
      "agi": 4,
      "vit": 4,
      "int": 0,
      "dex": 8,
      "luk": 5,
      "hit": 209,
      "flee": 183
    },
    "combat": {
      "hp": 57,
      "atkMin": 11,
      "atkMax": 14,
      "range": 1,
      "aspd": 146.2,
      "moveMs": 200,
      "baseExp": 45,
      "jobExp": 36,
      "speed": 80,
      "damage": 14
    },
    "visual": {
      "spriteKey": "chonchon",
      "color": "#98aa72",
      "shadow": "#344536",
      "radius": 14,
      "spriteUrl": "assets/irowiki/monsters/1011.png",
      "renderMode": "sprite",
      "facing": "left",
      "provenance": "irowiki-original"
    }
  },
  "willow": {
    "id": 1010,
    "key": "willow",
    "name": "Willow",
    "source": "https://db.irowiki.org/db/monster-info/1010/",
    "sourceRefs": [
      "irowiki_monster_db",
      "irowiki_monster_willow",
      "irowiki_monster_expansion_filter"
    ],
    "classification": {
      "size": "medium",
      "race": "plant",
      "element": "earth",
      "elementLevel": 1,
      "modes": [
        "passive"
      ]
    },
    "stats": {
      "level": 8,
      "def": 38,
      "mdef": 2,
      "agi": 3,
      "vit": 8,
      "int": 5,
      "dex": 12,
      "luk": 5,
      "hit": 211,
      "flee": 190
    },
    "combat": {
      "hp": 91,
      "atkMin": 13,
      "atkMax": 18,
      "range": 1,
      "aspd": 116.4,
      "moveMs": 200,
      "baseExp": 63,
      "jobExp": 47,
      "speed": 80,
      "damage": 18
    },
    "visual": {
      "spriteKey": "willow",
      "color": "#98aa72",
      "shadow": "#344536",
      "radius": 18,
      "spriteUrl": "assets/irowiki/monsters/1010.png",
      "renderMode": "sprite",
      "facing": "left",
      "provenance": "irowiki-original"
    }
  },
  "hornet": {
    "id": 1004,
    "key": "hornet",
    "name": "Hornet",
    "source": "https://db.irowiki.org/db/monster-info/1004/",
    "sourceRefs": [
      "irowiki_monster_db",
      "irowiki_monster_hornet",
      "irowiki_monster_expansion_filter"
    ],
    "classification": {
      "size": "small",
      "race": "insect",
      "element": "wind",
      "elementLevel": 1,
      "modes": [
        "passive"
      ]
    },
    "stats": {
      "level": 11,
      "def": 7,
      "mdef": 1,
      "agi": 24,
      "vit": 4,
      "int": 5,
      "dex": 6,
      "luk": 5,
      "hit": 235,
      "flee": 187
    },
    "combat": {
      "hp": 90,
      "atkMin": 13,
      "atkMax": 16,
      "range": 1,
      "aspd": 135.4,
      "moveMs": 150,
      "baseExp": 81,
      "jobExp": 60,
      "speed": 80,
      "damage": 16
    },
    "visual": {
      "spriteKey": "hornet",
      "color": "#98aa72",
      "shadow": "#344536",
      "radius": 14,
      "spriteUrl": "assets/irowiki/monsters/1004.png",
      "renderMode": "sprite",
      "facing": "left",
      "provenance": "irowiki-original"
    }
  },
  "condor": {
    "id": 1009,
    "key": "condor",
    "name": "Condor",
    "source": "https://db.irowiki.org/db/monster-info/1009/",
    "sourceRefs": [
      "irowiki_monster_db",
      "irowiki_monster_condor",
      "irowiki_monster_expansion_filter"
    ],
    "classification": {
      "size": "medium",
      "race": "brute",
      "element": "wind",
      "elementLevel": 1,
      "modes": [
        "passive"
      ]
    },
    "stats": {
      "level": 12,
      "def": 7,
      "mdef": 5,
      "agi": 7,
      "vit": 6,
      "int": 0,
      "dex": 13,
      "luk": 5,
      "hit": 219,
      "flee": 195
    },
    "combat": {
      "hp": 114,
      "atkMin": 14,
      "atkMax": 20,
      "range": 1,
      "aspd": 142.6,
      "moveMs": 150,
      "baseExp": 81,
      "jobExp": 60,
      "speed": 80,
      "damage": 20
    },
    "visual": {
      "spriteKey": "condor",
      "color": "#98aa72",
      "shadow": "#344536",
      "radius": 18,
      "spriteUrl": "assets/irowiki/monsters/1009.png",
      "renderMode": "sprite",
      "facing": "left",
      "provenance": "irowiki-original"
    }
  },
  "roda_frog": {
    "id": 1012,
    "key": "roda_frog",
    "name": "Roda Frog",
    "source": "https://db.irowiki.org/db/monster-info/1012/",
    "sourceRefs": [
      "irowiki_monster_db",
      "irowiki_monster_roda_frog",
      "irowiki_monster_expansion_filter"
    ],
    "classification": {
      "size": "medium",
      "race": "fish",
      "element": "water",
      "elementLevel": 1,
      "modes": [
        "passive"
      ]
    },
    "stats": {
      "level": 13,
      "def": 12,
      "mdef": 5,
      "agi": 6,
      "vit": 4,
      "int": 0,
      "dex": 14,
      "luk": 9,
      "hit": 219,
      "flee": 197
    },
    "combat": {
      "hp": 160,
      "atkMin": 19,
      "atkMax": 23,
      "range": 1,
      "aspd": 99.2,
      "moveMs": 200,
      "baseExp": 90,
      "jobExp": 68,
      "speed": 80,
      "damage": 23
    },
    "visual": {
      "spriteKey": "roda_frog",
      "color": "#98aa72",
      "shadow": "#344536",
      "radius": 18,
      "spriteUrl": "assets/irowiki/monsters/1012.png",
      "renderMode": "sprite",
      "facing": "left",
      "provenance": "irowiki-original"
    }
  },
  "spore": {
    "id": 1014,
    "key": "spore",
    "name": "Spore",
    "source": "https://db.irowiki.org/db/monster-info/1014/",
    "sourceRefs": [
      "irowiki_monster_db",
      "irowiki_monster_spore",
      "irowiki_monster_expansion_filter"
    ],
    "classification": {
      "size": "medium",
      "race": "plant",
      "element": "water",
      "elementLevel": 1,
      "modes": [
        "passive"
      ]
    },
    "stats": {
      "level": 18,
      "def": 12,
      "mdef": 10,
      "agi": 5,
      "vit": 10,
      "int": 0,
      "dex": 12,
      "luk": 0,
      "hit": 223,
      "flee": 200
    },
    "combat": {
      "hp": 280,
      "atkMin": 25,
      "atkMax": 33,
      "range": 1,
      "aspd": 106.4,
      "moveMs": 200,
      "baseExp": 117,
      "jobExp": 87,
      "speed": 80,
      "damage": 33
    },
    "visual": {
      "spriteKey": "spore",
      "color": "#98aa72",
      "shadow": "#344536",
      "radius": 18,
      "spriteUrl": "assets/irowiki/monsters/1014.png",
      "renderMode": "sprite",
      "facing": "left",
      "provenance": "irowiki-original"
    }
  },
  "stainer": {
    "id": 1174,
    "key": "stainer",
    "name": "Stainer",
    "source": "https://db.irowiki.org/db/monster-info/1174/",
    "sourceRefs": [
      "irowiki_monster_db",
      "irowiki_monster_stainer",
      "irowiki_monster_expansion_filter"
    ],
    "classification": {
      "size": "small",
      "race": "insect",
      "element": "wind",
      "elementLevel": 1,
      "modes": [
        "passive"
      ]
    },
    "stats": {
      "level": 21,
      "def": 22,
      "mdef": 25,
      "agi": 10,
      "vit": 24,
      "int": 0,
      "dex": 39,
      "luk": 15,
      "hit": 231,
      "flee": 230
    },
    "combat": {
      "hp": 365,
      "atkMin": 65,
      "atkMax": 74,
      "range": 1,
      "aspd": 115.6,
      "moveMs": 200,
      "baseExp": 126,
      "jobExp": 143,
      "speed": 80,
      "damage": 74
    },
    "visual": {
      "spriteKey": "stainer",
      "color": "#98aa72",
      "shadow": "#344536",
      "radius": 14,
      "spriteUrl": "assets/irowiki/monsters/1174.png",
      "renderMode": "sprite",
      "facing": "left",
      "provenance": "irowiki-original"
    }
  },
  "peco_peco": {
    "id": 1019,
    "key": "peco_peco",
    "name": "Peco Peco",
    "source": "https://db.irowiki.org/db/monster-info/1019/",
    "sourceRefs": [
      "irowiki_monster_db",
      "irowiki_monster_peco_peco",
      "irowiki_monster_expansion_filter"
    ],
    "classification": {
      "size": "large",
      "race": "brute",
      "element": "fire",
      "elementLevel": 1,
      "modes": [
        "passive"
      ]
    },
    "stats": {
      "level": 25,
      "def": 48,
      "mdef": 0,
      "agi": 10,
      "vit": 13,
      "int": 5,
      "dex": 28,
      "luk": 5,
      "hit": 235,
      "flee": 223
    },
    "combat": {
      "hp": 446,
      "atkMin": 76,
      "atkMax": 83,
      "range": 1,
      "aspd": 121.8,
      "moveMs": 200,
      "baseExp": 162,
      "jobExp": 183,
      "speed": 80,
      "damage": 83
    },
    "visual": {
      "spriteKey": "peco_peco",
      "color": "#98aa72",
      "shadow": "#344536",
      "radius": 24,
      "spriteUrl": "assets/irowiki/monsters/1019.png",
      "renderMode": "sprite",
      "facing": "left",
      "provenance": "irowiki-original"
    }
  },
  "skeleton": {
    "id": 1076,
    "key": "skeleton",
    "name": "Skeleton",
    "source": "https://db.irowiki.org/db/monster-info/1076/",
    "sourceRefs": [
      "irowiki_monster_db",
      "irowiki_monster_skeleton",
      "irowiki_monster_expansion_filter"
    ],
    "classification": {
      "size": "medium",
      "race": "undead",
      "element": "undead",
      "elementLevel": 1,
      "modes": [
        "passive"
      ]
    },
    "stats": {
      "level": 27,
      "def": 21,
      "mdef": 2,
      "agi": 15,
      "vit": 30,
      "int": 5,
      "dex": 19,
      "luk": 1,
      "hit": 242,
      "flee": 216
    },
    "combat": {
      "hp": 612,
      "atkMin": 78,
      "atkMax": 102,
      "range": 1,
      "aspd": 88.6,
      "moveMs": 200,
      "baseExp": 162,
      "jobExp": 183,
      "speed": 80,
      "damage": 102
    },
    "visual": {
      "spriteKey": "skeleton",
      "color": "#98aa72",
      "shadow": "#344536",
      "radius": 18,
      "spriteUrl": "assets/irowiki/monsters/1076.png",
      "renderMode": "sprite",
      "facing": "left",
      "provenance": "irowiki-original"
    }
  },
  "andre": {
    "id": 1095,
    "key": "andre",
    "name": "Andre",
    "source": "https://db.irowiki.org/db/monster-info/1095/",
    "sourceRefs": [
      "irowiki_monster_db",
      "irowiki_monster_andre",
      "irowiki_monster_expansion_filter"
    ],
    "classification": {
      "size": "small",
      "race": "insect",
      "element": "earth",
      "elementLevel": 1,
      "modes": [
        "passive",
        "looter"
      ]
    },
    "stats": {
      "level": 33,
      "def": 55,
      "mdef": 16,
      "agi": 20,
      "vit": 40,
      "int": 10,
      "dex": 24,
      "luk": 10,
      "hit": 253,
      "flee": 227
    },
    "combat": {
      "hp": 724,
      "atkMin": 51,
      "atkMax": 72,
      "range": 1,
      "aspd": 135.6,
      "moveMs": 300,
      "baseExp": 216,
      "jobExp": 243,
      "speed": 53.33,
      "damage": 72
    },
    "visual": {
      "spriteKey": "andre",
      "color": "#98aa72",
      "shadow": "#344536",
      "radius": 14,
      "spriteUrl": "assets/irowiki/monsters/1095.png",
      "renderMode": "sprite",
      "facing": "left",
      "provenance": "irowiki-original"
    }
  },
  "vitata": {
    "id": 1176,
    "key": "vitata",
    "name": "Vitata",
    "source": "https://db.irowiki.org/db/monster-info/1176/",
    "sourceRefs": [
      "irowiki_monster_db",
      "irowiki_monster_vitata",
      "irowiki_monster_expansion_filter"
    ],
    "classification": {
      "size": "small",
      "race": "insect",
      "element": "earth",
      "elementLevel": 1,
      "modes": [
        "passive"
      ]
    },
    "stats": {
      "level": 35,
      "def": 44,
      "mdef": 12,
      "agi": 11,
      "vit": 24,
      "int": 20,
      "dex": 21,
      "luk": 5,
      "hit": 246,
      "flee": 226
    },
    "combat": {
      "hp": 756,
      "atkMin": 68,
      "atkMax": 86,
      "range": 1,
      "aspd": 111.6,
      "moveMs": 300,
      "baseExp": 234,
      "jobExp": 264,
      "speed": 53.33,
      "damage": 86
    },
    "visual": {
      "spriteKey": "vitata",
      "color": "#98aa72",
      "shadow": "#344536",
      "radius": 14,
      "spriteUrl": "assets/irowiki/monsters/1176.png",
      "renderMode": "sprite",
      "facing": "left",
      "provenance": "irowiki-original"
    }
  },
  "cookie_red": {
    "id": 1246,
    "key": "cookie_red",
    "name": "Cookie (Red)",
    "source": "https://db.irowiki.org/db/monster-info/1246/",
    "sourceRefs": [
      "irowiki_monster_db",
      "irowiki_monster_cookie_red",
      "irowiki_monster_expansion_filter"
    ],
    "classification": {
      "size": "small",
      "race": "demi-human",
      "element": "holy",
      "elementLevel": 2,
      "modes": [
        "passive"
      ]
    },
    "stats": {
      "level": 37,
      "def": 48,
      "mdef": 36,
      "agi": 16,
      "vit": 30,
      "int": 20,
      "dex": 25,
      "luk": 5,
      "hit": 253,
      "flee": 232
    },
    "combat": {
      "hp": 733,
      "atkMin": 70,
      "atkMax": 105,
      "range": 1,
      "aspd": 137.6,
      "moveMs": 400,
      "baseExp": 282,
      "jobExp": 317,
      "speed": 40,
      "damage": 105
    },
    "visual": {
      "spriteKey": "cookie_red",
      "color": "#98aa72",
      "shadow": "#344536",
      "radius": 14,
      "spriteUrl": "assets/irowiki/monsters/1246.png",
      "renderMode": "sprite",
      "facing": "left",
      "provenance": "irowiki-original"
    }
  },
  "yoyo": {
    "id": 1057,
    "key": "yoyo",
    "name": "Yoyo",
    "source": "https://db.irowiki.org/db/monster-info/1057/",
    "sourceRefs": [
      "irowiki_monster_db",
      "irowiki_monster_yoyo",
      "irowiki_monster_expansion_filter"
    ],
    "classification": {
      "size": "small",
      "race": "brute",
      "element": "earth",
      "elementLevel": 1,
      "modes": [
        "passive",
        "looter"
      ]
    },
    "stats": {
      "level": 38,
      "def": 40,
      "mdef": 0,
      "agi": 11,
      "vit": 34,
      "int": 20,
      "dex": 19,
      "luk": 10,
      "hit": 249,
      "flee": 227
    },
    "combat": {
      "hp": 898,
      "atkMin": 63,
      "atkMax": 74,
      "range": 1,
      "aspd": 147.3,
      "moveMs": 200,
      "baseExp": 270,
      "jobExp": 305,
      "speed": 80,
      "damage": 74
    },
    "visual": {
      "spriteKey": "yoyo",
      "color": "#98aa72",
      "shadow": "#344536",
      "radius": 14,
      "spriteUrl": "assets/irowiki/monsters/1057.png",
      "renderMode": "sprite",
      "facing": "left",
      "provenance": "irowiki-original"
    }
  },
  "thara_frog": {
    "id": 1034,
    "key": "thara_frog",
    "name": "Thara Frog",
    "source": "https://db.irowiki.org/db/monster-info/1034/",
    "sourceRefs": [
      "irowiki_monster_db",
      "irowiki_monster_thara_frog",
      "irowiki_monster_expansion_filter"
    ],
    "classification": {
      "size": "medium",
      "race": "fish",
      "element": "water",
      "elementLevel": 2,
      "modes": [
        "passive"
      ]
    },
    "stats": {
      "level": 40,
      "def": 37,
      "mdef": 17,
      "agi": 10,
      "vit": 10,
      "int": 18,
      "dex": 30,
      "luk": 2,
      "hit": 250,
      "flee": 240
    },
    "combat": {
      "hp": 1157,
      "atkMin": 73,
      "atkMax": 103,
      "range": 1,
      "aspd": 99.2,
      "moveMs": 200,
      "baseExp": 311,
      "jobExp": 350,
      "speed": 80,
      "damage": 103
    },
    "visual": {
      "spriteKey": "thara_frog",
      "color": "#98aa72",
      "shadow": "#344536",
      "radius": 18,
      "spriteUrl": "assets/irowiki/monsters/1034.png",
      "renderMode": "sprite",
      "facing": "left",
      "provenance": "irowiki-original"
    }
  },
  "giearth": {
    "id": 1121,
    "key": "giearth",
    "name": "Giearth",
    "source": "https://db.irowiki.org/db/monster-info/1121/",
    "sourceRefs": [
      "irowiki_monster_db",
      "irowiki_monster_giearth",
      "irowiki_monster_expansion_filter"
    ],
    "classification": {
      "size": "small",
      "race": "demon",
      "element": "earth",
      "elementLevel": 1,
      "modes": [
        "passive"
      ]
    },
    "stats": {
      "level": 42,
      "def": 52,
      "mdef": 16,
      "agi": 19,
      "vit": 30,
      "int": 10,
      "dex": 28,
      "luk": 15,
      "hit": 261,
      "flee": 240
    },
    "combat": {
      "hp": 1118,
      "atkMin": 70,
      "atkMax": 85,
      "range": 1,
      "aspd": 107.6,
      "moveMs": 200,
      "baseExp": 315,
      "jobExp": 354,
      "speed": 80,
      "damage": 85
    },
    "visual": {
      "spriteKey": "giearth",
      "color": "#98aa72",
      "shadow": "#344536",
      "radius": 14,
      "spriteUrl": "assets/irowiki/monsters/1121.png",
      "renderMode": "sprite",
      "facing": "left",
      "provenance": "irowiki-original"
    }
  },
  "orc_lady": {
    "id": 1273,
    "key": "orc_lady",
    "name": "Orc Lady",
    "source": "https://db.irowiki.org/db/monster-info/1273/",
    "sourceRefs": [
      "irowiki_monster_db",
      "irowiki_monster_orc_lady",
      "irowiki_monster_expansion_filter"
    ],
    "classification": {
      "size": "medium",
      "race": "demi-human",
      "element": "earth",
      "elementLevel": 2,
      "modes": [
        "aggressive"
      ]
    },
    "stats": {
      "level": 45,
      "def": 83,
      "mdef": 17,
      "agi": 11,
      "vit": 28,
      "int": 10,
      "dex": 57,
      "luk": 5,
      "hit": 256,
      "flee": 272
    },
    "combat": {
      "hp": 1520,
      "atkMin": 77,
      "atkMax": 110,
      "range": 1,
      "aspd": 147.5,
      "moveMs": 200,
      "baseExp": 380,
      "jobExp": 435,
      "speed": 80,
      "damage": 110
    },
    "visual": {
      "spriteKey": "orc_lady",
      "color": "#98aa72",
      "shadow": "#344536",
      "radius": 18,
      "spriteUrl": "assets/irowiki/monsters/1273.png",
      "renderMode": "sprite",
      "facing": "left",
      "provenance": "irowiki-original"
    }
  },
  "pirate_skeleton": {
    "id": 1071,
    "key": "pirate_skeleton",
    "name": "Pirate Skeleton",
    "source": "https://db.irowiki.org/db/monster-info/1071/",
    "sourceRefs": [
      "irowiki_monster_db",
      "irowiki_monster_pirate_skeleton",
      "irowiki_monster_expansion_filter"
    ],
    "classification": {
      "size": "medium",
      "race": "undead",
      "element": "undead",
      "elementLevel": 1,
      "modes": [
        "aggressive"
      ]
    },
    "stats": {
      "level": 48,
      "def": 53,
      "mdef": 20,
      "agi": 25,
      "vit": 25,
      "int": 15,
      "dex": 30,
      "luk": 10,
      "hit": 273,
      "flee": 248
    },
    "combat": {
      "hp": 1411,
      "atkMin": 105,
      "atkMax": 125,
      "range": 1,
      "aspd": 112.3,
      "moveMs": 200,
      "baseExp": 369,
      "jobExp": 414,
      "speed": 80,
      "damage": 125
    },
    "visual": {
      "spriteKey": "pirate_skeleton",
      "color": "#98aa72",
      "shadow": "#344536",
      "radius": 18,
      "spriteUrl": "assets/irowiki/monsters/1071.png",
      "renderMode": "sprite",
      "facing": "left",
      "provenance": "irowiki-original"
    }
  },
  "verit": {
    "id": 1032,
    "key": "verit",
    "name": "Verit",
    "source": "https://db.irowiki.org/db/monster-info/1032/",
    "sourceRefs": [
      "irowiki_monster_db",
      "irowiki_monster_verit",
      "irowiki_monster_expansion_filter"
    ],
    "classification": {
      "size": "medium",
      "race": "undead",
      "element": "undead",
      "elementLevel": 1,
      "modes": [
        "passive",
        "looter"
      ]
    },
    "stats": {
      "level": 52,
      "def": 63,
      "mdef": 10,
      "agi": 4,
      "vit": 25,
      "int": 10,
      "dex": 6,
      "luk": 5,
      "hit": 256,
      "flee": 228
    },
    "combat": {
      "hp": 1944,
      "atkMin": 139,
      "atkMax": 159,
      "range": 1,
      "aspd": 76.6,
      "moveMs": 250,
      "baseExp": 414,
      "jobExp": 467,
      "speed": 64.0,
      "damage": 159
    },
    "visual": {
      "spriteKey": "verit",
      "color": "#98aa72",
      "shadow": "#344536",
      "radius": 18,
      "spriteUrl": "assets/irowiki/monsters/1032.png",
      "renderMode": "sprite",
      "facing": "left",
      "provenance": "irowiki-original"
    }
  },
  "metaller": {
    "id": 1058,
    "key": "metaller",
    "name": "Metaller",
    "source": "https://db.irowiki.org/db/monster-info/1058/",
    "sourceRefs": [
      "irowiki_monster_db",
      "irowiki_monster_metaller",
      "irowiki_monster_expansion_filter"
    ],
    "classification": {
      "size": "medium",
      "race": "insect",
      "element": "fire",
      "elementLevel": 1,
      "modes": [
        "passive",
        "looter"
      ]
    },
    "stats": {
      "level": 55,
      "def": 72,
      "mdef": 12,
      "agi": 24,
      "vit": 10,
      "int": 0,
      "dex": 52,
      "luk": 31,
      "hit": 279,
      "flee": 277
    },
    "combat": {
      "hp": 1687,
      "atkMin": 196,
      "atkMax": 237,
      "range": 1,
      "aspd": 114.6,
      "moveMs": 200,
      "baseExp": 450,
      "jobExp": 507,
      "speed": 80,
      "damage": 237
    },
    "visual": {
      "spriteKey": "metaller",
      "color": "#98aa72",
      "shadow": "#344536",
      "radius": 18,
      "spriteUrl": "assets/irowiki/monsters/1058.png",
      "renderMode": "sprite",
      "facing": "left",
      "provenance": "irowiki-original"
    }
  },
  "alligator": {
    "id": 1271,
    "key": "alligator",
    "name": "Alligator",
    "source": "https://db.irowiki.org/db/monster-info/1271/",
    "sourceRefs": [
      "irowiki_monster_db",
      "irowiki_monster_alligator",
      "irowiki_monster_expansion_filter"
    ],
    "classification": {
      "size": "medium",
      "race": "brute",
      "element": "water",
      "elementLevel": 1,
      "modes": [
        "passive"
      ]
    },
    "stats": {
      "level": 57,
      "def": 62,
      "mdef": 30,
      "agi": 48,
      "vit": 24,
      "int": 15,
      "dex": 40,
      "luk": 26,
      "hit": 305,
      "flee": 267
    },
    "combat": {
      "hp": 2430,
      "atkMin": 158,
      "atkMax": 195,
      "range": 1,
      "aspd": 145,
      "moveMs": 200,
      "baseExp": 486,
      "jobExp": 548,
      "speed": 80,
      "damage": 195
    },
    "visual": {
      "spriteKey": "alligator",
      "color": "#98aa72",
      "shadow": "#344536",
      "radius": 18,
      "spriteUrl": "assets/irowiki/monsters/1271.png",
      "renderMode": "sprite",
      "facing": "left",
      "provenance": "irowiki-original"
    }
  },
  "sandman": {
    "id": 1165,
    "key": "sandman",
    "name": "Sandman",
    "source": "https://db.irowiki.org/db/monster-info/1165/",
    "sourceRefs": [
      "irowiki_monster_db",
      "irowiki_monster_sandman",
      "irowiki_monster_expansion_filter"
    ],
    "classification": {
      "size": "medium",
      "race": "formless",
      "element": "earth",
      "elementLevel": 3,
      "modes": [
        "aggressive"
      ]
    },
    "stats": {
      "level": 61,
      "def": 126,
      "mdef": 24,
      "agi": 8,
      "vit": 55,
      "int": 15,
      "dex": 34,
      "luk": 25,
      "hit": 269,
      "flee": 265
    },
    "combat": {
      "hp": 2887,
      "atkMin": 164,
      "atkMax": 220,
      "range": 1,
      "aspd": 116.4,
      "moveMs": 250,
      "baseExp": 626,
      "jobExp": 705,
      "speed": 64.0,
      "damage": 220
    },
    "visual": {
      "spriteKey": "sandman",
      "color": "#98aa72",
      "shadow": "#344536",
      "radius": 18,
      "spriteUrl": "assets/irowiki/monsters/1165.png",
      "renderMode": "sprite",
      "facing": "left",
      "provenance": "irowiki-original"
    }
  },
  "hode": {
    "id": 1127,
    "key": "hode",
    "name": "Hode",
    "source": "https://db.irowiki.org/db/monster-info/1127/",
    "sourceRefs": [
      "irowiki_monster_db",
      "irowiki_monster_hode",
      "irowiki_monster_expansion_filter"
    ],
    "classification": {
      "size": "medium",
      "race": "brute",
      "element": "earth",
      "elementLevel": 2,
      "modes": [
        "passive"
      ]
    },
    "stats": {
      "level": 63,
      "def": 91,
      "mdef": 24,
      "agi": 16,
      "vit": 42,
      "int": 5,
      "dex": 32,
      "luk": 40,
      "hit": 279,
      "flee": 265
    },
    "combat": {
      "hp": 2676,
      "atkMin": 179,
      "atkMax": 224,
      "range": 1,
      "aspd": 126,
      "moveMs": 200,
      "baseExp": 632,
      "jobExp": 710,
      "speed": 80,
      "damage": 224
    },
    "visual": {
      "spriteKey": "hode",
      "color": "#98aa72",
      "shadow": "#344536",
      "radius": 18,
      "spriteUrl": "assets/irowiki/monsters/1127.png",
      "renderMode": "sprite",
      "facing": "left",
      "provenance": "irowiki-original"
    }
  },
  "mantis": {
    "id": 1139,
    "key": "mantis",
    "name": "Mantis",
    "source": "https://db.irowiki.org/db/monster-info/1139/",
    "sourceRefs": [
      "irowiki_monster_db",
      "irowiki_monster_mantis",
      "irowiki_monster_expansion_filter"
    ],
    "classification": {
      "size": "medium",
      "race": "insect",
      "element": "earth",
      "elementLevel": 1,
      "modes": [
        "aggressive"
      ]
    },
    "stats": {
      "level": 65,
      "def": 90,
      "mdef": 0,
      "agi": 33,
      "vit": 24,
      "int": 5,
      "dex": 46,
      "luk": 15,
      "hit": 298,
      "flee": 281
    },
    "combat": {
      "hp": 2719,
      "atkMin": 187,
      "atkMax": 218,
      "range": 1,
      "aspd": 123.6,
      "moveMs": 200,
      "baseExp": 594,
      "jobExp": 669,
      "speed": 80,
      "damage": 218
    },
    "visual": {
      "spriteKey": "mantis",
      "color": "#98aa72",
      "shadow": "#344536",
      "radius": 18,
      "spriteUrl": "assets/irowiki/monsters/1139.png",
      "renderMode": "sprite",
      "facing": "left",
      "provenance": "irowiki-original"
    }
  },
  "dokebi": {
    "id": 1110,
    "key": "dokebi",
    "name": "Dokebi",
    "source": "https://db.irowiki.org/db/monster-info/1110/",
    "sourceRefs": [
      "irowiki_monster_db",
      "irowiki_monster_dokebi",
      "irowiki_monster_expansion_filter"
    ],
    "classification": {
      "size": "small",
      "race": "demon",
      "element": "shadow",
      "elementLevel": 1,
      "modes": [
        "passive"
      ]
    },
    "stats": {
      "level": 68,
      "def": 85,
      "mdef": 20,
      "agi": 56,
      "vit": 35,
      "int": 20,
      "dex": 66,
      "luk": 25,
      "hit": 324,
      "flee": 304
    },
    "combat": {
      "hp": 2820,
      "atkMin": 333,
      "atkMax": 363,
      "range": 1,
      "aspd": 142.2,
      "moveMs": 250,
      "baseExp": 675,
      "jobExp": 759,
      "speed": 64.0,
      "damage": 363
    },
    "visual": {
      "spriteKey": "dokebi",
      "color": "#98aa72",
      "shadow": "#344536",
      "radius": 14,
      "spriteUrl": "assets/irowiki/monsters/1110.png",
      "renderMode": "sprite",
      "facing": "left",
      "provenance": "irowiki-original"
    }
  },
  "sasquatch": {
    "id": 1243,
    "key": "sasquatch",
    "name": "Sasquatch",
    "source": "https://db.irowiki.org/db/monster-info/1243/",
    "sourceRefs": [
      "irowiki_monster_db",
      "irowiki_monster_sasquatch",
      "irowiki_monster_expansion_filter"
    ],
    "classification": {
      "size": "large",
      "race": "brute",
      "element": "neutral",
      "elementLevel": 3,
      "modes": [
        "aggressive"
      ]
    },
    "stats": {
      "level": 72,
      "def": 101,
      "mdef": 28,
      "agi": 35,
      "vit": 60,
      "int": 10,
      "dex": 71,
      "luk": 20,
      "hit": 307,
      "flee": 313
    },
    "combat": {
      "hp": 3163,
      "atkMin": 293,
      "atkMax": 323,
      "range": 1,
      "aspd": 137,
      "moveMs": 300,
      "baseExp": 765,
      "jobExp": 860,
      "speed": 53.33,
      "damage": 323
    },
    "visual": {
      "spriteKey": "sasquatch",
      "color": "#98aa72",
      "shadow": "#344536",
      "radius": 24,
      "spriteUrl": "assets/irowiki/monsters/1243.png",
      "renderMode": "sprite",
      "facing": "left",
      "provenance": "irowiki-original"
    }
  },
  "grand_peco": {
    "id": 1369,
    "key": "grand_peco",
    "name": "Grand Peco",
    "source": "https://db.irowiki.org/db/monster-info/1369/",
    "sourceRefs": [
      "irowiki_monster_db",
      "irowiki_monster_grand_peco",
      "irowiki_monster_expansion_filter"
    ],
    "classification": {
      "size": "large",
      "race": "brute",
      "element": "fire",
      "elementLevel": 2,
      "modes": [
        "passive"
      ]
    },
    "stats": {
      "level": 75,
      "def": 95,
      "mdef": 30,
      "agi": 45,
      "vit": 50,
      "int": 23,
      "dex": 61,
      "luk": 25,
      "hit": 320,
      "flee": 306
    },
    "combat": {
      "hp": 3150,
      "atkMin": 348,
      "atkMax": 404,
      "range": 2,
      "aspd": 127,
      "moveMs": 165,
      "baseExp": 887,
      "jobExp": 998,
      "speed": 80,
      "damage": 404
    },
    "visual": {
      "spriteKey": "grand_peco",
      "color": "#98aa72",
      "shadow": "#344536",
      "radius": 24,
      "spriteUrl": "assets/irowiki/monsters/1369.png",
      "renderMode": "sprite",
      "facing": "left",
      "provenance": "irowiki-original"
    }
  },
  "wraith": {
    "id": 1192,
    "key": "wraith",
    "name": "Wraith",
    "source": "https://db.irowiki.org/db/monster-info/1192/",
    "sourceRefs": [
      "irowiki_monster_db",
      "irowiki_monster_wraith",
      "irowiki_monster_expansion_filter"
    ],
    "classification": {
      "size": "large",
      "race": "undead",
      "element": "undead",
      "elementLevel": 4,
      "modes": [
        "aggressive"
      ]
    },
    "stats": {
      "level": 77,
      "def": 80,
      "mdef": 40,
      "agi": 26,
      "vit": 30,
      "int": 55,
      "dex": 91,
      "luk": 5,
      "hit": 303,
      "flee": 338
    },
    "combat": {
      "hp": 5168,
      "atkMin": 369,
      "atkMax": 430,
      "range": 1,
      "aspd": 109.2,
      "moveMs": 300,
      "baseExp": 1190,
      "jobExp": 1191,
      "speed": 53.33,
      "damage": 430
    },
    "visual": {
      "spriteKey": "wraith",
      "color": "#98aa72",
      "shadow": "#344536",
      "radius": 24,
      "spriteUrl": "assets/irowiki/monsters/1192.png",
      "renderMode": "sprite",
      "facing": "left",
      "provenance": "irowiki-original"
    }
  },
  "high_orc": {
    "id": 1213,
    "key": "high_orc",
    "name": "High Orc",
    "source": "https://db.irowiki.org/db/monster-info/1213/",
    "sourceRefs": [
      "irowiki_monster_db",
      "irowiki_monster_high_orc",
      "irowiki_monster_expansion_filter"
    ],
    "classification": {
      "size": "large",
      "race": "demi-human",
      "element": "fire",
      "elementLevel": 2,
      "modes": [
        "aggressive"
      ]
    },
    "stats": {
      "level": 81,
      "def": 101,
      "mdef": 45,
      "agi": 16,
      "vit": 40,
      "int": 31,
      "dex": 83,
      "luk": 20,
      "hit": 297,
      "flee": 334
    },
    "combat": {
      "hp": 4193,
      "atkMin": 428,
      "atkMax": 478,
      "range": 1,
      "aspd": 125,
      "moveMs": 150,
      "baseExp": 1099,
      "jobExp": 1158,
      "speed": 80,
      "damage": 478
    },
    "visual": {
      "spriteKey": "high_orc",
      "color": "#98aa72",
      "shadow": "#344536",
      "radius": 24,
      "spriteUrl": "assets/irowiki/monsters/1213.png",
      "renderMode": "sprite",
      "facing": "left",
      "provenance": "irowiki-original"
    }
  },
  "harpy": {
    "id": 1376,
    "key": "harpy",
    "name": "Harpy",
    "source": "https://db.irowiki.org/db/monster-info/1376/",
    "sourceRefs": [
      "irowiki_monster_db",
      "irowiki_monster_harpy",
      "irowiki_monster_expansion_filter"
    ],
    "classification": {
      "size": "medium",
      "race": "demon",
      "element": "wind",
      "elementLevel": 3,
      "modes": [
        "aggressive"
      ]
    },
    "stats": {
      "level": 83,
      "def": 69,
      "mdef": 44,
      "agi": 39,
      "vit": 50,
      "int": 31,
      "dex": 125,
      "luk": 12,
      "hit": 322,
      "flee": 378
    },
    "combat": {
      "hp": 4423,
      "atkMin": 340,
      "atkMax": 381,
      "range": 1,
      "aspd": 151.4,
      "moveMs": 155,
      "baseExp": 1201,
      "jobExp": 1349,
      "speed": 80,
      "damage": 381
    },
    "visual": {
      "spriteKey": "harpy",
      "color": "#98aa72",
      "shadow": "#344536",
      "radius": 18,
      "spriteUrl": "assets/irowiki/monsters/1376.png",
      "renderMode": "sprite",
      "facing": "left",
      "provenance": "irowiki-original"
    }
  },
  "porcellio": {
    "id": 1619,
    "key": "porcellio",
    "name": "Porcellio",
    "source": "https://db.irowiki.org/db/monster-info/1619/",
    "sourceRefs": [
      "irowiki_monster_db",
      "irowiki_monster_porcellio",
      "irowiki_monster_expansion_filter"
    ],
    "classification": {
      "size": "small",
      "race": "insect",
      "element": "earth",
      "elementLevel": 3,
      "modes": [
        "passive",
        "looter"
      ]
    },
    "stats": {
      "level": 85,
      "def": 79,
      "mdef": 37,
      "agi": 48,
      "vit": 28,
      "int": 40,
      "dex": 74,
      "luk": 30,
      "hit": 333,
      "flee": 329
    },
    "combat": {
      "hp": 5544,
      "atkMin": 293,
      "atkMax": 346,
      "range": 1,
      "aspd": 164,
      "moveMs": 150,
      "baseExp": 1294,
      "jobExp": 1455,
      "speed": 80,
      "damage": 346
    },
    "visual": {
      "spriteKey": "porcellio",
      "color": "#98aa72",
      "shadow": "#344536",
      "radius": 14,
      "spriteUrl": "assets/irowiki/monsters/1619.png",
      "renderMode": "sprite",
      "facing": "left",
      "provenance": "irowiki-original"
    }
  },
  "spring_rabbit": {
    "id": 1322,
    "key": "spring_rabbit",
    "name": "Spring Rabbit",
    "source": "https://db.irowiki.org/db/monster-info/1322/",
    "sourceRefs": [
      "irowiki_monster_db",
      "irowiki_monster_spring_rabbit",
      "irowiki_monster_expansion_filter"
    ],
    "classification": {
      "size": "medium",
      "race": "brute",
      "element": "earth",
      "elementLevel": 2,
      "modes": [
        "passive",
        "looter"
      ]
    },
    "stats": {
      "level": 88,
      "def": 108,
      "mdef": 42,
      "agi": 66,
      "vit": 35,
      "int": 30,
      "dex": 58,
      "luk": 5,
      "hit": 354,
      "flee": 316
    },
    "combat": {
      "hp": 6684,
      "atkMin": 317,
      "atkMax": 357,
      "range": 1,
      "aspd": 144,
      "moveMs": 160,
      "baseExp": 1341,
      "jobExp": 1509,
      "speed": 80,
      "damage": 357
    },
    "visual": {
      "spriteKey": "spring_rabbit",
      "color": "#98aa72",
      "shadow": "#344536",
      "radius": 18,
      "spriteUrl": "assets/irowiki/monsters/1322.png",
      "renderMode": "sprite",
      "facing": "left",
      "provenance": "irowiki-original"
    }
  },
  "teddy_bear": {
    "id": 1622,
    "key": "teddy_bear",
    "name": "Teddy Bear",
    "source": "https://db.irowiki.org/db/monster-info/1622/",
    "sourceRefs": [
      "irowiki_monster_db",
      "irowiki_monster_teddy_bear",
      "irowiki_monster_expansion_filter"
    ],
    "classification": {
      "size": "small",
      "race": "formless",
      "element": "neutral",
      "elementLevel": 3,
      "modes": [
        "aggressive"
      ]
    },
    "stats": {
      "level": 91,
      "def": 106,
      "mdef": 39,
      "agi": 81,
      "vit": 66,
      "int": 20,
      "dex": 82,
      "luk": 44,
      "hit": 372,
      "flee": 343
    },
    "combat": {
      "hp": 7238,
      "atkMin": 482,
      "atkMax": 544,
      "range": 1,
      "aspd": 161,
      "moveMs": 200,
      "baseExp": 1350,
      "jobExp": 1799,
      "speed": 80,
      "damage": 544
    },
    "visual": {
      "spriteKey": "teddy_bear",
      "color": "#98aa72",
      "shadow": "#344536",
      "radius": 14,
      "spriteUrl": "assets/irowiki/monsters/1622.png",
      "renderMode": "sprite",
      "facing": "left",
      "provenance": "irowiki-original"
    }
  },
  "injustice": {
    "id": 1257,
    "key": "injustice",
    "name": "Injustice",
    "source": "https://db.irowiki.org/db/monster-info/1257/",
    "sourceRefs": [
      "irowiki_monster_db",
      "irowiki_monster_injustice",
      "irowiki_monster_expansion_filter"
    ],
    "classification": {
      "size": "medium",
      "race": "undead",
      "element": "shadow",
      "elementLevel": 2,
      "modes": [
        "aggressive"
      ]
    },
    "stats": {
      "level": 95,
      "def": 76,
      "mdef": 31,
      "agi": 59,
      "vit": 58,
      "int": 65,
      "dex": 88,
      "luk": 50,
      "hit": 354,
      "flee": 353
    },
    "combat": {
      "hp": 7952,
      "atkMin": 447,
      "atkMax": 563,
      "range": 1,
      "aspd": 161.5,
      "moveMs": 400,
      "baseExp": 1574,
      "jobExp": 1997,
      "speed": 40,
      "damage": 563
    },
    "visual": {
      "spriteKey": "injustice",
      "color": "#98aa72",
      "shadow": "#344536",
      "radius": 18,
      "spriteUrl": "assets/irowiki/monsters/1257.png",
      "renderMode": "sprite",
      "facing": "left",
      "provenance": "irowiki-original"
    }
  },
  "roween": {
    "id": 1782,
    "key": "roween",
    "name": "Roween",
    "source": "https://db.irowiki.org/db/monster-info/1782/",
    "sourceRefs": [
      "irowiki_monster_db",
      "irowiki_monster_roween",
      "irowiki_monster_expansion_filter"
    ],
    "classification": {
      "size": "medium",
      "race": "brute",
      "element": "wind",
      "elementLevel": 1,
      "modes": [
        "passive",
        "looter"
      ]
    },
    "stats": {
      "level": 95,
      "def": 73,
      "mdef": 33,
      "agi": 82,
      "vit": 55,
      "int": 45,
      "dex": 108,
      "luk": 25,
      "hit": 377,
      "flee": 373
    },
    "combat": {
      "hp": 7385,
      "atkMin": 588,
      "atkMax": 623,
      "range": 1,
      "aspd": 158,
      "moveMs": 200,
      "baseExp": 1691,
      "jobExp": 1902,
      "speed": 80,
      "damage": 623
    },
    "visual": {
      "spriteKey": "roween",
      "color": "#98aa72",
      "shadow": "#344536",
      "radius": 18,
      "spriteUrl": "assets/irowiki/monsters/1782.png",
      "renderMode": "sprite",
      "facing": "left",
      "provenance": "irowiki-original"
    }
  }
};
  for (const [key,m] of Object.entries(records)) {
    if (window.RS_MONSTERS[key] || Object.values(window.RS_MONSTERS).some(old=>old.id===m.id)) throw Error("Duplicate monster: "+key);
    window.RS_MONSTERS[key]=m;
  }
  Object.assign(window.RS_SOURCES.records, {
  "irowiki_monster_drops": {
    "id": "irowiki_monster_drops",
    "type": "monster",
    "authority": "database",
    "title": "Drops — iRO Wiki DB",
    "url": "https://db.irowiki.org/db/monster-info/1113/"
  },
  "irowiki_monster_chonchon": {
    "id": "irowiki_monster_chonchon",
    "type": "monster",
    "authority": "database",
    "title": "Chonchon — iRO Wiki DB",
    "url": "https://db.irowiki.org/db/monster-info/1011/"
  },
  "irowiki_monster_willow": {
    "id": "irowiki_monster_willow",
    "type": "monster",
    "authority": "database",
    "title": "Willow — iRO Wiki DB",
    "url": "https://db.irowiki.org/db/monster-info/1010/"
  },
  "irowiki_monster_hornet": {
    "id": "irowiki_monster_hornet",
    "type": "monster",
    "authority": "database",
    "title": "Hornet — iRO Wiki DB",
    "url": "https://db.irowiki.org/db/monster-info/1004/"
  },
  "irowiki_monster_condor": {
    "id": "irowiki_monster_condor",
    "type": "monster",
    "authority": "database",
    "title": "Condor — iRO Wiki DB",
    "url": "https://db.irowiki.org/db/monster-info/1009/"
  },
  "irowiki_monster_roda_frog": {
    "id": "irowiki_monster_roda_frog",
    "type": "monster",
    "authority": "database",
    "title": "Roda Frog — iRO Wiki DB",
    "url": "https://db.irowiki.org/db/monster-info/1012/"
  },
  "irowiki_monster_spore": {
    "id": "irowiki_monster_spore",
    "type": "monster",
    "authority": "database",
    "title": "Spore — iRO Wiki DB",
    "url": "https://db.irowiki.org/db/monster-info/1014/"
  },
  "irowiki_monster_stainer": {
    "id": "irowiki_monster_stainer",
    "type": "monster",
    "authority": "database",
    "title": "Stainer — iRO Wiki DB",
    "url": "https://db.irowiki.org/db/monster-info/1174/"
  },
  "irowiki_monster_peco_peco": {
    "id": "irowiki_monster_peco_peco",
    "type": "monster",
    "authority": "database",
    "title": "Peco Peco — iRO Wiki DB",
    "url": "https://db.irowiki.org/db/monster-info/1019/"
  },
  "irowiki_monster_skeleton": {
    "id": "irowiki_monster_skeleton",
    "type": "monster",
    "authority": "database",
    "title": "Skeleton — iRO Wiki DB",
    "url": "https://db.irowiki.org/db/monster-info/1076/"
  },
  "irowiki_monster_andre": {
    "id": "irowiki_monster_andre",
    "type": "monster",
    "authority": "database",
    "title": "Andre — iRO Wiki DB",
    "url": "https://db.irowiki.org/db/monster-info/1095/"
  },
  "irowiki_monster_vitata": {
    "id": "irowiki_monster_vitata",
    "type": "monster",
    "authority": "database",
    "title": "Vitata — iRO Wiki DB",
    "url": "https://db.irowiki.org/db/monster-info/1176/"
  },
  "irowiki_monster_cookie_red": {
    "id": "irowiki_monster_cookie_red",
    "type": "monster",
    "authority": "database",
    "title": "Cookie (Red) — iRO Wiki DB",
    "url": "https://db.irowiki.org/db/monster-info/1246/"
  },
  "irowiki_monster_yoyo": {
    "id": "irowiki_monster_yoyo",
    "type": "monster",
    "authority": "database",
    "title": "Yoyo — iRO Wiki DB",
    "url": "https://db.irowiki.org/db/monster-info/1057/"
  },
  "irowiki_monster_thara_frog": {
    "id": "irowiki_monster_thara_frog",
    "type": "monster",
    "authority": "database",
    "title": "Thara Frog — iRO Wiki DB",
    "url": "https://db.irowiki.org/db/monster-info/1034/"
  },
  "irowiki_monster_giearth": {
    "id": "irowiki_monster_giearth",
    "type": "monster",
    "authority": "database",
    "title": "Giearth — iRO Wiki DB",
    "url": "https://db.irowiki.org/db/monster-info/1121/"
  },
  "irowiki_monster_orc_lady": {
    "id": "irowiki_monster_orc_lady",
    "type": "monster",
    "authority": "database",
    "title": "Orc Lady — iRO Wiki DB",
    "url": "https://db.irowiki.org/db/monster-info/1273/"
  },
  "irowiki_monster_pirate_skeleton": {
    "id": "irowiki_monster_pirate_skeleton",
    "type": "monster",
    "authority": "database",
    "title": "Pirate Skeleton — iRO Wiki DB",
    "url": "https://db.irowiki.org/db/monster-info/1071/"
  },
  "irowiki_monster_verit": {
    "id": "irowiki_monster_verit",
    "type": "monster",
    "authority": "database",
    "title": "Verit — iRO Wiki DB",
    "url": "https://db.irowiki.org/db/monster-info/1032/"
  },
  "irowiki_monster_metaller": {
    "id": "irowiki_monster_metaller",
    "type": "monster",
    "authority": "database",
    "title": "Metaller — iRO Wiki DB",
    "url": "https://db.irowiki.org/db/monster-info/1058/"
  },
  "irowiki_monster_alligator": {
    "id": "irowiki_monster_alligator",
    "type": "monster",
    "authority": "database",
    "title": "Alligator — iRO Wiki DB",
    "url": "https://db.irowiki.org/db/monster-info/1271/"
  },
  "irowiki_monster_sandman": {
    "id": "irowiki_monster_sandman",
    "type": "monster",
    "authority": "database",
    "title": "Sandman — iRO Wiki DB",
    "url": "https://db.irowiki.org/db/monster-info/1165/"
  },
  "irowiki_monster_hode": {
    "id": "irowiki_monster_hode",
    "type": "monster",
    "authority": "database",
    "title": "Hode — iRO Wiki DB",
    "url": "https://db.irowiki.org/db/monster-info/1127/"
  },
  "irowiki_monster_mantis": {
    "id": "irowiki_monster_mantis",
    "type": "monster",
    "authority": "database",
    "title": "Mantis — iRO Wiki DB",
    "url": "https://db.irowiki.org/db/monster-info/1139/"
  },
  "irowiki_monster_dokebi": {
    "id": "irowiki_monster_dokebi",
    "type": "monster",
    "authority": "database",
    "title": "Dokebi — iRO Wiki DB",
    "url": "https://db.irowiki.org/db/monster-info/1110/"
  },
  "irowiki_monster_sasquatch": {
    "id": "irowiki_monster_sasquatch",
    "type": "monster",
    "authority": "database",
    "title": "Sasquatch — iRO Wiki DB",
    "url": "https://db.irowiki.org/db/monster-info/1243/"
  },
  "irowiki_monster_grand_peco": {
    "id": "irowiki_monster_grand_peco",
    "type": "monster",
    "authority": "database",
    "title": "Grand Peco — iRO Wiki DB",
    "url": "https://db.irowiki.org/db/monster-info/1369/"
  },
  "irowiki_monster_wraith": {
    "id": "irowiki_monster_wraith",
    "type": "monster",
    "authority": "database",
    "title": "Wraith — iRO Wiki DB",
    "url": "https://db.irowiki.org/db/monster-info/1192/"
  },
  "irowiki_monster_high_orc": {
    "id": "irowiki_monster_high_orc",
    "type": "monster",
    "authority": "database",
    "title": "High Orc — iRO Wiki DB",
    "url": "https://db.irowiki.org/db/monster-info/1213/"
  },
  "irowiki_monster_harpy": {
    "id": "irowiki_monster_harpy",
    "type": "monster",
    "authority": "database",
    "title": "Harpy — iRO Wiki DB",
    "url": "https://db.irowiki.org/db/monster-info/1376/"
  },
  "irowiki_monster_porcellio": {
    "id": "irowiki_monster_porcellio",
    "type": "monster",
    "authority": "database",
    "title": "Porcellio — iRO Wiki DB",
    "url": "https://db.irowiki.org/db/monster-info/1619/"
  },
  "irowiki_monster_spring_rabbit": {
    "id": "irowiki_monster_spring_rabbit",
    "type": "monster",
    "authority": "database",
    "title": "Spring Rabbit — iRO Wiki DB",
    "url": "https://db.irowiki.org/db/monster-info/1322/"
  },
  "irowiki_monster_teddy_bear": {
    "id": "irowiki_monster_teddy_bear",
    "type": "monster",
    "authority": "database",
    "title": "Teddy Bear — iRO Wiki DB",
    "url": "https://db.irowiki.org/db/monster-info/1622/"
  },
  "irowiki_monster_injustice": {
    "id": "irowiki_monster_injustice",
    "type": "monster",
    "authority": "database",
    "title": "Injustice — iRO Wiki DB",
    "url": "https://db.irowiki.org/db/monster-info/1257/"
  },
  "irowiki_monster_roween": {
    "id": "irowiki_monster_roween",
    "type": "monster",
    "authority": "database",
    "title": "Roween — iRO Wiki DB",
    "url": "https://db.irowiki.org/db/monster-info/1782/"
  },
  "irowiki_monster_expansion_filter": {
    "id": "irowiki_monster_expansion_filter",
    "type": "monster-index",
    "authority": "database",
    "title": "User filter: normal monsters Lv. 1–95, HP 45–10000",
    "url": "https://db.irowiki.org/db/monster-search/?search&boss=0&category=1&hp=6,45,10000&level=6,1,95&ltype=1&sort=1,1&header=10"
  }
});
  window.RS_MONSTER_EXPANSION_ARTWORK = [
  {
    "id": 1113,
    "key": "drops",
    "name": "Drops",
    "stats": {
      "level": 2,
      "hp": 45,
      "atkMin": 12,
      "atkMax": 13,
      "def": 16,
      "mdef": 0,
      "baseExp": 27,
      "jobExp": 20,
      "aspd": 131.4,
      "moveMs": 400,
      "hit": 203,
      "flee": 178,
      "range": 1,
      "agi": 1,
      "vit": 1,
      "int": 0,
      "dex": 6,
      "luk": 2
    },
    "group": "monsters",
    "sourceUrl": "https://db.irowiki.org/db/monster-info/1113/",
    "imageSourceUrl": "https://db.irowiki.org/image/monster/1113.png",
    "path": "assets/irowiki/monsters/1113.png",
    "sha256": "dbd71afda6c077e480cc014d75cd60ae9daaf69978004f9f3357b89ff4fb5995",
    "bytes": 1601,
    "width": 41,
    "height": 39
  },
  {
    "id": 1011,
    "key": "chonchon",
    "name": "Chonchon",
    "stats": {
      "level": 5,
      "hp": 57,
      "atkMin": 11,
      "atkMax": 14,
      "def": 27,
      "mdef": 0,
      "baseExp": 45,
      "jobExp": 36,
      "aspd": 146.2,
      "moveMs": 200,
      "hit": 209,
      "flee": 183,
      "range": 1,
      "agi": 4,
      "vit": 4,
      "int": 0,
      "dex": 8,
      "luk": 5
    },
    "group": "monsters",
    "sourceUrl": "https://db.irowiki.org/db/monster-info/1011/",
    "imageSourceUrl": "https://db.irowiki.org/image/monster/1011.png",
    "path": "assets/irowiki/monsters/1011.png",
    "sha256": "7a1f0eba1986e38cb88a5d82663881a6c9c04df274b80f5c285288ca72e22824",
    "bytes": 4898,
    "width": 37,
    "height": 33
  },
  {
    "id": 1010,
    "key": "willow",
    "name": "Willow",
    "stats": {
      "level": 8,
      "hp": 91,
      "atkMin": 13,
      "atkMax": 18,
      "def": 38,
      "mdef": 2,
      "baseExp": 63,
      "jobExp": 47,
      "aspd": 116.4,
      "moveMs": 200,
      "hit": 211,
      "flee": 190,
      "range": 1,
      "agi": 3,
      "vit": 8,
      "int": 5,
      "dex": 12,
      "luk": 5
    },
    "group": "monsters",
    "sourceUrl": "https://db.irowiki.org/db/monster-info/1010/",
    "imageSourceUrl": "https://db.irowiki.org/image/monster/1010.png",
    "path": "assets/irowiki/monsters/1010.png",
    "sha256": "8ae1db1f772a9d5a15320f264e24bf05af6f06575c861873a05ba12a15d2cbed",
    "bytes": 5834,
    "width": 69,
    "height": 75
  },
  {
    "id": 1004,
    "key": "hornet",
    "name": "Hornet",
    "stats": {
      "level": 11,
      "hp": 90,
      "atkMin": 13,
      "atkMax": 16,
      "def": 7,
      "mdef": 1,
      "baseExp": 81,
      "jobExp": 60,
      "aspd": 135.4,
      "moveMs": 150,
      "hit": 235,
      "flee": 187,
      "range": 1,
      "agi": 24,
      "vit": 4,
      "int": 5,
      "dex": 6,
      "luk": 5
    },
    "group": "monsters",
    "sourceUrl": "https://db.irowiki.org/db/monster-info/1004/",
    "imageSourceUrl": "https://db.irowiki.org/image/monster/1004.png",
    "path": "assets/irowiki/monsters/1004.png",
    "sha256": "fd95c3ffb03d2cea3cfa9f9790df0538f9d05b24d6a787587f989e4ff105cc06",
    "bytes": 5016,
    "width": 36,
    "height": 52
  },
  {
    "id": 1009,
    "key": "condor",
    "name": "Condor",
    "stats": {
      "level": 12,
      "hp": 114,
      "atkMin": 14,
      "atkMax": 20,
      "def": 7,
      "mdef": 5,
      "baseExp": 81,
      "jobExp": 60,
      "aspd": 142.6,
      "moveMs": 150,
      "hit": 219,
      "flee": 195,
      "range": 1,
      "agi": 7,
      "vit": 6,
      "int": 0,
      "dex": 13,
      "luk": 5
    },
    "group": "monsters",
    "sourceUrl": "https://db.irowiki.org/db/monster-info/1009/",
    "imageSourceUrl": "https://db.irowiki.org/image/monster/1009.png",
    "path": "assets/irowiki/monsters/1009.png",
    "sha256": "c71271eae8a5ae172f49f917d70c1b9b069502f42a739fbc95a111c4266431e5",
    "bytes": 6069,
    "width": 60,
    "height": 60
  },
  {
    "id": 1012,
    "key": "roda_frog",
    "name": "Roda Frog",
    "stats": {
      "level": 13,
      "hp": 160,
      "atkMin": 19,
      "atkMax": 23,
      "def": 12,
      "mdef": 5,
      "baseExp": 90,
      "jobExp": 68,
      "aspd": 99.2,
      "moveMs": 200,
      "hit": 219,
      "flee": 197,
      "range": 1,
      "agi": 6,
      "vit": 4,
      "int": 0,
      "dex": 14,
      "luk": 9
    },
    "group": "monsters",
    "sourceUrl": "https://db.irowiki.org/db/monster-info/1012/",
    "imageSourceUrl": "https://db.irowiki.org/image/monster/1012.png",
    "path": "assets/irowiki/monsters/1012.png",
    "sha256": "e629aaa2d321faa068e99923805a36b31d184431c68a8e1d98b546ea2c583ca3",
    "bytes": 1464,
    "width": 44,
    "height": 53
  },
  {
    "id": 1014,
    "key": "spore",
    "name": "Spore",
    "stats": {
      "level": 18,
      "hp": 280,
      "atkMin": 25,
      "atkMax": 33,
      "def": 12,
      "mdef": 10,
      "baseExp": 117,
      "jobExp": 87,
      "aspd": 106.4,
      "moveMs": 200,
      "hit": 223,
      "flee": 200,
      "range": 1,
      "agi": 5,
      "vit": 10,
      "int": 0,
      "dex": 12,
      "luk": 0
    },
    "group": "monsters",
    "sourceUrl": "https://db.irowiki.org/db/monster-info/1014/",
    "imageSourceUrl": "https://db.irowiki.org/image/monster/1014.png",
    "path": "assets/irowiki/monsters/1014.png",
    "sha256": "3d273b1243e1fc1f3489c97c850025c26f45194693fbffe00e74ffb4144266bf",
    "bytes": 7408,
    "width": 53,
    "height": 54
  },
  {
    "id": 1174,
    "key": "stainer",
    "name": "Stainer",
    "stats": {
      "level": 21,
      "hp": 365,
      "atkMin": 65,
      "atkMax": 74,
      "def": 22,
      "mdef": 25,
      "baseExp": 126,
      "jobExp": 143,
      "aspd": 115.6,
      "moveMs": 200,
      "hit": 231,
      "flee": 230,
      "range": 1,
      "agi": 10,
      "vit": 24,
      "int": 0,
      "dex": 39,
      "luk": 15
    },
    "group": "monsters",
    "sourceUrl": "https://db.irowiki.org/db/monster-info/1174/",
    "imageSourceUrl": "https://db.irowiki.org/image/monster/1174.png",
    "path": "assets/irowiki/monsters/1174.png",
    "sha256": "d853cf6a9401dc7c0bb79e93747dbd1de6924c420eafc1b3231b48799edf13e4",
    "bytes": 831,
    "width": 22,
    "height": 20
  },
  {
    "id": 1019,
    "key": "peco_peco",
    "name": "Peco Peco",
    "stats": {
      "level": 25,
      "hp": 446,
      "atkMin": 76,
      "atkMax": 83,
      "def": 48,
      "mdef": 0,
      "baseExp": 162,
      "jobExp": 183,
      "aspd": 121.8,
      "moveMs": 200,
      "hit": 235,
      "flee": 223,
      "range": 1,
      "agi": 10,
      "vit": 13,
      "int": 5,
      "dex": 28,
      "luk": 5
    },
    "group": "monsters",
    "sourceUrl": "https://db.irowiki.org/db/monster-info/1019/",
    "imageSourceUrl": "https://db.irowiki.org/image/monster/1019.png",
    "path": "assets/irowiki/monsters/1019.png",
    "sha256": "2f978895c2de4ec6ab55368f9730dab6113cdd2ad25735844c738c9dc51ed86a",
    "bytes": 6602,
    "width": 64,
    "height": 90
  },
  {
    "id": 1076,
    "key": "skeleton",
    "name": "Skeleton",
    "stats": {
      "level": 27,
      "hp": 612,
      "atkMin": 78,
      "atkMax": 102,
      "def": 21,
      "mdef": 2,
      "baseExp": 162,
      "jobExp": 183,
      "aspd": 88.6,
      "moveMs": 200,
      "hit": 242,
      "flee": 216,
      "range": 1,
      "agi": 15,
      "vit": 30,
      "int": 5,
      "dex": 19,
      "luk": 1
    },
    "group": "monsters",
    "sourceUrl": "https://db.irowiki.org/db/monster-info/1076/",
    "imageSourceUrl": "https://db.irowiki.org/image/monster/1076.png",
    "path": "assets/irowiki/monsters/1076.png",
    "sha256": "3e120d6b071901aa2ae1d18ce1bb5ba97cbd5ee232a93893fd1b7af6b1b2fbab",
    "bytes": 10015,
    "width": 79,
    "height": 91
  },
  {
    "id": 1095,
    "key": "andre",
    "name": "Andre",
    "stats": {
      "level": 33,
      "hp": 724,
      "atkMin": 51,
      "atkMax": 72,
      "def": 55,
      "mdef": 16,
      "baseExp": 216,
      "jobExp": 243,
      "aspd": 135.6,
      "moveMs": 300,
      "hit": 253,
      "flee": 227,
      "range": 1,
      "agi": 20,
      "vit": 40,
      "int": 10,
      "dex": 24,
      "luk": 10
    },
    "group": "monsters",
    "sourceUrl": "https://db.irowiki.org/db/monster-info/1095/",
    "imageSourceUrl": "https://db.irowiki.org/image/monster/1095.png",
    "path": "assets/irowiki/monsters/1095.png",
    "sha256": "ed172e60ee7e080647d399f464706fbe24343b327553cfd4a863f1493a4baa6e",
    "bytes": 3362,
    "width": 49,
    "height": 36
  },
  {
    "id": 1176,
    "key": "vitata",
    "name": "Vitata",
    "stats": {
      "level": 35,
      "hp": 756,
      "atkMin": 68,
      "atkMax": 86,
      "def": 44,
      "mdef": 12,
      "baseExp": 234,
      "jobExp": 264,
      "aspd": 111.6,
      "moveMs": 300,
      "hit": 246,
      "flee": 226,
      "range": 1,
      "agi": 11,
      "vit": 24,
      "int": 20,
      "dex": 21,
      "luk": 5
    },
    "group": "monsters",
    "sourceUrl": "https://db.irowiki.org/db/monster-info/1176/",
    "imageSourceUrl": "https://db.irowiki.org/image/monster/1176.png",
    "path": "assets/irowiki/monsters/1176.png",
    "sha256": "e530f623c7375ef062188e64d48e858ecb52c76f77993813b34c60420a4aba38",
    "bytes": 2964,
    "width": 44,
    "height": 35
  },
  {
    "id": 1246,
    "key": "cookie_red",
    "name": "Cookie (Red)",
    "stats": {
      "level": 37,
      "hp": 733,
      "atkMin": 70,
      "atkMax": 105,
      "def": 48,
      "mdef": 36,
      "baseExp": 282,
      "jobExp": 317,
      "aspd": 137.6,
      "moveMs": 400,
      "hit": 253,
      "flee": 232,
      "range": 1,
      "agi": 16,
      "vit": 30,
      "int": 20,
      "dex": 25,
      "luk": 5
    },
    "group": "monsters",
    "sourceUrl": "https://db.irowiki.org/db/monster-info/1246/",
    "imageSourceUrl": "https://db.irowiki.org/image/monster/1246.png",
    "path": "assets/irowiki/monsters/1246.png",
    "sha256": "e8cb27929ae2445ed1c3c84fea52f6ef8e37e7e0241bb8d4b57f777dc3d0fc63",
    "bytes": 3823,
    "width": 30,
    "height": 55
  },
  {
    "id": 1057,
    "key": "yoyo",
    "name": "Yoyo",
    "stats": {
      "level": 38,
      "hp": 898,
      "atkMin": 63,
      "atkMax": 74,
      "def": 40,
      "mdef": 0,
      "baseExp": 270,
      "jobExp": 305,
      "aspd": 147.3,
      "moveMs": 200,
      "hit": 249,
      "flee": 227,
      "range": 1,
      "agi": 11,
      "vit": 34,
      "int": 20,
      "dex": 19,
      "luk": 10
    },
    "group": "monsters",
    "sourceUrl": "https://db.irowiki.org/db/monster-info/1057/",
    "imageSourceUrl": "https://db.irowiki.org/image/monster/1057.png",
    "path": "assets/irowiki/monsters/1057.png",
    "sha256": "4fff00a35c8455211c792e2e1783151d56f570075efd3fa91860cc4a0ece9e81",
    "bytes": 2210,
    "width": 33,
    "height": 36
  },
  {
    "id": 1034,
    "key": "thara_frog",
    "name": "Thara Frog",
    "stats": {
      "level": 40,
      "hp": 1157,
      "atkMin": 73,
      "atkMax": 103,
      "def": 37,
      "mdef": 17,
      "baseExp": 311,
      "jobExp": 350,
      "aspd": 99.2,
      "moveMs": 200,
      "hit": 250,
      "flee": 240,
      "range": 1,
      "agi": 10,
      "vit": 10,
      "int": 18,
      "dex": 30,
      "luk": 2
    },
    "group": "monsters",
    "sourceUrl": "https://db.irowiki.org/db/monster-info/1034/",
    "imageSourceUrl": "https://db.irowiki.org/image/monster/1034.png",
    "path": "assets/irowiki/monsters/1034.png",
    "sha256": "40ff42d32a4cc86b443a5b95d887e9a6c803841f48973ecc1ae86095c7f949cc",
    "bytes": 1464,
    "width": 44,
    "height": 53
  },
  {
    "id": 1121,
    "key": "giearth",
    "name": "Giearth",
    "stats": {
      "level": 42,
      "hp": 1118,
      "atkMin": 70,
      "atkMax": 85,
      "def": 52,
      "mdef": 16,
      "baseExp": 315,
      "jobExp": 354,
      "aspd": 107.6,
      "moveMs": 200,
      "hit": 261,
      "flee": 240,
      "range": 1,
      "agi": 19,
      "vit": 30,
      "int": 10,
      "dex": 28,
      "luk": 15
    },
    "group": "monsters",
    "sourceUrl": "https://db.irowiki.org/db/monster-info/1121/",
    "imageSourceUrl": "https://db.irowiki.org/image/monster/1121.png",
    "path": "assets/irowiki/monsters/1121.png",
    "sha256": "2e08c90fb421f93bc08288d32de6b0d412470d18364c433d017d33d310eefe91",
    "bytes": 7690,
    "width": 102,
    "height": 49
  },
  {
    "id": 1273,
    "key": "orc_lady",
    "name": "Orc Lady",
    "stats": {
      "level": 45,
      "hp": 1520,
      "atkMin": 77,
      "atkMax": 110,
      "def": 83,
      "mdef": 17,
      "baseExp": 380,
      "jobExp": 435,
      "aspd": 147.5,
      "moveMs": 200,
      "hit": 256,
      "flee": 272,
      "range": 1,
      "agi": 11,
      "vit": 28,
      "int": 10,
      "dex": 57,
      "luk": 5
    },
    "group": "monsters",
    "sourceUrl": "https://db.irowiki.org/db/monster-info/1273/",
    "imageSourceUrl": "https://db.irowiki.org/image/monster/1273.png",
    "path": "assets/irowiki/monsters/1273.png",
    "sha256": "e781631ff71573b56ad3c5bc5323395c647326f9c99cf1ba09a4aeeeca25dc48",
    "bytes": 15544,
    "width": 76,
    "height": 90
  },
  {
    "id": 1071,
    "key": "pirate_skeleton",
    "name": "Pirate Skeleton",
    "stats": {
      "level": 48,
      "hp": 1411,
      "atkMin": 105,
      "atkMax": 125,
      "def": 53,
      "mdef": 20,
      "baseExp": 369,
      "jobExp": 414,
      "aspd": 112.3,
      "moveMs": 200,
      "hit": 273,
      "flee": 248,
      "range": 1,
      "agi": 25,
      "vit": 25,
      "int": 15,
      "dex": 30,
      "luk": 10
    },
    "group": "monsters",
    "sourceUrl": "https://db.irowiki.org/db/monster-info/1071/",
    "imageSourceUrl": "https://db.irowiki.org/image/monster/1071.png",
    "path": "assets/irowiki/monsters/1071.png",
    "sha256": "d6175394c6860918f00008aa65f31ec44bfd3a0206b3daca399b60729e9e6255",
    "bytes": 4419,
    "width": 46,
    "height": 90
  },
  {
    "id": 1032,
    "key": "verit",
    "name": "Verit",
    "stats": {
      "level": 52,
      "hp": 1944,
      "atkMin": 139,
      "atkMax": 159,
      "def": 63,
      "mdef": 10,
      "baseExp": 414,
      "jobExp": 467,
      "aspd": 76.6,
      "moveMs": 250,
      "hit": 256,
      "flee": 228,
      "range": 1,
      "agi": 4,
      "vit": 25,
      "int": 10,
      "dex": 6,
      "luk": 5
    },
    "group": "monsters",
    "sourceUrl": "https://db.irowiki.org/db/monster-info/1032/",
    "imageSourceUrl": "https://db.irowiki.org/image/monster/1032.png",
    "path": "assets/irowiki/monsters/1032.png",
    "sha256": "fbd35900f132c1ca86ae6de321bff02bf92fdc4cdf12a6d2e6eb1e9d5b9676d4",
    "bytes": 11111,
    "width": 69,
    "height": 68
  },
  {
    "id": 1058,
    "key": "metaller",
    "name": "Metaller",
    "stats": {
      "level": 55,
      "hp": 1687,
      "atkMin": 196,
      "atkMax": 237,
      "def": 72,
      "mdef": 12,
      "baseExp": 450,
      "jobExp": 507,
      "aspd": 114.6,
      "moveMs": 200,
      "hit": 279,
      "flee": 277,
      "range": 1,
      "agi": 24,
      "vit": 10,
      "int": 0,
      "dex": 52,
      "luk": 31
    },
    "group": "monsters",
    "sourceUrl": "https://db.irowiki.org/db/monster-info/1058/",
    "imageSourceUrl": "https://db.irowiki.org/image/monster/1058.png",
    "path": "assets/irowiki/monsters/1058.png",
    "sha256": "247f64723bdf3a4e775deaaf183e93822b763bdf862069c153b8a48a851ff13c",
    "bytes": 19365,
    "width": 62,
    "height": 117
  },
  {
    "id": 1271,
    "key": "alligator",
    "name": "Alligator",
    "stats": {
      "level": 57,
      "hp": 2430,
      "atkMin": 158,
      "atkMax": 195,
      "def": 62,
      "mdef": 30,
      "baseExp": 486,
      "jobExp": 548,
      "aspd": 145,
      "moveMs": 200,
      "hit": 305,
      "flee": 267,
      "range": 1,
      "agi": 48,
      "vit": 24,
      "int": 15,
      "dex": 40,
      "luk": 26
    },
    "group": "monsters",
    "sourceUrl": "https://db.irowiki.org/db/monster-info/1271/",
    "imageSourceUrl": "https://db.irowiki.org/image/monster/1271.png",
    "path": "assets/irowiki/monsters/1271.png",
    "sha256": "45e5560a032efd6d66dc14c96fa938a54ec629eddc0ea4ec633916732128d348",
    "bytes": 6731,
    "width": 87,
    "height": 77
  },
  {
    "id": 1165,
    "key": "sandman",
    "name": "Sandman",
    "stats": {
      "level": 61,
      "hp": 2887,
      "atkMin": 164,
      "atkMax": 220,
      "def": 126,
      "mdef": 24,
      "baseExp": 626,
      "jobExp": 705,
      "aspd": 116.4,
      "moveMs": 250,
      "hit": 269,
      "flee": 265,
      "range": 1,
      "agi": 8,
      "vit": 55,
      "int": 15,
      "dex": 34,
      "luk": 25
    },
    "group": "monsters",
    "sourceUrl": "https://db.irowiki.org/db/monster-info/1165/",
    "imageSourceUrl": "https://db.irowiki.org/image/monster/1165.png",
    "path": "assets/irowiki/monsters/1165.png",
    "sha256": "14bfbd1e6578207c79a0182ca94c86051f59933c6c44ccbf94eae37fcb15e260",
    "bytes": 3538,
    "width": 50,
    "height": 65
  },
  {
    "id": 1127,
    "key": "hode",
    "name": "Hode",
    "stats": {
      "level": 63,
      "hp": 2676,
      "atkMin": 179,
      "atkMax": 224,
      "def": 91,
      "mdef": 24,
      "baseExp": 632,
      "jobExp": 710,
      "aspd": 126,
      "moveMs": 200,
      "hit": 279,
      "flee": 265,
      "range": 1,
      "agi": 16,
      "vit": 42,
      "int": 5,
      "dex": 32,
      "luk": 40
    },
    "group": "monsters",
    "sourceUrl": "https://db.irowiki.org/db/monster-info/1127/",
    "imageSourceUrl": "https://db.irowiki.org/image/monster/1127.png",
    "path": "assets/irowiki/monsters/1127.png",
    "sha256": "f4dfca32b8d60e746122e5ea3d790d5a62a785668f43a81c1b7059fc5bab7554",
    "bytes": 3731,
    "width": 54,
    "height": 31
  },
  {
    "id": 1139,
    "key": "mantis",
    "name": "Mantis",
    "stats": {
      "level": 65,
      "hp": 2719,
      "atkMin": 187,
      "atkMax": 218,
      "def": 90,
      "mdef": 0,
      "baseExp": 594,
      "jobExp": 669,
      "aspd": 123.6,
      "moveMs": 200,
      "hit": 298,
      "flee": 281,
      "range": 1,
      "agi": 33,
      "vit": 24,
      "int": 5,
      "dex": 46,
      "luk": 15
    },
    "group": "monsters",
    "sourceUrl": "https://db.irowiki.org/db/monster-info/1139/",
    "imageSourceUrl": "https://db.irowiki.org/image/monster/1139.png",
    "path": "assets/irowiki/monsters/1139.png",
    "sha256": "873b4ced35c094616cb8ec71ed93afe5aa9a6d8331043d69127361e35ff80ac4",
    "bytes": 11310,
    "width": 42,
    "height": 80
  },
  {
    "id": 1110,
    "key": "dokebi",
    "name": "Dokebi",
    "stats": {
      "level": 68,
      "hp": 2820,
      "atkMin": 333,
      "atkMax": 363,
      "def": 85,
      "mdef": 20,
      "baseExp": 675,
      "jobExp": 759,
      "aspd": 142.2,
      "moveMs": 250,
      "hit": 324,
      "flee": 304,
      "range": 1,
      "agi": 56,
      "vit": 35,
      "int": 20,
      "dex": 66,
      "luk": 25
    },
    "group": "monsters",
    "sourceUrl": "https://db.irowiki.org/db/monster-info/1110/",
    "imageSourceUrl": "https://db.irowiki.org/image/monster/1110.png",
    "path": "assets/irowiki/monsters/1110.png",
    "sha256": "021ee6699ddc86b1f3af5dd784cb3e86afb0cbdf63c3b97caf430fc10e1a0342",
    "bytes": 5093,
    "width": 42,
    "height": 60
  },
  {
    "id": 1243,
    "key": "sasquatch",
    "name": "Sasquatch",
    "stats": {
      "level": 72,
      "hp": 3163,
      "atkMin": 293,
      "atkMax": 323,
      "def": 101,
      "mdef": 28,
      "baseExp": 765,
      "jobExp": 860,
      "aspd": 137,
      "moveMs": 300,
      "hit": 307,
      "flee": 313,
      "range": 1,
      "agi": 35,
      "vit": 60,
      "int": 10,
      "dex": 71,
      "luk": 20
    },
    "group": "monsters",
    "sourceUrl": "https://db.irowiki.org/db/monster-info/1243/",
    "imageSourceUrl": "https://db.irowiki.org/image/monster/1243.png",
    "path": "assets/irowiki/monsters/1243.png",
    "sha256": "d7ffa20f4b742575984b4d7acb011d7a957a70dcf881e491fdad11bba51c3258",
    "bytes": 13609,
    "width": 78,
    "height": 112
  },
  {
    "id": 1369,
    "key": "grand_peco",
    "name": "Grand Peco",
    "stats": {
      "level": 75,
      "hp": 3150,
      "atkMin": 348,
      "atkMax": 404,
      "def": 95,
      "mdef": 30,
      "baseExp": 887,
      "jobExp": 998,
      "aspd": 127,
      "moveMs": 165,
      "hit": 320,
      "flee": 306,
      "range": 2,
      "agi": 45,
      "vit": 50,
      "int": 23,
      "dex": 61,
      "luk": 25
    },
    "group": "monsters",
    "sourceUrl": "https://db.irowiki.org/db/monster-info/1369/",
    "imageSourceUrl": "https://db.irowiki.org/image/monster/1369.png",
    "path": "assets/irowiki/monsters/1369.png",
    "sha256": "d2168f4c3773abd20186ce0afcea97a2b4a1940e390e0c7fe699a9e981bb1d6b",
    "bytes": 47048,
    "width": 90,
    "height": 93
  },
  {
    "id": 1192,
    "key": "wraith",
    "name": "Wraith",
    "stats": {
      "level": 77,
      "hp": 5168,
      "atkMin": 369,
      "atkMax": 430,
      "def": 80,
      "mdef": 40,
      "baseExp": 1190,
      "jobExp": 1191,
      "aspd": 109.2,
      "moveMs": 300,
      "hit": 303,
      "flee": 338,
      "range": 1,
      "agi": 26,
      "vit": 30,
      "int": 55,
      "dex": 91,
      "luk": 5
    },
    "group": "monsters",
    "sourceUrl": "https://db.irowiki.org/db/monster-info/1192/",
    "imageSourceUrl": "https://db.irowiki.org/image/monster/1192.png",
    "path": "assets/irowiki/monsters/1192.png",
    "sha256": "364501331efc4659fd00c7a30c42828d59a8b5fb4253de92e7a4b12626b40733",
    "bytes": 19206,
    "width": 94,
    "height": 125
  },
  {
    "id": 1213,
    "key": "high_orc",
    "name": "High Orc",
    "stats": {
      "level": 81,
      "hp": 4193,
      "atkMin": 428,
      "atkMax": 478,
      "def": 101,
      "mdef": 45,
      "baseExp": 1099,
      "jobExp": 1158,
      "aspd": 125,
      "moveMs": 150,
      "hit": 297,
      "flee": 334,
      "range": 1,
      "agi": 16,
      "vit": 40,
      "int": 31,
      "dex": 83,
      "luk": 20
    },
    "group": "monsters",
    "sourceUrl": "https://db.irowiki.org/db/monster-info/1213/",
    "imageSourceUrl": "https://db.irowiki.org/image/monster/1213.png",
    "path": "assets/irowiki/monsters/1213.png",
    "sha256": "ef9cf39e8ff63203f121129d980f08802e6368144e2b5156dc33f3f47762b17f",
    "bytes": 12203,
    "width": 67,
    "height": 98
  },
  {
    "id": 1376,
    "key": "harpy",
    "name": "Harpy",
    "stats": {
      "level": 83,
      "hp": 4423,
      "atkMin": 340,
      "atkMax": 381,
      "def": 69,
      "mdef": 44,
      "baseExp": 1201,
      "jobExp": 1349,
      "aspd": 151.4,
      "moveMs": 155,
      "hit": 322,
      "flee": 378,
      "range": 1,
      "agi": 39,
      "vit": 50,
      "int": 31,
      "dex": 125,
      "luk": 12
    },
    "group": "monsters",
    "sourceUrl": "https://db.irowiki.org/db/monster-info/1376/",
    "imageSourceUrl": "https://db.irowiki.org/image/monster/1376.png",
    "path": "assets/irowiki/monsters/1376.png",
    "sha256": "de50856db9f81bfe87d98de14e6d6cea8667ead00e86a86a74b90d46722e49fa",
    "bytes": 14346,
    "width": 118,
    "height": 146
  },
  {
    "id": 1619,
    "key": "porcellio",
    "name": "Porcellio",
    "stats": {
      "level": 85,
      "hp": 5544,
      "atkMin": 293,
      "atkMax": 346,
      "def": 79,
      "mdef": 37,
      "baseExp": 1294,
      "jobExp": 1455,
      "aspd": 164,
      "moveMs": 150,
      "hit": 333,
      "flee": 329,
      "range": 1,
      "agi": 48,
      "vit": 28,
      "int": 40,
      "dex": 74,
      "luk": 30
    },
    "group": "monsters",
    "sourceUrl": "https://db.irowiki.org/db/monster-info/1619/",
    "imageSourceUrl": "https://db.irowiki.org/image/monster/1619.png",
    "path": "assets/irowiki/monsters/1619.png",
    "sha256": "5ccdbd44eeaba726c4393d59598b21a56be4517dd539b0c4420634d44126ddf8",
    "bytes": 423,
    "width": 39,
    "height": 35
  },
  {
    "id": 1322,
    "key": "spring_rabbit",
    "name": "Spring Rabbit",
    "stats": {
      "level": 88,
      "hp": 6684,
      "atkMin": 317,
      "atkMax": 357,
      "def": 108,
      "mdef": 42,
      "baseExp": 1341,
      "jobExp": 1509,
      "aspd": 144,
      "moveMs": 160,
      "hit": 354,
      "flee": 316,
      "range": 1,
      "agi": 66,
      "vit": 35,
      "int": 30,
      "dex": 58,
      "luk": 5
    },
    "group": "monsters",
    "sourceUrl": "https://db.irowiki.org/db/monster-info/1322/",
    "imageSourceUrl": "https://db.irowiki.org/image/monster/1322.png",
    "path": "assets/irowiki/monsters/1322.png",
    "sha256": "976638d6dfe662f945b25d8bca530c4cf265fea080e6c9d38f352856741b1e10",
    "bytes": 4540,
    "width": 53,
    "height": 86
  },
  {
    "id": 1622,
    "key": "teddy_bear",
    "name": "Teddy Bear",
    "stats": {
      "level": 91,
      "hp": 7238,
      "atkMin": 482,
      "atkMax": 544,
      "def": 106,
      "mdef": 39,
      "baseExp": 1350,
      "jobExp": 1799,
      "aspd": 161,
      "moveMs": 200,
      "hit": 372,
      "flee": 343,
      "range": 1,
      "agi": 81,
      "vit": 66,
      "int": 20,
      "dex": 82,
      "luk": 44
    },
    "group": "monsters",
    "sourceUrl": "https://db.irowiki.org/db/monster-info/1622/",
    "imageSourceUrl": "https://db.irowiki.org/image/monster/1622.png",
    "path": "assets/irowiki/monsters/1622.png",
    "sha256": "f72d152fd6fe03a6cfc8ad7ce6e0ffabc74f2467ff3b144611967a05f84da7a6",
    "bytes": 504,
    "width": 30,
    "height": 44
  },
  {
    "id": 1257,
    "key": "injustice",
    "name": "Injustice",
    "stats": {
      "level": 95,
      "hp": 7952,
      "atkMin": 447,
      "atkMax": 563,
      "def": 76,
      "mdef": 31,
      "baseExp": 1574,
      "jobExp": 1997,
      "aspd": 161.5,
      "moveMs": 400,
      "hit": 354,
      "flee": 353,
      "range": 1,
      "agi": 59,
      "vit": 58,
      "int": 65,
      "dex": 88,
      "luk": 50
    },
    "group": "monsters",
    "sourceUrl": "https://db.irowiki.org/db/monster-info/1257/",
    "imageSourceUrl": "https://db.irowiki.org/image/monster/1257.png",
    "path": "assets/irowiki/monsters/1257.png",
    "sha256": "f402893f67c8e166c95c0116e8a4931ab4b15a2788e552611dc8c0023ebbc1e5",
    "bytes": 31476,
    "width": 53,
    "height": 115
  },
  {
    "id": 1782,
    "key": "roween",
    "name": "Roween",
    "stats": {
      "level": 95,
      "hp": 7385,
      "atkMin": 588,
      "atkMax": 623,
      "def": 73,
      "mdef": 33,
      "baseExp": 1691,
      "jobExp": 1902,
      "aspd": 158,
      "moveMs": 200,
      "hit": 377,
      "flee": 373,
      "range": 1,
      "agi": 82,
      "vit": 55,
      "int": 45,
      "dex": 108,
      "luk": 25
    },
    "group": "monsters",
    "sourceUrl": "https://db.irowiki.org/db/monster-info/1782/",
    "imageSourceUrl": "https://db.irowiki.org/image/monster/1782.png",
    "path": "assets/irowiki/monsters/1782.png",
    "sha256": "0ee38ad9f0ef1de84c6352a4ef84c60007f5e2d70722cdec649a1225427ce574",
    "bytes": 2827,
    "width": 56,
    "height": 79
  }
];
})();
