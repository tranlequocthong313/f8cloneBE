// run-seeds.js
const glob = require("glob");
const path = require("path");

glob.sync("./src/seeds/*.js").forEach((file) => {
  console.log(`Running seed: ${file}`);
  require(path.resolve(file));
});
