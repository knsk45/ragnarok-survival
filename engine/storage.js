(function (root) {
  "use strict";
  const KEY = "rs.run.v2",
    ERRORS = "rs.errors.v1";
  function save(storage, snapshot) {
    try {
      storage.setItem(KEY, JSON.stringify({ ...snapshot, schema: 2 },(_,v)=>v instanceof Set?{rsSet:[...v]}:v));
      return true;
    } catch {
      return false;
    }
  }
  function read(storage) {
    try {
      const s = JSON.parse(storage.getItem(KEY),(_,v)=>v&&Array.isArray(v.rsSet)&&Object.keys(v).length===1?new Set(v.rsSet):v);
      return s?.schema === 2 ? s : null;
    } catch {
      return null;
    }
  }
  function clear(storage) {
    try {
      storage.removeItem(KEY);
    } catch {}
  }
  function log(storage, entry) {
    try {
      const entries = JSON.parse(storage.getItem(ERRORS) || "[]");
      storage.setItem(ERRORS, JSON.stringify([entry, ...entries].slice(0, 20)));
    } catch {}
  }
  const api = { save, read, clear, log };
  root.RSStorage = api;
  if (typeof module !== "undefined") module.exports = api;
})(typeof window !== "undefined" ? window : globalThis);
