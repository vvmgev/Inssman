const fs = require('fs');
const archiver = require("archiver");
const { version } = require('../package.json');

const output = fs.createWriteStream(`./inssman-${version}.zip`);
const archive = archiver("zip");
output.on("close", () => archive.pointer());
archive.on("error", (err) => {throw err});
archive.pipe(output);
archive.directory('./dist', false);
archive.finalize();
