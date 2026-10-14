// Explicit asset provenance/status. Placeholder art must never be called an original RO sprite.
(function () {
  const records = Object.values(window.RS_MONSTERS).map((m) => ({
    id: m.key,
    path: m.visual.spriteUrl || null,
    mode:
      m.visual.renderMode ||
      (!m.visual.spriteUrl ? "embedded-png" : "local-svg"),
    facing: m.visual.facing || "left",
    anchor: { x: 0.5, y: 0.78 },
    status: ["poring", "lunatic", "poporing"].includes(m.key)
      ? "embedded-reference"
      : "prototype-art",
    sourceRefs: m.sourceRefs || [],
  }));
  window.RS_ASSETS = { schemaVersion: 1, monsters: records };
})();
