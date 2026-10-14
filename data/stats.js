window.RS_STATS = {
  order: [
    { id: 'str', label: 'STR', description: 'Сила физической атаки' },
    { id: 'agi', label: 'AGI', description: 'Скорость атаки и уклонение' },
    { id: 'vit', label: 'VIT', description: 'HP, защита и восстановление' },
    { id: 'int', label: 'INT', description: 'Сила навыков и SP' },
    { id: 'dex', label: 'DEX', description: 'Точность и скорость атаки' },
    { id: 'luk', label: 'LUK', description: 'Критический удар и удача' }
  ],
  costFormula: 'floor((value - 1) / 10) + 2',
  maxValue: 99
};
