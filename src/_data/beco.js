// BECO totals from the graph snapshot the explorer loads, read at build time so
// the page can print them before the graph arrives (see the explorer pages).
const fs = require("fs");
const path = require("path");
const totals = (dir) => JSON.parse(fs.readFileSync(path.join(__dirname, "..", "..", "assets", "data", dir, "graph.json"), "utf8")).totals;

module.exports = { en: totals("beco-graph"), es: totals("beco-graph-es") };
