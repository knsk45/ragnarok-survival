// Drop items. Keep item ids and source links stable for future loot expansion.
window.RS_ITEMS = {
  giftBoxPlain: {
    id: 644, key: 'giftBoxPlain', name: 'Gift Box (Plain)',
    source: 'https://db.irowiki.org/db/item-info/644/',
    sourceRefs: ['irowiki_item_644'], dropChance: .05,
    visual: { spriteUrl: 'https://db.irowiki.org/image/item/644.png', spriteKey: 'giftBoxPlain' },
    effects: ['blessing', 'increaseAgi', 'magnificat', 'impositioManus']
  }
};
