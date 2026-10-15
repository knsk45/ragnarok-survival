// Classic maxima, prerequisites and SP costs; runtime pacing adapts skills to Survivor.
window.RS_HUNTER_SKILLS = [
  {
    "id": "arrow_shower",
    "name": "Arrow Shower",
    "icon": "🏹",
    "jobId": "archer",
    "maxLevel": 10,
    "stateKey": "arrow_shower",
    "spendable": true,
    "spCost": 15,
    "cooldown": 2.5,
    "requires": [
      {
        "skillId": "double_strafe",
        "level": 5
      }
    ],
    "description": "Залп по области вокруг выбранной цели с отбрасыванием.",
    "type": "active",
    "runtime": {
      "kind": "hunter",
      "action": "shower",
      "priority": 8,
      "range": 400
    },
    "implemented": true,
    "source": "https://irowiki.org/classic/Arrow_Shower",
    "sourceRefs": [
      "classic_skill_arrow_shower"
    ],
    "iconUrl": "assets/irowiki/skills/arrow_shower.png",
    "utility": false
  },
  {
    "id": "double_strafe",
    "name": "Double Strafe",
    "icon": "🏹",
    "jobId": "archer",
    "maxLevel": 10,
    "stateKey": "double_strafe",
    "spendable": true,
    "spCost": 12,
    "cooldown": 1.2,
    "requires": [],
    "description": "Две стрелы по одной цели. Урон каждого попадания растёт с уровнем навыка.",
    "type": "active",
    "runtime": {
      "kind": "hunter",
      "action": "double",
      "priority": 5,
      "range": 400
    },
    "implemented": true,
    "source": "https://irowiki.org/classic/Double_Strafe",
    "sourceRefs": [
      "classic_skill_double_strafe"
    ],
    "iconUrl": "assets/irowiki/skills/double_strafe.png",
    "utility": false
  },
  {
    "id": "improve_concentration",
    "name": "Improve Concentration",
    "icon": "🏹",
    "jobId": "archer",
    "maxLevel": 10,
    "stateKey": "improve_concentration",
    "spendable": true,
    "spCost": 25,
    "cooldown": 4,
    "requires": [
      {
        "skillId": "vultures_eye",
        "level": 1
      }
    ],
    "description": "Временно повышает AGI и DEX на 3–12%.",
    "type": "active",
    "runtime": {
      "kind": "hunter",
      "action": "concentration",
      "priority": 4,
      "range": 400
    },
    "implemented": true,
    "source": "https://irowiki.org/classic/Improve_Concentration",
    "sourceRefs": [
      "classic_skill_improve_concentration"
    ],
    "iconUrl": "assets/irowiki/skills/improve_concentration.png",
    "utility": false,
    "spCosts": [
      25,
      30,
      35,
      40,
      45,
      50,
      55,
      60,
      65,
      70
    ]
  },
  {
    "id": "owls_eye",
    "name": "Owl's Eye",
    "icon": "🏹",
    "jobId": "archer",
    "maxLevel": 10,
    "stateKey": "owls_eye",
    "spendable": true,
    "spCost": 0,
    "cooldown": 0,
    "requires": [],
    "description": "Добавляет 1 DEX за каждый уровень.",
    "type": "passive",
    "runtime": {
      "kind": "hunter",
      "action": "passive",
      "priority": 8,
      "range": 400
    },
    "implemented": true,
    "source": "https://irowiki.org/classic/Owl's_Eye",
    "sourceRefs": [
      "classic_skill_owls_eye"
    ],
    "iconUrl": "assets/irowiki/skills/owls_eye.png",
    "utility": false
  },
  {
    "id": "vultures_eye",
    "name": "Vulture's Eye",
    "icon": "🏹",
    "jobId": "archer",
    "maxLevel": 10,
    "stateKey": "vultures_eye",
    "spendable": true,
    "spCost": 0,
    "cooldown": 0,
    "requires": [
      {
        "skillId": "owls_eye",
        "level": 3
      }
    ],
    "description": "Увеличивает дальность лука и HIT за каждый уровень.",
    "type": "passive",
    "runtime": {
      "kind": "hunter",
      "action": "passive",
      "priority": 8,
      "range": 400
    },
    "implemented": true,
    "source": "https://irowiki.org/classic/Vulture's_Eye",
    "sourceRefs": [
      "classic_skill_vultures_eye"
    ],
    "iconUrl": "assets/irowiki/skills/vultures_eye.png",
    "utility": false
  },
  {
    "id": "arrow_crafting",
    "name": "Arrow Crafting",
    "icon": "🏹",
    "jobId": "archer",
    "maxLevel": 1,
    "stateKey": "arrow_crafting",
    "spendable": false,
    "spCost": 10,
    "cooldown": 0,
    "requires": [],
    "description": "Создание стрел из материалов. Пока стрелы не ограничены, навык хранится для будущего инвентаря.",
    "type": "active",
    "runtime": {
      "kind": "hunter",
      "action": "craft",
      "priority": 8,
      "range": 400
    },
    "implemented": false,
    "source": "https://irowiki.org/classic/Arrow_Crafting",
    "sourceRefs": [
      "classic_skill_arrow_crafting"
    ],
    "iconUrl": "assets/irowiki/skills/arrow_crafting.png",
    "utility": true,
    "quest": true
  },
  {
    "id": "arrow_repel",
    "name": "Arrow Repel",
    "icon": "🏹",
    "jobId": "archer",
    "maxLevel": 1,
    "stateKey": "arrow_repel",
    "spendable": false,
    "spCost": 15,
    "cooldown": 4,
    "requires": [],
    "description": "Выстрел с уроном 150% и сильным отбрасыванием.",
    "type": "active",
    "runtime": {
      "kind": "hunter",
      "action": "repel",
      "priority": 5,
      "range": 400
    },
    "implemented": true,
    "source": "https://irowiki.org/classic/Arrow_Repel",
    "sourceRefs": [
      "classic_skill_arrow_repel"
    ],
    "iconUrl": "assets/irowiki/skills/arrow_repel.png",
    "utility": false,
    "quest": true
  },
  {
    "id": "ankle_snare",
    "name": "Ankle Snare",
    "icon": "🪶",
    "jobId": "hunter",
    "maxLevel": 5,
    "stateKey": "ankle_snare",
    "spendable": true,
    "spCost": 12,
    "cooldown": 4,
    "requires": [
      {
        "skillId": "skid_trap",
        "level": 1
      }
    ],
    "description": "Ловушка обездвиживает цель; на боссов действует в пять раз короче.",
    "type": "active",
    "runtime": {
      "kind": "hunter",
      "action": "trap",
      "priority": 8,
      "range": 400
    },
    "implemented": true,
    "source": "https://irowiki.org/classic/Ankle_Snare",
    "sourceRefs": [
      "classic_skill_ankle_snare"
    ],
    "iconUrl": "assets/irowiki/skills/ankle_snare.png",
    "utility": false
  },
  {
    "id": "beast_bane",
    "name": "Beast Bane",
    "icon": "🪶",
    "jobId": "hunter",
    "maxLevel": 10,
    "stateKey": "beast_bane",
    "spendable": true,
    "spCost": 0,
    "cooldown": 0,
    "requires": [],
    "description": "Добавляет урон против Brute и Insect, игнорируя защиту для этой прибавки.",
    "type": "passive",
    "runtime": {
      "kind": "hunter",
      "action": "passive",
      "priority": 8,
      "range": 400
    },
    "implemented": true,
    "source": "https://irowiki.org/classic/Beast_Bane",
    "sourceRefs": [
      "classic_skill_beast_bane"
    ],
    "iconUrl": "assets/irowiki/skills/beast_bane.png",
    "utility": false
  },
  {
    "id": "blast_mine",
    "name": "Blast Mine",
    "icon": "🪶",
    "jobId": "hunter",
    "maxLevel": 5,
    "stateKey": "blast_mine",
    "spendable": true,
    "spCost": 10,
    "cooldown": 5,
    "requires": [
      {
        "skillId": "freezing_trap",
        "level": 1
      },
      {
        "skillId": "land_mine",
        "level": 1
      },
      {
        "skillId": "sandman",
        "level": 1
      }
    ],
    "description": "Взрывная ловушка с элементом Wind по небольшой области.",
    "type": "active",
    "runtime": {
      "kind": "hunter",
      "action": "trap",
      "priority": 8,
      "range": 400
    },
    "implemented": true,
    "source": "https://irowiki.org/classic/Blast_Mine",
    "sourceRefs": [
      "classic_skill_blast_mine"
    ],
    "iconUrl": "assets/irowiki/skills/blast_mine.png",
    "utility": false
  },
  {
    "id": "blitz_beat",
    "name": "Blitz Beat",
    "icon": "🪶",
    "jobId": "hunter",
    "maxLevel": 5,
    "stateKey": "blitz_beat",
    "spendable": true,
    "spCost": 10,
    "cooldown": 5,
    "requires": [
      {
        "skillId": "falconry_mastery",
        "level": 1
      }
    ],
    "description": "Сокол бьёт область, игнорируя DEF. Может срабатывать бесплатно от обычных стрел.",
    "type": "active",
    "runtime": {
      "kind": "hunter",
      "action": "falcon",
      "priority": 6,
      "range": 400
    },
    "implemented": true,
    "source": "https://irowiki.org/classic/Blitz_Beat",
    "sourceRefs": [
      "classic_skill_blitz_beat"
    ],
    "iconUrl": "assets/irowiki/skills/blitz_beat.png",
    "utility": false,
    "spCosts": [
      10,
      13,
      16,
      19,
      22
    ]
  },
  {
    "id": "claymore_trap",
    "name": "Claymore Trap",
    "icon": "🪶",
    "jobId": "hunter",
    "maxLevel": 5,
    "stateKey": "claymore_trap",
    "spendable": true,
    "spCost": 25,
    "cooldown": 6,
    "requires": [
      {
        "skillId": "blast_mine",
        "level": 1
      },
      {
        "skillId": "shockwave_trap",
        "level": 1
      }
    ],
    "description": "Огненная взрывная ловушка с большой областью поражения.",
    "type": "active",
    "runtime": {
      "kind": "hunter",
      "action": "trap",
      "priority": 8,
      "range": 400
    },
    "implemented": true,
    "source": "https://irowiki.org/classic/Claymore_Trap",
    "sourceRefs": [
      "classic_skill_claymore_trap"
    ],
    "iconUrl": "assets/irowiki/skills/claymore_trap.png",
    "utility": false
  },
  {
    "id": "detect",
    "name": "Detect",
    "icon": "🪶",
    "jobId": "hunter",
    "maxLevel": 4,
    "stateKey": "detect",
    "spendable": true,
    "spCost": 8,
    "cooldown": 4,
    "requires": [
      {
        "skillId": "improve_concentration",
        "level": 1
      },
      {
        "skillId": "falconry_mastery",
        "level": 1
      }
    ],
    "description": "Сокол раскрывает скрытые цели. SP тратится только при наличии такой цели.",
    "type": "active",
    "runtime": {
      "kind": "hunter",
      "action": "detect",
      "priority": 8,
      "range": 400
    },
    "implemented": true,
    "source": "https://irowiki.org/classic/Detect",
    "sourceRefs": [
      "classic_skill_detect"
    ],
    "iconUrl": "assets/irowiki/skills/detect.png",
    "utility": true
  },
  {
    "id": "falconry_mastery",
    "name": "Falconry Mastery",
    "icon": "🪶",
    "jobId": "hunter",
    "maxLevel": 1,
    "stateKey": "falconry_mastery",
    "spendable": true,
    "spCost": 0,
    "cooldown": 0,
    "requires": [
      {
        "skillId": "beast_bane",
        "level": 1
      }
    ],
    "description": "Открывает сокола и зависимые от него навыки.",
    "type": "passive",
    "runtime": {
      "kind": "hunter",
      "action": "passive",
      "priority": 8,
      "range": 400
    },
    "implemented": true,
    "source": "https://irowiki.org/classic/Falconry_Mastery",
    "sourceRefs": [
      "classic_skill_falconry_mastery"
    ],
    "iconUrl": "assets/irowiki/skills/falconry_mastery.png",
    "utility": false
  },
  {
    "id": "flasher",
    "name": "Flasher",
    "icon": "🪶",
    "jobId": "hunter",
    "maxLevel": 5,
    "stateKey": "flasher",
    "spendable": true,
    "spCost": 12,
    "cooldown": 5,
    "requires": [
      {
        "skillId": "skid_trap",
        "level": 1
      }
    ],
    "description": "Ловушка ослепляет обычных монстров, снижая точность.",
    "type": "active",
    "runtime": {
      "kind": "hunter",
      "action": "trap",
      "priority": 8,
      "range": 400
    },
    "implemented": true,
    "source": "https://irowiki.org/classic/Flasher",
    "sourceRefs": [
      "classic_skill_flasher"
    ],
    "iconUrl": "assets/irowiki/skills/flasher.png",
    "utility": false
  },
  {
    "id": "freezing_trap",
    "name": "Freezing Trap",
    "icon": "🪶",
    "jobId": "hunter",
    "maxLevel": 5,
    "stateKey": "freezing_trap",
    "spendable": true,
    "spCost": 10,
    "cooldown": 5,
    "requires": [
      {
        "skillId": "flasher",
        "level": 1
      }
    ],
    "description": "Водная ловушка наносит урон и замораживает обычных монстров.",
    "type": "active",
    "runtime": {
      "kind": "hunter",
      "action": "trap",
      "priority": 8,
      "range": 400
    },
    "implemented": true,
    "source": "https://irowiki.org/classic/Freezing_Trap",
    "sourceRefs": [
      "classic_skill_freezing_trap"
    ],
    "iconUrl": "assets/irowiki/skills/freezing_trap.png",
    "utility": false
  },
  {
    "id": "land_mine",
    "name": "Land Mine",
    "icon": "🪶",
    "jobId": "hunter",
    "maxLevel": 5,
    "stateKey": "land_mine",
    "spendable": true,
    "spCost": 10,
    "cooldown": 4,
    "requires": [],
    "description": "Земляная мина наносит урон и может оглушить обычную цель.",
    "type": "active",
    "runtime": {
      "kind": "hunter",
      "action": "trap",
      "priority": 8,
      "range": 400
    },
    "implemented": true,
    "source": "https://irowiki.org/classic/Land_Mine",
    "sourceRefs": [
      "classic_skill_land_mine"
    ],
    "iconUrl": "assets/irowiki/skills/land_mine.png",
    "utility": false
  },
  {
    "id": "remove_trap",
    "name": "Remove Trap",
    "icon": "🪶",
    "jobId": "hunter",
    "maxLevel": 1,
    "stateKey": "remove_trap",
    "spendable": true,
    "spCost": 5,
    "cooldown": 3,
    "requires": [
      {
        "skillId": "land_mine",
        "level": 1
      }
    ],
    "description": "Снимает свою ловушку. По умолчанию автоматическое применение выключено.",
    "type": "active",
    "runtime": {
      "kind": "hunter",
      "action": "remove",
      "priority": 8,
      "range": 400
    },
    "implemented": true,
    "source": "https://irowiki.org/classic/Remove_Trap",
    "sourceRefs": [
      "classic_skill_remove_trap"
    ],
    "iconUrl": "assets/irowiki/skills/remove_trap.png",
    "utility": true
  },
  {
    "id": "sandman",
    "name": "Sandman",
    "icon": "🪶",
    "jobId": "hunter",
    "maxLevel": 5,
    "stateKey": "sandman",
    "spendable": true,
    "spCost": 12,
    "cooldown": 5,
    "requires": [
      {
        "skillId": "flasher",
        "level": 1
      }
    ],
    "description": "Ловушка усыпляет обычных монстров до попадания по ним.",
    "type": "active",
    "runtime": {
      "kind": "hunter",
      "action": "trap",
      "priority": 8,
      "range": 400
    },
    "implemented": true,
    "source": "https://irowiki.org/classic/Sandman",
    "sourceRefs": [
      "classic_skill_sandman"
    ],
    "iconUrl": "assets/irowiki/skills/sandman.png",
    "utility": false
  },
  {
    "id": "shockwave_trap",
    "name": "Shockwave Trap",
    "icon": "🪶",
    "jobId": "hunter",
    "maxLevel": 5,
    "stateKey": "shockwave_trap",
    "spendable": true,
    "spCost": 45,
    "cooldown": 6,
    "requires": [
      {
        "skillId": "ankle_snare",
        "level": 1
      }
    ],
    "description": "Сжигает часть SP цели. На цели без SP эффекта нет.",
    "type": "active",
    "runtime": {
      "kind": "hunter",
      "action": "trap",
      "priority": 8,
      "range": 400
    },
    "implemented": true,
    "source": "https://irowiki.org/classic/Shockwave_Trap",
    "sourceRefs": [
      "classic_skill_shockwave_trap"
    ],
    "iconUrl": "assets/irowiki/skills/shockwave_trap.png",
    "utility": false
  },
  {
    "id": "skid_trap",
    "name": "Skid Trap",
    "icon": "🪶",
    "jobId": "hunter",
    "maxLevel": 5,
    "stateKey": "skid_trap",
    "spendable": true,
    "spCost": 10,
    "cooldown": 4,
    "requires": [],
    "description": "Ловушка отбрасывает обычную цель от места срабатывания.",
    "type": "active",
    "runtime": {
      "kind": "hunter",
      "action": "trap",
      "priority": 8,
      "range": 400
    },
    "implemented": true,
    "source": "https://irowiki.org/classic/Skid_Trap",
    "sourceRefs": [
      "classic_skill_skid_trap"
    ],
    "iconUrl": "assets/irowiki/skills/skid_trap.png",
    "utility": false
  },
  {
    "id": "spring_trap",
    "name": "Spring Trap",
    "icon": "🪶",
    "jobId": "hunter",
    "maxLevel": 5,
    "stateKey": "spring_trap",
    "spendable": true,
    "spCost": 10,
    "cooldown": 3,
    "requires": [
      {
        "skillId": "falconry_mastery",
        "level": 1
      },
      {
        "skillId": "remove_trap",
        "level": 1
      }
    ],
    "description": "Сокол обезвреживает вражескую ловушку, если она есть поблизости.",
    "type": "active",
    "runtime": {
      "kind": "hunter",
      "action": "spring",
      "priority": 8,
      "range": 400
    },
    "implemented": true,
    "source": "https://irowiki.org/classic/Spring_Trap",
    "sourceRefs": [
      "classic_skill_spring_trap"
    ],
    "iconUrl": "assets/irowiki/skills/spring_trap.png",
    "utility": true
  },
  {
    "id": "steel_crow",
    "name": "Steel Crow",
    "icon": "🪶",
    "jobId": "hunter",
    "maxLevel": 10,
    "stateKey": "steel_crow",
    "spendable": true,
    "spCost": 0,
    "cooldown": 0,
    "requires": [
      {
        "skillId": "blitz_beat",
        "level": 5
      }
    ],
    "description": "Добавляет 6 урона за уровень к каждому попаданию сокола.",
    "type": "passive",
    "runtime": {
      "kind": "hunter",
      "action": "passive",
      "priority": 8,
      "range": 400
    },
    "implemented": true,
    "source": "https://irowiki.org/classic/Steel_Crow",
    "sourceRefs": [
      "classic_skill_steel_crow"
    ],
    "iconUrl": "assets/irowiki/skills/steel_crow.png",
    "utility": false
  },
  {
    "id": "talkie_box",
    "name": "Talkie Box",
    "icon": "🪶",
    "jobId": "hunter",
    "maxLevel": 1,
    "stateKey": "talkie_box",
    "spendable": true,
    "spCost": 10,
    "cooldown": 15,
    "requires": [
      {
        "skillId": "remove_trap",
        "level": 1
      },
      {
        "skillId": "shockwave_trap",
        "level": 1
      }
    ],
    "description": "Ловушка-сообщение без урона. Автоматически выключена по умолчанию.",
    "type": "active",
    "runtime": {
      "kind": "hunter",
      "action": "trap",
      "priority": 8,
      "range": 400
    },
    "implemented": true,
    "source": "https://irowiki.org/classic/Talkie_Box",
    "sourceRefs": [
      "classic_skill_talkie_box"
    ],
    "iconUrl": "assets/irowiki/skills/talkie_box.png",
    "utility": true
  },
  {
    "id": "phantasmic_arrow",
    "name": "Phantasmic Arrow",
    "icon": "🪶",
    "jobId": "hunter",
    "maxLevel": 1,
    "stateKey": "phantasmic_arrow",
    "spendable": false,
    "spCost": 10,
    "cooldown": 3,
    "requires": [],
    "description": "Призрачная стрела: 150% урона и отбрасывание.",
    "type": "active",
    "runtime": {
      "kind": "hunter",
      "action": "phantasmic",
      "priority": 5,
      "range": 400
    },
    "implemented": true,
    "source": "https://irowiki.org/classic/Phantasmic_Arrow",
    "sourceRefs": [
      "classic_skill_phantasmic_arrow"
    ],
    "iconUrl": "assets/irowiki/skills/phantasmic_arrow.png",
    "utility": false,
    "quest": true
  },
  {
    "id": "beast_charge",
    "name": "Beast Charge",
    "icon": "🪶",
    "jobId": "hunter",
    "maxLevel": 1,
    "stateKey": "beast_charge",
    "spendable": false,
    "spCost": 12,
    "cooldown": 3,
    "requires": [
      {
        "skillId": "double_strafe",
        "level": 10
      },
      {
        "skillId": "beast_bane",
        "level": 10
      }
    ],
    "description": "Soul Link навык; недоступен до добавления Soul Linker.",
    "type": "active",
    "runtime": {
      "kind": "hunter",
      "action": "linked",
      "priority": 8,
      "range": 400
    },
    "implemented": false,
    "source": "https://irowiki.org/classic/Beast_Charge",
    "sourceRefs": [
      "classic_skill_beast_charge"
    ],
    "iconUrl": "assets/irowiki/skills/beast_charge.png",
    "utility": false,
    "soulLink": true
  }
];
for(const d of window.RS_HUNTER_SKILLS){
  if(['double','trap','phantasmic','spring'].includes(d.runtime.action)){d.runtime.delay='aspd';d.cooldown=0;}
  if(d.id==='arrow_shower')d.cooldown=1;
  if(['concentration','repel','detect','remove'].includes(d.runtime.action))d.cooldown=0;
  if(d.id==='blitz_beat')d.cooldown=1;
}
window.RS_SKILLS.push(...window.RS_HUNTER_SKILLS);
for(const d of window.RS_HUNTER_SKILLS)window.RS_SOURCES.records[d.sourceRefs[0]]={id:d.sourceRefs[0],type:"skill",authority:"reference",title:d.name,url:d.source};
