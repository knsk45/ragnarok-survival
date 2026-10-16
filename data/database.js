const progression = window.RS_PROGRESSION;

const sourceRegistry = window.RS_SOURCES || {
  schemaVersion: "1.0.0",
  policy: { priority: ["prototype"], rule: "No source registry loaded." },
  records: {},
};

window.RS_DATABASE = {
  schemaVersion: "1.0.0",
  contentVersion: 49,
  gameVersion: window.RS_VERSION,
  experience: window.RS_EXPERIENCE,
  equipment: window.RS_EQUIPMENT,
  bosses: window.RS_BOSSES,
  sourceRegistry,
  sources: {
    monsterDatabase: "https://db.irowiki.org/db/",
    classDatabase: "https://irowiki.org/wiki/Classes",
    knight: "https://irowiki.org/wiki/Knight",
    swordman: "https://irowiki.org/wiki/Swordman",
    novice: "https://irowiki.org/wiki/Novice",
  },
  settings: {
    runDuration: 20 * 60,
    experienceRates: { base: 25, job: 15 },
    infiniteSp: false,
    maxEnemies: 60,
    debugInfiniteHp: false,
    debugInfiniteSp: true,
  },
  stats: window.RS_STATS,
  jobs: window.RS_JOBS,
  characters: window.RS_CHARACTERS,
  classCatalog: window.RS_CLASS_CATALOG,
  elements: window.RS_ELEMENTS,
  progression,
  builds: window.RS_BUILDS,
  skills: window.RS_SKILLS,
  monsters: window.RS_MONSTERS,
  buffs: window.RS_BUFFS,
  items: window.RS_ITEMS,
};
