// Canonical content sources used by the data layer.
// Keep source ids stable: data records refer to them through sourceRefs.
window.RS_SOURCES = {
  schemaVersion: '1.0.0',
  policy: {
    priority: [
      'official-or-community-wiki',
      'database-record',
      'skill-simulator',
      'prototype'
    ],
    rule: 'Use the most specific source available for a record; keep prototype values explicitly marked.'
  },
  records: {
    irowiki_classes: {
      id: 'irowiki_classes', type: 'class-index', authority: 'reference',
      title: 'iRO Wiki — Classes', url: 'https://irowiki.org/wiki/Classes'
    },
    irowiki_novice: {
      id: 'irowiki_novice', type: 'job', authority: 'reference',
      title: 'iRO Wiki — Novice', url: 'https://irowiki.org/wiki/Novice'
    },
    irowiki_swordman: {
      id: 'irowiki_swordman', type: 'job', authority: 'reference',
      title: 'iRO Wiki — Swordman', url: 'https://irowiki.org/wiki/Swordman'
    },
    irowiki_knight: {
      id: 'irowiki_knight', type: 'job', authority: 'reference',
      title: 'iRO Wiki — Knight', url: 'https://irowiki.org/wiki/Knight'
    },
    oldskillsim_index: {
      id: 'oldskillsim_index', type: 'skill-simulator', authority: 'reference',
      title: 'Old iRO Wiki Skill Simulator', url: 'https://oldskillsim.irowiki.org/'
    },
    oldskillsim_knight: {
      id: 'oldskillsim_knight', type: 'skill-tree', authority: 'reference',
      title: 'Old iRO Wiki Skill Simulator — Knight', url: 'https://oldskillsim.irowiki.org/knt.html'
    },
    irowiki_monster_db: {
      id: 'irowiki_monster_db', type: 'monster-database', authority: 'reference',
      title: 'iRO Wiki Monster Database', url: 'https://db.irowiki.org/db/'
    },
    irowiki_monster_poring: {
      id: 'irowiki_monster_poring', type: 'monster', authority: 'reference',
      title: 'iRO Wiki DB — Poring', url: 'https://db.irowiki.org/db/monster-info/1002/'
    },
    irowiki_monster_lunatic: {
      id: 'irowiki_monster_lunatic', type: 'monster', authority: 'reference',
      title: 'iRO Wiki DB — Lunatic', url: 'https://db.irowiki.org/db/monster-info/1063/'
    }
  }
};
