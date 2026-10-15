const assert = require("node:assert/strict"),
  fs = require("node:fs"),
  path = require("node:path");
const { JSDOM } = require("jsdom");
const root = path.resolve(__dirname, "..");
function boot() {
  const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
  const dom = new JSDOM(html, {
    runScripts: "outside-only",
    url: "https://example.test/?test=1",
    pretendToBeVisual: true,
  });
  const w = dom.window;
  const canvas = new Proxy(
    { measureText: (t) => ({ width: String(t).length * 8 }) },
    {
      get: (obj, key) => (key in obj ? obj[key] : () => {}),
      set: (obj, key, val) => ((obj[key] = val), true),
    },
  );
  w.HTMLCanvasElement.prototype.getContext = () => canvas;
  w.HTMLElement.prototype.getBoundingClientRect = () => ({
    x: 0,
    y: 0,
    left: 0,
    top: 0,
    width: 390,
    height: 660,
    right: 390,
    bottom: 660,
  });
  w.requestAnimationFrame = () => 1;
  const images = [];
  w.Image = class {
    constructor() {
      images.push(this);
      this.complete = false;
      this.naturalWidth = 0;
    }
  };
  for (const script of html.matchAll(/<script src="([^"?]+)[^"]*"><\/script>/g))
    w.eval(fs.readFileSync(path.join(root, script[1]), "utf8"));
  for (const script of html.matchAll(/<script>([\s\S]*?)<\/script>/g))
    w.eval(script[1]);
  assert(w.RS_TEST, "runtime booted");
  return { dom, w, g: w.RS_TEST, images, canvas };
}

module.exports={boot};
