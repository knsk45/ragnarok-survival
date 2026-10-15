// Read-only comparison of the cached tables with the primary source.
const fs = require("node:fs"),
  path = require("node:path"),
  vm = require("node:vm");
const { execFileSync } = require("node:child_process"),
  { JSDOM } = require("jsdom");
function tables(page) {
  const html = execFileSync(
    "curl",
    ["-fsSL", "--max-time", "40", "https://irowiki.org/wiki/" + page],
    { encoding: "utf8", maxBuffer: 4000000 },
  );
  const d = new JSDOM(html).window.document;
  return [...d.querySelectorAll("table")].filter(
    (t) => !t.querySelector("table"),
  );
}
function values(table, cap) {
  const result = Array(cap + 1).fill(0);
  for (const row of table.rows) {
    const cells = [...row.cells].map((c) => c.textContent.trim());
    const level = Number(cells[0]);
    if (level >= 1 && level <= cap)
      result[level] =
        cells[2] === "-" ? 0 : Number(cells[2].replaceAll(",", ""));
  }
  if (result.slice(1, cap).some((v) => !Number.isInteger(v) || v <= 0))
    throw Error("Incomplete source table");
  return result;
}
const c = { window: {} };
vm.createContext(c);
vm.runInContext(
  fs.readFileSync(path.resolve(__dirname, "../data/experience.js"), "utf8"),
  c,
);
const cached = c.window.RS_EXPERIENCE,
  base = tables("Base_EXP_Chart"),
  job = tables("Job_EXP_Chart");
for (const [label, a, b] of [
  ["Base", cached.base, values(base[0], 99)],
  ["Novice", cached.jobs.Novice, values(job[0], 10)],
  ["Swordman", cached.jobs.Swordman, values(job[2], 50)],
  ["Knight", cached.jobs.Knight, values(job[4], 50)],
]) {
  if (JSON.stringify(a) !== JSON.stringify(b))
    throw Error("Source changed: " + label);
  console.log(label + ": matches iRO Wiki");
}
