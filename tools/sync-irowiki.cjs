// Maintainer import: read primary pages and download original image bytes, never repaint them.
// node tools/sync-irowiki.cjs --download > <temporary JSON manifest>
const fs = require("node:fs"),
  path = require("node:path"),
  vm = require("node:vm"),
  crypto = require("node:crypto");
const { execFile } = require("node:child_process"),
  { promisify } = require("node:util"),
  { JSDOM } = require("jsdom");
const run = promisify(execFile),
  root = path.resolve(__dirname, "..");
const context = { window: {} };
vm.createContext(context);
for (const file of ["monsters", "bosses", "skills"])
  vm.runInContext(
    fs.readFileSync(path.join(root, "data", file + ".js"), "utf8"),
    context,
  );
async function html(url) {
  const { stdout } = await run("curl", ["-fsSL", "--max-time", "40", url], {
    maxBuffer: 4000000,
  });
  const doc = new JSDOM(stdout).window.document;
  if (!doc.title.includes("Wiki") && !doc.title.includes("Database"))
    throw Error("Unexpected page: " + url);
  return doc;
}
async function parallel(items, fn, limit = 4) {
  let index = 0;
  const out = [];
  await Promise.all(
    Array.from({ length: Math.min(items.length, limit) }, async () => {
      for (;;) {
        const i = index++;
        if (i >= items.length) return;
        out[i] = await fn(items[i], i);
      }
    }),
  );
  return out;
}
const iconPages = [
  "Novice",
  "Swordman",
  "Knight",
  "Blessing",
  "Increase_AGI",
  "Magnificat",
  "Impositio_Manus",
];
(async () => {
  const docs = await parallel(iconPages, async (page) => ({
    page,
    doc: await html("https://irowiki.org/wiki/" + page),
  }));
  const skills = context.window.RS_SKILLS.map((s) => {
    const doc = docs.find(
      (v) =>
        v.page ===
        { novice: "Novice", swordman: "Swordman", knight: "Knight" }[s.jobId],
    ).doc;
    const file = s.name.replaceAll(" ", "_") + ".png";
    const img = [...doc.images].find((v) =>
      v.getAttribute("src").endsWith("/" + file),
    );
    if (!img) throw Error("Missing skill image " + s.id);
    return {
      key: s.id,
      group: "skills",
      sourceUrl: new URL(img.getAttribute("src"), "https://irowiki.org").href,
      path: "assets/irowiki/skills/" + s.id + ".png",
    };
  });
  const monsters = await parallel(
    Object.values(context.window.RS_MONSTERS),
    async (m) => {
      const sourceUrl = "https://db.irowiki.org/db/monster-info/" + m.id + "/",
        doc = await html(sourceUrl);
      if (!doc.title.toLowerCase().includes(m.name.toLowerCase()))
        throw Error("Monster name/ID mismatch: " + m.key + " " + doc.title);
      const fields = {};
      for (const cell of doc.querySelectorAll(".statTitle"))
        fields[cell.textContent.trim()] =
          cell.nextElementSibling?.querySelector(".defStat")?.textContent ||
          cell.nextElementSibling?.textContent.trim();
      for (const k of ["Level", "HP", "Attack", "Base Exp", "Job Exp"])
        if (!fields[k]) throw Error("Missing " + k + " " + m.key);
      const numbers = (value) =>
        (value.match(/[\d,.]+/g) || []).map((v) =>
          Number(v.replaceAll(",", "")),
        );
      const image = ([2192, 2208].includes(m.id) ? "https://static.divine-pride.net/images/mobs/png/" + m.id + ".png" : null) || doc
        .querySelector('[style*="image/monster/"]')
        ?.getAttribute("style")
        .match(/url\(['"]?([^)'" ]+)/)?.[1];
      if (!image) throw Error("Missing monster image " + m.key);
      return {
        key: m.key,
        id: m.id,
        group: "monsters",
        sourceUrl,
        imageSourceUrl: image,
        path: "assets/irowiki/monsters/" + m.id + ".png",
        stats: {
          level: numbers(fields.Level)[0],
          hp: numbers(fields.HP)[0],
          atkMin: numbers(fields.Attack)[0],
          atkMax: numbers(fields.Attack)[1],
          baseExp: numbers(fields["Base Exp"])[0],
          jobExp: numbers(fields["Job Exp"])[0],
          def: numbers(fields.Def)[0],
          mdef: numbers(fields.MDef)[0],
          aspd: numbers(fields.Aspd)[0],
          moveMs: numbers(fields["Move Speed"])[0],
          hit: numbers(fields["100% Hit"])[0],
          flee: numbers(fields["95% Flee"])[0],
        },
      };
    },
  );
  const buffs = docs
    .filter((v) => !["Novice", "Swordman", "Knight"].includes(v.page))
    .map(({ page, doc }) => {
      const imgs = [...doc.querySelectorAll(".mw-parser-output img")];
      const img =
        imgs.find((v) =>
          v.getAttribute("src").split("/").at(-1).startsWith("I_"),
        ) || imgs[0];
      return {
        key: {
          Blessing: "blessing",
          Increase_AGI: "increaseAgi",
          Magnificat: "magnificat",
          Impositio_Manus: "impositioManus",
        }[page],
        group: "buffs",
        sourceUrl: new URL(img.getAttribute("src"), "https://irowiki.org").href,
        path: "assets/irowiki/buffs/" + page + ".png",
      };
    });
  const itemDoc = await html("https://db.irowiki.org/db/item-info/644/");
  const itemImg = [...itemDoc.images].find((v) =>
    v.src.includes("/item/644.png"),
  );
  if (!itemImg) throw Error("Missing Gift Box");
  const items = [
    {
      key: "giftBoxPlain",
      group: "items",
      sourceUrl: itemImg.src,
      path: "assets/irowiki/items/644.png",
    },
  ];
  const files = [...monsters, ...skills, ...buffs, ...items];
  if (process.argv.includes("--download"))
    await parallel(files, async (file) => {
      const target = path.join(root, file.path);
      fs.mkdirSync(path.dirname(target), { recursive: true });
      if (!fs.existsSync(target) || process.argv.includes("--refresh"))
        await run("curl", [
          "-fsSL",
          "--max-time",
          "40",
          file.imageSourceUrl || file.sourceUrl,
          "-o",
          target,
        ]);
      const bytes = fs.readFileSync(target);
      if (bytes.subarray(0, 8).toString("hex") !== "89504e470d0a1a0a")
        throw Error("Not a PNG " + file.path);
      file.sha256 = crypto.createHash("sha256").update(bytes).digest("hex");
      file.bytes = bytes.length;
      file.width = bytes.readUInt32BE(16);
      file.height = bytes.readUInt32BE(20);
    });
  console.log(JSON.stringify({ retrieved: "2026-10-15", files }, null, 2));
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
